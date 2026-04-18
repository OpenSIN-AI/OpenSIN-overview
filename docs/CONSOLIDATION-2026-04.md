# Consolidation Report — April 2026

## Problem

The OpenSIN-AI organization had accumulated duplicated, ambiguously-owned, and
wrongly-located repos across four distinct failure modes:

1. **Split siblings:** three near-identical repos for the coding-team agents that were designed for a pnpm workspace but lived in separate repositories, so the `workspace:*` dependencies could never resolve.
2. **Duplicated Python platforms:** a standalone `opensin-ai-code` repo claimed to be "the Python Agent Development Platform" while the `OpenSIN` monolith already shipped `opensin_core` / `opensin_cli` / `opensin_api` / `opensin_sdk`.
3. **Split setup repos:** `Infra-SIN-Dev-Setup` (developer environment) and `OpenSIN-onboarding` (end-user first-run) owned the same domain with different audiences.
4. **Ambiguous web surface + stale marketing copy:** `OpenSIN-WebApp` had no GitHub description and was easily confused with `website-my.opensin.ai`. `Biz-SIN-Marketing` advertised hard-coded counts ("372 Packages · 620 Agent Teams · 79 Blog Posts") that contradicted `OpenSIN`'s own description ("310+ packages") and were internally inconsistent.

## Wave 1 — agent and platform merges

### 1.1 Coding-team monorepo
Merged into `OpenSIN-AI/Team-SIN-Code-Core`:
- `A2A-SIN-Coding-CEO` → `agents/coding-ceo/`
- `A2A-SIN-Code-AI` → `agents/code-ai/`

Added `pnpm-workspace.yaml`, `packages/shared-helpers/` (previously-missing `workspace:*` target), and `start:coding-ceo` / `start:code-ai` scripts.

**PR:** https://github.com/OpenSIN-AI/Team-SIN-Code-Core/pull/2 — merged.

### 1.2 Python platform merge
Merged `opensin-ai-code` → `OpenSIN/opensin_agent_platform/`. Preserved source tree; rationalization plan documented in the new folder's README. Not yet wired into production build.

**PR:** https://github.com/OpenSIN-AI/OpenSIN/pull/1720 — merged.

### 1.3 Initial onboarding SSOT
Added to `OpenSIN-overview`:
- `START-HERE.md`
- `docs/CANONICAL-REPOS.md` (initial version)
- `docs/CONSOLIDATION-2026-04.md`

**PR:** https://github.com/OpenSIN-AI/OpenSIN-overview/pull/29 — merged.

### 1.4 Wave 1 archival
- `OpenSIN-AI/A2A-SIN-Coding-CEO` — archived with redirect README.
- `OpenSIN-AI/A2A-SIN-Code-AI` — archived with redirect README.
- `OpenSIN-AI/opensin-ai-code` — archived with redirect README.

## Wave 2 — setup merge + surface cleanup

### 2.1 Setup merge
Merged `OpenSIN-onboarding` → `Infra-SIN-Dev-Setup/user-onboarding/`. New top-level README splits developer vs. end-user paths.

**PR:** https://github.com/OpenSIN-AI/Infra-SIN-Dev-Setup/pull/34

**Redirect PR:** https://github.com/OpenSIN-AI/OpenSIN-onboarding/pull/5

### 2.2 OpenSIN-WebApp clarification
- Added `Related repos` table to README distinguishing the three web properties (`chat.opensin.ai`, `my.opensin.ai`, `opensin.ai`).
- Fixed `Delhi/upgraded-opencode-stack` typo → `Delqhi/...`.
- Set GitHub repo description and homepage (was blank).

**PR:** https://github.com/OpenSIN-AI/OpenSIN-WebApp/pull/13

### 2.3 Marketing factual correction
- Blog-post badge 79 → 89 (actual disk count).
- Replaced hard-coded "372 Packages · 620 Agent Teams" with a qualitative claim + pointer to `OpenSIN-overview/registry/` as the future SSOT for numbers.
- Quick Links: `OpenSIN-Code` is the Autonomous CLI, not a VS Code Extension.

**PR:** https://github.com/OpenSIN-AI/Biz-SIN-Marketing/pull/60

