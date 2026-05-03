# RecursiveMAS Integration Plan

## Decision

Integrate RecursiveMAS as an **optional, feature-flagged recursive reasoning layer** across the OpenSIN-AI multi-agent stack. It should augment the existing agent loop, not replace it.

## Why this fits

- OpenSIN already has A2A orchestration, subagents, MCP, memory, and a control plane.
- RecursiveMAS adds inner/outer latent recursion and improves agent-to-agent refinement.
- The right rollout shape is opt-in, so current behavior stays stable.

## Repo map

- **OpenSIN** — core engine primitives and reusable recursion hooks: https://github.com/OpenSIN-AI/OpenSIN/issues/1726
- **OpenSIN-backend** — rollout flags, telemetry, and operator controls: https://github.com/OpenSIN-AI/OpenSIN-backend/issues/1179
- **OpenSIN-Neural-Bus** — event subjects, trace replay, durable handoffs: https://github.com/OpenSIN-AI/OpenSIN-Neural-Bus/issues/14
- **Infra-SIN-OpenCode-Stack** — canonical config and sync surface: https://github.com/OpenSIN-AI/Infra-SIN-OpenCode-Stack/issues/65
- **OpenSIN-overview** — SSOT, decision record, and rollout coordination: https://github.com/OpenSIN-AI/OpenSIN-overview/issues/57
- **Upstream dependency (outside OpenSIN-AI)** — OpenSIN-Code runtime issue: https://github.com/OpenSIN-Code/OpenSIN-Code/issues/1122

## Rollout phases

1. **SSOT and config** — record the decision, map the repos, define the opt-in flag.
2. **Core integration** — wire RecursiveMAS into the reusable engine/runtime.
3. **Control plane + bus** — add telemetry, rollout gating, and durable recursion events.
4. **Validation** — tests, benchmarks, and docs before default-on is ever considered.

## Acceptance criteria

- Default behavior is unchanged when RecursiveMAS is disabled.
- Recursive mode can be enabled from a single canonical config surface.
- Recursion traces are visible in logs/metrics and can be replayed.
- Each repo has tests that cover the new path.
- The rollout is documented and cross-linked from the org SSOT.

## Guardrails

- Keep RecursiveMAS opt-in until measurements show a real win.
- Do not remove or break the existing agent loop.
- Treat the plan as a phased migration, not a rewrite.
