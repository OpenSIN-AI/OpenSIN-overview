#!/usr/bin/env node
/**
 * Push team manifests from templates/teams/ into each Team-SIN-* repo.
 *
 * For each templates/teams/Team-SIN-<X>.json:
 *   1. PUT /repos/{org}/Team-SIN-<X>/contents/team.json   (create or update)
 *   2. PUT /repos/{org}/Team-SIN-<X>/contents/README.md   (only if no README exists yet)
 *
 * Idempotent: if team.json already exists with the same content, skips.
 * Uses gh CLI so auth comes from the caller environment.
 *
 * Usage:
 *   node scripts/push-team-manifests.js         # real push
 *   node scripts/push-team-manifests.js --dry   # show what would change
 */

import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import crypto from "node:crypto"

const ORG = "OpenSIN-AI"
const DRY = process.argv.includes("--dry")
const SRC_DIR = "templates/teams"

function gh(args, { input } = {}) {
  try {
    const opts = { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 }
    if (input !== undefined) opts.input = input
    return execFileSync("gh", args, opts)
  } catch (e) {
    const stderr = e.stderr?.toString?.() || ""
    const stdout = e.stdout?.toString?.() || ""
    throw new Error(`gh ${args.join(" ")} failed:\n${stderr || stdout || e.message}`)
  }
}

function b64(s) {
  return Buffer.from(s, "utf8").toString("base64")
}

function getExistingFile(repo, filePath) {
  try {
    const res = gh(["api", `repos/${ORG}/${repo}/contents/${filePath}`])
    return JSON.parse(res)
  } catch (e) {
    if (e.message.includes("404")) return null
    throw e
  }
}

function putFile(repo, filePath, content, message, sha = null) {
  const payload = { message, content: b64(content) }
  if (sha) payload.sha = sha
  const args = ["api", "--method", "PUT", `repos/${ORG}/${repo}/contents/${filePath}`, "--input", "-"]
  return JSON.parse(gh(args, { input: JSON.stringify(payload) }))
}

function readmeHeader(manifest) {
  const bullets = manifest.marketing.bullets.map((b) => `- ${b}`).join("\n")
  const agents = manifest.agents
    .map(
      (a) =>
        `- **${a.id}** — ${a.role}${a.summary ? ": " + a.summary : ""}`,
    )
    .join("\n")
  const priceLine =
    manifest.pricing.model === "monthly-addon"
      ? `**Price:** €${manifest.pricing.monthly_addon_eur}/mo (addon on top of My.OpenSIN Pro)`
      : manifest.pricing.model === "free-with-pro"
        ? "**Price:** included in every My.OpenSIN Pro plan"
        : manifest.pricing.model === "enterprise-quote"
          ? "**Price:** contact sales (enterprise quote)"
          : `**Price model:** ${manifest.pricing.model}`
  return `# ${manifest.name}

> **${manifest.tagline || ""}**

${priceLine}

**Status:** \`${manifest.status}\`
**Tier:** \`${manifest.tier}\`
**Slug (marketplace URL):** \`my.opensin.ai/marketplace/${manifest.slug}\`

## What it does

${manifest.marketing.summary}

## Highlights

${bullets}

## Agents

${agents || "_(no agents assigned yet — status: coming-soon)_"}

## How this repo works

This is a **marketplace manifest repo**, not a code package. The source of truth for \`team.json\` lives in [\`OpenSIN-AI/OpenSIN-overview/templates/teams/${manifest.id}.json\`](https://github.com/OpenSIN-AI/OpenSIN-overview/blob/main/templates/teams/${manifest.id}.json).

To change this team:
1. PR against [\`OpenSIN-AI/OpenSIN-overview\`](https://github.com/OpenSIN-AI/OpenSIN-overview) editing \`templates/teams/${manifest.id}.json\`.
2. After merge, a maintainer runs \`scripts/push-team-manifests.js\` which updates the \`team.json\` in this repo.

Do **not** edit \`team.json\` directly in this repo — it will be overwritten on the next sync.

## See also

- [OpenSIN-overview START-HERE.md](https://github.com/OpenSIN-AI/OpenSIN-overview/blob/main/START-HERE.md)
- [PRODUCT-VISION.md](https://github.com/OpenSIN-AI/OpenSIN-overview/blob/main/PRODUCT-VISION.md)
- [schemas/team.schema.json](https://github.com/OpenSIN-AI/OpenSIN-overview/blob/main/schemas/team.schema.json)
`
}

