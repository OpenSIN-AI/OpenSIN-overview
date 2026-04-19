#!/usr/bin/env node
/**
 * reality-check.js — fail if any canon doc references a repo or team that
 * does not exist (or is archived) in OpenSIN-AI/.
 *
 * Why this exists: on 2026-04-19, an audit run against the anonymous GitHub
 * API (which hides private repos) produced a false-positive "these 19 repos
 * are fictional" report. This script guarantees that class of mistake cannot
 * recur silently — it hard-errors if no authenticated token is present, and
 * uses `type=all` to include private repos when the token has access.
 *
 * Usage:
 *   GITHUB_TOKEN=ghp_xxx node scripts/reality-check.js
 *   GITHUB_TOKEN=ghp_xxx node scripts/reality-check.js --json
 *   GITHUB_TOKEN=ghp_xxx node scripts/reality-check.js --quiet
 *
 * What it checks:
 *   1. Every `OpenSIN-AI/<repo>` mention in tracked text files resolves to a
 *      live (non-archived) repo in the org.
 *   2. Every `@OpenSIN-AI/<team-slug>` mention resolves to a live GitHub Team.
 *   3. Case correctness — `opensin-ai/A2A-SIN-Code-Backend` vs canonical case.
 *
 * Exit 0 = clean, 1 = drift, 2 = usage error (no token).
 */

import fs from "node:fs"
import path from "node:path"
import process from "node:process"

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..")
const ORG = "OpenSIN-AI"

const args = new Set(process.argv.slice(2))
const asJson = args.has("--json")
const quiet = args.has("--quiet")

const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN
if (!TOKEN) {
  console.error(
    [
      "FATAL: GITHUB_TOKEN (or GH_TOKEN) missing.",
      "",
      "Anonymous GitHub API hides private repos; running without a token produces",
      "the exact false-positive 'these repos do not exist' report that caused the",
      "2026-04-19 canon-drift incident. Set a token with scopes: repo, read:org.",
      "",
      "  export GITHUB_TOKEN=ghp_your_pat_here",
      "  node scripts/reality-check.js",
    ].join("\n"),
  )
  process.exit(2)
}

const SCAN_EXT = new Set([".md", ".json", ".yml", ".yaml", ".sh", ".js", ".ts", ".mjs"])
const SKIP_DIRS = new Set([
  ".git",
  "node_modules",
  ".next",
  "dist",
  "build",
  "user_read_only_context",
  "v0_plans",
  "v0_memories",
])

// Files that legitimately quote missing/archived refs (history, audit trails).
// These paths are excluded from the repo-ref scan, but NOT from live-data loading.
const DOC_ALLOWLIST = [
  "docs/REALITY-CHECK-2026-04-19.md", // by design: preserves v1-incorrect claims as audit trail
  "docs/FOLLOWUPS.md", // tracks historical-only refs (e.g. A2A-SIN-Coding-CEO in L2)
  "docs/CONSOLIDATION-2026-04.md", // documents archived→canonical moves
  "docs/CANONICAL-REPOS.md", // § Archived repos intentionally lists archived names with redirect targets
  "CHANGELOG.md", // quotes fixed leaks + archived repos
  "docs/S2-DEAD-REPO-AUDIT.md", // audits repos slated for archive
  "CODE_OF_CONDUCT.md", // generic Contributor Covenant text
  "registry/SCAFFOLD_AUDIT.md", // auto-generated from gh repo list
  "registry/MASTER_INDEX.md", // auto-generated, prefixes archived repos with **ARCHIVED**
  "platforms/canonical-repos.json", // `archived` section intentionally lists archived names with replace_by targets
]

// Additional path prefixes to skip (separate from DOC_ALLOWLIST exact matches)
const DOC_ALLOWLIST_PREFIX = [
  "docs/REALITY-CHECK-", // any versioned reality-check doc
]

function isDocAllowlisted(rel) {
  if (DOC_ALLOWLIST.includes(rel)) return true
  for (const p of DOC_ALLOWLIST_PREFIX) if (rel.startsWith(p)) return true
  return false
}

