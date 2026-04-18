# START HERE

> **Wer das hier liest — Mensch oder Agent — ist in unter 60 Sekunden handlungsfähig.**

You just landed in the OpenSIN-AI organization (195 repos, 17 teams, 149 workers).
Read this file first. Then one more. Then you're working.

---

## 1. Du bist ein menschlicher Entwickler?

Lies in dieser Reihenfolge:

1. **[docs/CANONICAL-REPOS.md](./docs/CANONICAL-REPOS.md)** — welches Repo ist wofür zuständig. **Open keinen PR ohne diese Datei.**
2. **[README.md](./README.md)** — die volle Ökosystem-Übersicht (Teams, Worker, Standards, CI).
3. **[AGENTS.md](./AGENTS.md)** — Entwicklungs-Guidelines.
4. **[governance/BOUNDARY-ROLE-RULES.md](./governance/BOUNDARY-ROLE-RULES.md)** — was welches Repo *nicht* sein darf.

Setup in 3 Befehlen:
```bash
gh auth login
gh repo clone OpenSIN-AI/OpenSIN      # Python-Kernel
gh repo clone OpenSIN-AI/OpenSIN-Code # TypeScript CLI
```

---

## 2. Du bist ein AI-Agent?

Lies in dieser Reihenfolge:

1. **`docs/CANONICAL-REPOS.md`** — pflichtlektüre. Niemals in archivierten Repos arbeiten.
2. **`registry/MASTER_INDEX.md`** — der maschinenlesbare Index aller Repos.
3. **`platforms/registry.json`** — strukturierte Repo-Liste.
4. **`AGENTS.md`** + **`governance/BOUNDARY-ROLE-RULES.md`** — Regeln, die du befolgen musst.

Vor jedem Task: `discover-agents.js` ausführen (siehe Routing-Regeln in `opencode.json` bei Delqhi/upgraded-opencode-stack).

---

## 3. Die 4 kanonischen Code-Repos (nach der April-2026-Konsolidierung)

| Repo | Zweck | Sprache |
|---|---|---|
| [OpenSIN](https://github.com/OpenSIN-AI/OpenSIN) | **Python-Kernel** — `opensin_core`, `opensin_cli`, `opensin_api`, `opensin_sdk` | Python |
| [OpenSIN-Code](https://github.com/OpenSIN-AI/OpenSIN-Code) | **Autonome TypeScript CLI** (Claude-Code-Klasse) | TypeScript |
| [OpenSIN-backend](https://github.com/OpenSIN-AI/OpenSIN-backend) | **A2A Fleet Control Plane** — orchestriert die Agenten-Flotte | TypeScript |
| [Team-SIN-Code-Core](https://github.com/OpenSIN-AI/Team-SIN-Code-Core) | **Coding-Team Monorepo** — Team-Manager + `agents/coding-ceo` + `agents/code-ai` | TypeScript |

Plus zwei Meta-Repos:

| Repo | Zweck |
|---|---|
| [OpenSIN-overview](https://github.com/OpenSIN-AI/OpenSIN-overview) | **Das hier** — SSOT für alle 195 Repos, Onboarding |
| [OpenSIN-documentation](https://github.com/OpenSIN-AI/OpenSIN-documentation) | **docs.opensin.ai** — die öffentliche Doku-Website |

---

## 4. Archivierte Repos — NICHT mehr verwenden

Diese Repos sind **read-only** und wurden in andere Repos konsolidiert.
Öffne hier keine PRs. Öffne keine Issues. Clone sie nicht.

| Archiviert | Weiterleitung |
|---|---|
| `A2A-SIN-Coding-CEO` | → `Team-SIN-Code-Core/agents/coding-ceo/` |
| `A2A-SIN-Code-AI`    | → `Team-SIN-Code-Core/agents/code-ai/` |
| `opensin-ai-code`    | → `OpenSIN/opensin_agent_platform/` |

Details: [docs/CONSOLIDATION-2026-04.md](./docs/CONSOLIDATION-2026-04.md)

---

## 5. Eine Regel

**Jede Unklarheit "wo gehört das hin?" wird in diesem Repo geklärt — und zwar BEVOR Code geschrieben wird.**

Dieses Repo ist die Single Source of Truth für die Organisations-Topologie.
Wenn die Topologie hier falsch dokumentiert ist, ist *das* der Bug — nicht der Code.
