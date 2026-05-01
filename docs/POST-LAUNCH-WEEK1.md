# Post-Launch Week 1 Plan — 2026-04-24 → 2026-04-30

> What happens in the 7 days after launch. Focus: **stabilize, learn, close Wave-5 tickets**, not ship new features.
> Parent: [LAUNCH-CHECKLIST.md](../LAUNCH-CHECKLIST.md) · Precedes: Wave 6 (features)

## Guiding principles

1. **No new features this week.** Every hour spent on new features is an hour not spent on real-user feedback. Freeze `feat/*` branches.
2. **Every incident becomes a ticket.** No verbal fixes. Label everything `launch-incident`.
3. **User feedback > internal plans.** If 3 users ask the same question, that question becomes a docs ticket or a product change — in that order.
4. **Measure, then decide.** Do not tune what you cannot measure. Day 1 is for instrumenting, not optimizing.

## Daily rhythm

| Time  | Action                                                                               |
| ----- | ------------------------------------------------------------------------------------ |
| 09:00 | Stand-up: read all new `launch-incident` issues, triage severity, assign owner       |
| 09:30 | Fix S1/S2 from yesterday. No exceptions.                                             |
| 13:00 | Read all support messages / Twitter mentions / Discord. Route to issues.             |
| 16:00 | Run `pnpm run launch-status`. Post screenshot in tracking issue. If RED → triage.    |
| 17:30 | Daily metrics post: signups, paid conversions, marketplace sales, DAU, top 3 errors. |

## Day-by-day

### Day 1 — T+1 (Thu 2026-04-24) — Instrument everything

- [ ] Sentry: verify all 6 production deploys are reporting. If not, install.
- [ ] UptimeRobot: 1-min probes on 6 HF Spaces + 3 Vercel domains + Supabase project REST URL.
- [ ] Stripe: set up webhook retry alerting (Slack/Email on any 4xx or 5xx).
- [ ] PostHog or equivalent: product analytics installed on chat.opensin.ai and my.opensin.ai. Minimum events: signup, checkout_start, checkout_complete, first_agent_run.
- [ ] Create shared Notion/Linear dashboard: signups today, MRR, active users, top errors, open incidents.
- [ ] **Wave 5 tickets begin.** First priority: `overview#R1`, `overview#R2`, `overview#L1`, `overview#L2`, `overview#CP1`, `overview#M2`. See [FOLLOWUPS.md](./FOLLOWUPS.md).

### Day 2 — T+2 (Fri 2026-04-25) — Fix what users complained about

- [ ] Read every support ticket from day 1. Group by root cause.
- [ ] The top 3 complaints become PRs today. No discussion — fix.
- [ ] Stripe: reconcile first 48h of payments. Any failed webhook replays? Any abandoned carts? Why?
- [ ] Community: reply to every single Twitter mention, HN comment, Discord question personally. This is week-1 only; it does not scale.

### Day 3 — T+3 (Sat 2026-04-26) — Close R1 + R2

- [ ] **R1** — decide merge-vs-split `OpenSIN-Code` ↔ `opensin-ai-cli`. Archive loser. See [FOLLOWUPS.md#R1](./FOLLOWUPS.md).
- [ ] **R2** — archive or merge `opensin-ai-platform` (10.9 MB dead code).
- [ ] Update MASTER_INDEX via `node scripts/generate-master-index.js`.
- [ ] Post weekend metrics summary.

### Day 4 — T+4 (Sun 2026-04-27) — On-call rotation handoff

- [ ] CEO hands primary on-call to rotation (`@LuKeRemote76` → next person).
- [ ] All runbooks linked from on-call playbook.
- [ ] Reduce alert noise: if an alert fired >5× and was not actionable, tune threshold.

### Day 5 — T+5 (Mon 2026-04-28) — Close CP1 + L-series debt

- [ ] **CP1** — merge `Core-SIN-Control-Plane` into `OpenSIN-backend`. Archive original.
- [ ] **L2** — legal bundle live (Privacy, ToS, Cookie banner, LICENSE audit on website-my).
- [ ] **L1** — auth + Stripe portal hardening in chat.opensin.ai. Add MFA if not present.
- [ ] Retrospective prep: collect 3 things that went well, 3 that did not, 3 to change.

### Day 6 — T+6 (Tue 2026-04-29) — Marketplace polish

- [ ] **M2** — finalize `oh-my-sin.json` aggregator schema. All 17 Team manifests must pass `pnpm run validate`.
- [ ] Marketplace search + filter working. If not: scope cut to "17 cards, click → buy, no filter" and accept as MVP.
- [ ] First marketplace sale reconciled end-to-end in Stripe dashboard.

### Day 7 — T+7 (Wed 2026-04-30) — Retro + Wave 6 plan

- [ ] 60-min retrospective with the whole team. Format: written Dock + 15-min discussion.
- [ ] Publish a public "Week 1 by the numbers" blog post on `website-opensin.ai`.
- [ ] Plan Wave 6 (features): top 3 user-requested features become Wave-6 tickets.
- [ ] Close this tracking issue. Move on-call to steady-state rotation.

## Metrics targets (soft)

These are not guarantees. They are what success looks like if nothing goes sideways.

| Metric                       | End of day 1 | End of week 1     |
| ---------------------------- | ------------ | ----------------- |
| Free tier signups            | 200          | 2 000             |
| Paid (tier 2) conversions    | 10           | 100               |
| Marketplace (tier 3) sales   | 3            | 30                |
| Uptime (chat.opensin.ai)     | ≥ 99.0 %     | ≥ 99.5 %          |
| Sentry error rate            | ≤ 2 %        | ≤ 0.5 %           |
| First-agent-run success rate | ≥ 80 %       | ≥ 95 %            |
| NPS (via in-product survey)  | n/a          | baseline captured |

Miss a target by >30% → post-mortem and adjust. Miss by <30% → keep going.

## Hard rules

- **No feature shipped this week** unless it is a direct fix for a launch-incident.
- **No scope creep.** Wave-6 planning happens day 7, not day 3.
- **Every fix gets a test.** Even if the test is a one-line curl in CI.
- **Every outage gets a blameless post-mortem** in a week-1 recap doc before it is allowed to close.

## Exit criterion — "week 1 is done"

All 4 must be true:

1. Zero S1 open for 48 consecutive hours.
2. `pnpm run launch-status` GREEN for 5 consecutive runs.
3. R1, R2, L1, L2, CP1, M2 all closed or explicitly deferred with a new ticket.
4. Week-1 blog post published.

When all 4 true → move to normal cadence and close the launch milestone.
