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
import { execSync } from "node:child_process"

const TEAMS_DIR = path.join("templates", "teams")
const OUTPUT = path.join("templates", "oh-my-sin.json")
const ORG = "OpenSIN-AI"

/**
 * Resolve which agent IDs have a backing repo in the org.
 *
 * We cannot let the marketplace render a "buy" card for a Team-SIN-X agent
 * whose A2A-SIN-* repo does not exist — see MAN-1 in docs/FOLLOWUPS.md.
 *
 * If `gh` CLI is unavailable we mark every agent as `repo_exists: null`
 * (unknown) and the consumer renders the agent as-is. A nightly CI job
 * always runs with `gh` available, so the committed file is authoritative.
 */
function loadRepoCatalog() {
  try {
    const raw = execSync(`gh repo list ${ORG} --limit 400 --json name,isArchived`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    })
    const all = JSON.parse(raw)
    return {
      available: true,
      live: new Set(all.filter((r) => !r.isArchived).map((r) => r.name)),
      archived: new Set(all.filter((r) => r.isArchived).map((r) => r.name)),
    }
  } catch {
    return { available: false, live: new Set(), archived: new Set() }
  }
}

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

  const repos = loadRepoCatalog()

  const teams = entries.map(({ file, data }) => {
    const agentsIn = Array.isArray(data.agents) ? data.agents : []
    const agents = agentsIn.map((a) => {
      let repoExists = null // unknown
      if (repos.available) {
        repoExists = repos.live.has(a.id) ? true : repos.archived.has(a.id) ? false : false
      }
      return {
        id: a.id,
        role: a.role,
        summary: a.summary || "",
        repo_exists: repoExists,
      }
    })
    const liveAgentCount = agents.filter((a) => a.repo_exists === true).length
    const phantomAgentCount = agents.filter((a) => a.repo_exists === false).length

    // Wave-MAN-1 contract: a team whose every agent is a phantom is forced
    // to status: "coming-soon" so the marketplace UI hides its buy-button.
    let effectiveStatus = data.status
    let coercedReason = null
    if (repos.available && agents.length > 0 && liveAgentCount === 0 && data.status !== "coming-soon" && data.status !== "deprecated") {
      effectiveStatus = "coming-soon"
      coercedReason = "all-agents-phantom"
    }

    return {
      id: data.id,
      slug: data.slug,
      name: data.name,
      tagline: data.tagline || "",
      tier: data.tier,
      status: effectiveStatus,
      status_label: statusBadge(effectiveStatus),
      status_declared: data.status,
      status_coerced_reason: coercedReason,
      pricing: data.pricing || {},
      pricing_label: pricingLabel(data.pricing),
      agents,
      agent_count: agents.length,
      live_agent_count: liveAgentCount,
      phantom_agent_count: phantomAgentCount,
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

  const totalAgents = teams.reduce((s, t) => s + t.agent_count, 0)
  const totalLiveAgents = teams.reduce((s, t) => s + t.live_agent_count, 0)
  const totalPhantomAgents = teams.reduce((s, t) => s + t.phantom_agent_count, 0)

  const counts = {
    total: teams.length,
    by_tier: teams.reduce((acc, t) => ((acc[t.tier] = (acc[t.tier] || 0) + 1), acc), {}),
    by_status: teams.reduce((acc, t) => ((acc[t.status] = (acc[t.status] || 0) + 1), acc), {}),
    listable: teams.filter((t) => t.status !== "coming-soon" && t.status !== "deprecated").length,
    agents_referenced: [...new Set(teams.flatMap((t) => t.agents.map((a) => a.id)))].length,
    agents_total: totalAgents,
    agents_live: totalLiveAgents,
    agents_phantom: totalPhantomAgents,
    repo_catalog_available: repos.available,
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
  console.log(`[oh-my-sin] agents: total=${counts.agents_total} live=${counts.agents_live} phantom=${counts.agents_phantom} (catalog_available=${counts.repo_catalog_available})`)
  console.log(`[oh-my-sin] by_tier:`, counts.by_tier)
  console.log(`[oh-my-sin] by_status:`, counts.by_status)

  // Coerced teams: log explicitly so the operator sees the marketplace impact.
  const coerced = teams.filter((t) => t.status_coerced_reason)
  if (coerced.length > 0) {
    console.log(`[oh-my-sin] ${coerced.length} team(s) coerced to status="coming-soon" (MAN-1, all agents phantom):`)
    for (const t of coerced) console.log(`  - ${t.id}  (${t.agent_count} agents, 0 live)`)
  }
}

main()