### 2.4 Canonical map expansion
- `docs/CANONICAL-REPOS.md` expanded from 6 entries (wave 1) to ~14 entries covering: Python kernel, coding surface, web surface (3), documentation, infra (merged), marketing, templates, org meta, external SSOT.
- Added explicit **Naming convention** section documenting the two schemes (flagship vs. domain-prefix) and when to use each.
- Added a **repo-proposal gate** — four questions that must be answered before creating any new `OpenSIN-AI/*` repo.
- `START-HERE.md` updated to match the expanded map, with a Delqhi SSOT callout.

**This PR** — https://github.com/OpenSIN-AI/OpenSIN-overview/pull/<this>

### 2.5 Wave 2 archival
- `OpenSIN-AI/OpenSIN-onboarding` — archived with redirect README.

## Result

| Before | After |
|---|---|
| 9 overlapping code repos | 4 code repos + clearly-split web surface (3) + infra (1) + template (1) + marketing (1) + 2 meta = 12 distinct, non-overlapping repos |
| 4 archived Wave-1+2 | `A2A-SIN-Coding-CEO`, `A2A-SIN-Code-AI`, `opensin-ai-code`, `OpenSIN-onboarding` |

## Follow-ups

### Governance
1. **Transfer `OpenSIN-AI/Infra-SIN-OpenCode-Stack` and `OpenSIN-AI/Infra-SIN-Global-Brain` to OpenSIN-AI.** Six+ repos declare these as SSOT in their READMEs. They must live under the same governance as the repos that depend on them.

### Rationalization
2. Diff `OpenSIN/opensin_agent_platform/` against `OpenSIN/opensin_core/` (both have `hooks`, `plugins`, `skills`). Port genuinely useful logic into `opensin_core` and retire the folder.

### Content
3. Regenerate `OpenSIN-overview/registry/MASTER_INDEX.md` and `platforms/registry.json` to reflect post-wave-2 layout.
4. Run a link-fixer across all README files: find every reference to the archived repos (`A2A-SIN-Coding-CEO`, `A2A-SIN-Code-AI`, `opensin-ai-code`, `OpenSIN-onboarding`) and replace with the canonical target from `docs/CANONICAL-REPOS.md`.

### Expansion
5. When adding `Team-SIN-Google`, `Team-SIN-BugBounty`, etc. — they go as folders under the existing `Team-SIN-*` monorepo that owns their domain, NOT as standalone repos. See the repo-proposal gate in `docs/CANONICAL-REPOS.md`.

## Wave 2.5 — Governance transfer (completed 2026-04-18)

Transferred the two external SSOT repos from `Delqhi` (personal account) to `OpenSIN-AI` (organization) and renamed them per the canonical `Infra-SIN-*` convention:

| Before | After |
|---|---|
| `Delqhi/upgraded-opencode-stack` | `OpenSIN-AI/Infra-SIN-OpenCode-Stack` |
| `Delqhi/global-brain`            | `OpenSIN-AI/Infra-SIN-Global-Brain` |

**Impact:**
- Both repos now live under the organization's governance: branch protection, team reviews, audit log.
- GitHub automatically redirects the old URLs, so `sin-sync` references and the 6+ repo READMEs that cited the old paths continue to work during the transition. They will be updated to the canonical path in a follow-up link-sweep.
- The transfer fixes the governance gap called out in `docs/CANONICAL-REPOS.md § 8` — the section is rewritten to reflect the new home in this PR.

