# Launch Checklist — 4 Days to Public

> **Stand:** 2026-04-19. **Target Launch:** 2026-04-23 (T-4).
> **Scope:** Alle 3 Tiers gleichzeitig gehen live (OpenSIN OSS / My.OpenSIN Pro / Marketplace).
> **Dieses Dokument:** Einziger Wahrheitsort für "ist der Launch möglich". Jeden Morgen 09:00 UTC in der Org-All-Hands durchgehen. Keine Entscheidung fliegt hier rein ohne Commit-Link oder Tracking-Issue.
>
> **Quellen:** [STATE-OF-THE-UNION.md](./STATE-OF-THE-UNION.md) (Ist-Zustand) · [PRODUCT-VISION.md](./PRODUCT-VISION.md) (Soll-Zustand) · [docs/FOLLOWUPS.md](./docs/FOLLOWUPS.md) (offene Entscheidungen).

---

## 0. Go/No-Go Kriterien

Der Launch geht nur, wenn **alle** folgenden Kriterien am T-0 09:00 UTC grün sind. Wenn auch nur eines rot ist, verschiebt `Biz-SIN-Marketing` den Launch um mindestens 24 h.

| # | Kriterium | Messbar durch | Status |
|---|---|---|---|
| G1 | `opensin.ai` liefert HTTP 200, render < 2 s, CLS < 0.1 | Lighthouse CI auf `website-opensin.ai` | 🔴 **open** |
| G2 | `my.opensin.ai` liefert HTTP 200 und zeigt Marketplace-Katalog aus `oh-my-sin.json` | Lighthouse + manueller Check | 🔴 **open** |
| G3 | `docs.opensin.ai` liefert HTTP 200 mit Consolidation-Seite live | manueller Check | 🔴 **open** |
| G4 | `chat.opensin.ai` erlaubt Login mit neuer Email, zeigt leeres Fleet-Dashboard | End-to-end Test von einem sauberen Account | 🔴 **open** |
| G5 | Echter Stripe-Kauf (`€29/mo Starter`) geht von `my.opensin.ai` → `chat.opensin.ai` Pro-Tier-Freischaltung durch | Siehe [docs/STRIPE-SMOKE-TEST.md](./docs/STRIPE-SMOKE-TEST.md) | 🔴 **open** |
| G6 | Marketplace-Kauf eines Team-Bundles schaltet im `chat.opensin.ai`-Dashboard den Zugriff auf die Agenten frei | Stripe Smoke-Test §4 | 🔴 **open** |
| G7 | Alle 6 HF Spaces (`a2a-sin-code-*`) antworten mit 200 auf `/health` | `scripts/check-hf-spaces.sh` (siehe § Tag 1) | 🔴 **503 seit ≥3 Tagen** |
| G8 | `OpenSIN-Code` CLI installiert sich via `npm i -g opensin-code` und startet einen Hello-World-Agent | Manueller Install auf frischer VM | 🔴 **open** |
| G9 | `OpenSIN` Python-Core installiert sich via `pip install opensin` und läuft `opensin --help` | Manueller Install auf frischer VM | 🔴 **open** |
| G10 | Keiner der 4 canonical UI-Repos verweist noch auf `Delqhi/*` URLs | [FOLLOWUPS §L1](./docs/FOLLOWUPS.md#l1-delqhi---opensin-ai-infra-sin--link-sweep-across-other-repos) | 🟡 in progress |

**Wenn G7 nicht gefixt ist, ist der Launch gestorben.** Die Fleet-Control-Plane kann keine Tasks dispatchen, wenn die 6 Worker-Spaces 503 liefern.

---

## 1. Tier × Repo Matrix (was launcht, was bleibt)

| Tier | Canonical URL | Owning Repo | Launch-Blocker |
|---|---|---|---|
| OSS Marketing | opensin.ai | `website-opensin.ai` | OSS-1, OSS-2 |
| OSS Docs | docs.opensin.ai | `OpenSIN-documentation` | DOC-1, DOC-2 (D1 in FOLLOWUPS) |
| OSS Code — Python | `pip install opensin` | `OpenSIN` | OSS-3 (PyPI-Publish), R3 |
| OSS Code — TS CLI | `npm i -g opensin-code` | `OpenSIN-Code` | OSS-4 (npm-Publish), R1 |
| OSS Infra — Memory | (self-host) | `Infra-SIN-Global-Brain` | OSS-5 (readme/quickstart) |
| OSS Infra — OpenCode | (self-host) | `Infra-SIN-OpenCode-Stack` | L1 sweep |
| Pro Marketing / Funnel | my.opensin.ai | `website-my.opensin.ai` | PRO-1, PRO-2, PRO-3, L1 |
| Pro App | chat.opensin.ai | `OpenSIN-WebApp` | PRO-4, PRO-5, PRO-6 |
| Pro Backend / Fleet-CP | (internal) | `OpenSIN-backend` | CP1, HF-1 (crit) |
| Marketplace Katalog | my.opensin.ai/marketplace | `website-my.opensin.ai` | MP-1, MP-2, M2 |
| Marketplace Entitlements | chat.opensin.ai | `OpenSIN-WebApp` + `OpenSIN-backend` | MP-3 |

**Nicht launch-kritisch, dürfen rot bleiben:** R1, R2, L2, S2, C1, C2, CP1. Alle tracking-relevant, aber blockieren keinen User. In Wave 5 aufräumen.

---

## 2. Tag-für-Tag Plan

Jeder Tag hat drei Phasen: **09:00 Standup · 13:00 Mid-day Checkin · 18:00 EOD Review**. Am Ende jedes Tages wandert jedes Item in eine von zwei Spalten: `DONE` oder `BLOCKED`. Kein `in progress` nach 18:00. Wenn blocked, Name des Blockers in die Checkliste.

### Tag 1 — T-3 (Mittwoch 2026-04-19) — INFRASTRUKTUR & DATENLAGE

**Ziel des Tages:** Ende Tag 1 steht jede Pipeline. Kein Produkt funktioniert noch, aber jede URL kann etwas rendern und die 6 HF Spaces laufen wieder.

| ID | Owner | Was | Definition of Done |
|---|---|---|---|
| HF-1 | `OpenSIN-backend` maintainers | **#1 Priority.** HF-Token rotieren, alle 6 `a2a-sin-code-*` Spaces via HF-API restarten, GitHub-Action mit 12h-cron landen (Template in [`registry/DEPLOYMENT_STATUS.md`](./registry/DEPLOYMENT_STATUS.md)) | `curl https://opensin-ai-a2a-sin-code-plugin.hf.space/health` → 200 für alle 6. Cron-Workflow sichtbar im `Infra-SIN-OpenCode-Stack` GH-Actions-Tab. |
| HF-2 | `OpenSIN-backend` maintainers | Launch-Monitor: Uptime-Check auf alle 6 Spaces + `chat.opensin.ai` + `my.opensin.ai` + `opensin.ai` + `docs.opensin.ai`. Empfehlung: UptimeRobot Free oder BetterStack. | 10 Monitore live, Slack-Alert-Channel `#launch-alerts` verbunden. |
| INFRA-1 | `Infra-SIN-Dev-Setup` | Stripe-Test-Mode Keys in allen 4 Web-Repos als ENV konfigurieren (`STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`) | `echo $STRIPE_SECRET_KEY` in Vercel für jedes Project liefert einen `sk_test_*`-Wert. |
| INFRA-2 | `Infra-SIN-Dev-Setup` | Supabase Projekte für Staging + Prod aufsetzen, RLS-Policies aus `OpenSIN-WebApp` anwenden | Supabase-Auth mit Testaccount geht durch, `users` Table hat RLS `auth.uid() = id` policy. |
| L1-sweep | `Infra-SIN-Dev-Setup` | Final `gh search code 'Delqhi/upgraded-opencode-stack OR Delqhi/global-brain' --owner OpenSIN-AI` und per-Repo-PRs für jeden Hit (wir erwarten ≤ 2) | 0 Hits beim Re-Check am 18:00. |
| DOC-1 | `OpenSIN-documentation` | Consolidation-Page `docs.opensin.ai/april-2026-consolidation` live (siehe D1 in FOLLOWUPS). Deep-Links nach hier + STATE-OF-THE-UNION. | URL liefert 200, Seite ist im Docusaurus-Sidebar verlinkt. |

**Kaffee-Pause-Entscheidung:** Wenn HF-1 um 13:00 nicht grün ist, eskaliert `Biz-SIN-Marketing` den Launch-Termin **heute** — nicht am letzten Tag.

---

### Tag 2 — T-2 (Donnerstag 2026-04-20) — TIER 1 (OSS) FERTIGSTELLEN

**Ziel des Tages:** OSS-Launch ist fertig und testbar. Drei Kanäle: Website, Docs, Install-Pfad.

| ID | Owner | Was | Definition of Done |
|---|---|---|---|
| OSS-1 | `website-opensin.ai` | Landing `/` mit Value-Prop aus [PRODUCT-VISION § Kompetitive Positionierung](./PRODUCT-VISION.md#kompetitive-positionierung). CTA: "Get started" → GitHub + "Read the docs" → docs.opensin.ai | Lighthouse Perf ≥ 90, Access ≥ 90, LCP ≤ 2.0 s, CLS ≤ 0.1. |
| OSS-2 | `website-opensin.ai` | 3-Tier-Modell auf Landing sichtbar (Free / Pro / Marketplace). Pro-CTA verlinkt zu `my.opensin.ai`. | Visual review + Responsive-Check bis 320 px. |
| OSS-3 | `OpenSIN` maintainers | `opensin` Python-Package auf PyPI publishen. Version `1.0.0`. | `pip install opensin` auf frischer Ubuntu-VM geht durch, `opensin --version` liefert 1.0.0. |
| OSS-4 | `OpenSIN-Code` maintainers | `opensin-code` npm-Package publishen. Version `1.0.0`. | `npm i -g opensin-code` auf frischer VM geht durch, `opensin-code hello` liefert Ausgabe. |
| OSS-5 | `Infra-SIN-Global-Brain` | README Quickstart in 5 Zeilen + Docker-Compose für lokalen PCPM-Daemon | Neuer Developer kann in ≤ 3 Min. einen lokalen PCPM hochziehen. |
| DOC-2 | `OpenSIN-documentation` | Install-Pfade für alle 4 OSS-Produkte (OpenSIN, OpenSIN-Code, Global-Brain, OpenCode-Stack) aus einer "Getting Started"-Seite heraus erreichbar | Klickpfad ≤ 2 Klicks von `docs.opensin.ai/` zu jedem Install-Tutorial. |

**Mid-day Checkin 13:00:** Ein Teammitglied macht einen Fresh-Install aller 4 OSS-Produkte von einer sauberen VM. Findet er einen Fehler: Fix heute, nicht morgen.

---

### Tag 3 — T-1 (Freitag 2026-04-21) — TIER 2 (PRO) + TIER 3 (MARKETPLACE) FERTIGSTELLEN

**Ziel des Tages:** Ein echter Stripe-Kauf geht end-to-end durch. Marketplace kann man durchklicken und kaufen.

| ID | Owner | Was | Definition of Done |
|---|---|---|---|
| PRO-1 | `website-my.opensin.ai` | Landing `/` mit Paid-Value-Prop (gehostete Flotte, pre-konfigurierte Keys, SLA). Pricing-Section mit 3 Tarifen aus PRODUCT-VISION. | Lighthouse ≥ 90. |
| PRO-2 | `website-my.opensin.ai` | Stripe Checkout-Session für Starter/Pro-Tier (Subscription). Success-Redirect → `chat.opensin.ai/welcome?session_id=...` | Test-Card `4242 4242 4242 4242` geht durch, User landet auf chat.opensin.ai. |
| PRO-3 | `website-my.opensin.ai` | Login-Button in der Topbar redirectet auf `chat.opensin.ai/login`. **Kein** Login auf my.opensin.ai (UI-Schichtung). | Manueller Check. |
| PRO-4 | `OpenSIN-WebApp` | `/login` Supabase-Auth (Email+Passwort, Google OAuth optional). Nach Login → `/dashboard`. | E2E-Test mit Playwright passt. |
| PRO-5 | `OpenSIN-WebApp` | `/dashboard` rendert leeres Fleet (für neuen User) oder Agent-Liste (für bestehenden User). Stripe-Webhook setzt `subscription_tier` auf `pro` nach Kauf. | Smoke-Test §2 passt. |
| PRO-6 | `OpenSIN-WebApp` | Stripe Customer Portal auf `/settings/billing`. User kann Abo canceln, Zahlungsmethode ändern. | Smoke-Test §3 passt. |
| CP-1 | `OpenSIN-backend` | Control-Plane `/v1/dispatch` Endpoint akzeptiert Task + erreicht einen echten A2A-Worker über `/a2a/v1` auf HF Space | curl-Test dispatcht einen Echo-Task an `a2a-sin-code-tool`, bekommt Antwort. |
| MP-1 | `website-my.opensin.ai` | `/marketplace` rendert alle 17 Team-Bundles aus `oh-my-sin.json` (SSOT in `Infra-SIN-OpenCode-Stack`). | Alle 17 Cards sichtbar, jede mit Name/Tagline/Agenten-Anzahl/Preis aus [`templates/teams/*.json`](./templates/teams). |
| MP-2 | `website-my.opensin.ai` | `/marketplace/[team-id]` Detail-Seite mit Stripe-Subscription-Checkout für das Add-on | Test-Kauf von `Team-SIN-Commerce` (€19/mo) geht durch. |
| MP-3 | `OpenSIN-WebApp` | Stripe-Webhook bei Marketplace-Kauf updated `user_teams` Table → `/dashboard` zeigt die neuen Agents | Smoke-Test §4 passt. |
| M2 | `Infra-SIN-OpenCode-Stack` | GH Action baut `oh-my-sin.json` aus `OpenSIN-overview/templates/teams/*.json`, commitet bei Änderung | Workflow läuft grün, `oh-my-sin.json` enthält 17 Teams. |

**EOD-Review 18:00:** Ein ganzer Smoke-Test-Durchlauf aus [docs/STRIPE-SMOKE-TEST.md](./docs/STRIPE-SMOKE-TEST.md) — alle 4 Abschnitte. Wenn §5 (End-State) rot: wir launchen morgen nicht.

---

### Tag 4 — T-0 (Samstag 2026-04-22) — LAUNCH + MONITORING

**Ziel des Tages:** 09:00 Go/No-Go. 10:00 Switch auf Stripe-Live-Mode. 12:00 Announcement. Rest des Tages: Support + Fire-Fighting.

| Zeit | Was | Owner |
|---|---|---|
| 09:00 | Go/No-Go Standup. Alle 10 G1–G10 Kriterien durchgehen. Ein rotes = No-Go. | Alle Maintainer |
| 09:30 | Finaler `gh search code` Sweep für Stale-References | `Infra-SIN-Dev-Setup` |
| 10:00 | Stripe von Test-Mode auf Live-Mode umschalten (Keys tauschen in Vercel Production ENV) | `website-my.opensin.ai` + `OpenSIN-WebApp` |
| 10:15 | Real-Money Smoke-Test: Ein Maintainer kauft echten €29 Starter-Monat auf eigene Kreditkarte. | Volunteered Maintainer |
| 10:30 | DNS-Check: `opensin.ai`, `my.opensin.ai`, `chat.opensin.ai`, `docs.opensin.ai` alle auf Vercel-IPs, TLS grün, HSTS aktiv. | `Infra-SIN-Dev-Setup` |
| 11:00 | `awesome-opensin` Readme-Update: Launch-Banner + Link zu Blog-Post. | `Biz-SIN-Marketing` |
| 12:00 | Announcement: Blog-Post auf `Biz-SIN-Blog-Posts`, X-Thread via `A2A-SIN-X-Twitter`, Discord-Ankündigung via `A2A-SIN-Discord`, HN-Submission manuell. | `Biz-SIN-Marketing` |
| 12:30 | **Die CTO liest jede HN-Antwort und antwortet innerhalb von 30 Minuten.** Dasselbe für Discord & Reddit. | CTO |
| 13:00 – EOD | Incident-Rotation. Jeder Maintainer hat 2h Pager-Dienst. Alerts aus HF-2 Uptime-Monitor nach `#launch-alerts`. Alles unter P1 in `docs/launch-retro-2026-04.md` loggen. | Alle Maintainer |

---

## 3. Risiken & Rollback-Plan

### Top-5 Risiken am Launch-Tag

| # | Risiko | Wahrscheinlichkeit | Impact | Mitigation |
|---|---|---|---|---|
| 1 | HF Spaces fallen während des Launches schon wieder auf 503 | hoch (history) | kritisch | Cron läuft 2×/h in den ersten 48 h statt alle 12 h. Auto-Restart bei 503 via GitHub-Action. |
| 2 | Stripe-Webhook erreicht `OpenSIN-WebApp` nicht (Vercel-Edge, Signatur-Fehler) | mittel | kritisch | Webhook mit `stripe-cli listen` während Test-Lauf mitschneiden. Stripe Dashboard → Webhooks hat Delivery-Log. |
| 3 | PyPI-Publish für `opensin` wird abgelehnt (Name vergeben?) | niedrig | hoch | Heute (Tag 1) auf PyPI reservieren. Fallback-Name: `opensin-ai`. |
| 4 | npm-Publish für `opensin-code` wird abgelehnt | niedrig | hoch | Heute auf npm reservieren. Fallback: `@opensin-ai/cli`. |
| 5 | HN-Post floppt weil Website keinen "aha" in 5 Sekunden liefert | mittel | hoch | Landing-above-fold muss in einem Satz sagen was OpenSIN ist + "Try it" Button. OSS-1 Definition of Done strenger. |

### Rollback

Wenn nach Launch etwas kritisch rot wird:

- **HF-Outage:** Auto-Monitor postet in `#launch-alerts`, erste Response-Maintainer macht manuellen Restart. SLA: 15 Min.
- **Stripe-Ausfall:** `my.opensin.ai` zeigt Banner "Checkout temporarily unavailable", OSS-Teil bleibt live.
- **chat.opensin.ai 500er-Storm:** Vercel-Rollback auf letzte grüne Production-Deployment via CLI. SLA: 2 Min.
- **Komplett-Ausfall:** DNS auf Maintenance-Page (statische HTML in `website-opensin.ai/public/maintenance.html`). Twitter-Post. SLA: 10 Min.

Rollback-Entscheidung trifft CTO. Wenn CTO unavailable: Alphabetisch erster verfügbarer Maintainer.

---

## 4. Post-Launch (Wave 5, T+1 bis T+14)

Diese Items sind Launch-Nice-to-have, dürfen während Tag 1–4 **nicht** bearbeitet werden (Fokus).

- R1 — `opensin-ai-cli` entscheiden und ausführen
- R2 — `opensin-ai-platform` entscheiden und ausführen
- R3 — `opensin_agent_platform/` diff abarbeiten
- L2 — archived-repo reference sweep
- C1/C2 — in Wave 4 gefixt (siehe Commit zu dieser Datei)
- CP1 — Core-SIN-Control-Plane → OpenSIN-backend merge ausführen
- S2 — 6 `A2A-SIN-Code-*` scaffolds (Team-SIN-Code-Core entscheidet)

Tracking: [docs/FOLLOWUPS.md](./docs/FOLLOWUPS.md)

---

## 5. Single Ownership Rule

Dieses Dokument hat **einen** Eigentümer pro Tier:

- **OSS Tier:** `OpenSIN` maintainer lead
- **Pro Tier:** `OpenSIN-WebApp` maintainer lead
- **Marketplace Tier:** `website-my.opensin.ai` maintainer lead
- **Meta/Governance:** `OpenSIN-overview` maintainer lead

Jeder schreibt sich selbst in `Git Blame`. Wenn niemand schreibt, wird nicht gelauncht.
