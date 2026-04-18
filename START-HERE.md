# START HERE

> **Wer das hier liest — Mensch oder Agent — ist in unter 60 Sekunden handlungsfähig.**

You just landed in the OpenSIN-AI organization (195 repos, 17 teams, 149 workers).
Read this file first. Then [`docs/CANONICAL-REPOS.md`](./docs/CANONICAL-REPOS.md). Then you're working.

---

## 1. Du bist ein menschlicher Entwickler?

Lies in dieser Reihenfolge:

1. **[docs/CANONICAL-REPOS.md](./docs/CANONICAL-REPOS.md)** — authoritative map of which repo owns what. **Niemals einen PR öffnen, ohne vorher diese Datei gelesen zu haben.**
2. **[README.md](./README.md)** — full ecosystem overview (teams, workers, standards, CI).
3. **[AGENTS.md](./AGENTS.md)** — development guidelines.
4. **[governance/BOUNDARY-ROLE-RULES.md](./governance/BOUNDARY-ROLE-RULES.md)** — what each repo must *not* be.

Setup in drei Befehlen:
```bash
gh auth login
gh repo clone OpenSIN-AI/Infra-SIN-Dev-Setup   # dev + user-onboarding setup
gh repo clone OpenSIN-AI/OpenSIN               # Python-Kernel
```

---

## 2. Du bist ein AI-Agent?

Lies in dieser Reihenfolge:

1. **`docs/CANONICAL-REPOS.md`** — Pflichtlektüre. Niemals in archivierten Repos arbeiten.
2. **`registry/MASTER_INDEX.md`** — the machine-readable index of all repos.
3. **`platforms/registry.json`** — structured repo list.
4. **`AGENTS.md`** + **`governance/BOUNDARY-ROLE-RULES.md`** — rules you must follow.