**Follow-ups:**
1. Link-sweep: update all repo READMEs that reference the old `Delqhi/...` paths to the new canonical paths (GitHub redirects cover us for now, but we don't want permanent indirection). → tracked as [FOLLOWUPS.md § L1](./FOLLOWUPS.md#l1-delqhi--opensin-ai-link-sweep-across-other-repos).
2. Verify `sin-sync` tooling works with the new repo names or uses the GitHub redirect transparently.

## Wave 3 — Finalize consolidation (this PR, 2026-04-18)

Closes the remaining Wave-2.5 inconsistencies inside `OpenSIN-overview` and categorizes the last two in-org duplicate repos.

### 3.1 Internal Delqhi-link cleanup
Every remaining `Delqhi/upgraded-opencode-stack` and `Delqhi/global-brain` reference inside `OpenSIN-overview` has been rewritten to the canonical `OpenSIN-AI/Infra-SIN-*` path, with a one-line note where the legacy path still matters (for people searching for the old name):

- `README.md` — agent config table (6 rows) now points to `Infra-SIN-OpenCode-Stack`
- `START-HERE.md` — section title "Externe SSOT (noch in @Delqhi...)" rewritten to "Infrastruktur-SSOT (seit 2026-04-18 in-Org)" with redirect hint
- `BOUNDARIES.md` — canonical-ownership table updated; stale `ai-agent-system` entry replaced with `OpenSIN-backend`; `Infra-SIN-Global-Brain` added
- `governance/BOUNDARY-ROLE-RULES.md` — matching update for rule list
- `platforms/canonical-repos.json` — full rewrite (v3.0.0): moved the two SSOT entries out of `external_ssot` into a new `infrastructure_ssot` section under `canonical_repos`, marked `transferred_at: 2026-04-18`, recorded `legacy_path` for searchability, and emptied `external_ssot`

### 3.2 Orphan-repo classification
`OpenSIN-AI/opensin-ai-cli` (Rust coding CLI) and `OpenSIN-AI/opensin-ai-platform` (plugin ecosystem) were listed as "NEU April 2026" in the README but were not in the canonical map. Both overlap with existing canonical repos:

- `opensin-ai-cli` ⟷ `OpenSIN-Code` (TS autonomous CLI + Rust engine)
- `opensin-ai-platform` ⟷ `OpenSIN/opensin_agent_platform/` (plugin ecosystem)

Instead of silently accepting them, Wave 3 flags both as **"Rationalization pending — do not extend"** in:

- `README.md` (Core Engine + Doku & SSOT sections)
- `registry/MASTER_INDEX.md § 99`
- `docs/CANONICAL-REPOS.md § 9` (new section)
- `platforms/canonical-repos.json` (new `rationalization_pending` array)

Each has a decision ticket in `docs/FOLLOWUPS.md § R1` and `§ R2`.

### 3.3 Secondary fixes
- `README.md` — fixed the accidental duplicate `chat.opensin.ai` row where `OpenSIN-backend` was also claimed to serve that domain (corrected: backend is the internal API consumed by `OpenSIN-WebApp`).
- `README.md` — `OpenSIN-overview` SSOT entry "Registry aller 165 Repos" → "MASTER_INDEX.md (188 Repos)".
- `registry/MASTER_INDEX.md` — header count 187 vs 188 inconsistency fixed; `Infra-SIN-OpenCode-Stack` and `Infra-SIN-Global-Brain` added to § 11 Infrastructure.
- `docs/opensin-ai-agent-feature-spec.md` — 5 references to the now-flagged `opensin-ai-cli` and 1 reference to the archived `opensin-ai-code` rewritten to canonical `OpenSIN-Code` / `opensin_sdk`.

### 3.4 New artifact: `docs/FOLLOWUPS.md`
Central, stable-anchor tracker for all open consolidation work:

- `R1` — `opensin-ai-cli` vs `OpenSIN-Code` decision
- `R2` — `opensin-ai-platform` vs `OpenSIN` decision
- `R3` — `opensin_agent_platform/` vs `opensin_core/` internal diff (Wave-1 carry-over)
- `L1` — Delqhi → OpenSIN-AI link sweep across consumer repos
- `L2` — Archived-repo link sweep across consumer repos
- `C1` — `OpenSIN-WebApp` registry description refresh
- `C2` — `DEPLOYMENT_STATUS.md` freshness check

Every ticket has a stable `#anchor` so other docs deep-link to it.

## End state after Wave 3

| Category | Count | Notes |
|---|---|---|
| Canonical code repos | 4 | `OpenSIN`, `OpenSIN-Code`, `OpenSIN-backend`, `Team-SIN-Code-Core` |
| Canonical web surfaces | 3 | `website-opensin.ai`, `website-my.opensin.ai`, `OpenSIN-WebApp` |
| Canonical meta / docs | 2 | `OpenSIN-overview`, `OpenSIN-documentation` |
| Canonical infra | 3 | `Infra-SIN-Dev-Setup`, `Infra-SIN-OpenCode-Stack`, `Infra-SIN-Global-Brain` |
| Canonical templates | 1 | `Template-SIN-Agent` |
| Canonical business | 1 | `Biz-SIN-Marketing` |
| Wave 1/2 archived | 4 | `A2A-SIN-Coding-CEO`, `A2A-SIN-Code-AI`, `opensin-ai-code`, `OpenSIN-onboarding` |
| Rationalization pending | 2 | `opensin-ai-cli`, `opensin-ai-platform` (flagged, not extended) |

Every ambiguously-owned repo now has exactly one of three states: **canonical**, **archived**, or **rationalization-pending with an open decision ticket**. Agents opening PRs can read `CANONICAL-REPOS.md` and `FOLLOWUPS.md` and know where their change belongs without asking.

## Wave 4 — Execute the 5 strategic decisions (2026-04-18)

Wave 3 identified 5 Prio-1 decisions that needed to be made before the next marketing push. Wave 4 made all 5 and shipped the artifacts.

### Decisions made

| # | Topic | Decision |
|---|---|---|
| 1 | UI-layer role conflict | Strict 4-surface separation: `opensin.ai` / `my.opensin.ai` / `chat.opensin.ai` / `docs.opensin.ai` — see `PRODUCT-VISION.md § UI-Schichtung` |
| 2 | Marketplace mechanic | **Option A** — `Team-SIN-*` are metadata manifests. Schema + 17 manifests shipped. |
| 3 | `OpenSIN-backend` vs `Core-SIN-Control-Plane` | Merge into `OpenSIN-backend`. `Core-SIN-Control-Plane` → archived with redirect after migration (§ CP1). |
| 4 | `Team-SIN-Code-Core` integrity | Audit-confirmed scaffold (not a broken merge). Normalized into Option A like the other 16 teams. |
| 5 | Scaffold + dead repo audit | Audit script shipped; 4 dead repos archived; 6 `A2A-SIN-Code-*` kept open pending R1 decision (§ S2). |

### New artifacts

- `PRODUCT-VISION.md` — all 5 topics bumped from "proposed" to "DECIDED"
- `schemas/team.schema.json` — JSON Schema (Draft 2020-12, full property coverage)
- `schemas/README.md` — schema usage + aggregator contract
- `templates/teams/*.json` — all 17 team manifests (Team-SIN-Commerce = gold-standard reference)
- `templates/teams/README.md` — per-team template directory guide
- `scripts/audit-repos.js` — classifier (alive / active / scaffold / dead / archived) with `gh repo list` input
- `scripts/validate-team-manifests.js` — Ajv validation against the schema (CI-ready)
- `scripts/push-team-manifests.js` — pushes `team.json` + README banner into each downstream `Team-SIN-*` repo
- `registry/SCAFFOLD_AUDIT.md` — generated audit snapshot (2026-04-18)

### Archived in Wave 4

- `A2A-SIN-Facebook` — 0 kb, never implemented
- `A2A-SIN-Mattermost` — 0 kb, never implemented
- `A2A-SIN-RocketChat` — 0 kb, never implemented
- `A2A-SIN-Slack` — 0 kb, never implemented

### Still open after Wave 4 (small-scope tickets)

- `CP1` — actual code-level merge of `Core-SIN-Control-Plane` → `OpenSIN-backend`
- `S2` — per-repo decision on 6 `A2A-SIN-Code-*` scaffolds (tied to R1)
- `M1` — team-manifest downstream-push to 17 `Team-SIN-*` repos (DONE via script)
- `M2` — `oh-my-sin.json` aggregator GH Action in `Infra-SIN-OpenCode-Stack`
- Old R1/R2/R3/L1/L2/C1/C2/D1 still stand, but now each has a smaller scope because the strategic questions around them are answered.

### End state after Wave 4

The organization has a coherent topology: 1 product vision, 3 product tiers, 4 UI surfaces, 4 canonical code repos, 3 infra repos, 17 marketplace teams (all with manifests), ~80 active agents, 8 archived repos, 2 rationalization-pending repos with decision tickets. Anyone can read `START-HERE` → `PRODUCT-VISION` → `STATE-OF-THE-UNION` → `CANONICAL-REPOS` in 15 minutes and be fully oriented.
