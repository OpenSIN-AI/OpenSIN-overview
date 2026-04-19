#!/usr/bin/env node
/**
 * OpenSIN-AI master index generator.
 *
 * Single Source of Truth for registry/MASTER_INDEX.md.
 * Reads the live repo list from GitHub via `gh repo list`, groups by naming
 * convention, and writes a deterministic Markdown table.
 *
 * This replaces hand-editing MASTER_INDEX.md. Re-run whenever the org changes:
 *
 *   node scripts/generate-master-index.js
 *
 * Requires: gh CLI authenticated with read access to OpenSIN-AI.
 */

import { execSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"

const ORG = "OpenSIN-AI"
const OUT = "registry/MASTER_INDEX.md"

function sh(cmd) {
  return execSync(cmd, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 })
}

function listRepos() {
  const raw = sh(
    `gh repo list ${ORG} --limit 400 --json name,description,visibility,isArchived,diskUsage,pushedAt,primaryLanguage`,
  )
  return JSON.parse(raw)
}

/**
 * Grouping strategy: by canonical naming convention, then alphabetical within
 * group. Sections intentionally match the buckets used elsewhere in governance
 * docs (CANONICAL-REPOS.md, STATE-OF-THE-UNION.md).
 */
function sectionOf(name) {
  // Canonical kern repos (no prefix) — flagship products.
  const flagships = new Set([
    "OpenSIN",
    "OpenSIN-Code",
    "OpenSIN-backend",
    "OpenSIN-WebApp",
    "OpenSIN-documentation",
    "OpenSIN-overview",
    "OpenSIN-Skills",
    "OpenSIN-Bridge",
    "OpenSIN-Neural-Bus",
    "awesome-opensin",
  ])
  if (flagships.has(name)) return { order: 1, title: "1. Canonical Flagships" }

  if (name.startsWith("Team-SIN-")) return { order: 2, title: "2. Team-SIN-* (Marketplace Manifests)" }

  if (name.startsWith("A2A-SIN-Apple-")) return { order: 3, title: "3. A2A Apple Integration Agents" }
  if (name.startsWith("A2A-SIN-Security-")) return { order: 4, title: "4. A2A Security Agents" }
  if (name.startsWith("A2A-SIN-Code-")) return { order: 5, title: "5. A2A Code Agents" }
  if (name.startsWith("A2A-SIN-Worker-")) return { order: 6, title: "6. A2A Worker Agents" }
  if (name.startsWith("A2A-SIN-Team-")) return { order: 7, title: "7. A2A Team Agents (Legacy)" }
  if (name.startsWith("A2A-SIN-Shop-")) return { order: 8, title: "8. A2A Shop Agents" }
  if (name.startsWith("A2A-SIN-")) return { order: 9, title: "9. A2A Platform Integration Agents" }

  if (name.startsWith("Biz-SIN-")) return { order: 10, title: "10. Biz-SIN-* (Business Ops)" }
  if (name.startsWith("Infra-SIN-")) return { order: 11, title: "11. Infra-SIN-* (Infrastructure)" }
  if (name.startsWith("Template-SIN-") || name.startsWith("Template-A2A-"))
    return { order: 12, title: "12. Template-SIN-* (Scaffolding)" }
  if (name.startsWith("MCP-SIN-")) return { order: 13, title: "13. MCP-SIN-* (MCP Servers)" }
  if (name.startsWith("Skill-SIN-")) return { order: 14, title: "14. Skill-SIN-* (Composable Skills)" }
  if (name.startsWith("Plugin-SIN-")) return { order: 15, title: "15. Plugin-SIN-* (Plugins)" }
  if (name.startsWith("Core-SIN-")) return { order: 16, title: "16. Core-SIN-* (Legacy Control-Plane)" }
  if (name.startsWith("SIN-")) return { order: 17, title: "17. SIN-* (Misc SIN)" }
  if (name.startsWith("website-")) return { order: 18, title: "18. Websites" }
  if (name.startsWith("opensin_") || name.startsWith("opensin-"))
    return { order: 19, title: "19. opensin-* / opensin_* (Packages + Rationalization-Pending)" }
  return { order: 99, title: "99. Other / Meta" }
}

function visIcon(vis) {
  return vis === "PUBLIC" ? "Public" : "Private"
}

