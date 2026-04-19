# START HERE

> **Wer das hier liest — Mensch oder Agent — ist in unter 60 Sekunden handlungsfähig.**

You just landed in the OpenSIN-AI organization: **205 repos, 17 teams, 149 agent workers, 7 business repos, 4 canonical websites**. The counts are live from `registry/MASTER_INDEX.md`; if they look different there, that file wins.

Read this file first. Then [`docs/CANONICAL-REPOS.md`](./docs/CANONICAL-REPOS.md). Then you're working.

> **Heute ist 2026-04-19 (Sonntag). Wir launchen in 4 Tagen am 2026-04-23 (Donnerstag) = T-0.**
> Der 4-Tage-Plan, die 10 Go/No-Go-Kriterien und die Rollback-Strategie stehen in **[LAUNCH-CHECKLIST.md](./LAUNCH-CHECKLIST.md)**.
>
> **Produktverständnis vor Code.** Bevor du irgendwas tust, lies in dieser Reihenfolge:
> 1. **[PRODUCT-VISION.md](./PRODUCT-VISION.md)** — das 3-Tier-Modell (OpenSIN Free / My.OpenSIN Pro / Marketplace), kompetitive Positionierung, das **eine Ziel** (5 Min).
> 2. **[STATE-OF-THE-UNION.md](./STATE-OF-THE-UNION.md)** — ehrlicher Lagebericht, was existiert, was läuft, was tot ist (5 Min).
> 3. **[WORKFORCE.md](./WORKFORCE.md)** — wer (Mensch / Team / Worker) macht welche Arbeit (3 Min).
> 4. **[LAUNCH-CHECKLIST.md](./LAUNCH-CHECKLIST.md)** — 4-Tage-Plan, Go/No-Go, Rollback (relevant während Launch-Woche).
>
> Ohne diese Dokumente weißt du nicht wofür du arbeitest. Mit ihnen weißt du es in 15 Minuten.

> **Bevor du einen PR öffnest, egal was:** [BOUNDARIES.md](./BOUNDARIES.md), [GOVERNANCE.md](./GOVERNANCE.md), [CONTRIBUTING.md](./CONTRIBUTING.md). Alles drei zusammen sind 5 Minuten Lesezeit und ersparen dir eine Rückabwicklung.

---

## 1. Du bist ein menschlicher Entwickler?

Lies in dieser Reihenfolge:

1. **[PRODUCT-VISION.md](./PRODUCT-VISION.md)** — das 3-Tier-Produktmodell. Was wir bauen und warum.
2. **[STATE-OF-THE-UNION.md](./STATE-OF-THE-UNION.md)** — was heute wirklich existiert (nicht was die Docs behaupten).
3. **[WORKFORCE.md](./WORKFORCE.md)** — die 3 Layer: Maintainer → 17 Teams → 149 Worker + 109 A2A-Integrations.
4. **[BOUNDARIES.md](./BOUNDARIES.md)** + **[GOVERNANCE.md](./GOVERNANCE.md)** — was darf in dieses Repo, was nicht; wer entscheidet was.
5. **[CONTRIBUTING.md](./CONTRIBUTING.md)** — Setup, Preflight (`npm run prelaunch:offline`), Commit-Konvention, PR-Flow.
6. **[docs/CANONICAL-REPOS.md](./docs/CANONICAL-REPOS.md)** — authoritative map of which repo owns what. **Niemals einen PR öffnen, ohne vorher diese Datei gelesen zu haben.**
7. **[AGENTS.md](./AGENTS.md)** — Agent-Contract für dieses Repo (gilt für AI-Agenten, ist aber nützlich für Menschen, die mit ihnen arbeiten).
8. **[SECURITY.md](./SECURITY.md)** + **[CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)** + **[SUPPORT.md](./SUPPORT.md)** — bei Vulnerabilities, Konflikten, Fragen.

Setup in vier Befehlen:
```bash
gh auth login
git clone https://github.com/OpenSIN-AI/OpenSIN-overview && cd OpenSIN-overview
nvm use && npm install
npm run prelaunch:offline   # verify local copy is healthy before you change anything
```

---

## 2. Du bist ein AI-Agent?

Lies in dieser Reihenfolge — dann handle:

1. **[`AGENTS.md`](./AGENTS.md)** — **Agent-Contract für dieses Repo.** 7 harte Regeln + Scope-Guard. **Pflicht vor dem ersten Edit.**
2. **[`PRODUCT-VISION.md`](./PRODUCT-VISION.md)** — dein Kontext. Du arbeitest für eins der drei Tiers — wisse welches.
3. **[`STATE-OF-THE-UNION.md`](./STATE-OF-THE-UNION.md)** — falls du eine Aufgabe in einem bestimmten Repo kriegst, prüfe erst ob das Repo laut diesem Doc `alive`, `scaffold` oder `dead` ist. **Nie an einem `dead`- oder archivierten Repo arbeiten.**
4. **[`BOUNDARIES.md`](./BOUNDARIES.md)** + **[`governance/BOUNDARY-ROLE-RULES.md`](./governance/BOUNDARY-ROLE-RULES.md)** — 7 Hard Rules. Rule 5 (keine Secrets) und Rule 6 (Determinismus) sind non-negotiable.
5. **[`docs/CANONICAL-REPOS.md`](./docs/CANONICAL-REPOS.md)** — Pflichtlektüre. Niemals in archivierten Repos arbeiten.
6. **[`registry/MASTER_INDEX.md`](./registry/MASTER_INDEX.md)** — the machine-readable index of all repos.
7. **[`platforms/registry.json`](./platforms/registry.json)** — structured repo list.
8. **[`WORKFORCE.md`](./WORKFORCE.md)** — the 3-layer model (maintainers → teams → workers). Know which layer you belong to before acting.

Vor jedem Task: `discover-agents.js` ausführen (Routing-Regeln siehe `opencode.json` bei [`OpenSIN-AI/Infra-SIN-OpenCode-Stack`](https://github.com/OpenSIN-AI/Infra-SIN-OpenCode-Stack) — in-org SSOT für OpenCode config; see [`docs/CANONICAL-REPOS.md`](./docs/CANONICAL-REPOS.md) § 8).

**Hard stop before editing any file in this repo:**
- If the file is in the canon-lock list (`BOUNDARIES.md`, `GOVERNANCE.md`, `PRODUCT-VISION.md`, `LAUNCH-CHECKLIST.md`, `STATE-OF-THE-UNION.md`, `schemas/*`): mark the PR `canon-lock` and follow GOVERNANCE §3.2.
- If you are about to write anything that looks like a secret, API key, internal IP, or SSH credential: **stop**. Move it to `Infra-SIN-Dev-Setup` (private). Reference it here only by env-var name.
- If the change is > 30 lines of content that duplicates another repo: replace with a link. This repo indexes, it does not absorb.

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
