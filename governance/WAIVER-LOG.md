# Launch Waiver Log

> Every launch-gate that goes live on 2026-04-23 while still RED must be waived here with the four required fields. No waiver = no launch.

## Format

Each waiver is an entry in the table below plus a linked sub-section with the full reasoning. Keep the table sortable and greppable.

| Waiver ID | Gate ID | Waived by | Compensating control | Expires |
| --------- | ------- | --------- | -------------------- | ------- |

## Rules

1. **Who can waive.** Only the owner of [`overview#40`](https://github.com/OpenSIN-AI/OpenSIN-overview/issues/40) (CEO directive) can sign a waiver.
2. **Required fields.** A waiver is invalid if any of the four table columns are missing.
3. **Compensating control.** Must be a testable, time-boxed action that reduces risk to acceptable during the waiver window (e.g. "manual Stripe reconciliation daily at 22:00 CET until W1-Mo").
4. **Expires.** No waiver may extend past 2026-04-30 (end of post-launch week 1). Anything longer becomes a proper wave-5 ticket.
5. **Public.** This log is committed to `main` and visible to every maintainer. No back-channel waivers.

## Process

1. Gate owner opens a PR editing this file to add the table row and reasoning sub-section.
2. `#40` owner reviews and merges. Merge = waiver granted.
3. On expiry, gate owner re-evaluates:
   - GREEN → edit this file, move row to "Resolved" section with final resolution link.
   - Still RED → open a wave-5 ticket and close the waiver with a link to it.

## Template for the reasoning sub-section

```
### W-YYYY-NN — <gate id>

- **Gate:** <short description + link>
- **Waived by:** @<github handle>
- **Waived on:** YYYY-MM-DD HH:MM UTC
- **Reason:** <one paragraph why RED is acceptable at T-0>
- **Compensating control:** <testable action, owner, cadence>
- **Expires:** YYYY-MM-DD
- **Success criterion:** <how we know the waiver can be closed>
- **Linked issues:** <list>
```

## Resolved

_No waivers granted yet. As of 2026-04-19 every gate is either GREEN or has an action-bound owner._