function row(repo) {
  const desc = (repo.description || "—").replace(/\|/g, "\\|").replace(/\n/g, " ")
  const archTag = repo.isArchived ? "**ARCHIVED** · " : ""
  const url = `https://github.com/${ORG}/${repo.name}`
  return `| [${repo.name}](${url}) | ${visIcon(repo.visibility)} | ${archTag}${desc} |`
}

function countsByPrefix(repos) {
  const live = repos.filter((r) => !r.isArchived)
  return {
    total: repos.length,
    live: live.length,
    archived: repos.length - live.length,
    a2a: live.filter((r) => r.name.startsWith("A2A-SIN-")).length,
    team: live.filter((r) => r.name.startsWith("Team-SIN-")).length,
    biz: live.filter((r) => r.name.startsWith("Biz-SIN-")).length,
    infra: live.filter((r) => r.name.startsWith("Infra-SIN-")).length,
    mcp: live.filter((r) => r.name.startsWith("MCP-SIN-")).length,
    skill: live.filter((r) => r.name.startsWith("Skill-SIN-")).length,
    plugin: live.filter((r) => r.name.startsWith("Plugin-SIN-")).length,
    template: live.filter((r) => r.name.startsWith("Template-")).length,
    website: live.filter((r) => r.name.startsWith("website-")).length,
  }
}

function main() {
  const repos = listRepos()
  const now = new Date().toISOString().split("T")[0]
  const counts = countsByPrefix(repos)

  const sectionsMap = new Map()
  for (const r of repos) {
    const s = sectionOf(r.name)
    if (!sectionsMap.has(s.order)) sectionsMap.set(s.order, { title: s.title, repos: [] })
    sectionsMap.get(s.order).repos.push(r)
  }

  const sections = [...sectionsMap.entries()].sort(([a], [b]) => a - b).map(([, v]) => v)

  const lines = []
  lines.push(`# Master Index — OpenSIN-AI`)
  lines.push("")
  lines.push(`**Generated:** ${now} via \`scripts/generate-master-index.js\``)
  lines.push(`**Total repos:** ${counts.total} (live ${counts.live} · archived ${counts.archived})`)
  lines.push("")
  lines.push(
    `This file is **auto-generated**. Do not edit by hand — re-run the generator and commit the result. Live source of truth is \`gh repo list OpenSIN-AI\`.`,
  )
  lines.push("")
  lines.push(`## Counts by namespace (live only)`)
  lines.push("")
  lines.push("| Namespace | Count |")
  lines.push("|---|---:|")
  lines.push(`| \`A2A-SIN-*\` | ${counts.a2a} |`)
  lines.push(`| \`Team-SIN-*\` | ${counts.team} |`)
  lines.push(`| \`Biz-SIN-*\` | ${counts.biz} |`)
  lines.push(`| \`Infra-SIN-*\` | ${counts.infra} |`)
  lines.push(`| \`MCP-SIN-*\` | ${counts.mcp} |`)
  lines.push(`| \`Skill-SIN-*\` | ${counts.skill} |`)
  lines.push(`| \`Plugin-SIN-*\` | ${counts.plugin} |`)
  lines.push(`| \`Template-*\` | ${counts.template} |`)
  lines.push(`| \`website-*\` | ${counts.website} |`)
  lines.push("")
  lines.push("---")
  lines.push("")

  for (const s of sections) {
    lines.push(`## ${s.title} (${s.repos.length})`)
    lines.push("")
    lines.push("| Repository | Visibility | Description |")
    lines.push("|---|---|---|")
    s.repos.sort((a, b) => a.name.localeCompare(b.name))
    for (const r of s.repos) lines.push(row(r))
    lines.push("")
  }

  lines.push("---")
  lines.push("")
  lines.push(
    `Auto-generated. Cross-references: [STATE-OF-THE-UNION](../STATE-OF-THE-UNION.md) · [CANONICAL-REPOS](../docs/CANONICAL-REPOS.md) · [SCAFFOLD_AUDIT](./SCAFFOLD_AUDIT.md) · [DEPLOYMENT_STATUS](./DEPLOYMENT_STATUS.md) · [LAUNCH-CHECKLIST](../LAUNCH-CHECKLIST.md).`,
  )

  fs.mkdirSync(path.dirname(OUT), { recursive: true })
  fs.writeFileSync(OUT, lines.join("\n") + "\n")
  console.log(`[master-index] wrote ${OUT}`)
  console.log(`[master-index] total=${counts.total} live=${counts.live} archived=${counts.archived}`)
}

main()
