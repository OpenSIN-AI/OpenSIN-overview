> ## NEU HIER? → **[START-HERE.md](./START-HERE.md)**
>
> **In 60 Sekunden handlungsfähig** — für menschliche Entwickler UND AI-Agenten.
>
> Konsolidierung April 2026 (9 → 4 Code-Repos, Wave 3 abgeschlossen): [docs/CONSOLIDATION-2026-04.md](./docs/CONSOLIDATION-2026-04.md)
> Kanonische Repo-Zuordnung: [docs/CANONICAL-REPOS.md](./docs/CANONICAL-REPOS.md)
> Offene Rationalisierungs-Tickets: [docs/FOLLOWUPS.md](./docs/FOLLOWUPS.md)

---

# 🦅 OPENSIN-AI: KOMPAKT-ÜBERSICHT

> **The Ultimate Single Source of Truth für die OpenSIN-AI Organisation**
>
> 📊 **195 Repositories** | **17 Teams** | **149 Worker** | **4 Templates** | **44 Skills** | **6 Websites**

> [!IMPORTANT]
> **SSOT:** Die kanonische OpenCode-Konfiguration liegt unter [OpenSIN-AI/Infra-SIN-OpenCode-Stack](https://github.com/OpenSIN-AI/Infra-SIN-OpenCode-Stack) (v2.2.1, 44 Skills, 27 MCPs, 5 Provider).
> Nach jeder Änderung an `opencode.json` MUSS `sin-sync` ausgeführt werden.

---

## 🚨 CI/CD MANDAT — ABSOLUTES VERBOT FÜR NORMALE GITHUB ACTIONS

> **NIEMALS normale GitHub Actions Runner von GitHub nutzen! NIEMALS!**

Die OpenSIN-AI Organisation nutzt **ausschließlich** n8n + sin-github-action für CI/CD. GitHub Actions Billing blockiert unsere Pipelines. Alle Builds laufen auf dem kostenlosen OCI VM (Oracle Cloud Always-Free).

### Architektur

```
GitHub Push → sin-github-action (~2s, curl only) → n8n Webhook → OCI CI Runner → Commit Status ✅
```

### Komponenten

| Komponente | Details |
|-----------|---------|
| **GitHub Action** | [sin-github-action](https://github.com/OpenSIN-AI/sin-github-action) — Composite Action (nur curl, ~2s) |
| **n8n Workflow** | ID `VhDVux7dSCoQdkOP` auf `http://92.5.60.87:5678/webhook/opensin-ci` |
| **CI Runner** | `opensin-ci-runner.py` als systemd Service auf OCI VM (`ubuntu@92.5.60.87:3456`) |
| **n8n API Key** | `n8n_api_69175bcabef4b10d619b43598cd557a92ee38aac5ae4b1ca` |

### Setup für jedes neue Repo (3 Schritte)

**1. Secret setzen:**
```bash
gh secret set N8N_CI_WEBHOOK_URL \
  --repo OpenSIN-AI/<REPO> \
  --body "http://92.5.60.87:5678/webhook/opensin-ci"
```

**2. `.github/workflows/ci.yml` erstellen:**
```yaml
name: CI → n8n OCI Runner
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
jobs:
  dispatch:
    runs-on: ubuntu-latest
    timeout-minutes: 2
    steps:
      - uses: OpenSIN-AI/sin-github-action@main
        with:
          n8n_webhook_url: ${{ secrets.N8N_CI_WEBHOOK_URL }}
          github_token: ${{ secrets.GITHUB_TOKEN }}
          pipeline: all
```

**3. Fertig.** — Build läuft auf OCI, Status erscheint auf GitHub.

### Vollständige Doku

→ [docs.opensin.ai/best-practices/ci-cd-n8n](https://docs.opensin.ai/best-practices/ci-cd-n8n)

### Bekannte Probleme & Fixes

| Problem | Fix |
|---------|-----|
| `Webhook "POST opensin-ci" is not registered` | `docker restart n8n-n8n-1` auf OCI VM (n8n 2.12 lädt Webhooks nur beim Startup) |
| `account payments have failed` | Normal bei GitHub-hosted Runner — timeout-minutes: 2 setzen oder self-hosted Runner nutzen |
| CI Runner antwortet nicht | `sudo systemctl restart opensin-ci-runner` auf OCI VM |
| n8n Container Conflict | `docker rm -f n8n-n8n-1 && cd /opt/n8n && docker compose up -d` |

---

## 🌐 WEBSITES & DOMAINS

| Domain | Repo | Zweck | Sichtbarkeit |
|--------|------|-------|-------------|
| [opensin.ai](https://opensin.ai) | [website-opensin.ai](https://github.com/OpenSIN-AI/website-opensin.ai) | Open-Source Landing Page & Produktvorstellung | 🔒 Privat |
| [chat.opensin.ai](https://chat.opensin.ai) | [OpenSIN-WebApp](https://github.com/OpenSIN-AI/OpenSIN-WebApp) | **User WebApp mit Login** — Dashboard, Agenten-Steuerung, Fleet-Management (Vercel ✅ deployed) | 🔒 Privat |
| [my.opensin.ai](https://my.opensin.ai) | [website-my.opensin.ai](https://github.com/OpenSIN-AI/website-my.opensin.ai) | Premium Abo-Modell: User-Login, Cloud-Agenten, Billing, API-Keys | 🔒 Privat |
| [docs.opensin.ai](https://docs.opensin.ai) | [OpenSIN-documentation](https://github.com/OpenSIN-AI/OpenSIN-documentation) | Offizielle Benutzer-Dokumentation (VitePress) | 🌍 Public |
| [blog.opensin.ai](https://blog.opensin.ai) | [Biz-SIN-Blog-Posts](https://github.com/OpenSIN-AI/Biz-SIN-Blog-Posts) | OpenSIN-AI Blog & Marketing | 🌍 Public |
| *(internal API)* | [OpenSIN-backend](https://github.com/OpenSIN-AI/OpenSIN-backend) | A2A Fleet Control Plane (Closed Source) — Backend-API, n8n-Routing, Agenten-Orchestrierung — konsumiert von `OpenSIN-WebApp` | 🔒 Privat |

---

## 🚨 MANDATES & DIRECTIVES

| Mandate | Status | Description |
|---------|--------|-------------|
| **Hacker Bypass** | ✅ Active | No-Wall policy for technical barriers (5-Layer stack) |
| **CI/CD Mandate** | ✅ Active | Exclusive use of n8n + OCI for builds |
| **Fleet Sync** | ✅ Active | Mandatory `sin-sync` for global config parity |
| **Visual Evidence** | ✅ Active | Mandatory screenshots/videos in all reports/issues |
| **Parallel Exploration** | ✅ Active | 5-10 parallel explore + librarian agents for large codebases |

---

## 🧠 AGENT CONFIGURATION SYSTEM (v5)

Die Agenten-Modelle werden durch ein mehrstufiges Konfigurationssystem verwaltet:

### Konfigurationsdateien

| Datei | Zweck | Repo |
|:---|:---|:---|
| `opencode.json` | Haupt-Config — Provider, Modelle, MCPs, sichtbare Agenten | [`Infra-SIN-OpenCode-Stack`](https://github.com/OpenSIN-AI/Infra-SIN-OpenCode-Stack) |
| `oh-my-openagent.json` | Subagenten-Modelle — explore, librarian, oracle, etc. | [`Infra-SIN-OpenCode-Stack`](https://github.com/OpenSIN-AI/Infra-SIN-OpenCode-Stack) |
| `oh-my-sin.json` | Zentrales A2A Team Register — alle Teams klassifiziert | [`Infra-SIN-OpenCode-Stack`](https://github.com/OpenSIN-AI/Infra-SIN-OpenCode-Stack) |
| `my-sin-team-code.json` | Team Coding Agenten + Modelle | [`Infra-SIN-OpenCode-Stack`](https://github.com/OpenSIN-AI/Infra-SIN-OpenCode-Stack) |
| `my-sin-team-worker.json` | Team Worker Agenten + Modelle | [`Infra-SIN-OpenCode-Stack`](https://github.com/OpenSIN-AI/Infra-SIN-OpenCode-Stack) |
| `my-sin-team-infrastructure.json` | Team Infra Agenten + Modelle | [`Infra-SIN-OpenCode-Stack`](https://github.com/OpenSIN-AI/Infra-SIN-OpenCode-Stack) |

> Legacy path `Delqhi/upgraded-opencode-stack` redirects to the canonical repo above. All new links must use the canonical path.

### Explore/Librarian Modelle

| Subagent | Modell | Fallback-Kette |
|:---|:---|:---|
| **explore** | `nvidia-nim/stepfun-ai/step-3.5-flash` | gemini-3-flash → gpt-5.4 → gemini-3.1-pro → claude-sonnet → qwen |
| **librarian** | `nvidia-nim/stepfun-ai/step-3.5-flash` | gemini-3-flash → gpt-5.4 → gemini-3.1-pro → claude-sonnet → qwen |

### PARALLEL-EXPLORATION MANDATE

Bei grossen Codebases (100k+ Zeilen, 1000+ Dateien) MUESSEN Agenten **5-10 parallele explore + 5-10 librarian-Agenten** starten. Ein einzelner Agent liefert nur ~20% Abdeckung → falsche Entscheidungen.

### Vollstaendige Dokumentation

→ [Agent Configuration Guide](https://github.com/OpenSIN-AI/OpenSIN-documentation/blob/main/docs/guide/agent-configuration.md)

---

## 🏗️ CORE ENGINE

| Repo | Zweck |
|------|-------|
| [OpenSIN](https://github.com/OpenSIN-AI/OpenSIN) | Free/Open-Source Core Engine — Python (QueryEngine, Hooks, Tools, MCP, Sandbox, Memory, A2A) |
| [OpenSIN-Code](https://github.com/OpenSIN-AI/OpenSIN-Code) | Autonomes CLI + SDK (`@opensin/sdk`) — Agent Loop, Tool System, Model Routing, Memory, Safety, A2A Transport Layer + Rust Engine (71 Dateien, 37.7K Zeilen) |
| [opensin-ai-cli](https://github.com/OpenSIN-AI/opensin-ai-cli) | ⚠️ **Rationalization pending** — Rust coding CLI (70 Dateien, 34.601 Zeilen, 9 Crates). Overlaps with `OpenSIN-Code`. **Do not extend**; see [docs/FOLLOWUPS.md § R1](./docs/FOLLOWUPS.md#r1-opensin-ai-cli--opensin-code) |
| [opensin-ai-platform](https://github.com/OpenSIN-AI/opensin-ai-platform) | ⚠️ **Rationalization pending** — Plugin Ecosystem (182 Dateien, 87.247 Zeilen, 14 Plugins). Overlaps with `OpenSIN/opensin_agent_platform/`. **Do not extend**; see [docs/FOLLOWUPS.md § R2](./docs/FOLLOWUPS.md#r2-opensin-ai-platform--opensin) |
| [OpenSIN-backend](https://github.com/OpenSIN-AI/OpenSIN-backend) | Closed Source Backend — A2A Fleet Control Plane, n8n-Routing, Agenten-Orchestrierung, API für OpenSIN-WebApp |
| [OpenSIN-WebApp](https://github.com/OpenSIN-AI/OpenSIN-WebApp) | User WebApp (Next.js, Vercel ✅) — Login, Dashboard, Agenten-Steuerung (gekoppelt an OpenSIN-backend) |

---

## 👑 TEAM ORCHESTRATORS (17 Teams)

| Team | Worker | Zweck |
|------|--------|-------|
| [Team-SIN-Apple](https://github.com/OpenSIN-AI/Team-SIN-Apple) | 12 | macOS/iOS Automation (Mail, Notes, Calendar, FaceTime, Safari, etc.) |
| [Team-SIN-Code-Backend](https://github.com/OpenSIN-AI/Team-SIN-Code-Backend) | 3 | Server, OracleCloud, Passwordmanager |
| [Team-SIN-Code-Core](https://github.com/OpenSIN-AI/Team-SIN-Code-Core) | 4 | Coding-CEO, Code-AI, Code-DataScience, Code-DevOps |
| [Team-SIN-Code-CyberSec](https://github.com/OpenSIN-AI/Team-SIN-Code-CyberSec) | 19 | BugBounty, Cloudflare, 16x Security-Spezialisten |
| [Team-SIN-Code-Frontend](https://github.com/OpenSIN-AI/Team-SIN-Code-Frontend) | 11 | Accessibility, App-Shell, Commerce-UI, Design-Systems, etc. |
| [Team-SIN-Commerce](https://github.com/OpenSIN-AI/Team-SIN-Commerce) | 4 | Shop-Finance, Shop-Logistic, TikTok-Shop, Stripe |
| [Team-SIN-Community](https://github.com/OpenSIN-AI/Team-SIN-Community) | 4 | Discord, WhatsApp, Telegram, YouTube Community |
| [Team-SIN-Forum](https://github.com/OpenSIN-AI/Team-SIN-Forum) | 9 | Reddit, HackerNews, StackOverflow, Quora, DevTo, etc. |
| [Team-SIN-Google](https://github.com/OpenSIN-AI/Team-SIN-Google) | 3 | Google-Apps, Google-Chat, Opal |
| [Team-SIN-Infrastructure](https://github.com/OpenSIN-AI/Team-SIN-Infrastructure) | 15 | Authenticator, Terminal, Storage, Supabase, N8N, CI-CD, etc. |
| [Team-SIN-Legal](https://github.com/OpenSIN-AI/Team-SIN-Legal) | 8 | ClaimWriter, Patents, Damages, Compliance, Contract, etc. |
| [Team-SIN-Media-ComfyUI](https://github.com/OpenSIN-AI/Team-SIN-Media-ComfyUI) | 3 | ImageGen, VideoGen, Workflow |
| [Team-SIN-Media-Music](https://github.com/OpenSIN-AI/Team-SIN-Media-Music) | 6 | Beats, Producer, Singer, Songwriter, Videogen, Community |
| [Team-SIN-Messaging](https://github.com/OpenSIN-AI/Team-SIN-Messaging) | 19 | WhatsApp, Telegram, Signal, Discord, iMessage, etc. |
| [Team-SIN-Microsoft](https://github.com/OpenSIN-AI/Team-SIN-Microsoft) | 9 | 365, Teams, Outlook, OneDrive, Excel, Word, PowerPoint, etc. |
| [Team-SIN-Research](https://github.com/OpenSIN-AI/Team-SIN-Research) | 1 | Deep-Research |
| [Team-SIN-Social](https://github.com/OpenSIN-AI/Team-SIN-Social) | 19 | TikTok, Instagram, X, LinkedIn, Facebook, YouTube, etc. |

---

## 🔌 MCP SERVER

| Repo | Zweck |
|------|-------|
| [MCP-SIN-chrome-extension](https://github.com/OpenSIN-AI/MCP-SIN-chrome-extension) | Chrome Extension MCP - Browser Automation |
| [MCP-SIN-computer-use](https://github.com/OpenSIN-AI/MCP-SIN-computer-use) | Computer Use MCP - Desktop Control |
| [MCP-SIN-in-chrome](https://github.com/OpenSIN-AI/MCP-SIN-in-chrome) | In-Chrome MCP - Tab/Content Access |
| [MCP-SIN-mcp-gateway](https://github.com/OpenSIN-AI/MCP-SIN-mcp-gateway) | MCP Gateway - Central Routing |
| [MCP-SIN-memory](https://github.com/OpenSIN-AI/MCP-SIN-memory) | Memory MCP - Persistent Storage |
| [MCP-SIN-platform-auth](https://github.com/OpenSIN-AI/MCP-SIN-platform-auth) | Platform Auth - OAuth/SSO |
| [MCP-SIN-usebrowser](https://github.com/OpenSIN-AI/MCP-SIN-usebrowser) | UseBrowser - Web Automation |
| [Simone-MCP](https://github.com/OpenSIN-AI/Simone-MCP) | Semantic Code Intelligence MCP — Symbol-Navigation, Referenzen, strukturelle Edits, hybrides Memory (PFLICHT für alle Agenten) |

---

## 🧬 TEMPLATES

| Repo | Zweck |
|------|-------|
| [Template-SIN-Agent](https://github.com/OpenSIN-AI/Template-SIN-Agent) | Standard-Blueprint für neue A2A-Agenten (mit A2A Transport Layer) |
| [Template-SIN-Team](https://github.com/OpenSIN-AI/Template-SIN-Team) | Team-Manager Blueprint (Delegation, Lexicon RAG, Retry, Telegram) |
| [Template-SIN-Worker](https://github.com/OpenSIN-AI/Template-SIN-Worker) | Worker-Prozess Blueprint |
| [Template-SIN-Agent-Worker](https://github.com/OpenSIN-AI/Template-SIN-Agent-Worker) | Agent Worker Template |

---

## 🔌 PLUGINS & SKILLS

### OpenSIN-Code Plugins (14 migriert)

| Plugin | Dateien | Zweck |
|--------|---------|-------|
| [sin-code-review](https://github.com/OpenSIN-AI/OpenSIN-Code/tree/main/plugins/sin-code-review) | 6 | Automatisierte Code-Reviews mit Multi-Agent-System |
| [sin-commit-commands](https://github.com/OpenSIN-AI/OpenSIN-Code/tree/main/plugins/sin-commit-commands) | 10 | Git-Workflow-Befehle (Commit, Push, PR) |
| [sin-feature-dev](https://github.com/OpenSIN-AI/OpenSIN-Code/tree/main/plugins/sin-feature-dev) | 12 | Feature-Entwicklung mit spezialisierten Agenten |
| [sin-frontend-design](https://github.com/OpenSIN-AI/OpenSIN-Code/tree/main/plugins/sin-frontend-design) | 6 | UI/UX-Implementierung und Design-Skill |
| [sin-security-guidance](https://github.com/OpenSIN-AI/OpenSIN-Code/tree/main/plugins/sin-security-guidance) | 6 | Security-Reminder-Hook |
| [sin-hookify](https://github.com/OpenSIN-AI/OpenSIN-Code/tree/main/plugins/sin-hookify) | 48 | Regelbasierte Hook-Erstellung (größtes Plugin) |
| [sin-explanatory-mode](https://github.com/OpenSIN-AI/OpenSIN-Code/tree/main/plugins/sin-explanatory-mode) | 8 | Erklärt Implementierungsentscheidungen |
| [sin-learning-mode](https://github.com/OpenSIN-AI/OpenSIN-Code/tree/main/plugins/sin-learning-mode) | 8 | Interaktiver Lernmodus |
| [sin-model-migration](https://github.com/OpenSIN-AI/OpenSIN-Code/tree/main/plugins/sin-model-migration) | 10 | Migration zwischen Sin-Modellen |
| [sin-agent-sdk-dev](https://github.com/OpenSIN-AI/OpenSIN-Code/tree/main/plugins/sin-agent-sdk-dev) | 10 | SDK-Entwicklung für Agenten |
| [sin-plugin-dev](https://github.com/OpenSIN-AI/OpenSIN-Code/tree/main/plugins/sin-plugin-dev) | 116 | Plugin-Entwicklungs-Toolkit (7 Skills, 100+ Docs) |
| [sin-pr-review](https://github.com/OpenSIN-AI/OpenSIN-Code/tree/main/plugins/sin-pr-review) | 18 | PR-Review-Toolkit (6 Agenten) |
| [sin-loop](https://github.com/OpenSIN-AI/OpenSIN-Code/tree/main/plugins/sin-loop) | 16 | Selbst-referenzielle Entwicklungsloops |
| [sin-ralph](https://github.com/OpenSIN-AI/OpenSIN-Code/tree/main/plugins/sin-ralph) | 7 | Ralph-Loop-Technik |

### Externe Plugins & Skills

| Repo | Zweck |
|------|-------|
| [Plugin-SIN-Biometrics](https://github.com/OpenSIN-AI/Plugin-SIN-Biometrics) | Governance, Policy Enforcement, Supervisor für OpenCode |
| [Plugin-SIN-Swarm](https://github.com/OpenSIN-AI/Plugin-SIN-Swarm) | Subagent-Workflow mit tmux, Parallel Fan-Out, MAX-Mode |
| [Skill-SIN-Agent-Forge](https://github.com/OpenSIN-AI/Skill-SIN-Agent-Forge) | OpenCode Skill: A2A-Agenten erschaffen |
| [Skill-SIN-Create-TelegramBot](https://github.com/OpenSIN-AI/Skill-SIN-Create-TelegramBot) | OpenCode Skill: Telegram-Bot Setup |
| [Skill-SIN-Enterprise-Deep-Debug](https://github.com/OpenSIN-AI/Skill-SIN-Enterprise-Deep-Debug) | OpenCode Skill: Strukturiertes Debugging |

---

## ☁️ CLOUD STORAGE

> **GitLab Storage ist tot!** GitLab hat unser Konto gesperrt. Ab sofort Box.com (10 GB free) + Google Drive (15 GB free).

| Provider | Storage | Purpose | Link |
|----------|---------|---------|------|
| **Box.com Public** | 10 GB | Logos, Bilder, Docs — öffentlich | [Link](https://app.box.com/s/1st624o9eb5xdistusew5w0erb8offc7) |
| **Box.com Cache** | 10 GB | Logs, Cache, Temp Files | [Link](https://app.box.com/s/9s5htoefw1ux9ajaqj656v9a02h7z7x1) |
| **Google Drive** | 15 GB | User-Daten, Backup | [Link](https://drive.google.com) |

→ [Vollständige Box Storage Doku](https://github.com/OpenSIN-AI/Infra-SIN-Dev-Setup/blob/main/box-storage.md)

## 🛠️ INFRA & TOOLS
> **Note:** As of April 2026, `OpenSIN-onboarding` has been consolidated into `Infra-SIN-Dev-Setup/user-onboarding/`. See [docs/CANONICAL-REPOS.md](./docs/CANONICAL-REPOS.md) for the complete archival map.


| Repo | Zweck |
|------|-------|
| [CLI-SIN-TelegramBot](https://github.com/OpenSIN-AI/CLI-SIN-TelegramBot) | Fleet-weites Telegram CLI + MCP |
| [CLI-SIN-Repo-Sync](https://github.com/OpenSIN-AI/CLI-SIN-Repo-Sync) | Repository Synchronisation |
| [Core-SIN-Control-Plane](https://github.com/OpenSIN-AI/Core-SIN-Control-Plane) | Doctor/Preflight/Eval Layer |
| [Infra-SIN-Docker-Empire](https://github.com/OpenSIN-AI/Infra-SIN-Docker-Empire) | 26-Container Docker Infrastruktur |
| [Infra-SIN-Dev-Setup](https://github.com/OpenSIN-AI/Infra-SIN-Dev-Setup) | Development Environment Setup + Box Storage Guide |
| [cloud-backend](https://github.com/OpenSIN-AI/cloud-backend) | 🔒 Proprietär: Stripe, OAuth, Premium-API |

---

## 📚 DOKU & SSOT

| Repo | Zweck |
|------|-------|
| [OpenSIN-overview](https://github.com/OpenSIN-AI/OpenSIN-overview) | **SSOT**: START-HERE.md, CANONICAL-REPOS.md, MASTER_INDEX.md (188 Repos) |
| [OpenSIN-documentation](https://github.com/OpenSIN-AI/OpenSIN-documentation) | Offizielle Doku (VitePress) — docs.opensin.ai |
| [OpenSIN-Code](https://github.com/OpenSIN-AI/OpenSIN-Code) | Core Engine Doku: [OpenSIN Code](https://docs.opensin.ai/docs/guide/opensin-code), [Rust Engine](https://docs.opensin.ai/docs/guide/opensin-code-rust-engine), [Plugins](https://docs.opensin.ai/docs/plugins/opensin-code-plugins) |
| [opensin-ai-cli](https://github.com/OpenSIN-AI/opensin-ai-cli) | ⚠️ Rationalization pending → see [docs/FOLLOWUPS.md § R1](./docs/FOLLOWUPS.md#r1-opensin-ai-cli--opensin-code) |
| [opensin-ai-platform](https://github.com/OpenSIN-AI/opensin-ai-platform) | ⚠️ Rationalization pending → see [docs/FOLLOWUPS.md § R2](./docs/FOLLOWUPS.md#r2-opensin-ai-platform--opensin) |

---

## 🧊 WICHTIGE ARCHIVIERTE REPOS

| Repo | Status |
|------|--------|
| `OpenSIN-Storage` | 🧊 Archiviert → Nachfolger: [A2A-SIN-Storage](https://github.com/OpenSIN-AI/A2A-SIN-Storage) ✅ |
| `OpenSIN-Ledger` | 🧊 Umbenannt → [Biz-SIN-Ledger](https://github.com/OpenSIN-AI/Biz-SIN-Ledger) ✅ |
| `documentation` | 🧊 Archiviert → Nachfolger: [OpenSIN-documentation](https://github.com/OpenSIN-AI/OpenSIN-documentation) ✅ |
| ~40 weitere Legacy-Repos | 🧊 Alle archiviert, Code erhalten |

---

## 🚀 SCHNELLSTART FÜR NEUE AGENTEN

1. **Lies die Regeln:** → [rules.md](./rules.md)
2. **Verstehe die Architektur:** → [registry/MASTER_INDEX.md](./registry/MASTER_INDEX.md)
3. **Wähle dein Team:** → Siehe Team-Orchestratoren oben
4. **Erstelle deinen Agenten:** → Nutze `Template-SIN-Agent` als Blueprint
5. **Sync die Flotte:** → Führe `sin-sync` nach jeder Config-Änderung aus
6. **Aktiviere Simone MCP + PCPM:** → Simone MCP für semantische Code-Navigation, PCPM für Cross-Session-Memory — beide sind Pflicht für jeden Agenten

---

## 🚀 OPENSIN-AI AGENT ROADMAP (vs. OpenClaw / Gemini / Claude Code)

> **Ziel:** OpenSIN-AI Agent muss alle Wettbewerber übertreffen.

### Feature-Parität & Differentiatoren

| Feature | OpenSIN-AI | OpenClaw | Gemini Agent | Claude Code |
|---------|:---------:|:--------:|:------------:|:-----------:|
| Open Source + Self-Hosted | ✅ | ✅ | ❌ | ❌ |
| 24/7 Autonomous (Heartbeat+Cron) | ✅ | ✅ | ❌ | ✅ (3d) |
| Multi-Model + Failover | ✅ | ✅ | ❌ | ❌ |
| Multi-Channel (19+ Platformen) | ✅ | ✅ | ❌ | ✅ (2) |
| Subagent Fleet (92+ Workers) | ✅ | ✅ | ❌ | ✅ (3) |
| External Harness (ACP) | ✅ | ✅ | ❌ | ❌ |
| Google Workspace Deep | ✅ | ✅ | ✅ | ❌ |
| Apple Ecosystem (12 Agents) | ✅ | ❌ | ❌ | ❌ |
| Agent SDK | ✅ | ❌ | ❌ | ✅ |
| Persistent Memory (Wiki+Journals) | ✅ | ✅ | ❌ | ✅ |
| Webhook + Cron + Heartbeat | ✅ | ✅ | ❌ | ❌ |
| Unified Agent Orchestrator | ✅ | ✅ | ❌ | ❌ |
| Approval Hooks | ✅ | ✅ | ❌ | ❌ |
| Session Branching | 🔲 | ✅ | ❌ | ❌ |
| Canvas/A2UI | 🔲 | ✅ | ❌ | ❌ |
| Voice Interaction | ✅ (Siri) | ✅ | ✅ | ❌ |

### Vollständige Spezifikation
→ [docs/opensin-ai-agent-feature-spec.md](./docs/opensin-ai-agent-feature-spec.md)

### Implementierungs-Roadmap
- **Sprint 1:** Heartbeat, Multi-Model Router, Approval Hooks, Cron Scheduler, Unified Orchestrator
- **Sprint 2:** Messaging API, Memory Wiki, Remote Control, Subagent Spawning
- **Sprint 3-4:** ACP Harness, Session Branching, Audit Logging
- **Sprint 5-6:** Canvas/A2UI, Voice, Google Workspace Deep

### Sprint 1 Verifiziert
- `HeartbeatSystem` koordiniert autonome Check-ins, Task-Queue-Polling und Graceful Shutdown.
- `FailoverRouter` routet zwischen OpenAI OCI, Antigravity und NIM mit Health-basierter Fallback-Kette.
- `CronScheduler` plant und führt wiederkehrende Aufgaben aus.
- `ApprovalHooks` erzwingt riskobasierte Freigaben für destruktive, Netzwerk-, Finanz- und Auth-Operationen.
- `AgentOrchestrator` verbindet alle vier Systeme mit `AgentLoop`, `LoopMode`, `SmartModelRouter` und `PermissionEvaluator`.
- `CLIAgent` nutzt den Orchestrator jetzt für Modellrouting und Policy-Prüfung.

---

*Zuletzt aktualisiert: 2026-04-09 | OpenSIN-AI CEO Audit*


## 🤖 Agent Configuration (A2A v5)

New agents are configured via the `/create-a2a-sin-agent` skill. 
Documentation: [How to Configure Agents](https://github.com/OpenSIN-AI/OpenSIN-documentation/blob/main/docs/guide/how-to-configure-agents.md)
