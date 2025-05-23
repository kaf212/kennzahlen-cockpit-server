# kennzahlen-cockpit
## Informationen für Benutzer
### Abschlussberichts-Vorlage
Die XLSX-Vorlage für einen Abschlussbericht befindet sich im Root-Verzeichnis des Projekts.
## Informationen für Entwickler
### Produktionsumgebung
Um den Server in der Produktionsumgebung (auf dem Webserver) auszuführen, muss
die Branch ``origin/deployment`` verwendet werden.
### Lokale Umgebung
Um den Server Lokal auszuführen muss die Branch ``origin/main`` verwendet werden.
### Umgebungsvariablen
Die `.env`-Datei muss im root-directory des Projekts abgespeichert werden.
Folgende Variablen kommen darin vor:
- `SECRET_KEY`: Für JWT-Signierung
- `TOKEN_EXPIRATION`: Gültigkeitsdauer eines JWT
- `MONGO_URI`: URI der MongoDB-Datenbank
- `ADMIN_PASSWORD`: Passwort für die Admin-Rolle
- `STANDARD_PASSWORD`: Passwort für die Standard-Rolle
- `MAX_LOGIN_ATTEMPTS`: Die maximale Anzahl Login-Versuche pro IP-Adresse
- `LOGIN_LOCK_TIME_MINUTES`: Die Sperrzeit bei zu vielen Login-Versuchen
- `URL`: Die Base-URL, die für die API-Tests verwendet wird
- `LOCALHOST_IP`: Die IP-Adresse von Localhost, die für den Login-Limit-Bypass benötigt wird
### Testfälle
Mit ``npm run test`` können alle Testfälle auf einmal ausgeführt werden.
Mit ``npm run test:jest`` bzw. ``npm run test:pytest`` können selektiv die Jest- oder Pytest-Tests ausgeführt werden.
