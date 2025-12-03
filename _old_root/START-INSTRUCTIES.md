# Brikx Dashboard - Start Instructies

## Snelkoppelingen

Er zijn 3 batch scripts gemaakt om de applicatie makkelijk te starten zonder VS Code:

### 1. **start-all.bat** (AANBEVOLEN)
Start beide services tegelijk in aparte vensters.

**Gebruik:**
- Dubbelklik op `start-all.bat`
- Wacht tot beide vensters geopend zijn
- Backend: http://localhost:8765
- Dashboard: http://localhost:3001

### 2. **start-backend.bat**
Start alleen de backend server (Node.js Express).

**Gebruik:**
- Dubbelklik op `start-backend.bat`
- Server draait op http://localhost:8765

### 3. **start-dashboard.bat**
Start alleen het dashboard (Vite frontend).

**Gebruik:**
- Dubbelklik op `start-dashboard.bat`
- Dashboard opent op http://localhost:3001

## Snelkoppeling op Bureaublad maken

### Windows 11/10:

1. **Rechtermuisklik** op `start-all.bat`
2. Klik op **"Verzenden naar"** → **"Bureaublad (snelkoppeling maken)"**
3. Hernoem de snelkoppeling naar "Brikx Dashboard"

### Icoon wijzigen (optioneel):

1. Rechtermuisklik op de snelkoppeling → **"Eigenschappen"**
2. Klik op **"Pictogram wijzigen"**
3. Kies een icoon (bijvoorbeeld: `%SystemRoot%\System32\imageres.dll` bevat veel iconen)

## Taken plannen (Automatisch starten)

Je kunt de Taakplanner gebruiken om Brikx automatisch te starten bij Windows opstarten:

1. Open **Taakplanner** (Task Scheduler)
2. Klik op **"Eenvoudige taak maken"**
3. Naam: "Brikx Dashboard Auto Start"
4. Trigger: "Bij aanmelden"
5. Actie: "Programma starten"
6. Programma: `E:\Funda Wordpress\_old_root\start-all.bat`
7. Klik op **"Voltooien"**

## Services stoppen

Om de services te stoppen:
- Sluit de command prompt vensters (klik op X of druk Ctrl+C)
- Of gebruik Task Manager (Ctrl+Shift+Esc) en beëindig de `node.exe` processen

## Vereisten

- **Node.js** moet geïnstalleerd zijn (download: https://nodejs.org/)
- **Python** (voor backend sync/publish scripts)
- **.env bestand** met Supabase credentials

## Probleemoplossing

**"Node.js niet gevonden"**
- Installeer Node.js van https://nodejs.org/
- Herstart Windows na installatie

**"Poort 8765 al in gebruik"**
- Sluit andere Node.js processen via Task Manager
- Of wijzig PORT in .env bestand

**Dependencies ontbreken**
- Open command prompt in _old_root folder
- Run: `npm install`

**Python script errors**
- Controleer of Python geïnstalleerd is: `python --version`
- Installeer vereiste packages: `pip install -r requirements.txt`

## Support

Voor vragen of problemen, check de logs in de command prompt vensters.
