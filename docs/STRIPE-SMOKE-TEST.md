# Stripe End-to-End Smoke Test

> **Stand:** 2026-04-19. **Rolle:** Governance-Doc. Dieses Repo schreibt den Test-Flow, aber führt ihn nicht aus. Ausgeführt wird er in `website-my.opensin.ai`, `OpenSIN-WebApp` und `OpenSIN-backend` (jeder Teil gegen den eigenen Abschnitt hier).
> **Ziel:** Ein Zahlungs-Ausfall darf uns **nicht** nach dem Launch überraschen. Dieser Test muss Tag 3 der [LAUNCH-CHECKLIST](../LAUNCH-CHECKLIST.md) grün sein, sonst verschiebt sich der Launch.
> **Testmodus:** Stripe **Test-Mode** mit Karte `4242 4242 4242 4242`, CVC `123`, beliebiges zukünftiges MM/YY, beliebige ZIP.

## Voraussetzungen

Bevor Tag 3 des Launch-Plans startet, müssen folgende ENV-Variablen in **allen** Produkt-Repos gesetzt sein (Vercel ENV, `Preview` + `Production`):

| Variable                                           |     `website-my.opensin.ai`     |        `OpenSIN-WebApp`         | `OpenSIN-backend` |
| -------------------------------------------------- | :-----------------------------: | :-----------------------------: | :---------------: |
| `STRIPE_SECRET_KEY` (`sk_test_*`)                  |               ✅                |               ✅                |        ✅         |
| `STRIPE_PUBLISHABLE_KEY` (`pk_test_*`)             |               ✅                |               ✅                |         —         |
| `STRIPE_WEBHOOK_SECRET` (`whsec_*`)                | ✅ (für `/api/webhooks/stripe`) | ✅ (für `/api/webhooks/stripe`) |         —         |
| `NEXT_PUBLIC_CHAT_URL` = `https://chat.opensin.ai` |               ✅                |               ✅                |         —         |
| `NEXT_PUBLIC_MY_URL` = `https://my.opensin.ai`     |               ✅                |               ✅                |         —         |
| `SUPABASE_SERVICE_ROLE_KEY`                        |                —                |               ✅                |         —         |
| `SUPABASE_URL` + `SUPABASE_ANON_KEY`               |                —                |               ✅                |         —         |

**Stripe Dashboard Setup (einmalig):**

1. Produkte in Stripe Test-Mode anlegen:
   - `opensin-starter` — €29 / Monat recurring
   - `opensin-pro` — €99 / Monat recurring
   - 17 Marketplace-Add-ons aus [`templates/teams/*.json`](../templates/teams) mit jeweils `pricing.monthly_addon_eur` → als separate Subscription-Products (`metadata: { team_id }`).
2. Webhook-Endpoints:
   - `https://my.opensin.ai/api/webhooks/stripe` — Events: `checkout.session.completed`, `customer.subscription.created`
   - `https://chat.opensin.ai/api/webhooks/stripe` — Events: `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
3. Customer Portal-Config: "Customers can cancel subscription" + "Customers can update payment method" aktivieren.

---

## §1 — Tier-2 Checkout (my.opensin.ai → chat.opensin.ai Onboarding)

**Story:** Neuer User kauft €29 Starter, landet authentifiziert im Dashboard.

### Schritte

1. **Inkognito-Fenster.** `https://my.opensin.ai/`
2. Klick **"Get Starter"** auf der Pricing-Section. Erwartet: Redirect auf `https://checkout.stripe.com/c/pay/cs_test_*`.
3. Stripe-Checkout:
   - Email: `smoke+t1@opensin.ai` (neu, noch nicht in Supabase)
   - Karte: `4242 4242 4242 4242 / 12/34 / 123`
   - Submit
4. Erwartet: Redirect auf `https://chat.opensin.ai/welcome?session_id=cs_test_*`.
5. `OpenSIN-WebApp` liest `session_id`, ruft `stripe.checkout.sessions.retrieve`, nimmt `customer.email`, legt (falls nötig) Supabase-User an, setzt `users.subscription_tier = 'starter'`, `users.stripe_customer_id = cus_*`, schickt Magic-Link-Email an `smoke+t1@opensin.ai`.
6. User klickt Magic-Link → `https://chat.opensin.ai/dashboard`.

