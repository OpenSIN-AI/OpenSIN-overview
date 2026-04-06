# 📜 OPENSIN-AI: DIE UNANTASTBAREN REGELN

**⚠️ PFLICHTLEKTÜRE FÜR JEDES MITGLIED UND JEDEN AGENTEN ⚠️**

Bevor du auch nur eine Zeile Code schreibst, ein Repository erstellst oder eine Konfiguration änderst, **MUSST** du diese Regeln vollständig gelesen und verstanden haben. Unwissenheit schützt vor Rauswurf nicht.

---

## 🚨 PRIORITY -5.0: ABSOLUTES ANNAHMEN-VERBOT

**NIEMALS ANNAHMEN. NIEMALS.**

- Ein Agent darf NIEMALS eine Schlussfolgerung ziehen, ohne sie mit echten Daten, Logs, Tests oder Code belegt zu haben.
- KEINE Diagnose ohne Beweis. KEINE Behauptung ohne Verifizierung.
- KEIN "ich denke", "wahrscheinlich", "vermutlich", "es scheint".
- Wer Annahmen macht statt Fakten zu prüfen, fliegt SOFORT und PERMANENT aus dem Netzwerk.

---

## 🚨 PRIORITY -4.0: IMMEDIATE BUG REGISTRY & ISSUE PROTOCOL

**1. JEDER BUG MUSS SOFORT ALS GITHUB ISSUE ERSTELLT WERDEN**
- Jeder Agent/Coder MUSS jeden kleinsten Bug, Fehler, Exception oder unerwartetes Verhalten SOFORT als Issue mit dem Label `Bug` ins entsprechende Repository hochladen.
- ZUERST Issue erstellen, DANN fixen. Keine Ausnahmen.

**2. ISSUE-SUCHE VOR JEDEM DEBUGGING (PFLICHT)**
- Vor dem Debuggen MUSS das Repo auf bestehende Issues durchsucht werden (`gh issue list --search "dein error"`).

**3. 100% TEST-BEWEIS PFLICHT**
- KEIN Agent darf behaupten, dass etwas funktioniert, bevor er es mit einem erfolgreichen Test-Lauf bewiesen hat.
- Ohne Test-Output gilt ein Fix als **ungültig**.

---

## 🚨 PRIORITY -3.1: TODO CONTINUATION FIX RULE

- Die `[TODO CONTINUATION]` Meldung darf dem User NIEMALS angezeigt werden.
- Bei veralteter Todo-Liste: Still im Hintergrund aktualisieren.
- Bei Rate Limit Errors: Auto-retry mit exponential backoff. Den User NIEMALS informieren.

---

## 🚨 PRIORITY -3.05: GITHUB TOPICS + WEBSITE RULE

- **Pflicht-Topic:** JEDES A2A-SIN-Agenten-Repo MUSS das Topic `opnsin-agent` tragen.
- **Pflicht-Website:** JEDES A2A-SIN-Agenten-Repo MUSS die Agenten-Seite aus dem Dashboard als Homepage setzen (`https://a2a.delqhi.com/agents/<slug>`).
- Wer Topics oder Website-Feld vergisst, verstößt gegen das Protokoll.

---

## 🚨 PRIORITY -3: OPENCODE MODEL MANDATE

**JEDER A2A Agent ruft LLMs AUSSCHLIESSLICH über die `opencode` CLI auf:**

```python
import subprocess, json

def call_llm(prompt: str, timeout: int = 120) -> str:
    result = subprocess.run(
        ["opencode", "run", prompt, "--format", "json"],
        capture_output=True, text=True, timeout=timeout,
    )
    parts = []
    for line in result.stdout.splitlines():
        try:
            ev = json.loads(line)
            if ev.get("type") == "text":
                parts.append(ev.get("part", {}).get("text", ""))
        except json.JSONDecodeError:
            pass
    return "".join(parts).strip()
```

**VERBOTENE PROVIDER — SOFORTIGER BAN:**
- ❌ `gemini-api` (direkte Google API)
- ❌ `google` mit direktem apiKey
- ❌ `anthropic` (direkt)
- ❌ OCI-Proxy direkt per HTTP anrufen (liefert 500)
- ❌ `requests.post(...)` oder `urllib` für LLM

**EINZIGE ERLAUBTE PROVIDER:**
- ✅ `google` (NUR via Antigravity Plugin, KEIN apiKey im options)
- ✅ `openai` (via OCI Proxy)
- ✅ `nvidia-nim` (Spezialmodelle)

**REGELN:**
- `"model"` MUSS `openai/gpt-5.4` oder `google/antigravity-*` sein.
- Der `gemini-api` Provider Block darf NIEMALS in `opencode.json` existieren.
- Nach JEDER Änderung an `opencode.json` MUSS `sin-sync` ausgeführt werden.

---

## 🚨 PRIORITY -2.9: DESIGN-TASK ROUTING RULE

