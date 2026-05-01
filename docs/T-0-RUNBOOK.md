# T-0 Launch Day Runbook — 2026-04-23

> Hour-by-hour playbook for launch day. Every step has an owner, a verification command, and a rollback.
> Source of truth for launch-day decisions. Owner: `@LuKeRemote76`.
> Parent: [LAUNCH-CHECKLIST.md](../LAUNCH-CHECKLIST.md) · Tracking issue: `overview#TBD` · CEO directive: [`overview#40`](https://github.com/OpenSIN-AI/OpenSIN-overview/issues/40)

## Pre-flight — evening before (2026-04-22, 18:00–22:00 CET)

| Time  | Owner     | Action                                                                       | Verify                                                                       | Rollback              |
| ----- | --------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | --------------------- |
| 18:00 | release   | Freeze `main` on all 6 canonical repos. Only hotfix PRs.                     | Branch protection rule visible in repo settings                              | Remove branch rule    |
| 18:15 | infra     | Run `pnpm run launch-status` against overview. Must be GREEN.                | Exit 0                                                                       | Fix whatever is RED   |
| 18:30 | backend   | Verify all 6 HF Spaces `/health` returns 200 for 10 consecutive minutes      | `for i in 1..10: curl -sf https://opensin-ai-a2a-sin-code-*.hf.space/health` | Restart via HF API    |
| 19:00 | stripe    | Execute full `docs/STRIPE-SMOKE-TEST.md` in LIVE mode with real card ($1)    | Pro role visible, refund issued                                              | Disable checkout link |
| 20:00 | marketing | Preview `website-opensin.ai` + `website-my.opensin.ai` production builds     | Lighthouse mobile ≥ 90, 0 JS errors                                          | Rollback deploy       |
| 21:00 | ops       | Verify monitoring: UptimeRobot, Sentry, Stripe dashboards all open on TV     | Dashboards reachable                                                         | n/a                   |
| 21:30 | on-call   | On-call rotation confirmed: L1 = `@LuKeRemote76`, L2 = TBD, L3 (CEO) = owner | Published in pinned Slack/Discord msg                                        | n/a                   |
| 22:00 | all       | GO/NO-GO call. Any RED item → delay 24h. Any AMBER → explicit waiver.        | CEO says GO                                                                  | Delay                 |

## T-0 day itself (2026-04-23)

### 06:00 CET — Open command center

- [ ] `@on-call` opens the tracking issue `overview#TBD` and pins it in team chat
- [ ] Start a 5-minute `pnpm run launch-status` loop in a terminal, piped to a log file
- [ ] Confirm DNS TTLs are low (≤300s) for all 3 domains (opensin.ai, my.opensin.ai, chat.opensin.ai)

### 08:00 CET — Final sweep

- [ ] All 6 Launch Gate issues GREEN:
  - `OpenSIN-Code#1117`
  - `OpenSIN-WebApp#14`
  - `OpenSIN-backend#1172`
  - `website-my.opensin.ai#81`
  - `website-opensin.ai#128`
  - `Infra-SIN-OpenCode-Stack#31`
- [ ] Run `node scripts/generate-master-index.js` one more time. Commit if diff.
- [ ] Run `pnpm run validate` — 0 broken links, 17/17 manifests valid.

### 10:00 CET — T-0 announcement

| Time  | Action                                                                               | Owner     |
| ----- | ------------------------------------------------------------------------------------ | --------- |
| 10:00 | CEO flips `website-opensin.ai` DNS to production                                     | `@owner`  |
| 10:01 | Post "we are live" on Twitter/X, HN (Show HN), LinkedIn, Discord                     | marketing |
| 10:05 | Enable Stripe LIVE keys on `website-my.opensin.ai` + `OpenSIN-WebApp`                | stripe    |
| 10:10 | Send pre-launch waitlist email (tier 1 → free, tier 2 → 30% launch discount code)    | marketing |
| 10:15 | Enable marketplace (Tier 3) purchase flow                                            | stripe    |
| 10:30 | Start posting in relevant subreddits (r/LocalLLaMA, r/MachineLearning, r/selfhosted) | marketing |

### 11:00–18:00 CET — Watch phase

Every 30 minutes, repeat this loop:

1. `pnpm run launch-status` → copy output to tracking issue comment
2. Check Sentry error rate: if > 1% of requests errors, page L1
3. Check Stripe webhook success rate: if < 99%, page `@stripe-owner`
4. Check HF Spaces uptime: if any space flaps > 2 times in 30 min, trigger fallback plan
5. Scan Twitter/Discord for bug reports, route to GitHub issue tagged `launch-incident`

### 18:00 CET — Day-1 retrospective

- [ ] Post day-1 stats in tracking issue:
  - Signups (free tier)
  - Paid conversions (tier 2)
  - Marketplace purchases (tier 3)
  - Incidents filed (count + severity)
  - Top 3 user complaints
- [ ] CEO decides: continue watch, or hand off to on-call rotation.

## Incident triage

### Severity levels

| Sev | Definition                                    | SLA to respond | Example                                      |
| --- | --------------------------------------------- | -------------- | -------------------------------------------- |
| S1  | Full outage or payment broken (revenue stops) | 5 min          | chat.opensin.ai 500, Stripe webhook 4xx loop |
| S2  | Major feature broken, workaround exists       | 30 min         | Marketplace buy button fails but checkout OK |
| S3  | Minor UX bug, cosmetic, no data loss          | next day       | Mobile nav overflow on one page              |
| S4  | Feature request or "would be nice"            | next sprint    | —                                            |

### Who pages whom

```
S1 detected → @on-call (L1) → if not fixed in 15 min → @L2 → if not fixed in 30 min → @CEO
S2 detected → @on-call (L1) → post in launch channel
S3/S4       → open GitHub issue with label `launch-incident`, triage tomorrow
```

### Rollback matrix

| What broke              | Rollback command                                                             | Recovery time |
| ----------------------- | ---------------------------------------------------------------------------- | ------------- |
| `website-opensin.ai`    | `vercel rollback --yes` in repo                                              | ~30 s         |
| `website-my.opensin.ai` | `vercel rollback --yes` + disable Stripe LIVE keys in env                    | ~1 min        |
| `chat.opensin.ai`       | `vercel rollback --yes` + revoke all session tokens via Supabase admin       | ~2 min        |
| `OpenSIN-backend`       | `bash governance/workflows-proposed/install.sh` then redeploy previous image | ~5 min        |
| HF Spaces (1–2 down)    | `curl -X POST https://huggingface.co/api/spaces/.../restart -H "Auth..."`    | ~3 min        |
| HF Spaces (all 6 down)  | Switch `chat.opensin.ai` to maintenance mode, restart entire fleet           | ~10 min       |
| Stripe webhook broken   | Stripe Dashboard → disable live mode → fix → replay events                   | ~15 min       |
| Supabase outage         | Post status banner, cannot mitigate — wait for Supabase                      | external      |

### Communication template (post in launch channel + Twitter)

```
[status] <sev-1> <what> <since when>
Impact: <who is affected>
Cause: <one sentence or "investigating">
Mitigation: <what we are doing>
ETA: <number> min
Next update: <time>
```

Repeat every 15 min until resolved.

## Day 2 (T+1, 2026-04-24)

See [POST-LAUNCH-WEEK1.md](./POST-LAUNCH-WEEK1.md).

## Go/No-Go waiver log

If any item is AMBER at 22:00 pre-flight and the team decides to launch anyway, log the decision here:

```
2026-04-22 22:00 | Item: <id> | Status: AMBER | Waived by: <CEO> | Reason: <one line> | Mitigation: <one line>
```

Unwaived RED items must block launch. No exceptions — that is the whole point of the gate system.