### Definition of Done §1

- [ ] `users` Row in Supabase existiert mit `subscription_tier = 'starter'` und `stripe_customer_id != null`.
- [ ] `/dashboard` rendert den Pro-Badge in der Sidebar.
- [ ] `/dashboard/billing` zeigt "Starter · €29/mo · aktiv".
- [ ] In Stripe Dashboard → Customers der Eintrag ist da, mit 1 aktiven Subscription.
- [ ] Kein 500er-Error in Vercel Logs von `OpenSIN-WebApp` oder `website-my.opensin.ai`.

---

## §2 — Webhook-Verlässlichkeit

**Story:** Das Webhook darf nicht stumm fehlschlagen. Wenn Stripe den Hook nicht erfolgreich zustellt, ist der User gezahlt aber nicht eingeloggt — katastrophaler Support-Fall.

### Schritte

1. Stripe Dashboard → Developers → Webhooks → `https://chat.opensin.ai/api/webhooks/stripe` → "Recent events" öffnen.
2. Event aus §1 (`checkout.session.completed`) finden.
3. Status muss `200` sein. Delivery-Log-Dauer < 5 s.
4. Manuell "Resend" auf demselben Event. Erwartet: idempotent — `users`-Row ändert sich nicht, keine Dupes.

### Definition of Done §2

- [ ] Alle Webhooks aus §1 mit Status 200 zugestellt.
- [ ] Resend produziert keine Dupes in `users` oder `subscriptions` Tables.
- [ ] Vercel Logs zeigen `stripe-signature` Validierung erfolgreich (keine `Invalid signature` Errors).

---

## §3 — Customer Portal (chat.opensin.ai)

**Story:** Zahlender User cancelt + upgraded. Alles geht durchs Stripe Customer Portal, nicht durch custom UI.

### Schritte

1. Als User aus §1 eingeloggt. `/settings/billing` öffnen.
2. Klick **"Manage billing"** → redirectet auf `https://billing.stripe.com/p/session/*`.
3. Im Portal: **Upgrade** auf `opensin-pro` (€99). Submit.
4. Redirect zurück auf `https://chat.opensin.ai/settings/billing`.
5. Webhook `customer.subscription.updated` kommt an `/api/webhooks/stripe`.
6. `users.subscription_tier` = `'pro'` in Supabase.
7. `/dashboard` zeigt jetzt "Pro"-Badge + neue Agent-Limits.
8. Im Portal: **Cancel subscription**. Immediate + at-period-end beide testen.

### Definition of Done §3

- [ ] Upgrade funktioniert, Tier ändert sich in Supabase binnen 5 s.
- [ ] Downgrade / Cancel funktioniert, `users.subscription_tier` = `'cancelled'` oder `'starter_downgraded_at: ...'`.
- [ ] Im Dashboard-UI werden Features, die das Tier nicht erlaubt, ausgegraut (nicht 500).

---

## §4 — Marketplace Add-on Checkout

**Story:** Pro-User (aus §3) kauft `Team-SIN-Commerce` als Add-on für €19/mo. Die 5 Commerce-Agents erscheinen in seiner Fleet-Ansicht.

### Schritte

1. Als Pro-User eingeloggt. `https://my.opensin.ai/marketplace` öffnen.
2. Erwartet: 17 Team-Cards aus `oh-my-sin.json`. Jede Card zeigt Name, Tagline, Agent-Count, Preis aus [`templates/teams/*.json`](../templates/teams).
3. Klick **"Add Team-SIN-Commerce"** auf der Card → Stripe-Checkout für Add-on-Subscription.
4. Submit mit Testkarte.
5. Redirect auf `https://chat.opensin.ai/marketplace/success?session_id=...`.
6. Webhook `customer.subscription.created` kommt an, Backend liest `metadata.team_id = 'Team-SIN-Commerce'`, insertet Row in `user_teams(user_id, team_id, stripe_subscription_id, status='active')`.
7. `chat.opensin.ai/dashboard` zeigt unter "My Teams" den Eintrag **Commerce** + 5 Agents: `A2A-SIN-Stripe`, `A2A-SIN-TikTok-Shop`, `A2A-SIN-Medusa`, `A2A-SIN-Shop-Finance`, `A2A-SIN-Shop-Logistic`.

