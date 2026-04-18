---
title: "CI/CD mit n8n + sin-github-action"
---

# CI/CD mit n8n + sin-github-action

> **🚨 ABSOLUTES VERBOT: Normale GitHub Actions Runner von GitHub DÜRFEN NIEMALS genutzt werden!**
>
> GitHub Actions Billing ist ein bekanntes Blocking-Problem in der OpenSIN-AI Organisation. Jede CI/CD-Pipeline MUSS über **n8n auf der OCI VM** + **sin-github-action** laufen.

---

## Warum kein normales GitHub Actions?

| Problem | Details |
|---------|---------|
| 💸 **Billing blockiert** | GitHub Actions Billing schlägt fehl → Jobs starten nicht |
| 🐢 **Zu langsam** | Paid Runner: 10+ Minuten Startup + Build |
| 🔒 **Vendor Lock-in** | Abhängigkeit von GitHub Infrastruktur |
| 💰 **Kosten** | Bezahlte Runner = direkte Kosten pro Minute |

**Unsere Lösung:** GitHub Runner läuft nur ~2 Sekunden (curl-only), der eigentliche Build läuft auf unserem **kostenlosen OCI VM (Oracle Cloud Always-Free)**. Zero Billing.

---

## Architektur

```
GitHub Push/PR
     │
     ▼
sin-github-action (composite, nur curl — ~2s, fast kostenlos)
     │ POST /webhook/opensin-ci
     ▼
n8n @ http://92.5.60.87:5678  (n8n.delqhi.com)
     │ HTTP Request Node → 172.18.0.1:3456/run
     ▼
opensin-ci-runner.py (systemd service auf OCI VM)
     │ git clone → bun install → bun run build → bun test
     ▼
GitHub Commit Status API ✅ / ❌
```

### Komponenten

