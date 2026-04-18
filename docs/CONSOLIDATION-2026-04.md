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
1. Link-sweep: update all repo READMEs that reference the old `Delqhi/...` paths to the new canonical paths (GitHub redirects cover us for now, but we don't want permanent indirection).
2. Verify `sin-sync` tooling works with the new repo names or uses the GitHub redirect transparently.
