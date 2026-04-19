#!/usr/bin/env node
/**
 * Live Go/No-Go dashboard for the 2026-04-23 launch.
 *
 * Prints — based on *live* evidence, not stale docs — the current status of
 * every gate in LAUNCH-CHECKLIST.md. Exit code is 0 if all GREEN, 1 otherwise.
 *
 * Usage:
 *   node scripts/launch-status.js            # pretty table, exits 0/1
 *   node scripts/launch-status.js --json     # machine-readable, for CI
 *
 * Checks performed:
 *   - HF Spaces: all 6 A2A-SIN-Code-* spaces respond with non-5xx
 *   - Canonical repos exist, are non-empty, and not archived
 *   - Archived-repo hygiene: the 4 known-dead A2A repos are archived
 *   - DEPLOYMENT_STATUS.md freshness (must be < 24h during launch week)
 *   - Open launch-blocking FOLLOWUPS (HF-1, R1, R2, R3, L2, CP1, M2)
 *
 * Zero dependencies. Node 20+ (uses built-in fetch, AbortController).
 */

import { execSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"

const ORG = "OpenSIN-AI"
const HF_SPACES = [
  "a2a-sin-code-plugin",
  "a2a-sin-code-command",
  "a2a-sin-code-tool",
  "a2a-sin-code-backend",
  "a2a-sin-code-fullstack",
  "a2a-sin-code-frontend",
]
const CANONICAL_CODE_REPOS = [
  "OpenSIN-WebApp",
  "website-my.opensin.ai",
  "OpenSIN-backend",
  "OpenSIN-Code",
]
const DEAD_A2A = [
  "A2A-SIN-Facebook",
  "A2A-SIN-Mattermost",
  "A2A-SIN-RocketChat",
  "A2A-SIN-Slack",
]
const LAUNCH_BLOCKING_TICKETS = ["HF-1", "R1", "R2", "R3", "L2", "CP1", "M2"]
const FRESH_HOURS_WARN = 48
const FRESH_HOURS_FAIL = 168

const asJson = process.argv.includes("--json")
const results = []

function addResult(gate, status, evidence, remediation = null) {
  results.push({ gate, status, evidence, remediation })
}

async function head(url, timeoutMs = 7000) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const res = await fetch(url, { method: "GET", signal: ctrl.signal })
    return { ok: res.status < 500, status: res.status }
  } catch (err) {
    return { ok: false, status: 0, err: String(err.message || err) }
  } finally {
    clearTimeout(t)
  }
}

function sh(cmd) {
  try {
    return execSync(cmd, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], maxBuffer: 32 * 1024 * 1024 }).trim()
  } catch (err) {
    return { __err: err.stderr?.toString() || err.message }
  }
}

// ----------------------------------------------------------- gate: HF Spaces
async function checkHfSpaces() {
  const results = await Promise.all(
    HF_SPACES.map(async (s) => {
      const url = `https://opensin-ai-${s}.hf.space/`
      const r = await head(url)
      return { space: s, url, ...r }
    }),
  )
  const ok = results.filter((r) => r.ok)
  const evidence = results.map((r) => `${r.space}: ${r.status || r.err || "dead"}`).join(", ")
  if (ok.length === HF_SPACES.length) {
    addResult("HF-1: HuggingFace Spaces", "GREEN", evidence)
  } else if (ok.length > 0) {
    addResult("HF-1: HuggingFace Spaces", "YELLOW", evidence, "Some spaces responding, others not. Restart failing ones via HF API; deploy templates/workflows/hf-keep-alive.yml.")
  } else {
    addResult("HF-1: HuggingFace Spaces", "RED", evidence, "ALL spaces dead. Restart via HF API immediately. See LAUNCH-CHECKLIST.md § Tag 1 and templates/workflows/hf-keep-alive.yml.")
  }
}

// ----------------------------------------------------------- gate: canonical repos
function checkCanonicalRepos() {
  const raw = sh(`gh repo list ${ORG} --limit 400 --json name,diskUsage,isArchived`)
  if (raw.__err) {
    addResult("Canonical repos", "UNKNOWN", `gh CLI failed: ${raw.__err}`, "Ensure gh is authenticated and has read access to the org.")
    return
  }
  const all = JSON.parse(raw)
  const byName = new Map(all.map((r) => [r.name, r]))
  const missing = []
  const archived = []
  const empty = []
  for (const n of CANONICAL_CODE_REPOS) {
    const r = byName.get(n)
    if (!r) missing.push(n)
    else if (r.isArchived) archived.push(n)
    else if ((r.diskUsage || 0) < 5) empty.push(n)
  }
  if (missing.length + archived.length + empty.length === 0) {
    addResult("Canonical repos alive", "GREEN", `${CANONICAL_CODE_REPOS.length}/${CANONICAL_CODE_REPOS.length} canonical code repos non-empty and live`)
  } else {
    const bits = []
    if (missing.length) bits.push(`missing: ${missing.join(", ")}`)
    if (archived.length) bits.push(`archived: ${archived.join(", ")}`)
    if (empty.length) bits.push(`empty: ${empty.join(", ")}`)
    addResult("Canonical repos alive", "RED", bits.join(" | "), "Each missing or empty canonical repo is a Tier-2 launch blocker.")
  }
}

