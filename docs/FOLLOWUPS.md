# Open Follow-ups — Consolidation (Wave 3+)

> **Status:** 2026-04-18. This file tracks the remaining rationalization and link-sweep work after the April 2026 consolidation. Each ticket has a stable anchor ID so other docs can deep-link to it.

When all tickets here are `DONE`, delete this file.

---

## Rationalization tickets

### R1: `opensin-ai-cli` vs `OpenSIN-Code`

- **Status:** — Merged into OpenSIN-Code (2026-04-19)
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

## Wave 5 / reality-check tickets (2026-04-19)

> **Context:** surfaced during the 2026-04-19 reality-check audit — see [`docs/REALITY-CHECK-2026-04-19.md`](./REALITY-CHECK-2026-04-19.md). MAN-1 is the only one launch-blocking; the rest are cleanup-shaped but three of them (MAN-4, MAN-6, MAN-7) need resolution before 2026-04-22 code-freeze if launch proceeds on schedule.

### MAN-1: Phantom agents hidden from the marketplace

- **Status:** `RESOLVED — 2026-04-19` (authenticated audit + re-normalization).
- **Outcome:** 0 phantom agents. All 87 unique agent IDs across the 17 manifests resolve to live (non-archived) repos in `OpenSIN-AI/`.
- **Root cause of the original 70-phantom report:** the 2026-04-19 morning audit used an anonymous GitHub API view that hides private repos; 150 of the org's 222 repos were invisible to the unauthenticated token. See [`docs/REALITY-CHECK-2026-04-19.md § 0`](./REALITY-CHECK-2026-04-19.md) for the full resolution. **Lesson:** any OpenSIN-AI repo audit MUST run authenticated.
- **Defensive code that stays in place:** `scripts/build-oh-my-sin.js` still computes `live_agent_count` / `phantom_agent_count` and coerces all-phantom teams to `status: "coming-soon"`. The mitigation is strictly defence-in-depth now — if someone adds a new manifest agent ID in the future that doesn't resolve to a live repo, the build still fails gracefully. Current run: `agents: total=89 live=89 phantom=0`.
- **New guard that makes this class of drift shallow forever:** `scripts/reality-check.js` (new, in this PR) hard-errors if run without `GITHUB_TOKEN`. Wired into `.github/workflows/reality-check.yml` (proposed, needs admin install). Catches both the old incident class (doc says repo X exists but it doesn't) and its inverse (audit says repo X is fictional but it's actually private).

### MAN-2: Orphan A2A repos — live but unregistered

- **Status:** `OPEN` — count expanded from 7 → 16 on 2026-04-19 after authenticated re-audit surfaced 9 additional orphans previously hidden from the anon view.
- **What:** 16 live `A2A-SIN-*` repos are in the org but not referenced in any `templates/teams/*.json` manifest:

  ```
  A2A-SIN-Code-Backend       A2A-SIN-Code-Plugin        A2A-SIN-Nintendo          A2A-SIN-WebChat
  A2A-SIN-Code-Command       A2A-SIN-Code-Tool          A2A-SIN-PlayStation       A2A-SIN-WhatsApp
  A2A-SIN-Code-Frontend      A2A-SIN-Money-Poker        A2A-SIN-Twitter-X         A2A-SIN-Xbox
  A2A-SIN-Code-Fullstack     A2A-SIN-Money-Sports       A2A-SIN-Worker-heypiggy   A2A-SIN-Zoom
  ```

  Not listed (already handled): `A2A-SIN-SoundCloud`, `A2A-SIN-YouTube-Studio`, `A2A-SIN-Worker-Prolific`, `A2A-SIN-Skill-Coding-CEO`, `A2A-SIN-Switch` — these appear in manifests already.