Vor jedem Task: `discover-agents.js` ausführen (Routing-Regeln siehe `opencode.json` bei [`OpenSIN-AI/Infra-SIN-OpenCode-Stack`](https://github.com/OpenSIN-AI/Infra-SIN-OpenCode-Stack) — in-org SSOT für OpenCode config; see CANONICAL-REPOS.md § 8).

---

## 3. Die Repos nach Domäne (kanonisch, Stand 2026-04-18)

### Kern-Plattform (keine Präfixe)
| Repo | Zweck | Sprache |
|---|---|---|
| [OpenSIN](https://github.com/OpenSIN-AI/OpenSIN) | **Python-Kernel** — `opensin_core`, `opensin_cli`, `opensin_api`, `opensin_sdk`, `opensin_agent_platform` | Python |
| [OpenSIN-Code](https://github.com/OpenSIN-AI/OpenSIN-Code) | **Autonome TypeScript CLI** (Claude-Code-Klasse) — **nicht** eine VS Code Extension | TypeScript |
| [OpenSIN-backend](https://github.com/OpenSIN-AI/OpenSIN-backend) | **A2A Fleet Control Plane** | TypeScript |
| [OpenSIN-WebApp](https://github.com/OpenSIN-AI/OpenSIN-WebApp) | **Authenticated dashboard** at `chat.opensin.ai` (Paket: `opensin-chat`) | TypeScript / Next.js |

### Web-Oberfläche
| Repo | Deployed at | Typ |
|---|---|---|
| [website-opensin.ai](https://github.com/OpenSIN-AI/website-opensin.ai) | `opensin.ai` | Open-Source Marketing |
| [website-my.opensin.ai](https://github.com/OpenSIN-AI/website-my.opensin.ai) | `my.opensin.ai` | Paid-Layer Marketing / Marketplace |

### Team-Monorepos (`Team-SIN-*`)
| Repo | Zweck |
|---|---|
| [Team-SIN-Code-Core](https://github.com/OpenSIN-AI/Team-SIN-Code-Core) | Coding team — Team Manager + `agents/coding-ceo` + `agents/code-ai` |

### Infrastruktur (`Infra-SIN-*`)
| Repo | Zweck |
|---|---|
| [Infra-SIN-Dev-Setup](https://github.com/OpenSIN-AI/Infra-SIN-Dev-Setup) | Dev environment setup + end-user first-run onboarding (`user-onboarding/`) |

### Templates (`Template-SIN-*`)
| Repo | Zweck |
|---|---|
| [Template-SIN-Agent](https://github.com/OpenSIN-AI/Template-SIN-Agent) | Starting point for any new A2A agent |

### Business / Marketing (`Biz-SIN-*`)
| Repo | Zweck |
|---|---|
| [Biz-SIN-Marketing](https://github.com/OpenSIN-AI/Biz-SIN-Marketing) | Launch hub, blog posts, press release, community strategy |

### Doku & Meta
| Repo | Zweck |
|---|---|
| [OpenSIN-overview](https://github.com/OpenSIN-AI/OpenSIN-overview) | **Dieses Repo** — SSOT für alle Org-Repos, Onboarding, Governance |
| [OpenSIN-documentation](https://github.com/OpenSIN-AI/OpenSIN-documentation) | `docs.opensin.ai` — end-user documentation |

### Infrastruktur-SSOT (seit 2026-04-18 in-Org)
> Diese beiden Repos waren bis April 2026 unter `Delqhi/...` — sie wurden transferiert und umbenannt. GitHub leitet die alten URLs weiter, aber alle neuen Links und Tools müssen die kanonischen `OpenSIN-AI/Infra-SIN-*` Pfade nutzen.

| Repo | Rolle | Legacy-Pfad (Redirect) |
|---|---|---|
| [OpenSIN-AI/Infra-SIN-OpenCode-Stack](https://github.com/OpenSIN-AI/Infra-SIN-OpenCode-Stack) | Kanonische OpenCode-Konfiguration (sin-sync Target) | `Delqhi/upgraded-opencode-stack` |
| [OpenSIN-AI/Infra-SIN-Global-Brain](https://github.com/OpenSIN-AI/Infra-SIN-Global-Brain) | PCPM v4 daemon (persistent agent memory) | `Delqhi/global-brain` |

---

## 4. Archivierte Repos — NICHT mehr verwenden

Diese Repos sind **read-only** und wurden in andere Repos konsolidiert.
Öffne hier keine PRs. Öffne keine Issues. Clone sie nicht.

| Archiviert | Weiterleitung |
|---|---|
| `A2A-SIN-Coding-CEO` | → `Team-SIN-Code-Core/agents/coding-ceo/` |
| `A2A-SIN-Code-AI`    | → `Team-SIN-Code-Core/agents/code-ai/` |
| `opensin-ai-code`    | → `OpenSIN/opensin_agent_platform/` |
| `OpenSIN-onboarding` | → `Infra-SIN-Dev-Setup/user-onboarding/` |

Details: [docs/CONSOLIDATION-2026-04.md](./docs/CONSOLIDATION-2026-04.md)
Open rationalization work: [docs/FOLLOWUPS.md](./docs/FOLLOWUPS.md) — check before opening PRs against `opensin-ai-cli` or `opensin-ai-platform`.

---

## 5. Naming convention in 2 Sätzen

- **Flagship / Produkt-Namen:** kein Präfix (`OpenSIN`, `OpenSIN-Code`, `OpenSIN-backend`, `OpenSIN-WebApp`, `website-opensin.ai`, `website-my.opensin.ai`).
- **Supporting-Artefakte:** Domain-Präfix (`Team-SIN-*`, `Infra-SIN-*`, `Biz-SIN-*`, `Template-SIN-*`).

Volle Regeln: [docs/CANONICAL-REPOS.md § Naming convention](./docs/CANONICAL-REPOS.md#naming-convention).

---

## 6. Eine Regel

**Jede Unklarheit "wo gehört das hin?" wird in diesem Repo geklärt — und zwar BEVOR Code geschrieben wird.**

Dieses Repo ist die Single Source of Truth für die Organisations-Topologie. Wenn die Topologie hier falsch dokumentiert ist, ist *das* der Bug — nicht der Code.