- Alle Design-, UI-, UX-, Layout-, Motion-, Accessibility-, Styling- und Frontend-Design-Aufgaben dürfen AUSSCHLIESSLICH an `Team-SIN-Frontend` delegiert werden.
- Andere Coding-Agenten dürfen Design-Aufgaben nicht "nebenbei" übernehmen.

---

## 🚨 PRIORITY -2: TECHNOLOGY SOVEREIGNTY MANDATE

**PERMANENT GEBANNTE TECHNOLOGIEN (SOFORTIGER BAN BEI NUTZUNG):**

| Technologie | Grund | Ersatz |
|-------------|-------|--------|
| **Camoufox** | Firefox-basiert, bricht Chrome-Profil-Ökosystem | nodriver + Chrome Profil |
| **Playwright** | WebDriver-basiert, Bot-erkennbar | nodriver + Chrome Profil |
| **Puppeteer** | WebDriver-basiert, veraltet | nodriver + Chrome Profil |
| **Selenium** | WebDriver-basiert, sofort erkennbar | nodriver + Chrome Profil |
| **Jede Firefox-basierte Automation** | Bricht Chrome-Profil-Ökosystem | nodriver + Chrome Profil |

**GENEHMIGTE BROWSER-AUTOMATION (AUSSCHLIESSLICH):**
- ✅ **nodriver** — Chrome-basiert, kein WebDriver, echtes Chrome-Profil
- ✅ **webauto-nodriver-mcp** — Unser MCP-Wrapper um nodriver
- ✅ **CDP (Chrome DevTools Protocol)** — Direkter Chrome-Zugriff
- ✅ **curl_cffi** — Für pure HTTP-Requests mit Chrome TLS-Fingerprint
- ✅ **OpenSIN-Bridge Chrome Extension** — Unsere native Browser-Automation (BEVORZUGT!)

**⚠️ IMMER DIE OPENSIN-BRIDGE CHROME EXTENSION BEVORZUGEN!**
Die OpenSIN-Bridge läuft nativ im echten Chrome-Profil des Users, ist zu 100% undetectable und bietet 39 MCP-Tools für Tab-Manipulation, Network-Logging, Video-Capture und DOM-Zugriff.

---

## 🚨 PRIORITY -1: DEVTOOLS-FIRST MANDATE

**VOR dem Schreiben von JEDEM CSS-Selektor oder JS-Klick-Code MUSS DevTools konsultiert werden:**

1. **Elements-Tab**: HTML-Struktur inspizieren
2. **Console**: `document.querySelector('.dein-selektor')` — wenn `null` → STOP
3. **Console**: `element.offsetParent !== null` prüfen
4. **Console**: `window.getComputedStyle(el).display` und `.visibility` prüfen
5. **Network-Tab**: Bei AJAX-Klicks HTTP-Requests checken
6. **Console-Errors**: Alle JS-Errors VOR dem Klick-Code lesen

**WER EINEN SELEKTOR OHNE DEVTOOLS-VERIFIKATION SCHREIBT FLIEGT AUS DEM NETZWERK.**

---

## 🚨 PRIORITY 0000: VISUAL EVIDENCE MANDATE

- KEINE Dokumentation, KEINE README und KEIN GitHub-Issue darf reiner Text sein.
- JEDES Artefakt MUSS visuelle Beweise enthalten: Screenshots, Bilder, Diagramme, Videos.
- Text-only Doku = Protokollverstoß = Rauswurf.

---

## 🚨 PRIORITY 0000: GLOBAL FLEET SELF-HEALING PROTOCOL

- JEDER Agent, der einen Error feststellt, DARF SICH NIEMALS SELBST IM SILO REPARIEREN.
- **Prozess:** Loggen → GitHub Issue erstellen → SIN-Hermes benachrichtigen → Team Coder delegiert Fix.

---

## 🚨 PRIORITY 0001: IDLE WORKFORCE & MONETIZATION DIRECTIVE

- A2A Agenten sitzen NIEMALS dumm rum. Idle-Time ist verboten.
- **Bug Bounties:** Eigenständig auf HackerOne/OpenAI suchen und einreichen.
- **Freelancing:** Agenten bewerben sich autonom auf Upwork, Freelancer, etc.
- **Surveys:** Vollautomatisch auf freigegebenen Plattformen.

---

## 🚨 PRIORITY 0: INBOUND WORK + PR WATCHER GOVERNANCE

- **KEINE rohen externen Payloads direkt konsumieren.** Jede Nachricht MUSS zuerst in das kanonische `work_item`-Schema normalisiert werden.
- **n8n ist die einzige Intake-Spur:** Jede externe Plattform (GitHub, Telegram, Upwork) wirft Payloads via Webhook/Poller in n8n. n8n normalisiert und leitet an den PR-Watcher weiter.
- **NIEMALS GitHub Actions für CI/CD oder Automation nutzen.** Stattdessen: **n8n + A2A-SIN-Github-Action**.
- **Pflichtartefakte pro Repo:** `governance/repo-governance.json`, `governance/pr-watcher.json`, `platforms/registry.json`, `n8n-workflows/inbound-intake.json`, `scripts/watch-pr-feedback.sh`.

