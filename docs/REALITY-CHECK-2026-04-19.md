# Reality check — 2026-04-19

## 0. Resolution (added 2026-04-19 19:00 UTC — authenticated re-run)

> **The v1 of this diagnostic was based on an anonymous GitHub API view and was materially wrong.** The §§ below are preserved verbatim as an audit trail of the diagnostic path (hypotheses, evidence pattern, recommended re-runs). This § 0 is the **authoritative resolution**.
>
> Hypothesis C ("there's a private mirror we can't see") was correct. Run with a maintainer token (`gh api orgs/OpenSIN-AI/repos?type=all`) resolves every gate:

| Metric | v1 doc (anon view) | v2 authenticated | Reality |
|---|---:|---:|---|
| Total repos | 55 | **205** | 150 repos were private (not missing) |
| `A2A-SIN-*` live | 20 | **103** | ~5× the anon-view count |
| `Team-SIN-*` | 0 | **17 live** | all team repos exist as real Node/TS services |
| `OpenSIN-backend`, `OpenSIN-WebApp`, `website-*`, `Biz-SIN-*`, `Core-SIN-*`, `Template-SIN-*`, all 6 `A2A-SIN-Code-*` | "MISSING" | **all private + live** | none of them are fictional |
| Phantom agent IDs (MAN-1) | 70 | **0** | every unique ID in `templates/teams/*.json` resolves to a live repo |

**Corrected launch gate status** (supersedes § 2 below):

| Gate | Target repo | Status 2026-04-19 |
|---|---|---|
| G1 `opensin.ai` | `website-opensin.ai` | live, private, pushed today |
| G2 `my.opensin.ai` | `website-my.opensin.ai` | live, private, pushed today |
| G3 `docs.opensin.ai` | `OpenSIN-documentation` | live public |
| G4 `chat.opensin.ai` | `OpenSIN-WebApp` | live private (59 MB, pushed today) |
| G5 Stripe E2E | WebApp + my.opensin.ai | both live |
| G6 Marketplace purchase | same | both live |
| G7 6× HF Spaces | 6× `A2A-SIN-Code-*` | all 6 repos exist private (verify HF Space status separately) |
| G8 `npm i -g opensin-code` | `OpenSIN-Code` | live public |
| G9 `pip install opensin` | `OpenSIN` | live public |
| G10 zero `Delqhi/*` refs | org-wide | in progress (L1) |

**None of the 10 gates is blocked by missing repos.** The real work for launch is deploy/smoke-test, not scaffold-from-nothing.

**Updates to follow-up tickets:**

- **MAN-1** ("70 phantom agents") — **CLOSE** as false-positive. Every manifest ID resolves to a live repo under authenticated access.
- **MAN-2** ("orphan A2A repos") — **EXPAND from 7 → 16** with the new visibility (see [`WORKFORCE § 3.2`](../WORKFORCE.md)).
- **MAN-3** (empty `Team-SIN-Media-Music.json`) — still valid.
- **MAN-4** ("17 GitHub Teams don't exist") — still valid. `gh api orgs/OpenSIN-AI/teams` returns only `core-team` and `admin-team`; the domain-team slugs referenced in CODEOWNERS and manifests are inert. `.github/CODEOWNERS` was corrected on 2026-04-19 (`@OpenSIN-AI/core` → `@OpenSIN-AI/core-team`); the 17 domain-team slugs in `templates/teams/*.json` `review_teams[]` fields still need either (a) actual GitHub Teams created, or (b) normalization to `core-team`.
- **MAN-5** ("Template-SIN-Agent missing") — **CLOSE**, repo exists.
- **MAN-6** (per-surface DRI assignment) — still open; unchanged.
- **MAN-7** (`check-state-of-the-union.js`) — still open and arguably more important now (the absence of this script was exactly what made the v1 diagnostic possible). See `scripts/reality-check.js` added in this PR as the first implementation.

**Lesson for future audits:**

> **Any OpenSIN-AI repo audit MUST use an authenticated `gh` session.** Running `gh auth status` to confirm a maintainer token is the mandatory step zero. The anonymous API view hides 73% of the org (150 of 205 repos) — which looks indistinguishably like "these repos don't exist" unless you know to check.