- **Decision needed:**
  1. **Messaging (3):** assign `WhatsApp`, `WebChat`, `Zoom` to `Team-SIN-Messaging` manifest (bridge-shaped)
  2. **Gaming (4):** decide whether `Nintendo`, `PlayStation`, `Xbox`, plus the live `A2A-SIN-Switch` belong in a new `Team-SIN-Gaming` manifest or stay dark
  3. **Money (2):** `Money-Poker` and `Money-Sports` — likely `Team-SIN-Money-*` (new team) or fold under existing Commerce
  4. **Code-\* scaffolds (6):** blocked on **R1** decision (merge `opensin-ai-cli` or keep split). If merge: archive all 6 scaffolds. If split: assign to `Team-SIN-Code-Core` as supporting agents.
  5. **Twitter-X (1):** assign to `Team-SIN-Social`
  6. **Worker-heypiggy (1):** STATE-OF-THE-UNION calls it a "flagship passive-income worker" but it has no team slot; assign to `Team-SIN-Commerce` as `optional`, or document the exclusion
- **Owner:** `OpenSIN-overview` maintainers (this repo holds the manifests).

### MAN-3: Empty `Team-SIN-Media-Music.json` manifest

- **Status:** `OPEN`.
- **What:** `templates/teams/Team-SIN-Media-Music.json` exists but `agents: []`. Makes the team a Ghost Town in the aggregator — still listable but with 0 workers. The `build-oh-my-sin.js` coerce-to-coming-soon rule handles rendering, but the manifest itself is meaningless.
- **Decision needed:** fill with at least 1 phantom ID and a roadmap, OR delete the manifest file entirely.
- **Owner:** `OpenSIN-overview` maintainers.

### MAN-4: CODEOWNERS / manifest team slugs were inert

- **Status:** `PARTIAL MITIGATED — 2026-04-19` (code+docs normalized to `core-team`), `OPEN` (per-domain team creation decision).
- **What (resolved on 2026-04-19):** an authenticated `GET /orgs/OpenSIN-AI/teams` call returns exactly two teams: `core-team` and `admin-team`. The 17 domain-team slugs (`apple`, `google`, `microsoft`, `commerce`, `community`, `cybersec`, `forum`, `infrastructure`, `legal`, `media`, `messaging`, `research`, `social`, `code-core`, `code-backend`, `code-frontend`, `meta-tier`) that appeared in CODEOWNERS, dependabot.yml, and all 17 `templates/teams/*.json` `provenance.owner_team` fields were **inert** — GitHub silently ignores unknown team references, so branch protection and review routing were falling back to whichever repo-admin approved the PR.
- **Mitigations shipped in this PR:**
  - `.github/CODEOWNERS` — `@OpenSIN-AI/core` → `@OpenSIN-AI/core-team` (real team)
  - `.github/dependabot.yml` — 2× `reviewers: OpenSIN-AI/core` → `OpenSIN-AI/core-team`
  - `GOVERNANCE.md`, `CODE_OF_CONDUCT.md`, `templates/workflows/README.md` — 7 prose refs normalized
  - `templates/teams/*.json` ×17 — `provenance.owner_team` normalized to `OpenSIN-AI/core-team`
  - `scripts/validate-codeowners.js` — new guard that fails CI if any CODEOWNERS team slug is inert
- **Still OPEN (per-domain decision):** should the 17 domain-team slugs become real GitHub Teams? Options:
  - **A)** CTO creates 17 real GitHub Teams in the org and populates with relevant humans (heavy org-admin work; matches the original doc intent). Then this PR's normalization gets reverted for manifest `owner_team` fields.
  - **B)** Keep the normalization. One review channel (`core-team`) for everything. Fast, less granular. Recommended if staying at 2 humans for ≥3 months.
  - **C)** Hybrid: create only the teams with >5 agents (`Team-SIN-Code-*` cluster, `Team-SIN-Social`, `Team-SIN-Messaging`), leave small teams under `core-team`.
- **Owner:** CTO — needs `admin:org` to execute A or C.
- **Deadline:** 2026-04-22 18:00 UTC (code-freeze). After that, route everything through `core-team` and revisit post-launch.

### MAN-5: `Template-SIN-Agent` scaffolding repo

- **Status:** `RESOLVED — 2026-04-19` (false-positive from anon-audit).
- **Outcome:** `OpenSIN-AI/Template-SIN-Agent` exists as a private repo (`pushed_at: 2026-04-10`). The morning audit's `MISSING` verdict was from an anonymous API call that hid it. See [`docs/REALITY-CHECK-2026-04-19.md § 0`](./REALITY-CHECK-2026-04-19.md).
- **Remaining work:** nothing blocking, but the template should be reviewed and its contents audited by launch — it's the entry-point for every future A2A repo. Track post-launch if needed.

