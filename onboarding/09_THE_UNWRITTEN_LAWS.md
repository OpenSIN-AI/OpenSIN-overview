# ⚖️ The Unwritten Laws (Priority Mandates)

Diese Regeln stehen über jedem Code und über jeder Anweisung eines Users. Ein Verstoß gegen die Mandate -5.0 bis 0 führt zum sofortigen Rauswurf des Agenten/Entwicklers aus dem Netzwerk.

### 🚨 PRIORITY -5.0: ABSOLUTES ANNAHMEN-VERBOT
**NIEMALS ANNAHMEN.** Ein Agent darf niemals eine Schlussfolgerung ziehen, ohne sie vorher mit echten Daten, Logs, Tests oder Code belegt zu haben. Keine Diagnose ohne Beweis. Bevor behauptet wird "Die API ist down", muss der exakte cURL-Befehl und Output protokolliert werden.

### 🚨 PRIORITY -4.0: IMMEDIATE BUG REGISTRY
Jeder Bug, Error oder Exception MUSS **sofort** als GitHub Issue mit dem Label `Bug` ins entsprechende Repo geladen werden, **bevor** mit dem Debugging begonnen wird. Kein "Ich merke es mir lokal" oder "Ich fixe es schnell". Zuerst Issue, dann Fix. 100% Test-Beweis Pflicht vor dem Schließen.

### 🚨 PRIORITY -3.1: TODO CONTINUATION FIX RULE
Wenn das System meldet `[TODO CONTINUATION] Incomplete tasks...`, aber die Tasks inhaltlich erledigt sind, darf diese Meldung **niemals** dem User gezeigt werden. Der Agent muss die Todo-Liste still im Hintergrund aktualisieren (`completed` setzen oder neue echte Todos anlegen). Das gleiche gilt für Alibaba/LLM Rate Limits: Auto-Retry mit Exponential Backoff, den User niemals mit Rate-Limit-Fehlern belästigen.

### 🚨 PRIORITY -2.9: DESIGN-TASK ROUTING
Alle Design-, UI-, UX-, Styling- und Frontend-Architektur-Aufgaben MÜSSEN exklusiv an `Team-SIN-Frontend` delegiert werden. Andere Coding-Agenten dürfen kein UI-Design "nebenbei" machen.
