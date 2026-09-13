# MIGRATION SWEETED vers un nouveau PC (copie sans node_modules)

Guide pour reinstaller et relancer le projet sur un autre ordinateur
Windows a partir d une copie brute du dossier Sweeted, SANS les node_modules.

---

## 0. Quoi copier (ancien PC -> cle USB -> nouveau PC)

COPIER tout le dossier Sweeted SAUF :

- sweeted-backend/node_modules/
- sweeted-frontend/node_modules/
- sweeted-frontend/.expo/ (cache, regenere tout seul)
- sweeted-backend/uploads/ (optionnel : photos de test, recree tout seul)
- les fichiers de logs : server-out.log, server-err.log, web-out.log,
  web-err.log, logs_depuis_expo, logs_depuis_le_terminal
- sweeted-frontend/web-build/ et dist/ si presents (builds regenerees)

NE PAS FAIRE TRANSITER PAR LE CLOUD : sweeted-backend/.env (mots de passe).
Copie-le a part (cle USB) ou recree-le (voir section 2).

A NE PAS COPIER TEL QUEL : sweeted-frontend/.env (contient l IP LAN de
l ANCIEN pc). Il faudra le recreer avec la nouvelle IP (voir section 3).

---

## 1. Prerequis (nouveau PC)

1. Node.js LTS 20 ou plus (teste en v24.11.1) depuis https://nodejs.org
   Verifier : node --version / npm --version
2. (Optionnel) Git.
3. Sur le telephone : application Expo Go (version recente, SDK 57),
   connecte au MEME WiFi que le nouveau PC.
4. Connexion internet (la base MySQL est distante, chez Aiven :
   aucun MySQL local a installer).

---

## 2. Backend (sweeted-backend)

Ouvrir un terminal :

    cd sweeted-backend
    npm install

(Les dependances incluent bcrypt (natif) : npm recompile pour la machine.
En general les binaires precompiles suffisent.)

Creer le fichier sweeted-backend/.env (modele : .env.example) :

    DB_HOST=sweeted-bd-fytahiana80-96f2.d.aivencloud.com
    DB_PORT=13635
    DB_USER=avnadmin
    DB_PASSWORD=<mot de passe recopie depuis l ancien PC>
    DB_NAME=sweeted
    JWT_SECRET=<32 octets hexa, voir ci-dessous>
    PORT=3000
    HOST=0.0.0.0

Generer un JWT_SECRET (dans n importe quel terminal) :

    node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

(NOTE : changer JWT_SECRET invalide les anciens tokens -> simple reconnexion.)

Lancer (terminal 1, A GARDER OUVERT) :

    cd sweeted-backend
    node src/app.js

Verif : ouvrir http://localhost:3000 -> affiche BACKEND Heheheee !
Le dossier uploads/ se cree tout seul au demarrage.

---

## 3. Frontend (sweeted-frontend)

Ouvrir un DEUXIEME terminal (le backend tourne dans le premier) :

    cd sweeted-frontend
    npm install

(C est long : ~800 Mo, React Native + Expo SDK 57. Laisser finir.)

Trouver l IP LAN du nouveau PC (le telephone s y connectera) :

    ipconfig

-> ligne "Adresse IPv4" de la carte Wi-Fi, ex : 192.168.1.10
(PAS 127.0.0.1, PAS 10.0.2.2 qui n existe que sur emulateur.)

Creer le fichier sweeted-frontend/.env (modele : .env.example) avec
CETTE IP (adapter le port si besoin, 3000 par defaut) :

    EXPO_PUBLIC_API_URL=http://192.168.1.10:3000/api

Lancer (terminal 2, A GARDER OUVERT) :

    cd sweeted-frontend
    npx expo start --web --port 8081

Verifs :

- PC web : ouvrir http://localhost:8081 (page de connexion en carte centree).
- Telephone : scanner le QR affiche dans le terminal avec Expo Go.

Alternative : a la racine Sweeted, `npm install` puis `npm run dev`
lance les deux d un coup (concurrently), mais les logs sont melanges :
deux terminaux separes restent conseilles.

---

## 4. Telephone (Expo Go)

1. Meme WiFi que le PC (verifier : pas de donnees mobiles / autre box).
2. Ouvrir Expo Go, scanner le QR du terminal frontend.
3. Si erreur reseau au login : recharger l app (secouer -> Reload, ou
   fermer/rouvrir), verifier l IP dans sweeted-frontend/.env, puis
   relancer Expo (touche `r` dans le terminal ou Ctrl+C + relance).
4. Compte de test existant : matricule 5-40014/25.

---

## 5. Pare-feu Windows (nouveau PC, OBLIGATOIRE pour le telephone)

Sans cela le telephone ne joint ni l API (3000) ni Metro (8081) :

1. Parametres -> Reseau : mettre le WiFi en reseau PRIVE (pas Public).
2. Pare-feu Windows Defender -> Autoriser une application :
   autoriser Node.js sur reseaux prives (cocher Prive).
   En ligne de commande (admin) si besoin :
   netsh advfirewall firewall add rule name="Sweeted API" dir=in action=allow protocol=TCP localport=3000
   netsh advfirewall firewall add rule name="Sweeted Expo" dir=in action=allow protocol=TCP localport=8081

---

## 6. Verifications de bout en bout (dans l ordre)

1. http://localhost:3000 -> BACKEND Heheheee !
2. http://localhost:8081 -> page de connexion.
3. Connexion sur telephone (QR) avec le compte de test.
4. Publier un post avec image, puis avec PDF.
5. Publier un avis officiel avec image (compte Admin).
6. Onglet Fichiers : uploader un PDF, le relire, le supprimer.
7. Studio : creer un fichier code, le modifier, le supprimer.
8. Supprimer un post et une publication officielle.

---

## 7. Depannage

- Port occupe (EADDRINUSE) : un ancien serveur tourne encore.
  Trouver et tuer : `netstat -ano | findstr :3000` puis
  `taskkill /PID <numero> /F`. Meme chose pour :8081.
- Le telephone ne joint pas le serveur : IP du .env frontend incorrecte
  (ipconfig a change ? box changee ?), pas le meme WiFi, pare-feu,
  ou recharger l app Expo (vieux bundle en cache).
- Erreur bcrypt au demarrage backend : `cd sweeted-backend`,
  supprimer node_modules, relancer `npm install`.
- Erreur de bundle Metro : lire le message (fichier + ligne), corriger,
  Metro recompile seul ; sinon `npx expo start --web --port 8081 -c`
  (vide le cache).
- La base de donnees est distante : en cas d erreur SQL au demarrage,
  verifier internet + identifiants du .env backend.
- Ne JAMAIS commiter les .env (deja ignores par .gitignore).

---

## 8. Versions de reference (ancien PC, qui marchait)

- Node v24.11.1 / npm 11.6.2
- Expo SDK 57 (expo 57.0.22) / Expo Go recent
- Backend : express, mysql2, multer, jsonwebtoken, bcrypt, dotenv
- Base : MySQL distante Aiven (rien a installer en local)