async function gh(p) {
  const r = await fetch(`https://api.github.com${p}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "opensin-reality-check",
    },
  })
  if (!r.ok) {
    if (r.status === 401) {
      throw new Error(`GitHub 401 Bad credentials — check GITHUB_TOKEN validity/scope`)
    }
    throw new Error(`GitHub ${p} -> ${r.status} ${r.statusText}`)
  }
  return r.json()
}

async function listAll(pathTemplate) {
  const out = []
  for (let page = 1; page < 20; page++) {
    const part = await gh(`${pathTemplate}${pathTemplate.includes("?") ? "&" : "?"}per_page=100&page=${page}`)
    if (!Array.isArray(part) || part.length === 0) break
    out.push(...part)
    if (part.length < 100) break
  }
  return out
}

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(e.name)) continue
    const full = path.join(dir, e.name)
    if (e.isDirectory()) walk(full, out)
    else if (SCAN_EXT.has(path.extname(e.name))) out.push(full)
  }
  return out
}

// Repo refs: OpenSIN-AI/<name>, NOT preceded by '@' (that's a team handle).
// We use a capture group for the preceding char to simulate negative lookbehind
// without needing ES2018+ quirks in older Node.
const REPO_RE = /(^|[^@])OpenSIN-AI\/([A-Za-z0-9._-]+)/g
const TEAM_RE = /@OpenSIN-AI\/([A-Za-z0-9._-]+)/g

// Ignore incomplete prefix mentions that appear in prose as wildcards:
// e.g. "`A2A-SIN-*`", "`Team-SIN-`", "all `Infra-SIN-` repos".
// These end with a `-` because authors stripped the suffix to indicate a family.
function isIncompletePrefix(name) {
  return name.endsWith("-")
}

function scanFiles(files) {
  const repoRefs = new Map() // name -> [{file, line}]
  const teamRefs = new Map()
  for (const f of files) {
    const rel = path.relative(ROOT, f)
    if (isDocAllowlisted(rel)) continue
    let txt
    try {
      txt = fs.readFileSync(f, "utf8")
    } catch {
      continue
    }
    const lines = txt.split("\n")
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      for (const m of line.matchAll(REPO_RE)) {
        // Strip trailing punctuation / chunks after a sub-path.
        const name = m[2].split("/")[0].replace(/[.,):;'"`>\]]+$/, "")
        if (!name || isIncompletePrefix(name)) continue
        if (!repoRefs.has(name)) repoRefs.set(name, [])
        repoRefs.get(name).push({ file: rel, line: i + 1 })
      }
      for (const m of line.matchAll(TEAM_RE)) {
        const slug = m[1].replace(/[.,):;'"`>\]]+$/, "")
        if (!slug || isIncompletePrefix(slug)) continue
        if (!teamRefs.has(slug)) teamRefs.set(slug, [])
        teamRefs.get(slug).push({ file: rel, line: i + 1 })
      }
    }
  }
  return { repoRefs, teamRefs }
}

function fmtRefs(refs, max = 3) {
  const head = refs.slice(0, max).map((r) => `${r.file}:${r.line}`).join("  ")
  const extra = refs.length > max ? `  (+${refs.length - max} more)` : ""
  return head + extra
}