---

## 🚨 PRIORITY 0: GLOBAL DEBUGGING + ISSUE PROTOCOL

- Bei JEDEM Fehler MUSS zuerst der Skill `enterprise-deep-debug` verwendet werden.
- Zu jedem Bug MUSS ein GitHub Issue erstellt oder aktualisiert werden.
- **KEINE Ad-hoc-Bastelfixes ohne strukturierten Debugging-Lauf.**

---

## 🚨 NAMING CONVENTIONS (STRIKT)

Jedes Repository in der OpenSIN-AI Organisation MUSS diesem Schema folgen:

`[Type]-SIN-[Name]`

| Präfix | Zweck | Beispiel |
|--------|-------|----------|
| `Team-SIN-*` | Team Orchestratoren / Manager | `Team-SIN-Frontend` |
| `A2A-SIN-*` | Worker Agents | `A2A-SIN-Worker-Prolific` |
| `MCP-SIN-*` | MCP Server / Tools | `MCP-SIN-Browser` |
| `CLI-SIN-*` | Command Line Interfaces | `CLI-SIN-TelegramBot` |
| `Skill-SIN-*` | OpenCode Skills | `Skill-SIN-Agent-Forge` |
| `Plugin-SIN-*` | OpenCode Plugins | `Plugin-SIN-Biometrics` |
| `Infra-SIN-*` | Infrastruktur & DevOps | `Infra-SIN-Docker-Empire` |
| `Biz-SIN-*` | Business & Operations | `Biz-SIN-Marketing` |
| `Core-SIN-*` | Core Engine & Control Plane | `Core-SIN-Control-Plane` |

**VERBOTEN:** Repos mit `OpenSIN-*` Präfix (außer Core-Infra wie `OpenSIN-Code`, `OpenSIN-backend`, `OpenSIN-documentation`).

---

## 🚨 HUB & SPOKE ARCHITEKTUR

- **Worker (`A2A-SIN-*`) kommunizieren NIEMALS direkt miteinander.**
- Worker sprechen **NUR** mit ihrem `Team-SIN-*` Manager.
- Team-Manager kommunizieren untereinander via A2A Protocol.
- Nur `Team-SIN-*` Agenten besitzen einen `TELEGRAM_BOT_TOKEN`. Worker bleiben stumm.

---

## 🚨 CHROME PROFILE REGEL

| Profil | Email | WANN NUTZEN |
|--------|-------|-------------|
| **Geschäftlich** | `info@zukunftsorientierte-energie.de` | ✅ Admin Console, Domain-Wide Delegation, Workspace |
| **Default** | `zukunftsorientierte.energie@gmail.com` | ❌ NUR privat - NIEMALS für Admin! |

- **NUR EINE SESSION PRO PROFIL.** Niemals mehrere nodriver/AppleScript Sessions starten.
- Immer existierende Session via CDP verbinden.

---

## 🚨 GOOGLE DOCS SUPREMACY RULE

- Bei JEDER Aufgabe rund um Google Docs MUSS zuerst `sin-google-apps` verwendet werden.
- **NIEMALS** rohe Plaintext-Blöcke, Markdown-Pseudotabellen oder Copy/Paste als "fertiges" Google Doc hinterlassen.
- **App-Passwörter sind NIEMALS für Google Docs/Drive/Sheets erlaubt.**

---

## 🚨 THE PURE AGENTIC PARADIGM

- **WIR BAUEN KEINE MONOLITHISCHEN BACKENDS.** Wir bauen AUSSCHLIESSLICH Frontends und eigenständige A2A-Agenten.
- **n8n auf der OCI VM** ist unser unzerstörbarer Router.
- **Supabase** ist unsere globale Datenbank (200GB auf OCI). Keine lokalen SQLite-Files!
- **GitLab LogCenter** ist unser zentrales Logging. Alles wandert dorthin.
- **`sin-sync`** MUSS nach JEDER Änderung an globaler OpenCode-Config ausgeführt werden.

---

## 🚨 WEBAUTO-NODRIVER-MCP: GLOBAL HACKER PROTOCOL

- Bei JEDER Aufgabe die Browser, Web-Logins, Automatisierung, OAuth, Captchas erfordert:
  - **ZUERST prüfen ob es mit `webauto-nodriver-mcp` lösbar ist.**
  - Wenn ja, DANN MUSS es verwendet werden! KEINE AUSNAHMEN!
- **JEDER Coder der eine Aufgabe ohne webauto-nodriver-mcp macht obwohl es möglich wäre, wird SOFORT aus dem Projekt verbannt.**

---

*Dieses Dokument ist die einzige Wahrheit. Bei Widersprüchen zwischen diesem Dokument und anderem Code gilt dieses Dokument.*
*Zuletzt aktualisiert: 2026-04-06*
