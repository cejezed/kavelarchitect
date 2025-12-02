# 🚀 Deployment Guide - KavelArchitect

## Overzicht
- **Frontend**: Vercel (Next.js)
- **Backend**: Railway (Node.js + Python)
- **Database**: Supabase (al online)
- **CMS**: WordPress (kavelarchitect.nl)

---

## 📦 STAP 1: GitHub Repository

### 1.1 Initialiseer Git (als nog niet gedaan)
```bash
cd "e:\Funda Wordpress"
git init
git add .
git commit -m "Initial commit - KavelArchitect platform"
```

### 1.2 Maak GitHub Repository
1. Ga naar https://github.com/new
2. Repository naam: `kavelarchitect`
3. Maak **Private** repository
4. **NIET** initialiseren met README (we hebben al code)

### 1.3 Push naar GitHub
```bash
git remote add origin https://github.com/JOUW-USERNAME/kavelarchitect.git
git branch -M main
git push -u origin main
```

---

## 🚂 STAP 2: Backend Deployment (Railway)

### 2.1 Railway Account
1. Ga naar https://railway.app
2. Sign up met GitHub account
3. Klik "New Project"

### 2.2 Deploy Backend
1. Selecteer "Deploy from GitHub repo"
2. Kies `kavelarchitect` repository
3. Railway detecteert automatisch Node.js

### 2.3 Environment Variables
Voeg toe in Railway dashboard → Variables:

```env
# Supabase
SUPABASE_URL=https://ymwwydpywichbotrqwsy.supabase.co
SUPABASE_KEY=jouw_supabase_key

# Perplexity
PERPLEXITY_API_KEY=jouw_perplexity_key

# WordPress
WP_ZWIJSEN_URL=https://kavelarchitect.nl
WP_ZWIJSEN_USER=jouw_wp_user
WP_ZWIJSEN_APP_PASSWORD=jouw_wp_app_password

# Google Maps
GOOGLE_MAPS_API_KEY=jouw_maps_key

# Gmail (optioneel - voor cron sync)
GMAIL_CREDENTIALS=base64_encoded_credentials_json
GMAIL_TOKEN=base64_encoded_token_json

# Port
PORT=8765
```

### 2.4 Cron Job Setup (optioneel)
Voor automatische sync elke 6 uur:
1. Railway → Settings → Cron
2. Voeg toe: `0 */6 * * *`
3. Command: `python backend/sync_worker.py`

### 2.5 Domain
Railway geeft automatisch een URL zoals: `kavelarchitect-backend.up.railway.app`

---

## ▲ STAP 3: Frontend Deployment (Vercel)

### 3.1 Vercel Account
1. Ga naar https://vercel.com
2. Sign up met GitHub account
3. Klik "Add New Project"

### 3.2 Import Project
1. Selecteer `kavelarchitect` repository
2. Framework Preset: **Next.js**
3. Root Directory: `nextjs_site`
4. Build Command: `npm run build`
5. Output Directory: `.next`

### 3.3 Environment Variables
Voeg toe in Vercel → Settings → Environment Variables:

```env
# Backend API
NEXT_PUBLIC_API_URL=https://kavelarchitect-backend.up.railway.app/api

# WordPress
NEXT_PUBLIC_WORDPRESS_API_URL=https://kavelarchitect.nl/wp-json/wp/v2
```

### 3.4 Domain Setup
1. Vercel → Settings → Domains
2. Voeg toe: `www.kavelarchitect.nl`
3. Volg DNS instructies (CNAME record)

---

## 🌐 STAP 4: DNS Configuratie

### Bij je domain provider (bijv. TransIP):

**Voor Frontend (Vercel):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Voor WordPress (blijft hetzelfde):**
```
Type: A
Name: @
Value: [je huidige WordPress hosting IP]
```

---

## ✅ Verificatie Checklist

Na deployment, test:

- [ ] Frontend bereikbaar op `www.kavelarchitect.nl`
- [ ] Backend API bereikbaar op Railway URL
- [ ] Aanbod pagina toont kavels uit Supabase
- [ ] Kennisbank toont WordPress artikelen
- [ ] Handmatig kavel toevoegen werkt
- [ ] WordPress posts worden correct opgehaald

---

## 🔄 Deployment Workflow (na setup)

### Lokale wijzigingen deployen:
```bash
git add .
git commit -m "Beschrijving van wijzigingen"
git push
```

- **Vercel**: Deploy automatisch binnen 1 minuut
- **Railway**: Deploy automatisch binnen 2-3 minuten

---

## 🔐 Security Checklist

- [ ] Alle secrets in `.env` (NIET in code)
- [ ] `.gitignore` bevat alle secret files
- [ ] GitHub repository is **Private**
- [ ] Railway environment variables zijn ingesteld
- [ ] Vercel environment variables zijn ingesteld
- [ ] WordPress Application Passwords gebruikt (geen wachtwoord)
- [ ] Supabase RLS policies zijn actief

---

## 🆘 Troubleshooting

### Frontend build fails
- Check `NEXT_PUBLIC_API_URL` in Vercel
- Verifieer dat `nextjs_site/package.json` correct is

### Backend crashes
- Check Railway logs: Dashboard → Deployments → View Logs
- Verifieer alle environment variables

### Database connectie fails
- Check `SUPABASE_URL` en `SUPABASE_KEY`
- Test Supabase connection in Railway logs

### WordPress artikelen laden niet
- Verifieer `NEXT_PUBLIC_WORDPRESS_API_URL`
- Check WordPress REST API: `kavelarchitect.nl/wp-json/wp/v2/posts`

---

## 📞 Support

Bij problemen:
1. Check Railway logs
2. Check Vercel deployment logs
3. Check browser console (F12)
4. Verifieer environment variables

---

**Geschatte deployment tijd**: 30-45 minuten
**Kosten**: 
- Railway: ~$5/maand (Hobby plan)
- Vercel: Gratis (Hobby plan)
- Supabase: Gratis (Free tier)