async function main() {
  const files = walk(ROOT)
  const { repoRefs, teamRefs } = scanFiles(files)

  if (!quiet) {
    console.log(`[reality-check] scanned ${files.length} file(s)`)
    console.log(`[reality-check] found ${repoRefs.size} distinct repo refs, ${teamRefs.size} distinct team refs`)
    console.log(`[reality-check] loading OpenSIN-AI catalog (authenticated)…`)
  }

  const [repos, teams] = await Promise.all([
    listAll(`/orgs/${ORG}/repos?type=all`),
    listAll(`/orgs/${ORG}/teams`),
  ])

  const liveRepoNames = new Set(repos.filter((r) => !r.archived).map((r) => r.name))
  const archivedRepoNames = new Set(repos.filter((r) => r.archived).map((r) => r.name))
  const allRepoNames = new Set(repos.map((r) => r.name))
  const repoLowerMap = new Map([...allRepoNames].map((n) => [n.toLowerCase(), n]))
  const liveTeamSlugs = new Set(teams.map((t) => t.slug))

  if (!quiet) {
    console.log(
      `[reality-check] org has ${repos.length} repos (${liveRepoNames.size} live, ${archivedRepoNames.size} archived), ${teams.length} teams`,
    )
  }

  const missingRepos = []
  const caseDiffRepos = []
  const archivedRepos = []
  const teamNoAtRefs = [] // `OpenSIN-AI/<slug>` without @-prefix where <slug> is a live team
  for (const [name, refs] of repoRefs) {
    if (liveRepoNames.has(name)) continue
    if (archivedRepoNames.has(name)) {
      archivedRepos.push({ name, refs })
      continue
    }
    // Idiomatic team-no-@ references in JSON/YAML:
    //   - dependabot.yml `reviewers: ["OpenSIN-AI/<slug>"]`
    //   - team manifest `"owner_team": "OpenSIN-AI/<slug>"`
    // GitHub interprets these as team handles in those specific schema fields.
    // Treat them as OK if the slug resolves to a live team; still surface as info.
    if (liveTeamSlugs.has(name)) {
      teamNoAtRefs.push({ slug: name, refs })
      continue
    }
    const real = repoLowerMap.get(name.toLowerCase())
    if (real && real !== name) {
      caseDiffRepos.push({ doc: name, real, refs })
    } else {
      missingRepos.push({ name, refs })
    }
  }

  const missingTeams = []
  for (const [slug, refs] of teamRefs) {
    if (liveTeamSlugs.has(slug)) continue
    missingTeams.push({ slug, refs })
  }

  const result = {
    ok:
      missingRepos.length === 0 &&
      caseDiffRepos.length === 0 &&
      missingTeams.length === 0,
    summary: {
      files_scanned: files.length,
      repo_refs_total: repoRefs.size,
      team_refs_total: teamRefs.size,
      team_no_at_refs_total: teamNoAtRefs.length,
      org_repos_total: repos.length,
      org_repos_live: liveRepoNames.size,
      org_repos_archived: archivedRepoNames.size,
      org_teams_total: teams.length,
    },
    missing_repos: missingRepos.map(({ name, refs }) => ({ name, refs })),
    case_diff_repos: caseDiffRepos.map(({ doc, real, refs }) => ({ doc, real, refs })),
    archived_repos: archivedRepos.map(({ name, refs }) => ({ name, refs })),
    team_no_at_refs: teamNoAtRefs.map(({ slug, refs }) => ({ slug, ref_count: refs.length })),
    missing_teams: missingTeams.map(({ slug, refs }) => ({ slug, refs })),
    available_teams: [...liveTeamSlugs].sort(),
  }

  if (asJson) {
    process.stdout.write(JSON.stringify(result, null, 2) + "\n")
    process.exit(result.ok ? 0 : 1)
  }

  if (missingRepos.length) {
    console.log("")
    console.log(`[FAIL] ${missingRepos.length} repo reference(s) do not exist in ${ORG}/:`)
    for (const { name, refs } of missingRepos.sort((a, b) => a.name.localeCompare(b.name))) {
      console.log(`  MISSING  ${ORG}/${name}   (${refs.length} ref${refs.length === 1 ? "" : "s"})`)
      console.log(`           ${fmtRefs(refs)}`)
    }
  }

  if (caseDiffRepos.length) {
    console.log("")
    console.log(`[FAIL] ${caseDiffRepos.length} repo reference(s) have wrong case:`)
    for (const { doc, real, refs } of caseDiffRepos.sort((a, b) => a.doc.localeCompare(b.doc))) {
      console.log(`  CASE     docs='${doc}'  canonical='${real}'   (${refs.length} ref${refs.length === 1 ? "" : "s"})`)
      console.log(`           ${fmtRefs(refs)}`)
    }
  }

  if (archivedRepos.length) {
    console.log("")
    console.log(`[WARN] ${archivedRepos.length} repo reference(s) point to archived repos:`)
    for (const { name, refs } of archivedRepos.sort((a, b) => a.name.localeCompare(b.name))) {
      console.log(`  ARCHIVED ${ORG}/${name}   (${refs.length} ref${refs.length === 1 ? "" : "s"})`)
      console.log(`           ${fmtRefs(refs)}`)
    }
    console.log(
      `           Archived refs are allowed only in allow-listed audit/history docs (see DOC_ALLOWLIST in this script).`,
    )
  }

  if (missingTeams.length) {
    console.log("")
    console.log(`[FAIL] ${missingTeams.length} team slug(s) do not exist in ${ORG}/:`)
    for (const { slug, refs } of missingTeams.sort((a, b) => a.slug.localeCompare(b.slug))) {
      console.log(`  MISSING  @${ORG}/${slug}   (${refs.length} ref${refs.length === 1 ? "" : "s"})`)
      console.log(`           ${fmtRefs(refs)}`)
    }
    console.log("")
    console.log(`  Real teams currently in the org (${liveTeamSlugs.size}):`)
    for (const s of [...liveTeamSlugs].sort()) console.log(`    @${ORG}/${s}`)
  }

  if (result.ok) {
    if (!quiet) {
      console.log("")
      console.log(
        `[OK] all ${repoRefs.size} repo refs and ${teamRefs.size} team refs resolve to live entities in ${ORG}/`,
      )
    }
    process.exit(0)
  }

  console.log("")
  console.log(
    `[reality-check] FAIL — ${missingRepos.length} missing repo(s), ${caseDiffRepos.length} case error(s), ${missingTeams.length} missing team(s).`,
  )
  process.exit(1)
}

main().catch((err) => {
  console.error(`[reality-check] error: ${err.message}`)
  process.exit(2)
})
