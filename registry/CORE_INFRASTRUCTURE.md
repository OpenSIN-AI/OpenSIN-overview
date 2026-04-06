# 🏗️ Core Infrastructure Registry

Neben den autonomen `A2A-SIN-*` Workern und `Team-SIN-*` Managern besitzt OpenSIN-AI fundamentale Repositories, die das Framework und die Plattform selbst bilden. Diese Repositories sind von der strikten `[Type]-SIN-[Name]` Regel für Agenten ausgenommen, da sie die **Engine** sind.

| Repository | Zweck | Status |
|------------|-------|--------|
| `OpenSIN-Code` | Die absolute Kern-Engine. Enthält das TypeScript SDK (`@opensin/sdk`), die CLI (`opensin-cli`), das Agent SDK und die Tool-Registries. **Dies ist das Gehirn der Ausführung.** | Active (Core) |
| `OpenSIN-backend` | Der historische Monolith. Enthält die `dashboard-enterprise` WebApp (Vercel) und dutzende Legacy-Services (`authd`, `mcp-gateway`, `provider-*`), die schrittweise in A2A-Teams migriert werden. | Active (Migration pending) |
| `OpenSIN-documentation` | Das offizielle VitePress Doku-Portal (docs.opensin.ai). | Active |
| `OpenSIN` | Das ursprüngliche Python-Fundament der Organisation. | Legacy |
