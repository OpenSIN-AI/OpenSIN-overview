# Launch Retrospective — 2026-04-23

> **Living document.** Append entries during launch week (T-4 → T+7) and the post-launch week. Anything below the "P1 — Pre-launch" section is filled in chronologically as it happens.
> **Owner:** CTO. Review every entry before T+7 retro.
> **Why this lives in this repo:** the org-index repo owns governance + post-mortems for org-wide events. Per-repo incidents live in those repos' own `INCIDENTS/` folders.

---

## Format for new entries

```
### YYYY-MM-DD HH:MM UTC — <one-line title>
**Severity:** P0 / P1 / P2
**Duration:** <how long the impact lasted>
**Affected:** <which surfaces / users>
**Detection:** how did we notice
**Resolution:** what we did
**Follow-up:** link to issue or PR
```

P0 = paying users impacted, money lost, or data integrity risk.
P1 = launch-blocker or significant degradation.
P2 = noticeable but workaround exists.

---

## P1 — Pre-launch (filled before launch)

### 2026-04-19 12:00 UTC — Live n8n API key found in public README

**Severity:** P1 (security, pre-launch)
**Duration:** key was committed in earlier governance PRs; tree redacted on 2026-04-19.
**Affected:** none confirmed externally. Key has admin access to the n8n instance that triggers all CI runs.
**Detection:** pre-launch best-practices sweep (`scripts/scan-secrets.sh`).
**Resolution:** redacted from `README.md`, `docs/best-practices/ci-cd-n8n.md`, `docs/03_ops/inbound-intake.md`, `.pcpm/rules.md` and `docs/best-practices/ci-cd-n8n.md` (Docker bridge IP). Operator action required: rotate the key in the n8n UI; the value still exists in git history.
**Follow-up:** added `scripts/scan-secrets.sh` + proposed `secret-scan.yml` CI workflow + `.husky/pre-commit` hook so the same class of leak fails the build going forward.

### 2026-04-19 12:30 UTC — WORKFORCE.md inflated worker counts

**Severity:** P2 (correctness, public-facing claim)
**Duration:** at least one Wave-4 PR had the inflated numbers.
**Affected:** marketing-adjacent claim ("149 workers") that does not match the actual manifest data (89 workers).
**Detection:** parallel manifest count vs document claim during best-practices sweep.
**Resolution:** all per-team rows recomputed from `templates/teams/*.json`, total updated to 89.
**Follow-up:** added `scripts/check-workforce.js` (run by `npm run validate` and the pre-commit hook). Drift now fails CI.

### 2026-04-19 12:45 UTC — LAUNCH-CHECKLIST weekday labels off by 3–4 days

**Severity:** P2 (planning correctness)
**Duration:** since the file was written.
**Affected:** any human or agent reading the day-by-day plan would mis-schedule.
**Detection:** date arithmetic during best-practices sweep.
**Resolution:** rewrote the day headers (Tag 1 = Sun T-4, Tag 2 = Mon T-3, Tag 3 = Tue T-2, Tag 4 = Wed T-1 Code-Freeze, Tag 5 = Thu T-0 Launch). Tag 4 was missing entirely and has been added.
**Follow-up:** none — single-shot fix. Future LAUNCH-CHECKLIST templates should compute weekday from date at render time.

---

## P0 — Launch day (Donnerstag 2026-04-23)

_Append entries here as they happen._

---

## Post-launch week (T+1 → T+7)

_Append entries here as they happen._

---

## Retro meeting — 2026-04-30

_To be filled at the meeting._

- What worked
- What didn't
- What we'll change for the next launch
- Action items with owners and dates