async function main() {
  const files = fs.readdirSync(SRC_DIR).filter((f) => f.startsWith("Team-SIN-") && f.endsWith(".json"))
  if (files.length === 0) throw new Error(`no team manifests found in ${SRC_DIR}`)

  const report = { pushed: [], skipped: [], readmes: [], errors: [] }

  for (const file of files) {
    const manifestPath = path.join(SRC_DIR, file)
    const raw = fs.readFileSync(manifestPath, "utf8")
    const manifest = JSON.parse(raw)
    const repo = manifest.id

    // 1. team.json
    try {
      const existing = getExistingFile(repo, "team.json")
      const existingContent = existing
        ? Buffer.from(existing.content, "base64").toString("utf8")
        : null
      const existingHash = existingContent
        ? crypto.createHash("sha256").update(existingContent).digest("hex")
        : null
      const newHash = crypto.createHash("sha256").update(raw).digest("hex")

      if (existingHash === newHash) {
        report.skipped.push(`${repo}/team.json (identical)`)
      } else if (DRY) {
        report.pushed.push(`${repo}/team.json (DRY — would ${existing ? "update" : "create"})`)
      } else {
        putFile(
          repo,
          "team.json",
          raw,
          `chore(manifest): sync team.json from OpenSIN-overview (${manifest.status})`,
          existing?.sha,
        )
        report.pushed.push(`${repo}/team.json (${existing ? "updated" : "created"})`)
      }
    } catch (e) {
      report.errors.push(`${repo}/team.json: ${e.message.slice(0, 200)}`)
      continue
    }

    // 2. README header — only if README is missing or obviously scaffold
    try {
      const existing = getExistingFile(repo, "README.md")
      const existingContent = existing
        ? Buffer.from(existing.content, "base64").toString("utf8")
        : ""
      const shouldWriteReadme =
        !existing ||
        existingContent.trim().length < 80 ||
        /^#\s*team-sin-/i.test(existingContent.trim()) ||
        existingContent.includes("No description, website, or topics provided.")
      if (shouldWriteReadme) {
        const md = readmeHeader(manifest)
        if (DRY) {
          report.readmes.push(`${repo}/README.md (DRY — would ${existing ? "replace scaffold README" : "create"})`)
        } else {
          putFile(
            repo,
            "README.md",
            md,
            `docs: seed marketplace README from manifest`,
            existing?.sha,
          )
          report.readmes.push(`${repo}/README.md (${existing ? "replaced scaffold" : "created"})`)
        }
      } else {
        report.skipped.push(`${repo}/README.md (non-trivial README already present)`)
      }
    } catch (e) {
      report.errors.push(`${repo}/README.md: ${e.message.slice(0, 200)}`)
    }
  }

  console.log("\n=== push-team-manifests report ===")
  console.log(`Pushed:  ${report.pushed.length}`)
  report.pushed.forEach((x) => console.log(`  ${x}`))
  console.log(`Readmes: ${report.readmes.length}`)
  report.readmes.forEach((x) => console.log(`  ${x}`))
  console.log(`Skipped: ${report.skipped.length}`)
  report.skipped.forEach((x) => console.log(`  ${x}`))
  if (report.errors.length) {
    console.log(`Errors:  ${report.errors.length}`)
    report.errors.forEach((x) => console.log(`  ${x}`))
    process.exit(1)
  }
}

main().catch((e) => {
  console.error(e.message || e)
  process.exit(1)
})
