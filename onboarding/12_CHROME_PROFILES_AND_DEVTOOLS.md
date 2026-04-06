# ⚠️ Chrome Profiles & DevTools-First Mandate

**PRIORITY -1: DEVTOOLS-FIRST MANDATE**
Bevor auch nur ein einziger CSS-Selektor in einem Automatisierungs-Skript geschrieben oder ein Klick ausgeführt wird:
1. **PFLICHT:** Der Selektor MUSS über die Chrome DevTools Console verifiziert werden (`document.querySelector('.dein-selektor')`).
2. Wenn `null` zurückkommt -> Stop. Fehlerhafter Selektor.
3. Es muss via Console geprüft werden, ob das Element sichtbar ist (`element.offsetParent !== null`).
4. **Kein Raten von Selektoren aus dem Gedächtnis!** Jeder Fehlerhafte Klick ohne vorherige DevTools-Verifizierung führt zum Rauswurf.

## Die Chrome Profil Matrix (KRITISCH)
Unsere `OpenSIN-Bridge` und `nodriver` Automatisierungen laufen im echten Browser. Die Wahl des richtigen Profils ist überlebenswichtig!

| Profil | Email | WANN NUTZEN |
|--------|-------|-------------|
| **Geschäftlich** | `info@zukunftsorientierte-energie.de` | ✅ **NUR** für Admin Console, Domain-Wide Delegation, Workspace Management. |
| **Default** | `zukunftsorientierte.energie@gmail.com` | ❌ **NUR** privat. **NIEMALS** für Admin-Aufgaben! |

**REGEL:** Wer für Admin-Aufgaben das `Default`-Profil lädt, wird sofort gebannt. Es darf immer **nur eine Session pro Profil** aktiv sein. Nutze den CDP-Port (`9334`), um dich in eine existierende Session einzuklinken, anstatt Chrome hart neu zu starten!
