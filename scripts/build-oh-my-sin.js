#!/usr/bin/env node
/**
 * Build the marketplace aggregator file `templates/oh-my-sin.json`.
 *
 * Sources of truth (upstream → downstream):
 *   - `schemas/team.schema.json` defines per-team shape
 *   - `templates/teams/Team-SIN-*.json` is the SSOT for each team's manifest
 *   - `platforms/canonical-repos.json` (if present) drives repo-URL links
 *
 * Output:
 *   - `templates/oh-my-sin.json` with:
 *       $schema_version, generated_at, org, counts, tiers, teams[...]
 *
 * The file is committed into this repo (SSOT). Consumers — the marketplace
 * frontend, website-my.opensin.ai, Infra-SIN-OpenCode-Stack — either read
 * it directly from this repo or sync a mirror via the nightly GH Action
 * proposed in `governance/workflows-proposed/oh-my-sin-build.yml`.
 *
 * Zero dependencies. Usage: `node scripts/build-oh-my-sin.js`.
 */

import fs from "node:fs"
import path from "node:path"

const TEAMS_DIR = path.join("templates", "teams")
const OUTPUT = path.join("templates", "oh-my-sin.json")

function readManifests() {
  if (!fs.existsSync(TEAMS_DIR)) {
    console.error(`[oh-my-sin] ${TEAMS_DIR} missing`)
    process.exit(1)
  }
  const files = fs
    .readdirSync(TEAMS_DIR)
    .filter((f) => f.startsWith("Team-SIN-") && f.endsWith(".json"))
    .sort()
  return files.map((f) => ({
    file: f,
    data: JSON.parse(fs.readFileSync(path.join(TEAMS_DIR, f), "utf8")),
  }))
}

function pricingLabel(p) {
  if (!p) return "—"
  switch (p.model) {
    case "free-with-pro":
      return "Included with any Pro plan"
    case "monthly-addon":
      return typeof p.monthly_addon_eur === "number" ? `€${p.monthly_addon_eur}/month add-on` : "Monthly add-on"
    case "metered":
      return p.metered_unit_price_eur != null
        ? `€${p.metered_unit_price_eur} ${p.metered_unit || "per unit"}`
        : "Metered"
    case "enterprise-quote":
      return "Contact sales"
    default:
      return p.model || "—"
  }
}

function statusBadge(status) {
  return { stable: "Stable", beta: "Beta", alpha: "Alpha", "coming-soon": "Coming soon", deprecated: "Deprecated" }[
    status
  ] || status
}

function main() {
  const entries = readManifests()
  if (entries.length === 0) {
    console.error("[oh-my-sin] no manifests found")
    process.exit(1)
  }

  const teams = entries.map(({ file, data }) => {
    const agents = Array.isArray(data.agents) ? data.agents : []
    return {
      id: data.id,
      slug: data.slug,
      name: data.name,
      tagline: data.tagline || "",
      tier: data.tier,
      status: data.status,
      status_label: statusBadge(data.status),
      pricing: data.pricing || {},
      pricing_label: pricingLabel(data.pricing),
      agents: agents.map((a) => ({ id: a.id, role: a.role, summary: a.summary || "" })),
      agent_count: agents.length,
      primary_agents: agents.filter((a) => a.role === "primary").map((a) => a.id),
      permissions: Array.isArray(data.permissions) ? data.permissions : [],
      marketing: {
        summary: data.marketing?.summary || "",
        bullets: data.marketing?.bullets || [],
        screenshot: data.marketing?.screenshot || null,
        demo_video: data.marketing?.demo_video || null,
      },
      budgets: data.budgets || {},
      provenance: data.provenance || {},
      links: {
        repo: `https://github.com/OpenSIN-AI/${data.id}`,
        marketplace: `https://my.opensin.ai/marketplace/${data.slug}`,
      },
      source_file: `templates/teams/${file}`,
    }
  })

  const counts = {
    total: teams.length,
    by_tier: teams.reduce((acc, t) => ((acc[t.tier] = (acc[t.tier] || 0) + 1), acc), {}),
    by_status: teams.reduce((acc, t) => ((acc[t.status] = (acc[t.status] || 0) + 1), acc), {}),
    listable: teams.filter((t) => t.status !== "coming-soon" && t.status !== "deprecated").length,
    agents_referenced: [...new Set(teams.flatMap((t) => t.agents.map((a) => a.id)))].length,
  }

  const tiers = {
    "core-included": teams.filter((t) => t.tier === "core-included").map((t) => t.id),
    marketplace: teams.filter((t) => t.tier === "marketplace").map((t) => t.id),
    enterprise: teams.filter((t) => t.tier === "enterprise").map((t) => t.id),
  }

  const output = {
    $schema_version: "1.0.0",
    generated_at: new Date().toISOString(),
    generator: "OpenSIN-overview/scripts/build-oh-my-sin.js",
    org: "OpenSIN-AI",
    ssot: {
      schema: "schemas/team.schema.json",
      manifests_dir: "templates/teams/",
    },
    counts,
    tiers,
    teams,
  }

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true })
  fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2) + "\n")

  console.log(`[oh-my-sin] wrote ${OUTPUT}`)
  console.log(`[oh-my-sin] ${counts.total} teams — listable=${counts.listable} agents_referenced=${counts.agents_referenced}`)
  console.log(`[oh-my-sin] by_tier:`, counts.by_tier)
  console.log(`[oh-my-sin] by_status:`, counts.by_status)
}

main()
