# 🌐 Domain & Hosting Infrastructure

**WICHTIG:** OpenSIN-AI nutzt ein hybrides Edge- und Serverless-Deployment-Modell. Frontend-Assets und WebApps sind strikt nach ihren Laufzeit-Anforderungen auf verschiedene Provider (Cloudflare vs. Vercel) aufgeteilt.

Wer CI/CD Pipelines baut oder DNS-Records ändert, muss diese exakte Matrix respektieren:

## ⚡ Cloudflare (Static & Edge)
Cloudflare ist unser primäres Edge-Netzwerk für statische Seiten, Dokumentationen und leichte Portale.

| Domain / Subdomain | Provider | Projekt / Repo | Zweck |
|--------------------|----------|----------------|-------|
| `opensin.ai` | **Cloudflare** | `OpenSIN-website` | Die öffentliche Main Landing Page. |
| `my.opensin.ai` | **Cloudflare** | *Diverse Portale* | Secondary Portal / User Access. |
| `docs.opensin.ai` | **Cloudflare** | `OpenSIN-documentation` | Das offizielle VitePress Dokumentations-Portal. |

## ▲ Vercel (Dynamic WebApp / Serverless)
Vercel ist **exklusiv** für unsere hochkomplexe, dynamische Enterprise-Applikation reserviert, da Next.js Server Components, Edge Functions und API-Routen hier nativ und am effizientesten laufen.

| Domain / Subdomain | Provider | Projekt / Repo | Zweck |
|--------------------|----------|----------------|-------|
| `chat.opensin.ai` | **Vercel** | `OpenSIN-backend/dashboard-enterprise` | Die **OpenSIN WebApp** (Das zentrale Dashboard & Flotten-Management). |

**Regel für Deployment-Agenten (`A2A-SIN-Team-Frontend` / `A2A-SIN-Herakles`):**
Versuche NIEMALS, das `dashboard-enterprise` Next.js Projekt auf Cloudflare zu deployen! Die Vercel-Infrastruktur ist hierfür zwingend vorgeschrieben.
