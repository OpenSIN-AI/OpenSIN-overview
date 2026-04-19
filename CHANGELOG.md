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
  - `scripts/scan-secrets.sh` — regex scanner for live API keys + internal IPs (allow-listed false positives).
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

- WORKFORCE.md previously claimed **149 workers** across the 17 teams. Real count from the manifests is **89**. Almost every per-team count was inflated. Recomputed all rows from `templates/teams/*.json`; `scripts/check-workforce.js` now fails the build on drift.
- LAUNCH-CHECKLIST weekday labels were off by 3–4 days (Tag 1 said Wednesday, was Sunday; Tag 4 said Saturday, was Wednesday). All five day-blocks now carry the correct `(weekday YYYY-MM-DD)` label and T-count.
