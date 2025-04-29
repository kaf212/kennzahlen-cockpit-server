# kennzahlen-cockpit
## Informationen für Entwickler
### Umgebungsvariablen
Die `.env`-Datei muss im root-directory des Projekts abgespeichert werden.
Folgende Variablen kommen darin vor:
- `SECRET_KEY`: Für JWT-Signierung
- `MONGO_URI`: URI der MongoDB-Datenbank
- `ADMIN_PASSWORD`: Passwort für die Admin-Rolle
- `STANDARD_PASSWORD`: Passwort für die Standard-Rolle
- `MAX_LOGIN_ATTEMPTS`: Die maximale Anzahl Login-Versuche pro IP-Adresse
- `LOGIN_LOCK_TIME_MINUTES`: Die Sperrzeit bei zu vielen Login-Versuchen
### Testfälle
Mit ``npm run test`` können alle Testfälle auf einmal ausgeführt werden.
Mit ``npm run test:jest`` bzw. ``npm run test:pytest`` können selektiv die Jest- oder Pytest-Tests ausgeführt werden.
