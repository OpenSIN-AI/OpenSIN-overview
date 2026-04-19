# S2 — Second Dead-Repo Audit

> **Owner:** `Team-SIN-Code-Core`.
> **Status:** audit complete 2026-04-19 (live data). Decision pending.
> **Tracks:** [`docs/FOLLOWUPS.md § S2`](./FOLLOWUPS.md).

## Scope

Six `A2A-SIN-Code-*` scaffolds. They were created as placeholders for a Rust-engine split but never filled with domain code.

## Live audit (gh API, 2026-04-19)

| Repo | Size | Last push | Commits | Open issues |
| ---- | ---- | --------- | ------- | ----------- |
| `A2A-SIN-Code-Backend`   | 11 kb | 2026-04-19 | 1 | 1 |
| `A2A-SIN-Code-Command`   | 11 kb | 2026-04-19 | 1 | 1 |
| `A2A-SIN-Code-Frontend`  | 11 kb | 2026-04-19 | 1 | 1 |
| `A2A-SIN-Code-Fullstack` | 11 kb | 2026-04-19 | 1 | 1 |
| `A2A-SIN-Code-Plugin`    | 11 kb | 2026-04-19 | 1 | 1 |
| `A2A-SIN-Code-Tool`      | 11 kb | 2026-04-19 | 1 | 1 |

**Interpretation:** identical 1-commit scaffolds. The push-date of 2026-04-19 reflects the M1 team-manifest mass-PR, not substantive code. These are still just folders with a `README.md` + `team.json`. Also: none of them is referenced by any `Team-SIN-*.json` in `templates/teams/` as a primary agent — they would be wrapped by an A2A protocol layer but the concrete agent repos today are `A2A-SIN-Aider`, `A2A-SIN-Cursor`, `A2A-SIN-Goose`, etc., not these scaffolds.

Root cause the scaffolds exist: they were planned to correspond 1:1 to the 6 HF Spaces (`opensin-ai-a2a-sin-code-{backend,command,frontend,fullstack,plugin,tool}`). But the HF Spaces don't currently run Rust engines behind them — they serve the generic A2A shim.

## Decision matrix

| Branch | Pre-condition | Action | Consequence |
| ------ | ------------- | ------ | ----------- |
| **Archive all 6** | R1 merges `opensin-ai-cli` → `OpenSIN-Code` (6 scaffolds become redundant) | Archive with `"DEAD — superseded by OpenSIN-Code"` README banner. Drop from `MASTER_INDEX` auto-regen (archived repos surface with `ARCHIVED` prefix already). Remove HF Space mapping. | Org-count drops 6. Clean mental model. Loses the 6 HF Spaces if no replacement. |
| **Implement 6 thin wrappers** | R1 decides to keep `opensin-ai-cli` as Rust engine | Each scaffold becomes a thin A2A-protocol wrapper that routes to a capability of the Rust engine. Each gets a dedicated agent-card.json. | Matches the 6 HF Spaces. Gives buyers a fine-grained permission model. Cost: 6 × ~2 days of implementation. |
| **Collapse to one** | R1 stays undecided past T-0 | Keep `A2A-SIN-Code-Fullstack` as the generic entry point, archive the other 5 as "experimental". | Lowest effort. Loses the fine-grained story but unblocks a launch. |

## Recommendation

**Branch 1 (archive all 6), conditional on R1 = merge.** We launch tier 2 with `OpenSIN-Code` as the canonical coding agent, surfaced via one A2A entry. Gate the decision behind R1 so we don't pre-commit.

If R1 is not decided by 2026-04-22 18:00 CET, fall back to **Branch 3 (collapse to one)** so nothing blocks T-0.

## Launch impact

**None.** The 6 scaffolds are not in the tier-2 launch gate. They are a clean-up concern, not a blocker. Whatever branch we take, the launch proceeds.

## Action items

- [ ] R1 owner decides by 2026-04-22 18:00 CET (tracked via `opensin-ai-cli#7` + `OpenSIN-Code#1116`).
- [ ] If branch 1: archive-with-banner script (reuse `scripts/push-team-manifests.js` pattern).
- [ ] If branch 2: implementation tickets per scaffold (6 tickets, one per repo).
- [ ] If branch 3: `Fullstack` stays, 5 others archived.
- [ ] Update `templates/oh-my-sin.json` if any of these are referenced (currently 0 references — verified 2026-04-19).
