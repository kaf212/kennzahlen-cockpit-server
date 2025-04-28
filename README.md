# kennzahlen-cockpit
## Informationen für Entwickler
### Umgebungsvariablen
Die `.env`-Datei muss im root-directory des Projekts abgespeichert werden.
Folgende Variablen kommen darin vor:
- `SECRET_KEY`: Für JWT-Signierung
- `ADMIN_PASSWORD`: Passwort für die Admin-Rolle
- `STANDARD_PASSWORD`: Passwort für die Standard-Rolle
- `MAX_LOGIN_ATTEMPTS`: Die maximale Anzahl Login-Versuche pro IP-Adresse
- `LOGIN_LOCK_TIME_MINUTES`: Die Sperrzeit bei zu vielen Login-Versuchen