### Definition of Done §4

- [ ] `user_teams` Row existiert mit `team_id='Team-SIN-Commerce'` und `status='active'`.
- [ ] Agent-Liste auf `/dashboard` hat 5 neue Einträge.
- [ ] Dispatch eines Echo-Tasks aus `/dashboard/agents/A2A-SIN-Stripe` an `OpenSIN-backend` landet bei einem lebenden Worker (nicht 503).
- [ ] Entfernen (Cancel) des Add-ons lässt den Eintrag verschwinden, `status='cancelled'` in `user_teams`.

---

## §5 — End State (Invariant nach komplettem Durchlauf)

Nach §1–§4 muss ein einziger User-Record folgenden End-Zustand haben:

```yaml
user:
  email: smoke+t1@opensin.ai
  subscription_tier: cancelled # nach §3 Cancel
  stripe_customer_id: cus_test_xxx
user_teams:
  - team_id: Team-SIN-Commerce
    status: cancelled # nach §4 Cancel
stripe_customer:
  has_payment_method: true
  active_subscriptions: 0
  past_subscriptions: 2 # starter→pro upgrade + team-commerce
```

### Definition of Done §5

- [ ] Alle Daten in Supabase sind konsistent mit Stripe (keine verwaisten Stripe-Subscriptions ohne DB-Row).
- [ ] `scripts/stripe-reconcile.js` (wenn es existiert) liefert 0 Diffs — optional, aber empfohlen.

---

## §6 — Failure-Modi explizit testen

Nicht nur Happy-Path. Diese Fälle müssen nicht "grün" sein, aber **kontrolliert fehlschlagen** (Error-Toast, kein 500, kein inkonsistenter DB-State):

| Fall                                    | Karte                                            | Erwartetes Verhalten                                                                                               |
| --------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| Decline                                 | `4000 0000 0000 0002`                            | Stripe zeigt Fehler, kein Redirect, kein DB-Write                                                                  |
| Insufficient funds                      | `4000 0000 0000 9995`                            | wie oben                                                                                                           |
| Authentication required (3DS)           | `4000 0025 0000 3155`                            | 3DS-Modal öffnet sich, bei Cancel bleibt kein State                                                                |
| Invoice payment fails post-subscription | `4000 0000 0000 0341` (attaches, later declines) | Webhook `invoice.payment_failed` → DB setzt `subscription_status = 'past_due'`, User sieht Banner "Update payment" |

---

## §7 — Test-Fixtures & Reset-Prozedur

Nach jedem kompletten Durchlauf:

1. **Stripe:** Customer löschen (Test-Mode: Customer → `...` → Delete). Test-Subscriptions gehen mit.
2. **Supabase:** `delete from user_teams where user_id = (select id from users where email = 'smoke+t1@opensin.ai'); delete from users where email = 'smoke+t1@opensin.ai';`
3. **Vercel Logs:** Screenshot vom `checkout.session.completed`-Webhook-Log archivieren (als Evidence für G5/G6 im Launch-Gate).

Email-Pattern: Immer `smoke+<section>@opensin.ai` nutzen (`+t1`, `+t2`, `+t3`, `+t4` für Parallel-Tests).

---

## §8 — Wer macht was

| Abschnitt                           | Owner                                                              |
| ----------------------------------- | ------------------------------------------------------------------ |
| §1, §2, §3                          | `OpenSIN-WebApp` maintainer                                        |
| §4 Frontend                         | `website-my.opensin.ai` maintainer                                 |
| §4 Backend (Webhook + `user_teams`) | `OpenSIN-WebApp` maintainer                                        |
| §6 Failure-Modi                     | `OpenSIN-WebApp` maintainer (ein Pair mit `website-my.opensin.ai`) |

Ergebnis jedes Durchlaufs landet als Kommentar im Tracking-Issue **`OpenSIN-WebApp#stripe-smoke`** (anlegen wenn nicht vorhanden) mit Screenshots, Supabase-Diff, Vercel-Log-Link. Keine mündlichen "funktioniert bei mir"-Aussagen.
