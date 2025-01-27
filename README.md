# Arbeitszeiterfassung

Eine moderne Webanwendung zur Erfassung und Verwaltung von Arbeitszeiten.

## Funktionen

-   Erfassung von Start- und Endzeit
-   Automatische Berechnung der Gesamtarbeitszeit
-   Pausenzeiterfassung
-   Übersichtliche Darstellung der Arbeitszeiten
-   Persistente Speicherung in MongoDB
-   Echtzeit-Feierabendrechner

## Voraussetzungen

-   Node.js (v14 oder höher)
-   MongoDB (lokal installiert oder MongoDB Atlas)
-   npm oder yarn

## Installation

1. Repository klonen

```bash
git clone [repository-url]
cd arbeitszeiterfassung
```

2. Frontend-Abhängigkeiten installieren

```bash
npm install
```

3. Backend-Abhängigkeiten installieren

```bash
cd backend
npm install
```

4. MongoDB einrichten

-   Lokale MongoDB-Instanz starten oder
-   MongoDB Atlas Verbindungs-URL in `.env` konfigurieren

5. Umgebungsvariablen konfigurieren

```bash
# backend/.env
MONGODB_URI=mongodb://localhost:27017/arbeitszeiterfassung
PORT=5000
```

## Entwicklung starten

1. Backend starten

```bash
cd backend
npm run dev
```

2. Frontend starten (in einem neuen Terminal)

```bash
cd ..  # Zurück zum Hauptverzeichnis
npm start
```

Die Anwendung ist nun unter `http://localhost:3000` erreichbar.

## Technologien

-   Frontend:
    -   React
    -   Tailwind CSS
    -   Axios
-   Backend:
    -   Node.js
    -   Express
    -   MongoDB
    -   Mongoose

## Lizenz

MIT
