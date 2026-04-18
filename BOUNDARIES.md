# OpenSIN-overview Boundaries

## Role
`OpenSIN-overview` is the organizational map and governance index for OpenSIN-AI.

Short version:

- **This repo = org map, registry index, and governance overview**
- **Not this repo = canonical runtime, canonical docs body, canonical config source, or product/control-plane implementation**

---

## Canonical Ownership

| Concern | Canonical Repo |
|---|---|
| Org map, registry index, cross-repo governance overview | `OpenSIN-overview` |
| Runtime core / engine | `OpenSIN` |
| Official documentation body | `OpenSIN-documentation` |
| OpenCode config / skills / plugins | `OpenSIN-AI/Infra-SIN-OpenCode-Stack` |
| Persistent agent memory (PCPM v4) | `OpenSIN-AI/Infra-SIN-Global-Brain` |
| Product web app | `OpenSIN-AI/OpenSIN-WebApp` |
| A2A fleet control plane | `OpenSIN-AI/OpenSIN-backend` |

---

## This repo MUST own

- high-level repo-role mapping
- organizational registries and indexes
- cross-repo governance links
- role boundaries and ownership summaries
- discovery docs for teams, agents, MCPs, websites, and templates

---

## This repo MUST NOT own

- runtime engine semantics
- detailed official docs canon
- canonical OpenCode config files
- product implementation truth
- control-plane implementation truth
- memory backend truth

---

## Hard rules

### 1. Index, do not absorb
This repo may point to canonical repos and summarize them, but must not absorb their detailed source-of-truth content.

### 2. Governance map, not implementation owner
This repo may state who owns a concern. It must not become the repo that implements every concern.

### 3. SSOT scope must stay narrow
If this repo uses “single source of truth,” that truth is limited to organizational mapping and governance boundaries unless a narrower scope is explicitly named.

### 4. Link to canon
When runtime, docs, config, product, or control-plane details are needed, this repo should link outward to the owning repo instead of duplicating the detail.