The audit script added in this PR (`scripts/reality-check.js`) hard-errors if `GITHUB_TOKEN` is absent, to prevent this class of mistake from recurring.

---

## v1 diagnostic (preserved verbatim from the anonymous-view run) — DO NOT CITE FOR CURRENT FACTS

The section below was written when the audit token only had public-repo visibility. It correctly formulated the right hypotheses (A/B/C) and correctly recommended re-running with a maintainer token — which resolved the question. Preserved as a record of the diagnostic method, not as current data.

> **Scope:** This document is a live-audit diagnostic. It compares what the canon-locked docs (`STATE-OF-THE-UNION.md`, `START-HERE.md`, `LAUNCH-CHECKLIST.md`, `registry/MASTER_INDEX.md`) **claim** exists against what **actually** exists in `OpenSIN-AI/` today.
>
> **Finding:** Systematic drift. The docs describe a post-launch-shaped org; the actual org is roughly one-third of that. Several launch gates reference repos that do not exist.
>
> **Why this doc exists:** `scripts/check-workforce.js` catches drift between one doc (WORKFORCE.md) and one set of files (`templates/teams/*.json`). It does NOT catch drift between governance docs and the live GitHub org. That class of bug was invisible until this audit.
>
> **Authoring:** drafted 2026-04-19 after org-wide `gh repo list` + per-repo `gh repo view` verification against every ref in the launch docs. Data source commands at the end of the doc so any reader can rerun.

---

## 1. Top-line numbers — claim vs reality

| Metric | Docs claim | Reality (2026-04-19) | Delta |
|---|---:|---:|---:|
| Total repos in org | 205 | **55** | −150 |
| Live (non-archived) | 177 | **49** | −128 |
| Archived | 28 | **6** | −22 |
| `A2A-SIN-*` | 109 | **24** (20 live, 4 archived) | −85 |
| `Team-SIN-*` repos | 17 | **0** (teams live as manifest files in *this* repo only) | −17 |
| `Biz-SIN-*` | 7 | **4** | −3 |
| `Infra-SIN-*` | 6 | **4** | −2 |
| `MCP-SIN-*` | 7 | **0** | −7 |
| `Template-SIN-*` + `Template-A2A-*` | 5 | **0** | −5 |
| `Skill-SIN-*` | 3 | **0** | −3 |
| `website-*` | 4 | **1** (`website-blog.opensin.ai`) | −3 |
| Active org members | "all maintainers" | **2** (`DaSINci`, `Delqhi`) | n/a (docs never enumerated) |

Numbers are derived from: `gh repo list OpenSIN-AI --limit 400 --json name,isArchived,visibility` (returns 55) and `gh api "orgs/OpenSIN-AI/repos?type=all" --jq 'length'` (also 55). All repos are PUBLIC; no private repos are hidden from the audit token.

---

## 2. Launch-gate impact

Every one of the 10 Go/No-Go gates in [`LAUNCH-CHECKLIST § 0`](../LAUNCH-CHECKLIST.md) currently references at least one non-existent repo or an impossible precondition. Red = target repo does not exist. Yellow = target repo exists but the precondition is not yet verifiable.

| Gate | Target repo | Exists? | Notes |
|---|---|---|---|
| G1 `opensin.ai` renders | `website-opensin.ai` | 🔴 MISSING | no repo in the org |
| G2 `my.opensin.ai` renders | `website-my.opensin.ai` | 🔴 MISSING | no repo |
| G3 `docs.opensin.ai` renders | `OpenSIN-documentation` | 🟢 exists | testable |
| G4 `chat.opensin.ai` login works | `OpenSIN-WebApp` | 🔴 MISSING | no repo |
| G5 Stripe end-to-end Starter | `OpenSIN-WebApp` + `website-my.opensin.ai` | 🔴 MISSING | both missing |
| G6 Marketplace purchase | same | 🔴 MISSING | both missing |
| G7 6× HF Spaces `a2a-sin-code-*` | 6× `A2A-SIN-Code-*` | 🔴 MISSING | none of the 6 repos exist |
| G8 `npm i -g opensin-code` | `OpenSIN-Code` | 🟢 exists | testable; PyPI publish is the real work |
| G9 `pip install opensin` | `OpenSIN` | 🟢 exists | testable; PyPI publish is the real work |
| G10 zero `Delqhi/*` refs | org-wide | 🟡 in progress | tracked as L1 in FOLLOWUPS |