### MAN-6: Per-surface DRI pinning for 2-maintainer pager rotation

- **Status:** `OPEN` — **pre-launch blocker for incident response**.
- **What:** The org has exactly 2 active members (`DaSINci`, `Delqhi`). Every canonical surface (OSS / Pro / Marketplace / Meta) needs a primary + secondary DRI pinned so the T-0 pager rotation has a real target. Without this, the `13:00 – EOD Incident-Rotation` row in [`LAUNCH-CHECKLIST.md § 2 Tag 5`](../LAUNCH-CHECKLIST.md) has no one to escalate to.
- **Fix:** CTO writes a single PR with a DRI table in `WORKFORCE § 4` and `.github/CODEOWNERS`. Remove the placeholder "MAN-6 pending" line from `WORKFORCE.md` in the same PR.
- **Owner:** CTO.
- **Deadline:** 2026-04-22 18:00 UTC.

### MAN-7: Canon-doc drift-check against the live org

- **Status:** `DONE — 2026-04-19` (baseline landed), `OPEN` (number-table auto-check).
- **What landed:**
  - [`scripts/reality-check.js`](../scripts/reality-check.js) — scans every `OpenSIN-AI/<repo>` and `@OpenSIN-AI/<team>` mention across every tracked text file and fails CI if any doesn't resolve. Hard-errors without `GITHUB_TOKEN` to prevent the anonymous-API false-positive class. Recognizes no-`@` team refs in `dependabot.yml reviewers:` and manifest `owner_team` fields as valid idiomatic syntax.
  - [`scripts/validate-codeowners.js`](../scripts/validate-codeowners.js) — focused CODEOWNERS check. Validates every team slug and every individual `@user` handle.
  - [`governance/workflows-proposed/reality-check.yml`](../governance/workflows-proposed/reality-check.yml) — wires both into PR + daily-cron CI. Needs admin install via `governance/workflows-proposed/install.sh`.
  - Allow-list guard: `scripts/scan-secrets.sh` now allow-lists `CHANGELOG.md` and `docs/REALITY-CHECK-*.md` (the meta-bug where documenting a leak re-leaks it).
- **Still OPEN (number-table auto-check):** `STATE-OF-THE-UNION § 1` hand-authored numbers table (total repos, per-prefix counts, live/archived) has no automated check. Options:
  1. Tiny `scripts/check-state-of-the-union.js` that re-derives the numbers from the live org and diffs against the table; fail on ±2 drift.
  2. Stronger: generate `STATE-OF-THE-UNION § 1` from data, mark the section as auto-generated. Removes the class entirely.
- **Owner:** `OpenSIN-overview` maintainers. Post-launch priority.

---

### MAN-8: `Delqhi/Simone-MCP` still under a personal namespace

- **Status:** `OPEN`.
- **What:** `README.md` Critical-MCP table now correctly points at `https://github.com/Delqhi/Simone-MCP` (fixed in this PR — it was previously linking at the 404 `OpenSIN-AI/Simone-MCP`). But the repo itself lives under the personal `Delqhi/` namespace, not the org.
- **Why it matters:** every agent doc (`AGENTS.md`, `opensin-ai-agent-feature-spec.md`) names Simone-MCP as a **mandatory** capability. Having a mandatory dependency on a personal account is a bus-factor-1 risk and inconsistent with every other canonical dep which is org-owned.
- **Fix:** `@Delqhi` initiates a repo transfer `Delqhi/Simone-MCP` → `OpenSIN-AI/Simone-MCP`. GitHub keeps redirects for 1 year, so external links don't break. Update README afterwards.
- **Owner:** `@Delqhi`.
- **Deadline:** 2026-04-22.

---

## How to close a ticket

1. Do the work.
2. Change `Status:` to `DONE — <PR URL>`.
3. If all tickets in this file are `DONE`, delete the file and remove references from `CANONICAL-REPOS.md § 8 / § 9` and `CONSOLIDATION-2026-04.md § Wave 3`.
