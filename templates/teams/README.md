# Team Manifests

17 marketplace team manifests, one per `Team-SIN-*` repo. Source of truth is here in `OpenSIN-overview`; copies live in the individual team repos and are kept in sync by `scripts/push-team-manifests.js`.

Each file conforms to [`../../schemas/team.schema.json`](../../schemas/team.schema.json). Decided in Wave 4 — see [`../../PRODUCT-VISION.md § Marketplace`](../../PRODUCT-VISION.md#marketplace--entschieden-option-a-metadata-manifeste).

## Catalogue

| Team | Tier | Status | Monthly addon (EUR) | Agents |
|---|---|---|---:|---:|
| Team-SIN-Apple | marketplace | beta | 9 | 12 |
| Team-SIN-Code-Backend | marketplace | alpha | 14 | 2 |
| Team-SIN-Code-Core | core-included | stable | — (free) | 3 |
| Team-SIN-Code-CyberSec | marketplace | beta | 29 | 16 |
| Team-SIN-Code-Frontend | marketplace | alpha | 14 | 2 |
| Team-SIN-Commerce | marketplace | beta | 19 | 5 |
| Team-SIN-Community | marketplace | beta | 9 | 3 |
| Team-SIN-Forum | marketplace | beta | 9 | 5 |
| Team-SIN-Google | marketplace | beta | 9 | 2 |
| Team-SIN-Infrastructure | marketplace | beta | 14 | 6 |
| Team-SIN-Legal | marketplace | beta | 29 | 7 |
| Team-SIN-Media-ComfyUI | marketplace | beta | 19 | 1 |
| Team-SIN-Media-Music | marketplace | coming-soon | 14 | 0 |
| Team-SIN-Messaging | marketplace | beta | 14 | 12 |
| Team-SIN-Microsoft | marketplace | alpha | 9 | 1 |
| Team-SIN-Research | marketplace | beta | 19 | 3 |
| Team-SIN-Social | marketplace | beta | 14 | 9 |

## How to edit

1. Edit `Team-SIN-<name>.json` here.
2. Validate: `node scripts/validate-team-manifests.js` (or use any JSON Schema 2020-12 validator against `schemas/team.schema.json`).
3. PR against `OpenSIN-overview/main`.
4. After merge, a maintainer runs `scripts/push-team-manifests.js` to sync the change into the individual `Team-SIN-*` repos.

## Why is the source of truth in `OpenSIN-overview` and not in each `Team-SIN-*` repo?

Centralising here makes review easy (17 files in one PR), makes validation trivial (one schema, one CI check), and keeps the 17 team repos lightweight (they host marketing-copy snapshots, not logic).

The individual `Team-SIN-*/team.json` files are **generated** from here. Treat the repo copy as read-only from a maintainer perspective.
