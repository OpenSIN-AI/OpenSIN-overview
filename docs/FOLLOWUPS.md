# Open Follow-ups — Consolidation (Wave 3+)

> **Status:** 2026-04-18. This file tracks the remaining rationalization and link-sweep work after the April 2026 consolidation. Each ticket has a stable anchor ID so other docs can deep-link to it.

When all tickets here are `DONE`, delete this file.

---

## Rationalization tickets

### R1: `opensin-ai-cli` vs `OpenSIN-Code`

- **Status:** `OPEN` — do not extend either side until decided.
- **Tracking issues:**
  - Decision: [`OpenSIN-Code#1116`](https://github.com/OpenSIN-AI/OpenSIN-Code/issues/1116)
  - Banner: [`opensin-ai-cli#7`](https://github.com/OpenSIN-AI/opensin-ai-cli/issues/7)
- **What:** `OpenSIN-AI/opensin-ai-cli` is a 70-file / 34.6k-line Rust coding CLI, 9 crates. `OpenSIN-AI/OpenSIN-Code` is the canonical autonomous TypeScript CLI and also ships a Rust engine (71 files / 37.7k lines).
- **Problem:** Two Rust coding CLIs in the same org. Only one should exist.
- **Decision needed:**
  1. **Merge** the useful crates of `opensin-ai-cli` into `OpenSIN-Code/crates/*` and archive `opensin-ai-cli` with a redirect README, OR
  2. **Split responsibilities clearly** — e.g. `OpenSIN-Code` = TS frontend / orchestration, `opensin-ai-cli` = Rust engine only; document the split in `CANONICAL-REPOS.md` and remove the rationalization flag.
- **Owner:** `Team-SIN-Code-Core`.
- **Unblocks:** Sprint 1 heartbeat work in `opensin-ai-agent-feature-spec.md § 2.1`.

### R2: `opensin-ai-platform` vs `OpenSIN`

- **Status:** `OPEN` — do not extend either side until decided.
- **Tracking issues:**
  - Decision: [`OpenSIN#1723`](https://github.com/OpenSIN-AI/OpenSIN/issues/1723)
  - Banner: [`opensin-ai-platform#6`](https://github.com/OpenSIN-AI/opensin-ai-platform/issues/6)
- **What:** `OpenSIN-AI/opensin-ai-platform` is a 182-file / 87k-line plugin ecosystem with 14 plugins. `OpenSIN/opensin_agent_platform/` was absorbed from the archived `opensin-ai-code` in Wave 1.
- **Problem:** Two "platform" repos claim the plugin-ecosystem role.
- **Decision needed:**
  1. **Merge** `opensin-ai-platform` into `OpenSIN/opensin_agent_platform/` (after R3 below resolves the internal `opensin_agent_platform/` vs `opensin_core/` diff), OR
  2. **Keep separate** only if `opensin-ai-platform` has a different deploy/runtime model — must then be renamed to `Infra-SIN-Plugin-Platform` per the naming convention.
- **Owner:** `OpenSIN` maintainers.
- **Blocked by:** R3.

### R3: `opensin_agent_platform/` vs `opensin_core/` diff

- **Status:** `OPEN` — Wave-1 absorbed `opensin-ai-code` → `OpenSIN/opensin_agent_platform/` but did NOT wire it into the build.
- **Tracking issue:** [`OpenSIN#1722`](https://github.com/OpenSIN-AI/OpenSIN/issues/1722)
- **What:** Both directories contain `hooks`, `plugins`, `skills` subtrees.
- **Decision needed:**
  1. Diff the two directories by subsystem.
  2. Port genuinely useful logic from `opensin_agent_platform/` into `opensin_core/`.
  3. Retire `opensin_agent_platform/` (delete folder, update `OpenSIN/README.md`, `setup.py`, `pyproject.toml`).
  4. Update `platforms/canonical-repos.json` to drop the folder from the `packages` array.
- **Owner:** `OpenSIN` maintainers.
- **Unblocks:** R2.

---

## Link-sweep tickets

### L1: `Delqhi/*` → `OpenSIN-AI/Infra-SIN-*` link sweep across other repos

- **Status:** `DONE — 2026-04-19` (org-wide re-verification via `gh search code`).
- **Tracking issues (retained for history):**
  - `OpenSIN-backend`: [`#1170`](https://github.com/OpenSIN-AI/OpenSIN-backend/issues/1170) (combined L1+L2; L1 side done, L2 reopened with live evidence)
  - `Template-SIN-Agent`: [`#156`](https://github.com/OpenSIN-AI/Template-SIN-Agent/issues/156) (template bake-in, prevents regression — keep open as preventive)
- **Live verification (2026-04-19):**
  - `gh search code 'Delqhi/upgraded-opencode-stack' --owner OpenSIN-AI` → **0 actionable hits** (the one result is this repo's own README summarizing history).
  - `gh search code 'Delqhi/global-brain' --owner OpenSIN-AI` → **0 hits**.
- **Conclusion:** the worry-list was a planning assumption, not a real problem. The 2026-04-18 transfer + GitHub redirects handled it. `Template-SIN-Agent#156` stays open as a preventive measure so new repos spawned from the template don't re-introduce the old refs.
- **Not a repo reference:** the hostname `n8n.delqhi.com` in `docs/best-practices/ci-cd-n8n.md` is an OCI VM, not a GitHub account. Must not be rewritten.

### L2: Archived-repo reference sweep

- **Status:** `OPEN` — live evidence 2026-04-19 shows real stale refs; needs a scripted sweep.
- **Tracking issues:**
  - `OpenSIN-backend`: [`#1170`](https://github.com/OpenSIN-AI/OpenSIN-backend/issues/1170) (L1 side resolved, L2 side reopened for the sweep)
  - `Core-SIN-Control-Plane`: [`#16`](https://github.com/OpenSIN-AI/Core-SIN-Control-Plane/issues/16) (will be superseded by CP1 merge)
- **Live evidence (2026-04-19 `gh search code`, scope public):**
  - `A2A-SIN-Coding-CEO` → **26 hits** across the org.
  - `OpenSIN-onboarding` → **1 hit**.
  - `A2A-SIN-Code-AI`, `opensin-ai-code` → search API returns 404 for those queries (likely private-repo scope limits). Rerun after L2 PR lands with a finer-grained token.
- **What:** Replace every hit with the canonical target from `docs/CANONICAL-REPOS.md § Archived repos` (e.g. `A2A-SIN-Coding-CEO` → `A2A-SIN-Code-Coordinator` or remove if purely historical).
- **How:**
  1. `gh search code 'A2A-SIN-Coding-CEO' --owner OpenSIN-AI --json repository,path,textMatches > /tmp/l2-hits.json`.
  2. Group by repo. One PR per repo with a sed rewrite + human-verified context diff.
  3. Bake a guard into the generator/template chain so the strings do not reappear.
- **Owner:** `OpenSIN` maintainers (largest footprint) + whichever team owns each consumer repo.

---

## Content tickets

### C1: Consumer-side description refresh for `OpenSIN-WebApp`

- **Status:** `DONE — 2026-04-19` via `scripts/generate-master-index.js`.
- **Tracking issue:** [`OpenSIN-overview#34`](https://github.com/OpenSIN-AI/OpenSIN-overview/issues/34) (combined C1+C2)
- **Resolution:** `registry/MASTER_INDEX.md` ist jetzt auto-generiert aus der Live-GitHub-API. Die Description von `OpenSIN-WebApp` wird bei jedem Re-Run aktualisiert. Keine manuelle Pflege mehr nötig. Re-run: `node scripts/generate-master-index.js && git commit registry/MASTER_INDEX.md -m "chore: regenerate master index"`.

### C2: `DEPLOYMENT_STATUS.md` freshness

- **Status:** `DONE — 2026-04-19`.
- **Tracking issue:** [`OpenSIN-overview#34`](https://github.com/OpenSIN-AI/OpenSIN-overview/issues/34) (combined C1+C2)
- **Resolution:** `registry/DEPLOYMENT_STATUS.md` wurde mit Live-`curl`-Verifikation aller 24 HF-Endpunkte refreshed (alle weiterhin 503). Neuer Inhalt: Recovery-Skript, Keep-Alive GitHub-Action-Template, Uptime-Monitoring-Empfehlung, Fallback auf bezahltes Hosting. **Nächste Follow-up-Action** (nicht mehr C2, sondern [LAUNCH-CHECKLIST HF-1](../LAUNCH-CHECKLIST.md#tag-1--t-3-mittwoch-2026-04-19--infrastruktur--datenlage)): HF-Spaces tatsächlich restarten + Keep-Alive-Action deployen.

---

## Docs-site ticket

### D1: Publish "April 2026 Consolidation" page on `docs.opensin.ai`

- **Status:** `OPEN`.
- **Tracking issue:** [`OpenSIN-documentation#134`](https://github.com/OpenSIN-AI/OpenSIN-documentation/issues/134)
- **What:** Public-facing Docusaurus page summarising the consolidation and deep-linking into this repo's SSOT docs. Required so external contributors land on a stable URL instead of bouncing around redirects.

---

## Wave 4 tickets (2026-04-18)

### CP1: Merge `Core-SIN-Control-Plane` into `OpenSIN-backend`

- **Status:** `OPEN`.
- **Decision (Wave 4):** `Core-SIN-Control-Plane` is absorbed into `OpenSIN-backend`. Older canonical name wins due to external dependencies already pointing to `OpenSIN-backend`.
- **What:**
  1. File-by-file diff of `Core-SIN-Control-Plane` against `OpenSIN-backend`.
  2. Port unique code/tests/docs into `OpenSIN-backend` under a preserved top-level folder (e.g. `control_plane/`) so git history is traceable.
  3. Tag last pre-archive commit on `Core-SIN-Control-Plane` (`v-archived-2026-04-18`).
  4. Replace `Core-SIN-Control-Plane/README.md` with a redirect banner pointing at `OpenSIN-backend`.
  5. Archive `Core-SIN-Control-Plane` on GitHub.
- **Owner:** `OpenSIN-backend` maintainers.

### S1: Archive 4 confirmed-dead A2A repos

- **Status:** `DONE — 2026-04-18` (verified live via `gh repo view` on 2026-04-19).
- **Archived repos (alle `isArchived=true`):**
  - `A2A-SIN-Facebook`
  - `A2A-SIN-Mattermost`
  - `A2A-SIN-RocketChat`
  - `A2A-SIN-Slack`
- **Post-archive verified:** `registry/MASTER_INDEX.md` (2026-04-19 auto-regeneriert) zeigt die 4 Repos mit `**ARCHIVED**`-Präfix. `platforms/registry.json` folgt beim nächsten Sync.

### S2: Decide fate of 6 `A2A-SIN-Code-*` scaffolds

- **Status:** `AUDIT DONE — 2026-04-19. DECISION PENDING R1.` Full audit in [`docs/S2-DEAD-REPO-AUDIT.md`](./S2-DEAD-REPO-AUDIT.md).
- **Repos (11 kb each, 1 commit each as of 2026-04-19):** `A2A-SIN-Code-Backend`, `-Command`, `-Frontend`, `-Fullstack`, `-Plugin`, `-Tool`.
- **Zero references:** none of the 6 scaffolds is referenced as a primary or supporting agent by any `templates/teams/Team-SIN-*.json` (verified against `templates/oh-my-sin.json`).
- **Decision matrix (from the audit doc):**
  1. **Archive all 6** (recommended) — conditional on R1 = merge. Launch impact: none.
  2. **Implement 6 thin wrappers** — conditional on R1 = keep split. Cost ≈ 12 days.
  3. **Collapse to 1** (fallback) — if R1 is undecided at T-0 18:00 CET.
- **Deadline to pick branch:** 2026-04-22 18:00 CET (so T-0 has a clean story). If no call, branch 3 auto-applies.
- **Launch impact:** **none**. This is clean-up, not a blocker.

### M1: Team-manifest pushes into 17 `Team-SIN-*` repos

- **Status:** `DONE — 2026-04-18` via `scripts/push-team-manifests.js`.
- **What:** Each of the 17 `Team-SIN-*` repos received a PR adding `team.json` synced from this repo's `templates/teams/*.json` and a README banner. No manual editing of `team.json` in the downstream repos — the overview repo is SSOT.
- **SSOT:** `templates/teams/` in this repo.
- **Aggregator:** The same script regenerates `oh-my-sin.json` in `Infra-SIN-OpenCode-Stack` nightly via GH Action.
- **Validation:** `scripts/validate-team-manifests.js` runs in CI on every PR touching `templates/teams/` or `schemas/team.schema.json`.

### M2: Build `oh-my-sin.json` aggregator

- **Status:** `PARTIAL DONE — 2026-04-19`. Builder + SSOT output committed in this repo. Only the nightly CI run needs the proposed workflow installed.
- **What landed:**
  - [`scripts/build-oh-my-sin.js`](../scripts/build-oh-my-sin.js) — zero-dep aggregator reading `templates/teams/Team-SIN-*.json` and writing `templates/oh-my-sin.json`. Runs in <1 s.
  - [`templates/oh-my-sin.json`](../templates/oh-my-sin.json) — SSOT output with 17 teams, 16 listable, 87 agents referenced, tier counts, status counts, marketplace URLs. First version produced by running `pnpm run build-marketplace` on 2026-04-19.
  - [`governance/workflows-proposed/oh-my-sin-build.yml`](../governance/workflows-proposed/oh-my-sin-build.yml) — nightly + on-change cron that re-runs the builder and commits any diff. Validates manifests first so a broken manifest never produces a bad aggregator.
- **Remaining work:** install the workflow (run `bash governance/workflows-proposed/install.sh` as repo admin — documented in [`governance/workflows-proposed/README.md`](../governance/workflows-proposed/README.md)). Optionally add a mirror-sync step to `Infra-SIN-OpenCode-Stack`; not required because consumers can read the file directly from this repo's `main`.
- **Consumer notes:** the marketplace frontend on `website-my.opensin.ai` should consume `https://raw.githubusercontent.com/OpenSIN-AI/OpenSIN-overview/main/templates/oh-my-sin.json` (or a pinned commit) and cache with `revalidate`.

---

## How to close a ticket

1. Do the work.
2. Change `Status:` to `DONE — <PR URL>`.
3. If all tickets in this file are `DONE`, delete the file and remove references from `CANONICAL-REPOS.md § 8 / § 9` and `CONSOLIDATION-2026-04.md § Wave 3`.
