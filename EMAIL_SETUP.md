# Email Setup Guide voor KavelArchitect

## 📧 Email Notificaties Configureren

De KavelAlert functionaliteit verstuurt nu automatisch emails naar zowel klanten als beheerders wanneer iemand zich aanmeldt.

### ✅ Wat er nu gebeurt bij een aanmelding:

1. **Klant ontvangt**: Professionele welkom email met hun zoekprofiel
2. **Beheerder ontvangt**: Notificatie email op `info@kavelarchitect.nl` met klantgegevens
3. **Database**: Klantgegevens worden opgeslagen in Supabase

---

## 🔧 Resend API Configureren

### Stap 1: Account aanmaken
1. Ga naar [https://resend.com](https://resend.com)
2. Maak een gratis account aan
3. Verifieer je email

### Stap 2: Domein configureren
1. Ga naar Dashboard → Domains
2. Voeg `kavelarchitect.nl` toe
3. Voeg de volgende DNS records toe bij je domain provider:
   ```
   Type: TXT
   Name: @
   Value: [Resend geeft je deze waarde]
   
   Type: CNAME  
   Name: em8523
   Value: [Resend geeft je deze waarde]
   ```

### Stap 3: API Key genereren
1. Ga naar Dashboard → API Keys
2. Klik op "Create API Key"
3. Naam: "KavelArchitect Production"
4. Permission: "Full Access" of "Send emails only"
5. Kopieer de API key (begint met `re_...`)

### Stap 4: Environment variable toevoegen

Voeg toe aan je `.env.local` of `.env` file:

```env
RESEND_API_KEY=re_jouw_api_key_hier
```

**Let op**: Herstart de development server na het toevoegen van de API key:
```bash
# Stop de huidige servers (CTRL+C)
# Start opnieuw
.\start-complete-system.bat
```

---

## 📨 Email Templates

### Voor Klanten:
- ✅ Professionele HTML email met gradient header
- ✅ Overzicht van hun zoekprofiel
- ✅ CTA button naar het aanbod
- ✅ Uitschrijf link
- ✅ Spam-preventie tip

### Voor Beheerder (`info@kavelarchitect.nl`):
- ✅ Badge: NIEUW of UPDATE
- ✅ Volledige klantgegevens
- ✅ Zoekprofiel details
- ✅ Bron tracking (bijv: `sold_listing_inline`)
- ✅ Reply-to adres = klant email

---

## 🧪 Test de Email Functionaliteit

### Zonder API Key (Development):
```
⚠️ Resend API not configured - no emails sent
```
- Klant wordt WEL opgeslagen in database
- Success message wordt getoond
- Geen emails verstuurd

### Met API Key (Production):
```
✅ Emails sent successfully for test@example.com (new)
```
- Klant opgeslagen in database
- Bevestiging email naar klant
- Notificatie email naar beheerder

---

## 🎯 Email Adressen

### Van-adressen:
- `noreply@kavelarchitect.nl` - Klant emails
- `notifications@kavelarchitect.nl` - Admin notificaties

### Naar-adressen:
- Klant email (van formulier)
- `info@kavelarchitect.nl` (beheerder)

---

## 💡 Business Email Setup (Optioneel)

Als je custom email adressen wilt zoals `info@kavelarchitect.nl`:

### Met Google Workspace (€5/maand):
1. Koop Google Workspace subscription
2. Verifieer domein ownership
3. Configureer MX records

### Met Microsoft 365 (€4/maand):
1. Koop Microsoft 365 Business Basic
2. Voeg domein toe
3. Configureer email routing

### Gratis Alternatief:
Gebruik voorlopig email forwarding:
- `info@kavelarchitect.nl` → je persoonlijke gmail
- Resend emails komen wel aan
- Antwoorden gaan naar je gmail

---

## 📊 Email Analytics

Resend Dashboard toont automatisch:
- ✅ Aantal verzonden emails
- ✅ Delivery rate
- ✅ Bounces
- ✅ Open rate (indien tracking aan staat)

---

## 🐛 Troubleshooting

### "Resend API not configured"
```bash
# Check of .env.local bestaat
ls .env.local

# Check of RESEND_API_KEY erin staat
cat .env.local | grep RESEND

# Herstart de server
```

### Emails komen niet aan
1. Check Resend Dashboard → Logs
2. Bekijk delivery status
3. Check spam folder
4. Verifieer domein setup (DNS records)

### Admin email komt niet aan
1. Check dat `info@kavelarchitect.nl` bestaat
2. Update in `route.ts` naar een werkend adres:
   ```typescript
   to: 'jouw-email@gmail.com'
   ```

---

## 🚀 Quick Start

**Minimale setup voor development/testing:**

1. **API Key toevoegen:**
   ```env
   RESEND_API_KEY=re_your_key
   ```

2. **Servers herstarten:**
   ```bash
   .\start-complete-system.bat
   ```

3. **Test aanmelding:**
   - Ga naar http://localhost:3000
   - Klik "Activeer KavelAlert"
   - Vul formulier in met jouw test email
   - Check console logs voor:
     ```
     ✅ Emails sent successfully for test@example.com (new)
     ```

4. **Check je inbox!** 🎉

---

## 📝 Notities

- Gratis tier van Resend: **100 emails/dag** (meer dan genoeg voor start)
- Emails zijn volledig gebranded voor KavelArchitect
- Mobile-responsive  HTML templates
- Ready voor productie!

