#!/usr/bin/env node
/**
 * validate-codeowners.js — fail if .github/CODEOWNERS references a GitHub
 * Team that does not exist in OpenSIN-AI/.
 *
 * GitHub silently ignores unknown team owners instead of raising an error, so
 * CODEOWNERS drift is invisible until a real incident. This script makes that
 * class of bug shallow — runs in CI on every PR.
 *
 * Usage:
 *   GITHUB_TOKEN=ghp_xxx node scripts/validate-codeowners.js
 *   GITHUB_TOKEN=ghp_xxx node scripts/validate-codeowners.js --json
 *
 * Exit 0 = clean, 1 = drift, 2 = usage error.
 */

import fs from "node:fs"
import path from "node:path"
import process from "node:process"

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..")
const ORG = "OpenSIN-AI"
const FILE = path.join(ROOT, ".github/CODEOWNERS")

const asJson = process.argv.includes("--json")

const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN
if (!TOKEN) {
  console.error(
    "FATAL: GITHUB_TOKEN missing. Cannot enumerate org teams without auth. Set GITHUB_TOKEN (scope: read:org).",
  )
  process.exit(2)
}

if (!fs.existsSync(FILE)) {
  console.log(`[codeowners] no file at ${path.relative(ROOT, FILE)} — nothing to validate`)
  process.exit(0)
}

async function gh(p) {
  const r = await fetch(`https://api.github.com${p}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "opensin-validate-codeowners",
    },
  })
  if (!r.ok) throw new Error(`GitHub ${p} -> ${r.status} ${r.statusText}`)
  return r.json()
}

async function listTeams() {
  const out = []
  for (let page = 1; page < 10; page++) {
    const part = await gh(`/orgs/${ORG}/teams?per_page=100&page=${page}`)
    if (!Array.isArray(part) || part.length === 0) break
    out.push(...part)
    if (part.length < 100) break
  }
  return out
}

async function userExists(login) {
  try {
    const r = await fetch(`https://api.github.com/users/${encodeURIComponent(login)}`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "opensin-validate-codeowners",
      },
    })
    return r.status === 200
  } catch {
    return false
  }
}

const TEAM_RE = /@OpenSIN-AI\/([A-Za-z0-9._-]+)/g
const USER_RE = /(?:^|\s)@([A-Za-z0-9-]{1,39})(?!\/)(?=\s|$)/g

const lines = fs.readFileSync(FILE, "utf8").split("\n")
const teamRefs = new Map() // slug -> [lineNumbers]
const userRefs = new Map() // login -> [lineNumbers]

lines.forEach((raw, i) => {
  const line = raw.trim()
  if (!line || line.startsWith("#")) return
  for (const m of raw.matchAll(TEAM_RE)) {
    const s = m[1].replace(/[.,):'"`>\]]+$/, "")
    if (!teamRefs.has(s)) teamRefs.set(s, [])
    teamRefs.get(s).push(i + 1)
  }
  for (const m of raw.matchAll(USER_RE)) {
    const login = m[1]
    // Skip team-style handles (these have '/' captured above)
    if (!userRefs.has(login)) userRefs.set(login, [])
    userRefs.get(login).push(i + 1)
  }
})

const teams = await listTeams()
const liveTeamSlugs = new Set(teams.map((t) => t.slug))

const missingTeams = [...teamRefs].filter(([slug]) => !liveTeamSlugs.has(slug))

// Verify each individual user handle resolves (best-effort, rate-limit-bounded)
const missingUsers = []
for (const [login, lns] of userRefs) {
  // Skip the common bot patterns and obvious non-handles
  if (login.includes("/")) continue
  const ok = await userExists(login)
  if (!ok) missingUsers.push([login, lns])
}

const result = {
  ok: missingTeams.length === 0 && missingUsers.length === 0,
  team_refs_total: teamRefs.size,
  user_refs_total: userRefs.size,
  live_teams: [...liveTeamSlugs].sort(),
  missing_teams: missingTeams.map(([slug, lines]) => ({ slug, lines })),
  missing_users: missingUsers.map(([login, lines]) => ({ login, lines })),
}

if (asJson) {
  process.stdout.write(JSON.stringify(result, null, 2) + "\n")
  process.exit(result.ok ? 0 : 1)
}

if (result.ok) {
  console.log(
    `[codeowners] OK — ${teamRefs.size} team ref(s) and ${userRefs.size} user ref(s) all resolve.`,
  )
  process.exit(0)
}

if (missingTeams.length) {
  console.log(`[codeowners] FAIL — ${missingTeams.length} unknown team slug(s):`)
  for (const { slug, lines } of result.missing_teams) {
    console.log(`  @${ORG}/${slug}   (lines: ${lines.join(", ")})`)
  }
  console.log("")
  console.log(`  Real teams in ${ORG}/ right now:`)
  for (const s of result.live_teams) console.log(`    @${ORG}/${s}`)
  console.log("")
  console.log(
    `  Fix: either rewrite CODEOWNERS to reference a real team, or have an org admin create the team first.`,
  )
}

if (missingUsers.length) {
  console.log("")
  console.log(`[codeowners] FAIL — ${missingUsers.length} unknown user handle(s):`)
  for (const { login, lines } of result.missing_users) {
    console.log(`  @${login}   (lines: ${lines.join(", ")})`)
  }
}

process.exit(1)
