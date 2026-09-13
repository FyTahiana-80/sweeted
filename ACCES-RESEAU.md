# Sweeted — Accéder à l'app depuis d'autres ordinateurs (via ce PC)

Ce PC fait office de **serveur** : le backend (`:3000`) et le frontend Expo (`:8081`)
écoutent déjà sur toutes les interfaces (`0.0.0.0`). Il suffit que les autres
ordinateurs soient sur le **même WiFi** et ouvrent la bonne URL.

> L'URL exacte dépend de l'IP locale de ce PC (voir étape 1).
> Dernière IP connue : `192.168.88.57` → URL : `http://192.168.88.57:8081`

## Prérequis

- Ce PC + les autres ordis connectés au **même réseau WiFi**.
- Backend démarré : `cd sweeted-backend && npm start` (port `3000`).
- Frontend démarré : `cd sweeted-frontend && npx expo start --web` (port `8081`).
- Aucune config à changer : le frontend détecte automatiquement le nom d'hôte
  de la page (`window.location.hostname`) pour joindre l'API sur le port `3000`.

## Étapes

1. **Trouver l'IP locale de ce PC** (PowerShell) :
   ```
   ipconfig
   ```
   Relever la ligne `Adresse IPv4` de la carte **Wi-Fi** (ex : `192.168.88.57`).
   Ignorer `192.168.56.1` (VirtualBox) et le Bluetooth.

2. **Vérifier que les serveurs écoutent** (PowerShell) :
   ```
   netstat -ano | Select-String ":3000|:8081" | Select-String "LISTENING"
   ```
   On doit voir `0.0.0.0:3000` et `0.0.0.0:8081`.

3. **Sur les autres ordinateurs**, ouvrir dans le navigateur :
   ```
   http://<IP-DU-PC>:8081
   ```
   Exemple : `http://192.168.88.57:8081`

4. **Si la page ne charge pas**, ouvrir le pare-feu (PowerShell **en admin**) :
   ```
   New-NetFirewallRule -DisplayName "Sweeted backend" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow
   New-NetFirewallRule -DisplayName "Sweeted expo" -Direction Inbound -Protocol TCP -LocalPort 8081 -Action Allow
   ```

5. **Téléphone (Expo Go)** : inchangé — scanner le QR code, même WiFi requis.

## Problèmes possibles et solutions

| # | Symptôme | Cause probable | Solution |
|---|----------|----------------|----------|
| 1 | `http://<IP>:8081` ne charge pas / délai dépassé | Pare-feu Windows bloque le port `8081` | Étape 4 ci-dessus (règle inbound TCP `8081`) |
| 2 | La page charge mais « Impossible de joindre le serveur » | Backend éteint, ou pare-feu bloque le port `3000` | Démarrer `npm start` dans `sweeted-backend` ; ajouter la règle `3000` (étape 4) |
| 3 | Ça marchait hier, plus aujourd'hui | L'IP locale a changé (DHCP du routeur) | Refaire `ipconfig` et utiliser la nouvelle IPv4 |
| 4 | Les autres ordis ne voient pas ce PC du tout (ni ping) | WiFi d'entreprise/hôtel avec **isolation des clients**, ou pas le même réseau (ex : l'un en 4G, l'autre en WiFi) | Passer tous les appareils sur le même réseau simple (box maison, partage de connexion du téléphone) ; alternative : `npx expo start --web --tunnel` (expose via une URL publique, plus lent) |
| 5 | Erreur `Port 8081 déjà utilisé` au démarrage d'Expo | Une ancienne instance tourne encore | `Get-Process node` puis `Stop-Process -Id <id>`, ou `npx expo start --web --port 8082` (et ouvrir `http://<IP>:8082`) |
| 6 | L'app rame sur les autres ordis | Mode dev Expo (non optimisé) + WiFi faible | Rester près du routeur ; pour une démo : `npx expo export --platform web` puis servir `dist/` avec `npx serve dist` (build optimisé) |
| 7 | Antivirus tiers bloque quand même | Pare-feu de l'antivirus (Avast, Kaspersky…) en plus de Windows | Autoriser `node.exe` / ports `3000` et `8081` dans l'antivirus |
| 8 | Le PC serveur se met en veille pendant la démo | Mise en veille coupe les serveurs | Désactiver la mise en veille : Paramètres → Système → Alimentation (mettre « Jamais » sur secteur le temps de la présentation) |
| 9 | Connexion refusée uniquement sur un vieil ordi | Navigateur obsolète | Utiliser Chrome / Edge récent |
| 10 | La base de données est-elle accessible depuis les autres ordis ? | Non, et ce n'est pas nécessaire : seul le backend parle à Aiven (cloud). Les autres ordis ne parlent qu'au backend (`:3000`). | Rien à faire |

## Rappel présentation (sécurité)

Le compte de démo admin (`0-00000/00` / `admin`) existe en base : ne pas le
projeter à l'écran avec le mot de passe visible, et le supprimer/renommer si
le projet est un jour déployé publiquement.
