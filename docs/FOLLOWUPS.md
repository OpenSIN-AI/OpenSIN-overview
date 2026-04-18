# Open Follow-ups — Consolidation (Wave 3+)

> **Status:** 2026-04-18. This file tracks the remaining rationalization and link-sweep work after the April 2026 consolidation. Each ticket has a stable anchor ID so other docs can deep-link to it.

When all tickets here are `DONE`, delete this file.

---

## Rationalization tickets

### R1: `opensin-ai-cli` vs `OpenSIN-Code`

- **Status:** `OPEN` — do not extend either side until decided.
- **What:** `OpenSIN-AI/opensin-ai-cli` is a 70-file / 34.6k-line Rust coding CLI, 9 crates. `OpenSIN-AI/OpenSIN-Code` is the canonical autonomous TypeScript CLI and also ships a Rust engine (71 files / 37.7k lines).
- **Problem:** Two Rust coding CLIs in the same org. Only one should exist.
- **Decision needed:**
  1. **Merge** the useful crates of `opensin-ai-cli` into `OpenSIN-Code/crates/*` and archive `opensin-ai-cli` with a redirect README, OR
  2. **Split responsibilities clearly** — e.g. `OpenSIN-Code` = TS frontend / orchestration, `opensin-ai-cli` = Rust engine only; document the split in `CANONICAL-REPOS.md` and remove the rationalization flag.
- **Owner:** `Team-SIN-Code-Core`.
- **Unblocks:** Sprint 1 heartbeat work in `opensin-ai-agent-feature-spec.md § 2.1`.

### R2: `opensin-ai-platform` vs `OpenSIN`

- **Status:** `OPEN` — do not extend either side until decided.
- **What:** `OpenSIN-AI/opensin-ai-platform` is a 182-file / 87k-line plugin ecosystem with 14 plugins. `OpenSIN/opensin_agent_platform/` was absorbed from the archived `opensin-ai-code` in Wave 1.
- **Problem:** Two "platform" repos claim the plugin-ecosystem role.
- **Decision needed:**
  1. **Merge** `opensin-ai-platform` into `OpenSIN/opensin_agent_platform/` (after R3 below resolves the internal `opensin_agent_platform/` vs `opensin_core/` diff), OR
  2. **Keep separate** only if `opensin-ai-platform` has a different deploy/runtime model — must then be renamed to `Infra-SIN-Plugin-Platform` per the naming convention.
- **Owner:** `OpenSIN` maintainers.
- **Blocked by:** R3.

### R3: `opensin_agent_platform/` vs `opensin_core/` diff

- **Status:** `OPEN` — Wave-1 absorbed `opensin-ai-code` → `OpenSIN/opensin_agent_platform/` but did NOT wire it into the build.
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
- **What:** Ensure no active repo still links to any of the 4 Wave-1/2 archived repos:
  - `A2A-SIN-Coding-CEO`, `A2A-SIN-Code-AI`, `opensin-ai-code`, `OpenSIN-onboarding`
- **How:** Run `gh search code 'A2A-SIN-Coding-CEO OR A2A-SIN-Code-AI OR opensin-ai-code OR OpenSIN-onboarding' --owner OpenSIN-AI` and replace each hit with the canonical target from `docs/CANONICAL-REPOS.md § Archived repos`.

---

## Content tickets

### C1: Consumer-side description refresh for `OpenSIN-WebApp`

- **Status:** `OPEN`.
- **What:** `registry/MASTER_INDEX.md § 7` still says `OpenSIN-WebApp → Keine Beschreibung`. Wave 2 set the GitHub description; next registry regeneration should pick it up automatically. Either regenerate or hand-patch.

### C2: `DEPLOYMENT_STATUS.md` freshness

- **Status:** `OPEN` — file is from 2026-04-16 and reports all 6 HF spaces as `503`. That may or may not still be true. Verify and refresh, or add an `OUTDATED` banner on top.

---

## How to close a ticket

1. Do the work.
2. Change `Status:` to `DONE — <PR URL>`.
3. If all tickets in this file are `DONE`, delete the file and remove references from `CANONICAL-REPOS.md § 8 / § 9` and `CONSOLIDATION-2026-04.md § Wave 3`.
