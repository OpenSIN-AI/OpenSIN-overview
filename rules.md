# OpenSIN-overview Rules

Dieses Repository ist die **lesbare SSOT-Oberfläche** für die OpenSIN-AI Organisation.

## Kernregeln

1. **Keine Geheimnisse im Klartext**
   - Niemals API-Keys, Tokens oder Credentials in Markdown, JSON oder Beispielcode committen.
   - Secrets werden ausschließlich über GitHub Secrets, OCI-Umgebungsvariablen oder dedizierte Secret-Stores referenziert.

2. **Repo-Zahlen immer mit Live-Daten verifizieren**
   - Repository-, Visibility- und Archive-Zahlen müssen vor jeder SSOT-Aktualisierung gegen die Live-Organisation geprüft werden.
   - Kanonischer Prüf-Befehl:
     ```bash
     gh api orgs/OpenSIN-AI/repos --paginate
     ```

3. **`registry/MASTER_INDEX.md` ist das vollständige Inventar**
   - Jedes bekannte Repo muss dort auftauchen.
   - Neu entdeckte oder noch nicht sauber einsortierte Repos dürfen temporär unter „Pending Classification“ geführt werden, bis die endgültige Kategorie feststeht.

4. **README bleibt kompakt, MASTER_INDEX bleibt vollständig**
   - `README.md` enthält die verdichtete Management-/Operator-Sicht.
   - `registry/MASTER_INDEX.md` enthält die exhaustive Inventar-Sicht.

5. **Lokale Links müssen existieren**
   - Jeder relative Link in `README.md` muss auf der Default-Branch tatsächlich vorhanden sein.
   - Insbesondere gelten `rules.md` und `registry/MASTER_INDEX.md` als Pflichtartefakte.

## Pflicht-Checks vor Merge

- Keine plaintext secrets mehr im Diff
- README-Banner stimmt mit Live-Org-Zahlen überein
- `registry/MASTER_INDEX.md` enthält alle bekannten Repos
- Relative Links im README funktionieren

## Referenzen

- [MASTER_INDEX](./registry/MASTER_INDEX.md)
- [AGENTS](./AGENTS.md)
- [WORKFORCE](./WORKFORCE.md)