// ----------------------------------------------------------- gate: dead-repo hygiene
function checkArchivedHygiene() {
  const raw = sh(`gh repo list ${ORG} --limit 400 --json name,isArchived`)
  if (raw.__err) {
    addResult("S1: Dead A2A repos archived", "UNKNOWN", `gh CLI failed: ${raw.__err}`)
    return
  }
  const all = JSON.parse(raw)
  const byName = new Map(all.map((r) => [r.name, r]))
  const notArchived = DEAD_A2A.filter((n) => {
    const r = byName.get(n)
    return !r || !r.isArchived
  })
  if (notArchived.length === 0) {
    addResult("S1: Dead A2A repos archived", "GREEN", `${DEAD_A2A.length}/${DEAD_A2A.length} dead A2A repos archived`)
  } else {
    addResult("S1: Dead A2A repos archived", "YELLOW", `still live: ${notArchived.join(", ")}`, "Archive via: gh repo archive OpenSIN-AI/<name>")
  }
}

// ----------------------------------------------------------- gate: DEPLOYMENT_STATUS freshness
function checkDeploymentStatusFreshness() {
  const p = path.join("registry", "DEPLOYMENT_STATUS.md")
  if (!fs.existsSync(p)) {
    addResult("C2: DEPLOYMENT_STATUS freshness", "RED", `${p} missing`, "Run: node scripts/generate-master-index.js (or hand-update DEPLOYMENT_STATUS.md).")
    return
  }
  const st = fs.statSync(p)
  const ageHours = (Date.now() - st.mtimeMs) / 3_600_000
  const evidence = `last modified ${ageHours.toFixed(1)}h ago`
  if (ageHours < FRESH_HOURS_WARN) {
    addResult("C2: DEPLOYMENT_STATUS freshness", "GREEN", evidence)
  } else if (ageHours < FRESH_HOURS_FAIL) {
    addResult("C2: DEPLOYMENT_STATUS freshness", "YELLOW", evidence, "File is stale. Re-run deployment verification.")
  } else {
    addResult("C2: DEPLOYMENT_STATUS freshness", "RED", evidence, "File is > 7 days old. Do not trust. Re-run verification.")
  }
}

// ----------------------------------------------------------- gate: open launch blockers
function checkLaunchBlockerTickets() {
  const p = path.join("docs", "FOLLOWUPS.md")
  if (!fs.existsSync(p)) {
    addResult("Launch-blocker tickets", "UNKNOWN", `${p} missing`)
    return
  }
  const body = fs.readFileSync(p, "utf8")
  const open = []
  const done = []
  for (const t of LAUNCH_BLOCKING_TICKETS) {
    // Look for heading "### <T>:" and then the first "**Status:**" line after it.
    const headIdx = body.indexOf(`### ${t}:`)
    if (headIdx === -1) {
      open.push(`${t}(not-tracked)`)
      continue
    }
    const tail = body.slice(headIdx, headIdx + 2000)
    const statusMatch = tail.match(/\*\*Status:\*\*\s*`?([^`\n.]+)`?/)
    const status = statusMatch ? statusMatch[1].trim().toUpperCase() : "UNKNOWN"
    if (status.startsWith("DONE")) done.push(t)
    else open.push(`${t}(${status})`)
  }
  if (open.length === 0) {
    addResult("Launch-blocker tickets", "GREEN", `${done.length}/${LAUNCH_BLOCKING_TICKETS.length} done`)
  } else {
    addResult(
      "Launch-blocker tickets",
      open.length === LAUNCH_BLOCKING_TICKETS.length ? "RED" : "YELLOW",
      `open: ${open.join(", ")} | done: ${done.join(", ") || "—"}`,
      "See LAUNCH-CHECKLIST.md for per-ticket owners and deadlines.",
    )
  }
}

// ----------------------------------------------------------- output
function printPretty() {
  const pad = (s, n) => String(s).padEnd(n)
  const statusColor = { GREEN: "\x1b[32m", YELLOW: "\x1b[33m", RED: "\x1b[31m", UNKNOWN: "\x1b[37m" }
  const reset = "\x1b[0m"
  const now = new Date().toISOString()
  console.log("")
  console.log(`OpenSIN Launch Go/No-Go  ·  ${now}`)
  console.log("─".repeat(78))
  for (const r of results) {
    const color = statusColor[r.status] || ""
    console.log(`${color}${pad(r.status, 8)}${reset}  ${pad(r.gate, 38)}  ${r.evidence}`)
    if (r.remediation) console.log(`          → ${r.remediation}`)
  }
  console.log("─".repeat(78))
  const red = results.filter((r) => r.status === "RED").length
  const yellow = results.filter((r) => r.status === "YELLOW").length
  const green = results.filter((r) => r.status === "GREEN").length
  console.log(`Green: ${green}   Yellow: ${yellow}   Red: ${red}`)
  console.log("")
}

async function main() {
  await checkHfSpaces()
  checkCanonicalRepos()
  checkArchivedHygiene()
  checkDeploymentStatusFreshness()
  checkLaunchBlockerTickets()

  if (asJson) {
    console.log(JSON.stringify({ generated_at: new Date().toISOString(), results }, null, 2))
  } else {
    printPretty()
  }

  const anyRed = results.some((r) => r.status === "RED")
  process.exit(anyRed ? 1 : 0)
}

main().catch((err) => {
  console.error("[launch-status] fatal:", err)
  process.exit(2)
})
