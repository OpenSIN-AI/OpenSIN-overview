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

- **Status:** `IN PROGRESS` — `OpenSIN-overview` itself is clean after Wave 3. Other repos still have stale refs.
- **Tracking issues:**
  - `OpenSIN-backend`: [`#1170`](https://github.com/OpenSIN-AI/OpenSIN-backend/issues/1170) (combined L1+L2)
  - `Template-SIN-Agent`: [`#156`](https://github.com/OpenSIN-AI/Template-SIN-Agent/issues/156) (template bake-in, prevents regression)
- **Reality check (2026-04-18 `gh search code`):** actual stale-ref surface across the org is small — 2 hits for `Delqhi/upgraded-opencode-stack` and 0 for `Delqhi/global-brain` outside the meta-repo. The earlier "7 consumer repos affected" claim was based on planning assumptions, not live data. Individual per-repo tickets will be filed on-demand if `gh search code` turns up more hits.
- **What:** The 2026-04-18 transfer renamed the two SSOT repos. GitHub redirects old URLs, but hard-coded refs in configs, CI jobs, READMEs, and docstrings should be updated to the canonical path.
- **Known stale refs outside this repo:**
  - `OpenSIN`, `OpenSIN-Code`, `OpenSIN-WebApp`, `website-opensin.ai`, `website-my.opensin.ai`, `Template-SIN-Agent`, `Biz-SIN-Marketing` — all declare `Delqhi/upgraded-opencode-stack` as `sin-sync` target.
  - Multiple `A2A-SIN-*` agents reference `Delqhi/global-brain` for PCPM.
- **Note — NOT a repo reference:** the hostname `n8n.delqhi.com` appears in `docs/best-practices/ci-cd-n8n.md`. That is an OCI VM hostname owned by the Delqhi admin, not the archived GitHub account. Do NOT rewrite it.
- **How:** Run this regex-sweep in each consumer repo:
  ```
  s|Delqhi/upgraded-opencode-stack|OpenSIN-AI/Infra-SIN-OpenCode-Stack|g
  s|Delqhi/global-brain|OpenSIN-AI/Infra-SIN-Global-Brain|g
  ```
  Open a single "link-sweep: Delqhi → OpenSIN-AI" PR per repo.
- **Owner:** `Infra-SIN-Dev-Setup` or whichever team owns each consumer repo.

### L2: Archived-repo reference sweep

- **Status:** `OPEN`.
- **Tracking issues:**
  - `OpenSIN-backend`: [`#1170`](https://github.com/OpenSIN-AI/OpenSIN-backend/issues/1170) (combined L1+L2)
  - `Core-SIN-Control-Plane`: [`#16`](https://github.com/OpenSIN-AI/Core-SIN-Control-Plane/issues/16)
- **What:** Ensure no active repo still links to any of the 4 Wave-1/2 archived repos:
  - `A2A-SIN-Coding-CEO`, `A2A-SIN-Code-AI`, `opensin-ai-code`, `OpenSIN-onboarding`
- **How:** Run `gh search code 'A2A-SIN-Coding-CEO OR A2A-SIN-Code-AI OR opensin-ai-code OR OpenSIN-onboarding' --owner OpenSIN-AI` and replace each hit with the canonical target from `docs/CANONICAL-REPOS.md § Archived repos`.

---

## Content tickets

### C1: Consumer-side description refresh for `OpenSIN-WebApp`

- **Status:** `OPEN`.
- **Tracking issue:** [`OpenSIN-overview#34`](https://github.com/OpenSIN-AI/OpenSIN-overview/issues/34) (combined C1+C2)
- **What:** `registry/MASTER_INDEX.md § 7` still says `OpenSIN-WebApp → Keine Beschreibung`. Wave 2 set the GitHub description; next registry regeneration should pick it up automatically. Either regenerate or hand-patch.

### C2: `DEPLOYMENT_STATUS.md` freshness

- **Status:** `OPEN` — file is from 2026-04-16 and reports all 6 HF spaces as `503`. That may or may not still be true. Verify and refresh, or add an `OUTDATED` banner on top.
- **Tracking issue:** [`OpenSIN-overview#34`](https://github.com/OpenSIN-AI/OpenSIN-overview/issues/34) (combined C1+C2)

---

## Docs-site ticket

### D1: Publish "April 2026 Consolidation" page on `docs.opensin.ai`

- **Status:** `OPEN`.
- **Tracking issue:** [`OpenSIN-documentation#134`](https://github.com/OpenSIN-AI/OpenSIN-documentation/issues/134)
- **What:** Public-facing Docusaurus page summarising the consolidation and deep-linking into this repo's SSOT docs. Required so external contributors land on a stable URL instead of bouncing around redirects.

---

## Wave 4 tickets (2026-04-18)

### CP1: Merge `Core-SIN-Control-Plane` into `OpenSIN-backend`

- **Status:** `OPEN` — tracking issues filed.
- **Tracking issues:**
  - Migration target: [`OpenSIN-backend#1171`](https://github.com/OpenSIN-AI/OpenSIN-backend/issues/1171)
  - Archive prep (source): [`Core-SIN-Control-Plane#17`](https://github.com/OpenSIN-AI/Core-SIN-Control-Plane/issues/17)
- **Decision (Wave 4):** `Core-SIN-Control-Plane` is absorbed into `OpenSIN-backend`. Older canonical name wins due to external dependencies already pointing to `OpenSIN-backend`.
- **What:**
  1. File-by-file diff of `Core-SIN-Control-Plane` against `OpenSIN-backend`.
  2. Port unique code/tests/docs into `OpenSIN-backend` under a preserved top-level folder (e.g. `control_plane/`) so git history is traceable.
  3. Tag last pre-archive commit on `Core-SIN-Control-Plane` (`v-archived-2026-04-18`).
  4. Replace `Core-SIN-Control-Plane/README.md` with a redirect banner pointing at `OpenSIN-backend`.
  5. Archive `Core-SIN-Control-Plane` on GitHub.
- **Owner:** `OpenSIN-backend` maintainers.

### S1: Archive 4 confirmed-dead A2A repos

- **Status:** `DONE — 2026-04-18`.
- **Archived:**
  - [`A2A-SIN-Facebook`](https://github.com/OpenSIN-AI/A2A-SIN-Facebook)
  - [`A2A-SIN-Mattermost`](https://github.com/OpenSIN-AI/A2A-SIN-Mattermost)
  - [`A2A-SIN-RocketChat`](https://github.com/OpenSIN-AI/A2A-SIN-RocketChat)
  - [`A2A-SIN-Slack`](https://github.com/OpenSIN-AI/A2A-SIN-Slack)
- **What was done:** Each received an "ARCHIVED — never implemented" banner README pointing at `OpenSIN-overview` for the RFC flow, then was set to archived (read-only) on GitHub. Reversible via `gh repo unarchive` if a real implementation ever materialises.
- **Remaining clean-up (small):** `registry/MASTER_INDEX.md` and `platforms/registry.json` should mark these as archived next time the registry regenerator runs (folds into § C1).

### S2: Decide fate of 6 `A2A-SIN-Code-*` scaffolds

- **Status:** `OPEN` — kept alive for now.
- **Repos (9 kb, identical Python scaffolds):** `A2A-SIN-Code-Backend`, `-Command`, `-Frontend`, `-Fullstack`, `-Plugin`, `-Tool`.
- **Decision needed:** Owning team (`Team-SIN-Code-Core`) decides per-repo whether to promote (implement) or archive (dead). Should happen together with R1 resolution (`opensin-ai-cli` fate).
- **How to decide:** if R1 merges `opensin-ai-cli` into `OpenSIN-Code`, likely all 6 become redundant → archive. If R1 keeps them split, map each of the 6 to a specific sub-capability of the Rust engine and implement.

### M1: Team-manifest pushes into 17 `Team-SIN-*` repos

- **Status:** `DONE — 2026-04-18` (verified by live `gh api contents/team.json` check across all 17).
- **What:** All 17 `Team-SIN-*` repos already contain a `team.json` and a Option-A-style README banner pointing back to `OpenSIN-overview/templates/teams/`. Sizes 1.5-4 kb each, all valid against `schemas/team.schema.json`.
- **Known minor drift:** each downstream `team.json` is exactly 1 byte shorter than the SSOT copy at `OpenSIN-overview/templates/teams/*.json` — trailing-newline difference, functionally identical. Will be normalised on the next aggregator run (§ M2).
- **SSOT:** `templates/teams/` in this repo. Downstream files are read-only mirrors.
- **Validation:** `scripts/validate-team-manifests.js` passes on all 17. Wire into CI on every PR touching `templates/teams/` or `schemas/team.schema.json`.

### M2: Build `oh-my-sin.json` aggregator GitHub Action

- **Status:** `OPEN` (local script exists, CI workflow not yet).
- **What:** GH Actions workflow in `Infra-SIN-OpenCode-Stack` that:
  1. Fetches all `team.json` from the 17 `Team-SIN-*` repos (or from this repo's `templates/teams/` if we canonicalize there).
  2. Aggregates into `oh-my-sin.json`.
  3. Commits.
- **Recommendation:** SSOT is `OpenSIN-overview/templates/teams/` (not the downstream repos). Aggregator reads from here. Downstream `team.json` files are read-only mirrors for humans browsing individual Team-SIN-* repos.

---

## How to close a ticket

1. Do the work.
2. Change `Status:` to `DONE — <PR URL>`.
3. If all tickets in this file are `DONE`, delete the file and remove references from `CANONICAL-REPOS.md § 8 / § 9` and `CONSOLIDATION-2026-04.md § Wave 3`.
