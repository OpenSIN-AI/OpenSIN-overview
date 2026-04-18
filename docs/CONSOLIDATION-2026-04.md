# Consolidation Report — April 2026

## Problem

The OpenSIN-AI organization had accumulated multiple repos that all claimed
to be "the coding / agent platform." Concretely:

- Three repos for the coding-team agents (`Team-SIN-Code-Core`,
  `A2A-SIN-Coding-CEO`, `A2A-SIN-Code-AI`) that only differed in the
  model name in `agent.json` and shared a `workspace:*` dependency that
  could never resolve across repo boundaries.
- A separate `opensin-ai-code` Python repo that duplicated the ground
  already covered by `OpenSIN/opensin_core` / `opensin_cli` / `opensin_sdk`,
  and which advertised a `pip install opensin-ai-code` path that never
  actually worked (no `pyproject.toml`).

Result: new contributors (human and agent) could not tell where new code
should go, and cross-repo workspace dependencies were fundamentally broken.

## Actions taken

### 1. Coding-team monorepo
Merged into `OpenSIN-AI/Team-SIN-Code-Core`:
- `A2A-SIN-Coding-CEO` → `agents/coding-ceo/`
- `A2A-SIN-Code-AI` → `agents/code-ai/`

Added `pnpm-workspace.yaml`, `packages/shared-helpers/` (the previously
missing workspace:* target), and `start:coding-ceo` / `start:code-ai`
scripts in the root `package.json`.

PR: https://github.com/OpenSIN-AI/Team-SIN-Code-Core/pull/2

### 2. Python platform merge
Merged `opensin-ai-code` into `OpenSIN` as `opensin_agent_platform/`.
Folder is preserved as reference material with a follow-up rationalization
plan documented in its README. Not yet wired into the production build.

PR: https://github.com/OpenSIN-AI/OpenSIN/pull/1720

### 3. Onboarding SSOT
Sharpened `OpenSIN-overview` with:
- `START-HERE.md` — 60-second onboarding for humans and agents
- `docs/CANONICAL-REPOS.md` — authoritative repo-ownership map
- This report

### 4. Archival
After the two PRs above merge, the following repos are archived with a
redirect README:
- `OpenSIN-AI/A2A-SIN-Coding-CEO`
- `OpenSIN-AI/A2A-SIN-Code-AI`
- `OpenSIN-AI/opensin-ai-code`

## Result

From 9 confusing repos with overlapping claims to 4 code repos + 2 meta
repos with clearly separated ownership:

| Before | After |
|---|---|
| OpenSIN | OpenSIN (unchanged role) |
| OpenSIN-Code | OpenSIN-Code (unchanged role) |
| OpenSIN-backend | OpenSIN-backend (unchanged role) |
| Team-SIN-Code-Core | Team-SIN-Code-Core (now monorepo) |
| A2A-SIN-Coding-CEO | archived → `Team-SIN-Code-Core/agents/coding-ceo` |
| A2A-SIN-Code-AI | archived → `Team-SIN-Code-Core/agents/code-ai` |
| opensin-ai-code | archived → `OpenSIN/opensin_agent_platform` |
| OpenSIN-overview | OpenSIN-overview (now with START-HERE.md) |
| OpenSIN-documentation | OpenSIN-documentation (unchanged role) |

## Follow-ups

1. Diff `OpenSIN/opensin_agent_platform/` against `OpenSIN/opensin_core/`
   (both have `hooks`, `plugins`, `skills` modules). Port any genuinely
   useful logic into `opensin_core` and retire the folder.
2. Extend `Team-SIN-Code-Core` with `agents/code-devops/` and
   `agents/code-datascience/` instead of creating new repos for them.
3. Run `discover-agents.js` and `registry/MASTER_INDEX.md` regeneration
   so the indexes reflect the new layout.