| Komponente | Ort | Zweck |
|-----------|-----|-------|
| `sin-github-action` | [github.com/OpenSIN-AI/sin-github-action](https://github.com/OpenSIN-AI/sin-github-action) | Composite GitHub Action (nur curl, ~2s) |
| n8n Workflow `VhDVux7dSCoQdkOP` | OCI VM 92.5.60.87:5678 | Webhook → CI Runner Dispatcher |
| `opensin-ci-runner.py` | `/home/ubuntu/opensin-ci-runner.py` (OCI) | Python HTTP Server, führt Build/Test aus |
| systemd service | `opensin-ci-runner.service` (OCI) | Hält den CI Runner am Leben |
| OCI Self-Hosted Runners | 2x `oci-a1flex-arm64` | GitHub runner labels for PR workflow dispatch |

---

## Setup für ein neues Repo

### 1. Secret setzen

```bash
gh secret set N8N_CI_WEBHOOK_URL \
  --repo OpenSIN-AI/<DEIN-REPO> \
  --body "http://92.5.60.87:5678/webhook/opensin-ci"
```

### 2. `.github/workflows/ci.yml` anlegen

```yaml
name: CI → n8n OCI Runner

# ╔══════════════════════════════════════════════════════════════════╗
# ║  ZERO BILLING CI — delegates all work to n8n on OCI VM          ║
# ║  Runner cost: ~2s (curl only) instead of 10+ min paid runners   ║
# ║  Build/test/lint runs on: OCI VM via n8n @ n8n.delqhi.com       ║
# ╚══════════════════════════════════════════════════════════════════╝

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
      - name: Dispatch CI to n8n OCI Runner
        uses: OpenSIN-AI/sin-github-action@main
        with:
          n8n_webhook_url: ${{ secrets.N8N_CI_WEBHOOK_URL }}
          github_token: ${{ secrets.GITHUB_TOKEN }}
          pipeline: all
```

### 3. Fertig

Der Push triggert automatisch:
1. GitHub Action startet (ubuntu-latest, ~2s)
2. `sin-github-action` setzt Commit-Status auf `pending`
3. POST an n8n Webhook `http://92.5.60.87:5678/webhook/opensin-ci`
4. n8n leitet weiter an CI Runner (Port 3456 auf OCI Host)
5. CI Runner klont Repo, führt `bun run build` + `bun test` aus
6. GitHub Commit-Status wird auf `success` ✅ oder `failure` ❌ gesetzt

---

## Verfügbare Pipeline-Modi

Der `pipeline` Input in der Action steuert, was gebaut wird:

| Wert | Was läuft |
|------|-----------|
| `all` | build + test (Standard) |
| `build` | Nur `bun run build` |
| `test` | Nur `bun test` |
| `lint` | Nur `bun run lint` |

---

## n8n Workflow Details

### Workflow: `OpenSIN CI Webhook`
- **ID:** `VhDVux7dSCoQdkOP`
- **Webhook Path:** `opensin-ci`
- **Webhook URL:** `http://92.5.60.87:5678/webhook/opensin-ci`
- **Öffentliche URL:** `https://n8n.delqhi.com/webhook/opensin-ci`

### n8n API Key (für Verwaltung)

```bash
# Niemals Klartext-Secrets committen.
# Den API-Key aus GitHub Secrets, OCI-Env oder einem Secret Store laden.
N8N_KEY="${N8N_API_KEY:?set-in-secret-store}"
N8N_URL="http://92.5.60.87:5678"

# Workflow Status prüfen
curl -H "X-N8N-API-KEY: $N8N_KEY" "$N8N_URL/api/v1/workflows/VhDVux7dSCoQdkOP" | python3 -c "import json,sys; d=json.load(sys.stdin); print('active:', d.get('active'))"

# Workflow aktivieren (nach Neustart nötig)
curl -X POST -H "X-N8N-API-KEY: $N8N_KEY" "$N8N_URL/api/v1/workflows/VhDVux7dSCoQdkOP/activate"
```

### ⚠️ Wichtig: n8n Webhook Registrierung

In n8n 2.12 (SQLite) werden Webhooks **nur beim Startup** aus der DB geladen. Wenn der Workflow nach dem Start über die API aktiviert wird, muss der Container neugestartet werden:

```bash
ssh ubuntu@92.5.60.87 "docker restart n8n-n8n-1 && sleep 15"
```

Nach dem Neustart prüfen:

```bash
curl -H "X-N8N-API-KEY: $N8N_KEY" "$N8N_URL/api/v1/workflows/VhDVux7dSCoQdkOP"
```

**Erwartet:** `"active": true`

---

## CI Runner auf OCI VM

### Status checken

```bash
ssh ubuntu@92.5.60.87 'systemctl status opensin-ci-runner.service'
```

### Logs ansehen (folgen)

```bash
ssh ubuntu@92.5.60.87 'journalctl -u opensin-ci-runner.service -f'
```

### Manueller Testlauf

```bash
curl -X POST http://172.18.0.1:3456/run \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "opensin-ci-2026",
    "repo": "OpenSIN-AI/OpenSIN-Code",
    "sha": "$(git rev-parse HEAD)",
    "ref": "refs/heads/main",
    "pipeline": "all",
    "github_token": "'"$(gh auth token)"'"
  }'
```

### Neustart

```bash
ssh ubuntu@92.5.60.87 'sudo systemctl restart opensin-ci-runner.service'
```

---

## Skalierung & Performance

### Zwei Runner auf einer VM

Auf der OCI VM laufen zwei unabhängige GitHub Self-Hosted Runner:
- `oci-a1flex-arm64`
- `oci-a1flex-arm64-2`

Beide haben die Labels `self-hosted,linux,arm64,oci`. Dies erlaubt bis zu **zwei parallele Jobs** auf derselben Maschine.

### Turbo Remote Cache

Ein gemeinsamer Cache unter `/opt/turbo-cache` beschleunigt wiederholte Builds. Die CI Runner führen aus:

```bash
bun run build -- --remote-cache=file:///opt/turbo-cache
```

---

## PR Watcher / Commit Status

Die `sin-github-action` setzt den Commit-Status automatisch auf `pending` und die CI Runner posten final `success` oder `failure`. Dies erscheint direkt auf PRs als Status-Check und blockiert Merge, bis der Build grün ist.

Für manuelle Nachforderung:

```bash
gh api -X POST repos/OpenSIN-AI/<REPO>/statuses/<SHA> \
  -f state='success' \
  -f context='n8n-ci / all' \
  -f description='Manually set' \
  -f target_url='https://n8n.delqhi.com'
```

---

## Bekannte Probleme & Fixes

| Problem | Fix |
|---------|-----|
| `Webhook "POST opensin-ci" is not registered` | `docker restart n8n-n8n-1` auf OCI VM (n8n 2.12 lädt Webhooks nur beim Startup) |
| `account payments have failed` | Normal bei GitHub-hosted Runner — timeout-minutes: 2 setzen oder self-hosted Runner nutzen |
| CI Runner antwortet nicht | `sudo systemctl restart opensin-ci-runner` auf OCI VM |
| n8n Container Conflict | `docker rm -f n8n-n8n-1 && cd /opt/n8n && docker compose up -d` |
| Build zu langsam | Turbo Remote Cache prüfen (`ls /opt/turbo-cache`) und sicherstellen, dass beide Runner denselben Pfad nutzen |

---

## Operator Checklist

- [ ] N8N_CI_WEBHOOK_URL Secret in jedem Repo gesetzt
- [ ] `.github/workflows/ci.yml` entspricht exakt dem obigen Template
- [ ] Workflow-ID in allen Docs ist `VhDVux7dSCoQdkOP`
- [ ] OCI VM: `opensin-ci-runner.service` aktiv und gesund
- [ ] Zwei Runner in GitHub Org sichtbar (`oci-a1flex-arm64`, `oci-a1flex-arm64-2`)
- [ ] `/opt/turbo-cache` existiert und ist beschreibbar
- [ ] n8n Workflow aktiviert (`curl .../workflows/VhDVux7dSCoQdkOP`)

---

## Migration von alten GitHub Actions

Vorhandene Repos mit normalem GitHub Actions Workflow:

1. Workflow-Datei `.github/workflows/ci.yml` durch obiges Template ersetzen
2. Secret `N8N_CI_WEBHOOK_URL` hinzufügen
3. Alle anderen CI-Workflows löschen (z.B. `test.yml`, `lint.yml`)
4. PR-Status-Branches auf `n8n-ci / all` umstellen

---

## Glossary

| Begriff | Bedeutung |
|---------|-----------|
| OCI VM | Oracle Cloud Infrastructure Always-Free VM (aarch64, Ubuntu 24.04) |
| n8n | Workflow Automation Server auf OCI (`n8n.delqhi.com`) |
 sin-github-action | Leichtgewicht GitHub Composite Action, POSTet nur an n8n |
| opensin-ci-runner.py | Python HTTP Server, führt Build/Test auf OCI aus |
| pipeline | Modus: `all`, `build`, `test`, `lint` |

---

*Zuletzt aktualisiert: 2026-04-08 | OpenSIN-AI CEO Audit*