**Conclusion:** 7 of 10 gates are either impossible or blocked on repos that do not exist. G3/G8/G9 are the only gates that can even be attempted on the current org topology.

---

## 3. Referenced-but-missing repos (from launch docs)

Referenced in `LAUNCH-CHECKLIST.md`, `STATE-OF-THE-UNION.md`, `WORKFORCE.md`, and/or `START-HERE.md` but not present in the org:

### Launch-critical (blocks a Go/No-Go gate)

- `OpenSIN-backend` — "Fleet Control Plane", appears in HF-1, HF-2, CP-1, MP-3, PRO-5, PRO-6, and every tier-2 gate
- `OpenSIN-WebApp` — "chat.opensin.ai", appears in G4, G5, G6, PRO-4, PRO-5, PRO-6, MP-3
- `website-opensin.ai` — appears in G1, OSS-1, OSS-2
- `website-my.opensin.ai` — appears in G2, PRO-1, PRO-2, PRO-3, MP-1, MP-2
- `A2A-SIN-Code-Backend`, `-Command`, `-Frontend`, `-Fullstack`, `-Plugin`, `-Tool` — the 6 HF-Space targets of G7

### Supporting (referenced but not gate-blocking)

- `Biz-SIN-Marketing` — owner of the announcement pipeline
- `Core-SIN-Control-Plane` — target of CP1
- `Template-SIN-Agent` — worker scaffolding template
- 17× `Team-SIN-*` repos — the manifests live here, not in separate repos (documented in [WORKFORCE § 1](../WORKFORCE.md))
- `Infra-SIN-Docker-Empire` — listed in STATE-OF-THE-UNION § 2.2 table

### Inferred-but-unverified

- `A2A-SIN-X-Twitter`, `A2A-SIN-Discord`, `A2A-SIN-MiroFish` — cited as "flagship" in STATE-OF-THE-UNION § 3.1 with specific MB sizes; not present in the org listing

---

## 4. Inverse drift — live repos the docs never mention

7 `A2A-SIN-*` repos exist but are not registered in any team manifest *and* are not mentioned in the doc prose:

```
A2A-SIN-Nintendo        A2A-SIN-WebChat           A2A-SIN-Xbox
A2A-SIN-PlayStation     A2A-SIN-WhatsApp          A2A-SIN-Zoom
A2A-SIN-Worker-heypiggy
```

Tracked as **MAN-2** in [`FOLLOWUPS.md`](./FOLLOWUPS.md). Either assign them to a manifest pre-launch or they render as dark/unlisted on the marketplace — which is probably the right call for the 4 gaming ones, but WhatsApp/WebChat/Zoom look like real candidates for the Messaging team.

---

## 5. Interpretation — is this a bug or a plan?

Two possibilities, both need an explicit CTO call:

### Hypothesis A — "the docs are aspirational"

The canon-locked docs describe the **post-launch target state** of the org, not the current state. The missing repos exist on a roadmap, not on GitHub. If true:

- The `STATE-OF-THE-UNION.md` framing ("Live-Audit via `gh repo list`") is misleading and needs to be retagged as "target state"
- The `LAUNCH-CHECKLIST.md` is a 4-day build-from-nothing plan, not a verification-of-existing plan
- The real T-4 status is: **7 repos need to be scaffolded, codified, deployed, and tested in 4 days**, which is not feasible for 2 maintainers
- **Implication:** launch slip is almost certain; the 2026-04-23 date needs to move

### Hypothesis B — "the docs drifted silently"

The doc numbers were written once, never re-audited, and slid into fiction. If true:

- The `WORKFORCE.md` drift-check (`scripts/check-workforce.js`) needs a sibling for the other canon-locked files
- All four canon-locked docs get rewritten against live data before 2026-04-22 code-freeze
- The launch scope shrinks to what's actually buildable on the 4 real Code repos (`OpenSIN`, `OpenSIN-Code`, `OpenSIN-documentation`, plus the 17 live A2A bridges)

### Hypothesis C — "there's a private mirror we can't see"

The audit token is `vercel[bot]` with repo-public scope. All 55 listed repos are PUBLIC. But there could be a parallel private repo set under a different org that the docs are describing. If true:

- The audit must be rerun with a personal maintainer token
- The private repos need to be moved, redirected, or publicly mirrored before launch (customers can't buy from a private repo)

---

## 6. What this diagnostic does NOT do

- It does not rewrite any canon-locked doc. Canon-lock approval (`GOVERNANCE.md § 3.2`) is required first.
- It does not change the launch date. Timing decision is CTO's.
- It does not delete the missing-repo references. Until the CTO picks A/B/C above, the references stay so the intent is traceable.

---

## 7. What this diagnostic DOES recommend

Minimum-viable actions, ordered by urgency:

1. **CTO picks A/B/C above** — 2026-04-19 EOD. Until picked, every other launch task is speculative.
2. **Run `gh repo list` under a human maintainer token** (`DaSINci` or `Delqhi`) — rules out Hypothesis C in one command: `gh repo list OpenSIN-AI --limit 400 --json name`. If it returns something materially different from 55, this whole doc needs revision.
3. **Stop editing canon-locked docs until A/B/C is picked.** Any edit that silently fixes a number without CTO sign-off is *more* drift.
4. **Land `scripts/check-state-of-the-union.js`** — a sibling of `check-workforce.js` that fails CI if `STATE-OF-THE-UNION.md` repo counts drift from `gh repo list`. Tracked as **MAN-7** in FOLLOWUPS.
5. **Action the three live issues that are real regardless of A/B/C:**
   - **MAN-1** phantom agents (70 unique agent IDs with no backing repo)
   - **MAN-2** orphan A2A repos (7 live repos in no manifest)
   - **MAN-3** empty `Team-SIN-Media-Music.json` manifest

---

## 8. Data source — rerunnable audit

Every number in this doc came from running these commands in this sandbox at 2026-04-19 ~16:00 UTC:

```bash
# total repos
gh repo list OpenSIN-AI --limit 400 --json name,isArchived,visibility \
  | jq 'length'                                  # → 55

# archived breakdown
gh repo list OpenSIN-AI --limit 400 --json isArchived \
  | jq 'group_by(.isArchived) | map({archived: .[0].isArchived, count: length})'
# → [{"archived": false, "count": 49}, {"archived": true, "count": 6}]

# prefix distribution (live only)
gh repo list OpenSIN-AI --limit 400 --json name,isArchived \
  -q '.[] | select(.isArchived | not) | .name' \
  | awk -F- '{print $1"-"$2}' | sort | uniq -c | sort -rn

# org members
gh api orgs/OpenSIN-AI/members --jq '.[].login'
# → DaSINci, Delqhi

# live A2A repos vs manifest IDs
gh repo list OpenSIN-AI --limit 400 --json name,isArchived \
  -q '.[] | select(.name | startswith("A2A-SIN-")) | select(.isArchived | not) | .name' \
  | sort > /tmp/live.txt
cat templates/teams/*.json \
  | grep -oE '"id":\s*"A2A-SIN-[^"]+"' | sort -u \
  | sed 's/.*"\(A2A-SIN-[^"]*\)"/\1/' > /tmp/manifest.txt
comm -12 /tmp/live.txt /tmp/manifest.txt    # → 17 live-and-registered
comm -23 /tmp/live.txt /tmp/manifest.txt    # → 7 orphans
comm -13 /tmp/live.txt /tmp/manifest.txt    # → 70 phantom IDs
```

If any of these commands return different numbers on re-run, update this doc or open a `workforce-drift` bug (whichever is correct).
