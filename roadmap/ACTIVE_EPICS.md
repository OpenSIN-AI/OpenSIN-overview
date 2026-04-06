# 🗺️ Global Roadmap & Active Epics

Dies ist der aktuelle Schlachtplan der OpenSIN-AI Organisation, extrahiert aus den globalen GitHub Issues.

## 🚀 EPIC 1: The Great Realignment (Ongoing)
- **Ziel:** Umstellung der gesamten Organisation auf die Hub & Spoke Architektur (`Team-SIN-*` -> `A2A-SIN-*`).
- **Status:** Namenskonventionen erzwungen, 7 Teams instanziiert. Nächster Schritt: Die leeren `Template`-Hüllen der 28 Forge-Agenten mit echter LangGraph State-Machine-Logik füllen.

## 🚀 EPIC 2: OpenSIN-Code Migration (Phase 4 & 5)
- **Ziel:** Portierung der Legacy-Python Engine auf das neue TypeScript `@opensin/sdk`.
- **Status:** 690+ Tests passing. Parallel Tool Execution, Smart Model Routing und Memory Manager sind fertig.
- **Blocker:** VSCode Extension, HTTP Server (Express/Fastify) und JetBrains Plugin fehlen noch (Issue #1063).

## 🚀 EPIC 3: Dashboard Enterprise (Vercel)
- **Ziel:** Die `dashboard-enterprise` WebApp nativ auf das A2A Hub & Spoke Modell umbauen.
- **Status:** API-Routen und React-Akkordeons für Teams vs. Worker sind implementiert. Fehlerhafte `@radix-ui` Dependencies wurden gefixt.
- **Nächster Schritt:** Live-Deployment auf `chat.opensin.ai` über Vercel (NICHT Cloudflare!).

## 🚀 EPIC 4: The Legacy Purge
- **Ziel:** Auflösung des `OpenSIN-backend` Monolithen.
- **Status:** Die `OpenSIN-Apple-*` und `OpenSIN-Security-*` Repos wurden bereits in `A2A-SIN-*` umbenannt. Die internen `services/` und `room-*/` müssen noch extrahiert werden.
