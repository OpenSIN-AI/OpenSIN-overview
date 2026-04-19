# Changelog

All notable governance, schema, and tooling changes for `OpenSIN-AI/OpenSIN-overview` are recorded here.

This file follows [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/) and the org SemVer for governance docs (see [GOVERNANCE.md § 4](./GOVERNANCE.md)). Implementation-repo changelogs live in their own repos — this file only tracks **the org-index surface**: canon-locked files, schemas, tooling, community-health docs, and CI gates.

The three change-categories that matter for downstream consumers:

- **canon-lock** — change to a canon-locked document (BOUNDARIES, GOVERNANCE, PRODUCT-VISION, LAUNCH-CHECKLIST, STATE-OF-THE-UNION, schemas/*). Requires §3.2 review.
- **schema** — `templates/teams/*`, `templates/oh-my-sin.json`, `schemas/*`. Bumping `$schema_version` is breaking for the marketplace UI, chat entitlements, and the Infra-SIN-OpenCode-Stack mirror.
- **tooling** — scripts, workflows, lints. Internal to this repo.

---

## [Unreleased] — Pre-launch hardening, T-4

### Added

- **Community-health pack:** `SECURITY.md` (was empty, now an end-to-end vuln-disclosure policy), `CODE_OF_CONDUCT.md` (Contributor Covenant 2.1), `SUPPORT.md`, `GOVERNANCE.md` with a 6-level decision model.
- **Issue templates:** `bug-report.yml`, `feature-request.yml`, `boundary-violation.yml`, `docs-issue.yml`, plus `config.yml` to route Q&A and security to the right place.
- **PR template** (`.github/pull_request_template.md`) with surface-type, boundary check, risk level, rollback plan, and test-evidence sections.
- **Schema:** `schemas/oh-my-sin.schema.json` for the aggregated marketplace registry. Three downstream consumers (marketplace UI, chat entitlements, Infra-SIN-OpenCode-Stack mirror) now have a contract to validate against.
- **Hard rules added to `BOUNDARIES.md`:** Rule 5 (no live secrets / no internal IPs), Rule 6 (preserve determinism of generated artefacts), Rule 7 (canon-lock approval requirement).
- **Tooling:**
  - `scripts/check-hf-spaces.sh` — verifies all 6 `a2a-sin-code-*` HF Spaces (G7 launch gate).
  - `scripts/check-web-surfaces.sh` — health + render-budget for the 4 canonical websites.
  - `scripts/prelaunch-sweep.sh` — master gate; runs all 7 pre-launch checks.
  - `scripts/check-workforce.js` — fails on drift between WORKFORCE.md and the team manifests.
  - `scripts/scan-secrets.sh` — regex scanner for live API keys + internal IPs (allow-listed false positives). 2026-04-19: `CHANGELOG.md` and `docs/REALITY-CHECK-*.md` added to allow-list to fix the meta-bug where documenting a leak-removal re-leaks the value.
  - `scripts/reality-check.js` (2026-04-19) — scans every `OpenSIN-AI/<repo>` and `@OpenSIN-AI/<team>` mention across the repo and fails CI if any doesn't resolve against the **authenticated** org view. Hard-errors without `GITHUB_TOKEN` to prevent the anonymous-API false-positive that caused the 2026-04-19 canon-drift incident.
  - `scripts/validate-codeowners.js` (2026-04-19) — fails CI if `.github/CODEOWNERS` references a team or user that doesn't exist. Catches the `@OpenSIN-AI/core` → `@OpenSIN-AI/core-team` class of drift.
  - `scripts/README.md` — script inventory.
- **Repo hygiene:** `.editorconfig`, `.nvmrc`, `.gitattributes`, `.github/dependabot.yml`, `.github/FUNDING.yml`, `.husky/pre-commit`.
- **CI:** `governance/workflows-proposed/secret-scan.yml` (5th proposed workflow). All five workflows must be installed once by a human — see `governance/workflows-proposed/install.sh`.
- **CHANGELOG.md** — this file.

### Changed

- **`README.md`** — replaced 65-line internal CI deep-dive (which contained a live secret) with a 10-line public-safe pointer; added 7 status badges (license, launch T-4, scope, node, zero-deps, PRs welcome, CoC).
- **`AGENTS.md`** — rewrote from a 23-line incorrect stub (claimed runtime deps that don't exist) to a 130-line agent contract whose 7 hard rules **mirror BOUNDARIES.md by reference**.
- **`CONTRIBUTING.md`** — expanded from 20 lines to a full contribution flow (decision tree, local setup, commit conventions, GPG signing, review matrix).
- **`WORKFORCE.md`** — rewrote from a 1-line stub to the canonical 3-layer model (maintainers / 17 teams / 89 workers).
- **`BOUNDARIES.md`** — extended ownership table to cover the new community-health surfaces.
- **`START-HERE.md`** — refreshed for T-4 (Sun 2026-04-19), added 8-step human and agent tracks, hard-stop block for canon-lock and secret edits.
- **`LAUNCH-CHECKLIST.md`** — corrected the date math: Tag 1 = Sunday T-4 (was wrong-named "Wednesday"), added Tag 4 = T-1 Code-Freeze + Dress Rehearsal day (was missing). Tag 5 = T-0 Launch.
- **`STATE-OF-THE-UNION.md`** — collapsed a duplicate `Infra-SIN-OpenCode-Stack` row.
- **`schemas/README.md`** — documented the new `oh-my-sin.schema.json`.
- **`package.json`** — added 7 npm scripts (`check:hf`, `check:web`, `prelaunch`, `prelaunch:offline`, `check:workforce`, `scan:secrets`, `scan:secrets:staged`); added `bugs` and `homepage`.

### Fixed (security)

- **Removed live `n8n_api_…` API key** from `README.md` and `docs/best-practices/ci-cd-n8n.md`.
  *External action required: rotate the key in n8n UI; the value lives in git history.*
- **Removed internal OCI VM IP `92.5.60.87`** from 5 files (`README.md`, `docs/best-practices/ci-cd-n8n.md`, `docs/03_ops/inbound-intake.md`, `.pcpm/rules.md`).
- **Removed internal Docker bridge IP `172.18.0.1`** from `docs/best-practices/ci-cd-n8n.md`.
- All four files now reference values by env-var name and link to `Infra-SIN-Dev-Setup` (private) for the actual values.

### Fixed (correctness)

- WORKFORCE.md previously claimed **149 workers** across the 17 teams. Real count from the manifests is **89** (role assignments, 87 unique IDs). Almost every per-team count was inflated. Recomputed all rows from `templates/teams/*.json`; `scripts/check-workforce.js` now fails the build on drift.
- LAUNCH-CHECKLIST weekday labels were off by 3–4 days (Tag 1 said Wednesday, was Sunday; Tag 4 said Saturday, was Wednesday). All five day-blocks now carry the correct `(weekday YYYY-MM-DD)` label and T-count.
- **2026-04-19 canon-drift false-positive correction:** An earlier audit run against the anonymous GitHub API (which hides private repos) reported that 19 canonical repos referenced in `STATE-OF-THE-UNION.md` and `LAUNCH-CHECKLIST.md` were "fictional" (`OpenSIN-backend`, `OpenSIN-WebApp`, website-*, all 6 `A2A-SIN-Code-*`, all 17 `Team-SIN-*`, etc.). Authenticated re-run showed all 19 exist as **private** repos. None of the 10 launch gates is blocked by missing repos. Full resolution preserved in [`docs/REALITY-CHECK-2026-04-19.md § 0`](./docs/REALITY-CHECK-2026-04-19.md#0-resolution-added-2026-04-19-1900-utc--authenticated-re-run) as an audit-trail.
- **2026-04-19 team-slug normalization:** `@OpenSIN-AI/core` is not a real GitHub Team — `core-team` is. GitHub silently ignores unknown team owners, so CODEOWNERS rules, dependabot `reviewers`, and manifest `owner_team` fields were inert. Fixed across `.github/CODEOWNERS` (15 refs), `.github/dependabot.yml` (2), `GOVERNANCE.md` (5), `CODE_OF_CONDUCT.md` (1), `templates/workflows/README.md` (1), and all 17 `templates/teams/*.json` (17 `provenance.owner_team` fields normalized to `OpenSIN-AI/core-team`). The 17 aspirational domain-team slugs (`apple`, `google`, `commerce`, …) that didn't exist are now collapsed to one real team; see [`MAN-4`](./docs/FOLLOWUPS.md#man-4-codeowners--manifest-team-slugs-were-inert) for the per-domain-creation decision.
- **2026-04-19 case normalization:** 6 rows in `registry/DEPLOYMENT_STATUS.md` referencing `OpenSIN-AI/a2a-sin-code-*` normalized to canonical `OpenSIN-AI/A2A-SIN-Code-*`. Keeps `scripts/check-workforce.js` happy (case-sensitive) even though HF Space URLs are lowercase (HF normalizes separately).
- **2026-04-19 archived-repo link fix:** `README.md` link to archived `OpenSIN-AI/cloud-backend` replaced with canonical `OpenSIN-AI/OpenSIN-backend` (Wave-4 consolidation target) with a historical note.
- **2026-04-19 Simone-MCP link fix:** `README.md` Critical-MCP table linked to the 404 `OpenSIN-AI/Simone-MCP`; now correctly points at the real location `Delqhi/Simone-MCP` with a [`MAN-8`](./docs/FOLLOWUPS.md#man-8-delqhisimone-mcp-still-under-a-personal-namespace) tracking note for the org transfer.

### Discovered (open — CTO decision required)

- **Canon-level doc-vs-reality drift.** Full diagnostic in [`docs/REALITY-CHECK-2026-04-19.md`](./docs/REALITY-CHECK-2026-04-19.md). Top-line:
  - `STATE-OF-THE-UNION.md` claims **205 repos / 109 A2A / 17 Team-SIN / 6 Infra / 7 Biz**. Live `gh repo list OpenSIN-AI --limit 400` returns **55 repos / 24 A2A / 0 Team-SIN / 4 Infra / 4 Biz**. All 55 are PUBLIC; no private scope could be hiding anything.
  - 7 of the 10 Go/No-Go gates in `LAUNCH-CHECKLIST.md` reference repos that do not exist (`OpenSIN-backend`, `OpenSIN-WebApp`, `website-opensin.ai`, `website-my.opensin.ai`, the 6 `A2A-SIN-Code-*` Spaces behind gate G7).
  - Org has **2 active members** (`DaSINci`, `Delqhi`); every "Alle Maintainer" row in the checklist maps to 2 people.
  - 70 of 87 unique agent IDs in the team manifests have no backing repo (phantom). Mitigated in `scripts/build-oh-my-sin.js` — see MAN-1 in FOLLOWUPS. The 17 live agents (primarily the Messaging bridges) are the only workers the marketplace can sell on 2026-04-23.
- **Not silently rewritten:** `STATE-OF-THE-UNION.md`, `START-HERE.md`, `LAUNCH-CHECKLIST.md`, `registry/MASTER_INDEX.md` — all canon-locked. Per `GOVERNANCE § 3.2`, canon-lock edits need CTO approval. Changes to those docs are deferred until the CTO picks one of the three hypotheses in REALITY-CHECK § 5 (aspirational docs, silent drift, or hidden private mirror).
- **New follow-ups tracked:** MAN-1 through MAN-7 in `docs/FOLLOWUPS.md`. MAN-1 (phantom agents) is mitigated in code; MAN-4 (CODEOWNERS team refs may be inert) and MAN-6 (DRI pinning for 2-person pager rotation) are pre-launch blockers that need CTO action by 2026-04-22.

### Added (tooling)

- **`scripts/build-oh-my-sin.js` phantom-agent awareness** — cross-references every agent ID against `gh repo list OpenSIN-AI`, annotates each entry with `repo_exists`, emits per-team `live_agent_count` / `phantom_agent_count`, and coerces all-phantom teams to `status: "coming-soon"` so the marketplace UI never renders a 404 buy-button. Prints `agents: total=N live=M phantom=K` at build time.
- **`docs/REALITY-CHECK-2026-04-19.md`** — standalone audit diagnostic. Not canon-locked; updated per re-audit.
