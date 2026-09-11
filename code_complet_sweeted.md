# Code source du projet : Sweeted

80 fichiers inclus (2.2 Mo), 28 entrees exclues (voir annexe).

## Index des fichiers inclus

```text
.gitignore
app.json
CHANGELOG.md
liste
package-lock.json
package.json
projet_to_md.py
sweeted-backend\.env.example
sweeted-backend\.gitignore
sweeted-backend\logs_depuis_expo
sweeted-backend\package-lock.json
sweeted-backend\package.json
sweeted-backend\scripts\start-server.ps1
sweeted-backend\scripts\token.js
sweeted-backend\src\app.js
sweeted-backend\src\config\db.js
sweeted-backend\src\controllers\authController.js
sweeted-backend\src\controllers\commentController.js
sweeted-backend\src\controllers\fileController.js
sweeted-backend\src\controllers\notificationController.js
sweeted-backend\src\controllers\officialController.js
sweeted-backend\src\controllers\postController.js
sweeted-backend\src\controllers\socialController.js
sweeted-backend\src\controllers\sweetController.js
sweeted-backend\src\controllers\userController.js
sweeted-backend\src\middlewares\authMiddleware.js
sweeted-backend\src\middlewares\optionalAuthMiddleware.js
sweeted-backend\src\middlewares\verifierPermission.js
sweeted-backend\src\models\bookmark.js
sweeted-backend\src\models\comment.js
sweeted-backend\src\models\file.js
sweeted-backend\src\models\follow.js
sweeted-backend\src\models\notification.js
sweeted-backend\src\models\official.js
sweeted-backend\src\models\post.js
sweeted-backend\src\models\sweet.js
sweeted-backend\src\models\user.js
sweeted-backend\src\routes\authRoutes.js
sweeted-backend\src\routes\bookmarkRoutes.js
sweeted-backend\src\routes\commentRoute.js
sweeted-backend\src\routes\fileRoutes.js
sweeted-backend\src\routes\followRoutes.js
sweeted-backend\src\routes\notificationRoutes.js
sweeted-backend\src\routes\officialRoutes.js
sweeted-backend\src\routes\postRoute.js
sweeted-backend\src\routes\sweetRoute.js
sweeted-backend\src\routes\userRoutes.js
sweeted-backend\uploads\post-1789127285281-800528175
sweeted-frontend\.env.example
sweeted-frontend\.gitignore
sweeted-frontend\App.js
sweeted-frontend\app.json
sweeted-frontend\components\formatTime.js
sweeted-frontend\components\Layout\DesktopHeader.js
sweeted-frontend\components\Layout\DesktopLayout.js
sweeted-frontend\components\Layout\Sidebar.js
sweeted-frontend\components\Post.js
sweeted-frontend\components\profil.js
sweeted-frontend\components\ReactionButton.js
sweeted-frontend\components\ScrollProgress.js
sweeted-frontend\components\SweetedSplash.js
sweeted-frontend\config\api.js
sweeted-frontend\config\apiClient.js
sweeted-frontend\config\fileUpload.js
sweeted-frontend\config\openPdf.js
sweeted-frontend\config\theme.js
sweeted-frontend\ecran\Fichiers\Fichiers.js
sweeted-frontend\ecran\Home\Home.js
sweeted-frontend\ecran\Notifications.js
sweeted-frontend\ecran\Officiels\OfficialDetails.js
sweeted-frontend\ecran\Officiels\Officiels.js
sweeted-frontend\ecran\PostDetails\PostDetails.js
sweeted-frontend\ecran\Search.js
sweeted-frontend\ecran\Studio\Studio.js
sweeted-frontend\ecran\tabs\index.js
sweeted-frontend\index.js
sweeted-frontend\package-lock.json
sweeted-frontend\package.json
sweeted-frontend\README.md
yfy
```

## Fichier : .gitignore

```text
# Sweeted — monorepo projet (frontend Expo + backend Express).
# Principe : tout est versionné, SAUF :
#  - ce qui se réinstalle (node_modules),
#  - les secrets (à transmettre hors git, voir les fichiers .env.example),
#  - ce que la machine régénère seule (caches, builds, logs, uploads).

# 1. Dépendances — réinstallées avec `npm install` (racine, frontend, backend)
node_modules/
**/node_modules/

# 2. Secrets — NE JAMAIS PUSHER
.env
**/.env
.env.local
**/.env.local

# 3. Clés et certificats mobiles
*.jks
*.keystore
*.p8
*.p12
*.key
*.pem
*.mobileprovision

# 4. Caches et builds régénérables (Expo, Metro, TS)
.expo/
**/.expo/
dist/
**/dist/
web-build/
*.tsbuildinfo
.metro-health-check*

# 5. Logs
*.log
logs/

# 6. Fichiers système et éditeurs
.DS_Store
Thumbs.db
.idea/
*.iml
.vscode/*
!.vscode/settings.json

# 7. Uploads utilisateurs — générés à l'usage, dossier recréé auto par le backend
sweeted-backend/uploads/*
```

## Fichier : app.json

```json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "b423a628-756d-4bb8-9e0b-375e6dbf71d3"
      }
    },
    "owner": "fytahianas-organization",
    "slug": "sweeted"
  }
}
```

## Fichier : CHANGELOG.md

```markdown
# CHANGELOG - Sweeted Stabilization

## [2.0.0] - 2026-07-24

### Corrigé (P0 - Critique)
- **Configuration Réseau (4.1):** Correction de `API_BASE_URL` dans le frontend pour supporter l'émulateur Android (`10.0.2.2`), les devices physiques et le web de manière dynamique via Expo `Platform` et variables d'environnement.
- **Gestion des doublons de réactions (4.2):** Ajout de la gestion de l'erreur `ER_DUP_ENTRY` lors d'un sweet déjà existant (renvoie un statut `409 Conflict`).
- **Toggle Réactions (4.3, 4.10):** Support complet de l'ajout et du retrait de réactions (`POST` / `DELETE /sweets/:postId`) avec mise à jour du compteur et état visuel (cœur rempli/contour, bouton actif).
- **Validation des posts et commentaires (4.4, 4.5):** Ajout de validations strictes pour empêcher la création de posts ou de commentaires vides ou dépassant les limites de caractères autorisées.

### Corrigé (P1 - Important)
- **Profil utilisateur & Avatar (4.6, 4.7):** Création de l'endpoint `PUT /api/users/me` avec support de multer pour la mise à jour du nom d'affichage (`display_name`), de la bio et de l'avatar.
- **Visibilité des posts et commentaires (4.8):** Option A confirmée et documentée (lecture publique intentionnelle pour la consultation du réseau social).
- **Nettoyage UI (4.11):** Suppression des éléments d'interface inactifs ou morts (toggle Étudiant/Officiel figé) et simplification de la barre de navigation.
- **Édition et suppression de posts (4.9):** Ajout des boutons Modifier/Supprimer dans l'UI pour les auteurs de posts (menu contextuel via icône trois points), avec confirmation de suppression (`Alert.alert`) et modale de modification pré-remplie.

### Sécurité & Robustesse (P2)
- **Rate limiting (4.14):** Protection contre le brute-force sur `/api/auth/login` (15 tent. / 15 min) et `/api/auth/register` (10 / heure).
- **Vérification d'environnement (4.15):** Contrôle strict des variables d'environnement (`JWT_SECRET`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`) au démarrage du serveur.
- **Dossier Uploads (4.16):** Création automatique du répertoire `uploads/` si inexistant.
- **Bcrypt (4.20):** Coût de hachage des mots de passe passé à `12`.
- **Sanitization (4.21):** Nettoyage des injections XSS via le package `xss` sur la création de posts et de commentaires.

### Amélioration & Cohérence (P2 / P3)
- **Fichiers vestiges (4.12):** Suppression des fichiers `AssetExample.js`, `Untitled file.js`, `police.tts`, `zavatra`, `STEP1_AUDIT.md`.
- **Dépendances inutilisées (4.13):** Désinstallation et retrait de `react-native-paper` et `react-native-web`.
- **Identifiants de commentaires (4.19):** Re-fetch automatique des commentaires après ajout dans `PostDetails.js` pour garantit des IDs réels.
```

## Fichier : liste

````text
# Résumé détaillé des modifications - Migration vers Expo SDK 57

## 1. Analyse initiale du projet

- Lecture de `sweeted-frontend/package.json` et `sweeted-frontend/app.json`.
- Constat : le projet utilisait **Expo SDK 54** (`expo: ~54.0.37`, `react: 19.1.0`, `react-native: 0.81.5`), incompatible avec le client Expo Go du téléphone qui est sous **SDK 57**.

---

## 2. Mise à jour du noyau Expo & React

- Installation d'`expo@~57.0.0` et mise à niveau des dépendances associées vers les versions supportées par le SDK 57 :
  - `react` : passage de `19.1.0` à **`19.2.3`**
  - `react-dom` : passage de `19.1.0` à **`19.2.3`**
  - `react-native` : passage de `0.81.5` à **`0.86.3`**

---

## 3. Mise à niveau des modules et librairies Expo / React Native

Mise à jour des packages vers les versions SDK 57 requises :

- `expo-document-picker` : `~14.0.8` ➔ **`~57.0.1`**
- `expo-image-picker` : `~17.0.11` ➔ **`~57.0.16`**
- `expo-status-bar` : `~3.0.9` ➔ **`~57.0.1`**
- `expo-web-browser` : `~15.0.11` ➔ **`~57.0.2`**
- `react-native-gesture-handler` : `~2.28.0` ➔ **`~2.32.0`**
- `react-native-safe-area-context` : `~5.6.0` ➔ **`~5.7.0`**
- `react-native-screens` : `~4.16.0` ➔ **`~4.26.0`**
- `expo-font` : Ajout de la dépendance manquante requise par `@expo/vector-icons`.

---

## 4. Nettoyage du fichier de configuration (`app.json`)

Correction des propriétés dépréciées / incompatibles avec le schéma Expo SDK 57 :

- Suppression de la propriété `newArchEnabled` (gérée automatiquement / activée par défaut).
- Suppression de la propriété dépréciée `splash` au niveau racine.
- Suppression de la propriété dépréciée `android.edgeToEdgeEnabled`.
- Ajout automatique des plugins Expo nécessaires : `expo-status-bar`, `expo-font`, `expo-web-browser`.

---

## 5. Validation avec Expo Doctor

- Exécution de `npx expo-doctor` dans le dossier `sweeted-frontend`.
- Résultat : **21/21 vérifications validées avec succès** (aucun conflit de dépendance ni d'incompatibilité détecté).

---

## 6. Procédure pour lancer l'application

Dans le dossier `sweeted-frontend` :

```bash
npx expo start -c
```

Puis scanner le QR code avec l'application **Expo Go** (SDK 57) sur votre téléphone.
````

## Fichier : package-lock.json

```json
{
  "name": "sweeted-fullstack",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "sweeted-fullstack",
      "version": "1.0.0",
      "devDependencies": {
        "concurrently": "^8.2.2"
      }
    },
    "node_modules/@babel/runtime": {
      "version": "7.29.2",
      "resolved": "https://registry.npmjs.org/@babel/runtime/-/runtime-7.29.2.tgz",
      "integrity": "sha512-JiDShH45zKHWyGe4ZNVRrCjBz8Nh9TMmZG1kh4QTK8hCBTWBi8Da+i7s1fJw7/lYpM4ccepSNfqzZ/QvABBi5g==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/ansi-regex": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/ansi-regex/-/ansi-regex-5.0.1.tgz",
      "integrity": "sha512-quJQXlTSUGL2LH9SUXo8VwsY4soanhgo6LNSm84E1LBcE8s3O0wpdiRzyR9z/ZZJMlMWv37qOOb9pdJlMUEKFQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/ansi-styles": {
      "version": "4.3.0",
      "resolved": "https://registry.npmjs.org/ansi-styles/-/ansi-styles-4.3.0.tgz",
      "integrity": "sha512-zbB9rCJAT1rbjiVDb2hqKFHNYLxgtk8NURxZ3IZwD3F6NtxbXZQCnnSi1Lkx+IDohdPlFp222wVALIheZJQSEg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "color-convert": "^2.0.1"
      },
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/chalk/ansi-styles?sponsor=1"
      }
    },
    "node_modules/chalk": {
      "version": "4.1.2",
      "resolved": "https://registry.npmjs.org/chalk/-/chalk-4.1.2.tgz",
      "integrity": "sha512-oKnbhFyRIXpUuez8iBMmyEa4nbj4IOQyuhc/wy9kY7/WVPcwIO9VA668Pu8RkO7+0G76SLROeyw9CpQ061i4mA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ansi-styles": "^4.1.0",
        "supports-color": "^7.1.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/chalk/chalk?sponsor=1"
      }
    },
    "node_modules/chalk/node_modules/supports-color": {
      "version": "7.2.0",
      "resolved": "https://registry.npmjs.org/supports-color/-/supports-color-7.2.0.tgz",
      "integrity": "sha512-qpCAvRl9stuOHveKsn7HncJRvv501qIacKzQlO/+Lwxc9+0q2wLyv4Dfvt80/DPn2pqOBsJdDiogXGR9+OvwRw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "has-flag": "^4.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/cliui": {
      "version": "8.0.1",
      "resolved": "https://registry.npmjs.org/cliui/-/cliui-8.0.1.tgz",
      "integrity": "sha512-BSeNnyus75C4//NQ9gQt1/csTXyo/8Sb+afLAkzAptFuMsod9HFokGNudZpi/oQV73hnVK+sR+5PVRMd+Dr7YQ==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "string-width": "^4.2.0",
        "strip-ansi": "^6.0.1",
        "wrap-ansi": "^7.0.0"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/color-convert": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/color-convert/-/color-convert-2.0.1.tgz",
      "integrity": "sha512-RRECPsj7iu/xb5oKYcsFHSppFNnsj/52OVTRKb4zP5onXwVF3zVmmToNcOfGC+CRDpfK/U584fMg38ZHCaElKQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "color-name": "~1.1.4"
      },
      "engines": {
        "node": ">=7.0.0"
      }
    },
    "node_modules/color-name": {
      "version": "1.1.4",
      "resolved": "https://registry.npmjs.org/color-name/-/color-name-1.1.4.tgz",
      "integrity": "sha512-dOy+3AuW3a2wNbZHIuMZpTcgjGuLU/uBL/ubcZF9OXbDo8ff4O8yVp5Bf0efS8uEoYo5q4Fx7dY9OgQGXgAsQA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/concurrently": {
      "version": "8.2.2",
      "resolved": "https://registry.npmjs.org/concurrently/-/concurrently-8.2.2.tgz",
      "integrity": "sha512-1dP4gpXFhei8IOtlXRE/T/4H88ElHgTiUzh71YUmtjTEHMSRS2Z/fgOxHSxxusGHogsRfxNq1vyAwxSC+EVyDg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "chalk": "^4.1.2",
        "date-fns": "^2.30.0",
        "lodash": "^4.17.21",
        "rxjs": "^7.8.1",
        "shell-quote": "^1.8.1",
        "spawn-command": "0.0.2",
        "supports-color": "^8.1.1",
        "tree-kill": "^1.2.2",
        "yargs": "^17.7.2"
      },
      "bin": {
        "conc": "dist/bin/concurrently.js",
        "concurrently": "dist/bin/concurrently.js"
      },
      "engines": {
        "node": "^14.13.0 || >=16.0.0"
      },
      "funding": {
        "url": "https://github.com/open-cli-tools/concurrently?sponsor=1"
      }
    },
    "node_modules/date-fns": {
      "version": "2.30.0",
      "resolved": "https://registry.npmjs.org/date-fns/-/date-fns-2.30.0.tgz",
      "integrity": "sha512-fnULvOpxnC5/Vg3NCiWelDsLiUc9bRwAPs/+LfTLNvetFCtCTN+yQz15C/fs4AwX1R9K5GLtLfn8QW+dWisaAw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/runtime": "^7.21.0"
      },
      "engines": {
        "node": ">=0.11"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/date-fns"
      }
    },
    "node_modules/emoji-regex": {
      "version": "8.0.0",
      "resolved": "https://registry.npmjs.org/emoji-regex/-/emoji-regex-8.0.0.tgz",
      "integrity": "sha512-MSjYzcWNOA0ewAHpz0MxpYFvwg6yjy1NG3xteoqz644VCo/RPgnr1/GGt+ic3iJTzQ8Eu3TdM14SawnVUmGE6A==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/escalade": {
      "version": "3.2.0",
      "resolved": "https://registry.npmjs.org/escalade/-/escalade-3.2.0.tgz",
      "integrity": "sha512-WUj2qlxaQtO4g6Pq5c29GTcWGDyd8itL8zTlipgECz3JesAiiOKotd8JU6otB3PACgG6xkJUyVhboMS+bje/jA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/get-caller-file": {
      "version": "2.0.5",
      "resolved": "https://registry.npmjs.org/get-caller-file/-/get-caller-file-2.0.5.tgz",
      "integrity": "sha512-DyFP3BM/3YHTQOCUL/w0OZHR0lpKeGrxotcHWcqNEdnltqFwXVfhEBQ94eIo34AfQpo0rGki4cyIiftY06h2Fg==",
      "dev": true,
      "license": "ISC",
      "engines": {
        "node": "6.* || 8.* || >= 10.*"
      }
    },
    "node_modules/has-flag": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/has-flag/-/has-flag-4.0.0.tgz",
      "integrity": "sha512-EykJT/Q1KjTWctppgIAgfSO0tKVuZUjhgMr17kqTumMl6Afv3EISleU7qZUzoXDFTAHTDC4NOoG/ZxU3EvlMPQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/is-fullwidth-code-point": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/is-fullwidth-code-point/-/is-fullwidth-code-point-3.0.0.tgz",
      "integrity": "sha512-zymm5+u+sCsSWyD9qNaejV3DFvhCKclKdizYaJUuHA83RLjb7nSuGnddCHGv0hk+KY7BMAlsWeK4Ueg6EV6XQg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/lodash": {
      "version": "4.18.1",
      "resolved": "https://registry.npmjs.org/lodash/-/lodash-4.18.1.tgz",
      "integrity": "sha512-dMInicTPVE8d1e5otfwmmjlxkZoUpiVLwyeTdUsi/Caj/gfzzblBcCE5sRHV/AsjuCmxWrte2TNGSYuCeCq+0Q==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/require-directory": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/require-directory/-/require-directory-2.1.1.tgz",
      "integrity": "sha512-fGxEI7+wsG9xrvdjsrlmL22OMTTiHRwAMroiEeMgq8gzoLC/PQr7RsRDSTLUg/bZAZtF+TVIkHc6/4RIKrui+Q==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/rxjs": {
      "version": "7.8.2",
      "resolved": "https://registry.npmjs.org/rxjs/-/rxjs-7.8.2.tgz",
      "integrity": "sha512-dhKf903U/PQZY6boNNtAGdWbG85WAbjT/1xYoZIC7FAY0yWapOBQVsVrDl58W86//e1VpMNBtRV4MaXfdMySFA==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "tslib": "^2.1.0"
      }
    },
    "node_modules/shell-quote": {
      "version": "1.10.0",
      "resolved": "https://registry.npmjs.org/shell-quote/-/shell-quote-1.10.0.tgz",
      "integrity": "sha512-w1aiOKwKuRgtwAReIIj89puqg+I7GvX4IbLrvmhXbzQsj1+Zwi4VO3+fa6ZF91TWSjIxoEkKnMeHcLEODK5ZXA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/spawn-command": {
      "version": "0.0.2",
      "resolved": "https://registry.npmjs.org/spawn-command/-/spawn-command-0.0.2.tgz",
      "integrity": "sha512-zC8zGoGkmc8J9ndvml8Xksr1Amk9qBujgbF0JAIWO7kXr43w0h/0GJNM/Vustixu+YE8N/MTrQ7N31FvHUACxQ==",
      "dev": true
    },
    "node_modules/string-width": {
      "version": "4.2.3",
      "resolved": "https://registry.npmjs.org/string-width/-/string-width-4.2.3.tgz",
      "integrity": "sha512-wKyQRQpjJ0sIp62ErSZdGsjMJWsap5oRNihHhu6G7JVO/9jIB6UyevL+tXuOqrng8j/cxKTWyWUwvSTriiZz/g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "emoji-regex": "^8.0.0",
        "is-fullwidth-code-point": "^3.0.0",
        "strip-ansi": "^6.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/strip-ansi": {
      "version": "6.0.1",
      "resolved": "https://registry.npmjs.org/strip-ansi/-/strip-ansi-6.0.1.tgz",
      "integrity": "sha512-Y38VPSHcqkFrCpFnQ9vuSXmquuv5oXOKpGeT6aGrr3o3Gc9AlVa6JBfUSOCnbxGGZF+/0ooI7KrPuUSztUdU5A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ansi-regex": "^5.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/supports-color": {
      "version": "8.1.1",
      "resolved": "https://registry.npmjs.org/supports-color/-/supports-color-8.1.1.tgz",
      "integrity": "sha512-MpUEN2OodtUzxvKQl72cUF7RQ5EiHsGvSsVG0ia9c5RbWGL2CI4C7EpPS8UTBIplnlzZiNuV56w+FuNxy3ty2Q==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "has-flag": "^4.0.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/chalk/supports-color?sponsor=1"
      }
    },
    "node_modules/tree-kill": {
      "version": "1.2.2",
      "resolved": "https://registry.npmjs.org/tree-kill/-/tree-kill-1.2.2.tgz",
      "integrity": "sha512-L0Orpi8qGpRG//Nd+H90vFB+3iHnue1zSSGmNOOCh1GLJ7rUKVwV2HvijphGQS2UmhUZewS9VgvxYIdgr+fG1A==",
      "dev": true,
      "license": "MIT",
      "bin": {
        "tree-kill": "cli.js"
      }
    },
    "node_modules/tslib": {
      "version": "2.8.1",
      "resolved": "https://registry.npmjs.org/tslib/-/tslib-2.8.1.tgz",
      "integrity": "sha512-oJFu94HQb+KVduSUQL7wnpmqnfmLsOA/nAh6b6EH0wCEoK0/mPeXU6c3wKDV83MkOuHPRHtSXKKU99IBazS/2w==",
      "dev": true,
      "license": "0BSD"
    },
    "node_modules/wrap-ansi": {
      "version": "7.0.0",
      "resolved": "https://registry.npmjs.org/wrap-ansi/-/wrap-ansi-7.0.0.tgz",
      "integrity": "sha512-YVGIj2kamLSTxw6NsZjoBxfSwsn0ycdesmc4p+Q21c5zPuZ1pl+NfxVdxPtdHvmNVOQ6XSYG4AUtyt/Fi7D16Q==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ansi-styles": "^4.0.0",
        "string-width": "^4.1.0",
        "strip-ansi": "^6.0.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/chalk/wrap-ansi?sponsor=1"
      }
    },
    "node_modules/y18n": {
      "version": "5.0.8",
      "resolved": "https://registry.npmjs.org/y18n/-/y18n-5.0.8.tgz",
      "integrity": "sha512-0pfFzegeDWJHJIAmTLRP2DwHjdF5s7jo9tuztdQxAhINCdvS+3nGINqPd00AphqJR/0LhANUS6/+7SCb98YOfA==",
      "dev": true,
      "license": "ISC",
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/yargs": {
      "version": "17.7.2",
      "resolved": "https://registry.npmjs.org/yargs/-/yargs-17.7.2.tgz",
      "integrity": "sha512-7dSzzRQ++CKnNI/krKnYRV7JKKPUXMEh61soaHKg9mrWEhzFWhFnxPxGl+69cD1Ou63C13NUPCnmIcrvqCuM6w==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "cliui": "^8.0.1",
        "escalade": "^3.1.1",
        "get-caller-file": "^2.0.5",
        "require-directory": "^2.1.1",
        "string-width": "^4.2.3",
        "y18n": "^5.0.5",
        "yargs-parser": "^21.1.1"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/yargs-parser": {
      "version": "21.1.1",
      "resolved": "https://registry.npmjs.org/yargs-parser/-/yargs-parser-21.1.1.tgz",
      "integrity": "sha512-tVpsJW7DdjecAiFpbIB1e3qxIQsE6NoPc5/eTdrbbIC4h0LVsWhnoa3g+m2HclBIujHzsxZ4VJVA+GUuc2/LBw==",
      "dev": true,
      "license": "ISC",
      "engines": {
        "node": ">=12"
      }
    }
  }
}
```

## Fichier : package.json

```json
{
  "name": "sweeted-fullstack",
  "version": "1.0.0",
  "description": "For the faith in sweeted",
  "scripts": {
    "dev": "concurrently \"cd sweeted-backend && npm start\" \"cd sweeted-frontend && npm start\""
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

## Fichier : projet_to_md.py

````python
import os
import sys
from pathlib import Path

# Dossiers au contenu regenere ou telecharge : on ne les parcourt pas.
# (le dossier lui-meme reste mentionne dans l'annexe des exclus).
DOSSIERS_IGNORES = {
    '.git', '.svn', '.hg',
    '.idea', '.vs', '.vscode',
    'node_modules', 'bower_components',
    '.venv', 'venv', 'env', 'virtualenv',
    'bin', 'obj', 'build', 'dist', 'out', 'target',
    'x64', 'x86', 'Release', 'Debug',
    'ipch', '__pycache__', '.pytest_cache', '.mypy_cache',
    '.gradle', '.expo', '.next', '.nuxt', '.turbo',
    'coverage', '.nyc_output', 'Pods', '.dart_tool',
    'Library', 'Temp',
    '.cache',
}

# Dossiers caches que l'on garde quand meme (vrai detail projet, ex : CI).
DOSSIERS_CACHES_AUTORISES = {'.github'}

# Fichiers caches gardes (config projet reelle). Tout autre fichier
# commencant par '.' est ignore mais liste en annexe.
FICHIERS_CACHES_AUTORISES = {
    '.gitignore', '.gitattributes', '.gitkeep',
    '.editorconfig', '.nvmrc', '.node-version', '.python-version',
    '.babelrc', '.eslintrc', '.eslintrc.json',
    '.prettierrc', '.prettierrc.json', '.prettierignore',
    '.dockerignore',
    '.env.example', '.env.sample', '.env.template',
}

# Extensions binaires / medias / archives / generees : contenu jamais
# inline, mais chaque fichier est liste en annexe (chemin + taille + raison).
# NOTE : .svg, .cmd, .sln, .plist, .jsonld, .rc, .filters, .obj, .o, .a,
# .lib sont VOLONTAIREMENT absents (ce sont des textes exploitables).
EXTENSIONS_IGNOREES = {
    '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff', '.tif', '.ico',
    '.webp', '.psd', '.ai', '.eps', '.raw', '.heic', '.hdr', '.tga', '.dds',
    '.fbx', '.max', '.blend', '.3ds', '.dae', '.stl', '.gltf', '.glb',
    '.mp3', '.wav', '.ogg', '.flac', '.aac', '.m4a', '.wma', '.mid', '.midi',
    '.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.webm', '.mpeg', '.mpg', '.m4v',
    '.zip', '.tar', '.gz', '.rar', '.7z', '.bz2', '.xz', '.cab', '.iso', '.tgz',
    '.jar', '.war', '.ear',
    '.exe', '.dll', '.so', '.dylib', '.bin', '.elf', '.app',
    '.msi', '.pkg', '.deb', '.rpm',
    '.pdb', '.idb', '.ilk', '.suo', '.user', '.aps',
    '.gch', '.pch', '.class', '.pyc', '.pyo', '.pyd', '.elc',
    '.ttf', '.otf', '.woff', '.woff2', '.eot',
    '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
    '.odt', '.ods', '.odp', '.rtf', '.pages', '.numbers', '.key',
    '.db', '.sqlite', '.sqlite3', '.dat', '.mdb', '.accdb', '.sqlitedb', '.dbf',
    '.localstorage',
    '.log', '.bak', '.tmp', '.temp', '.swp', '.swo', '.dump', '.crash',
    '.lnk', '.map', '.tsbuildinfo',
}

# Noms de bundles/minifies generes (detectes sur le nom complet).
SUFFIXES_GENERES = ('.min.js', '.min.css', '.bundle.js')

# Secrets / cles : contenu JAMAIS ecrit, seulement mention en annexe.
EXTENSIONS_SECRETS = {'.pem', '.key', '.p12', '.pfx', '.jks', '.keystore'}
NOMS_SECRETS = {'id_rsa', 'id_dsa', 'id_ecdsa', 'id_ed25519', '.npmrc', '.pypirc'}


def est_secret(nom_fichier):
    if nom_fichier in NOMS_SECRETS:
        return True
    if nom_fichier == '.env' or nom_fichier.startswith('.env.'):
        if nom_fichier.lower() in ('.env.example', '.env.sample', '.env.template'):
            return False
        return True
    return Path(nom_fichier).suffix.lower() in EXTENSIONS_SECRETS

# Mapping extensions / noms -> langage Markdown (coloration syntaxique).
MAPPING_LANGAGES = {
    '.cpp': 'cpp', '.h': 'cpp', '.hpp': 'cpp', '.c': 'c', '.cc': 'cpp',
    '.cxx': 'cpp', '.cs': 'csharp', '.sln': 'text',
    '.vcxproj': 'xml', '.csproj': 'xml', '.vbproj': 'xml',
    '.props': 'xml', '.targets': 'xml', '.plist': 'xml',
    '.py': 'python', '.pyw': 'python',
    '.html': 'html', '.xhtml': 'html', '.css': 'css', '.scss': 'scss',
    '.sass': 'sass', '.less': 'less',
    '.js': 'javascript', '.jsx': 'javascript',
    '.ts': 'typescript', '.tsx': 'typescript',
    '.json': 'json', '.xml': 'xml', '.svg': 'xml',
    '.sh': 'bash', '.bash': 'bash', '.zsh': 'bash',
    '.bat': 'bat', '.cmd': 'bat', '.ps1': 'powershell',
    '.yml': 'yaml', '.yaml': 'yaml', '.toml': 'toml', '.ini': 'ini',
    '.conf': 'text', '.properties': 'properties',
    '.java': 'java', '.kt': 'kotlin', '.kts': 'kotlin',
    '.scala': 'scala', '.groovy': 'groovy', '.gradle': 'gradle',
    '.rs': 'rust', '.go': 'go',
    '.md': 'markdown', '.rst': 'text', '.txt': 'text', '.sql': 'sql',
    '.php': 'php', '.rb': 'ruby', '.pl': 'perl', '.pm': 'perl',
    '.swift': 'swift', '.m': 'objectivec', '.mm': 'objectivec',
    '.r': 'r', '.jl': 'julia', '.tex': 'latex', '.bib': 'latex',
    '.cmake': 'cmake', '.dockerfile': 'dockerfile',
    'Makefile': 'makefile', 'makefile': 'makefile',
    'Dockerfile': 'dockerfile', 'CMakeLists.txt': 'cmake',
}

TAILLE_MAX_FICHIER_OCTETS = 1024 * 1024  # 1 Mo : au-dela, inclusion tronquee (signalee)
LIGNES_MAX_FICHIER_VOLUMINEUX = 300


def taille_fichier(chemin):
    try:
        return chemin.stat().st_size
    except (FileNotFoundError, PermissionError, OSError):
        return -1


def formater_taille(octets):
    if octets < 0:
        return '?'
    if octets < 1024:
        return str(octets) + ' o'
    if octets < 1024 * 1024:
        return str(round(octets / 1024)) + ' Ko'
    return str(round(octets / (1024 * 1024), 1)) + ' Mo'


def classer_fichier(chemin):
    nom = chemin.name
    suffixe = chemin.suffix.lower()
    if est_secret(nom):
        return False, 'secret (contenu masque)'
    if suffixe in EXTENSIONS_IGNOREES:
        return False, 'extension ignoree (binaire/media/genere)'
    nom_bas = nom.lower()
    for motif in SUFFIXES_GENERES:
        if nom_bas.endswith(motif):
            return False, 'fichier genere (bundle/minifie)'
    taille = taille_fichier(chemin)
    if taille < 0:
        return False, 'inaccessible'
    if taille == 0:
        return True, ''
    try:
        with open(chemin, 'rb') as f:
            echantillon = f.read(8192)
    except (PermissionError, OSError):
        return False, 'inaccessible'
    if b'`X00`' not in echantillon:
        return True, ''
    try:
        texte = echantillon.decode('utf-16')
        if texte:
            lisibles = sum(1 for c in texte if c.isprintable() or c.isspace())
            if lisibles / len(texte) > 0.8:
                return True, ''
    except (UnicodeDecodeError, ValueError):
        pass
    return False, 'binaire (contenu)'


def obtenir_langage_markdown(extension, nom_fichier):
    if nom_fichier in MAPPING_LANGAGES:
        return MAPPING_LANGAGES[nom_fichier]
    return MAPPING_LANGAGES.get(extension.lower(), 'text')


def lire_texte(chemin):
    for encodage in ('utf-8-sig', 'utf-16', 'latin-1'):
        try:
            with open(chemin, 'r', encoding=encodage) as f_in:
                return f_in.read()
        except (UnicodeDecodeError, ValueError):
            continue
    return ''


def generer_markdown_code(dossier_racine, nom_fichier_sortie):
    racine = Path(dossier_racine).resolve()
    sortie_resolue = Path(nom_fichier_sortie).resolve()
    fichiers_a_traiter = []
    exclus = []

    for root, dirs, files in os.walk(racine):
        for d in sorted(dirs):
            if d in DOSSIERS_IGNORES or (d.startswith('.') and d not in DOSSIERS_CACHES_AUTORISES):
                exclus.append((str((Path(root) / d).relative_to(racine)) + '/', -1, 'dossier ignore (contenu regenere/telecharge)'))
        dirs[:] = [d for d in dirs if d not in DOSSIERS_IGNORES and (not d.startswith('.') or d in DOSSIERS_CACHES_AUTORISES)]

        for file in sorted(files):
            chemin_complet = Path(root) / file
            try:
                rel = str(chemin_complet.relative_to(racine))
            except ValueError:
                continue
            if file.startswith('.') and file not in FICHIERS_CACHES_AUTORISES:
                if est_secret(file): raison_cache = 'secret (contenu masque)'
                else: raison_cache = 'fichier cache ignore'
                exclus.append((rel, taille_fichier(chemin_complet), raison_cache))
                continue
            if file.startswith('code_complet_') and file.endswith('.md'):
                exclus.append((rel, taille_fichier(chemin_complet), 'export precedent (evite la recursion)'))
            try:
                if chemin_complet.resolve() == sortie_resolue:
                    exclus.append((rel, taille_fichier(chemin_complet), 'fichier de sortie lui-meme'))
                    continue
            except OSError:
                pass
            inclure, raison = classer_fichier(chemin_complet)
            if inclure:
                fichiers_a_traiter.append(chemin_complet)
            else:
                exclus.append((rel, taille_fichier(chemin_complet), raison))

    fichiers_a_traiter.sort()
    exclus.sort(key=lambda e: e[0])
    total_octets = sum(taille_fichier(c) for c in fichiers_a_traiter)

    with open(nom_fichier_sortie, 'w', encoding='utf-8') as f_out:
        f_out.write('# Code source du projet : ' + racine.name + '\n\n')
        f_out.write(str(len(fichiers_a_traiter)) + ' fichiers inclus (' + formater_taille(total_octets) + '), ' + str(len(exclus)) + ' entrees exclues (voir annexe).\n\n')
        f_out.write('## Index des fichiers inclus' + chr(10) + chr(10) + chr(96)*3 + 'text' + chr(10))
        for chemin_fichier in fichiers_a_traiter:
            f_out.write(str(chemin_fichier.relative_to(racine)) + '\n')
        f_out.write('```\n\n')

        for chemin_fichier in fichiers_a_traiter:
            rel = str(chemin_fichier.relative_to(racine))
            langage = obtenir_langage_markdown(chemin_fichier.suffix, chemin_fichier.name)
            contenu = lire_texte(chemin_fichier)
            tronque = False
            total_lignes = 0
            if taille_fichier(chemin_fichier) > TAILLE_MAX_FICHIER_OCTETS:
                lignes = contenu.splitlines()
                total_lignes = len(lignes)
                if total_lignes > LIGNES_MAX_FICHIER_VOLUMINEUX:
                    contenu = '\n'.join(lignes[:LIGNES_MAX_FICHIER_VOLUMINEUX])
                    tronque = True
            cloture = chr(96)*4 if chr(96)*3 in contenu else chr(96)*3
            f_out.write('## Fichier : ' + rel + '\n\n')
            if tronque:
                f_out.write('> Fichier volumineux : ' + str(total_lignes) + ' lignes / ' + formater_taille(taille_fichier(chemin_fichier)) + ' - ' + str(LIGNES_MAX_FICHIER_VOLUMINEUX) + ' premieres lignes affichees.\n\n')
            if not contenu:
                f_out.write('Cloture: texte vide - voir annexe si exclusion.\n')
            f_out.write(cloture + langage + '\n')
            if contenu:
                if not contenu.endswith('\n'):
                    contenu = contenu + '\n'
                f_out.write(contenu)
            else:
                f_out.write('// [Fichier vide]\n')
            f_out.write(cloture + '\n\n')

        f_out.write('## Annexe : fichiers exclus (volontairement, avec raison)\n\n')
        f_out.write('| Fichier | Taille | Raison |\n|---|---|---|\n')
        for (rel, taille, raison) in exclus:
            f_out.write('| ' + rel + ' | ' + formater_taille(taille) + ' | ' + raison + ' |\n')


if __name__ == '__main__':
    if len(sys.argv) >= 2:
        chemin_utilisateur = sys.argv[1]
        sortie_arg = sys.argv[2] if len(sys.argv) >= 3 else None
    else:
        chemin_utilisateur = input('Entrez le chemin du dossier a explorer : ')
        sortie_arg = None
    dossier_racine = Path(chemin_utilisateur)
    if not dossier_racine.exists() or not dossier_racine.is_dir():
        print('Erreur : dossier invalide.')
    else:
        nom_fichier_sortie = sortie_arg or ('code_complet_' + dossier_racine.name + '.md')
        print('Extraction et analyse en cours...')
        generer_markdown_code(str(dossier_racine), nom_fichier_sortie)
        print('Operation terminee ! Export : ' + nom_fichier_sortie)
````

## Fichier : sweeted-backend\.env.example

```text
# Copier ce fichier en `.env` puis remplir avec les vraies valeurs.
# NE JAMAIS commiter le fichier `.env` (secrets).
DB_HOST=
DB_PORT=3306
DB_USER=
DB_PASSWORD=
DB_NAME=
JWT_SECRET=
PORT=3000
HOST=0.0.0.0
```

## Fichier : sweeted-backend\.gitignore

```text
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*
.pnpm-debug.log*

# Diagnostic reports (https://nodejs.org/api/report.html)
report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Directory for instrumented libs generated by jscoverage/JSCover
lib-cov

# Coverage directory used by tools like istanbul
coverage
*.lcov

# nyc test coverage
.nyc_output

# Grunt intermediate storage (https://gruntjs.com/creating-plugins#storing-task-files)
.grunt

# Bower dependency directory (https://bower.io/)
bower_components

# node-waf configuration
.lock-wscript

# Compiled binary addons (https://nodejs.org/api/addons.html)
build/Release

# Dependency directories
node_modules/
jspm_packages/

# Snowpack dependency directory (https://snowpack.dev/)
web_modules/

# TypeScript cache
*.tsbuildinfo

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env
.env.local
.env.test
.env.production

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next
out

# Nuxt.js build / generate output
.nuxt
dist

# Gatsby files
.cache/
# Comment in the public line in if your project uses Gatsby and not Next.js
# https://nextjs.org/blog/next-9-1#public-directory-support
# public

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless/

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# yarn v2
.yarn/cache
.yarn/unplugged
.yarn/build-state.yml
.yarn/install-state.gz
.pnp.*

# End of https://mrkandreev.name/snippets/gitignore-generator/#Node
```

## Fichier : sweeted-backend\logs_depuis_expo

```text
Console Warning

InteractionManager has been deprecated and will be removed in a future release. Please refactor long tasks into smaller ones, and  use 'requestIdleCallback' instead.

Source:
D:\Sweeted\sweeted-frontend\node_modules\react-native\Libraries\LogBox\Data\LogBoxData.js (235:38)

Call Stack:
addLog (D:\Sweeted\sweeted-frontend\node_modules\react-native\Libraries\LogBox\Data\LogBoxData.js:235)
registerWarning (D:\Sweeted\sweeted-frontend\node_modules\react-native\Libraries\LogBox\LogBox.js:255)
console.warn (D:\Sweeted\sweeted-frontend\node_modules\react-native\Libraries\LogBox\LogBox.js:113)
warnOnce (D:\Sweeted\sweeted-frontend\node_modules\react-native\Libraries\Utilities\warnOnce.js:27)
module.exports.get__InteractionManager (D:\Sweeted\sweeted-frontend\node_modules\react-native\index.js:264)
useLatestCallback$argument_0 (D:\Sweeted\sweeted-frontend\node_modules\@react-navigation\stack\lib\module\views\Stack\Card.js:91)
latestCallback (D:\Sweeted\sweeted-frontend\node_modules\use-latest-callback\lib\src\index.js:21)
useLatestCallback$argument_0 (D:\Sweeted\sweeted-frontend\node_modules\@react-navigation\stack\lib\module\views\Stack\Card.js:135)
latestCallback (D:\Sweeted\sweeted-frontend\node_modules\use-latest-callback\lib\src\index.js:21)
setTimeout$argument_0 (D:\Sweeted\sweeted-frontend\node_modules\@react-navigation\stack\lib\module\views\Stack\Card.js:250)

Console Warning

SafeAreaView has been deprecated and will be removed in a future release. Please use 'react-native-safe-area-context' instead. See https://github.com/AppAndFlow/react-native-safe-area-context

Source:
D:\Sweeted\sweeted-frontend\App.js (85:17)

Call Stack:
addLog (D:\Sweeted\sweeted-frontend\node_modules\react-native\Libraries\LogBox\Data\LogBoxData.js:235)
registerWarning (D:\Sweeted\sweeted-frontend\node_modules\react-native\Libraries\LogBox\LogBox.js:255)
console.warn (D:\Sweeted\sweeted-frontend\node_modules\react-native\Libraries\LogBox\LogBox.js:113)
warnOnce (D:\Sweeted\sweeted-frontend\node_modules\react-native\Libraries\Utilities\warnOnce.js:27)
module.exports.get__SafeAreaView (D:\Sweeted\sweeted-frontend\node_modules\react-native\index.js:101)
LoginScreen (D:\Sweeted\sweeted-frontend\App.js:85)
callComponent.react_stack_bottom_frame (D:\Sweeted\sweeted-frontend\node_modules\react-native\Libraries\Renderer\implementations\ReactFabric-dev.js:17130)
renderWithHooks (D:\Sweeted\sweeted-frontend\node_modules\react-native\Libraries\Renderer\implementations\ReactFabric-dev.js:5648)
updateFunctionComponent (D:\Sweeted\sweeted-frontend\node_modules\react-native\Libraries\Renderer\implementations\ReactFabric-dev.js:8081)
beginWork (D:\Sweeted\sweeted-frontend\node_modules\react-native\Libraries\Renderer\implementations\ReactFabric-dev.js:9340)
runWithFiberInDEV (D:\Sweeted\sweeted-frontend\node_modules\react-native\Libraries\Renderer\implementations\ReactFabric-dev.js:697)
performUnitOfWork (D:\Sweeted\sweeted-frontend\node_modules\react-native\Libraries\Renderer\implementations\ReactFabric-dev.js:14134)
workLoopSync (D:\Sweeted\sweeted-frontend\node_modules\react-native\Libraries\Renderer\implementations\ReactFabric-dev.js:13966)
renderRootSync (D:\Sweeted\sweeted-frontend\node_modules\react-native\Libraries\Renderer\implementations\ReactFabric-dev.js:13947)
performWorkOnRoot (D:\Sweeted\sweeted-frontend\node_modules\react-native\Libraries\Renderer\implementations\ReactFabric-dev.js:13087)
performWorkOnRootViaSchedulerTask (D:\Sweeted\sweeted-frontend\node_modules\react-native\Libraries\Renderer\implementations\ReactFabric-dev.js:3673)
```

## Fichier : sweeted-backend\package-lock.json

```json
{
  "name": "sweeted",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "sweeted",
      "version": "1.0.0",
      "license": "ISC",
      "dependencies": {
        "bcrypt": "^6.0.0",
        "body-parser": "^2.2.2",
        "cors": "^2.8.6",
        "dotenv": "^17.3.1",
        "express": "^5.2.1",
        "express-rate-limit": "^8.6.0",
        "express-validator": "^7.3.1",
        "jsonwebtoken": "^9.0.3",
        "multer": "^2.2.0",
        "mysql2": "^3.19.1",
        "xss": "^1.0.15"
      }
    },
    "node_modules/@types/node": {
      "version": "25.5.0",
      "resolved": "https://registry.npmjs.org/@types/node/-/node-25.5.0.tgz",
      "integrity": "sha512-jp2P3tQMSxWugkCUKLRPVUpGaL5MVFwF8RDuSRztfwgN1wmqJeMSbKlnEtQqU8UrhTmzEmZdu2I6v2dpp7XIxw==",
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "undici-types": "~7.18.0"
      }
    },
    "node_modules/accepts": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/accepts/-/accepts-2.0.0.tgz",
      "integrity": "sha512-5cvg6CtKwfgdmVqY1WIiXKc3Q1bkRqGLi+2W/6ao+6Y7gu/RCwRuAhGEzh5B4KlszSuTLgZYuqFqo5bImjNKng==",
      "license": "MIT",
      "dependencies": {
        "mime-types": "^3.0.0",
        "negotiator": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/append-field": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/append-field/-/append-field-1.0.0.tgz",
      "integrity": "sha512-klpgFSWLW1ZEs8svjfb7g4qWY0YS5imI82dTg+QahUvJ8YqAY0P10Uk8tTyh9ZGuYEZEMaeJYCF5BFuX552hsw==",
      "license": "MIT"
    },
    "node_modules/aws-ssl-profiles": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/aws-ssl-profiles/-/aws-ssl-profiles-1.1.2.tgz",
      "integrity": "sha512-NZKeq9AfyQvEeNlN0zSYAaWrmBffJh3IELMZfRpJVWgrpEbtEpnjvzqBPf+mxoI287JohRDoa+/nsfqqiZmF6g==",
      "license": "MIT",
      "engines": {
        "node": ">= 6.0.0"
      }
    },
    "node_modules/bcrypt": {
      "version": "6.0.0",
      "resolved": "https://registry.npmjs.org/bcrypt/-/bcrypt-6.0.0.tgz",
      "integrity": "sha512-cU8v/EGSrnH+HnxV2z0J7/blxH8gq7Xh2JFT6Aroax7UohdmiJJlxApMxtKfuI7z68NvvVcmR78k2LbT6efhRg==",
      "hasInstallScript": true,
      "license": "MIT",
      "dependencies": {
        "node-addon-api": "^8.3.0",
        "node-gyp-build": "^4.8.4"
      },
      "engines": {
        "node": ">= 18"
      }
    },
    "node_modules/body-parser": {
      "version": "2.2.2",
      "resolved": "https://registry.npmjs.org/body-parser/-/body-parser-2.2.2.tgz",
      "integrity": "sha512-oP5VkATKlNwcgvxi0vM0p/D3n2C3EReYVX+DNYs5TjZFn/oQt2j+4sVJtSMr18pdRr8wjTcBl6LoV+FUwzPmNA==",
      "license": "MIT",
      "dependencies": {
        "bytes": "^3.1.2",
        "content-type": "^1.0.5",
        "debug": "^4.4.3",
        "http-errors": "^2.0.0",
        "iconv-lite": "^0.7.0",
        "on-finished": "^2.4.1",
        "qs": "^6.14.1",
        "raw-body": "^3.0.1",
        "type-is": "^2.0.1"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/buffer-equal-constant-time": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/buffer-equal-constant-time/-/buffer-equal-constant-time-1.0.1.tgz",
      "integrity": "sha512-zRpUiDwd/xk6ADqPMATG8vc9VPrkck7T07OIx0gnjmJAnHnTVXNQG3vfvWNuiZIkwu9KrKdA1iJKfsfTVxE6NA==",
      "license": "BSD-3-Clause"
    },
    "node_modules/buffer-from": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/buffer-from/-/buffer-from-1.1.2.tgz",
      "integrity": "sha512-E+XQCRwSbaaiChtv6k6Dwgc+bx+Bs6vuKJHHl5kox/BaKbhiXzqQOwK4cO22yElGp2OCmjwVhT3HmxgyPGnJfQ==",
      "license": "MIT"
    },
    "node_modules/busboy": {
      "version": "1.6.0",
      "resolved": "https://registry.npmjs.org/busboy/-/busboy-1.6.0.tgz",
      "integrity": "sha512-8SFQbg/0hQ9xy3UNTB0YEnsNBbWfhf7RtnzpL7TkBiTBRfrQ9Fxcnz7VJsleJpyp6rVLvXiuORqjlHi5q+PYuA==",
      "dependencies": {
        "streamsearch": "^1.1.0"
      },
      "engines": {
        "node": ">=10.16.0"
      }
    },
    "node_modules/bytes": {
      "version": "3.1.2",
      "resolved": "https://registry.npmjs.org/bytes/-/bytes-3.1.2.tgz",
      "integrity": "sha512-/Nf7TyzTx6S3yRJObOAV7956r8cr2+Oj8AC5dt8wSP3BQAoeX58NoHyCU8P8zGkNXStjTSi6fzO6F0pBdcYbEg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/call-bind-apply-helpers": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/call-bind-apply-helpers/-/call-bind-apply-helpers-1.0.2.tgz",
      "integrity": "sha512-Sp1ablJ0ivDkSzjcaJdxEunN5/XvksFJ2sMBFfq6x0ryhQV/2b/KwFe21cMpmHtPOSij8K99/wSfoEuTObmuMQ==",
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "function-bind": "^1.1.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/call-bound": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/call-bound/-/call-bound-1.0.4.tgz",
      "integrity": "sha512-+ys997U96po4Kx/ABpBCqhA9EuxJaQWDQg7295H4hBphv3IZg0boBKuwYpt4YXp6MZ5AmZQnU/tyMTlRpaSejg==",
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.2",
        "get-intrinsic": "^1.3.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/commander": {
      "version": "2.20.3",
      "resolved": "https://registry.npmjs.org/commander/-/commander-2.20.3.tgz",
      "integrity": "sha512-GpVkmM8vF2vQUkj2LvZmD35JxeJOLCwJ9cUkugyk2nuhbv3+mJvpLYYt+0+USMxE+oj+ey/lJEnhZw75x/OMcQ==",
      "license": "MIT"
    },
    "node_modules/concat-stream": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/concat-stream/-/concat-stream-2.0.0.tgz",
      "integrity": "sha512-MWufYdFw53ccGjCA+Ol7XJYpAlW6/prSMzuPOTRnJGcGzuhLn4Scrz7qf6o8bROZ514ltazcIFJZevcfbo0x7A==",
      "engines": [
        "node >= 6.0"
      ],
      "license": "MIT",
      "dependencies": {
        "buffer-from": "^1.0.0",
        "inherits": "^2.0.3",
        "readable-stream": "^3.0.2",
        "typedarray": "^0.0.6"
      }
    },
    "node_modules/content-disposition": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/content-disposition/-/content-disposition-1.0.1.tgz",
      "integrity": "sha512-oIXISMynqSqm241k6kcQ5UwttDILMK4BiurCfGEREw6+X9jkkpEe5T9FZaApyLGGOnFuyMWZpdolTXMtvEJ08Q==",
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/content-type": {
      "version": "1.0.5",
      "resolved": "https://registry.npmjs.org/content-type/-/content-type-1.0.5.tgz",
      "integrity": "sha512-nTjqfcBFEipKdXCv4YDQWCfmcLZKm81ldF0pAopTvyrFGVbcR6P/VAAd5G7N+0tTr8QqiU0tFadD6FK4NtJwOA==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/cookie": {
      "version": "0.7.2",
      "resolved": "https://registry.npmjs.org/cookie/-/cookie-0.7.2.tgz",
      "integrity": "sha512-yki5XnKuf750l50uGTllt6kKILY4nQ1eNIQatoXEByZ5dWgnKqbnqmTrBE5B4N7lrMJKQ2ytWMiTO2o0v6Ew/w==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/cookie-signature": {
      "version": "1.2.2",
      "resolved": "https://registry.npmjs.org/cookie-signature/-/cookie-signature-1.2.2.tgz",
      "integrity": "sha512-D76uU73ulSXrD1UXF4KE2TMxVVwhsnCgfAyTg9k8P6KGZjlXKrOLe4dJQKI3Bxi5wjesZoFXJWElNWBjPZMbhg==",
      "license": "MIT",
      "engines": {
        "node": ">=6.6.0"
      }
    },
    "node_modules/cors": {
      "version": "2.8.6",
      "resolved": "https://registry.npmjs.org/cors/-/cors-2.8.6.tgz",
      "integrity": "sha512-tJtZBBHA6vjIAaF6EnIaq6laBBP9aq/Y3ouVJjEfoHbRBcHBAHYcMh/w8LDrk2PvIMMq8gmopa5D4V8RmbrxGw==",
      "license": "MIT",
      "dependencies": {
        "object-assign": "^4",
        "vary": "^1"
      },
      "engines": {
        "node": ">= 0.10"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/cssfilter": {
      "version": "0.0.10",
      "resolved": "https://registry.npmjs.org/cssfilter/-/cssfilter-0.0.10.tgz",
      "integrity": "sha512-FAaLDaplstoRsDR8XGYH51znUN0UY7nMc6Z9/fvE8EXGwvJE9hu7W2vHwx1+bd6gCYnln9nLbzxFTrcO9YQDZw==",
      "license": "MIT"
    },
    "node_modules/debug": {
      "version": "4.4.3",
      "resolved": "https://registry.npmjs.org/debug/-/debug-4.4.3.tgz",
      "integrity": "sha512-RGwwWnwQvkVfavKVt22FGLw+xYSdzARwm0ru6DhTVA3umU5hZc28V3kO4stgYryrTlLpuvgI9GiijltAjNbcqA==",
      "license": "MIT",
      "dependencies": {
        "ms": "^2.1.3"
      },
      "engines": {
        "node": ">=6.0"
      },
      "peerDependenciesMeta": {
        "supports-color": {
          "optional": true
        }
      }
    },
    "node_modules/denque": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/denque/-/denque-2.1.0.tgz",
      "integrity": "sha512-HVQE3AAb/pxF8fQAoiqpvg9i3evqug3hoiwakOyZAwJm+6vZehbkYXZ0l4JxS+I3QxM97v5aaRNhj8v5oBhekw==",
      "license": "Apache-2.0",
      "engines": {
        "node": ">=0.10"
      }
    },
    "node_modules/depd": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/depd/-/depd-2.0.0.tgz",
      "integrity": "sha512-g7nH6P6dyDioJogAAGprGpCtVImJhpPk/roCzdb3fIh61/s/nPsfR6onyMwkCAR/OlC3yBC0lESvUoQEAssIrw==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/dotenv": {
      "version": "17.3.1",
      "resolved": "https://registry.npmjs.org/dotenv/-/dotenv-17.3.1.tgz",
      "integrity": "sha512-IO8C/dzEb6O3F9/twg6ZLXz164a2fhTnEWb95H23Dm4OuN+92NmEAlTrupP9VW6Jm3sO26tQlqyvyi4CsnY9GA==",
      "license": "BSD-2-Clause",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://dotenvx.com"
      }
    },
    "node_modules/dunder-proto": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/dunder-proto/-/dunder-proto-1.0.1.tgz",
      "integrity": "sha512-KIN/nDJBQRcXw0MLVhZE9iQHmG68qAVIBg9CqmUYjmQIhgij9U5MFvrqkUL5FbtyyzZuOeOt0zdeRe4UY7ct+A==",
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.1",
        "es-errors": "^1.3.0",
        "gopd": "^1.2.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/ecdsa-sig-formatter": {
      "version": "1.0.11",
      "resolved": "https://registry.npmjs.org/ecdsa-sig-formatter/-/ecdsa-sig-formatter-1.0.11.tgz",
      "integrity": "sha512-nagl3RYrbNv6kQkeJIpt6NJZy8twLB/2vtz6yN9Z4vRKHN4/QZJIEbqohALSgwKdnksuY3k5Addp5lg8sVoVcQ==",
      "license": "Apache-2.0",
      "dependencies": {
        "safe-buffer": "^5.0.1"
      }
    },
    "node_modules/ee-first": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/ee-first/-/ee-first-1.1.1.tgz",
      "integrity": "sha512-WMwm9LhRUo+WUaRN+vRuETqG89IgZphVSNkdFgeb6sS/E4OrDIN7t48CAewSHXc6C8lefD8KKfr5vY61brQlow==",
      "license": "MIT"
    },
    "node_modules/encodeurl": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/encodeurl/-/encodeurl-2.0.0.tgz",
      "integrity": "sha512-Q0n9HRi4m6JuGIV1eFlmvJB7ZEVxu93IrMyiMsGC0lrMJMWzRgx6WGquyfQgZVb31vhGgXnfmPNNXmxnOkRBrg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/es-define-property": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/es-define-property/-/es-define-property-1.0.1.tgz",
      "integrity": "sha512-e3nRfgfUZ4rNGL232gUgX06QNyyez04KdjFrF+LTRoOXmrOgFKDg4BCdsjW8EnT69eqdYGmRpJwiPVYNrCaW3g==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-errors": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/es-errors/-/es-errors-1.3.0.tgz",
      "integrity": "sha512-Zf5H2Kxt2xjTvbJvP2ZWLEICxA6j+hAmMzIlypy4xcBg1vKVnx89Wy0GbS+kf5cwCVFFzdCFh2XSCFNULS6csw==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-object-atoms": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/es-object-atoms/-/es-object-atoms-1.1.1.tgz",
      "integrity": "sha512-FGgH2h8zKNim9ljj7dankFPcICIK9Cp5bm+c2gQSYePhpaG5+esrLODihIorn+Pe6FGJzWhXQotPv73jTaldXA==",
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/escape-html": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/escape-html/-/escape-html-1.0.3.tgz",
      "integrity": "sha512-NiSupZ4OeuGwr68lGIeym/ksIZMJodUGOSCZ/FSnTxcrekbvqrgdUxlJOMpijaKZVjAJrWrGs/6Jy8OMuyj9ow==",
      "license": "MIT"
    },
    "node_modules/etag": {
      "version": "1.8.1",
      "resolved": "https://registry.npmjs.org/etag/-/etag-1.8.1.tgz",
      "integrity": "sha512-aIL5Fx7mawVa300al2BnEE4iNvo1qETxLrPI/o05L7z6go7fCw1J6EQmbK4FmJ2AS7kgVF/KEZWufBfdClMcPg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/express": {
      "version": "5.2.1",
      "resolved": "https://registry.npmjs.org/express/-/express-5.2.1.tgz",
      "integrity": "sha512-hIS4idWWai69NezIdRt2xFVofaF4j+6INOpJlVOLDO8zXGpUVEVzIYk12UUi2JzjEzWL3IOAxcTubgz9Po0yXw==",
      "license": "MIT",
      "dependencies": {
        "accepts": "^2.0.0",
        "body-parser": "^2.2.1",
        "content-disposition": "^1.0.0",
        "content-type": "^1.0.5",
        "cookie": "^0.7.1",
        "cookie-signature": "^1.2.1",
        "debug": "^4.4.0",
        "depd": "^2.0.0",
        "encodeurl": "^2.0.0",
        "escape-html": "^1.0.3",
        "etag": "^1.8.1",
        "finalhandler": "^2.1.0",
        "fresh": "^2.0.0",
        "http-errors": "^2.0.0",
        "merge-descriptors": "^2.0.0",
        "mime-types": "^3.0.0",
        "on-finished": "^2.4.1",
        "once": "^1.4.0",
        "parseurl": "^1.3.3",
        "proxy-addr": "^2.0.7",
        "qs": "^6.14.0",
        "range-parser": "^1.2.1",
        "router": "^2.2.0",
        "send": "^1.1.0",
        "serve-static": "^2.2.0",
        "statuses": "^2.0.1",
        "type-is": "^2.0.1",
        "vary": "^1.1.2"
      },
      "engines": {
        "node": ">= 18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/express-rate-limit": {
      "version": "8.6.0",
      "resolved": "https://registry.npmjs.org/express-rate-limit/-/express-rate-limit-8.6.0.tgz",
      "integrity": "sha512-XKJXDsASUOo0LLtFwW5hCcQGH0N4WQc/Rn8/Pvoia+TJFOkkFPvrtW9lZOeeNcxQJspvOIERMwiRLsVFlhHEkA==",
      "license": "MIT",
      "dependencies": {
        "debug": "^4.4.3",
        "ip-address": "^10.2.0"
      },
      "engines": {
        "node": ">= 16"
      },
      "funding": {
        "url": "https://github.com/sponsors/express-rate-limit"
      },
      "peerDependencies": {
        "express": ">= 4.11"
      }
    },
    "node_modules/express-validator": {
      "version": "7.3.1",
      "resolved": "https://registry.npmjs.org/express-validator/-/express-validator-7.3.1.tgz",
      "integrity": "sha512-IGenaSf+DnWc69lKuqlRE9/i/2t5/16VpH5bXoqdxWz1aCpRvEdrBuu1y95i/iL5QP8ZYVATiwLFhwk3EDl5vg==",
      "license": "MIT",
      "dependencies": {
        "lodash": "^4.17.21",
        "validator": "~13.15.23"
      },
      "engines": {
        "node": ">= 8.0.0"
      }
    },
    "node_modules/finalhandler": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/finalhandler/-/finalhandler-2.1.1.tgz",
      "integrity": "sha512-S8KoZgRZN+a5rNwqTxlZZePjT/4cnm0ROV70LedRHZ0p8u9fRID0hJUZQpkKLzro8LfmC8sx23bY6tVNxv8pQA==",
      "license": "MIT",
      "dependencies": {
        "debug": "^4.4.0",
        "encodeurl": "^2.0.0",
        "escape-html": "^1.0.3",
        "on-finished": "^2.4.1",
        "parseurl": "^1.3.3",
        "statuses": "^2.0.1"
      },
      "engines": {
        "node": ">= 18.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/forwarded": {
      "version": "0.2.0",
      "resolved": "https://registry.npmjs.org/forwarded/-/forwarded-0.2.0.tgz",
      "integrity": "sha512-buRG0fpBtRHSTCOASe6hD258tEubFoRLb4ZNA6NxMVHNw2gOcwHo9wyablzMzOA5z9xA9L1KNjk/Nt6MT9aYow==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/fresh": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/fresh/-/fresh-2.0.0.tgz",
      "integrity": "sha512-Rx/WycZ60HOaqLKAi6cHRKKI7zxWbJ31MhntmtwMoaTeF7XFH9hhBp8vITaMidfljRQ6eYWCKkaTK+ykVJHP2A==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/function-bind": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/function-bind/-/function-bind-1.1.2.tgz",
      "integrity": "sha512-7XHNxH7qX9xG5mIwxkhumTox/MIRNcOgDrxWsMt2pAr23WHp6MrRlN7FBSFpCpr+oVO0F744iUgR82nJMfG2SA==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/generate-function": {
      "version": "2.3.1",
      "resolved": "https://registry.npmjs.org/generate-function/-/generate-function-2.3.1.tgz",
      "integrity": "sha512-eeB5GfMNeevm/GRYq20ShmsaGcmI81kIX2K9XQx5miC8KdHaC6Jm0qQ8ZNeGOi7wYB8OsdxKs+Y2oVuTFuVwKQ==",
      "license": "MIT",
      "dependencies": {
        "is-property": "^1.0.2"
      }
    },
    "node_modules/get-intrinsic": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/get-intrinsic/-/get-intrinsic-1.3.0.tgz",
      "integrity": "sha512-9fSjSaos/fRIVIp+xSJlE6lfwhES7LNtKaCBIamHsjr2na1BiABJPo0mOjjz8GJDURarmCPGqaiVg5mfjb98CQ==",
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.2",
        "es-define-property": "^1.0.1",
        "es-errors": "^1.3.0",
        "es-object-atoms": "^1.1.1",
        "function-bind": "^1.1.2",
        "get-proto": "^1.0.1",
        "gopd": "^1.2.0",
        "has-symbols": "^1.1.0",
        "hasown": "^2.0.2",
        "math-intrinsics": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/get-proto": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/get-proto/-/get-proto-1.0.1.tgz",
      "integrity": "sha512-sTSfBjoXBp89JvIKIefqw7U2CCebsc74kiY6awiGogKtoSGbgjYE/G/+l9sF3MWFPNc9IcoOC4ODfKHfxFmp0g==",
      "license": "MIT",
      "dependencies": {
        "dunder-proto": "^1.0.1",
        "es-object-atoms": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/gopd": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/gopd/-/gopd-1.2.0.tgz",
      "integrity": "sha512-ZUKRh6/kUFoAiTAtTYPZJ3hw9wNxx+BIBOijnlG9PnrJsCcSjs1wyyD6vJpaYtgnzDrKYRSqf3OO6Rfa93xsRg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/has-symbols": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/has-symbols/-/has-symbols-1.1.0.tgz",
      "integrity": "sha512-1cDNdwJ2Jaohmb3sg4OmKaMBwuC48sYni5HUw2DvsC8LjGTLK9h+eb1X6RyuOHe4hT0ULCW68iomhjUoKUqlPQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/hasown": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/hasown/-/hasown-2.0.2.tgz",
      "integrity": "sha512-0hJU9SCPvmMzIBdZFqNPXWa6dqh7WdH0cII9y+CyS8rG3nL48Bclra9HmKhVVUHyPWNH5Y7xDwAB7bfgSjkUMQ==",
      "license": "MIT",
      "dependencies": {
        "function-bind": "^1.1.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/http-errors": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/http-errors/-/http-errors-2.0.1.tgz",
      "integrity": "sha512-4FbRdAX+bSdmo4AUFuS0WNiPz8NgFt+r8ThgNWmlrjQjt1Q7ZR9+zTlce2859x4KSXrwIsaeTqDoKQmtP8pLmQ==",
      "license": "MIT",
      "dependencies": {
        "depd": "~2.0.0",
        "inherits": "~2.0.4",
        "setprototypeof": "~1.2.0",
        "statuses": "~2.0.2",
        "toidentifier": "~1.0.1"
      },
      "engines": {
        "node": ">= 0.8"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/iconv-lite": {
      "version": "0.7.2",
      "resolved": "https://registry.npmjs.org/iconv-lite/-/iconv-lite-0.7.2.tgz",
      "integrity": "sha512-im9DjEDQ55s9fL4EYzOAv0yMqmMBSZp6G0VvFyTMPKWxiSBHUj9NW/qqLmXUwXrrM7AvqSlTCfvqRb0cM8yYqw==",
      "license": "MIT",
      "dependencies": {
        "safer-buffer": ">= 2.1.2 < 3.0.0"
      },
      "engines": {
        "node": ">=0.10.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/inherits": {
      "version": "2.0.4",
      "resolved": "https://registry.npmjs.org/inherits/-/inherits-2.0.4.tgz",
      "integrity": "sha512-k/vGaX4/Yla3WzyMCvTQOXYeIHvqOKtnqBduzTHpzpQZzAskKMhZ2K+EnBiSM9zGSoIFeMpXKxa4dYeZIQqewQ==",
      "license": "ISC"
    },
    "node_modules/ip-address": {
      "version": "10.2.0",
      "resolved": "https://registry.npmjs.org/ip-address/-/ip-address-10.2.0.tgz",
      "integrity": "sha512-/+S6j4E9AHvW9SWMSEY9Xfy66O5PWvVEJ08O0y5JGyEKQpojb0K0GKpz/v5HJ/G0vi3D2sjGK78119oXZeE0qA==",
      "license": "MIT",
      "engines": {
        "node": ">= 12"
      }
    },
    "node_modules/ipaddr.js": {
      "version": "1.9.1",
      "resolved": "https://registry.npmjs.org/ipaddr.js/-/ipaddr.js-1.9.1.tgz",
      "integrity": "sha512-0KI/607xoxSToH7GjN1FfSbLoU0+btTicjsQSWQlh/hZykN8KpmMf7uYwPW3R+akZ6R/w18ZlXSHBYXiYUPO3g==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.10"
      }
    },
    "node_modules/is-promise": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/is-promise/-/is-promise-4.0.0.tgz",
      "integrity": "sha512-hvpoI6korhJMnej285dSg6nu1+e6uxs7zG3BYAm5byqDsgJNWwxzM6z6iZiAgQR4TJ30JmBTOwqZUw3WlyH3AQ==",
      "license": "MIT"
    },
    "node_modules/is-property": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/is-property/-/is-property-1.0.2.tgz",
      "integrity": "sha512-Ks/IoX00TtClbGQr4TWXemAnktAQvYB7HzcCxDGqEZU6oCmb2INHuOoKxbtR+HFkmYWBKv/dOZtGRiAjDhj92g==",
      "license": "MIT"
    },
    "node_modules/jsonwebtoken": {
      "version": "9.0.3",
      "resolved": "https://registry.npmjs.org/jsonwebtoken/-/jsonwebtoken-9.0.3.tgz",
      "integrity": "sha512-MT/xP0CrubFRNLNKvxJ2BYfy53Zkm++5bX9dtuPbqAeQpTVe0MQTFhao8+Cp//EmJp244xt6Drw/GVEGCUj40g==",
      "license": "MIT",
      "dependencies": {
        "jws": "^4.0.1",
        "lodash.includes": "^4.3.0",
        "lodash.isboolean": "^3.0.3",
        "lodash.isinteger": "^4.0.4",
        "lodash.isnumber": "^3.0.3",
        "lodash.isplainobject": "^4.0.6",
        "lodash.isstring": "^4.0.1",
        "lodash.once": "^4.0.0",
        "ms": "^2.1.1",
        "semver": "^7.5.4"
      },
      "engines": {
        "node": ">=12",
        "npm": ">=6"
      }
    },
    "node_modules/jwa": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/jwa/-/jwa-2.0.1.tgz",
      "integrity": "sha512-hRF04fqJIP8Abbkq5NKGN0Bbr3JxlQ+qhZufXVr0DvujKy93ZCbXZMHDL4EOtodSbCWxOqR8MS1tXA5hwqCXDg==",
      "license": "MIT",
      "dependencies": {
        "buffer-equal-constant-time": "^1.0.1",
        "ecdsa-sig-formatter": "1.0.11",
        "safe-buffer": "^5.0.1"
      }
    },
    "node_modules/jws": {
      "version": "4.0.1",
      "resolved": "https://registry.npmjs.org/jws/-/jws-4.0.1.tgz",
      "integrity": "sha512-EKI/M/yqPncGUUh44xz0PxSidXFr/+r0pA70+gIYhjv+et7yxM+s29Y+VGDkovRofQem0fs7Uvf4+YmAdyRduA==",
      "license": "MIT",
      "dependencies": {
        "jwa": "^2.0.1",
        "safe-buffer": "^5.0.1"
      }
    },
    "node_modules/lodash": {
      "version": "4.17.23",
      "resolved": "https://registry.npmjs.org/lodash/-/lodash-4.17.23.tgz",
      "integrity": "sha512-LgVTMpQtIopCi79SJeDiP0TfWi5CNEc/L/aRdTh3yIvmZXTnheWpKjSZhnvMl8iXbC1tFg9gdHHDMLoV7CnG+w==",
      "license": "MIT"
    },
    "node_modules/lodash.includes": {
      "version": "4.3.0",
      "resolved": "https://registry.npmjs.org/lodash.includes/-/lodash.includes-4.3.0.tgz",
      "integrity": "sha512-W3Bx6mdkRTGtlJISOvVD/lbqjTlPPUDTMnlXZFnVwi9NKJ6tiAk6LVdlhZMm17VZisqhKcgzpO5Wz91PCt5b0w==",
      "license": "MIT"
    },
    "node_modules/lodash.isboolean": {
      "version": "3.0.3",
      "resolved": "https://registry.npmjs.org/lodash.isboolean/-/lodash.isboolean-3.0.3.tgz",
      "integrity": "sha512-Bz5mupy2SVbPHURB98VAcw+aHh4vRV5IPNhILUCsOzRmsTmSQ17jIuqopAentWoehktxGd9e/hbIXq980/1QJg==",
      "license": "MIT"
    },
    "node_modules/lodash.isinteger": {
      "version": "4.0.4",
      "resolved": "https://registry.npmjs.org/lodash.isinteger/-/lodash.isinteger-4.0.4.tgz",
      "integrity": "sha512-DBwtEWN2caHQ9/imiNeEA5ys1JoRtRfY3d7V9wkqtbycnAmTvRRmbHKDV4a0EYc678/dia0jrte4tjYwVBaZUA==",
      "license": "MIT"
    },
    "node_modules/lodash.isnumber": {
      "version": "3.0.3",
      "resolved": "https://registry.npmjs.org/lodash.isnumber/-/lodash.isnumber-3.0.3.tgz",
      "integrity": "sha512-QYqzpfwO3/CWf3XP+Z+tkQsfaLL/EnUlXWVkIk5FUPc4sBdTehEqZONuyRt2P67PXAk+NXmTBcc97zw9t1FQrw==",
      "license": "MIT"
    },
    "node_modules/lodash.isplainobject": {
      "version": "4.0.6",
      "resolved": "https://registry.npmjs.org/lodash.isplainobject/-/lodash.isplainobject-4.0.6.tgz",
      "integrity": "sha512-oSXzaWypCMHkPC3NvBEaPHf0KsA5mvPrOPgQWDsbg8n7orZ290M0BmC/jgRZ4vcJ6DTAhjrsSYgdsW/F+MFOBA==",
      "license": "MIT"
    },
    "node_modules/lodash.isstring": {
      "version": "4.0.1",
      "resolved": "https://registry.npmjs.org/lodash.isstring/-/lodash.isstring-4.0.1.tgz",
      "integrity": "sha512-0wJxfxH1wgO3GrbuP+dTTk7op+6L41QCXbGINEmD+ny/G/eCqGzxyCsh7159S+mgDDcoarnBw6PC1PS5+wUGgw==",
      "license": "MIT"
    },
    "node_modules/lodash.once": {
      "version": "4.1.1",
      "resolved": "https://registry.npmjs.org/lodash.once/-/lodash.once-4.1.1.tgz",
      "integrity": "sha512-Sb487aTOCr9drQVL8pIxOzVhafOjZN9UU54hiN8PU3uAiSV7lx1yYNpbNmex2PK6dSJoNTSJUUswT651yww3Mg==",
      "license": "MIT"
    },
    "node_modules/long": {
      "version": "5.3.2",
      "resolved": "https://registry.npmjs.org/long/-/long-5.3.2.tgz",
      "integrity": "sha512-mNAgZ1GmyNhD7AuqnTG3/VQ26o760+ZYBPKjPvugO8+nLbYfX6TVpJPseBvopbdY+qpZ/lKUnmEc1LeZYS3QAA==",
      "license": "Apache-2.0"
    },
    "node_modules/lru.min": {
      "version": "1.1.4",
      "resolved": "https://registry.npmjs.org/lru.min/-/lru.min-1.1.4.tgz",
      "integrity": "sha512-DqC6n3QQ77zdFpCMASA1a3Jlb64Hv2N2DciFGkO/4L9+q/IpIAuRlKOvCXabtRW6cQf8usbmM6BE/TOPysCdIA==",
      "license": "MIT",
      "engines": {
        "bun": ">=1.0.0",
        "deno": ">=1.30.0",
        "node": ">=8.0.0"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/wellwelwel"
      }
    },
    "node_modules/math-intrinsics": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/math-intrinsics/-/math-intrinsics-1.1.0.tgz",
      "integrity": "sha512-/IXtbwEk5HTPyEwyKX6hGkYXxM9nbj64B+ilVJnC/R6B0pH5G4V3b0pVbL7DBj4tkhBAppbQUlf6F6Xl9LHu1g==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/media-typer": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/media-typer/-/media-typer-1.1.0.tgz",
      "integrity": "sha512-aisnrDP4GNe06UcKFnV5bfMNPBUw4jsLGaWwWfnH3v02GnBuXX2MCVn5RbrWo0j3pczUilYblq7fQ7Nw2t5XKw==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/merge-descriptors": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/merge-descriptors/-/merge-descriptors-2.0.0.tgz",
      "integrity": "sha512-Snk314V5ayFLhp3fkUREub6WtjBfPdCPY1Ln8/8munuLuiYhsABgBVWsozAG+MWMbVEvcdcpbi9R7ww22l9Q3g==",
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/mime-db": {
      "version": "1.54.0",
      "resolved": "https://registry.npmjs.org/mime-db/-/mime-db-1.54.0.tgz",
      "integrity": "sha512-aU5EJuIN2WDemCcAp2vFBfp/m4EAhWJnUNSSw0ixs7/kXbd6Pg64EmwJkNdFhB8aWt1sH2CTXrLxo/iAGV3oPQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/mime-types": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/mime-types/-/mime-types-3.0.2.tgz",
      "integrity": "sha512-Lbgzdk0h4juoQ9fCKXW4by0UJqj+nOOrI9MJ1sSj4nI8aI2eo1qmvQEie4VD1glsS250n15LsWsYtCugiStS5A==",
      "license": "MIT",
      "dependencies": {
        "mime-db": "^1.54.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/ms": {
      "version": "2.1.3",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
      "license": "MIT"
    },
    "node_modules/multer": {
      "version": "2.2.0",
      "resolved": "https://registry.npmjs.org/multer/-/multer-2.2.0.tgz",
      "integrity": "sha512-6rdyFg2kLrMh9Jee7/BMPuV9lEAd7lLW2YUpF9/YxR7njyoUwwQ0ZPh3TaIY50Sw6vlyD2HW3wGOkTS4P79xrQ==",
      "license": "MIT",
      "dependencies": {
        "append-field": "^1.0.0",
        "busboy": "^1.6.0",
        "concat-stream": "^2.0.0",
        "type-is": "^1.6.18"
      },
      "engines": {
        "node": ">= 10.16.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/multer/node_modules/media-typer": {
      "version": "0.3.0",
      "resolved": "https://registry.npmjs.org/media-typer/-/media-typer-0.3.0.tgz",
      "integrity": "sha512-dq+qelQ9akHpcOl/gUVRTxVIOkAJ1wR3QAvb4RsVjS8oVoFjDGTc679wJYmUmknUF5HwMLOgb5O+a3KxfWapPQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/multer/node_modules/mime-db": {
      "version": "1.52.0",
      "resolved": "https://registry.npmjs.org/mime-db/-/mime-db-1.52.0.tgz",
      "integrity": "sha512-sPU4uV7dYlvtWJxwwxHD0PuihVNiE7TyAbQ5SWxDCB9mUYvOgroQOwYQQOKPJ8CIbE+1ETVlOoK1UC2nU3gYvg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/multer/node_modules/mime-types": {
      "version": "2.1.35",
      "resolved": "https://registry.npmjs.org/mime-types/-/mime-types-2.1.35.tgz",
      "integrity": "sha512-ZDY+bPm5zTTF+YpCrAU9nK0UgICYPT0QtT1NZWFv4s++TNkcgVaT0g6+4R2uI4MjQjzysHB1zxuWL50hzaeXiw==",
      "license": "MIT",
      "dependencies": {
        "mime-db": "1.52.0"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/multer/node_modules/type-is": {
      "version": "1.6.18",
      "resolved": "https://registry.npmjs.org/type-is/-/type-is-1.6.18.tgz",
      "integrity": "sha512-TkRKr9sUTxEH8MdfuCSP7VizJyzRNMjj2J2do2Jr3Kym598JVdEksuzPQCnlFPW4ky9Q+iA+ma9BGm06XQBy8g==",
      "license": "MIT",
      "dependencies": {
        "media-typer": "0.3.0",
        "mime-types": "~2.1.24"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/mysql2": {
      "version": "3.20.0",
      "resolved": "https://registry.npmjs.org/mysql2/-/mysql2-3.20.0.tgz",
      "integrity": "sha512-eCLUs7BNbgA6nf/MZXsaBO1SfGs0LtLVrJD3WeWq+jPLDWkSufTD+aGMwykfUVPdZnblaUK1a8G/P63cl9FkKg==",
      "license": "MIT",
      "dependencies": {
        "aws-ssl-profiles": "^1.1.2",
        "denque": "^2.1.0",
        "generate-function": "^2.3.1",
        "iconv-lite": "^0.7.2",
        "long": "^5.3.2",
        "lru.min": "^1.1.4",
        "named-placeholders": "^1.1.6",
        "sql-escaper": "^1.3.3"
      },
      "engines": {
        "node": ">= 8.0"
      },
      "peerDependencies": {
        "@types/node": ">= 8"
      }
    },
    "node_modules/named-placeholders": {
      "version": "1.1.6",
      "resolved": "https://registry.npmjs.org/named-placeholders/-/named-placeholders-1.1.6.tgz",
      "integrity": "sha512-Tz09sEL2EEuv5fFowm419c1+a/jSMiBjI9gHxVLrVdbUkkNUUfjsVYs9pVZu5oCon/kmRh9TfLEObFtkVxmY0w==",
      "license": "MIT",
      "dependencies": {
        "lru.min": "^1.1.0"
      },
      "engines": {
        "node": ">=8.0.0"
      }
    },
    "node_modules/negotiator": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/negotiator/-/negotiator-1.0.0.tgz",
      "integrity": "sha512-8Ofs/AUQh8MaEcrlq5xOX0CQ9ypTF5dl78mjlMNfOK08fzpgTHQRQPBxcPlEtIw0yRpws+Zo/3r+5WRby7u3Gg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/node-addon-api": {
      "version": "8.6.0",
      "resolved": "https://registry.npmjs.org/node-addon-api/-/node-addon-api-8.6.0.tgz",
      "integrity": "sha512-gBVjCaqDlRUk0EwoPNKzIr9KkS9041G/q31IBShPs1Xz6UTA+EXdZADbzqAJQrpDRq71CIMnOP5VMut3SL0z5Q==",
      "license": "MIT",
      "engines": {
        "node": "^18 || ^20 || >= 21"
      }
    },
    "node_modules/node-gyp-build": {
      "version": "4.8.4",
      "resolved": "https://registry.npmjs.org/node-gyp-build/-/node-gyp-build-4.8.4.tgz",
      "integrity": "sha512-LA4ZjwlnUblHVgq0oBF3Jl/6h/Nvs5fzBLwdEF4nuxnFdsfajde4WfxtJr3CaiH+F6ewcIB/q4jQ4UzPyid+CQ==",
      "license": "MIT",
      "bin": {
        "node-gyp-build": "bin.js",
        "node-gyp-build-optional": "optional.js",
        "node-gyp-build-test": "build-test.js"
      }
    },
    "node_modules/object-assign": {
      "version": "4.1.1",
      "resolved": "https://registry.npmjs.org/object-assign/-/object-assign-4.1.1.tgz",
      "integrity": "sha512-rJgTQnkUnH1sFw8yT6VSU3zD3sWmu6sZhIseY8VX+GRu3P6F7Fu+JNDoXfklElbLJSnc3FUQHVe4cU5hj+BcUg==",
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/object-inspect": {
      "version": "1.13.4",
      "resolved": "https://registry.npmjs.org/object-inspect/-/object-inspect-1.13.4.tgz",
      "integrity": "sha512-W67iLl4J2EXEGTbfeHCffrjDfitvLANg0UlX3wFUUSTx92KXRFegMHUVgSqE+wvhAbi4WqjGg9czysTV2Epbew==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/on-finished": {
      "version": "2.4.1",
      "resolved": "https://registry.npmjs.org/on-finished/-/on-finished-2.4.1.tgz",
      "integrity": "sha512-oVlzkg3ENAhCk2zdv7IJwd/QUD4z2RxRwpkcGY8psCVcCYZNq4wYnVWALHM+brtuJjePWiYF/ClmuDr8Ch5+kg==",
      "license": "MIT",
      "dependencies": {
        "ee-first": "1.1.1"
      },
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/once": {
      "version": "1.4.0",
      "resolved": "https://registry.npmjs.org/once/-/once-1.4.0.tgz",
      "integrity": "sha512-lNaJgI+2Q5URQBkccEKHTQOPaXdUxnZZElQTZY0MFUAuaEqe1E+Nyvgdz/aIyNi6Z9MzO5dv1H8n58/GELp3+w==",
      "license": "ISC",
      "dependencies": {
        "wrappy": "1"
      }
    },
    "node_modules/parseurl": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/parseurl/-/parseurl-1.3.3.tgz",
      "integrity": "sha512-CiyeOxFT/JZyN5m0z9PfXw4SCBJ6Sygz1Dpl0wqjlhDEGGBP1GnsUVEL0p63hoG1fcj3fHynXi9NYO4nWOL+qQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/path-to-regexp": {
      "version": "8.3.0",
      "resolved": "https://registry.npmjs.org/path-to-regexp/-/path-to-regexp-8.3.0.tgz",
      "integrity": "sha512-7jdwVIRtsP8MYpdXSwOS0YdD0Du+qOoF/AEPIt88PcCFrZCzx41oxku1jD88hZBwbNUIEfpqvuhjFaMAqMTWnA==",
      "license": "MIT",
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/proxy-addr": {
      "version": "2.0.7",
      "resolved": "https://registry.npmjs.org/proxy-addr/-/proxy-addr-2.0.7.tgz",
      "integrity": "sha512-llQsMLSUDUPT44jdrU/O37qlnifitDP+ZwrmmZcoSKyLKvtZxpyV0n2/bD/N4tBAAZ/gJEdZU7KMraoK1+XYAg==",
      "license": "MIT",
      "dependencies": {
        "forwarded": "0.2.0",
        "ipaddr.js": "1.9.1"
      },
      "engines": {
        "node": ">= 0.10"
      }
    },
    "node_modules/qs": {
      "version": "6.15.0",
      "resolved": "https://registry.npmjs.org/qs/-/qs-6.15.0.tgz",
      "integrity": "sha512-mAZTtNCeetKMH+pSjrb76NAM8V9a05I9aBZOHztWy/UqcJdQYNsf59vrRKWnojAT9Y+GbIvoTBC++CPHqpDBhQ==",
      "license": "BSD-3-Clause",
      "dependencies": {
        "side-channel": "^1.1.0"
      },
      "engines": {
        "node": ">=0.6"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/range-parser": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/range-parser/-/range-parser-1.2.1.tgz",
      "integrity": "sha512-Hrgsx+orqoygnmhFbKaHE6c296J+HTAQXoxEF6gNupROmmGJRoyzfG3ccAveqCBrwr/2yxQ5BVd/GTl5agOwSg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/raw-body": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/raw-body/-/raw-body-3.0.2.tgz",
      "integrity": "sha512-K5zQjDllxWkf7Z5xJdV0/B0WTNqx6vxG70zJE4N0kBs4LovmEYWJzQGxC9bS9RAKu3bgM40lrd5zoLJ12MQ5BA==",
      "license": "MIT",
      "dependencies": {
        "bytes": "~3.1.2",
        "http-errors": "~2.0.1",
        "iconv-lite": "~0.7.0",
        "unpipe": "~1.0.0"
      },
      "engines": {
        "node": ">= 0.10"
      }
    },
    "node_modules/readable-stream": {
      "version": "3.6.2",
      "resolved": "https://registry.npmjs.org/readable-stream/-/readable-stream-3.6.2.tgz",
      "integrity": "sha512-9u/sniCrY3D5WdsERHzHE4G2YCXqoG5FTHUiCC4SIbr6XcLZBY05ya9EKjYek9O5xOAwjGq+1JdGBAS7Q9ScoA==",
      "license": "MIT",
      "dependencies": {
        "inherits": "^2.0.3",
        "string_decoder": "^1.1.1",
        "util-deprecate": "^1.0.1"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/router": {
      "version": "2.2.0",
      "resolved": "https://registry.npmjs.org/router/-/router-2.2.0.tgz",
      "integrity": "sha512-nLTrUKm2UyiL7rlhapu/Zl45FwNgkZGaCpZbIHajDYgwlJCOzLSk+cIPAnsEqV955GjILJnKbdQC1nVPz+gAYQ==",
      "license": "MIT",
      "dependencies": {
        "debug": "^4.4.0",
        "depd": "^2.0.0",
        "is-promise": "^4.0.0",
        "parseurl": "^1.3.3",
        "path-to-regexp": "^8.0.0"
      },
      "engines": {
        "node": ">= 18"
      }
    },
    "node_modules/safe-buffer": {
      "version": "5.2.1",
      "resolved": "https://registry.npmjs.org/safe-buffer/-/safe-buffer-5.2.1.tgz",
      "integrity": "sha512-rp3So07KcdmmKbGvgaNxQSJr7bGVSVk5S9Eq1F+ppbRo70+YeaDxkw5Dd8NPN+GD6bjnYm2VuPuCXmpuYvmCXQ==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ],
      "license": "MIT"
    },
    "node_modules/safer-buffer": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/safer-buffer/-/safer-buffer-2.1.2.tgz",
      "integrity": "sha512-YZo3K82SD7Riyi0E1EQPojLz7kpepnSQI9IyPbHHg1XXXevb5dJI7tpyN2ADxGcQbHG7vcyRHk0cbwqcQriUtg==",
      "license": "MIT"
    },
    "node_modules/semver": {
      "version": "7.7.4",
      "resolved": "https://registry.npmjs.org/semver/-/semver-7.7.4.tgz",
      "integrity": "sha512-vFKC2IEtQnVhpT78h1Yp8wzwrf8CM+MzKMHGJZfBtzhZNycRFnXsHk6E5TxIkkMsgNS7mdX3AGB7x2QM2di4lA==",
      "license": "ISC",
      "bin": {
        "semver": "bin/semver.js"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/send": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/send/-/send-1.2.1.tgz",
      "integrity": "sha512-1gnZf7DFcoIcajTjTwjwuDjzuz4PPcY2StKPlsGAQ1+YH20IRVrBaXSWmdjowTJ6u8Rc01PoYOGHXfP1mYcZNQ==",
      "license": "MIT",
      "dependencies": {
        "debug": "^4.4.3",
        "encodeurl": "^2.0.0",
        "escape-html": "^1.0.3",
        "etag": "^1.8.1",
        "fresh": "^2.0.0",
        "http-errors": "^2.0.1",
        "mime-types": "^3.0.2",
        "ms": "^2.1.3",
        "on-finished": "^2.4.1",
        "range-parser": "^1.2.1",
        "statuses": "^2.0.2"
      },
      "engines": {
        "node": ">= 18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/serve-static": {
      "version": "2.2.1",
      "resolved": "https://registry.npmjs.org/serve-static/-/serve-static-2.2.1.tgz",
      "integrity": "sha512-xRXBn0pPqQTVQiC8wyQrKs2MOlX24zQ0POGaj0kultvoOCstBQM5yvOhAVSUwOMjQtTvsPWoNCHfPGwaaQJhTw==",
      "license": "MIT",
      "dependencies": {
        "encodeurl": "^2.0.0",
        "escape-html": "^1.0.3",
        "parseurl": "^1.3.3",
        "send": "^1.2.0"
      },
      "engines": {
        "node": ">= 18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/setprototypeof": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/setprototypeof/-/setprototypeof-1.2.0.tgz",
      "integrity": "sha512-E5LDX7Wrp85Kil5bhZv46j8jOeboKq5JMmYM3gVGdGH8xFpPWXUMsNrlODCrkoxMEeNi/XZIwuRvY4XNwYMJpw==",
      "license": "ISC"
    },
    "node_modules/side-channel": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/side-channel/-/side-channel-1.1.0.tgz",
      "integrity": "sha512-ZX99e6tRweoUXqR+VBrslhda51Nh5MTQwou5tnUDgbtyM0dBgmhEDtWGP/xbKn6hqfPRHujUNwz5fy/wbbhnpw==",
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "object-inspect": "^1.13.3",
        "side-channel-list": "^1.0.0",
        "side-channel-map": "^1.0.1",
        "side-channel-weakmap": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/side-channel-list": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/side-channel-list/-/side-channel-list-1.0.0.tgz",
      "integrity": "sha512-FCLHtRD/gnpCiCHEiJLOwdmFP+wzCmDEkc9y7NsYxeF4u7Btsn1ZuwgwJGxImImHicJArLP4R0yX4c2KCrMrTA==",
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "object-inspect": "^1.13.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/side-channel-map": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/side-channel-map/-/side-channel-map-1.0.1.tgz",
      "integrity": "sha512-VCjCNfgMsby3tTdo02nbjtM/ewra6jPHmpThenkTYh8pG9ucZ/1P8So4u4FGBek/BjpOVsDCMoLA/iuBKIFXRA==",
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "es-errors": "^1.3.0",
        "get-intrinsic": "^1.2.5",
        "object-inspect": "^1.13.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/side-channel-weakmap": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/side-channel-weakmap/-/side-channel-weakmap-1.0.2.tgz",
      "integrity": "sha512-WPS/HvHQTYnHisLo9McqBHOJk2FkHO/tlpvldyrnem4aeQp4hai3gythswg6p01oSoTl58rcpiFAjF2br2Ak2A==",
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "es-errors": "^1.3.0",
        "get-intrinsic": "^1.2.5",
        "object-inspect": "^1.13.3",
        "side-channel-map": "^1.0.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/sql-escaper": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/sql-escaper/-/sql-escaper-1.3.3.tgz",
      "integrity": "sha512-BsTCV265VpTp8tm1wyIm1xqQCS+Q9NHx2Sr+WcnUrgLrQ6yiDIvHYJV5gHxsj1lMBy2zm5twLaZao8Jd+S8JJw==",
      "license": "MIT",
      "engines": {
        "bun": ">=1.0.0",
        "deno": ">=2.0.0",
        "node": ">=12.0.0"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/mysqljs/sql-escaper?sponsor=1"
      }
    },
    "node_modules/statuses": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/statuses/-/statuses-2.0.2.tgz",
      "integrity": "sha512-DvEy55V3DB7uknRo+4iOGT5fP1slR8wQohVdknigZPMpMstaKJQWhwiYBACJE3Ul2pTnATihhBYnRhZQHGBiRw==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/streamsearch": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/streamsearch/-/streamsearch-1.1.0.tgz",
      "integrity": "sha512-Mcc5wHehp9aXz1ax6bZUyY5afg9u2rv5cqQI3mRrYkGC8rW2hM02jWuwjtL++LS5qinSyhj2QfLyNsuc+VsExg==",
      "engines": {
        "node": ">=10.0.0"
      }
    },
    "node_modules/string_decoder": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/string_decoder/-/string_decoder-1.3.0.tgz",
      "integrity": "sha512-hkRX8U1WjJFd8LsDJ2yQ/wWWxaopEsABU1XfkM8A+j0+85JAGppt16cr1Whg6KIbb4okU6Mql6BOj+uup/wKeA==",
      "license": "MIT",
      "dependencies": {
        "safe-buffer": "~5.2.0"
      }
    },
    "node_modules/toidentifier": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/toidentifier/-/toidentifier-1.0.1.tgz",
      "integrity": "sha512-o5sSPKEkg/DIQNmH43V0/uerLrpzVedkUh8tGNvaeXpfpuwjKenlSox/2O/BTlZUtEe+JG7s5YhEz608PlAHRA==",
      "license": "MIT",
      "engines": {
        "node": ">=0.6"
      }
    },
    "node_modules/type-is": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/type-is/-/type-is-2.0.1.tgz",
      "integrity": "sha512-OZs6gsjF4vMp32qrCbiVSkrFmXtG/AZhY3t0iAMrMBiAZyV9oALtXO8hsrHbMXF9x6L3grlFuwW2oAz7cav+Gw==",
      "license": "MIT",
      "dependencies": {
        "content-type": "^1.0.5",
        "media-typer": "^1.1.0",
        "mime-types": "^3.0.0"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/typedarray": {
      "version": "0.0.6",
      "resolved": "https://registry.npmjs.org/typedarray/-/typedarray-0.0.6.tgz",
      "integrity": "sha512-/aCDEGatGvZ2BIk+HmLf4ifCJFwvKFNb9/JeZPMulfgFracn9QFcAf5GO8B/mweUjSoblS5In0cWhqpfs/5PQA==",
      "license": "MIT"
    },
    "node_modules/undici-types": {
      "version": "7.18.2",
      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-7.18.2.tgz",
      "integrity": "sha512-AsuCzffGHJybSaRrmr5eHr81mwJU3kjw6M+uprWvCXiNeN9SOGwQ3Jn8jb8m3Z6izVgknn1R0FTCEAP2QrLY/w==",
      "license": "MIT",
      "peer": true
    },
    "node_modules/unpipe": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/unpipe/-/unpipe-1.0.0.tgz",
      "integrity": "sha512-pjy2bYhSsufwWlKwPc+l3cN7+wuJlK6uz0YdJEOlQDbl6jo/YlPi4mb8agUkVC8BF7V8NuzeyPNqRksA3hztKQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/util-deprecate": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/util-deprecate/-/util-deprecate-1.0.2.tgz",
      "integrity": "sha512-EPD5q1uXyFxJpCrLnCc1nHnq3gOa6DZBocAIiI2TaSCA7VCJ1UJDMagCzIkXNsUYfD1daK//LTEQ8xiIbrHtcw==",
      "license": "MIT"
    },
    "node_modules/validator": {
      "version": "13.15.26",
      "resolved": "https://registry.npmjs.org/validator/-/validator-13.15.26.tgz",
      "integrity": "sha512-spH26xU080ydGggxRyR1Yhcbgx+j3y5jbNXk/8L+iRvdIEQ4uTRH2Sgf2dokud6Q4oAtsbNvJ1Ft+9xmm6IZcA==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.10"
      }
    },
    "node_modules/vary": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/vary/-/vary-1.1.2.tgz",
      "integrity": "sha512-BNGbWLfd0eUPabhkXUVm0j8uuvREyTh5ovRa/dyow/BqAbZJyC+5fU+IzQOzmAKzYqYRAISoRhdQr3eIZ/PXqg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/wrappy": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/wrappy/-/wrappy-1.0.2.tgz",
      "integrity": "sha512-l4Sp/DRseor9wL6EvV2+TuQn63dMkPjZ/sp9XkghTEbV9KlPS1xUsZ3u7/IQO4wxtcFB4bgpQPRcR3QCvezPcQ==",
      "license": "ISC"
    },
    "node_modules/xss": {
      "version": "1.0.15",
      "resolved": "https://registry.npmjs.org/xss/-/xss-1.0.15.tgz",
      "integrity": "sha512-FVdlVVC67WOIPvfOwhoMETV72f6GbW7aOabBC3WxN/oUdoEMDyLz4OgRv5/gck2ZeNqEQu+Tb0kloovXOfpYVg==",
      "license": "MIT",
      "dependencies": {
        "commander": "^2.20.3",
        "cssfilter": "0.0.10"
      },
      "bin": {
        "xss": "bin/xss"
      },
      "engines": {
        "node": ">= 0.10.0"
      }
    }
  }
}
```

## Fichier : sweeted-backend\package.json

```json
{
  "name": "sweeted",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "node src/app.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "commonjs",
  "dependencies": {
    "bcrypt": "^6.0.0",
    "body-parser": "^2.2.2",
    "cors": "^2.8.6",
    "dotenv": "^17.3.1",
    "express": "^5.2.1",
    "express-rate-limit": "^8.6.0",
    "express-validator": "^7.3.1",
    "jsonwebtoken": "^9.0.3",
    "multer": "^2.2.0",
    "mysql2": "^3.19.1",
    "xss": "^1.0.15"
  }
}
```

## Fichier : sweeted-backend\scripts\start-server.ps1

```powershell
$ErrorActionPreference = 'Stop'
$workDir = 'd:\sweeted\sweeted-backend'
$outLog = 'C:\Users\ACER\AppData\Local\Temp\opencode\sweeted-server.out'
$errLog = 'C:\Users\ACER\AppData\Local\Temp\opencode\sweeted-server.err'

$conn = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
if ($conn) {
    Write-Output "ALREADY_RUNNING PID=$($conn.OwningProcess)"
    exit 0
}

Remove-Item $outLog, $errLog -ErrorAction SilentlyContinue
$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = 'cmd.exe'
$psi.Arguments = "/c node src/app.js 1> `"$outLog`" 2> `"$errLog`""
$psi.WorkingDirectory = $workDir
$psi.UseShellExecute = $true
$psi.WindowStyle = 'Hidden'
$p = [System.Diagnostics.Process]::Start($psi)
Write-Output "SERVER_PID=$($p.Id)"
```

## Fichier : sweeted-backend\scripts\token.js

```javascript
require('dotenv').config({ quiet: true });
const jwt = require('jsonwebtoken');
const [id, matricule_number, role = 'Utilisateur'] = process.argv.slice(2);
const token = jwt.sign({ id: Number(id), matricule_number, role }, process.env.JWT_SECRET, { expiresIn: '2h' });
process.stdout.write(token);
```

## Fichier : sweeted-backend\src\app.js

```javascript
const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Vérification des variables d'environnement
const requiredEnvVars = ['JWT_SECRET', 'DB_HOST', 'DB_USER', 'DB_NAME'];
const missingVars = requiredEnvVars.filter(v => !process.env[v]);
if (process.env.DB_PASSWORD === undefined) {
    missingVars.push('DB_PASSWORD');
}
if (missingVars.length > 0) {
    console.error(`X Variables d'environnement manquantes : ${missingVars.join(', ')}`);
    process.exit(1);
}

// Création automatique du dossier uploads
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Rate limiters
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15,
    message: { message: "Trop de tentatives. Réessayez dans 15 minutes." }
});

const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: { message: "Trop d'inscriptions. Réessayez dans 1 heure." }
});

//Gestion de post
const postRoutes = require('./routes/postRoute');
const sweetRoutes = require('./routes/sweetRoute');
const commentRoutes = require('./routes/commentRoute');

//Officiel + Notifications
const officialRoutes = require('./routes/officialRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

//Fichiers
const fileRoutes = require('./routes/fileRoutes');

//Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Logging diagnostic des requêtes entrantes
app.use((req, res, next) => {
    res.on('finish', () => {
        const bodyPreview = req.method === 'POST' && req.body ? JSON.stringify(req.body).slice(0, 200) : '';
        console.log(`[REQ] ${new Date().toISOString()} ${req.method} ${req.originalUrl} => ${res.statusCode} ${bodyPreview}`);
    });
    next();
});

// Servir les images uploadées
app.use('/uploads', express.static(uploadDir));

//Routes
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', registerLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

//Routes pour gestion De Post
app.use('/api/posts', postRoutes);
app.use('/api/sweets', sweetRoutes);
app.use('/api/comments', commentRoutes);

//Routes Officiel + Notifications
app.use('/api/official', officialRoutes);
app.use('/api/notifications', notificationRoutes);

//Routes Fichiers
app.use('/api/files', fileRoutes);

//Routes Social (suivi + enregistrements)
const followRoutes = require('./routes/followRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');
app.use('/api/follow', followRoutes);
app.use('/api/bookmarks', bookmarkRoutes);

app.get('/', (req, res) => {
    res.send('BACKEND Heheheee !');
});

//Demarrer serveur
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
    console.log(`server is executing at PORT: ${PORT}, HOST: ${HOST}`);
});
```

## Fichier : sweeted-backend\src\config\db.js

```javascript
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000
});

module.exports = pool;
```

## Fichier : sweeted-backend\src\controllers\authController.js

```javascript
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const { body, validationResult } = require('express-validator');


// Format personalisé pour le matricule (flexible pour les années)
const validateMatricule = (value) => {
    const regex = /^([0-9]{1,2})-([1-9][0-9]{4})\/([0-9]{2})$/;
    if (!regex.test(value)){
        throw new Error("Le matricule doit être au format XX-XXXXX/YY (ex: 5-40014/25 ou 37-40014/24).");
    }
    return true;
};

exports.register = [
    // Middleware pour matricule
    body('matricule_number').custom(validateMatricule),
    body('password').isLength({ min: 10 }).withMessage("Le mot de passe doit contenir au moins 10 caractères."),

    // Controleur principal
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { matricule_number, password } = req.body;

            // vérifier si l'utilisateur existe déjà
            const existingUser = await User.findByMatricule(matricule_number);
            if (existingUser){
                return res.status(400).json({ message: "Ce numero matricule est déjà utilisé." });
            }

            // Hacher le mot de passe
            const hashedPassword = await bcrypt.hash(password, 12);

            // Créer l'utilisateur
            await User.create(matricule_number, hashedPassword);

            res.status(201).json({ message: "Utilisateur enregistré avec succès !" });
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de l'inscription.", error });
        }
    }
];


exports.login = async (req, res) => {
    try{
        const { matricule_number, password } = req.body;

        // vérifier si l'utilisateur existe
        const user = await User.findByMatricule(matricule_number);
        if (!user) {
            return res.status(401).json({ message: "Identifiants invalides (User)." });
        }

        // vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Identifiants invalides (Password)." });
        }

        // générer un Json Web Token (inclut l'id pour les middlewares de permissions)
        const token = jwt.sign(
            { id: user.id, matricule_number: user.matricule_number, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token,role: user.role, message: "Connexion réussit !" });
    }catch (error){
        res.status(500).json({ message: "Erreur lors de la connexion.", error });
    }
};


exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        const postCountResult = await pool.query(
            'SELECT COUNT(*) AS count FROM Posts WHERE id_user = ?',
            [req.user.id]
        );
        const postCount = postCountResult[0][0].count;

        res.status(200).json({ ...user, postCount });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du profil.", error });
    }
};


//Creer un utilisateur (seulement pour les admins)
exports.createUser = async (req, res) => {
    try{
        const{ matricule_number, password, id_role } = req.body;

        // si utilisateur existe
        const existingUser = await User.findByMatricule(matricule_number);

        if (existingUser){
            //mise a jour du role de l'utilisateur (s'il existe)
            await pool.query('UPDATE Users SET id_role = ? WHERE matricule_number = ?', [id_role, matricule_number]);
            return res.status(200).json({ message: "Rôle de l'utilisateur mis à jour avec succès !" });
        }

        //hacher mot de passe
        const hashedPassword = await bcrypt.hash(password, 12);

        //creer utilisateur, avec le role donné
        await User.create(matricule_number, hashedPassword, id_role);

        res.status(201).json({ message: "Utilisateur créé avec succès !" });
    }catch(error){
        res.status(500).json({ message: "Erreur lors de la création de l'utilisateur.", error });
    }
};
```

## Fichier : sweeted-backend\src\controllers\commentController.js

```javascript
const Comment = require('../models/comment');
const xss = require('xss');

exports.createComment = async (req, res) => {
    try{
        const { postId } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        if (!content?.trim()) {
            return res.status(400).json({ message: "Le commentaire ne peut pas être vide." });
        }
        if (content.length > 1000) {
            return res.status(400).json({ message: "Le commentaire ne peut pas dépasser 1000 caractères." });
        }
        const sanitizedContent = xss(content.trim());
        await Comment.create(userId, postId, sanitizedContent);
        res.status(201).json({ message: "Commentaire ajouté avec succès !" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout du commentaire.", error });
    }
};

exports.getCommentsByPostId = async (req, res) => {
    
    try{
        const postId = req.params.postId;
        const comments = await Comment.findByPostId(postId);
        res.status(200).json(comments);
    }catch (error){
        res.status(500).json({ message: "Erreur lors de la récupération des commentaires.", error });
    }
};
```

## Fichier : sweeted-backend\src\controllers\fileController.js

```javascript
const File = require('../models/file');
const path = require('path');
const fs = require('fs');

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 Mo pour PDF

exports.uploadFile = async (req, res) => {
    try {
        const userId = req.user.id;
        const isMultipart = req.file !== undefined;

        if (isMultipart) {
            // Upload multipart (PDF/image)
            if (!req.file) {
                return res.status(400).json({ message: 'Aucun fichier fourni.' });
            }
            if (req.file.size > MAX_FILE_SIZE) {
                if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
                return res.status(400).json({ message: 'Le fichier ne peut pas dépasser 10 Mo.' });
            }
            const id = await File.createMultipart(userId, {
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size,
                path: `/uploads/${req.file.filename}`
            });
            const file = await File.findById(id);
            return res.status(201).json({ message: 'Fichier uploadé avec succès.', file });
        } else {
            // Upload JSON (fichier code)
            const { name, content, language } = req.body;
            if (!name?.trim()) {
                return res.status(400).json({ message: 'Le nom du fichier est requis.' });
            }
            if (!content?.trim()) {
                return res.status(400).json({ message: 'Le contenu du fichier est requis.' });
            }
            if (!language?.trim()) {
                return res.status(400).json({ message: 'Le langage est requis.' });
            }
            const id = await File.createCode(userId, { name: name.trim(), content, language: language.trim() });
            const file = await File.findById(id);
            return res.status(201).json({ message: 'Fichier code créé avec succès.', file });
        }
    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(500).json({ message: 'Erreur lors de la création du fichier.', error });
    }
};

exports.getFiles = async (req, res) => {
    try {
        const scope = req.query.scope;
        const userId = req.user.id;
        let files;
        if (scope === 'public') {
            files = await File.findPublic();
        } else {
            files = await File.findByUserId(userId);
        }
        res.status(200).json(files);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des fichiers.', error });
    }
};

exports.getFileById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const file = await File.findById(id);
        if (!file) {
            return res.status(404).json({ message: 'Fichier introuvable.' });
        }
        const canAccess = await File.canAccess(file, userId);
        if (!canAccess) {
            return res.status(403).json({ message: 'Accès refusé à ce fichier.' });
        }
        res.status(200).json(file);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du fichier.', error });
    }
};

exports.downloadFile = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const file = await File.findById(id);
        if (!file) {
            return res.status(404).json({ message: 'Fichier introuvable.' });
        }
        const canAccess = await File.canAccess(file, userId);
        if (!canAccess) {
            return res.status(403).json({ message: 'Accès refusé à ce fichier.' });
        }
        await File.incrementDownload(id);
        if (file.path) {
            const fullPath = path.join(__dirname, '..', '..', file.path);
            if (!fs.existsSync(fullPath)) {
                return res.status(404).json({ message: 'Fichier physique introuvable.' });
            }
            res.download(fullPath, file.name);
        } else if (file.type === 'code' && file.content) {
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);
            res.send(file.content);
        } else {
            return res.status(404).json({ message: 'Fichier non téléchargeable.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors du téléchargement.', error });
    }
};

exports.updateFile = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { name, content, visibility } = req.body;
        if (name === undefined && content === undefined && visibility === undefined) {
            return res.status(400).json({ message: 'Aucun champ à mettre à jour.' });
        }
        const result = await File.update(id, userId, { name, content, visibility });
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Fichier introuvable ou non autorisé.' });
        }
        const file = await File.findById(id);
        res.status(200).json({ message: 'Fichier mis à jour.', file });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour.', error });
    }
};

exports.deleteFile = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const result = await File.delete(id, userId);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Fichier introuvable ou non autorisé.' });
        }
        res.status(200).json({ message: 'Fichier supprimé.' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression.', error });
    }
};
```

## Fichier : sweeted-backend\src\controllers\notificationController.js

```javascript
const Notification = require('../models/notification');

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.findByUserId(req.user.id);
        const unreadCount = await Notification.countUnread(req.user.id);
        res.status(200).json({ notifications, unread_count: unreadCount });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des notifications.", error });
    }
};

exports.markNotificationRead = async (req, res) => {
    try {
        const { id } = req.params;
        await Notification.markRead(id, req.user.id);
        res.status(200).json({ message: "Notification marquée comme lue." });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors du marquage de la notification.", error });
    }
};

exports.markAllNotificationsRead = async (req, res) => {
    try {
        await Notification.markAllRead(req.user.id);
        res.status(200).json({ message: "Toutes les notifications sont marquées comme lues." });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors du marquage des notifications.", error });
    }
};
```

## Fichier : sweeted-backend\src\controllers\officialController.js

```javascript
const Officiel = require('../models/official');
const Notification = require('../models/notification');
const path = require('path');
const fs = require('fs');
const xss = require('xss');

const EXTRAIT_MAX = 120;

exports.getOfficials = async (req, res) => {
    try {
        const officials = await Officiel.findAll();
        res.status(200).json(officials);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des publications officielles.", error });
    }
};

exports.createOfficial = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content?.trim() && !req.file) {
            if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
            return res.status(400).json({ message: "La publication doit contenir du texte ou une image." });
        }
        if (content && content.length > 2000) {
            if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
            return res.status(400).json({ message: "Le contenu ne peut pas dépasser 2000 caractères." });
        }

        const sanitizedContent = content ? xss(content.trim()) : '';

        let imageUrl = null;
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        }

        const result = await Officiel.create(req.user.id, sanitizedContent, imageUrl);
        const officialId = result.insertId;

        const extrait = sanitizedContent
            ? (sanitizedContent.length > EXTRAIT_MAX ? sanitizedContent.slice(0, EXTRAIT_MAX) + '...' : sanitizedContent)
            : 'Nouvelle publication officielle de la Direction ISPM.';
        await Notification.fanOut('official', extrait, officialId);

        res.status(201).json({ message: "Publication officielle créée !" });
    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(500).json({ message: "Erreur lors de la création de la publication officielle.", error });
    }
};

exports.updateOfficial = async (req, res) => {
    try {
        const { id } = req.params;
        const { content, is_pinned } = req.body;

        const official = await Officiel.findById(id);
        if (!official) {
            return res.status(404).json({ message: "Publication officielle introuvable." });
        }
        if (!content?.trim()) {
            return res.status(400).json({ message: "Le contenu ne peut pas être vide." });
        }
        if (content.length > 2000) {
            return res.status(400).json({ message: "Le contenu ne peut pas dépasser 2000 caractères." });
        }

        await Officiel.update(id, xss(content.trim()), is_pinned ? 1 : 0);
        res.status(200).json({ message: "Publication officielle mise à jour !" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour de la publication officielle.", error });
    }
};

exports.deleteOfficial = async (req, res) => {
    try {
        const { id } = req.params;

        const official = await Officiel.findById(id);
        if (!official) {
            return res.status(404).json({ message: "Publication officielle introuvable." });
        }

        if (official.image_url) {
            const imagePath = path.join(__dirname, '..', '..', official.image_url);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await Notification.deleteByOfficialPost(id);
        await Officiel.delete(id);
        res.status(200).json({ message: "Publication officielle supprimée !" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de la publication officielle.", error });
    }
};
```

## Fichier : sweeted-backend\src\controllers\postController.js

```javascript
const Post = require('../models/post');
const File = require('../models/file');
const path = require('path');
const fs = require('fs');
const xss = require('xss');

exports.createPost = async (req, res) => {
    try {
        const { content } = req.body;
        const userId = req.user.id;
        const imageFile = req.files && req.files.image ? req.files.image[0] : null;
        const attachment = req.files && req.files.file ? req.files.file[0] : null;

        const cleanup = () => {
            [imageFile, attachment].forEach(file => {
                if (file && fs.existsSync(file.path)) fs.unlinkSync(file.path);
            });
        };

        if (!content?.trim() && !imageFile && !attachment) {
            cleanup();
            return res.status(400).json({ message: "Le post doit contenir du texte, une image ou un PDF." });
        }
        if (content && content.length > 2000) {
            cleanup();
            return res.status(400).json({ message: "Le contenu ne peut pas dépasser 2000 caractères." });
        }
        if (imageFile && imageFile.size > 5 * 1024 * 1024) {
            cleanup();
            return res.status(400).json({ message: "L'image ne peut pas dépasser 5 Mo." });
        }

        const sanitizedContent = content ? xss(content.trim()) : '';

        let imageUrl = null;
        if (imageFile) {
            imageUrl = `/uploads/${imageFile.filename}`;
        }

        const postResult = await Post.create(userId, sanitizedContent, imageUrl);

        if (attachment) {
            await File.createPostAttachment(userId, {
                originalname: attachment.originalname,
                mimetype: attachment.mimetype,
                size: attachment.size,
                path: `/uploads/${attachment.filename}`,
                postId: postResult.insertId
            });
        }

        res.status(201).json({ message: "Post créé avec succès !" });
    } catch (error) {
        if (req.files) {
            Object.values(req.files).flat().forEach(file => {
                if (file && fs.existsSync(file.path)) fs.unlinkSync(file.path);
            });
        }
        res.status(500).json({ message: "Erreur lors de la création du post.", error });
    }
};

exports.getAllPosts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;
        const userId = req.user ? req.user.id : null;
        const posts = await Post.findAll(limit, offset, userId);
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des posts.", error });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user ? req.user.id : null;
        const post = await Post.findById(id, userId);
        if (!post) {
            return res.status(404).json({ message: "Post non trouvé." });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du post.", error });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        const post = await Post.findById(id);
        if (!post || post.id_user !== userId) {
            return res.status(403).json({ message: "Vous n'êtes pas autorisé à modifier ce post." });
        }

        await Post.update(id, content);
        res.status(200).json({ message: "Post mis à jour avec succès !" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du post.", error });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const post = await Post.findById(id);
        const isOwner = post && post.id_user === userId;
        const isMod = ['Admin', 'Modérateur'].includes(req.user.role);
        if (!post || (!isOwner && !isMod)) {
            return res.status(403).json({ message: "Vous n'êtes pas autorisé à supprimer ce post." });
        }

        if (post.image_url) {
            const imagePath = path.join(__dirname, '..', '..', post.image_url);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await File.deleteByPost(id);
        await Post.delete(id);
        res.status(200).json({ message: "Post supprimé avec succès !" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du post.", error });
    }
};
```

## Fichier : sweeted-backend\src\controllers\socialController.js

```javascript
const Follow = require('../models/follow');
const User = require('../models/user');
const Bookmark = require('../models/bookmark');
const Post = require('../models/post');

exports.followUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const { userId: targetId } = req.params;

        if (String(userId) === String(targetId)) {
            return res.status(400).json({ message: "Vous ne pouvez pas vous suivre vous-même." });
        }
        const target = await User.findById(targetId);
        if (!target) {
            return res.status(404).json({ message: "Utilisateur introuvable." });
        }
        if (await Follow.isFollowing(userId, targetId)) {
            return res.status(409).json({ message: "Vous suivez déjà cet utilisateur." });
        }
        await Follow.follow(userId, targetId);
        const followersCount = await Follow.countFollowers(targetId);
        res.status(201).json({ message: "Vous suivez désormais cet utilisateur.", is_following: true, followers_count: followersCount });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'abonnement.", error });
    }
};

exports.unfollowUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const { userId: targetId } = req.params;

        if (String(userId) === String(targetId)) {
            return res.status(400).json({ message: "Vous ne pouvez pas vous suivre vous-même." });
        }
        const target = await User.findById(targetId);
        if (!target) {
            return res.status(404).json({ message: "Utilisateur introuvable." });
        }
        if (!(await Follow.isFollowing(userId, targetId))) {
            return res.status(404).json({ message: "Vous ne suivez pas cet utilisateur." });
        }
        await Follow.unfollow(userId, targetId);
        const followersCount = await Follow.countFollowers(targetId);
        res.status(200).json({ message: "Vous ne suivez plus cet utilisateur.", is_following: false, followers_count: followersCount });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors du désabonnement.", error });
    }
};

exports.getUserStats = async (req, res) => {
    try {
        const { id } = req.params;
        const target = await User.findById(id);
        if (!target) {
            return res.status(404).json({ message: "Utilisateur introuvable." });
        }
        const userId = req.user ? req.user.id : null;
        const [followersCount, followingCount, isFollowing] = await Promise.all([
            Follow.countFollowers(id),
            Follow.countFollowing(id),
            userId ? Follow.isFollowing(userId, id) : false
        ]);
        res.status(200).json({
            user: target,
            followers_count: followersCount,
            following_count: followingCount,
            is_following: isFollowing
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des statistiques.", error });
    }
};

exports.addBookmark = async (req, res) => {
    try {
        const userId = req.user.id;
        const { postId } = req.params;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post introuvable." });
        }
        if (await Bookmark.exists(userId, postId)) {
            return res.status(409).json({ message: "Ce post est déjà dans vos enregistrements." });
        }
        await Bookmark.add(userId, postId);
        res.status(201).json({ message: "Post enregistré.", is_bookmarked: true });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: "Ce post est déjà dans vos enregistrements." });
        }
        res.status(500).json({ message: "Erreur lors de l'enregistrement du post.", error });
    }
};

exports.removeBookmark = async (req, res) => {
    try {
        const userId = req.user.id;
        const { postId } = req.params;
        if (!(await Bookmark.exists(userId, postId))) {
            return res.status(404).json({ message: "Ce post n'est pas dans vos enregistrements." });
        }
        await Bookmark.remove(userId, postId);
        res.status(200).json({ message: "Post retiré de vos enregistrements.", is_bookmarked: false });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors du retrait du post.", error });
    }
};

exports.getBookmarks = async (req, res) => {
    try {
        const userId = req.user.id;
        const bookmarks = await Bookmark.findByUser(userId);
        res.status(200).json(bookmarks);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des enregistrements.", error });
    }
};
```

## Fichier : sweeted-backend\src\controllers\sweetController.js

```javascript
const Sweet = require('../models/sweet');

exports.addSweet = async (req, res) => {
    try{
        const { postId } = req.params;
        const userId = req.user.id;
        await Sweet.addSweet(userId, postId);
        res.status(201).json({ message: "Sweet ajouté avec succès !", has_reacted: true });
    }catch(error){
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: "Vous avez déjà réagi à ce post." });
        }
        res.status(500).json({ message: "Erreur lors de l'ajout du sweet.", error });
    }
};

exports.removeSweet = async (req, res) => {
    try{
        const { postId } = req.params;
        const userId = req.user.id;
        await Sweet.removeSweet(userId, postId);
        res.status(200).json({ message: "Sweet supprimé avec succès !" });
    }catch(error){
        res.status(500).json({ message: "Erreur lors de la suppression du sweet.", error });
    }
};
```

## Fichier : sweeted-backend\src\controllers\userController.js

```javascript
const User = require('../models/user');
const path = require('path');
const fs = require('fs');

exports.searchUsers = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.trim().length === 0) {
            return res.status(400).json({ message: "Le paramètre de recherche est requis." });
        }
        const users = await User.search(q.trim());
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la recherche.", error });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { display_name, bio, filiere } = req.body;

        if (display_name !== undefined && display_name.length > 100) {
            return res.status(400).json({ message: "Le nom d'affichage ne peut pas dépasser 100 caractères." });
        }
        if (bio !== undefined && bio.length > 280) {
            return res.status(400).json({ message: "La bio ne peut pas dépasser 280 caractères." });
        }
        if (filiere !== undefined && filiere.length > 100) {
            return res.status(400).json({ message: "La filière ne peut pas dépasser 100 caractères." });
        }
        if (display_name === undefined && bio === undefined && filiere === undefined && !req.file) {
            return res.status(400).json({ message: "Aucun champ à mettre à jour." });
        }

        let avatarUrl;
        if (req.file) {
            avatarUrl = `/uploads/${req.file.filename}`;
            const currentUser = await User.findById(userId);
            if (currentUser && currentUser.avatar_url) {
                const oldPath = path.join(__dirname, '..', '..', currentUser.avatar_url);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
        }

        await User.updateProfile(userId, { display_name, bio, avatar_url: avatarUrl, filiere });
        const updated = await User.findById(userId);
        res.status(200).json({ message: "Profil mis à jour avec succès !", user: updated });
    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: "Erreur lors de la mise à jour du profil.", error });
    }
};
```

## Fichier : sweeted-backend\src\middlewares\authMiddleware.js

```javascript
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    //Pour recuperer le token via l'en-tête de la requetea
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token){
        return res.status(401).json({ message: "Accès refusé. Aucun token fournit." });
    }

    try{
        //Pour verifier puis décoder le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next(); 
    }catch (error){
        res.status(400).json({ message: "Token invalide." });
    }
};
```

## Fichier : sweeted-backend\src\middlewares\optionalAuthMiddleware.js

```javascript
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        req.user = null;
        return next();
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        req.user = null;
        next();
    }
};
```

## Fichier : sweeted-backend\src\middlewares\verifierPermission.js

```javascript
const pool = require('../config/db');

const verifierPermission = (nomPermission) => {
    return async (req, res, next) => {
        try{
            // Vérifier que le `req.user` est bien défini (doit provenir du middleware d'authentification)
            if (!req.user || !req.user.id) {
                return res.status(401).json({ message: "Authentification requise." });
            }

            const userId = req.user.id;

            // Pour récupérer le rôle de l'utilisateur
            const [user] = await pool.query(
                'SELECT id_role FROM Users WHERE id = ?',
                [userId]
            );

            if (!user[0]){
                return res.status(401).json({ message: "Compte utilisateur introuvable." });
            }

            const roleId = user[0].id_role;

            // Vérifier si le rôle a la permission
            const [permission] = await pool.query(`
                SELECT Permissions.nom FROM Permissions
                JOIN Permission_de_role ON Permissions.id = Permission_de_role.id_permission
                WHERE Permission_de_role.id_role = ? AND Permissions.nom = ?
            `, [roleId, nomPermission]);

            if (!permission[0]){
                return res.status(403).json({ message: "Permission refusée." });
            }

            next();
        }catch (error){
            res.status(500).json({ message: "Erreur lors de la vérification des permissions.", error });
        }
    };
};

module.exports = verifierPermission
```

## Fichier : sweeted-backend\src\models\bookmark.js

```javascript
const pool = require('../config/db');

class Bookmark {
    static async add(userId, postId) {
        const [rows] = await pool.query(
            'INSERT INTO enregistrer (id_user, id_post) VALUES (?, ?)',
            [userId, postId]
        );
        return rows;
    }

    static async remove(userId, postId) {
        const [rows] = await pool.query(
            'DELETE FROM enregistrer WHERE id_user = ? AND id_post = ?',
            [userId, postId]
        );
        return rows;
    }

    static async findByUser(userId) {
        const [rows] = await pool.query(
            `SELECT Posts.*,
                    Users.matricule_number,
                    Users.display_name,
                    Users.avatar_url,
                    (SELECT COUNT(*) FROM Sweets WHERE Sweets.id_post = Posts.id) AS total_reactions,
                    (SELECT COUNT(*) > 0 FROM Sweets WHERE Sweets.id_post = Posts.id AND Sweets.id_user = ?) AS has_reacted,
                    (SELECT COUNT(*) > 0 FROM enregistrer WHERE enregistrer.id_post = Posts.id AND enregistrer.id_user = ?) AS is_bookmarked
             FROM enregistrer
             JOIN Posts ON enregistrer.id_post = Posts.id
             JOIN Users ON Posts.id_user = Users.id
             WHERE enregistrer.id_user = ?
             ORDER BY enregistrer.created_at DESC`,
            [userId, userId, userId]
        );
        return rows;
    }

    static async exists(userId, postId) {
        const [rows] = await pool.query(
            'SELECT 1 FROM enregistrer WHERE id_user = ? AND id_post = ?',
            [userId, postId]
        );
        return rows.length > 0;
    }
}

module.exports = Bookmark;
```

## Fichier : sweeted-backend\src\models\comment.js

```javascript
const pool = require('../config/db');

class Comment{
    static async create(userId, postId, content){
        const [rows] = await pool.query(
            'INSERT INTO Comments (id_user, id_post, content) VALUES (?, ?, ?)',
            [userId, postId, content]
        );
        return rows;
    }

    static async findByPostId(postId){
        const [rows] = await pool.query(
            `SELECT Comments.*,
                    Users.matricule_number,
                    Users.display_name,
                    Users.avatar_url
             FROM Comments
             JOIN Users ON Comments.id_user = Users.id
             WHERE Comments.id_post = ?
             ORDER BY Comments.created_at DESC`,
            [postId]
        );
        return rows;
    }
}

module.exports = Comment;
```

## Fichier : sweeted-backend\src\models\file.js

```javascript
const pool = require('../config/db');
const path = require('path');
const fs = require('fs');

class File {
    static async createMultipart(userId, { originalname, mimetype, size, path: filePath }) {
        const type = mimetype.startsWith('image/') ? 'image' : 'file';
        const [rows] = await pool.query(
            `INSERT INTO \`file\` (type, name, path, size, visibility, id_user, download_count)
             VALUES (?, ?, ?, ?, 'prive', ?, 0)`,
            [type, originalname, filePath, size, userId]
        );
        return rows.insertId;
    }

    static async createCode(userId, { name, content, language }) {
        const [rows] = await pool.query(
            `INSERT INTO \`file\` (type, name, content, language, size, visibility, id_user, download_count)
             VALUES ('code', ?, ?, ?, ?, 'prive', ?, 0)`,
            [name, content, language, Buffer.byteLength(content, 'utf8'), userId]
        );
        return rows.insertId;
    }

    static async createPostAttachment(userId, { originalname, mimetype, size, path: filePath, postId }) {
        const type = mimetype.startsWith('image/') ? 'image' : 'file';
        const [rows] = await pool.query(
            `INSERT INTO \`file\` (type, name, path, size, visibility, id_user, download_count, id_post)
             VALUES (?, ?, ?, ?, 'prive', ?, 0, ?)`,
            [type, originalname, filePath, size, userId, postId]
        );
        return rows.insertId;
    }

    static async deleteByPost(postId) {
        const [files] = await pool.query('SELECT * FROM \`file\` WHERE id_post = ?', [postId]);
        for (const file of files) {
            if (file.path) {
                const fullPath = path.join(__dirname, '..', '..', file.path);
                if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
            }
        }
        const [rows] = await pool.query('DELETE FROM \`file\` WHERE id_post = ?', [postId]);
        return rows;
    }

    static async findByUserId(userId) {
        const [rows] = await pool.query(
            `SELECT \`file\`.id, \`file\`.type, \`file\`.name, \`file\`.path, \`file\`.content, \`file\`.language, \`file\`.size,
                    \`file\`.visibility, \`file\`.download_count, \`file\`.created_at, \`file\`.updated_at,
                    \`file\`.id_user, \`file\`.id_post, \`file\`.id_official_post,
                    Users.display_name, Users.avatar_url
             FROM \`file\`
             JOIN Users ON \`file\`.id_user = Users.id
             WHERE \`file\`.id_user = ?
             ORDER BY \`file\`.created_at DESC`,
            [userId]
        );
        return rows;
    }

    static async findPublic() {
        const [rows] = await pool.query(
            `SELECT \`file\`.id, \`file\`.type, \`file\`.name, \`file\`.path, \`file\`.content, \`file\`.language, \`file\`.size,
                    \`file\`.visibility, \`file\`.download_count, \`file\`.created_at, \`file\`.updated_at,
                    \`file\`.id_user, \`file\`.id_post, \`file\`.id_official_post,
                    Users.display_name, Users.avatar_url
             FROM \`file\`
             JOIN Users ON \`file\`.id_user = Users.id
             WHERE \`file\`.visibility = 'public'
             ORDER BY \`file\`.created_at DESC`
        );
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.query(
            `SELECT \`file\`.*, Users.display_name, Users.avatar_url
             FROM \`file\`
             JOIN Users ON \`file\`.id_user = Users.id
             WHERE \`file\`.id = ?`,
            [id]
        );
        return rows[0];
    }

    static async update(id, userId, { name, content, visibility }) {
        const updates = [];
        const params = [];
        if (name !== undefined) {
            updates.push('name = ?');
            params.push(name);
        }
        if (content !== undefined) {
            updates.push('content = ?');
            params.push(content);
            updates.push('size = ?');
            params.push(Buffer.byteLength(content, 'utf8'));
        }
        if (visibility !== undefined) {
            updates.push('visibility = ?');
            params.push(visibility);
        }
        if (updates.length === 0) return { affectedRows: 0 };
        updates.push('updated_at = CURRENT_TIMESTAMP');
        params.push(id, userId);
        const [rows] = await pool.query(
            `UPDATE \`file\` SET ${updates.join(', ')} WHERE id = ? AND id_user = ?`,
            params
        );
        return rows;
    }

    static async delete(id, userId) {
        const file = await this.findById(id);
        if (!file || file.id_user !== userId) return { affectedRows: 0, file: null };
        if (file.path) {
            const fullPath = path.join(__dirname, '..', '..', file.path);
            if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
        }
        const [rows] = await pool.query('DELETE FROM \`file\` WHERE id = ? AND id_user = ?', [id, userId]);
        return { affectedRows: rows.affectedRows, file };
    }

    static async incrementDownload(id) {
        const [rows] = await pool.query(
            'UPDATE \`file\` SET download_count = download_count + 1 WHERE id = ?',
            [id]
        );
        return rows;
    }

    static async canAccess(file, userId) {
        if (!file) return false;
        if (file.id_user === userId) return true;
        if (file.visibility === 'public') return true;
        // Fichier attaché à un post visible : post public (id_post) ou officiel (id_official_post)
        if (file.id_post) {
            const [post] = await pool.query('SELECT 1 FROM Posts WHERE id = ?', [file.id_post]);
            if (post.length) return true;
        }
        if (file.id_official_post) {
            const [official] = await pool.query('SELECT 1 FROM Officiel WHERE id = ?', [file.id_official_post]);
            if (official.length) return true;
        }
        return false;
    }
}

module.exports = File;
```

## Fichier : sweeted-backend\src\models\follow.js

```javascript
const pool = require('../config/db');

class Follow {
    static async follow(followerId, followedId) {
        const [rows] = await pool.query(
            'INSERT INTO Suivre (id_user_suiveur, id_user_suivi) VALUES (?, ?)',
            [followerId, followedId]
        );
        return rows;
    }

    static async unfollow(followerId, followedId) {
        const [rows] = await pool.query(
            'DELETE FROM Suivre WHERE id_user_suiveur = ? AND id_user_suivi = ?',
            [followerId, followedId]
        );
        return rows;
    }

    static async countFollowers(userId) {
        const [rows] = await pool.query(
            'SELECT COUNT(*) AS count FROM Suivre WHERE id_user_suivi = ?',
            [userId]
        );
        return rows[0].count;
    }

    static async countFollowing(userId) {
        const [rows] = await pool.query(
            'SELECT COUNT(*) AS count FROM Suivre WHERE id_user_suiveur = ?',
            [userId]
        );
        return rows[0].count;
    }

    static async isFollowing(followerId, followedId) {
        const [rows] = await pool.query(
            'SELECT 1 FROM Suivre WHERE id_user_suiveur = ? AND id_user_suivi = ?',
            [followerId, followedId]
        );
        return rows.length > 0;
    }
}

module.exports = Follow;
```

## Fichier : sweeted-backend\src\models\notification.js

```javascript
const pool = require('../config/db');

class Notification {
    // Fan-out : une ligne par utilisateur (nation officielle)
    static async fanOut(type, message, officialPostId) {
        const [rows] = await pool.query(
            `INSERT INTO Notification (type, message, id_user, id_official_post)
             SELECT ?, ?, id, ? FROM Users`,
            [type, message, officialPostId]
        );
        return rows;
    }

    static async findByUserId(userId) {
        const [rows] = await pool.query(
            `SELECT Notification.id, Notification.type, Notification.message, Notification.is_read,
                    Notification.created_at, Notification.id_user, Notification.id_official_post,
                    Officiel.content AS official_content,
                    Officiel.image_url AS official_image_url,
                    Officiel.is_pinned AS official_is_pinned,
                    Officiel.created_at AS official_created_at
             FROM Notification
             LEFT JOIN Officiel ON Officiel.id = Notification.id_official_post
             WHERE Notification.id_user = ?
             ORDER BY Notification.created_at DESC`,
            [userId]
        );
        return rows;
    }

    static async countUnread(userId) {
        const [rows] = await pool.query(
            'SELECT COUNT(*) AS count FROM Notification WHERE id_user = ? AND is_read = 0',
            [userId]
        );
        return rows[0].count;
    }

    static async markRead(id, userId) {
        const [rows] = await pool.query(
            'UPDATE Notification SET is_read = 1 WHERE id = ? AND id_user = ?',
            [id, userId]
        );
        return rows;
    }

    static async markAllRead(userId) {
        const [rows] = await pool.query(
            'UPDATE Notification SET is_read = 1 WHERE id_user = ? AND is_read = 0',
            [userId]
        );
        return rows;
    }

    static async deleteByOfficialPost(officialPostId) {
        const [rows] = await pool.query(
            'DELETE FROM Notification WHERE id_official_post = ?',
            [officialPostId]
        );
        return rows;
    }
}

module.exports = Notification;
```

## Fichier : sweeted-backend\src\models\official.js

```javascript
const pool = require('../config/db');

class Officiel {
    static async create(userId, content, imageUrl = null) {
        const [rows] = await pool.query(
            'INSERT INTO Officiel (id_user, content, image_url) VALUES (?, ?, ?)',
            [userId, content, imageUrl]
        );
        return rows;
    }

    static async findAll() {
        const [rows] = await pool.query(
            `SELECT Officiel.id, Officiel.content, Officiel.image_url, Officiel.is_pinned,
                    Officiel.created_at, Officiel.id_user,
                    Users.matricule_number,
                    Users.display_name,
                    Users.avatar_url
             FROM Officiel
             JOIN Users ON Officiel.id_user = Users.id
             ORDER BY Officiel.is_pinned DESC, Officiel.created_at DESC`
        );
        const [files] = await pool.query(
            'SELECT id, name, size, type, visibility, download_count, path, id_official_post FROM `file` WHERE id_official_post IS NOT NULL ORDER BY name'
        );
        const filesByOfficial = {};
        for (const f of files) {
            if (!filesByOfficial[f.id_official_post]) filesByOfficial[f.id_official_post] = [];
            filesByOfficial[f.id_official_post].push(f);
        }
        return rows.map(official => ({ ...official, files: filesByOfficial[official.id] || [] }));
    }

    static async findById(id) {
        const [rows] = await pool.query(
            `SELECT Officiel.id, Officiel.content, Officiel.image_url, Officiel.is_pinned,
                    Officiel.created_at, Officiel.id_user,
                    Users.matricule_number,
                    Users.display_name,
                    Users.avatar_url
             FROM Officiel
             JOIN Users ON Officiel.id_user = Users.id
             WHERE Officiel.id = ?`,
            [id]
        );
        return rows[0];
    }

    static async update(id, content, isPinned) {
        const [rows] = await pool.query(
            'UPDATE Officiel SET content = ?, is_pinned = ? WHERE id = ?',
            [content, isPinned, id]
        );
        return rows;
    }

    static async delete(id) {
        const [rows] = await pool.query('DELETE FROM Officiel WHERE id = ?', [id]);
        return rows;
    }
}

module.exports = Officiel;
```

## Fichier : sweeted-backend\src\models\post.js

```javascript
const pool = require('../config/db');

class Post{
    static async create(userId, content, imageUrl = null){
        const [rows] = await pool.query(
            'INSERT INTO Posts (id_user, content, image_url) VALUES (?, ?, ?)',
            [userId, content, imageUrl]
        );
        return rows;
    }

    static async findAll(limit = 20, offset = 0, userId = null){
        const userClause = userId
            ? `, (SELECT COUNT(*) > 0 FROM Sweets WHERE Sweets.id_post = Posts.id AND Sweets.id_user = ?) AS has_reacted,
               (SELECT COUNT(*) > 0 FROM enregistrer WHERE enregistrer.id_post = Posts.id AND enregistrer.id_user = ?) AS is_bookmarked`
            : '';
        const params = userId ? [userId, userId, limit, offset] : [limit, offset];
        const [rows] = await pool.query(
            `SELECT Posts.*,
                    Users.matricule_number,
                    Users.display_name,
                    Users.avatar_url,
                    (SELECT COUNT(*) FROM Sweets WHERE Sweets.id_post = Posts.id) AS total_reactions${userClause},
                    (SELECT f.id FROM \`file\` f WHERE f.id_post = Posts.id ORDER BY f.id ASC LIMIT 1) AS file_id,
                    (SELECT f.name FROM \`file\` f WHERE f.id_post = Posts.id ORDER BY f.id ASC LIMIT 1) AS file_name,
                    (SELECT f.type FROM \`file\` f WHERE f.id_post = Posts.id ORDER BY f.id ASC LIMIT 1) AS file_type,
                    (SELECT f.path FROM \`file\` f WHERE f.id_post = Posts.id ORDER BY f.id ASC LIMIT 1) AS file_path
             FROM Posts
             JOIN Users ON Posts.id_user = Users.id
             ORDER BY Posts.created_at DESC
             LIMIT ? OFFSET ?`,
            params
        );
        return rows;
    }

    static async findById(id, userId = null){
        const userClause = userId
            ? `, (SELECT COUNT(*) > 0 FROM Sweets WHERE Sweets.id_post = Posts.id AND Sweets.id_user = ?) AS has_reacted,
               (SELECT COUNT(*) > 0 FROM enregistrer WHERE enregistrer.id_post = Posts.id AND enregistrer.id_user = ?) AS is_bookmarked`
            : '';
        const params = userId ? [userId, userId, id] : [id];
        const [rows] = await pool.query(
            `SELECT Posts.*,
                    Users.matricule_number,
                    Users.display_name,
                    Users.avatar_url,
                    (SELECT COUNT(*) FROM Sweets WHERE Sweets.id_post = Posts.id) AS total_reactions${userClause},
                    (SELECT f.id FROM \`file\` f WHERE f.id_post = Posts.id ORDER BY f.id ASC LIMIT 1) AS file_id,
                    (SELECT f.name FROM \`file\` f WHERE f.id_post = Posts.id ORDER BY f.id ASC LIMIT 1) AS file_name,
                    (SELECT f.type FROM \`file\` f WHERE f.id_post = Posts.id ORDER BY f.id ASC LIMIT 1) AS file_type,
                    (SELECT f.path FROM \`file\` f WHERE f.id_post = Posts.id ORDER BY f.id ASC LIMIT 1) AS file_path
             FROM Posts
             JOIN Users ON Posts.id_user = Users.id
             WHERE Posts.id = ?`,
            params
        );
        return rows[0];
    }

    static async update(id, content){
        const [rows] = await pool.query('UPDATE Posts SET content = ? WHERE id = ?', [content, id]);
        return rows;
    }

    static async delete(id){
        const [rows] = await pool.query('DELETE FROM Posts WHERE id = ?', [id]);
        return rows;
    }
}

module.exports = Post;
```

## Fichier : sweeted-backend\src\models\sweet.js

```javascript
const pool = require('../config/db');

class Sweet{
    static async addSweet(userId, postId){
        const [rows] = await pool.query(
            'INSERT INTO Sweets (id_user, id_post) VALUES (?, ?)',
            [userId, postId]
        );
        return rows;
    }

    static async removeSweet(userId, postId){
        const [rows] = await pool.query(
            'DELETE FROM Sweets WHERE id_user = ? AND id_post = ?',
            [userId, postId]
        );
        return rows;
    }

    static async countSweets(postId){
        const [rows] = await pool.query(
            'SELECT COUNT(*) AS count FROM Sweets WHERE id_post = ?',
            [postId]
        );
        return rows[0].count;
    }
}

module.exports = Sweet;
```

## Fichier : sweeted-backend\src\models\user.js

```javascript
const pool = require('../config/db');

class User{
    static async create(matricule_number, password, id_role = 3){
        const [rows] = await pool.query(
            'INSERT INTO Users (matricule_number, password, id_role) VALUES (?, ?, ?)',
            [matricule_number, password, id_role]
        );
        return rows;
    }

    static async findByMatricule(matricule_number){
        const [rows] = await pool.query(
            `SELECT Users.id, Users.matricule_number, Users.password, Users.display_name,
                    Users.avatar_url, Users.bio, Users.filiere, Users.id_role, Users.created_at,
                    Roles.nom AS role
             FROM Users LEFT JOIN Roles ON Users.id_role = Roles.id
             WHERE Users.matricule_number = ?`,
            [matricule_number]
        );
        return rows[0];
    }

    static async findById(id){
        const [rows] = await pool.query(
            `SELECT Users.id, Users.matricule_number, Users.display_name, Users.avatar_url, Users.bio, Users.filiere, Users.id_role, Roles.nom AS role
             FROM Users LEFT JOIN Roles ON Users.id_role = Roles.id
             WHERE Users.id = ?`,
            [id]
        );
        return rows[0];
    }

    static async updateProfile(id, { display_name, bio, avatar_url, filiere }){
        const updates = [];
        const params = [];
        if (display_name !== undefined) {
            updates.push('display_name = ?');
            params.push(display_name);
        }
        if (bio !== undefined) {
            updates.push('bio = ?');
            params.push(bio);
        }
        if (avatar_url !== undefined) {
            updates.push('avatar_url = ?');
            params.push(avatar_url);
        }
        if (filiere !== undefined) {
            updates.push('filiere = ?');
            params.push(filiere);
        }
        if (updates.length === 0) return { affectedRows: 0 };
        params.push(id);
        const [rows] = await pool.query(
            `UPDATE Users SET ${updates.join(', ')} WHERE id = ?`,
            params
        );
        return rows;
    }

    static async search(query){
        const [rows] = await pool.query(
            `SELECT Users.id, Users.matricule_number, Users.display_name, Users.avatar_url, Users.bio, Users.filiere
             FROM Users
             WHERE Users.matricule_number LIKE ? OR Users.display_name LIKE ?
             LIMIT 20`,
            [`%${query}%`, `%${query}%`]
        );
        return rows;
    }
}

module.exports = User;
```

## Fichier : sweeted-backend\src\routes\authRoutes.js

```javascript
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const verifierPermission = require('../middlewares/verifierPermission')
const authMiddleware = require('../middlewares/authMiddleware');

/* ----Routes---- */

//pour verifier si user peut creer des utilisateurs
router.post('/create-user', authMiddleware, verifierPermission('create_user'), authController.createUser);

// Pour inscription
router.post('/register', authController.register);

// Pour connexion
router.post('/login', authController.login);

// Profil de l'utilisateur connecté
router.get('/me', authMiddleware, authController.getMe);



// Route protégé : seulement un utilisateur connecté peut accéder
router.post('/protected-route', authMiddleware, (req, res) => {
    res.json({ message: `Hey, ${req.user.matricule_number} ! Vous êtes autorisé.` });
});

module.exports = router;
```

## Fichier : sweeted-backend\src\routes\bookmarkRoutes.js

```javascript
const express = require('express');
const router = express.Router();
const socialController = require('../controllers/socialController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, socialController.getBookmarks);
router.post('/:postId', authMiddleware, socialController.addBookmark);
router.delete('/:postId', authMiddleware, socialController.removeBookmark);

module.exports = router;
```

## Fichier : sweeted-backend\src\routes\commentRoute.js

```javascript
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middlewares/authMiddleware');

// Routes: POST /api/comments/:postId, GET /api/comments/:postId
router.post('/:postId', authMiddleware, commentController.createComment);
// Lecture publique des commentaires autorisée (Option A)
router.get('/:postId', commentController.getCommentsByPostId);

module.exports = router;
```

## Fichier : sweeted-backend\src\routes\fileRoutes.js

```javascript
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fileController = require('../controllers/fileController');
const authMiddleware = require('../middlewares/authMiddleware');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', '..', 'uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, 'file-' + uniqueSuffix + ext);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Seules les images (JPEG, PNG, WebP) et les PDF sont acceptées.'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10 Mo
});

router.post('/', authMiddleware, upload.single('file'), fileController.uploadFile);
router.get('/', authMiddleware, fileController.getFiles);
router.get('/:id', authMiddleware, fileController.getFileById);
// Exception documentée : le token peut aussi passer en ?token= pour permettre
// l'ouverture du téléchargement dans le navigateur système (WebBrowser)
// qui ne peut pas envoyer d'en-tête Authorization. Route uniquement.
router.get('/:id/download', (req, res, next) => {
    if (!req.headers.authorization && req.query.token) {
        req.headers.authorization = `Bearer ${req.query.token}`;
    }
    next();
}, authMiddleware, fileController.downloadFile);
router.put('/:id', authMiddleware, fileController.updateFile);
router.delete('/:id', authMiddleware, fileController.deleteFile);

// Erreurs multer (filtre type / taille) → réponse JSON propre
router.use((err, req, res, next) => {
    if (err && res.headersSent) {
        return next(err);
    }
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: "Le fichier ne peut pas dépasser 10 Mo." });
        }
        return res.status(400).json({ message: err.message });
    }
    if (err && err.message === 'Seules les images (JPEG, PNG, WebP) et les PDF sont acceptées.') {
        return res.status(400).json({ message: err.message });
    }
    next(err);
});

module.exports = router;
```

## Fichier : sweeted-backend\src\routes\followRoutes.js

```javascript
const express = require('express');
const router = express.Router();
const socialController = require('../controllers/socialController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/:userId', authMiddleware, socialController.followUser);
router.delete('/:userId', authMiddleware, socialController.unfollowUser);

module.exports = router;
```

## Fichier : sweeted-backend\src\routes\notificationRoutes.js

```javascript
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middlewares/authMiddleware');

// Liste + compteur non-lus
router.get('/', authMiddleware, notificationController.getNotifications);
// Marquer tout comme lu (déclarée avant /:id/read pour éviter la capture de 'read-all')
router.put('/read-all', authMiddleware, notificationController.markAllNotificationsRead);
// Marquer une notification comme lue
router.put('/:id/read', authMiddleware, notificationController.markNotificationRead);

module.exports = router;
```

## Fichier : sweeted-backend\src\routes\officialRoutes.js

```javascript
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const officialController = require('../controllers/officialController');
const authMiddleware = require('../middlewares/authMiddleware');
const permissionMiddleware = require('../middlewares/verifierPermission');

// Configuration multer pour l'upload des images officielles
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', '..', 'uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, 'official-' + uniqueSuffix + ext);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Seules les images sont acceptées.'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5 Mo max
});

// Flux officiel (auth requis)
router.get('/', authMiddleware, officialController.getOfficials);
// Publication officielle : permission publish_official (Admin uniquement)
router.post('/', authMiddleware, permissionMiddleware('publish_official'), upload.single('image'), officialController.createOfficial);
router.put('/:id', authMiddleware, permissionMiddleware('publish_official'), officialController.updateOfficial);
router.delete('/:id', authMiddleware, permissionMiddleware('publish_official'), officialController.deleteOfficial);

// Erreurs multer (filtre type / taille) → réponse JSON propre
router.use((err, req, res, next) => {
    if (err && res.headersSent) {
        return next(err);
    }
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: "L'image ne peut pas dépasser 5 Mo." });
        }
        return res.status(400).json({ message: err.message });
    }
    if (err && err.message === 'Seules les images sont acceptées.') {
        return res.status(400).json({ message: err.message });
    }
    next(err);
});

module.exports = router;
```

## Fichier : sweeted-backend\src\routes\postRoute.js

```javascript
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const postController = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');
const optionalAuthMiddleware = require('../middlewares/optionalAuthMiddleware');
const permissionMiddleware = require('../middlewares/verifierPermission');

// Configuration multer pour l'upload d'images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', '..', 'uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, 'post-' + uniqueSuffix + ext);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'file') {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('La pièce jointe doit être un PDF.'), false);
        }
    } else if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Seules les images sont acceptées.'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10 Mo (images limitées à 5 Mo dans le contrôleur)
});

router.post('/', authMiddleware, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'file', maxCount: 1 }]), postController.createPost);
// Lecture publique autorisée ; token optionnel pour renvoyer has_reacted
router.get('/', optionalAuthMiddleware, postController.getAllPosts);
router.get('/:id', optionalAuthMiddleware, postController.getPostById);
router.put('/:id', authMiddleware, permissionMiddleware('update_post'), postController.updatePost);
router.delete('/:id', authMiddleware, permissionMiddleware('delete_post'), postController.deletePost);

// Erreurs multer (filtre type / taille) → réponse JSON propre
router.use((err, req, res, next) => {
    if (err && res.headersSent) {
        return next(err);
    }
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: "Le fichier ne peut pas dépasser 10 Mo." });
        }
        return res.status(400).json({ message: "Erreur lors de l'upload." });
    }
    if (err && (err.message === 'Seules les images sont acceptées.' || err.message === 'La pièce jointe doit être un PDF.')) {
        return res.status(400).json({ message: err.message });
    }
    next(err);
});

module.exports = router;
```

## Fichier : sweeted-backend\src\routes\sweetRoute.js

```javascript
const express = require('express');
const router = express.Router();
const sweetController = require('../controllers/sweetController');
const authMiddleware = require('../middlewares/authMiddleware');

// Routes: POST /api/sweets/:postId, DELETE /api/sweets/:postId
router.post('/:postId', authMiddleware, sweetController.addSweet);
router.delete('/:postId', authMiddleware, sweetController.removeSweet);

module.exports = router;
```

## Fichier : sweeted-backend\src\routes\userRoutes.js

```javascript
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const userController = require('../controllers/userController');
const socialController = require('../controllers/socialController');
const authMiddleware = require('../middlewares/authMiddleware');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', '..', 'uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, 'avatar-' + uniqueSuffix + ext);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Seules les images sont acceptées.'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

// Recherche d'utilisateurs par matricule ou display_name
router.get('/search', authMiddleware, userController.searchUsers);
// Statistiques d'un utilisateur (abonnés / abonnements / is_following)
router.get('/:id/stats', authMiddleware, socialController.getUserStats);
// Mise à jour du profil
router.put('/me', authMiddleware, upload.single('avatar'), userController.updateProfile);

// Erreurs multer (filtre type / taille) → réponse JSON propre
router.use((err, req, res, next) => {
    if (err && res.headersSent) {
        return next(err);
    }
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: "Le fichier ne peut pas dépasser 5 Mo." });
        }
        return res.status(400).json({ message: err.message });
    }
    if (err && err.message === 'Seules les images sont acceptées.') {
        return res.status(400).json({ message: err.message });
    }
    next(err);
});

module.exports = router;
```

## Fichier : sweeted-backend\uploads\post-1789127285281-800528175

> Fichier volumineux : 51645 lignes / 1.6 Mo - 300 premieres lignes affichees.

```text
PNG

   
IHDR  Ð  Ð   ZS. <caBX <jumb   
jumdc2pa    ª 8qc2pa  <jjumb   Gjumdc2ma    ª 8qurn:uuid:812a392c-3497-4f1f-8e26-adbb0307f325  jumb   )jumdc2as    ª 8qc2pa.assertions  
Üjumb   3jumd@Ë
2»H§
*ÖôCic2pa.thumbnail.claim.jpeg    bfdb image/jpeg  
bidbÿØÿà JFIF      ÿÀ    ÿÛ C 


		


%#
 , #&')*)-0-(0%()(ÿÛ C



(((((((((((((((((((((((((((((((((((((((((((((((((((ÿÄ           	

ÿÄ µ   } !1AQa"q2¡#B±ÁRÑð$3br	
%&'()*456789:CDEFGHIJSTUVWXYZcdefghijstuvwxyz
¢£¤¥¦§¨©ª²³´µ¶·¸¹ºÂÃÄÅÆÇÈÉÊÒÓÔÕÖ×ØÙÚáâãäåæçèéêñòóôõö÷øùúÿÄ        	

ÿÄ µ  w !1AQaq"2B¡±Á	#3RðbrÑ
$4á%ñ&'()*56789:CDEFGHIJSTUVWXYZcdefghijstuvwxyz
¢£¤¥¦§¨©ª²³´µ¶·¸¹ºÂÃÄÅÆÇÈÉÊÒÓÔÕÖ×ØÙÚâãäåæçèéêòóôõö÷øùúÿÚ 
  ? ©^AøàP@ (  
 )R  
 ( ¦H 
 ( ¦H
 (   (  
 (  
 ( ¦H
 (  
 (  
 (  
 (  
 ( ¦H 
` R  
 (  
 (  
`(  
` R   (  
 (  
`( ¦H 
 (  
 )R ¦@ 
` R   
 (  
 ( ¦@ 
 (  
 (  
 (  
 ( ¦H
 (  
 ( ¦H
 (  
 (  
 (  
 (  
 (  
 (  
 (  
 (  
 )R   
 (  
 (  
 (  
 (  
 (  
 (  
 (  
 (  
 (  
 (  
 (   
`(  
 )R  
 ( ¦H
 (  
` R ¦H
 ( ¦H 
`(    R   
` R   
 ( ¦H
 )PH
` R   
 ( ¦H 
 )R   
 (  
 (  
 (  
 (  
`( ¦@ 
 (  
 )R  
`(  
 (  
 (   
 )R  
 )R ¦H
 )P@ )R   
` R  
` R  
`(  
 (  
 ( ¦@ 
 (  
 (  
 ( ¦H
 (  
 (  
 )R  
 (  
 (  
 (  
 (  
 (   (  
 (  
 (  
 (  
 (  
 (   
 (  
 (  
 )R  
 (  
 (  
`(   
`(  
 )P@ 
`(  
 ( ¦H 
`)R ¦@ ( ¦H
 ( ¦H
`)R ¦H ( ¦@ 
 ( ¦H 
 )R ¦H 
 ( ¦H
 ( ¦H
`(  
 (   
 (  
` PH )P@  PH
`)PH
 )PH  R ¦H 
 (    P@ 
`(   )P@ 
 (  
 (  
 (  
` R  
 (  
 (  
`)PH
 )P@ 
 (    R  
 ( ¦H
 (  
 (   
 (   
`(  
 (   
` R ¦H
`)R ¦H
` R   
`(   
 (  
` P@ )P@ 
` P@ ( ¦@  R ¦@ 
 (   
 (  
 ( ¦H ( ¦H 
 (  
 (  
 ( ¦H 
` R  
 (   
`(  
 )R ¦H 
 )R ¦@ 
`(  
 (  
 )R ¦H
 )R ¦@ 
 ( ¦@ )P@ ( ¦H 
 )PH
 )R ¦@  PH  R ¦@ 
` P@ 
 ( ¦H
 ( ¦H 
 )R   
 ( ¦H
 (  
 (  
 ( ¦@ )P@ 
 (  
 )R ¦H ( ¦H
 (  
 )P@ 
`)R  
 (   
 (   
`( ¦H 
 ( ¦H
 (  
 )PH
 ( ¦H
 (   (   
 (   
 ( ¦H 
`(  
 ( ¦H
`(    R ¦H
 (   )PH
 ( ¦H 
 )P@ )R  
 ( ¦@ (   )PH 
`(  
 (  
 )R   
 )R  
 (  
 (  
 ( ¦H ( ¦H
 )R ¦H ( ¦@ ( ¦H
 )P@  PH
 (  
 (  
 (  
 (  
 ( ¦@ 
 (  
 (  
 (  
 (  
 )R  
 ( ¦H
 (  
`(  
 (  
`(  
 (  
 (  
 (  
 (   
` PH
 (  
 ( ¦@ 
 )R  
 (  
` P@ 
`(  
` R   
 ( ¦@ 
`(  
 (  
 )R  
 (   
 )R  
 (  
 (  
 (  
 (   
 )R  
 )PH
 )PH
 ( ¦@ 
 )R  
 ( ¦@ 
` R  
`( ¦@ 
`(   
 (   (  
` R  
`( ¦@ 
 (   
 )R ¦@ 
 )PH
`)PH
 (  
 (  
 (  
 )R ¦H
 )PH
 (  
 ( ¦H
 (  
 ( ¦@ (  
 (  
 (  
 (   
`)R  
 (  
 (  
 (  
 (  
`)R  
```

## Fichier : sweeted-frontend\.env.example

```text
# URL de l'API backend.
# Obligatoire pour tester sur un appareil physique via Expo Go :
# mettre l'IP LAN du PC qui lance le backend (ex : http://192.168.1.10:3000/api).
# Copier ce fichier en `.env.local` (ignoré par git) puis adapter l'IP.
EXPO_PUBLIC_API_URL=http://192.168.1.X:3000/api
```

## Fichier : sweeted-frontend\.gitignore

```text
# Learn more https://docs.github.com/en/get-started/getting-started-with-git/ignoring-files

# dependencies
node_modules/

# Expo
.expo/
dist/
web-build/
expo-env.d.ts

# Native
.kotlin/
*.orig.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision

# Metro
.metro-health-check*

# debug
npm-debug.*
yarn-debug.*
yarn-error.*

# macOS
.DS_Store
*.pem

# local env files
.env
.env*.local

# typescript
*.tsbuildinfo

# generated native folders
/ios
/android
```

## Fichier : sweeted-frontend\App.js

```javascript
import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, 
  StatusBar, ActivityIndicator, Image 
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import ProfileScreen from './components/profil';

// Imports pour la navigation et la gestion des zones sécurisées
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PostDetails from './ecran/PostDetails/PostDetails';
import HomeScreen from './ecran/tabs/index';
import NotificationsScreen from './ecran/Notifications';
import OfficialDetails from './ecran/Officiels/OfficialDetails';
import { API_BASE_URL } from './config/api';
import SweetedSplash from './components/SweetedSplash';
import { COLORS, SPACING, RADIUS, FONTS } from './config/theme';

const Stack = createStackNavigator();

const LoginScreen = () => {
  const navigation = useNavigation();
  const [isLoginView, setIsLoginView] = useState(true);
  const [password, setPassword] = useState('');
  const [matricule, setMatricule] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const handleAuth = async () => {
    if (!matricule.trim() || !password.trim()) {
      setFeedback({ type: 'error', message: 'Veuillez renseigner le matricule et le mot de passe.' });
      return;
    }

    setIsSubmitting(true);
    setFeedback({ type: '', message: '' });

    try {
      const endpoint = isLoginView ? '/auth/login' : '/auth/register';
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matricule_number: matricule.trim(), password })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = data.errors
          ? data.errors.map((error) => error.msg).join('\n')
          : data.message || 'Une erreur est survenue.';
        setFeedback({ type: 'error', message });
        return;
      }

      if (isLoginView) {
        if (data.token) {
          await AsyncStorage.setItem('token', data.token);
          if (data.role) {
            await AsyncStorage.setItem('userRole', String(data.role));
          }
        }

        setFeedback({ type: 'success', message: data.message || 'Connexion réussie.' });
        navigation.navigate('Home');
      } else {
        setFeedback({ type: 'success', message: data.message || 'Inscription réussie.' });
        setIsLoginView(true);
        setPassword('');
        setMatricule('');
      }
    } catch (error) {
      setFeedback({ type: 'error', message: 'Impossible de joindre le serveur. Vérifiez votre connexion.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
    

      <View style={styles.contentContainer}>
        <View style={styles.topSection}>
          {/* Correction ici : Utilisation de blanc en dur pour plus de clarté */}
          <Image 
          source={require('./sweeted_logo-no_background.png')} 
          style={styles.loadingLogo} 
          resizeMode="contain"
        />
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.toggleContainer}>
            <TouchableOpacity 
              style={[styles.toggleButton, isLoginView && styles.activeToggle]} 
              onPress={() => setIsLoginView(true)}
            >
              <Text style={isLoginView ? styles.activeToggleText : styles.inactiveToggleText}>Connexion</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.toggleButton, !isLoginView && styles.activeToggle]} 
              onPress={() => setIsLoginView(false)}
            >
              <Text style={!isLoginView ? styles.activeToggleText : styles.inactiveToggleText}>Inscription</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <Text style={styles.inputLabel}>Numéro matricule:</Text>
            <View style={styles.inputContainer}>
              <Icon name="account-outline" size={22} color={COLORS.textSecondary} />
              <TextInput
                style={styles.textInputStyle}
                placeholder="Ex: 37-40014/24"
                value={matricule}
                onChangeText={setMatricule}
              />
            </View>

            <Text style={styles.inputLabel}>Mot de passe:</Text>
            <View style={styles.inputContainer}>
              <Icon name="lock-outline" size={22} color={COLORS.textSecondary} />
              <TextInput
                style={styles.textInputStyle}
                placeholder="•••••"
                secureTextEntry={!isPasswordVisible}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                <Icon name={isPasswordVisible ? 'eye' : 'eye-off'} size={22} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Bouton de navigation vers l'écran principal */}
          {feedback.message ? (
            <Text style={feedback.type === 'error' ? styles.feedbackError : styles.feedbackSuccess}>
              {feedback.message}
            </Text>
          ) : null}

          <TouchableOpacity 
            style={[styles.loginButton, isSubmitting && styles.loginButtonDisabled]} 
            onPress={handleAuth}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>
                {isLoginView ? 'Se connecter' : "S'inscrire"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default function App() {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [splashDone, setSplashDone] = useState(false);
  const [initialRoute, setInitialRoute] = useState('Login');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.ok) {
            setInitialRoute('Home');
          } else {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('userRole');
          }
        }
      } catch {
        // Erreur réseau — on reste sur Login
      }
      setIsAppLoading(false);
    };
    checkAuth();
  }, []);

  if (!splashDone) {
    return <SweetedSplash onDone={() => setSplashDone(true)} />;
  }

  if (isAppLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Image 
          source={require('./sweeted_logo-no_background.png')} 
          style={styles.loadingLogo} 
          resizeMode="contain"
        />
        <ActivityIndicator size="large" color="#FFFFFF" style={{ marginTop: 20 }} />
      </View>
    );
  }

return (
    <SafeAreaProvider style={{ flex: 1, height: '100%', width: '100%' }}> 
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="PostDetails" component={PostDetails} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="OfficialDetails" component={OfficialDetails} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: { flex: 2, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.headerGreen },
  loadingLogo: { width: 140, height: 140 },
  contentContainer: {flex: 1, overflow: 'hidden', borderRadius: 28, marginBottom: 20},
  topSection: { backgroundColor: COLORS.headerGreen, padding: 30, alignItems: 'center' },
  bottomSection: { flex: 1, backgroundColor: COLORS.formBackground, padding: 20 },
  toggleContainer: { flexDirection: 'row', backgroundColor: COLORS.toggleBackground, borderRadius: 25, height: 50, marginBottom: 20 },
  toggleButton: { flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 25 },
  activeToggle: { backgroundColor: '#20ac4c' },
  activeToggleText: { color: 'white', fontWeight: 'bold' },
  inactiveToggleText: { color: COLORS.white },
  form: { flex: 1 },
  inputLabel: { fontWeight: 'bold', marginBottom: 5, color: COLORS.text },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.textInput, borderRadius: RADIUS.md, paddingHorizontal: 10, height: 50, marginBottom: 15 },
  textInputStyle: { flex: 1, marginLeft: 10 },
  loginButton: { backgroundColor: COLORS.primary, height: 55, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  loginButtonDisabled: { opacity: 0.7 },
  loginButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  feedbackError: { color: '#D64545', marginBottom: 10, textAlign: 'center' },
  feedbackSuccess: { color: COLORS.primary, marginBottom: 10, textAlign: 'center' }
});
```

## Fichier : sweeted-frontend\app.json

```json
{
  "expo": {
    "name": "sweeted",
    "slug": "snack-6880f59d-5af5-4a9e-8019-297e884139ae",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-web-browser",
      "expo-status-bar",
      "expo-font"
    ]
  }
}
```

## Fichier : sweeted-frontend\components\formatTime.js

```javascript
// Formatage relatif commun aux cartes (posts, officiels, notifications)
export function formatRelativeTime(createdAt) {
  if (!createdAt) return '';

  const date = new Date(createdAt);
  if (isNaN(date.getTime())) return '';

  const now = new Date();
  const diffSeconds = Math.floor((now - date) / 1000);

  if (diffSeconds < 60) {
    return "à l'instant";
  }

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) {
    return `il y a ${diffMinutes} min`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `il y a ${diffHours} h`;
  }

  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: diffHours < 24 * 365 ? undefined : 'numeric',
  });
}
```

## Fichier : sweeted-frontend\components\Layout\DesktopHeader.js

```javascript
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS, FONTS } from '../../config/theme';

const ETUDIANT = 'etudiant';
const OFFICIEL = 'officiel';

/**
 * En-tête Desktop (largeur >= 768px).
 * Propose la barre de recherche globale, le toggle de mode et les accès rapides (notifications, profil).
 */
const DesktopHeader = ({
  mode,
  onSetMode,
  onOpenSearch,
  unreadCount = 0,
  avatarUrl,
  navigation,
}) => {
  return (
    <View style={styles.headerContainer}>
      {/* Barre de recherche centrale */}
      <TouchableOpacity
        style={styles.searchBar}
        onPress={onOpenSearch}
        activeOpacity={0.8}
      >
        <Feather name="search" size={18} color={COLORS.textSecondary} style={styles.searchIcon} />
        <Text style={styles.searchPlaceholder}>Rechercher sur Sweeted...</Text>
      </TouchableOpacity>

      {/* Switch de mode Étudiant / Officiel (si applicable) */}
      {(mode === ETUDIANT || mode === OFFICIEL) && (
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, mode === ETUDIANT && styles.activeToggle]}
            onPress={() => onSetMode(ETUDIANT)}
            activeOpacity={0.8}
          >
            <Text style={mode === ETUDIANT ? styles.activeToggleText : styles.toggleText}>
              Étudiant
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, mode === OFFICIEL && styles.activeToggle]}
            onPress={() => onSetMode(OFFICIEL)}
            activeOpacity={0.8}
          >
            <Text style={mode === OFFICIEL ? styles.activeToggleText : styles.toggleText}>
              Officiel
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Actions à droite */}
      <View style={styles.actionsRight}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation?.navigate('Notifications')}
          activeOpacity={0.7}
        >
          <Feather name="bell" size={20} color={COLORS.textDark} />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.profileBtn}
          onPress={() => navigation?.navigate('Profile')}
          activeOpacity={0.7}
        >
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Feather name="user" size={18} color={COLORS.textDark} />
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DesktopHeader;

const styles = StyleSheet.create({
  headerContainer: {
    height: 64,
    backgroundColor: COLORS.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    zIndex: 10,
    ...SHADOWS.small,
  },
  searchBar: {
    flex: 1,
    maxWidth: 420,
    height: 40,
    backgroundColor: COLORS.inputBackground,
    borderRadius: RADIUS.full,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchPlaceholder: {
    color: COLORS.placeholder,
    fontSize: FONTS.sizeBody,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.toggleBackground,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.toggleBorder,
    overflow: 'hidden',
    marginHorizontal: SPACING.lg,
  },
  toggleButton: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.full,
  },
  activeToggle: {
    backgroundColor: COLORS.toggleActive,
  },
  activeToggleText: {
    fontSize: FONTS.sizeBody,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  toggleText: {
    fontSize: FONTS.sizeBody,
    color: COLORS.black,
  },
  actionsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.screenBackground,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  profileBtn: {
    marginLeft: SPACING.xs,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  avatarPlaceholder: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.screenBackground,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: COLORS.danger,
    borderRadius: RADIUS.full,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: 'bold',
  },
});
```

## Fichier : sweeted-frontend\components\Layout\DesktopLayout.js

```javascript
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Sidebar from './Sidebar';
import DesktopHeader from './DesktopHeader';
import { COLORS } from '../../config/theme';

/**
 * Conteneur global pour l'affichage Desktop (>= 768px).
 * Structure l'écran en deux colonnes : Sidebar à gauche, Contenu & Header à droite.
 */
const DesktopLayout = ({
  currentMode,
  onSelectMode,
  onOpenCreatePost,
  onOpenSearch,
  unreadCount,
  avatarUrl,
  navigation,
  children,
}) => {
  return (
    <View style={styles.desktopContainer}>
      {/* 1. Colonne de gauche : Sidebar fixe */}
      <Sidebar
        currentMode={currentMode}
        onSelectMode={onSelectMode}
        onOpenCreatePost={onOpenCreatePost}
        unreadCount={unreadCount}
        avatarUrl={avatarUrl}
        navigation={navigation}
      />

      {/* 2. Colonne de droite : En-tête + Zone de contenu */}
      <View style={styles.mainColumn}>
        <DesktopHeader
          mode={currentMode}
          onSetMode={onSelectMode}
          onOpenSearch={onOpenSearch}
          unreadCount={unreadCount}
          avatarUrl={avatarUrl}
          navigation={navigation}
        />

        <View style={styles.contentArea}>
          {children}
        </View>
      </View>
    </View>
  );
};

export default DesktopLayout;

const styles = StyleSheet.create({
  desktopContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.screenBackground,
    height: '100%',
    width: '100%',
  },
  mainColumn: {
    flex: 1,
    flexDirection: 'column',
    height: '100%',
    minWidth: 0,
  },
  contentArea: {
    flex: 1,
    minHeight: 0,
    backgroundColor: COLORS.screenBackground,
  },
});
```

## Fichier : sweeted-frontend\components\Layout\Sidebar.js

```javascript
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS, FONTS } from '../../config/theme';

const ETUDIANT = 'etudiant';
const OFFICIEL = 'officiel';
const CODE = 'code';
const FICHIERS = 'fichiers';

/**
 * Composant Sidebar pour l'affichage Desktop (largeur >= 768px).
 * Remplace la Bottom Tab Bar mobile.
 */
const Sidebar = ({
  currentMode,
  onSelectMode,
  onOpenCreatePost,
  unreadCount = 0,
  navigation,
  avatarUrl,
}) => {
  const navItems = [
    {
      id: ETUDIANT,
      label: 'Fil d’actualité',
      icon: 'home',
      badge: 0,
    },
    {
      id: OFFICIEL,
      label: 'Officiels',
      icon: 'volume-2',
      badge: 0,
    },
    {
      id: CODE,
      label: 'Sweet Studio',
      icon: 'code',
      badge: 0,
    },
    {
      id: FICHIERS,
      label: 'Fichiers & PDF',
      icon: 'folder',
      badge: 0,
    },
  ];

  return (
    <View style={styles.sidebarContainer}>
      {/* En-tête de la Sidebar avec Logo */}
      <View style={styles.logoSection}>
        <Image
          source={require('../../sweeted_logo-no_background.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      {/* Navigation principale */}
      <View style={styles.navSection}>
        {navItems.map((item) => {
          const isActive = currentMode === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.navItem, isActive && styles.navItemActive]}
              onPress={() => onSelectMode(item.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconWrapper, isActive && styles.iconWrapperActive]}>
                <Feather
                  name={item.icon}
                  size={20}
                  color={isActive ? COLORS.white : COLORS.textSecondary}
                />
              </View>
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Bouton d'action "Créer un post" (si mode étudiant ou officiel) */}
      {(currentMode === ETUDIANT || currentMode === OFFICIEL) && (
        <TouchableOpacity
          style={styles.createPostButton}
          onPress={onOpenCreatePost}
          activeOpacity={0.85}
        >
          <Ionicons name="add-circle-outline" size={20} color={COLORS.white} />
          <Text style={styles.createPostButtonText}>Nouveau post</Text>
        </TouchableOpacity>
      )}

      <View style={styles.spacer} />

      {/* Raccourcis rapides bas de Sidebar */}
      <View style={styles.footerSection}>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => navigation?.navigate('Notifications')}
          activeOpacity={0.7}
        >
          <View style={styles.footerIconWrapper}>
            <Feather name="bell" size={18} color={COLORS.textSecondary} />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
              </View>
            )}
          </View>
          <Text style={styles.footerLabel}>Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => navigation?.navigate('Profile')}
          activeOpacity={0.7}
        >
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
          ) : (
            <View style={styles.footerIconWrapper}>
              <Feather name="user" size={18} color={COLORS.textSecondary} />
            </View>
          )}
          <Text style={styles.footerLabel}>Mon Profil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Sidebar;

const styles = StyleSheet.create({
  sidebarContainer: {
    width: 300,
    backgroundColor: COLORS.cardBackground,
    borderRightWidth: 1,
    borderRightColor: COLORS.divider,
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    flexDirection: 'column',
    height: '100%',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  logoImage: {
    width: 140,
    height: 70,
  },
  tagline: {
    fontSize: FONTS.sizeSmall,
    color: COLORS.textMuted,
    fontWeight: '500',
    marginTop: -4,
  },
  navSection: {
    gap: SPACING.sm,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.lg,
    gap: SPACING.md,
    backgroundColor: 'transparent',
  },
  navItemActive: {
    backgroundColor: COLORS.toggleActive,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.screenBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapperActive: {
    backgroundColor: COLORS.primary,
  },
  navLabel: {
    fontSize: FONTS.sizeBody,
    color: COLORS.textDark,
    fontWeight: '500',
  },
  navLabelActive: {
    fontSize: FONTS.sizeBody,
    color: COLORS.primaryDark,
    fontWeight: '700',
  },
  createPostButton: {
    marginTop: SPACING.xl,
    backgroundColor: COLORS.headerGreen,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.full,
    gap: SPACING.sm,
    ...SHADOWS.medium,
  },
  createPostButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizeBody,
    fontWeight: '700',
  },
  spacer: {
    flex: 1,
  },
  footerSection: {
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    paddingTop: SPACING.md,
    gap: SPACING.xs,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.md,
    gap: SPACING.md,
  },
  footerIconWrapper: {
    position: 'relative',
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.screenBackground,
  },
  footerLabel: {
    fontSize: FONTS.sizeBody,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: COLORS.danger,
    borderRadius: RADIUS.full,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: 'bold',
  },
});
```

## Fichier : sweeted-frontend\components\Post.js

```javascript
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Entypo, Ionicons, MaterialCommunityIcons as MIcon } from '@expo/vector-icons';
import ReactionButton from './ReactionButton';
import { formatRelativeTime } from './formatTime';
import { COLORS } from '../config/theme';

export default function Post({ post, onReact, currentUserId, role, onDelete, onEdit, onBookmark, onOpenFile }) {
  const [showMenu, setShowMenu] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isAuthor = currentUserId && Number(post.user_id) === Number(currentUserId);
  const isMod = role === 'Admin' || role === 'Modérateur';
  const canManage = (isAuthor || isMod) && !!(onDelete || onEdit);
  const isBookmarked = !!post.is_bookmarked;
  const hasAttachment = !!post.file_id && post.file_type === 'file';

  const handleEdit = () => {
    setShowMenu(false);
    if (onEdit) onEdit(post);
  };

  const handleDelete = () => {
    setShowMenu(false);
    setConfirmDelete(false);
    if (onDelete) onDelete(post.id);
  };

  const toggleMenu = (e) => {
    if (e) e.stopPropagation();
    setShowMenu(prev => !prev);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image source={{ uri: post.avatar }} style={styles.avatar} />
          <View>
            <Text style={styles.user}>{post.user}</Text>
            <Text style={styles.time}>{formatRelativeTime(post.created_at)}</Text>
          </View>
        </View>

        {canManage && (
          <TouchableOpacity
            onPress={toggleMenu}
            style={styles.optionsButton}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            activeOpacity={0.6}
          >
            <Entypo name="dots-three-horizontal" size={20} color={COLORS.textDark} />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.content}>{post.content}</Text>

      {post.image && (
        <Image source={{ uri: post.image }} style={styles.postImage} />
      )}

      {hasAttachment && onOpenFile ? (
        <TouchableOpacity
          style={styles.attachmentChip}
          onPress={() => onOpenFile(post)}
          activeOpacity={0.7}
        >
          <MIcon name="file-pdf-box" size={20} color={COLORS.danger} />
          <Text style={styles.attachmentName} numberOfLines={1}>
            {post.file_name || 'Pièce jointe'}
          </Text>
          <View style={styles.attachmentBadge}>
            <Text style={styles.attachmentBadgeText}>PDF</Text>
          </View>
        </TouchableOpacity>
      ) : null}

      <View style={styles.footer}>
        <ReactionButton 
          total={post.totalReactions} 
          hasReacted={post.has_reacted}
          topEmojis={post.topEmojis}
          onReact={onReact}
          postId={post.id}
        />
        {onBookmark ? (
          <TouchableOpacity
            onPress={() => onBookmark(post.id, !isBookmarked)}
            style={styles.bookmarkButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.6}
          >
            <Ionicons
              name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
              size={22}
              color={isBookmarked ? COLORS.primary : COLORS.textSecondary}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Dropdown menu ancré à la carte (fonctionne sur web + mobile) */}
      {showMenu && (
        <View style={styles.dropdownOverlay}>
          <TouchableOpacity style={styles.dropdownBackdrop} onPress={() => setShowMenu(false)} />
          <View style={styles.dropdown}>
            <Text style={styles.menuTitle}>Options du post</Text>
            {isAuthor ? (
              <TouchableOpacity style={styles.menuItem} onPress={handleEdit}>
                <Ionicons name="pencil-outline" size={20} color={COLORS.textDark} />
                <Text style={styles.menuItemText}>Modifier le post</Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity style={[styles.menuItem, styles.menuItemDanger]} onPress={() => { setShowMenu(false); setConfirmDelete(true); }}>
              <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
              <Text style={[styles.menuItemText, { color: COLORS.danger }]}>Supprimer le post</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowMenu(false)}>
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Confirmation de suppression */}
      {confirmDelete && (
        <View style={styles.confirmOverlay}>
          <TouchableOpacity style={styles.confirmBackdrop} onPress={() => setConfirmDelete(false)} />
          <View style={styles.confirmBox}>
            <Text style={styles.confirmTitle}>Confirmer la suppression</Text>
            <Text style={styles.confirmSubTitle}>Voulez-vous vraiment supprimer ce post ?</Text>
            <View style={styles.confirmActions}>
              <TouchableOpacity style={styles.confirmCancelBtn} onPress={() => setConfirmDelete(false)}>
                <Text style={styles.confirmCancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmDeleteBtn} onPress={handleDelete}>
                <Text style={styles.confirmDeleteText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 15,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#ddd',
  },
  user: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000',
  },
  time: {
    fontSize: 11,
    color: '#999',
    marginTop: 1,
  },
  content: {
    fontSize: 16,
    color: '#1c1e21',
    lineHeight: 22,
    marginBottom: 10,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#eee',
  },
  attachmentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F7',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginBottom: 10,
    gap: 8,
  },
  attachmentName: {
    flex: 1,
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  attachmentBadge: {
    backgroundColor: COLORS.danger,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  attachmentBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 5,
    borderTopWidth: 1,
    borderTopColor: '#F0F2F5',
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bookmarkButton: {
    padding: 6,
    borderRadius: 20,
  },
  optionsButton: {
    padding: 8,
    borderRadius: 20,
  },
  dropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
  },
  dropdownBackdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 40,
  },
  dropdown: {
    position: 'absolute',
    top: 48,
    right: 10,
    zIndex: 50,
    width: 220,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuItemDanger: {
    borderBottomWidth: 0,
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  cancelButton: {
    marginTop: 15,
    paddingVertical: 10,
    backgroundColor: '#F5F5F7',
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontWeight: 'bold',
    color: '#666',
  },
  confirmOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 60,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
  },
  confirmBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 15,
  },
  confirmBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  confirmTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 8,
  },
  confirmSubTitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  confirmActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  confirmCancelBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: '#F0F2F5',
    alignItems: 'center',
  },
  confirmCancelText: {
    fontWeight: '600',
    color: '#444',
  },
  confirmDeleteBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: COLORS.danger,
    alignItems: 'center',
  },
  confirmDeleteText: {
    fontWeight: 'bold',
    color: 'white',
  },
});
```

## Fichier : sweeted-frontend\components\profil.js

```javascript
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator, TextInput, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { apiFetch } from '../config/apiClient';
import { API_BASE_URL } from '../config/api';
import { COLORS, SPACING } from '../config/theme';

const assetUrl = (url) => {
  if (!url) return null;
  return url.startsWith('http') ? url : `${API_BASE_URL.replace('/api', '')}${url}`;
};

export default function ProfileScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editVisible, setEditVisible] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [filiere, setFiliere] = useState('');
  const [avatarUri, setAvatarUri] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const [createUserVisible, setCreateUserVisible] = useState(false);
  const [cuMatricule, setCuMatricule] = useState('');
  const [cuPassword, setCuPassword] = useState('');
  const [cuRole, setCuRole] = useState('1');
  const [cuSaving, setCuSaving] = useState(false);
  const [cuFeedback, setCuFeedback] = useState({ type: '', message: '' });

  const ROLES = [
    { id: '1', label: 'Admin' },
    { id: '2', label: 'Modérateur' },
    { id: '3', label: 'Utilisateur' },
  ];

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

  const fetchProfile = async () => {
    setLoading(true);
    setError('');

    const result = await apiFetch('/auth/me');

    if (result.ok && result.data) {
      setUser(result.data);
      const statsResult = await apiFetch(`/users/${result.data.id}/stats`);
      if (statsResult.ok) {
        setStats(statsResult.data);
      }
      const bookmarksResult = await apiFetch('/bookmarks');
      if (bookmarksResult.ok) {
        setBookmarks((bookmarksResult.data || []).map(b => ({
          ...b,
          user: b.display_name || `Utilisateur ${b.user_id}`,
          avatar: b.avatar_url || `https://i.pravatar.cc/150?u=user${b.user_id}`,
          totalReactions: Number(b.total_reactions) || 0,
          has_reacted: !!b.has_reacted,
          is_bookmarked: true,
          image: b.image_url ? assetUrl(b.image_url) : null,
        })));
      }
    } else {
      if (result.errorType === 'auth') {
        setError('Vous devez être connecté pour voir votre profil.');
      } else {
        setError(result.data?.message || 'Impossible de charger le profil.');
      }
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userRole');
    } catch {}
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  const openEdit = () => {
    if (!user) return;
    setDisplayName(user.display_name || '');
    setBio(user.bio || '');
    setFiliere(user.filiere || '');
    setAvatarUri(null);
    setSaveError('');
    setEditVisible(true);
  };

  const pickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setSaveError('Permission d\'accès à la galerie refusée.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.[0]) {
      setAvatarUri(result.assets[0].uri);
      setSaveError('');
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    setSaveError('');

    const formData = new FormData();
    if (displayName.trim()) formData.append('display_name', displayName.trim());
    if (bio.trim()) formData.append('bio', bio.trim());
    if (filiere.trim()) formData.append('filiere', filiere.trim());

    if (avatarUri) {
      const filename = avatarUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      formData.append('avatar', { uri: avatarUri, name: filename, type });
    }

    const result = await apiFetch('/users/me', { method: 'PUT', body: formData });
    setSaving(false);

    if (result.ok) {
      setEditVisible(false);
      fetchProfile();
      return;
    }

    if (result.errorType === 'validation') {
      setSaveError(result.data?.message || 'Veuillez vérifier les champs du profil.');
    } else if (result.errorType === 'server') {
      setSaveError('Le serveur a rencontré une erreur lors de la sauvegarde.');
    } else {
      setSaveError(result.data?.message || 'Impossible de mettre à jour le profil.');
    }
  };

  const openCreateUser = () => {
    setCuMatricule('');
    setCuPassword('');
    setCuRole('1');
    setCuFeedback({ type: '', message: '' });
    setCreateUserVisible(true);
  };

  const submitCreateUser = async () => {
    if (!cuMatricule.trim()) {
      setCuFeedback({ type: 'error', message: 'Le matricule est requis.' });
      return;
    }
    if (cuPassword.length < 8) {
      setCuFeedback({ type: 'error', message: 'Le mot de passe doit contenir au moins 8 caractères.' });
      return;
    }
    setCuSaving(true);
    setCuFeedback({ type: '', message: '' });
    const result = await apiFetch('/auth/create-user', {
      method: 'POST',
      body: JSON.stringify({
        matricule_number: cuMatricule.trim(),
        password: cuPassword,
        id_role: Number(cuRole),
      }),
    });
    setCuSaving(false);
    if (result.ok) {
      setCuFeedback({ type: 'success', message: result.data?.message || 'Utilisateur créé.' });
      setTimeout(() => setCreateUserVisible(false), 1200);
    } else {
      setCuFeedback({
        type: 'error',
        message: result.data?.message || 'Impossible de créer l\'utilisateur.',
      });
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </View>
    );
  }

  const displayNameLabel = user?.display_name || user?.matricule_number || 'Utilisateur';
  const tag = `@${user?.matricule_number || ''}`;
  const avatar = assetUrl(user?.avatar_url) || 'https://via.placeholder.com/100';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil</Text>
        <TouchableOpacity onPress={openEdit}>
          <Ionicons name="create-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.profileSection}>
            <Image source={{ uri: avatar }} style={styles.avatar} />
            <Text style={styles.userName}>{displayNameLabel}</Text>
            <Text style={styles.userTag}>{tag}</Text>
            {user?.filiere ? (
              <Text style={styles.userFiliere}>
                <Ionicons name="school-outline" size={13} color={COLORS.textMuted} /> {user.filiere}
              </Text>
            ) : null}
            {user?.bio ? <Text style={styles.userBio}>{user.bio}</Text> : null}
            <TouchableOpacity style={styles.editButton} onPress={openEdit}>
              <Ionicons name="create-outline" size={16} color={COLORS.primary} />
              <Text style={styles.editButtonText}>Modifier le profil</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{stats?.followers_count ?? 0}</Text>
              <Text style={styles.statLabel}>Abonnés</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{stats?.following_count ?? 0}</Text>
              <Text style={styles.statLabel}>Abonnements</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{bookmarks.length}</Text>
              <Text style={styles.statLabel}>Enregistrés</Text>
            </View>
          </View>

          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>Vos enregistrements</Text>
            {bookmarks.length === 0 ? (
              <Text style={styles.emptyBookmarks}>
                Aucun post enregistré pour le moment. Touchez le signet sur un post pour le retrouver ici.
              </Text>
            ) : (
              bookmarks.map(item => (
                <TouchableOpacity
                  key={item.id.toString()}
                  style={styles.bookmarkRow}
                  onPress={() => navigation.navigate('PostDetails', { post: item })}
                >
                  <View style={styles.bookmarkLeft}>
                    <Ionicons name="bookmark" size={18} color={COLORS.primary} />
                    <View style={styles.bookmarkTextContainer}>
                      <Text style={styles.bookmarkContent} numberOfLines={2}>{item.content || '(post sans texte)'}</Text>
                      <Text style={styles.bookmarkMeta}>{item.user} · {item.totalReactions} réaction{item.totalReactions > 1 ? 's' : ''}</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#CCC" />
                </TouchableOpacity>
              ))
            )}
          </View>

          {user?.role === 'Admin' ? (
            <View style={styles.menuSection}>
              <Text style={styles.sectionTitle}>Administration</Text>
              <TouchableOpacity style={styles.bookmarkRow} onPress={openCreateUser}>
                <View style={styles.bookmarkLeft}>
                  <Ionicons name="person-add-outline" size={20} color={COLORS.primary} />
                  <View style={styles.bookmarkTextContainer}>
                    <Text style={styles.bookmarkContent}>Créer un compte utilisateur</Text>
                    <Text style={styles.bookmarkMeta}>Admin · Modérateur · Utilisateur</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#CCC" />
              </TouchableOpacity>
            </View>
          ) : null}

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Déconnexion</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      <Modal
        visible={editVisible}
        transparent
        animationType="slide"
        onRequestClose={() => !saving && setEditVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Modifier le profil</Text>
              <TouchableOpacity onPress={() => setEditVisible(false)} disabled={saving}>
                <Ionicons name="close" size={26} color={COLORS.textDark} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <TouchableOpacity style={styles.avatarPicker} onPress={pickAvatar} disabled={saving}>
                <Image
                  source={{ uri: avatarUri || avatar }}
                  style={styles.avatarPreview}
                />
                <Text style={styles.avatarPickerText}>Changer la photo</Text>
              </TouchableOpacity>

              <Text style={styles.inputLabel}>Nom d'affichage (max 100)</Text>
              <TextInput
                style={styles.input}
                value={displayName}
                onChangeText={setDisplayName}
                maxLength={100}
                editable={!saving}
              />

              <Text style={styles.inputLabel}>Filière (max 100)</Text>
              <TextInput
                style={styles.input}
                value={filiere}
                onChangeText={setFiliere}
                maxLength={100}
                placeholder="Ex : Génie Logiciel"
                placeholderTextColor={COLORS.placeholder}
                editable={!saving}
              />

              <Text style={styles.inputLabel}>Bio (max 280)</Text>
              <TextInput
                style={[styles.input, styles.bioInput]}
                value={bio}
                onChangeText={setBio}
                maxLength={280}
                multiline
                placeholder="Quelques mots sur vous..."
                placeholderTextColor={COLORS.placeholder}
                editable={!saving}
              />

              {saveError ? <Text style={styles.saveError}>{saveError}</Text> : null}

              <TouchableOpacity
                style={[styles.submitButton, saving && styles.submitButtonDisabled]}
                onPress={saveProfile}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.submitButtonText}>Enregistrer</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={createUserVisible}
        transparent
        animationType="slide"
        onRequestClose={() => !cuSaving && setCreateUserVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Créer un compte</Text>
              <TouchableOpacity onPress={() => setCreateUserVisible(false)} disabled={cuSaving}>
                <Ionicons name="close" size={26} color={COLORS.textDark} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <Text style={styles.inputLabel}>Matricule</Text>
              <TextInput
                style={styles.input}
                value={cuMatricule}
                onChangeText={setCuMatricule}
                placeholder="Ex : 5-40014/25"
                placeholderTextColor={COLORS.placeholder}
                editable={!cuSaving}
                autoCapitalize="none"
              />

              <Text style={styles.inputLabel}>Mot de passe (min 8)</Text>
              <TextInput
                style={styles.input}
                value={cuPassword}
                onChangeText={setCuPassword}
                secureTextEntry
                editable={!cuSaving}
              />

              <Text style={styles.inputLabel}>Rôle</Text>
              <View style={styles.roleRow}>
                {ROLES.map(role => (
                  <TouchableOpacity
                    key={role.id}
                    style={[styles.roleChip, cuRole === role.id && styles.roleChipActive]}
                    onPress={() => setCuRole(role.id)}
                    disabled={cuSaving}
                  >
                    <Text style={cuRole === role.id ? styles.roleChipTextActive : styles.roleChipText}>
                      {role.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {cuFeedback.message ? (
                <Text style={cuFeedback.type === 'error' ? styles.saveError : styles.feedbackSuccess}>
                  {cuFeedback.message}
                </Text>
              ) : null}

              <TouchableOpacity
                style={[styles.submitButton, cuSaving && styles.submitButtonDisabled]}
                onPress={submitCreateUser}
                disabled={cuSaving}
              >
                {cuSaving ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.submitButtonText}>Créer le compte</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.screenBackground,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  errorText: {
    color: COLORS.danger,
    textAlign: 'center',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileSection: {
    alignItems: 'center',
    padding: 25,
    backgroundColor: 'white',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EEE',
    marginBottom: 12,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  userTag: {
    fontSize: 14,
    color: '#888',
    marginTop: 3,
  },
  userFiliere: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 6,
  },
  userBio: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  editButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginVertical: 10,
    paddingVertical: 15,
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
  },
  menuSection: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptyBookmarks: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontStyle: 'italic',
  },
  bookmarkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  bookmarkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  bookmarkTextContainer: {
    flex: 1,
  },
  bookmarkContent: {
    fontSize: 14,
    color: '#222',
  },
  bookmarkMeta: {
    fontSize: 12,
    color: '#888',
    marginTop: 3,
  },
  logoutButton: {
    marginTop: 5,
    marginBottom: 30,
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FFF0F0',
    alignItems: 'center',
  },
  logoutText: {
    color: COLORS.danger,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  avatarPicker: {
    alignItems: 'center',
    marginBottom: 18,
  },
  avatarPreview: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#EEE',
  },
  avatarPickerText: {
    marginTop: 8,
    color: COLORS.primary,
    fontWeight: '600',
  },
  inputLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: COLORS.textDark,
  },
  bioInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveError: {
    color: COLORS.danger,
    marginTop: 12,
    textAlign: 'center',
  },
  feedbackSuccess: {
    color: COLORS.primary,
    marginTop: 12,
    textAlign: 'center',
  },
  roleRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  roleChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: COLORS.inputBackground || '#F5F5F5',
    alignItems: 'center',
  },
  roleChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  roleChipText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  roleChipTextActive: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 18,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
```

## Fichier : sweeted-frontend\components\ReactionButton.js

```javascript
import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { apiFetch } from '../config/apiClient';
import { COLORS } from '../config/theme';

export default function ReactionButton({ total, hasReacted: initialHasReacted = false, onReact, postId }) {
  const [isReacting, setIsReacting] = useState(false);
  const [hasReacted, setHasReacted] = useState(initialHasReacted);
  const [reactionCount, setReactionCount] = useState(total);
  const [error, setError] = useState('');

const handleToggleReact = async (e) => {
    if (e) e.stopPropagation();
    setIsReacting(true);
    setError('');

    const method = hasReacted ? 'DELETE' : 'POST';
    const result = await apiFetch(`/sweets/${postId}`, {
      method,
      body: JSON.stringify({}),
    });

    if (result.ok) {
      const newHasReacted = !hasReacted;
      setHasReacted(newHasReacted);
      setReactionCount(prev => (newHasReacted ? prev + 1 : Math.max(0, prev - 1)));
      if (onReact) onReact(newHasReacted);
    } else {
      let message;
      if (result.errorType === 'auth') {
        message = 'Vous devez être connecté pour réagir.';
      } else {
        message = result.data?.message || 'Impossible d\'enregistrer la réaction.';
      }
      setError(message);
    }

    setIsReacting(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.totalContainer}>
          <Icon name="heart" size={14} color={COLORS.reaction} />
          <Text style={styles.totalText}>{reactionCount}</Text>
        </View>

        <TouchableOpacity
          onPress={handleToggleReact}
          disabled={isReacting}
          style={[styles.mainButton, hasReacted && styles.mainButtonActive]}
          activeOpacity={0.7}
        >
          <Icon name={hasReacted ? "heart" : "heart-outline"} size={24} color={hasReacted ? COLORS.danger : COLORS.reaction} />
          <Text style={[styles.reactText, hasReacted && styles.reactTextActive]}>
            {hasReacted ? "J'aime déjà" : "Aimer"}
          </Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  totalText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.reaction,
  },
  mainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    gap: 8,
  },
  mainButtonActive: {
    backgroundColor: '#FFE6E6',
  },
  reactText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  reactTextActive: {
    color: COLORS.danger,
  },
  errorText: {
    marginTop: 6,
    color: COLORS.danger,
    fontSize: 12,
    textAlign: 'center',
  },
});
```

## Fichier : sweeted-frontend\components\ScrollProgress.js

```javascript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { COLORS } from '../config/theme';

const SIZE = 60;
const STROKE = 6;
const R = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * R;
const CENTER = SIZE / 2;

// Anneau circulaire de progression du scroll avec pourcentage.
export default function ScrollProgress({ progress }) {
  const p = Math.min(1, Math.max(0, progress || 0));
  const pct = Math.round(p * 100);
  return (
    <View style={styles.wrap} pointerEvents="none">
      <Svg width={SIZE} height={SIZE}>
        <Circle cx={CENTER} cy={CENTER} r={R} stroke={COLORS.divider} strokeWidth={STROKE} fill="none" />
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={R}
          stroke={COLORS.primary}
          strokeWidth={STROKE}
          fill="none"
          strokeDasharray={CIRC + ' ' + CIRC}
          strokeDashoffset={CIRC * (1 - p)}
          strokeLinecap="round"
          transform={'rotate(-90 ' + CENTER + ' ' + CENTER + ')'}
        />
      </Svg>
      <View style={styles.labelWrap}>
        <Text style={styles.label}>{pct}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelWrap: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
});
```

## Fichier : sweeted-frontend\components\SweetedSplash.js

```javascript
import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, Easing } from 'react-native';
import { COLORS } from '../config/theme';

const LOGO = require('../sweeted_logo-no_background.png');

const SIZE = 300;
const BAND1 = 0.32;
const BAND2 = 0.32;

const revealStyle = (v, length) => ({
  width: v.interpolate({ inputRange: [0, 1], outputRange: [0, length] }),
});

export default function SweetedSplash({ onDone }) {
  const topW = useRef(new Animated.Value(0)).current;
  const topY = useRef(new Animated.Value(-26)).current;
  const textW = useRef(new Animated.Value(0)).current;
  const bottomW = useRef(new Animated.Value(0)).current;
  const bottomY = useRef(new Animated.Value(26)).current;
  const pop = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const sequence = Animated.sequence([
      Animated.delay(150),
      Animated.parallel([
        Animated.timing(topW, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(topY, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
      ]),
      Animated.delay(220),
      Animated.timing(textW, {
        toValue: 1,
        duration: 650,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
      Animated.delay(250),
      Animated.parallel([
        Animated.timing(bottomW, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(bottomY, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
      ]),
      Animated.delay(150),
      Animated.sequence([
        Animated.timing(pop, {
          toValue: 1.06,
          duration: 170,
          useNativeDriver: false,
        }),
        Animated.timing(pop, {
          toValue: 1,
          duration: 230,
          useNativeDriver: false,
        }),
      ]),
      Animated.delay(250),
    ]);
    sequence.start(({ finished }) => {
      if (finished && onDone) onDone();
    });
    return () => sequence.stop();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ scale: pop }] }}>
        <Animated.View style={[styles.band, styles.bandTop, revealStyle(topW, SIZE), { transform: [{ translateY: topY }] }]}>
          <Image source={LOGO} style={[styles.logoImg, { marginTop: 0 }]} />
        </Animated.View>
        <Animated.View style={[styles.band, styles.bandText, revealStyle(textW, SIZE)]}>
          <Image source={LOGO} style={[styles.logoImg, { marginTop: -SIZE * BAND1 }]} />
        </Animated.View>
        <Animated.View style={[styles.band, styles.bandBottom, revealStyle(bottomW, SIZE), { transform: [{ translateY: bottomY }] }]}>
          <Image source={LOGO} style={[styles.logoImg, { marginTop: -SIZE * (BAND1 + BAND2) }]} />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  band: {
    overflow: 'hidden',
  },
  bandTop: {
    height: SIZE * BAND1,
  },
  bandText: {
    height: SIZE * BAND2,
  },
  bandBottom: {
    height: SIZE * (1 - BAND1 - BAND2),
  },
  logoImg: {
    width: SIZE,
    height: SIZE,
  },
});
```

## Fichier : sweeted-frontend\config\api.js

```javascript
import { Platform } from 'react-native';

const getApiUrl = () => {
  const fromEnv = (process.env.EXPO_PUBLIC_API_URL || '').trim().replace(/\/+$/,'');
  if (fromEnv) {
    return fromEnv;
  }
  if (__DEV__) {
    // Android emulator: http://10.0.2.2:3000/api
    // Device physique: remplacer par l'IP LAN (ex: http://192.168.1.X:3000/api)
    // Web / iOS simulator: http://localhost:3000/api
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:3000/api';
    }
    return 'http://localhost:3000/api';
  }
  return 'https://api.sweeted.mg/api';
};

export const API_BASE_URL = getApiUrl();

// Racine du serveur (sans le préfixe /api) pour les fichiers statiques
export const SERVER_URL = API_BASE_URL.replace(/\/api\/?$/, '');

// URL publique d'un fichier stocké sur disque (path renvoyé par l'API)
export const fileUrl = (path) => (path ? `${SERVER_URL}${path}` : null);
```

## Fichier : sweeted-frontend\config\apiClient.js

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from './api';

/**
 * Client API centralisé pour Sweeted.
 *
 * @param {string} path - chemin relatif de l'endpoint, ex. '/posts'
 * @param {object} options - options passées à fetch(méthode, body, headers...)
 * @returns {Promise<{ ok: boolean, status: number|null, data: object|null, errorType: string|null }>}
 *   errorType vaut 'network' | 'auth' | 'validation' | 'server' | 'other' | null
 */
export async function apiFetch(path, options = {}) {
  let token = null;
  try {
    token = await AsyncStorage.getItem('token');
  } catch {
    // AsyncStorage inaccessible — on continue sans token (le serveur renverra 401 si besoin)
    token = null;
  }

  const headers = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // On ajoute Content-Type si un body JSON est envoyé et qu'aucun Content-Type n'est fourni
  // Si c'est un FormData (upload d'image), on ne met PAS de Content-Type
  // (le navigateur le définit automatiquement avec le boundary)
  const isFormData = options.body instanceof FormData;
  const hasJsonBody = options.body && typeof options.body === 'string';
  if (hasJsonBody && !options.headers?.['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        ...headers,
        ...options.headers,
      },
    });
    clearTimeout(timeoutId);

    let data = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json().catch(() => null);
    } else {
      const text = await response.text().catch(() => null);
      data = text ? { message: text } : null;
    }

    if (!data) {
      data = { message: 'Réponse vide du serveur.' };
    }

    if (response.ok) {
      return { ok: true, status: response.status, data, errorType: null };
    }

    let errorType;
    if (response.status === 401) {
      errorType = 'auth';
    } else if (response.status === 400 || response.status === 422) {
      errorType = 'validation';
    } else if (response.status >= 500) {
      errorType = 'server';
    } else {
      errorType = 'other';
    }

    return { ok: false, status: response.status, data, errorType };
  } catch (error) {
    return {
      ok: false,
      status: null,
      data: { message: 'Impossible de joindre le serveur. Vérifiez votre connexion.', details: (error && error.message) || String(error) },
      errorType: 'network',
    };
  }
}
```

## Fichier : sweeted-frontend\config\fileUpload.js

```javascript
import { File as ExpoFsFile } from 'expo-file-system';

// Upload compatible expo/fetch (WinterCG).
// - Les objets { uri, name, type } sont refuses (Unsupported FormDataPart).
// - Les objets File aussi : append() veut ecraser .name (lecture seule).
// - fetch(file://) renvoie un faux succes de 14 octets ('File not found').
// => lecture native via expo-file-system (arrayBuffer), envoi comme Blob
// type + filename en 3e argument (standard).
function shortUri(uri) {
  try {
    const s = String(uri || '');
    return s.split(':')[0] + ' (len=' + s.length + ')';
  } catch (e) {
    return 'unknown';
  }
}

function xhrToBlob(uri) {
  return new Promise(function (resolve, reject) {
    try {
      var xhr = new XMLHttpRequest();
      xhr.onload = function () { resolve({ response: xhr.response, status: xhr.status }); };
      xhr.onerror = function () { reject(new Error('xhr status=' + xhr.status)); };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    } catch (e) {
      reject(e);
    }
  });
}

function errMsg(e) {
  return (e && e.message ? e.message : String(e));
}

function logDebug(msg) {
  try { console.log('[upload-debug] ' + msg); } catch (ignored) {}
}

export async function appendFilePart(formData, field, uri, name, mime) {
  const debug = [];
  debug.push('uri=' + shortUri(uri));
  let part = null;

  try {
    const f = new ExpoFsFile(uri);
    const buf = await f.arrayBuffer();
    if (buf && buf.byteLength >= 64) {
      part = new Blob([new Uint8Array(buf)], { type: mime });
      debug.push('expo-fs: ' + buf.byteLength + ' bytes');
    } else {
      debug.push('expo-fs: too small (' + (buf && buf.byteLength) + ')');
    }
  } catch (e) {
    debug.push('expo-fs: ' + errMsg(e));
  }

  if (!part) {
    try {
      const response = await fetch(uri);
      const b = await response.blob();
      if (b && b.size >= 64) {
        part = (b.type === mime) ? b : b.slice(0, b.size, mime);
        debug.push('fetch: ' + b.size + ' bytes');
      } else {
        debug.push('fetch: too small (' + (b && b.size) + ')');
      }
    } catch (e) {
      debug.push('fetch: ' + errMsg(e));
    }
  }

  if (!part) {
    try {
      const r = await xhrToBlob(uri);
      const b = r.response;
      if (b && b.size >= 64) {
        part = (b.type === mime) ? b : b.slice(0, b.size, mime);
        debug.push('xhr: ' + b.size + ' bytes');
      } else {
        debug.push('xhr: too small (' + (b && b.size) + ')');
      }
    } catch (e) {
      debug.push('xhr: ' + errMsg(e));
    }
  }

  if (!part) {
    const msg = debug.join(' | ');
    logDebug(msg);
    return { ok: false, debug: msg };
  }
  try {
    formData.append(field, part, name);
  } catch (e) {
    const msg = debug.join(' | ') + ' | append: ' + errMsg(e);
    logDebug(msg);
    return { ok: false, debug: msg };
  }
  const msg = debug.join(' | ');
  logDebug(msg);
  return { ok: true, debug: msg };
}
```

## Fichier : sweeted-frontend\config\openPdf.js

```javascript
import * as WebBrowser from 'expo-web-browser';
import { Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from './api';

// Lecture d'un PDF dans le navigateur système (jamais de lecteur natif maison)
// Fallback sur Linking.openURL si le navigateur système échoue.
export async function openPdf(url) {
  try {
    await WebBrowser.openBrowserAsync(url);
  } catch {
    try {
      await Linking.openURL(url);
    } catch {
      return false;
    }
  }
  return true;
}

// URL de téléchargement authentifiée : le navigateur système ne peut pas
// envoyer d'en-tête Authorization, le token passe donc en ?token=
// (exception documentée côté backend, route /files/:id/download uniquement).
export async function downloadFileUrl(fileId) {
  let token = null;
  try {
    token = await AsyncStorage.getItem('token');
  } catch {
    token = null;
  }
  return `${API_BASE_URL}/files/${fileId}/download${token ? `?token=${encodeURIComponent(token)}` : ''}`;
}
```

## Fichier : sweeted-frontend\config\theme.js

```javascript
// Thème partagé Sweeted
// Capture uniquement les couleurs et constantes déjà utilisées dans le projet,
// sans introduire de nouvelle palette, afin de rester cohérent visuellement.

export const COLORS = {
  // Verts Sweeted
  primary: '#00B43C',
  primaryDark: '#009A32',
  headerGreen: '#00B43C',
  toggleBackground: '#3bcc7c',
  toggleActive: '#b5e8c4',
  toggleBorder: '#198048',

  // Fonds
  background: '#FFFFFF',
  screenBackground: '#F5F5F5',
  formBackground: '#F5F5F7',
  inputBackground: '#F0F2F5',
  cardBackground: '#FFFFFF',
  divider: '#F0F0F0',
  toggleInactive: '#E0E0E0',
  textInput: '#E8E8E8',

  // Textes
  text: '#121212',
  textPrimary: '#000000',
  textDark: '#333333',
  textSecondary: '#6A6A6A',
  textMuted: '#888888',
  textLight: '#999999',
  placeholder: '#999999',

  // Accents
  reaction: '#E85D75',
  danger: '#FF5B5B',
  disabled: '#CCCCCC',
  white: '#FFFFFF',
  black: '#000000',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 15,
  xl: 20,
  xxl: 30,
};

export const RADIUS = {
  sm: 8,
  md: 10,
  lg: 12,
  xl: 15,
  xxl: 20,
  fab: 28,
  full: 9999,
};

export const FONTS = {
  sizeSmall: 11,
  sizeBody: 14,
  sizeRegular: 16,
  sizeTitle: 18,
  sizeLarge: 22,
  weightRegular: '400',
  weightSemiBold: '600',
  weightBold: '700',
};

export const SHADOWS = {
  small: {
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  medium: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  large: {
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
};

export const BREAKPOINTS = {
  tablet: 768,
  desktop: 1024,
  wide: 1280,
};

```

## Fichier : sweeted-frontend\ecran\Fichiers\Fichiers.js

```javascript
import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator,
  RefreshControl, Alert
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { apiFetch } from '../../config/apiClient';
import { appendFilePart } from '../../config/fileUpload';
import { API_BASE_URL, fileUrl } from '../../config/api';
import { openPdf, downloadFileUrl } from '../../config/openPdf';
import { formatRelativeTime } from '../../components/formatTime';
import { COLORS, SPACING, RADIUS } from '../../config/theme';

const MINE = 'mine';
const PUBLIC = 'public';

const fileIcon = (type) => {
  if (type === 'code') return 'code-tags';
  if (type === 'image') return 'image-outline';
  return 'file-pdf-box';
};

const formatSize = (bytes) => {
  if (!bytes && bytes !== 0) return '';
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
};

export default function Fichiers({ onOpenInStudio }) {
  const [scope, setScope] = useState(MINE);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    setFeedback({ type: '', message: '' });
    const result = await apiFetch(`/files?scope=${scope}`);
    if (result.ok) {
      setFiles(result.data || []);
    } else {
      setFeedback({
        type: 'error',
        message: result.data?.message || 'Impossible de charger les fichiers.',
      });
    }
    setLoading(false);
  }, [scope]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchFiles().then(() => setRefreshing(false));
  }, [fetchFiles]);

  const pickAndUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        type: ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'],
      });
      if (result.canceled || !result.assets?.[0]) return;

      const asset = result.assets[0];
      setUploading(true);
      setFeedback({ type: '', message: '' });

      const formData = new FormData();
      const upFile = await appendFilePart(formData, 'file', asset.uri, asset.name || 'fichier', asset.mimeType || 'application/pdf');
      if (!upFile.ok) {
        setUploading(false);
        setFeedback({ type: 'error', message: 'Lecture fichier impossible : ' + upFile.debug });
        return;
      }

      const uploadResult = await apiFetch('/files', { method: 'POST', body: formData });
      setUploading(false);

      if (uploadResult.ok) {
        setFeedback({ type: 'success', message: 'Fichier uploadé avec succès.' });
        fetchFiles();
      } else {
        setFeedback({
          type: 'error',
          message: uploadResult.data?.message || 'Impossible d\'uploader le fichier.',
        });
      }
    } catch {
      setUploading(false);
      setFeedback({ type: 'error', message: 'Impossible d\'uploader le fichier.' });
    }
  };

  const handleRead = (file) => {
    if (file.type === 'code') {
      if (onOpenInStudio) onOpenInStudio(file.id);
      return;
    }
    const url = fileUrl(file.path);
    if (!url) return;
    openPdf(url);
  };

  const handleDownload = async (file) => {
    const url = await downloadFileUrl(file.id);
    if (!url) return;
    openPdf(url);
  };

  const confirmDelete = (file) => {
    Alert.alert('Supprimer', `Voulez-vous vraiment supprimer « ${file.name} » ?`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          const result = await apiFetch(`/files/${file.id}`, { method: 'DELETE' });
          if (result.ok) {
            setFiles(prev => prev.filter(f => f.id !== file.id));
            setFeedback({ type: 'success', message: 'Fichier supprimé.' });
          } else {
            setFeedback({
              type: 'error',
              message: result.data?.message || 'Impossible de supprimer le fichier.',
            });
          }
        },
      },
    ]);
  };

  const renderFile = ({ item }) => (
    <View style={styles.row}>
      <View style={styles.fileIconContainer}>
        <Icon name={fileIcon(item.type)} size={28} color={COLORS.primary} />
      </View>
      <View style={styles.fileInfo}>
        <Text style={styles.fileName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.fileMetaRow}>
          {item.type !== 'code' && item.type !== 'image' ? (
            <Text style={styles.fileMeta}>PDF</Text>
          ) : null}
          {item.type === 'code' && item.language ? (
            <Text style={styles.fileMeta}>{item.language}</Text>
          ) : null}
          <Text style={styles.fileMeta}>{formatSize(item.size)}</Text>
          {scope === PUBLIC && item.display_name ? (
            <Text style={styles.fileMeta}>par {item.display_name}</Text>
          ) : null}
          <Text style={styles.fileMeta}>{item.download_count || 0} ↓</Text>
        </View>
        <Text style={styles.fileTime}>{formatRelativeTime(item.created_at)}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => handleRead(item)}>
          <Icon name="book-open-variant" size={18} color={COLORS.primary} />
          <Text style={styles.actionText}>Lire</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => handleDownload(item)}>
          <Icon name="download" size={18} color={COLORS.primary} />
          <Text style={styles.actionText}>Télécharger</Text>
        </TouchableOpacity>
        {scope === MINE ? (
          <TouchableOpacity style={styles.actionBtn} onPress={() => confirmDelete(item)}>
            <Icon name="delete-outline" size={18} color={COLORS.danger} />
            <Text style={[styles.actionText, styles.deleteText]}>Supprimer</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Fichiers</Text>
        <TouchableOpacity
          style={[styles.uploadButton, uploading && styles.uploadButtonDisabled]}
          onPress={pickAndUpload}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <>
              <Icon name="upload" size={18} color={COLORS.white} />
              <Text style={styles.uploadButtonText}>Upload</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.chipsRow}>
        <TouchableOpacity
          style={[styles.chip, scope === MINE && styles.chipActive]}
          onPress={() => setScope(MINE)}
        >
          <Text style={scope === MINE ? styles.chipTextActive : styles.chipText}>Mes fichiers</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.chip, scope === PUBLIC && styles.chipActive]}
          onPress={() => setScope(PUBLIC)}
        >
          <Text style={scope === PUBLIC ? styles.chipTextActive : styles.chipText}>Partagés</Text>
        </TouchableOpacity>
      </View>

      {feedback.message ? (
        <View style={feedback.type === 'error' ? styles.errorBanner : styles.successBanner}>
          <Text style={feedback.type === 'error' ? styles.errorText : styles.successText}>
            {feedback.message}
          </Text>
        </View>
      ) : null}

      {loading && files.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={files}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderFile}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
          ListEmptyComponent={
            !loading ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {scope === MINE
                    ? 'Aucun fichier. Utilisez Upload pour en ajouter un.'
                    : 'Aucun fichier partagé pour le moment.'}
                </Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.screenBackground,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    gap: 5,
    minWidth: 90,
    justifyContent: 'center',
  },
  uploadButtonDisabled: {
    opacity: 0.6,
  },
  uploadButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 13,
  },
  chipsRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  chip: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.inputBackground,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  chipActive: {
    backgroundColor: COLORS.toggleActive,
    borderColor: COLORS.primary,
  },
  chipText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextActive: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: 'bold',
  },
  errorBanner: {
    backgroundColor: '#FFF0F0',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.sm,
  },
  successBanner: {
    backgroundColor: '#EAF7EE',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.sm,
  },
  errorText: {
    color: COLORS.danger,
    textAlign: 'center',
  },
  successText: {
    color: COLORS.primary,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 130,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  fileIconContainer: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: '#E8F5EC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  fileInfo: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  fileName: {
    fontWeight: 'bold',
    fontSize: 14,
    color: COLORS.textDark,
  },
  fileMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 3,
    flexWrap: 'wrap',
  },
  fileMeta: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  fileTime: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 2,
  },
  actions: {
    gap: 6,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  deleteText: {
    color: COLORS.danger,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
  },
});
```

## Fichier : sweeted-frontend\ecran\Home\Home.js

```javascript
import React, { useState, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';
import { FlatList, View, StyleSheet, StatusBar, TouchableOpacity, Text, RefreshControl, Alert, Modal, TextInput, ActivityIndicator, Platform } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import Post from '../../components/Post';
import { apiFetch } from '../../config/apiClient';
import { API_BASE_URL } from '../../config/api';
import { openPdf } from '../../config/openPdf';
import { COLORS, SPACING } from '../../config/theme';
import ScrollProgress from '../../components/ScrollProgress';

const POSTS_PER_PAGE = 20;


const hideFeedScrollbar = () => {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return;
  if (document.getElementById('hide-feed-scrollbar')) return;
  const style = document.createElement('style');
  style.id = 'hide-feed-scrollbar';
  style.textContent = '[data-testid="home-feed"]{scrollbar-width:none;-ms-overflow-style:none;}[data-testid="home-feed"]::-webkit-scrollbar{display:none;width:0 !important;height:0 !important;}';
  document.head.appendChild(style);
};
const Home = forwardRef((props, ref) => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    hideFeedScrollbar();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPosts(0);
    }, [])
  );

  const fetchCurrentUser = async () => {
    const result = await apiFetch('/auth/me');
    if (result.ok && result.data) {
      setCurrentUserId(result.data.id);
      setCurrentUserRole(result.data.role);
    }
  };

  const fetchPosts = async (newOffset = 0) => {
    if (newOffset === 0) setLoading(true);
    setError('');

    const result = await apiFetch(`/posts?limit=${POSTS_PER_PAGE}&offset=${newOffset}`);

    if (result.ok) {
      const data = result.data || [];
      const enrichedPosts = data.map(post => ({
        ...post,
        user: post.display_name || `Utilisateur ${post.user_id}`,
        avatar: post.avatar_url || `https://i.pravatar.cc/150?u=user${post.user_id}`,
        totalReactions: Number(post.total_reactions) || 0,
        has_reacted: !!post.has_reacted,
        is_bookmarked: !!post.is_bookmarked,
        image: post.image_url ? `${API_BASE_URL.replace('/api', '')}${post.image_url}` : null,
        file_id: post.file_id || null,
        file_name: post.file_name || null,
        file_type: post.file_type || null,
        file_path: post.file_path || null,
        created_at: post.created_at,
      }));

      if (newOffset === 0) {
        setPosts(enrichedPosts);
      } else {
        setPosts(prev => [...prev, ...enrichedPosts]);
      }

      setOffset(newOffset);
      setHasMore(data.length >= POSTS_PER_PAGE);
    } else {
      let message;
      if (result.errorType === 'network') {
        message = 'Impossible de joindre le serveur. Vérifiez votre connexion.';
      } else if (result.errorType === 'auth') {
        message = 'Vous devez être connecté pour voir les posts.';
      } else {
        message = result.data?.message || 'Impossible de charger les posts.';
      }
      setError(message);
    }

    setLoading(false);
  };

  const handleFeedScroll = (e) => {
    const n = (e && e.nativeEvent) || {};
    if (!n.contentOffset || !n.contentSize || !n.layoutMeasurement) return;
    const max = n.contentSize.height - n.layoutMeasurement.height;
    setScrollProgress(max > 0 ? Math.min(1, Math.max(0, n.contentOffset.y / max)) : 0);
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts(0).then(() => setRefreshing(false));
  }, []);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !loading) {
      fetchPosts(offset + POSTS_PER_PAGE);
    }
  }, [hasMore, loading, offset]);

  useImperativeHandle(ref, () => ({
    refreshPosts: () => fetchPosts(0)
  }));

  const handleReact = (postId, added) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, totalReactions: added ? post.totalReactions + 1 : Math.max(0, post.totalReactions - 1), has_reacted: added }
          : post
      )
    );
  };

  const handleBookmark = async (postId, bookmarked) => {
    setPosts(prev =>
      prev.map(p => (p.id === postId ? { ...p, is_bookmarked: bookmarked } : p))
    );
    const result = await apiFetch(`/bookmarks/${postId}`, {
      method: bookmarked ? 'POST' : 'DELETE',
    });
    if (!result.ok) {
      setPosts(prev =>
        prev.map(p => (p.id === postId ? { ...p, is_bookmarked: !bookmarked } : p))
      );
      if (result.status === 409) return;
      Alert.alert('Erreur', result.data?.message || 'Impossible de mettre à jour l\'enregistrement.');
    }
  };

  const handleDeletePost = async (postId) => {
    const result = await apiFetch(`/posts/${postId}`, { method: 'DELETE' });
    if (result.ok) {
      setPosts(prev => prev.filter(p => p.id !== postId));
    } else {
      Alert.alert('Erreur', result.data?.message || 'Impossible de supprimer le post.');
    }
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setEditContent(post.content);
    setEditModalVisible(true);
  };

  const handleOpenFile = (post) => {
    if (!post.file_path) return;
    openPdf(`${API_BASE_URL.replace('/api', '')}${post.file_path}`);
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim()) {
      Alert.alert('Erreur', 'Le contenu ne peut pas être vide.');
      return;
    }

    setIsEditing(true);
    const result = await apiFetch(`/posts/${editingPost.id}`, {
      method: 'PUT',
      body: JSON.stringify({ content: editContent.trim() }),
    });
    setIsEditing(false);

    if (result.ok) {
      setPosts(prev =>
        prev.map(p =>
          p.id === editingPost.id ? { ...p, content: editContent.trim() } : p
        )
      );
      setEditModalVisible(false);
      setEditingPost(null);
      setEditContent('');
    } else {
      Alert.alert('Erreur', result.data?.message || 'Impossible de modifier le post.');
    }
  };

  if (loading && posts.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Chargement des posts...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {error ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        style={{ flex: 1, width: '100%', maxWidth: 770, alignSelf: 'center' }}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.postCard}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => navigation.navigate('PostDetails', { post: item })}
            >
              <Post
                post={item}
                onReact={(added) => handleReact(item.id, added)}
                currentUserId={currentUserId}
                role={currentUserRole}
                onDelete={handleDeletePost}
                onEdit={handleEditPost}
                onBookmark={(postId, bookmarked) => handleBookmark(postId, bookmarked)}
                onOpenFile={handleOpenFile}
              />
            </TouchableOpacity>

            <View style={styles.commentActionArea}>
              <View style={styles.divider} />
              <TouchableOpacity
                style={styles.commentInfo}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('PostDetails', { post: item })}
              >
                <Icon name="chat-outline" size={20} color={COLORS.primary} />
                <Text style={styles.commentText}>Voir ou ajouter un commentaire...</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        testID="home-feed"
        onScroll={handleFeedScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          hasMore && posts.length > 0 ? (
            <View style={styles.loadingMore}>
              <Text style={styles.loadingMoreText}>Chargement...</Text>
            </View>
          ) : null
        }
      />

      <View style={styles.progressRing} pointerEvents="none">
        <ScrollProgress progress={scrollProgress} />
      </View>

      <Modal
        visible={editModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!isEditing) {
            setEditModalVisible(false);
            setEditingPost(null);
            setEditContent('');
          }
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Modifier le post</Text>
              <TouchableOpacity onPress={() => { setEditModalVisible(false); setEditingPost(null); setEditContent(''); }} disabled={isEditing}>
                <Icon name="close" size={28} color={COLORS.textDark} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.textInput}
              placeholder="Modifier votre post..."
              placeholderTextColor={COLORS.placeholder}
              multiline
              value={editContent}
              onChangeText={setEditContent}
              editable={!isEditing}
            />
            <TouchableOpacity
              style={[styles.submitButton, isEditing && { opacity: 0.6 }]}
              onPress={handleSaveEdit}
              disabled={isEditing}
            >
              {isEditing ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.submitButtonText}>Enregistrer</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
});

Home.displayName = 'Home';

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.screenBackground,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorBanner: {
    backgroundColor: '#FFF0F0',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  errorText: {
    color: COLORS.danger,
    textAlign: 'center',
  },
  listContent: {
    paddingVertical: 10,
    paddingBottom: 120,
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
    marginHorizontal: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  commentActionArea: {
    paddingHorizontal: 15,
    paddingBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginBottom: 10,
  },
  commentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentText: {
    marginLeft: 8,
    color: COLORS.textMuted,
    fontSize: 13,
    fontStyle: 'italic',
  },
  loadingMore: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingMoreText: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    width: '85%',
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: COLORS.textDark,
    minHeight: 100,
    marginBottom: 15,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressRing: {
    position: 'absolute',
    right: 18,
    bottom: Platform.OS === 'web' ? 24 : 96,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.white,
    elevation: 5,
    zIndex: 10,
  },
});
```

## Fichier : sweeted-frontend\ecran\Notifications.js

```javascript
import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { apiFetch } from '../config/apiClient';
import { formatRelativeTime } from '../components/formatTime';
import { COLORS, SPACING, RADIUS } from '../config/theme';

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNotifications = useCallback(async () => {
    setError('');

    const result = await apiFetch('/notifications');
    if (result.ok) {
      setNotifications(result.data?.notifications || []);
      setUnreadCount(result.data?.unread_count || 0);
    } else {
      let message;
      if (result.errorType === 'network') {
        message = 'Impossible de joindre le serveur. Vérifiez votre connexion.';
      } else if (result.errorType === 'auth') {
        message = 'Vous devez être connecté pour voir vos notifications.';
      } else {
        message = result.data?.message || 'Impossible de charger les notifications.';
      }
      setError(message);
    }

    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [fetchNotifications])
  );

  const openNotification = async (item) => {
    if (item.is_read !== 1) {
      const readResult = await apiFetch(`/notifications/${item.id}/read`, { method: 'PUT' });
      if (readResult.ok) {
        setNotifications(prev =>
          prev.map(n => (n.id === item.id ? { ...n, is_read: 1 } : n))
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    }

    if (item.id_official_post) {
      navigation.navigate('OfficialDetails', {
        official: {
          id: item.id_official_post,
          content: item.official_content,
          image_url: item.official_image_url,
          is_pinned: item.official_is_pinned,
          created_at: item.official_created_at,
          display_name: null,
          avatar_url: null,
        },
      });
    }
  };

  const markAllRead = async () => {
    const result = await apiFetch('/notifications/read-all', { method: 'PUT' });
    if (result.ok) {
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
    }
  };

  const renderNotification = ({ item }) => (
    <TouchableOpacity
      style={[styles.notifItem, item.is_read !== 1 && styles.notifItemUnread]}
      onPress={() => openNotification(item)}
      activeOpacity={0.7}
    >
      <View style={[styles.notifIcon, item.is_read !== 1 && styles.notifIconUnread]}>
        <Icon name="bullhorn-outline" size={22} color={COLORS.primary} />
      </View>
      <View style={styles.notifContent}>
        <Text style={styles.notifMessage} numberOfLines={3}>{item.message}</Text>
        <Text style={styles.notifTime}>{formatRelativeTime(item.created_at)}</Text>
      </View>
      {item.is_read !== 1 ? <View style={styles.unreadDot} /> : null}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 ? (
          <TouchableOpacity style={styles.markAllButton} onPress={markAllRead}>
            <Text style={styles.markAllText}>Tout lire</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.spacer} />
        )}
      </View>

      {error ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {loading && notifications.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => item.id.toString()}
          renderItem={renderNotification}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            !loading ? (
              <View style={styles.emptyContainer}>
                <Icon name="bell-outline" size={48} color={COLORS.textLight} />
                <Text style={styles.emptyText}>Aucune notification.</Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    backgroundColor: COLORS.background,
  },
  backButton: {
    padding: SPACING.sm,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  markAllButton: {
    padding: SPACING.sm,
  },
  markAllText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 13,
  },
  spacer: {
    width: 68,
  },
  errorBanner: {
    backgroundColor: '#FFF0F0',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  errorText: {
    color: COLORS.danger,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingVertical: 8,
    flexGrow: 1,
  },
  notifItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  notifItemUnread: {
    backgroundColor: '#F2FAF5',
  },
  notifIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.screenBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  notifIconUnread: {
    backgroundColor: '#E8F5EC',
  },
  notifContent: {
    flex: 1,
  },
  notifMessage: {
    fontSize: 14,
    color: COLORS.textDark,
    lineHeight: 19,
  },
  notifTime: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 3,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
    marginLeft: SPACING.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
});
```

## Fichier : sweeted-frontend\ecran\Officiels\OfficialDetails.js

```javascript
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity, ScrollView,
  Modal, Animated, TextInput, Alert, ActivityIndicator
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { apiFetch } from '../../config/apiClient';
import { API_BASE_URL } from '../../config/api';
import { formatRelativeTime } from '../../components/formatTime';
import { COLORS, SPACING, RADIUS } from '../../config/theme';

export default function OfficialDetails({ route }) {
  const { official: initialOfficial } = route.params;
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [data, setData] = useState(initialOfficial);
  const [isAdmin, setIsAdmin] = useState(false);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [scale, setScale] = useState(1);
  const animatedScale = useRef(new Animated.Value(1)).current;

  const [menuOpen, setMenuOpen] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editBusy, setEditBusy] = useState(false);
  const [editFeedback, setEditFeedback] = useState({ type: '', message: '' });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;
    apiFetch('/auth/me').then(result => {
      if (active && result.ok && result.data) {
        setIsAdmin(result.data.role === 'Admin');
      }
    });
    return () => { active = false; };
  }, []);

  const officialImage = data?.image_url
    ? data?.image_url.startsWith('http')
      ? data.image_url
      : `${API_BASE_URL.replace('/api', '')}${data.image_url}`
    : null;

  const openViewer = () => {
    setScale(1);
    animatedScale.setValue(1);
    setViewerVisible(true);
  };

  const toggleZoom = () => {
    const next = scale === 1 ? 2.5 : 1;
    setScale(next);
    Animated.timing(animatedScale, {
      toValue: next,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const authorName = data?.display_name || 'Direction ISPM';

  const openEdit = () => {
    setMenuOpen(false);
    setEditContent(data?.content || '');
    setEditFeedback({ type: '', message: '' });
    setEditVisible(true);
  };

  const saveEdit = async () => {
    if (!editContent.trim()) {
      setEditFeedback({ type: 'error', message: 'Le contenu ne peut pas être vide.' });
      return;
    }
    setEditBusy(true);
    setEditFeedback({ type: '', message: '' });
    const result = await apiFetch(`/official/${data.id}`, {
      method: 'PUT',
      body: JSON.stringify({ content: editContent.trim(), is_pinned: data.is_pinned }),
    });
    setEditBusy(false);
    if (result.ok) {
      setData(prev => ({ ...prev, content: editContent.trim() }));
      setEditVisible(false);
    } else {
      setEditFeedback({
        type: 'error',
        message: result.data?.message || 'Impossible de modifier la publication.',
      });
    }
  };

  const togglePin = async () => {
    setMenuOpen(false);
    const result = await apiFetch(`/official/${data.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        content: data.content || '',
        is_pinned: data.is_pinned === 1 ? 0 : 1,
      }),
    });
    if (result.ok) {
      setData(prev => ({ ...prev, is_pinned: prev.is_pinned === 1 ? 0 : 1 }));
    } else {
      Alert.alert('Erreur', result.data?.message || 'Impossible de modifier l\'épinglage.');
    }
  };

  const confirmDelete = useCallback(() => {
    setMenuOpen(false);
    Alert.alert(
      'Supprimer',
      'Voulez-vous vraiment supprimer cette publication officielle ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            const result = await apiFetch(`/official/${data.id}`, { method: 'DELETE' });
            setDeleting(false);
            if (result.ok) {
              navigation.goBack();
            } else {
              Alert.alert('Erreur', result.data?.message || 'Impossible de supprimer la publication.');
            }
          },
        },
      ]
    );
  }, [data, navigation]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Publication officielle</Text>
        <View style={styles.headerRight}>
          {isAdmin && !deleting ? (
            <View style={styles.menuContainer}>
              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => setMenuOpen(o => !o)}
              >
                <Icon name="dots-vertical" size={22} color={COLORS.primary} />
              </TouchableOpacity>
              {menuOpen ? (
                <View style={styles.dropdown}>
                  <TouchableOpacity style={styles.dropdownItem} onPress={openEdit}>
                    <Icon name="pencil-outline" size={16} color={COLORS.textDark} />
                    <Text style={styles.dropdownText}>Modifier</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.dropdownItem} onPress={togglePin}>
                    <Icon
                      name={data?.is_pinned === 1 ? 'pin-off-outline' : 'pin-outline'}
                      size={16}
                      color={COLORS.textDark}
                    />
                    <Text style={styles.dropdownText}>
                      {data?.is_pinned === 1 ? 'Déépingler' : 'Épingler'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.dropdownItem} onPress={confirmDelete}>
                    <Icon name="delete-outline" size={16} color={COLORS.danger} />
                    <Text style={[styles.dropdownText, styles.dropdownTextDanger]}>Supprimer</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          ) : (
            <View style={styles.spacer} />
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {data ? (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.authorRow}>
                <View style={styles.authorAvatar}>
                  <Icon name="school" size={22} color={COLORS.primary} />
                </View>
                <View>
                  <Text style={styles.authorName}>{authorName}</Text>
                  <Text style={styles.time}>{formatRelativeTime(data.created_at)}</Text>
                </View>
              </View>
              {data.is_pinned === 1 ? (
                <View style={styles.pinnedBadge}>
                  <Icon name="pin" size={14} color={COLORS.primary} />
                  <Text style={styles.pinnedText}>Épinglé</Text>
                </View>
              ) : null}
            </View>

            {data.content ? <Text style={styles.content}>{data.content}</Text> : null}

            {officialImage ? (
              <TouchableOpacity activeOpacity={0.9} onPress={openViewer}>
                <Image
                  source={{ uri: officialImage }}
                  style={styles.officialImage}
                  resizeMode="cover"
                />
                <View style={styles.zoomHint}>
                  <Icon name="fullscreen" size={16} color={COLORS.white} />
                  <Text style={styles.zoomHintText}>Toucher pour zoomer</Text>
                </View>
              </TouchableOpacity>
            ) : null}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Cette publication n'existe plus.</Text>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={editVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!editBusy) {
            setEditVisible(false);
            setEditFeedback({ type: '', message: '' });
          }
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Modifier la publication</Text>
              <TouchableOpacity
                onPress={() => { setEditVisible(false); setEditFeedback({ type: '', message: '' }); }}
                disabled={editBusy}
              >
                <Icon name="close" size={28} color={COLORS.textDark} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.textInput}
              placeholder="Contenu de l'avis"
              placeholderTextColor={COLORS.placeholder}
              multiline
              value={editContent}
              onChangeText={setEditContent}
              editable={!editBusy}
              maxLength={2000}
            />

            {editFeedback.message ? (
              <Text style={editFeedback.type === 'error' ? styles.feedbackError : styles.feedbackSuccess}>
                {editFeedback.message}
              </Text>
            ) : null}

            <TouchableOpacity
              style={[styles.saveButton, editBusy && styles.saveButtonDisabled]}
              onPress={saveEdit}
              disabled={editBusy}
            >
              {editBusy ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.saveButtonText}>Enregistrer</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={viewerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setViewerVisible(false)}
      >
        <View style={styles.viewerOverlay}>
          <TouchableOpacity style={styles.viewerClose} onPress={() => setViewerVisible(false)}>
            <Icon name="close" size={30} color={COLORS.white} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.viewerImageContainer}
            activeOpacity={1}
            onPress={toggleZoom}
          >
            <Animated.Image
              source={{ uri: officialImage }}
              style={[styles.viewerImage, { transform: [{ scale: animatedScale }] }]}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.viewerHint}>
            {scale === 1 ? 'Double-toucher pour zoomer' : 'Double-toucher pour dézoomer'}
          </Text>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    backgroundColor: COLORS.background,
  },
  backButton: {
    padding: SPACING.sm,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
  },
  menuContainer: {
    position: 'relative',
  },
  menuButton: {
    padding: SPACING.sm,
  },
  dropdown: {
    position: 'absolute',
    top: 34,
    right: 0,
    zIndex: 50,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    paddingVertical: 4,
    minWidth: 150,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: 9,
  },
  dropdownText: {
    fontSize: 13,
    color: COLORS.textDark,
    fontWeight: '600',
  },
  dropdownTextDanger: {
    color: COLORS.danger,
  },
  spacer: {
    width: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxl,
    width: '88%',
    maxHeight: '82%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.textDark,
    flex: 1,
    marginRight: SPACING.sm,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    fontSize: 15,
    color: COLORS.textDark,
    minHeight: 90,
    marginBottom: SPACING.md,
    textAlignVertical: 'top',
  },
  feedbackError: {
    color: COLORS.danger,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  feedbackSuccess: {
    color: COLORS.primary,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: COLORS.headerGreen,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContent: {
    padding: SPACING.lg,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5EC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  authorName: {
    fontWeight: 'bold',
    fontSize: 14,
    color: COLORS.textDark,
  },
  time: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 1,
  },
  pinnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5EC',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    gap: 3,
  },
  pinnedText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  content: {
    fontSize: 15,
    color: COLORS.textDark,
    lineHeight: 22,
    marginBottom: SPACING.md,
  },
  officialImage: {
    width: '100%',
    height: 300,
    borderRadius: RADIUS.lg,
    backgroundColor: '#eee',
  },
  zoomHint: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 5,
  },
  zoomHintText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '600',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  viewerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewerClose: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  viewerImageContainer: {
    width: '100%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewerImage: {
    width: '100%',
    height: '100%',
  },
  viewerHint: {
    position: 'absolute',
    bottom: 40,
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
  },
});
```

## Fichier : sweeted-frontend\ecran\Officiels\Officiels.js

```javascript
import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Image, RefreshControl,
  Modal, TextInput, ActivityIndicator, Alert
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch } from '../../config/apiClient';
import { API_BASE_URL, fileUrl } from '../../config/api';
import { openPdf, downloadFileUrl } from '../../config/openPdf';
import { formatRelativeTime } from '../../components/formatTime';
import { COLORS, SPACING, RADIUS } from '../../config/theme';

export default function Officiels() {
  const navigation = useNavigation();
  const [officials, setOfficials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const [showPublish, setShowPublish] = useState(false);
  const [officialContent, setOfficialContent] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishFeedback, setPublishFeedback] = useState({ type: '', message: '' });

  const [menuOpenId, setMenuOpenId] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editBusy, setEditBusy] = useState(false);
  const [editFeedback, setEditFeedback] = useState({ type: '', message: '' });

  useEffect(() => {
    (async () => {
      try {
        const role = await AsyncStorage.getItem('userRole');
        setIsAdmin(role === 'Admin');
      } catch {}
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchOfficials();
    }, [])
  );

  const fetchOfficials = async () => {
    if (!refreshing) setLoading(true);
    setError('');

    const result = await apiFetch('/official');
    if (result.ok) {
      const enriched = (result.data || []).map(official => ({
        ...official,
        authorName: official.display_name || 'Direction ISPM',
        image: official.image_url ? `${API_BASE_URL.replace('/api', '')}${official.image_url}` : null,
      }));
      setOfficials(enriched);
    } else {
      let message;
      if (result.errorType === 'network') {
        message = 'Impossible de joindre le serveur. Vérifiez votre connexion.';
      } else if (result.errorType === 'auth') {
        message = 'Vous devez être connecté pour voir les publications officielles.';
      } else {
        message = result.data?.message || 'Impossible de charger les publications officielles.';
      }
      setError(message);
    }

    setLoading(false);
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchOfficials().then(() => setRefreshing(false));
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setPublishFeedback({ type: 'error', message: "Permission d'accès à la galerie refusée." });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const publishOfficial = async () => {
    if (!officialContent.trim() && !selectedImage) {
      setPublishFeedback({ type: 'error', message: 'Veuillez écrire un contenu ou ajouter une image.' });
      return;
    }

    setIsPublishing(true);
    setPublishFeedback({ type: '', message: '' });

    const formData = new FormData();
    formData.append('content', officialContent.trim());

    if (selectedImage) {
      const filename = selectedImage.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      formData.append('image', { uri: selectedImage, name: filename, type });
    }

    const result = await apiFetch('/official', { method: 'POST', body: formData });
    setIsPublishing(false);

    if (result.ok) {
      setShowPublish(false);
      setOfficialContent('');
      setSelectedImage(null);
      setPublishFeedback({ type: '', message: '' });
      fetchOfficials();
      return;
    }

    let message;
    if (result.errorType === 'auth') {
      message = 'Vous devez être connecté pour publier.';
    } else if (result.errorType === 'validation') {
      message = result.data?.message || 'La publication est invalide.';
    } else if (result.errorType === 'server') {
      message = 'Le serveur a rencontré une erreur lors de la publication.';
    } else {
      message = result.data?.message || 'Impossible de publier.';
    }
    setPublishFeedback({ type: 'error', message });
  };

  const openEdit = (official) => {
    setMenuOpenId(null);
    setEditTarget(official);
    setEditContent(official.content || '');
    setEditFeedback({ type: '', message: '' });
  };

  const saveEdit = async () => {
    if (!editTarget) return;
    if (!editContent.trim()) {
      setEditFeedback({ type: 'error', message: 'Le contenu ne peut pas être vide.' });
      return;
    }
    setEditBusy(true);
    setEditFeedback({ type: '', message: '' });
    const result = await apiFetch(`/official/${editTarget.id}`, {
      method: 'PUT',
      body: JSON.stringify({ content: editContent.trim(), is_pinned: editTarget.is_pinned }),
    });
    setEditBusy(false);
    if (result.ok) {
      setEditTarget(null);
      setEditContent('');
      fetchOfficials();
    } else {
      setEditFeedback({
        type: 'error',
        message: result.data?.message || 'Impossible de modifier la publication.',
      });
    }
  };

  const togglePin = async (official) => {
    setMenuOpenId(null);
    const result = await apiFetch(`/official/${official.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        content: official.content || '',
        is_pinned: official.is_pinned === 1 ? 0 : 1,
      }),
    });
    if (result.ok) {
      fetchOfficials();
    } else {
      Alert.alert('Erreur', result.data?.message || 'Impossible de modifier l\'épinglage.');
    }
  };

  const confirmDelete = (official) => {
    setMenuOpenId(null);
    Alert.alert(
      'Supprimer',
      'Voulez-vous vraiment supprimer cette publication officielle ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            const result = await apiFetch(`/official/${official.id}`, { method: 'DELETE' });
            if (result.ok) {
              fetchOfficials();
            } else {
              Alert.alert('Erreur', result.data?.message || 'Impossible de supprimer la publication.');
            }
          },
        },
      ]
    );
  };

  const renderOfficial = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.authorRow}>
          <View style={styles.authorAvatar}>
            <Icon name="school" size={22} color={COLORS.primary} />
          </View>
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>{item.authorName}</Text>
            <Text style={styles.time}>{formatRelativeTime(item.created_at)}</Text>
          </View>
        </View>
        <View style={styles.cardHeaderRight}>
          {item.is_pinned === 1 ? (
            <View style={styles.pinnedBadge}>
              <Icon name="pin" size={14} color={COLORS.primary} />
              <Text style={styles.pinnedText}>Épinglé</Text>
            </View>
          ) : null}
          {isAdmin ? (
            <View style={styles.menuContainer}>
              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => setMenuOpenId(menuOpenId === item.id ? null : item.id)}
              >
                <Icon name="dots-vertical" size={20} color={COLORS.textMuted} />
              </TouchableOpacity>
              {menuOpenId === item.id ? (
                <View style={styles.dropdown}>
                  <TouchableOpacity style={styles.dropdownItem} onPress={() => openEdit(item)}>
                    <Icon name="pencil-outline" size={16} color={COLORS.textDark} />
                    <Text style={styles.dropdownText}>Modifier</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.dropdownItem} onPress={() => togglePin(item)}>
                    <Icon
                      name={item.is_pinned === 1 ? 'pin-off-outline' : 'pin-outline'}
                      size={16}
                      color={COLORS.textDark}
                    />
                    <Text style={styles.dropdownText}>
                      {item.is_pinned === 1 ? 'Déépingler' : 'Épingler'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.dropdownItem} onPress={() => confirmDelete(item)}>
                    <Icon name="delete-outline" size={16} color={COLORS.danger} />
                    <Text style={[styles.dropdownText, styles.dropdownTextDanger]}>Supprimer</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          ) : null}
        </View>
      </View>

      {item.content ? <Text style={styles.content}>{item.content}</Text> : null}

      {item.image ? (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate('OfficialDetails', { official: item })}
        >
          <Image source={{ uri: item.image }} style={styles.officialImage} />
        </TouchableOpacity>
      ) : null}

      {item.files && item.files.length > 0 ? (
        <View style={styles.filesContainer}>
          {item.files.map(file => (
            <View key={file.id} style={styles.fileRow}>
              <Icon name="file-pdf-box" size={18} color={COLORS.danger} />
              <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
              <TouchableOpacity
                style={styles.fileAction}
                onPress={() => { const url = fileUrl(file.path); if (url) openPdf(url); }}
              >
                <Text style={styles.fileActionText}>Lire</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.fileAction}
                onPress={async () => { const url = await downloadFileUrl(file.id); if (url) openPdf(url); }}
              >
                <Text style={styles.fileActionText}>Télécharger</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Publications officielles</Text>
        {isAdmin ? (
          <TouchableOpacity style={styles.publishButton} onPress={() => setShowPublish(true)}>
            <Icon name="plus-circle" size={18} color={COLORS.white} />
            <Text style={styles.publishButtonText}>Publier</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {error ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {loading && officials.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={officials}
          keyExtractor={item => item.id.toString()}
          renderItem={renderOfficial}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
          ListEmptyComponent={
            !loading ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Aucune publication officielle pour le moment.</Text>
              </View>
            ) : null
          }
        />
      )}

      <Modal
        visible={showPublish}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!isPublishing) {
            setShowPublish(false);
            setSelectedImage(null);
            setPublishFeedback({ type: '', message: '' });
          }
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Publier un avis officiel</Text>
              <TouchableOpacity
                onPress={() => { setShowPublish(false); setSelectedImage(null); setPublishFeedback({ type: '', message: '' }); }}
                disabled={isPublishing}
              >
                <Icon name="close" size={28} color={COLORS.textDark} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.textInput}
              placeholder="Contenu de l'avis (annonce, EDT, résultat...)"
              placeholderTextColor={COLORS.placeholder}
              multiline
              value={officialContent}
              onChangeText={setOfficialContent}
              editable={!isPublishing}
              maxLength={2000}
            />

            {selectedImage ? (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
                <TouchableOpacity style={styles.removeImageButton} onPress={() => setSelectedImage(null)} disabled={isPublishing}>
                  <Icon name="close-circle" size={28} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            ) : null}

            <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage} disabled={isPublishing}>
              <Icon name="image-outline" size={24} color={COLORS.primary} />
              <Text style={styles.imagePickerText}>Ajouter une image (EDT, affiche...)</Text>
            </TouchableOpacity>

            {publishFeedback.message ? (
              <Text style={publishFeedback.type === 'error' ? styles.feedbackError : styles.feedbackSuccess}>
                {publishFeedback.message}
              </Text>
            ) : null}

            <TouchableOpacity
              style={[styles.submitButton, isPublishing && styles.submitButtonDisabled]}
              onPress={publishOfficial}
              disabled={isPublishing}
            >
              {isPublishing ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.submitButtonText}>Publier</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={editTarget !== null}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!editBusy) {
            setEditTarget(null);
            setEditFeedback({ type: '', message: '' });
          }
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Modifier la publication</Text>
              <TouchableOpacity
                onPress={() => { setEditTarget(null); setEditFeedback({ type: '', message: '' }); }}
                disabled={editBusy}
              >
                <Icon name="close" size={28} color={COLORS.textDark} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.textInput}
              placeholder="Contenu de l'avis"
              placeholderTextColor={COLORS.placeholder}
              multiline
              value={editContent}
              onChangeText={setEditContent}
              editable={!editBusy}
              maxLength={2000}
            />

            {editFeedback.message ? (
              <Text style={editFeedback.type === 'error' ? styles.feedbackError : styles.feedbackSuccess}>
                {editFeedback.message}
              </Text>
            ) : null}

            <TouchableOpacity
              style={[styles.submitButton, editBusy && styles.submitButtonDisabled]}
              onPress={saveEdit}
              disabled={editBusy}
            >
              {editBusy ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.submitButtonText}>Enregistrer</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.screenBackground,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  publishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    gap: 5,
  },
  publishButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 13,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorBanner: {
    backgroundColor: '#FFF0F0',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  errorText: {
    color: COLORS.danger,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 130,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  cardHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  menuContainer: {
    position: 'relative',
  },
  menuButton: {
    padding: 2,
  },
  dropdown: {
    position: 'absolute',
    top: 28,
    right: 0,
    zIndex: 50,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    paddingVertical: 4,
    minWidth: 150,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: 9,
  },
  dropdownText: {
    fontSize: 13,
    color: COLORS.textDark,
    fontWeight: '600',
  },
  dropdownTextDanger: {
    color: COLORS.danger,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5EC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontWeight: 'bold',
    fontSize: 14,
    color: COLORS.textDark,
  },
  time: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 1,
  },
  pinnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5EC',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    gap: 3,
  },
  pinnedText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  content: {
    fontSize: 15,
    color: COLORS.textDark,
    lineHeight: 22,
    marginBottom: SPACING.md,
  },
  officialImage: {
    width: '100%',
    height: 200,
    borderRadius: RADIUS.lg,
    backgroundColor: '#eee',
    marginBottom: SPACING.md,
  },
  filesContainer: {
    gap: 6,
    marginTop: SPACING.xs,
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.screenBackground,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    gap: 6,
  },
  fileAction: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  fileActionText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primary,
  },
  fileName: {
    fontSize: 12,
    color: COLORS.textMuted,
    flex: 1,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxl,
    width: '88%',
    maxHeight: '82%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.textDark,
    flex: 1,
    marginRight: SPACING.sm,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    fontSize: 15,
    color: COLORS.textDark,
    minHeight: 90,
    marginBottom: SPACING.md,
    textAlignVertical: 'top',
  },
  imagePreviewContainer: {
    position: 'relative',
    marginBottom: SPACING.md,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: 160,
    borderRadius: RADIUS.md,
  },
  removeImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.md,
    gap: 8,
  },
  imagePickerText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  feedbackError: {
    color: COLORS.danger,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  feedbackSuccess: {
    color: COLORS.primary,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: COLORS.headerGreen,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
```

## Fichier : sweeted-frontend\ecran\PostDetails\PostDetails.js

```javascript
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform, Image
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Post from '../../components/Post';
import { apiFetch } from '../../config/apiClient';
import { API_BASE_URL } from '../../config/api';
import { openPdf } from '../../config/openPdf';
import { COLORS, SPACING, RADIUS } from '../../config/theme';

export default function PostDetails({ route }) {
  const { post } = route.params;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentError, setCommentError] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null);

  useEffect(() => {
    fetchComments();
    fetchMe();
  }, []);

  const fetchMe = async () => {
    const result = await apiFetch('/auth/me');
    if (result.ok && result.data) {
      setCurrentUserId(result.data.id);
      setCurrentUserRole(result.data.role);
    }
  };

  const fetchComments = async () => {
    setLoading(true);
    setError('');

    const result = await apiFetch(`/comments/${post.id}`);

    if (result.ok) {
      const enrichedComments = (result.data || []).map(comment => ({
        ...comment,
        user: comment.display_name || `Utilisateur ${comment.user_id}`,
        text: comment.content,
        avatar: comment.avatar_url || `https://i.pravatar.cc/150?u=user${comment.user_id}`,
      }));
      setComments(enrichedComments);
    } else {
      let message;
      if (result.errorType === 'network') {
        message = 'Impossible de joindre le serveur. Vérifiez votre connexion.';
      } else if (result.errorType === 'auth') {
        message = 'Vous devez être connecté pour voir les commentaires.';
      } else if (result.errorType === 'validation') {
        message = result.data?.message || 'La requête de commentaires est invalide.';
      } else if (result.errorType === 'server') {
        message = 'Le serveur a rencontré une erreur lors du chargement des commentaires.';
      } else {
        message = result.data?.message || 'Impossible de charger les commentaires.';
      }
      setError(message);
      setComments([]);
    }

    setLoading(false);
  };

  const addComment = async () => {
    if (newComment.trim().length === 0) return;

    setCommentError('');

    const result = await apiFetch(`/comments/${post.id}`, {
      method: 'POST',
      body: JSON.stringify({ content: newComment }),
    });

    if (result.ok) {
      setNewComment('');
      fetchComments();
      return;
    }

    let message;
    if (result.errorType === 'auth') {
      message = 'Vous devez être connecté pour ajouter un commentaire.';
    } else if (result.errorType === 'validation') {
      message = result.data?.message || 'Le commentaire est invalide.';
    } else if (result.errorType === 'server') {
      message = 'Le serveur a rencontré une erreur lors de l’ajout du commentaire.';
    } else {
      message = result.data?.message || 'Impossible d’ajouter le commentaire.';
    }
    setCommentError(message);
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails du post</Text>
        <View style={styles.spacer} />
      </View>

      {error ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <FlatList
        data={comments}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Post post={post} onReact={() => {}} currentUserId={currentUserId} role={currentUserRole} onOpenFile={(p) => {
              if (!p.file_path) return;
              openPdf(`${API_BASE_URL.replace('/api', '')}${p.file_path}`);
            }} />
            <Text style={styles.sectionTitle}>Commentaires ({comments.length})</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.commentItem}>
            <Image source={{ uri: item.avatar }} style={styles.commentAvatar} />
            <View style={styles.commentTextContainer}>
              <Text style={styles.commentUser}>{item.user}</Text>
              <Text style={styles.commentText}>{item.text}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.inputWrapper}>
        {commentError ? (
          <Text style={styles.commentErrorText}>{commentError}</Text>
        ) : null}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Écrire un commentaire..."
            placeholderTextColor={COLORS.placeholder}
            value={newComment}
            onChangeText={setNewComment}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, !newComment.trim() && styles.sendButtonDisabled]}
            onPress={addComment}
            disabled={!newComment.trim()}
          >
            <Icon name="send" size={24} color={newComment.trim() ? COLORS.primary : COLORS.disabled} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    backgroundColor: COLORS.background,
  },
  backButton: {
    padding: SPACING.sm,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  spacer: {
    width: 40,
  },
  errorBanner: {
    backgroundColor: '#FFF0F0',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  errorText: {
    color: COLORS.danger,
    textAlign: 'center',
  },
  headerContainer: { borderBottomWidth: 1, borderBottomColor: COLORS.divider, marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginHorizontal: SPACING.lg, marginBottom: SPACING.md, color: COLORS.textDark },
  listContent: { paddingBottom: 20 },

  commentItem: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: 12,
    alignItems: 'flex-start',
  },
  commentAvatar: { width: 36, height: 36, borderRadius: 18, marginRight: SPACING.md },
  commentTextContainer: { flex: 1, backgroundColor: '#F2F3F5', padding: 10, borderRadius: RADIUS.xl },
  commentUser: { fontWeight: 'bold', fontSize: 13, marginBottom: 2, color: COLORS.primary },
  commentText: { fontSize: 14, color: '#444', lineHeight: 18 },

  inputWrapper: {
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    backgroundColor: COLORS.background,
  },
  commentErrorText: {
    color: COLORS.danger,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    paddingVertical: 8,
    fontSize: 15,
    color: COLORS.textDark,
  },
  sendButton: { marginLeft: 10, padding: 5 },
  sendButtonDisabled: { opacity: 0.5 },
});
```

## Fichier : sweeted-frontend\ecran\Search.js

```javascript
import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  FlatList, Image, ActivityIndicator
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { apiFetch } from '../config/apiClient';
import { API_BASE_URL } from '../config/api';
import { COLORS, SPACING, RADIUS } from '../config/theme';

export default function SearchScreen({ onBack }) {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [statsMap, setStatsMap] = useState({});

  const insets = useSafeAreaInsets();

  useEffect(() => {
    apiFetch('/auth/me').then(result => {
      if (result.ok && result.data) setCurrentUserId(result.data.id);
    });
  }, []);

  const fetchStats = async (users) => {
    const entries = await Promise.all(
      users.map(async (u) => {
        if (u.id === currentUserId) return [u.id, null];
        const result = await apiFetch(`/users/${u.id}/stats`);
        if (result.ok && result.data) {
          return [u.id, { is_following: !!result.data.is_following, followers_count: result.data.followers_count }];
        }
        return [u.id, null];
      })
    );
    setStatsMap(Object.fromEntries(entries));
  };

  const handleFollowToggle = async (user) => {
    const current = statsMap[user.id];
    if (!current || current.is_following === null) return;
    const newState = { ...current, is_following: !current.is_following, followers_count: current.followers_count + (current.is_following ? -1 : 1) };
    setStatsMap(prev => ({ ...prev, [user.id]: newState }));

    const result = await apiFetch(`/follow/${user.id}`, {
      method: current.is_following ? 'DELETE' : 'POST',
    });
    if (!result.ok) {
      setStatsMap(prev => ({ ...prev, [user.id]: current }));
      if (result.status === 409) return;
      setError(result.data?.message || 'Impossible de mettre à jour le suivi.');
    } else if (result.data && typeof result.data.followers_count === 'number') {
      setStatsMap(prev => ({
        ...prev,
        [user.id]: { is_following: !!result.data.is_following, followers_count: result.data.followers_count },
      }));
    }
  };

  const handleSearch = useCallback(async (query) => {
    if (!query || query.trim().length === 0) {
      setResults([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    setError('');
    setSearched(true);

    const result = await apiFetch(`/users/search?q=${encodeURIComponent(query.trim())}`);

    if (result.ok) {
      setResults(result.data || []);
      fetchStats(result.data || []);
    } else {
      if (result.errorType === 'network') {
        setError('Impossible de joindre le serveur.');
      } else if (result.errorType === 'auth') {
        setError('Vous devez être connecté pour rechercher.');
      } else {
        setError(result.data?.message || 'Erreur lors de la recherche.');
      }
      setResults([]);
    }

    setLoading(false);
  }, []);

  const onChangeText = useCallback((text) => {
    setSearch(text);
    if (text.trim().length === 0) {
      setResults([]);
      setSearched(false);
      setError('');
    }
  }, []);

  const onSubmitEditing = useCallback(() => {
    handleSearch(search);
  }, [search, handleSearch]);

  const renderUserItem = ({ item }) => {
    const stats = statsMap[item.id];
    const isSelf = currentUserId && Number(item.id) === Number(currentUserId);
    const showFollow = !isSelf && stats && stats.is_following !== null;

    return (
      <TouchableOpacity style={styles.itemRow}>
        <View style={styles.itemLeft}>
          <View style={styles.iconContainer}>
            {item.avatar_url ? (
              <Image source={{ uri: item.avatar_url.startsWith('http') ? item.avatar_url : `${API_BASE_URL.replace('/api', '')}${item.avatar_url}` }} style={styles.avatarImage} />
            ) : (
              <Feather name="user" size={18} color="#666" />
            )}
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.itemTitle} numberOfLines={1}>
              {item.display_name || item.matricule_number}
            </Text>
            <Text style={styles.itemSubtitle}>
              {item.matricule_number}
              {showFollow ? ` · ${stats.followers_count} abonné${stats.followers_count > 1 ? 's' : ''}` : ''}
            </Text>
          </View>
        </View>
        {showFollow ? (
          <TouchableOpacity
            style={[styles.followButton, stats.is_following && styles.followButtonActive]}
            onPress={() => handleFollowToggle(item)}
            activeOpacity={0.7}
          >
            <Text style={stats.is_following ? styles.followButtonTextActive : styles.followButtonText}>
              {stats.is_following ? 'Ne plus suivre' : 'Suivre'}
            </Text>
          </TouchableOpacity>
        ) : null}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.safeContainer, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={26} color="black" />
        </TouchableOpacity>

        <View style={styles.searchBarWrapper}>
          <Ionicons name="search" size={18} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Rechercher sur Sweeted"
            placeholderTextColor="#888"
            value={search}
            onChangeText={onChangeText}
            onSubmitEditing={onSubmitEditing}
            returnKeyType="search"
            autoFocus
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => onChangeText('')} style={styles.clearBtn}>
              <Ionicons name="close-circle" size={18} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {error ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={COLORS.primary} />
        </View>
      ) : searched && results.length === 0 && !error ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucun résultat pour "{search}"</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderUserItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#fff' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
  backBtn: { padding: 5 },
  searchBarWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
    borderRadius: RADIUS.full,
    height: 40,
    marginLeft: 10,
    paddingHorizontal: 15,
  },
  searchIcon: { marginRight: 8 },
  clearBtn: { marginLeft: 5 },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingVertical: 0,
  },

  errorBanner: {
    backgroundColor: '#FFF0F0',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  errorText: {
    color: COLORS.danger,
    textAlign: 'center',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 15,
    textAlign: 'center',
  },

  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  itemLeft: { flexDirection: 'row', alignItems: 'center', flex: 0.9 },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F0F2F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  avatarImage: { width: '100%', height: '100%' },
  textContainer: { flex: 1 },
  itemTitle: { fontSize: 16, color: '#1c1e21', fontWeight: '500' },
  itemSubtitle: { fontSize: 13, color: '#65676b', marginTop: 2 },
  followButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    marginLeft: 10,
  },
  followButtonActive: {
    backgroundColor: COLORS.toggleInactive,
  },
  followButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  followButtonTextActive: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 13,
  },
});
```

## Fichier : sweeted-frontend\ecran\Studio\Studio.js

```javascript
import React, { useState, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator,
  Modal, TextInput, RefreshControl, ScrollView, Alert
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { apiFetch } from '../../config/apiClient';
import { fileUrl } from '../../config/api';
import { openPdf, downloadFileUrl } from '../../config/openPdf';
import { formatRelativeTime } from '../../components/formatTime';
import { COLORS, SPACING, RADIUS } from '../../config/theme';

const LANGUAGES = ['javascript', 'python', 'typescript', 'java', 'cpp', 'c', 'sql', 'html', 'css', 'json', 'bash', 'php', 'ruby', 'go', 'rust', 'markdown', 'text'];

const formatSize = (bytes) => {
  if (!bytes && bytes !== 0) return '';
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
};

const Studio = forwardRef((props, ref) => {
  const { initialFileId, onInitialHandled } = props;
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const [editorVisible, setEditorVisible] = useState(false);
  const [editorFile, setEditorFile] = useState(null);
  const [editorName, setEditorName] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [editorLanguage, setEditorLanguage] = useState('javascript');
  const [editorVisibility, setEditorVisibility] = useState('prive');
  const [editorLoading, setEditorLoading] = useState(false);
  const [editorFeedback, setEditorFeedback] = useState({ type: '', message: '' });

  const [createVisible, setCreateVisible] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createLanguage, setCreateLanguage] = useState('javascript');
  const [createContent, setCreateContent] = useState('');
  const [creating, setCreating] = useState(false);
  const [createFeedback, setCreateFeedback] = useState({ type: '', message: '' });

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    const result = await apiFetch('/files?scope=mine');
    if (result.ok) {
      setFiles(result.data || []);
    } else {
      setFeedback({
        type: 'error',
        message: result.data?.message || 'Impossible de charger le Studio.',
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchFiles().then(() => setRefreshing(false));
  }, [fetchFiles]);

  const openFile = useCallback(async (fileId) => {
    setEditorFeedback({ type: '', message: '' });
    setEditorLoading(true);
    const result = await apiFetch(`/files/${fileId}`);
    setEditorLoading(false);
    if (result.ok) {
      setEditorFile(result.data);
      setEditorName(result.data.name || '');
      setEditorContent(result.data.content || '');
      setEditorLanguage(result.data.language || 'javascript');
      setEditorVisibility(result.data.visibility || 'prive');
      setEditorVisible(true);
    } else {
      setEditorFeedback({
        type: 'error',
        message: result.data?.message || 'Impossible d\'ouvrir le fichier.',
      });
    }
  }, []);

  useImperativeHandle(ref, () => ({
    openFile,
    refresh: fetchFiles,
  }));

  useEffect(() => {
    if (initialFileId) {
      openFile(initialFileId);
      if (onInitialHandled) onInitialHandled();
    }
  }, [initialFileId, openFile, onInitialHandled]);

  const confirmDeleteFile = (file, isCode) => {
    Alert.alert('Supprimer', `Voulez-vous vraiment supprimer « ${file.name} » ?`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          if (isCode && editorFile?.id === file.id) {
            setEditorVisible(false);
            setEditorFile(null);
          }
          const result = await apiFetch(`/files/${file.id}`, { method: 'DELETE' });
          if (result.ok) {
            fetchFiles();
          } else {
            Alert.alert('Erreur', result.data?.message || 'Impossible de supprimer le fichier.');
          }
        },
      },
    ]);
  };

  const saveEditor = async () => {
    if (!editorName.trim()) {
      setEditorFeedback({ type: 'error', message: 'Le nom du fichier est requis.' });
      return;
    }
    setEditorFeedback({ type: '', message: '' });
    setEditorLoading(true);
    const result = await apiFetch(`/files/${editorFile.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: editorName.trim(),
        content: editorContent,
        visibility: editorVisibility,
      }),
    });
    setEditorLoading(false);
    if (result.ok) {
      setEditorFeedback({ type: 'success', message: 'Fichier enregistré.' });
      fetchFiles();
    } else {
      setEditorFeedback({
        type: 'error',
        message: result.data?.message || 'Impossible d\'enregistrer le fichier.',
      });
    }
  };

  const createFile = async () => {
    if (!createName.trim()) {
      setCreateFeedback({ type: 'error', message: 'Le nom du fichier est requis.' });
      return;
    }
    if (!createContent.trim()) {
      setCreateFeedback({ type: 'error', message: 'Le contenu du fichier est requis.' });
      return;
    }
    setCreating(true);
    setCreateFeedback({ type: '', message: '' });
    const result = await apiFetch('/files', {
      method: 'POST',
      body: JSON.stringify({
        name: createName.trim(),
        content: createContent,
        language: createLanguage,
      }),
    });
    setCreating(false);
    if (result.ok) {
      setCreateVisible(false);
      setCreateName('');
      setCreateContent('');
      setCreateLanguage('javascript');
      fetchFiles();
    } else {
      setCreateFeedback({
        type: 'error',
        message: result.data?.message || 'Impossible de créer le fichier.',
      });
    }
  };

  const codeFiles = files.filter(f => f.type === 'code');
  const pdfFiles = files.filter(f => f.type !== 'code');

  const renderCodeRow = ({ item }) => (
    <TouchableOpacity
        style={styles.row}
        onPress={() => openFile(item.id)}
        activeOpacity={0.7}
      >
      <View style={styles.rowIcon}>
        <Icon name="code-tags" size={24} color={COLORS.primary} />
      </View>
      <View style={styles.rowInfo}>
        <Text style={styles.rowName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.rowMeta}>
          <Text style={styles.rowMetaText}>{item.language}</Text>
          <Text style={styles.rowMetaText}>{formatSize(item.size)}</Text>
          <Icon
            name={item.visibility === 'public' ? 'earth' : 'lock-outline'}
            size={12}
            color={COLORS.textMuted}
          />
        </View>
      </View>
      <TouchableOpacity
        style={styles.rowDeleteBtn}
        onPress={(e) => {
          e.stopPropagation();
          confirmDeleteFile(item, true);
        }}
      >
        <Icon name="delete-outline" size={20} color={COLORS.danger} />
      </TouchableOpacity>
      <Icon name="chevron-right" size={20} color={COLORS.textMuted} />
    </TouchableOpacity>
  );

  const renderPdfRow = ({ item }) => (
    <View style={styles.row}>
      <View style={styles.rowIcon}>
        <Icon name="file-pdf-box" size={24} color={COLORS.danger} />
      </View>
      <View style={styles.rowInfo}>
        <Text style={styles.rowName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.rowMetaText}>{formatRelativeTime(item.created_at)} • {formatSize(item.size)}</Text>
      </View>
      <View style={styles.rowActions}>
        <TouchableOpacity style={styles.rowAction} onPress={() => { const url = fileUrl(item.path); if (url) openPdf(url); }}>
          <Text style={styles.rowActionText}>Lire</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.rowAction} onPress={async () => {
          const url = await downloadFileUrl(item.id);
          if (url) openPdf(url);
        }}>
          <Text style={styles.rowActionText}>Télécharger</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.rowAction, styles.rowDeleteAction]}
          onPress={() => confirmDeleteFile(item, false)}
        >
          <Icon name="delete-outline" size={16} color={COLORS.danger} />
          <Text style={[styles.rowActionText, styles.deleteText]}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Studio</Text>
        <TouchableOpacity
          style={[styles.createButton, creating && styles.disabled]}
          onPress={() => { setCreateVisible(true); setCreateFeedback({ type: '', message: '' }); }}
        >
          <Icon name="plus" size={18} color={COLORS.white} />
          <Text style={styles.createButtonText}>Nouveau fichier</Text>
        </TouchableOpacity>
      </View>

      {feedback.message ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{feedback.message}</Text>
        </View>
      ) : null}

      {loading && files.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
        >
          <Text style={styles.groupTitle}>Fichiers code</Text>
          {codeFiles.length === 0 ? (
            <Text style={styles.emptyText}>Aucun fichier code. Créez-en un avec « Nouveau fichier ».</Text>
          ) : (
            codeFiles.map(f => (
              <View key={`code-${f.id}`}>
                {renderCodeRow({ item: f })}
              </View>
            ))
          )}

          <Text style={styles.groupTitle}>Mes PDF</Text>
          {pdfFiles.length === 0 ? (
            <Text style={styles.emptyText}>Aucun PDF. Utilisez l'onglet Fichiers pour en uploader.</Text>
          ) : (
            pdfFiles.map(f => (
              <View key={`pdf-${f.id}`}>
                {renderPdfRow({ item: f })}
              </View>
            ))
          )}
        </ScrollView>
      )}

      {editorFeedback.message ? (
        <View style={styles.inlineBanner}>
          <Text style={editorFeedback.type === 'error' ? styles.errorText : styles.successText}>
            {editorFeedback.message}
          </Text>
        </View>
      ) : null}

      <Modal
        visible={editorVisible}
        transparent
        animationType="slide"
        onRequestClose={() => {
          if (!editorLoading) setEditorVisible(false);
        }}
      >
        <View style={styles.editorModalOverlay}>
          <View style={styles.editorModal}>
            <View style={styles.editorHeader}>
              <Text style={styles.editorTitle} numberOfLines={1}>
                {editorFile ? `Éditeur — ${editorFile.name}` : 'Éditeur'}
              </Text>
              <TouchableOpacity onPress={() => setEditorVisible(false)} disabled={editorLoading}>
                <Icon name="close" size={28} color={COLORS.textDark} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.editorScroll} keyboardShouldPersistTaps="handled">
              <Text style={styles.inputLabel}>Nom du fichier</Text>
              <TextInput
                style={styles.nameInput}
                value={editorName}
                onChangeText={setEditorName}
                placeholder="ex: script.js"
                editable={!editorLoading}
              />

              <Text style={styles.inputLabel}>Langage</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.languageRow}>
                {LANGUAGES.map(lang => (
                  <TouchableOpacity
                    key={lang}
                    style={[styles.languageChip, editorLanguage === lang && styles.languageChipActive]}
                    onPress={() => setEditorLanguage(lang)}
                  >
                    <Text style={editorLanguage === lang ? styles.languageChipTextActive : styles.languageChipText}>
                      {lang}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.inputLabel}>Contenu</Text>
              <TextInput
                style={styles.codeInput}
                value={editorContent}
                onChangeText={setEditorContent}
                multiline
                textAlignVertical="top"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!editorLoading}
                placeholder="// votre code ici"
                placeholderTextColor={COLORS.placeholder}
              />

              <Text style={styles.inputLabel}>Visibilité</Text>
              <View style={styles.visibilityRow}>
                <TouchableOpacity
                  style={[styles.visibilityChip, editorVisibility === 'prive' && styles.visibilityChipActive]}
                  onPress={() => setEditorVisibility('prive')}
                >
                  <Icon name="lock-outline" size={14} color={editorVisibility === 'prive' ? COLORS.white : COLORS.textMuted} />
                  <Text style={editorVisibility === 'prive' ? styles.visibilityTextActive : styles.visibilityText}>Privé</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.visibilityChip, editorVisibility === 'public' && styles.visibilityChipActive]}
                  onPress={() => setEditorVisibility('public')}
                >
                  <Icon name="earth" size={14} color={editorVisibility === 'public' ? COLORS.white : COLORS.textMuted} />
                  <Text style={editorVisibility === 'public' ? styles.visibilityTextActive : styles.visibilityText}>Public</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.saveButton, editorLoading && styles.disabled]}
                onPress={saveEditor}
                disabled={editorLoading}
              >
                {editorLoading ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <Text style={styles.saveButtonText}>Enregistrer</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={createVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!creating) setCreateVisible(false);
        }}
      >
        <View style={styles.createModalOverlay}>
          <View style={styles.createModal}>
            <View style={styles.editorHeader}>
              <Text style={styles.editorTitle}>Nouveau fichier code</Text>
              <TouchableOpacity onPress={() => setCreateVisible(false)} disabled={creating}>
                <Icon name="close" size={28} color={COLORS.textDark} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Nom du fichier</Text>
            <TextInput
              style={styles.nameInput}
              value={createName}
              onChangeText={setCreateName}
              placeholder="ex: script.py"
              editable={!creating}
            />

            <Text style={styles.inputLabel}>Langage</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.languageRow}>
              {LANGUAGES.map(lang => (
                <TouchableOpacity
                  key={lang}
                  style={[styles.languageChip, createLanguage === lang && styles.languageChipActive]}
                  onPress={() => setCreateLanguage(lang)}
                >
                  <Text style={createLanguage === lang ? styles.languageChipTextActive : styles.languageChipText}>
                    {lang}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.inputLabel}>Contenu</Text>
            <TextInput
              style={[styles.codeInput, { maxHeight: 220 }]}
              value={createContent}
              onChangeText={setCreateContent}
              multiline
              textAlignVertical="top"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!creating}
              placeholder="// votre code ici"
              placeholderTextColor={COLORS.placeholder}
            />

            {createFeedback.message ? (
              <Text style={createFeedback.type === 'error' ? styles.errorText : styles.successText}>
                {createFeedback.message}
              </Text>
            ) : null}

            <TouchableOpacity
              style={[styles.saveButton, creating && styles.disabled]}
              onPress={createFile}
              disabled={creating}
            >
              {creating ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.saveButtonText}>Créer</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
});

Studio.displayName = 'Studio';

export default Studio;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.screenBackground,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    gap: 5,
  },
  createButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 13,
  },
  disabled: {
    opacity: 0.6,
  },
  errorBanner: {
    backgroundColor: '#FFF0F0',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.sm,
  },
  errorText: {
    color: COLORS.danger,
    textAlign: 'center',
  },
  successText: {
    color: COLORS.primary,
    textAlign: 'center',
  },
  inlineBanner: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 130,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.xs,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 13,
    paddingHorizontal: SPACING.xs,
    marginBottom: SPACING.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: '#E8F5EC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  rowInfo: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  rowName: {
    fontWeight: 'bold',
    fontSize: 14,
    color: COLORS.textDark,
  },
  rowMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 3,
  },
  rowMetaText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  rowActions: {
    flexDirection: 'row',
    gap: 10,
  },
  rowAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    backgroundColor: COLORS.inputBackground,
    borderRadius: RADIUS.md,
  },
  rowDeleteBtn: {
    padding: 6,
  },
  rowDeleteAction: {
    backgroundColor: '#FFF0F0',
  },
  deleteText: {
    color: COLORS.danger,
  },
  rowActionText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  editorModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
  },
  editorModal: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    width: '94%',
    maxHeight: '88%',
  },
  editorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  editorTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.textDark,
    flex: 1,
    marginRight: SPACING.sm,
  },
  editorScroll: {
    flexGrow: 0,
  },
  inputLabel: {
    fontWeight: 'bold',
    fontSize: 13,
    color: COLORS.textDark,
    marginTop: SPACING.sm,
    marginBottom: 5,
  },
  nameInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    fontSize: 14,
    color: COLORS.textDark,
  },
  languageRow: {
    flexGrow: 0,
    marginTop: 4,
  },
  languageChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.inputBackground,
    marginRight: 6,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  languageChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  languageChipText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  languageChipTextActive: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: '600',
  },
  codeInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    fontSize: 13,
    fontFamily: 'monospace',
    color: COLORS.textDark,
    minHeight: 180,
  },
  visibilityRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: 4,
  },
  visibilityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.inputBackground,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  visibilityChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  visibilityText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  visibilityTextActive: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: COLORS.headerGreen,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  createModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
  },
  createModal: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    width: '94%',
    maxHeight: '85%',
  },
});
```

## Fichier : sweeted-frontend\ecran\tabs\index.js

```javascript
import React, { useState, useRef, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  ActivityIndicator,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import Home from "../Home/Home";
import Officiels from "../Officiels/Officiels";
import SearchScreen from '../Search';
import Fichiers from "../Fichiers/Fichiers";
import Studio from "../Studio/Studio";
import DesktopLayout from '../../components/Layout/DesktopLayout';
import { apiFetch } from '../../config/apiClient';
import { appendFilePart } from '../../config/fileUpload';
import { API_BASE_URL } from '../../config/api';
import { COLORS, SPACING, RADIUS, SHADOWS, FONTS, BREAKPOINTS } from '../../config/theme';

const cleanUri = (uri) => {
  if (!uri) return uri;
  const noQuery = String(uri).split('?')[0];
  if (Platform.OS === 'android' && noQuery.startsWith('/')) {
    return `file://${noQuery}`;
  }
  return noQuery;
};

const imageMime = (filename) => {
  const match = /\.(\w+)$/.exec(String(filename || ''));
  const ext = (match ? match[1] : 'jpg').toLowerCase();
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
  if (ext === 'png') return 'image/png';
  if (ext === 'webp') return 'image/webp';
  if (ext === 'gif') return 'image/gif';
  return 'image/jpeg';
};

const ETUDIANT = 'etudiant';
const OFFICIEL = 'officiel';
const CODE = 'code';
const FICHIERS = 'fichiers';

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const homeRef = useRef(null);

  // Détection responsive via hook natif useWindowDimensions
  const { width } = useWindowDimensions();
  // Seuil de bascule Mobile <-> Desktop fixé à 768px (contrat prompt_maitre section 4)
  const isDesktop = width >= (BREAKPOINTS?.tablet || 768);

  const [mode, setMode] = useState(ETUDIANT);
  const [isSearching, setIsSearching] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createFeedback, setCreateFeedback] = useState({ type: '', message: '' });
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const studioRef = useRef(null);
  const [studioFileToOpen, setStudioFileToOpen] = useState(null);

  const fetchHeaderData = useCallback(async () => {
    const notifResult = await apiFetch('/notifications');
    if (notifResult.ok) {
      setUnreadCount(notifResult.data?.unread_count || 0);
    }
    const meResult = await apiFetch('/auth/me');
    if (meResult.ok && meResult.data?.avatar_url) {
      setAvatarUrl(
        meResult.data.avatar_url.startsWith('http')
          ? meResult.data.avatar_url
          : `${API_BASE_URL.replace('/api', '')}${meResult.data.avatar_url}`
      );
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchHeaderData();
    }, [fetchHeaderData])
  );

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setCreateFeedback({ type: 'error', message: 'Permission d\'accès à la galerie refusée.' });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const removeImage = () => setSelectedImage(null);

  const pickPdf = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      type: 'application/pdf',
    });
    if (!result.canceled && result.assets?.[0]) {
      setSelectedPdf(result.assets[0]);
    }
  };

  const removePdf = () => setSelectedPdf(null);

  const handleCreatePost = async () => {
    if (!postContent.trim() && !selectedImage && !selectedPdf) {
      setCreateFeedback({ type: 'error', message: 'Veuillez écrire quelque chose, ajouter une image ou un PDF.' });
      return;
    }

    setIsCreating(true);
    setCreateFeedback({ type: '', message: '' });

    const formData = new FormData();
    formData.append('content', postContent.trim());

    if (selectedImage) {
      const rawName = String(selectedImage).split('?')[0].split('/').pop() || 'photo.jpg';
      const upImg = await appendFilePart(formData, 'image', cleanUri(selectedImage), rawName, imageMime(rawName));
      if (!upImg.ok) {
        setIsCreating(false);
        setCreateFeedback({ type: 'error', message: 'Lecture image impossible : ' + upImg.debug });
        return;
      }
    }

    if (selectedPdf) {
      const upPdf = await appendFilePart(formData, 'file', cleanUri(selectedPdf.uri), selectedPdf.name || 'piece-jointe.pdf', selectedPdf.mimeType || 'application/pdf');
      if (!upPdf.ok) {
        setIsCreating(false);
        setCreateFeedback({ type: 'error', message: 'Lecture PDF impossible : ' + upPdf.debug });
        return;
      }
    }

    const result = await apiFetch('/posts', {
      method: 'POST',
      body: formData,
    });

    setIsCreating(false);

    if (result.ok) {
      setPostContent('');
      setSelectedImage(null);
      setSelectedPdf(null);
      if (homeRef.current) {
        homeRef.current.refreshPosts();
      }
      setShowCreateModal(false);
      return;
    }

    let message;
    if (result.errorType === 'auth') {
      message = 'Vous devez être connecté pour publier un post.';
    } else if (result.errorType === 'validation') {
      message = result.data?.message || 'Le contenu du post est invalide.';
    } else if (result.errorType === 'server') {
      message = 'Le serveur a rencontré une erreur lors de la publication.';
    } else {
      message = result.data?.message || 'Impossible de créer le post.';
    if (result.data?.details) {
      message = `${message} (${result.data.details})`;
    }
    }

    setCreateFeedback({ type: 'error', message });
  };

  if (isSearching) {
    return <SearchScreen onBack={() => setIsSearching(false)} />;
  }

  // Rendu de l'écran actif selon le mode sélectionné
  const renderContent = () => {
    if (mode === ETUDIANT) {
      return <Home ref={homeRef} />;
    }
    if (mode === OFFICIEL) {
      return <Officiels />;
    }
    if (mode === CODE) {
      return (
        <Studio
          ref={studioRef}
          initialFileId={studioFileToOpen}
          onInitialHandled={() => setStudioFileToOpen(null)}
        />
      );
    }
    return (
      <Fichiers
        onOpenInStudio={(fileId) => {
          setMode(CODE);
          setStudioFileToOpen(fileId);
        }}
      />
    );
  };

  // Modale de création de post (commune Mobile et Desktop)
  const renderCreateModal = () => (
    <Modal
      visible={showCreateModal}
      transparent
      animationType="fade"
      onRequestClose={() => {
        if (!isCreating) {
          setShowCreateModal(false);
          setSelectedImage(null);
          setSelectedPdf(null);
          setCreateFeedback({ type: '', message: '' });
        }
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.centeredView}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Créer un post</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowCreateModal(false);
                  setSelectedImage(null);
                  setSelectedPdf(null);
                  setCreateFeedback({ type: '', message: '' });
                }}
                disabled={isCreating}
              >
                <Ionicons name="close" size={28} color={COLORS.textDark} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.textInput}
              placeholder="Quoi de neuf?"
              placeholderTextColor={COLORS.placeholder}
              multiline
              value={postContent}
              onChangeText={setPostContent}
              editable={!isCreating}
            />

            {selectedImage ? (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
                <TouchableOpacity style={styles.removeImageButton} onPress={removeImage} disabled={isCreating}>
                  <Ionicons name="close-circle" size={28} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            ) : null}

            <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage} disabled={isCreating}>
              <Ionicons name="image-outline" size={24} color={COLORS.primary} />
              <Text style={styles.imagePickerText}>Ajouter une image</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.imagePickerButton} onPress={pickPdf} disabled={isCreating}>
              <Ionicons name="document-attach-outline" size={24} color={COLORS.primary} />
              <Text style={styles.imagePickerText}>Ajouter un PDF</Text>
            </TouchableOpacity>

            {selectedPdf ? (
              <View style={styles.pdfChip}>
                <Ionicons name="document-text-outline" size={18} color={COLORS.primary} />
                <Text style={styles.pdfChipText} numberOfLines={1}>{selectedPdf.name || 'piece-jointe.pdf'}</Text>
                <TouchableOpacity onPress={removePdf} disabled={isCreating} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Ionicons name="close-circle" size={22} color={COLORS.textMuted} />
                </TouchableOpacity>
              </View>
            ) : null}

            {createFeedback.message ? (
              <Text style={createFeedback.type === 'error' ? styles.feedbackError : styles.feedbackSuccess}>
                {createFeedback.message}
              </Text>
            ) : null}

            <TouchableOpacity
              style={[styles.submitButton, isCreating && styles.submitButtonDisabled]}
              onPress={handleCreatePost}
              disabled={isCreating}
            >
              {isCreating ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.submitButtonText}>Publier</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // =========================================================================
  // BASCULE RESPONSIVE :
  // Si largeur >= 768px -> Layout Desktop avec Sidebar latérale gauche & Header
  // Si largeur < 768px  -> Layout Mobile d'origine avec En-tête vert & Bottom Tab Bar
  // =========================================================================
  if (isDesktop) {
    return (
      <View style={styles.desktopRootContainer}>
        <DesktopLayout
          currentMode={mode}
          onSelectMode={setMode}
          onOpenCreatePost={() => setShowCreateModal(true)}
          onOpenSearch={() => setIsSearching(true)}
          unreadCount={unreadCount}
          avatarUrl={avatarUrl}
          navigation={navigation}
        >
          {renderContent()}
        </DesktopLayout>
        {renderCreateModal()}
      </View>
    );
  }

  // Layout Mobile standard
  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + SPACING.sm }]}>
        <View style={styles.headerRow}>
          <Image
            source={require('../../sweeted_logo-no_background.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <View style={styles.headerRight}>
            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.headerIconBtn} onPress={() => setIsSearching(true)}>
                <Feather name="search" size={22} color={COLORS.black} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerIconBtn} onPress={() => navigation.navigate('Notifications')}>
                <Feather name="bell" size={22} color={COLORS.black} />
                {unreadCount > 0 ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
                  </View>
                ) : null}
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerIconBtn} onPress={() => navigation.navigate('Profile')}>
                {avatarUrl ? (
                  <Image source={{ uri: avatarUrl }} style={styles.headerAvatar} />
                ) : (
                  <Feather name="user" size={22} color={COLORS.black} />
                )}
              </TouchableOpacity>
            </View>

            {mode === ETUDIANT || mode === OFFICIEL ? (
              <View style={styles.toggleContainer}>
                <TouchableOpacity
                  style={[styles.toggleButton, mode === ETUDIANT && styles.activeToggle]}
                  onPress={() => setMode(ETUDIANT)}
                >
                  <Text style={mode === ETUDIANT ? styles.activeToggleText : styles.toggleText}>Etudiant</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleButton, mode === OFFICIEL && styles.activeToggle]}
                  onPress={() => setMode(OFFICIEL)}
                >
                  <Text style={mode === OFFICIEL ? styles.activeToggleText : styles.toggleText}>Officiel</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {renderContent()}
      </View>

      <View style={[styles.bottomNavContainer, { paddingBottom: insets.bottom }]}>
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={[styles.navItem, mode === ETUDIANT && styles.navItemActive]}
            onPress={() => setMode(ETUDIANT)}
          >
            <Feather name="home" size={24} color={COLORS.white} />
            <Text style={mode === ETUDIANT ? styles.navLabelActive : styles.navLabel}>Accueil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navItem, mode === OFFICIEL && styles.navItemActive]}
            onPress={() => setMode(OFFICIEL)}
          >
            <Feather name="flag" size={24} color={COLORS.white} />
            <Text style={mode === OFFICIEL ? styles.navLabelActive : styles.navLabel}>Officiels</Text>
          </TouchableOpacity>

          {mode === ETUDIANT || mode === OFFICIEL ? <View style={{ width: 62 }} /> : null}

          <TouchableOpacity
            style={[styles.navItem, mode === CODE && styles.navItemActive]}
            onPress={() => setMode(CODE)}
          >
            <Feather name="code" size={24} color={COLORS.white} />
            <Text style={mode === CODE ? styles.navLabelActive : styles.navLabel}>Code</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navItem, mode === FICHIERS && styles.navItemActive]}
            onPress={() => setMode(FICHIERS)}
          >
            <Feather name="folder" size={24} color={COLORS.white} />
            <Text style={mode === FICHIERS ? styles.navLabelActive : styles.navLabel}>Fichiers</Text>
          </TouchableOpacity>
        </View>

        {mode === ETUDIANT || mode === OFFICIEL ? (
          <View style={styles.fabWrapper}>
            <TouchableOpacity
              style={styles.fab}
              onPress={() => setShowCreateModal(true)}
            >
              <Ionicons name="add" size={32} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>

      {renderCreateModal()}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  desktopRootContainer: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: COLORS.screenBackground,
    ...(Platform.OS === 'web' && { height: '100vh', maxHeight: '100vh', overflow: 'hidden' }),
  },
  container: {
    flex: 1,
    ...(Platform.OS === 'web' && { height: '100vh', maxHeight: '100vh' }),
    backgroundColor: COLORS.background,
    position: 'relative',
  },
  content: {
    flex: 1,
    minHeight: 0,
    paddingBottom: 65,
  },
  header: {
    backgroundColor: COLORS.headerGreen,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    borderBottomLeftRadius: RADIUS.xxl,
    borderBottomRightRadius: RADIUS.xxl,
    zIndex: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 95,
    marginRight: SPACING.md,
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
    gap: SPACING.md,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    alignSelf: 'flex-end',
  },
  headerIconBtn: {
    padding: 4,
    position: 'relative',
  },
  headerAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#DDD',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -4,
    backgroundColor: COLORS.danger,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: COLORS.headerGreen,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.toggleBackground,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.toggleBorder,
    overflow: 'hidden',
  },
  toggleButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.full,
  },
  activeToggle: {
    backgroundColor: COLORS.toggleActive,
  },
  activeToggleText: {
    fontSize: FONTS.sizeBody,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  toggleText: {
    fontSize: FONTS.sizeBody,
    color: COLORS.black,
  },
  bottomNavContainer: {
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: COLORS.headerGreen,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 62,
  },
  navItem: {
    padding: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    minWidth: 56,
  },
  navItemActive: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: RADIUS.md,
  },
  navLabel: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: '500',
  },
  navLabelActive: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  fabWrapper: {
    position: 'absolute',
    top: -25,
    alignSelf: 'center',
  },
  fab: {
    backgroundColor: COLORS.headerGreen,
    width: 55,
    height: 55,
    borderRadius: RADIUS.fab,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: COLORS.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxl,
    width: '85%',
    maxWidth: 540,
    maxHeight: '80%',
    ...SHADOWS.large,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  modalTitle: {
    fontSize: FONTS.sizeTitle,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    fontSize: FONTS.sizeRegular,
    color: COLORS.textDark,
    minHeight: 80,
    marginBottom: SPACING.md,
    textAlignVertical: 'top',
  },
  imagePreviewContainer: {
    position: 'relative',
    marginBottom: SPACING.md,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: 180,
    borderRadius: RADIUS.md,
  },
  removeImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.md,
    gap: 8,
  },
  imagePickerText: {
    color: COLORS.primary,
    fontSize: FONTS.sizeBody,
    fontWeight: '600',
  },
  pdfChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.screenBackground,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.md,
    gap: 8,
  },
  pdfChipText: {
    flex: 1,
    color: COLORS.textDark,
    fontSize: 13,
  },
  submitButton: {
    backgroundColor: COLORS.headerGreen,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizeRegular,
    fontWeight: 'bold',
  },
  feedbackError: {
    color: COLORS.danger,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  feedbackSuccess: {
    color: COLORS.primary,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
});
```

## Fichier : sweeted-frontend\index.js

```javascript
import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
```

## Fichier : sweeted-frontend\package-lock.json

```json
{
  "name": "sweeted-frontend",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "license": "0BSD",
      "dependencies": {
        "@expo/vector-icons": "^15.0.3",
        "@react-native-async-storage/async-storage": "^2.2.0",
        "@react-navigation/native": "*",
        "@react-navigation/stack": "*",
        "expo": "~57.0.0",
        "expo-document-picker": "~57.0.1",
        "expo-file-system": "~57.0.7",
        "expo-font": "~57.0.3",
        "expo-image-picker": "~57.0.16",
        "expo-status-bar": "~57.0.1",
        "expo-web-browser": "~57.0.2",
        "react": "19.2.3",
        "react-dom": "19.2.3",
        "react-native": "0.86.3",
        "react-native-gesture-handler": "~2.32.0",
        "react-native-safe-area-context": "~5.7.0",
        "react-native-screens": "~4.26.0",
        "react-native-svg": "15.15.4",
        "react-native-web": "^0.21.0"
      }
    },
    "node_modules/@babel/code-frame": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/code-frame/-/code-frame-7.29.7.tgz",
      "integrity": "sha512-Aup7aUOfpbAUg2ROOJN6Iw5f9DMBlzu0mIkm/malLQFN/YQgO48wCj0Kxa3sEHJvPVFg7siR+qRInwXd2qhQKw==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-validator-identifier": "^7.29.7",
        "js-tokens": "^4.0.0",
        "picocolors": "^1.1.1"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/compat-data": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/compat-data/-/compat-data-7.29.7.tgz",
      "integrity": "sha512-locTkQyKvwIEgBzVrn8693ebc97F2U8ZHjbXwDXJ5Fn2TCpNwTlKcaKLkdHop5c/icOFE7qt7Q9JC5hnKNa6Gg==",
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/core": {
      "version": "7.29.0",
      "resolved": "https://registry.npmjs.org/@babel/core/-/core-7.29.0.tgz",
      "integrity": "sha512-CGOfOJqWjg2qW/Mb6zNsDm+u5vFQ8DxXfbM09z69p5Z6+mE1ikP2jUXw+j42Pf1XTYED2Rni5f95npYeuwMDQA==",
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@babel/code-frame": "^7.29.0",
        "@babel/generator": "^7.29.0",
        "@babel/helper-compilation-targets": "^7.28.6",
        "@babel/helper-module-transforms": "^7.28.6",
        "@babel/helpers": "^7.28.6",
        "@babel/parser": "^7.29.0",
        "@babel/template": "^7.28.6",
        "@babel/traverse": "^7.29.0",
        "@babel/types": "^7.29.0",
        "@jridgewell/remapping": "^2.3.5",
        "convert-source-map": "^2.0.0",
        "debug": "^4.1.0",
        "gensync": "^1.0.0-beta.2",
        "json5": "^2.2.3",
        "semver": "^6.3.1"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/babel"
      }
    },
    "node_modules/@babel/core/node_modules/semver": {
      "version": "6.3.1",
      "resolved": "https://registry.npmjs.org/semver/-/semver-6.3.1.tgz",
      "integrity": "sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==",
      "license": "ISC",
      "bin": {
        "semver": "bin/semver.js"
      }
    },
    "node_modules/@babel/generator": {
      "version": "7.29.8",
      "resolved": "https://registry.npmjs.org/@babel/generator/-/generator-7.29.8.tgz",
      "integrity": "sha512-gZbepsdh3WDtgZKWL+vTPh71LSBrm/Y4/QDZBVCcYfmeTEEuoOYwlSy+G1StfJg+/Zy550u/3TATbm7qDbbMtg==",
      "license": "MIT",
      "dependencies": {
        "@babel/parser": "^7.29.8",
        "@babel/types": "^7.29.8",
        "@jridgewell/gen-mapping": "^0.3.12",
        "@jridgewell/trace-mapping": "^0.3.28",
        "jsesc": "^3.0.2"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-annotate-as-pure": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-annotate-as-pure/-/helper-annotate-as-pure-7.29.7.tgz",
      "integrity": "sha512-OoK6239jHPuSQOoS0kfTVKn0b/rVTk0seKq4Gd2UMLtmOVLjDC0ki3e+c90Trqv2gMfvJFqkiljrr568+qddiw==",
      "license": "MIT",
      "dependencies": {
        "@babel/types": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-compilation-targets": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-compilation-targets/-/helper-compilation-targets-7.29.7.tgz",
      "integrity": "sha512-wem6WaBj4NaVYVdNhLPPVacES6ZJ+KBBfSkTMD3YZxbP3rm3Di85tJU5ljaUNhaOynt+Aj0xruhYuzQBt8n71g==",
      "license": "MIT",
      "dependencies": {
        "@babel/compat-data": "^7.29.7",
        "@babel/helper-validator-option": "^7.29.7",
        "browserslist": "^4.24.0",
        "lru-cache": "^5.1.1",
        "semver": "^6.3.1"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-compilation-targets/node_modules/semver": {
      "version": "6.3.1",
      "resolved": "https://registry.npmjs.org/semver/-/semver-6.3.1.tgz",
      "integrity": "sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==",
      "license": "ISC",
      "bin": {
        "semver": "bin/semver.js"
      }
    },
    "node_modules/@babel/helper-create-class-features-plugin": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-create-class-features-plugin/-/helper-create-class-features-plugin-7.29.7.tgz",
      "integrity": "sha512-IY3ZD9Tmooqr3TUhc3DUWxiuo8xx1DWLhd5M7hQ+ZWJamqM2BbalrBJb2MisSLoYorOj75U03qULCxQTY9r3hg==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-annotate-as-pure": "^7.29.7",
        "@babel/helper-member-expression-to-functions": "^7.29.7",
        "@babel/helper-optimise-call-expression": "^7.29.7",
        "@babel/helper-replace-supers": "^7.29.7",
        "@babel/helper-skip-transparent-expression-wrappers": "^7.29.7",
        "@babel/traverse": "^7.29.7",
        "semver": "^6.3.1"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0"
      }
    },
    "node_modules/@babel/helper-create-class-features-plugin/node_modules/semver": {
      "version": "6.3.1",
      "resolved": "https://registry.npmjs.org/semver/-/semver-6.3.1.tgz",
      "integrity": "sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==",
      "license": "ISC",
      "bin": {
        "semver": "bin/semver.js"
      }
    },
    "node_modules/@babel/helper-create-regexp-features-plugin": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-create-regexp-features-plugin/-/helper-create-regexp-features-plugin-7.29.7.tgz",
      "integrity": "sha512-907Uymvqgg1dwUA+7IGwFAOSYzQOuzPXKNJ1yxzwPffzkYFg2q2eHi1fIOs6sXkG9NbIUMunnUlkYsfRFNvomg==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-annotate-as-pure": "^7.29.7",
        "regexpu-core": "^6.3.1",
        "semver": "^6.3.1"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0"
      }
    },
    "node_modules/@babel/helper-create-regexp-features-plugin/node_modules/semver": {
      "version": "6.3.1",
      "resolved": "https://registry.npmjs.org/semver/-/semver-6.3.1.tgz",
      "integrity": "sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==",
      "license": "ISC",
      "bin": {
        "semver": "bin/semver.js"
      }
    },
    "node_modules/@babel/helper-define-polyfill-provider": {
      "version": "0.6.8",
      "resolved": "https://registry.npmjs.org/@babel/helper-define-polyfill-provider/-/helper-define-polyfill-provider-0.6.8.tgz",
      "integrity": "sha512-47UwBLPpQi1NoWzLuHNjRoHlYXMwIJoBf7MFou6viC/sIHWYygpvr0B6IAyh5sBdA2nr2LPIRww8lfaUVQINBA==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-compilation-targets": "^7.28.6",
        "@babel/helper-plugin-utils": "^7.28.6",
        "debug": "^4.4.3",
        "lodash.debounce": "^4.0.8",
        "resolve": "^1.22.11"
      },
      "peerDependencies": {
        "@babel/core": "^7.4.0 || ^8.0.0-0 <8.0.0"
      }
    },
    "node_modules/@babel/helper-globals": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-globals/-/helper-globals-7.29.7.tgz",
      "integrity": "sha512-3nQVUAtvkKH9zahfWgw96Jc/uFOmjACE1kQz82E2lqWmHBgjzbNlsC22nuQTfahmWeQtTq5nQ/4Nnd2A1wj4zA==",
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-member-expression-to-functions": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-member-expression-to-functions/-/helper-member-expression-to-functions-7.29.7.tgz",
      "integrity": "sha512-j+7JYmk1JYDtACIGj0QJqqWZjoUpMoEikQGADMaHgCMCSDqd2+P32rfcibUNrGOMWrlzK1WJBdxrB3JJQZwWtg==",
      "license": "MIT",
      "dependencies": {
        "@babel/traverse": "^7.29.7",
        "@babel/types": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-module-imports": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-module-imports/-/helper-module-imports-7.29.7.tgz",
      "integrity": "sha512-ejHwrQQYcm9xnTivShn2IDOlIzInN34AXskvq9QicvCtEzq1Vzclu/tKF8Jq1Cg8JG2GL6/EmjgsCT7lXepE3g==",
      "license": "MIT",
      "dependencies": {
        "@babel/traverse": "^7.29.7",
        "@babel/types": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-module-transforms": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-module-transforms/-/helper-module-transforms-7.29.7.tgz",
      "integrity": "sha512-UPUVSyXbOh627KiCIGQSgwWzGeBKLkaJ9PJEdrngIwMSzxLR4jS4+f1f1jb7VzBbg8nFLaYotvVPFCTqdrmTAg==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-module-imports": "^7.29.7",
        "@babel/helper-validator-identifier": "^7.29.7",
        "@babel/traverse": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0"
      }
    },
    "node_modules/@babel/helper-optimise-call-expression": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-optimise-call-expression/-/helper-optimise-call-expression-7.29.7.tgz",
      "integrity": "sha512-+kmGVjcT9RGYzoDwdwEqEvGgKe3BYq+O1iGzjFubaNgZHwYHP6lsF2Yghf4kEuv9BV7tYDZ913aBW9am6YKong==",
      "license": "MIT",
      "dependencies": {
        "@babel/types": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-plugin-utils": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-plugin-utils/-/helper-plugin-utils-7.29.7.tgz",
      "integrity": "sha512-G7sHYigPY17oO5SYWnfD/0MTBwVR781S/JI643e/JhUYgVgWE/61SoW3NH9KWUKyKq5LVh3npif99Wkt6j86Jw==",
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-remap-async-to-generator": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-remap-async-to-generator/-/helper-remap-async-to-generator-7.29.7.tgz",
      "integrity": "sha512-16AMiW26DbXWBbr3B8wNozKM0ydMLB892vaOaJW/fPJdnT8vJk5sdkQcU/isqUxyCE0cEoa8wZOcbgDuC4b6Og==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-annotate-as-pure": "^7.29.7",
        "@babel/helper-wrap-function": "^7.29.7",
        "@babel/traverse": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0"
      }
    },
    "node_modules/@babel/helper-replace-supers": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-replace-supers/-/helper-replace-supers-7.29.7.tgz",
      "integrity": "sha512-atfGXWSeCiF4DnKZIfmJfQRkSw9b9gNNXR1kqKjbhG4pGYCOnkp8OcTB8E3NXjBu8NpheSnOeNKz8KT7UNFTmQ==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-member-expression-to-functions": "^7.29.7",
        "@babel/helper-optimise-call-expression": "^7.29.7",
        "@babel/traverse": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0"
      }
    },
    "node_modules/@babel/helper-skip-transparent-expression-wrappers": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-skip-transparent-expression-wrappers/-/helper-skip-transparent-expression-wrappers-7.29.7.tgz",
      "integrity": "sha512-brcMGQaVzIeUb+6/bs1Av0f8YuNNjKY2JyvfRCsFuFsdKccEQ5Ges2y74D74NZ1Rz8lKJ9ksJkfqwQFJ/iNEyQ==",
      "license": "MIT",
      "dependencies": {
        "@babel/traverse": "^7.29.7",
        "@babel/types": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-string-parser": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-string-parser/-/helper-string-parser-7.29.7.tgz",
      "integrity": "sha512-Pb5ijPrZ89GDH8223L4UP8i6QApWxs04RbPQJTeWDV0/keR2E36MeKnyr6LYmUUvqRRI+Iv87SuF1W6ErINzYw==",
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-validator-identifier": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-validator-identifier/-/helper-validator-identifier-7.29.7.tgz",
      "integrity": "sha512-qehxGkRj55h/ff8EMaJ+cYhyaKlHIxqYDn682wQD7RNp9UujOQsHog2uS0r2vzr4pW+sXf90NeeayjcNaX3fFg==",
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-validator-option": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-validator-option/-/helper-validator-option-7.29.7.tgz",
      "integrity": "sha512-N9ZErrD+yW5geCDtBqnOoxmR8+tNKiGuxKlDpuJxfsqpa2dFcexaziGAE/qoHLiDDreVNMupxGmSoNlyvsA3gw==",
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-wrap-function": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-wrap-function/-/helper-wrap-function-7.29.7.tgz",
      "integrity": "sha512-iES0Skag9ERIF68aXadpO6dbXa03mNWK3sEqJaMnLNs/eC3l0lkImdfoy6Y09/SfkpawdAB4RjQ7PVA7TcVGdw==",
      "license": "MIT",
      "dependencies": {
        "@babel/template": "^7.29.7",
        "@babel/traverse": "^7.29.7",
        "@babel/types": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helpers": {
      "version": "7.29.2",
      "resolved": "https://registry.npmjs.org/@babel/helpers/-/helpers-7.29.2.tgz",
      "integrity": "sha512-HoGuUs4sCZNezVEKdVcwqmZN8GoHirLUcLaYVNBK2J0DadGtdcqgr3BCbvH8+XUo4NGjNl3VOtSjEKNzqfFgKw==",
      "license": "MIT",
      "dependencies": {
        "@babel/template": "^7.28.6",
        "@babel/types": "^7.29.0"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/parser": {
      "version": "7.29.8",
      "resolved": "https://registry.npmjs.org/@babel/parser/-/parser-7.29.8.tgz",
      "integrity": "sha512-E8lTAYNB1KW+FH+VGJuZM1ioAx2E6oVlvQFRrf5P8ZZmsiJXYAD9vTFV7yyEURNzgh1dFqMZuO6tUwcARbqFCA==",
      "license": "MIT",
      "dependencies": {
        "@babel/types": "^7.29.8"
      },
      "bin": {
        "parser": "bin/babel-parser.js"
      },
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/@babel/plugin-proposal-decorators": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/plugin-proposal-decorators/-/plugin-proposal-decorators-7.29.7.tgz",
      "integrity": "sha512-EtU0Hi3GvrTqD56xKmZvV/uCXK2ZbwVNPNLAquVItcAZpUhkXwWlo3Fmj0c2LxgSf2I8IDULeAepwNP1OefLXg==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-create-class-features-plugin": "^7.29.7",
        "@babel/helper-plugin-utils": "^7.29.7",
        "@babel/plugin-syntax-decorators": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-proposal-export-default-from": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/plugin-proposal-export-default-from/-/plugin-proposal-export-default-from-7.29.7.tgz",
      "integrity": "sha512-p+G5BNXDcy3bOXplhY4HybQ1GxH3i2Tppmdm/3epyRu2VgJJZuUlZ61MqRTg582Q7ZLBdP7fePYvsumSEkMxcQ==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-syntax-decorators": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-decorators/-/plugin-syntax-decorators-7.29.7.tgz",
      "integrity": "sha512-9MTTLbF39X6sqM92JPEsoI7++26hjZvzkxKZy64aMhWLH2mPkJ/Q3AV4QLmls3R14FpSpkOwQQfUh962JGQxxg==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-syntax-dynamic-import": {
      "version": "7.8.3",
      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-dynamic-import/-/plugin-syntax-dynamic-import-7.8.3.tgz",
      "integrity": "sha512-5gdGbFon+PszYzqs83S3E5mpi7/y/8M9eC90MRTZfduQOYW76ig6SOSPNe41IG5LoP3FGBn2N0RjVDSQiS94kQ==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.8.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-syntax-export-default-from": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-export-default-from/-/plugin-syntax-export-default-from-7.29.7.tgz",
      "integrity": "sha512-foag0BB37ROhdeIX9O8G0jX7hw0UekJc04cHMrYLOnrErsnBKqJGHJ8eDRpoCFZBvEPPygmmtw4qyU97qa4oOw==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-syntax-flow": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-flow/-/plugin-syntax-flow-7.29.7.tgz",
      "integrity": "sha512-ajMX6QPcyomotqwpzhkYGxcK2i/us0rs1Qo9QvUpa+Fca0FTmqrzKrctoIYLMxcOhGZldGT/BAVkRGTWBiR8gQ==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-syntax-jsx": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-jsx/-/plugin-syntax-jsx-7.29.7.tgz",
      "integrity": "sha512-TSu8+mHCoEaaCDEZ0I3+6mvTBYR4PCxQwf2z9/r5Tbztv6NaLR3B9thGTTxX2WGuGHJqRiAbKPeGTJ5XWXVg6A==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-syntax-nullish-coalescing-operator": {
      "version": "7.8.3",
      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-nullish-coalescing-operator/-/plugin-syntax-nullish-coalescing-operator-7.8.3.tgz",
      "integrity": "sha512-aSff4zPII1u2QD7y+F8oDsz19ew4IGEJg9SVW+bqwpwtfFleiQDMdzA/R+UlWDzfnHFCxxleFT0PMIrR36XLNQ==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.8.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-syntax-optional-chaining": {
      "version": "7.8.3",
      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-optional-chaining/-/plugin-syntax-optional-chaining-7.8.3.tgz",
      "integrity": "sha512-KoK9ErH1MBlCPxV0VANkXW2/dw4vlbGDrFgz8bmUsBGYkFRcbRwMh6cIJubdPrkxRwuGdtCk0v/wPTKbQgBjkg==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.8.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-syntax-typescript": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-typescript/-/plugin-syntax-typescript-7.29.7.tgz",
      "integrity": "sha512-ngr+82Sh0xMz25TPCZi+nC2iTzjfCdWS2ONXTp/PtSCHCgaCNBpdMqgvJ2ccdLlClVZ7sisIgB914j/JFe+RZA==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-async-generator-functions": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-async-generator-functions/-/plugin-transform-async-generator-functions-7.29.7.tgz",
      "integrity": "sha512-d98gXZkgswvkyohMBABkhm3GeXhYj8psWfwQ2C7gtfrKGTykQa/iOIi+JJhwMjPlZ6Vm2XN+DCf3Es1EoG4ZLA==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.29.7",
        "@babel/helper-remap-async-to-generator": "^7.29.7",
        "@babel/traverse": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-async-to-generator": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-async-to-generator/-/plugin-transform-async-to-generator-7.29.7.tgz",
      "integrity": "sha512-pcUb2SS+RMo9TWVBwKGI5ShtoG7R+zBsFmCKDa6fe8c+hPr3XJlZgoE5j6i8W7gDjhyvy+85vmYexanvXh3d1w==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-module-imports": "^7.29.7",
        "@babel/helper-plugin-utils": "^7.29.7",
        "@babel/helper-remap-async-to-generator": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-block-scoping": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-block-scoping/-/plugin-transform-block-scoping-7.29.7.tgz",
      "integrity": "sha512-ONyr4+AZhKh8yKWInVxU9AXA9EbsyeLcL6V0dJy6M2/62vuvpGm29zzuymbTpdc451GEpDIdAyPLP3r+P61yKQ==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-class-properties": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-class-properties/-/plugin-transform-class-properties-7.29.7.tgz",
      "integrity": "sha512-GtcpjFvanPfzNQi3eTitsCqtRRmmqzpy/A+yhTR1HaZo1Ly3EA8ZXxlPyHdR8/IuRMYc3E4wdGBewB2QKQjAaA==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-create-class-features-plugin": "^7.29.7",
        "@babel/helper-plugin-utils": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-class-static-block": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-class-static-block/-/plugin-transform-class-static-block-7.29.7.tgz",
      "integrity": "sha512-kibJgmEdX2iMwsHY2tSZNDgj8PwIlCQz7FK9KuGKO8zsuoUwSEhoNnNVp/emKWrbY4HeO6kkXfdMqRKKKXBm2A==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-create-class-features-plugin": "^7.29.7",
        "@babel/helper-plugin-utils": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.12.0"
      }
    },
    "node_modules/@babel/plugin-transform-classes": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-classes/-/plugin-transform-classes-7.29.7.tgz",
      "integrity": "sha512-qV0OGGBVacduzQHE649JyCneOFI/maT+YKsO+K4Yi3xv2wTPNjM/W2o2gdzMwEAZz7fXNTHAe0NcSg30bIN69g==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-annotate-as-pure": "^7.29.7",
        "@babel/helper-compilation-targets": "^7.29.7",
        "@babel/helper-globals": "^7.29.7",
        "@babel/helper-plugin-utils": "^7.29.7",
        "@babel/helper-replace-supers": "^7.29.7",
        "@babel/traverse": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-destructuring": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-destructuring/-/plugin-transform-destructuring-7.29.7.tgz",
      "integrity": "sha512-iPX8aD6H9zV5s7ZsqTdNocPN/MGQ5sSMnElKrktxjJRMnB2jN/1p2+R7GkfD6CAYoVFqy5A4XnSIUeGgJzIWpg==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.29.7",
        "@babel/traverse": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-export-namespace-from": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-export-namespace-from/-/plugin-transform-export-namespace-from-7.29.7.tgz",
      "integrity": "sha512-24B2nOy2TeJSMheqwPD4DDQOV/elLSIlKxjZt4i05H5AgdPdWR3n18HnNrcJ+j76WJd9gbwb9jPjNYUy6RautA==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-flow-strip-types": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-flow-strip-types/-/plugin-transform-flow-strip-types-7.29.7.tgz",
      "integrity": "sha512-wRHeUjUjCZnMHmiO5bRgjFLcoEh7JyTdByOW11ahhwNa4V0bmeGEaIvt51yq0zQp2yWIpqfxXXPyUP6GFJZHOQ==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.29.7",
        "@babel/plugin-syntax-flow": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-for-of": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-for-of/-/plugin-transform-for-of-7.29.7.tgz",
      "integrity": "sha512-zeSIHh0+E1Um1WJRXCFlHQYu2ieJNdivLLjlBEp+dIBu3S51n+SZZmIXjxnItw6pz56Cn+KvK68BIBVsxq2JiQ==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.29.7",
        "@babel/helper-skip-transparent-expression-wrappers": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-logical-assignment-operators": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-logical-assignment-operators/-/plugin-transform-logical-assignment-operators-7.29.7.tgz",
      "integrity": "sha512-A0H91hh6W8MFRkp5TqJmMr39jzGD1A1E1Ysiv2O06Sfbhkapm+XyIzxWCEh5kqwOZ1/8QZ0dY3SeQ7XBqfJd5Q==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-modules-commonjs": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-modules-commonjs/-/plugin-transform-modules-commonjs-7.29.7.tgz",
      "integrity": "sha512-j0vCldybPC5b5dwCQOJ21uKtHzt7hxLygJTg9eF1ScfaikEDNfzn94XoW5Fi+seBR0nCyL23xaBFFkq7dTM8XQ==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-module-transforms": "^7.29.7",
        "@babel/helper-plugin-utils": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-named-capturing-groups-regex": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-named-capturing-groups-regex/-/plugin-transform-named-capturing-groups-regex-7.29.7.tgz",
      "integrity": "sha512-vuFoLwr4qnv2xbZ16SQd6uPcH5FNrLHhk/Jzo++0XJFcaDsr4gjJVg6j398oMHiC+83k/GiBzviwF5KBJkPUtQ==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-create-regexp-features-plugin": "^7.29.7",
        "@babel/helper-plugin-utils": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0"
      }
    },
    "node_modules/@babel/plugin-transform-nullish-coalescing-operator": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-nullish-coalescing-operator/-/plugin-transform-nullish-coalescing-operator-7.29.7.tgz",
      "integrity": "sha512-idmp1dFaekP9GbcMvG24Kvw2BfhFZjHnNJCkV4WuIY4PskJzwI3f1N5OdgYke38T7rftO6ERulFRn2cFeZwRkg==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-object-rest-spread": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-object-rest-spread/-/plugin-transform-object-rest-spread-7.29.7.tgz",
      "integrity": "sha512-Ld98jn4c0smUywL57m7SgsHq3OpThOa6LqZJif3G6jYOovPleoFhVrBJ1WegRApSFB2wu4+RelAj9AC9G08Z4A==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-compilation-targets": "^7.29.7",
        "@babel/helper-plugin-utils": "^7.29.7",
        "@babel/plugin-transform-destructuring": "^7.29.7",
        "@babel/plugin-transform-parameters": "^7.29.7",
        "@babel/traverse": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-optional-catch-binding": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-optional-catch-binding/-/plugin-transform-optional-catch-binding-7.29.7.tgz",
      "integrity": "sha512-sLsyndxK2VwX6yNUOakMb7Sh553ZTe/vVM1XJ+9Z5aW1ytsc8xOIwmyk05NNjN60vkc5/KqoTH6hB4V41LJhng==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-optional-chaining": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-optional-chaining/-/plugin-transform-optional-chaining-7.29.7.tgz",
      "integrity": "sha512-6GM1dhvK3gNODkXcEcMCOLEDCLSoZ/sBbro2Ax8HURyasQ4NshagQixkRFdh5niI6E4gmA/jYI/4aT7rRos3ZQ==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.29.7",
        "@babel/helper-skip-transparent-expression-wrappers": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-parameters": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-parameters/-/plugin-transform-parameters-7.29.7.tgz",
      "integrity": "sha512-ZDOBqV/qLYJI0YElr8DcENEyARsFQeESqWXH6gZlghYXuPPjvweuDhP4VyEi4BlUBlLRFZVjxoZDMjxhLW766g==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-private-methods": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-private-methods/-/plugin-transform-private-methods-7.29.7.tgz",
      "integrity": "sha512-/6Rz4DK1ETDEM/bWHsPHcaEe7ZaT1EqSXjtSP/L0DijOYuaUhiRiOKcwpZ8P7zR4xXEHc2ITdiCgBm9Tpyv9ug==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-create-class-features-plugin": "^7.29.7",
        "@babel/helper-plugin-utils": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-private-property-in-object": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-private-property-in-object/-/plugin-transform-private-property-in-object-7.29.7.tgz",
      "integrity": "sha512-+BNo06dnrzdNNqCm1X6YUaVv0DKk8Q+JYcoZfOkLhYWNCXzlwTSRq8zGWayT1csjcpNXV9CQTBRRbmTLZac5cA==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-annotate-as-pure": "^7.29.7",
        "@babel/helper-create-class-features-plugin": "^7.29.7",
        "@babel/helper-plugin-utils": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-react-display-name": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-react-display-name/-/plugin-transform-react-display-name-7.29.7.tgz",
      "integrity": "sha512-+1wdDMGNb4UPeY3Q4L5yLiYe6TXPXubs4NjrgRFw13hPRLJfEMw2Q5OXkee6/IfdqePIeW4Jjwe3aBh7SdKz4Q==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-react-jsx": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-react-jsx/-/plugin-transform-react-jsx-7.29.7.tgz",
      "integrity": "sha512-WsZulLVBUHXVj2cUcPVx6UE21TpalB6bHbSFErKT0Ib++ax24jjXe73FqlWvdylFOjiuPHYi6VCcgRad1ItN+A==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-annotate-as-pure": "^7.29.7",
        "@babel/helper-module-imports": "^7.29.7",
        "@babel/helper-plugin-utils": "^7.29.7",
        "@babel/plugin-syntax-jsx": "^7.29.7",
        "@babel/types": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-react-jsx-development": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-react-jsx-development/-/plugin-transform-react-jsx-development-7.29.7.tgz",
      "integrity": "sha512-Xfy3UVMF04+ypnFbkhvfqtmvwfe92qwQdbGZVonhE+6v35GzlofmOnA1szaZqzb9xYWr0nl1e5EMmzi0DNON1g==",
      "license": "MIT",
      "dependencies": {
        "@babel/plugin-transform-react-jsx": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-react-pure-annotations": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-react-pure-annotations/-/plugin-transform-react-pure-annotations-7.29.7.tgz",
      "integrity": "sha512-H5E+HBgDpr6Q5t+Aj11tL7XkIui1jhbIoArVQnqjgXo5/3YxkN7ZEBcWF4RQlB0T4rrxJQbXS6kiFV6B7XTqUA==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-annotate-as-pure": "^7.29.7",
        "@babel/helper-plugin-utils": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-runtime": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-runtime/-/plugin-transform-runtime-7.29.7.tgz",
      "integrity": "sha512-xmAscdE/AsqRW7vutbPNoUmu/nF5SrLKPs7aoJgEjo35lLKA/Bc0i2rMv/hr1+Y0o1bQCiVtith3u2vdgRL39Q==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-module-imports": "^7.29.7",
        "@babel/helper-plugin-utils": "^7.29.7",
        "babel-plugin-polyfill-corejs2": "^0.4.14",
        "babel-plugin-polyfill-corejs3": "^0.13.0",
        "babel-plugin-polyfill-regenerator": "^0.6.5",
        "semver": "^6.3.1"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-runtime/node_modules/semver": {
      "version": "6.3.1",
      "resolved": "https://registry.npmjs.org/semver/-/semver-6.3.1.tgz",
      "integrity": "sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==",
      "license": "ISC",
      "bin": {
        "semver": "bin/semver.js"
      }
    },
    "node_modules/@babel/plugin-transform-typescript": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-typescript/-/plugin-transform-typescript-7.29.7.tgz",
      "integrity": "sha512-jK52h8LaLc7JarhQV2ofeFMts4H7vnOXnqZNA6fYglBTZewRBE51KWt3BUltW1P+KoPsYkHoJeXePuz4zo2LMw==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-annotate-as-pure": "^7.29.7",
        "@babel/helper-create-class-features-plugin": "^7.29.7",
        "@babel/helper-plugin-utils": "^7.29.7",
        "@babel/helper-skip-transparent-expression-wrappers": "^7.29.7",
        "@babel/plugin-syntax-typescript": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-unicode-regex": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-unicode-regex/-/plugin-transform-unicode-regex-7.29.7.tgz",
      "integrity": "sha512-7D/x/23/d/3VqZ0QA+LGbZMlGwZjztBygSWWWsfTPoQ1oQ6Q1P6Mr3d0kk42XabyUVw+fha3LqdRsFqeKqvCyA==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-create-regexp-features-plugin": "^7.29.7",
        "@babel/helper-plugin-utils": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/preset-typescript": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/preset-typescript/-/preset-typescript-7.29.7.tgz",
      "integrity": "sha512-/Foi8vKY2EVbed/1eZx0gJEEwHAIxogrySI7rULcRIvhZzbvoE/b5qG5Ghc0WKAFKOHA9SD1x7RsFlOYdutIiQ==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.29.7",
        "@babel/helper-validator-option": "^7.29.7",
        "@babel/plugin-syntax-jsx": "^7.29.7",
        "@babel/plugin-transform-modules-commonjs": "^7.29.7",
        "@babel/plugin-transform-typescript": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/runtime": {
      "version": "7.29.2",
      "resolved": "https://registry.npmjs.org/@babel/runtime/-/runtime-7.29.2.tgz",
      "integrity": "sha512-JiDShH45zKHWyGe4ZNVRrCjBz8Nh9TMmZG1kh4QTK8hCBTWBi8Da+i7s1fJw7/lYpM4ccepSNfqzZ/QvABBi5g==",
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/template": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/template/-/template-7.29.7.tgz",
      "integrity": "sha512-puq+Gf35oI24FeN11LkoUQFqv9uwNeWpxXZi/Ji3rRIoKAzKnxRaZ+Gkj0vKS9ZCiTESfng1N9LyOyXvo+m+Gg==",
      "license": "MIT",
      "dependencies": {
        "@babel/code-frame": "^7.29.7",
        "@babel/parser": "^7.29.7",
        "@babel/types": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/traverse": {
      "version": "7.29.8",
      "resolved": "https://registry.npmjs.org/@babel/traverse/-/traverse-7.29.8.tgz",
      "integrity": "sha512-I5z7H3bf/41ktsNVLtpN0wAa336HkqIHQ5BuPLEhTkt1jVSyZpeNKIzTgEWmlxjdg81R0IgUCcaE+Ok3NvrfZg==",
      "license": "MIT",
      "dependencies": {
        "@babel/code-frame": "^7.29.7",
        "@babel/generator": "^7.29.8",
        "@babel/helper-globals": "^7.29.7",
        "@babel/parser": "^7.29.8",
        "@babel/template": "^7.29.7",
        "@babel/types": "^7.29.8",
        "debug": "^4.3.1"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/types": {
      "version": "7.29.8",
      "resolved": "https://registry.npmjs.org/@babel/types/-/types-7.29.8.tgz",
      "integrity": "sha512-Vj1jF3cPfxg7OAfoI7QnVKLoILlm2JF9pnVHrX8qx7AHMiYWT+NDAA7jChlNgRS4WTLc/fD1lXLmPixluj+3Gg==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-string-parser": "^7.29.7",
        "@babel/helper-validator-identifier": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@egjs/hammerjs": {
      "version": "2.0.17",
      "resolved": "https://registry.npmjs.org/@egjs/hammerjs/-/hammerjs-2.0.17.tgz",
      "integrity": "sha512-XQsZgjm2EcVUiZQf11UBJQfmZeEmOW8DpI1gsFeln6w0ae0ii4dMQEQ0kjl6DspdWX1aGY1/loyXnP0JS06e/A==",
      "license": "MIT",
      "dependencies": {
        "@types/hammerjs": "^2.0.36"
      },
      "engines": {
        "node": ">=0.8.0"
      }
    },
    "node_modules/@expo/code-signing-certificates": {
      "version": "0.0.6",
      "resolved": "https://registry.npmjs.org/@expo/code-signing-certificates/-/code-signing-certificates-0.0.6.tgz",
      "integrity": "sha512-iNe0puxwBNEcuua9gmTGzq+SuMDa0iATai1FlFTMHJ/vUmKvN/V//drXoLJkVb5i5H3iE/n/qIJxyoBnXouD0w==",
      "license": "MIT",
      "dependencies": {
        "node-forge": "^1.3.3"
      }
    },
    "node_modules/@expo/config": {
      "version": "57.0.9",
      "resolved": "https://registry.npmjs.org/@expo/config/-/config-57.0.9.tgz",
      "integrity": "sha512-dmzlKraIFxa7wLwV6K7WzI8jp6QZpW6Mc5mGjLimJUFjzh4uQdYaT3m3plEutM5yxBoBEwqzks7l+I/ljCbxAQ==",
      "license": "MIT",
      "dependencies": {
        "@expo/config-plugins": "~57.0.9",
        "@expo/config-types": "^57.0.2",
        "@expo/json-file": "^11.0.1",
        "@expo/require-utils": "^57.0.5",
        "deepmerge": "^4.3.1",
        "getenv": "^2.0.0",
        "glob": "^13.0.0",
        "resolve-workspace-root": "^2.0.0",
        "semver": "^7.6.0",
        "slugify": "^1.3.4"
      }
    },
    "node_modules/@expo/config-plugins": {
      "version": "57.0.9",
      "resolved": "https://registry.npmjs.org/@expo/config-plugins/-/config-plugins-57.0.9.tgz",
      "integrity": "sha512-hHgfL1avkCdEvDSw7IwlKwRYYNgcxzbNNMIk6W6lTkJpY0MajinAfeJUS0J+wPCsjUfGbVqOJM+XhPaO5ulUxg==",
      "license": "MIT",
      "dependencies": {
        "@expo/config-types": "^57.0.2",
        "@expo/json-file": "~11.0.1",
        "@expo/plist": "^0.8.1",
        "@expo/require-utils": "^57.0.5",
        "@expo/sdk-runtime-versions": "^1.0.0",
        "chalk": "^4.1.2",
        "debug": "^4.3.5",
        "getenv": "^2.0.0",
        "glob": "^13.0.0",
        "semver": "^7.5.4",
        "slugify": "^1.6.6",
        "xcode": "^3.0.1",
        "xml2js": "0.6.0"
      }
    },
    "node_modules/@expo/config-types": {
      "version": "57.0.2",
      "resolved": "https://registry.npmjs.org/@expo/config-types/-/config-types-57.0.2.tgz",
      "integrity": "sha512-ewW08OonrcRIsRKIlFvvcmmafE5zemb1ocu3HkNwtVPyRtj2w42pZCAkMIROYpcVBaPnc3mDT9UZDzwXWC3i6g==",
      "license": "MIT"
    },
    "node_modules/@expo/devcert": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/@expo/devcert/-/devcert-1.2.1.tgz",
      "integrity": "sha512-qC4eaxmKMTmJC2ahwyui6ud8f3W60Ss7pMkpBq40Hu3zyiAaugPXnZ24145U7K36qO9UHdZUVxsCvIpz2RYYCA==",
      "license": "MIT",
      "dependencies": {
        "@expo/sudo-prompt": "^9.3.1",
        "debug": "^3.1.0"
      }
    },
    "node_modules/@expo/devcert/node_modules/debug": {
      "version": "3.2.7",
      "resolved": "https://registry.npmjs.org/debug/-/debug-3.2.7.tgz",
      "integrity": "sha512-CFjzYYAi4ThfiQvizrFQevTTXHtnCqWfe7x1AhgEscTz6ZbLbfoLRLPugTQyBth6f8ZERVUSyWHFD/7Wu4t1XQ==",
      "license": "MIT",
      "dependencies": {
        "ms": "^2.1.1"
      }
    },
    "node_modules/@expo/devtools": {
      "version": "57.0.1",
      "resolved": "https://registry.npmjs.org/@expo/devtools/-/devtools-57.0.1.tgz",
      "integrity": "sha512-GyUf+wFNkbttaX0jR7MZa9bm77U0IrLg6d2AjpxdyoXw/w4abHoXG0oFufwLMgP9zLTd5+Ct4X/ffNUTnlzZgg==",
      "license": "MIT",
      "dependencies": {
        "chalk": "^4.1.2"
      },
      "peerDependencies": {
        "react": "*",
        "react-native": "*"
      },
      "peerDependenciesMeta": {
        "react": {
          "optional": true
        },
        "react-native": {
          "optional": true
        }
      }
    },
    "node_modules/@expo/dom-webview": {
      "version": "57.0.1",
      "resolved": "https://registry.npmjs.org/@expo/dom-webview/-/dom-webview-57.0.1.tgz",
      "integrity": "sha512-lAKsME4SAq+8sf56oN0DX5TBYyruupoRxbWbD2xf9RnKY8y6x8eb9LCE5pxSN0qyWdqnp+0wmyWzDkKboThKAw==",
      "license": "MIT",
      "peerDependencies": {
        "expo": "*",
        "react": "*",
        "react-native": "*"
      }
    },
    "node_modules/@expo/env": {
      "version": "2.4.3",
      "resolved": "https://registry.npmjs.org/@expo/env/-/env-2.4.3.tgz",
      "integrity": "sha512-M1NXeZCA1mkMkYOyIe7PlyRX0/jqFtMoJgyblnlq/vpCRfmueFT7RnGSQG8uEFDF5WHOFGijAQ3fogPh3/n5Ng==",
      "license": "MIT",
      "dependencies": {
        "chalk": "^4.0.0",
        "debug": "^4.3.4",
        "getenv": "^2.0.0"
      },
      "engines": {
        "node": ">=20.12.0"
      }
    },
    "node_modules/@expo/expo-modules-macros-plugin": {
      "version": "0.6.1",
      "resolved": "https://registry.npmjs.org/@expo/expo-modules-macros-plugin/-/expo-modules-macros-plugin-0.6.1.tgz",
      "integrity": "sha512-cpsLZE4rqkc1Y3eZTkxB98jrqY1YXgetmtxFt8q89jBRmk3quRuk1BZo+VcnCSObZardjg99r1k5xijEMONFGA==",
      "license": "MIT"
    },
    "node_modules/@expo/fingerprint": {
      "version": "0.20.12",
      "resolved": "https://registry.npmjs.org/@expo/fingerprint/-/fingerprint-0.20.12.tgz",
      "integrity": "sha512-FIR5fkZYeFaLSowmjgyB6RPKl8AXeE8HuCBHHvyxK8UhOjpPfCAmzT4E7v2yub4qqDafKnfcOFCYxvpUEu+01w==",
      "license": "MIT",
      "dependencies": {
        "@expo/env": "^2.4.3",
        "@expo/spawn-async": "^1.8.0",
        "arg": "^5.0.2",
        "chalk": "^4.1.2",
        "debug": "^4.3.4",
        "getenv": "^2.0.0",
        "glob": "^13.0.0",
        "ignore": "^5.3.1",
        "minimatch": "^10.2.2",
        "resolve-from": "^5.0.0",
        "semver": "^7.6.0"
      },
      "bin": {
        "fingerprint": "bin/cli.js"
      }
    },
    "node_modules/@expo/image-utils": {
      "version": "0.11.5",
      "resolved": "https://registry.npmjs.org/@expo/image-utils/-/image-utils-0.11.5.tgz",
      "integrity": "sha512-KPQBTpmpAfy/Vu9y4wPW808/qtZxjYmyJg8cm2QCPAupp+qEWA3b5zmk0ulOwQ9OgeHxuCPgUqWgkwHFo7UsrQ==",
      "license": "MIT",
      "dependencies": {
        "@expo/require-utils": "^57.0.5",
        "@expo/spawn-async": "^1.8.0",
        "chalk": "^4.0.0",
        "getenv": "^2.0.0",
        "jimp-compact": "0.16.1",
        "parse-png": "^2.1.0",
        "semver": "^7.6.0"
      }
    },
    "node_modules/@expo/inline-modules": {
      "version": "0.1.7",
      "resolved": "https://registry.npmjs.org/@expo/inline-modules/-/inline-modules-0.1.7.tgz",
      "integrity": "sha512-Bz/khd1gIJqDkje7t5ejD5e9jFbm4xEJzWSwRKadRo6gruepbw1xJ3Eb+e58OS8fY1ZNQYjzZbspnuph67sN0g==",
      "license": "MIT",
      "dependencies": {
        "@expo/config-plugins": "~57.0.9"
      }
    },
    "node_modules/@expo/json-file": {
      "version": "11.0.1",
      "resolved": "https://registry.npmjs.org/@expo/json-file/-/json-file-11.0.1.tgz",
      "integrity": "sha512-zxHWj4MKKMAL29ZQSY/Fssx4Thluk40JmuGNaeS078wy/NhlFhnVi+rHHunulE3xJAJ0CM73m8VK2+GkF9eRwQ==",
      "license": "MIT",
      "dependencies": {
        "@babel/code-frame": "^7.20.0",
        "json5": "^2.2.3"
      }
    },
    "node_modules/@expo/local-build-cache-provider": {
      "version": "57.0.8",
      "resolved": "https://registry.npmjs.org/@expo/local-build-cache-provider/-/local-build-cache-provider-57.0.8.tgz",
      "integrity": "sha512-SEdE0pAQrr90bRh3MNR0ZuwoIBw390cYdFgbn7Vk0Mtm9EHaBfP7kYj+2hXnXZJgOEm3/JMtfoD3rV7rWA9FGg==",
      "license": "MIT",
      "dependencies": {
        "@expo/config": "~57.0.9",
        "chalk": "^4.1.2"
      }
    },
    "node_modules/@expo/log-box": {
      "version": "57.0.4",
      "resolved": "https://registry.npmjs.org/@expo/log-box/-/log-box-57.0.4.tgz",
      "integrity": "sha512-IxwS9s1L2muj8mj8AQSuiy7u8OFJdc02NRFo2me/Tj6DiaeG5SREqmpBE4rQpR2cadqSg5jl8Qab8Cjie616dg==",
      "license": "MIT",
      "dependencies": {
        "@expo/dom-webview": "^57.0.1",
        "anser": "^1.4.9",
        "stacktrace-parser": "^0.1.10"
      },
      "peerDependencies": {
        "@expo/dom-webview": "^57.0.1",
        "expo": "*",
        "react": "*",
        "react-native": "*"
      }
    },
    "node_modules/@expo/metro": {
      "version": "56.0.2",
      "resolved": "https://registry.npmjs.org/@expo/metro/-/metro-56.0.2.tgz",
      "integrity": "sha512-Ld5AeYMCCDa8bLeWhfuLbZFFjlV3f6ORqyPz2glGh6RltIngMuLf9BTC2yvHFjkKuGxL5SynijmA8xmNNWn5iA==",
      "license": "MIT",
      "dependencies": {
        "metro": "0.84.5",
        "metro-babel-transformer": "0.84.5",
        "metro-cache": "0.84.5",
        "metro-cache-key": "0.84.5",
        "metro-config": "0.84.5",
        "metro-core": "0.84.5",
        "metro-file-map": "0.84.5",
        "metro-minify-terser": "0.84.5",
        "metro-resolver": "0.84.5",
        "metro-runtime": "0.84.5",
        "metro-source-map": "0.84.5",
        "metro-symbolicate": "0.84.5",
        "metro-transform-plugins": "0.84.5",
        "metro-transform-worker": "0.84.5"
      }
    },
    "node_modules/@expo/metro-config": {
      "version": "57.0.12",
      "resolved": "https://registry.npmjs.org/@expo/metro-config/-/metro-config-57.0.12.tgz",
      "integrity": "sha512-S62Lrq35HZqBFD55423pmWb8PjaiR/W02zQC1uECBmw1vTN8WZaFz4TJ0i21EeJzwfebMb9MLxL8JZ102Z6VbA==",
      "license": "MIT",
      "dependencies": {
        "@babel/code-frame": "^7.20.0",
        "@babel/core": "^7.20.0",
        "@babel/generator": "^7.20.5",
        "@expo/config": "~57.0.9",
        "@expo/env": "~2.4.3",
        "@expo/json-file": "~11.0.1",
        "@expo/metro": "~56.0.2",
        "@expo/require-utils": "^57.0.5",
        "@expo/spawn-async": "^1.8.0",
        "@jridgewell/gen-mapping": "^0.3.13",
        "@jridgewell/remapping": "^2.3.5",
        "@jridgewell/sourcemap-codec": "^1.5.5",
        "browserslist": "^4.25.0",
        "chalk": "^4.1.0",
        "debug": "^4.3.2",
        "getenv": "^2.0.0",
        "glob": "^13.0.0",
        "hermes-parser": "^0.36.0",
        "jsc-safe-url": "^0.2.4",
        "lightningcss": "^1.30.1",
        "picomatch": "^4.0.4",
        "postcss": "^8.5.14",
        "resolve-from": "^5.0.0"
      },
      "peerDependencies": {
        "expo": "*"
      },
      "peerDependenciesMeta": {
        "expo": {
          "optional": true
        }
      }
    },
    "node_modules/@expo/metro-config/node_modules/hermes-estree": {
      "version": "0.36.1",
      "resolved": "https://registry.npmjs.org/hermes-estree/-/hermes-estree-0.36.1.tgz",
      "integrity": "sha512-guv1nQ6IJ7S83NRFPWc3SA7IBZrdNC9kapwOq6uXvF4wP+sDCgjzQbKPCoyYmoyZRzztF/n/c36l/rccCZSiCw==",
      "license": "MIT"
    },
    "node_modules/@expo/metro-config/node_modules/hermes-parser": {
      "version": "0.36.1",
      "resolved": "https://registry.npmjs.org/hermes-parser/-/hermes-parser-0.36.1.tgz",
      "integrity": "sha512-GApNk4zLHi2UWoWZZkx7LNCOSzLSc5lB55pZ/PhK7ycFeg7u5LcF88p/WbpIi1XUDtE0MpHE3uRR3u3KB7TjSQ==",
      "license": "MIT",
      "dependencies": {
        "hermes-estree": "0.36.1"
      }
    },
    "node_modules/@expo/metro-config/node_modules/picomatch": {
      "version": "4.0.7",
      "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-4.0.7.tgz",
      "integrity": "sha512-qcJu88Q2IWqJsDD529JKMdwGm/dvInW4HvQnRwiH9JtihJvzGOscDtHE3x1pBKeUOTysQ8kVmLnJ2kJu7yhcGA==",
      "license": "MIT",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/sponsors/jonschlinkert"
      }
    },
    "node_modules/@expo/metro-file-map": {
      "version": "57.0.3",
      "resolved": "https://registry.npmjs.org/@expo/metro-file-map/-/metro-file-map-57.0.3.tgz",
      "integrity": "sha512-1OXy+uPYY5uc7Tm4VBsd2NRn+3wHhqeqNuEO/Xo4kmYgv8FjYgUAc+bUXON9FpC2ikcLn4EVlGM9ce2exx9Mlg==",
      "license": "MIT",
      "dependencies": {
        "debug": "^4.3.4",
        "fb-watchman": "^2.0.2",
        "invariant": "^2.2.4",
        "jest-worker": "^29.7.0",
        "micromatch": "^4.0.4",
        "walker": "^1.0.8"
      }
    },
    "node_modules/@expo/metro/node_modules/accepts": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/accepts/-/accepts-2.0.0.tgz",
      "integrity": "sha512-5cvg6CtKwfgdmVqY1WIiXKc3Q1bkRqGLi+2W/6ao+6Y7gu/RCwRuAhGEzh5B4KlszSuTLgZYuqFqo5bImjNKng==",
      "license": "MIT",
      "dependencies": {
        "mime-types": "^3.0.0",
        "negotiator": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/@expo/metro/node_modules/hermes-estree": {
      "version": "0.35.0",
      "resolved": "https://registry.npmjs.org/hermes-estree/-/hermes-estree-0.35.0.tgz",
      "integrity": "sha512-xVx5Opwy8Oo1I5yGpVRhCvWL/iV3M+ylksSKVNlxxD90cpDpR/AR1jLYqK8HWihm065a6UI3HeyAmYzwS8NOOg==",
      "license": "MIT"
    },
    "node_modules/@expo/metro/node_modules/hermes-parser": {
      "version": "0.35.0",
      "resolved": "https://registry.npmjs.org/hermes-parser/-/hermes-parser-0.35.0.tgz",
      "integrity": "sha512-9JLjeHxBx8T4CAsydZR49PNZUaix+WpQJwu9p2010lu+7Kwl6D/7wYFFJxoz+aXkaaClp9Zfg6W6/zVlSJORaA==",
      "license": "MIT",
      "dependencies": {
        "hermes-estree": "0.35.0"
      }
    },
    "node_modules/@expo/metro/node_modules/metro": {
      "version": "0.84.5",
      "resolved": "https://registry.npmjs.org/metro/-/metro-0.84.5.tgz",
      "integrity": "sha512-r1liLkyFZMVSEMNjU1CJU5pRzs3NdkxHqXS60O25c0rCIqAR+cGk7rPydw/g0WAIKVXojIBIF45yYBPagJGcgw==",
      "license": "MIT",
      "dependencies": {
        "@babel/code-frame": "^7.29.0",
        "@babel/core": "^7.25.2",
        "@babel/generator": "^7.29.1",
        "@babel/parser": "^7.29.0",
        "@babel/template": "^7.28.6",
        "@babel/traverse": "^7.29.0",
        "@babel/types": "^7.29.0",
        "accepts": "^2.0.0",
        "ci-info": "^2.0.0",
        "connect": "^3.6.5",
        "debug": "^4.4.0",
        "error-stack-parser": "^2.0.6",
        "flow-enums-runtime": "^0.0.6",
        "graceful-fs": "^4.2.4",
        "hermes-parser": "0.35.0",
        "invariant": "^2.2.4",
        "jest-worker": "^29.7.0",
        "jsc-safe-url": "^0.2.2",
        "lodash.throttle": "^4.1.1",
        "metro-babel-transformer": "0.84.5",
        "metro-cache": "0.84.5",
        "metro-cache-key": "0.84.5",
        "metro-config": "0.84.5",
        "metro-core": "0.84.5",
        "metro-file-map": "0.84.5",
        "metro-resolver": "0.84.5",
        "metro-runtime": "0.84.5",
        "metro-source-map": "0.84.5",
        "metro-symbolicate": "0.84.5",
        "metro-transform-plugins": "0.84.5",
        "metro-transform-worker": "0.84.5",
        "mime-types": "^3.0.1",
        "nullthrows": "^1.1.1",
        "serialize-error": "^2.1.0",
        "source-map": "^0.5.6",
        "throat": "^5.0.0",
        "ws": "^7.5.10",
        "yargs": "^17.6.2"
      },
      "bin": {
        "metro": "src/cli.js"
      },
      "engines": {
        "node": "^20.19.4 || ^22.13.0 || ^24.3.0 || >= 25.0.0"
      }
    },
    "node_modules/@expo/metro/node_modules/metro-babel-transformer": {
      "version": "0.84.5",
      "resolved": "https://registry.npmjs.org/metro-babel-transformer/-/metro-babel-transformer-0.84.5.tgz",
      "integrity": "sha512-2WbHILKMiJUzfdjmGOQOqU1bWi9//gqiclc/tkk/AIsrrVw3efhZ1uhkOwMTxUEPOzqoo091H0olLmVZH5FHGQ==",
      "license": "MIT",
      "dependencies": {
        "@babel/core": "^7.25.2",
        "flow-enums-runtime": "^0.0.6",
        "hermes-parser": "0.35.0",
        "metro-cache-key": "0.84.5",
        "nullthrows": "^1.1.1"
      },
      "engines": {
        "node": "^20.19.4 || ^22.13.0 || ^24.3.0 || >= 25.0.0"
      }
    },
    "node_modules/@expo/metro/node_modules/metro-cache": {
      "version": "0.84.5",
      "resolved": "https://registry.npmjs.org/metro-cache/-/metro-cache-0.84.5.tgz",
      "integrity": "sha512-WHS0n2OxQqtwEjSeQFPePNrMvEFhmQcUQM9cRJMHByWoi/GMWFBEWOf7hVkAM/0KRutAXNbDlSu/cZB6CyxgQQ==",
      "license": "MIT",
      "dependencies": {
        "exponential-backoff": "^3.1.1",
        "flow-enums-runtime": "^0.0.6",
        "https-proxy-agent": "^7.0.5",
        "metro-core": "0.84.5"
      },
      "engines": {
        "node": "^20.19.4 || ^22.13.0 || ^24.3.0 || >= 25.0.0"
      }
    },
    "node_modules/@expo/metro/node_modules/metro-cache-key": {
      "version": "0.84.5",
      "resolved": "https://registry.npmjs.org/metro-cache-key/-/metro-cache-key-0.84.5.tgz",
      "integrity": "sha512-3dPB2TnvGjjf0/9O7AXVQURKXuQNauTZE7WpTGTlR017Gh/B5y0m/2wcqxfveUguHSpu89KhVxCAlr2k/H7uhQ==",
      "license": "MIT",
      "dependencies": {
        "flow-enums-runtime": "^0.0.6"
      },
      "engines": {
        "node": "^20.19.4 || ^22.13.0 || ^24.3.0 || >= 25.0.0"
      }
    },
    "node_modules/@expo/metro/node_modules/metro-config": {
      "version": "0.84.5",
      "resolved": "https://registry.npmjs.org/metro-config/-/metro-config-0.84.5.tgz",
      "integrity": "sha512-zie+uN6oohscowi2S7ByU+wUw6CrT4ZxW9uAbONOObSxx86RGmnIAmjXHLkfmcdYoY7jzOPEbqcI6oeVmqyBQA==",
      "license": "MIT",
      "dependencies": {
        "connect": "^3.6.5",
        "flow-enums-runtime": "^0.0.6",
        "jest-validate": "^29.7.0",
        "metro": "0.84.5",
        "metro-cache": "0.84.5",
        "metro-core": "0.84.5",
        "metro-runtime": "0.84.5",
        "yaml": "^2.6.1"
      },
      "engines": {
        "node": "^20.19.4 || ^22.13.0 || ^24.3.0 || >= 25.0.0"
      }
    },
    "node_modules/@expo/metro/node_modules/metro-core": {
      "version": "0.84.5",
      "resolved": "https://registry.npmjs.org/metro-core/-/metro-core-0.84.5.tgz",
      "integrity": "sha512-xwm605hCi5Y6eJTTb8ZWo6pkUcoBEIyiQOfkZh5GwtDwUrP9SNhTQZhzJHrBCwwxlf3Ptl/pxWJgQ1rsNYMnrA==",
      "license": "MIT",
      "dependencies": {
        "flow-enums-runtime": "^0.0.6",
        "lodash.throttle": "^4.1.1",
        "metro-resolver": "0.84.5"
      },
      "engines": {
        "node": "^20.19.4 || ^22.13.0 || ^24.3.0 || >= 25.0.0"
      }
    },
    "node_modules/@expo/metro/node_modules/metro-file-map": {
      "version": "0.84.5",
      "resolved": "https://registry.npmjs.org/metro-file-map/-/metro-file-map-0.84.5.tgz",
      "integrity": "sha512-mlm/JL8toSbSc2akpKIGmzvrVRSCgZ5vkbycI34oMLoOnLGuLyC8WTyVJ6P0hZG/usDaGwZSl/s9BCRriqjGJA==",
      "license": "MIT",
      "dependencies": {
        "debug": "^4.4.0",
        "fb-watchman": "^2.0.0",
        "flow-enums-runtime": "^0.0.6",
        "graceful-fs": "^4.2.4",
        "invariant": "^2.2.4",
        "jest-worker": "^29.7.0",
        "micromatch": "^4.0.4",
        "nullthrows": "^1.1.1",
        "walker": "^1.0.7"
      },
      "engines": {
        "node": "^20.19.4 || ^22.13.0 || ^24.3.0 || >= 25.0.0"
      }
    },
    "node_modules/@expo/metro/node_modules/metro-minify-terser": {
      "version": "0.84.5",
      "resolved": "https://registry.npmjs.org/metro-minify-terser/-/metro-minify-terser-0.84.5.tgz",
      "integrity": "sha512-BJoFwCEDsYnagPqarayInv2+diCDNDdLlaof/p6s9w4gh+gc9HXYM+pDvsKGKKUumpZswNF3Z/ftTMqKl/5IBg==",
      "license": "MIT",
      "dependencies": {
        "flow-enums-runtime": "^0.0.6",
        "terser": "^5.15.0"
      },
      "engines": {
        "node": "^20.19.4 || ^22.13.0 || ^24.3.0 || >= 25.0.0"
      }
    },
    "node_modules/@expo/metro/node_modules/metro-resolver": {
      "version": "0.84.5",
      "resolved": "https://registry.npmjs.org/metro-resolver/-/metro-resolver-0.84.5.tgz",
      "integrity": "sha512-VSSnepg1k6LyCwtb6eirWdAWlpKwBG8Rdtsr1mU38rMelFyWgh3/QuMSiZIZAIjwg/fsa8GhW5/FO54CAUPCEA==",
      "license": "MIT",
      "dependencies": {
        "flow-enums-runtime": "^0.0.6"
      },
      "engines": {
        "node": "^20.19.4 || ^22.13.0 || ^24.3.0 || >= 25.0.0"
      }
    },
    "node_modules/@expo/metro/node_modules/metro-runtime": {
      "version": "0.84.5",
      "resolved": "https://registry.npmjs.org/metro-runtime/-/metro-runtime-0.84.5.tgz",
      "integrity": "sha512-U1m2+d1Pr+JO2/iVXBB2OfXXityz7tqwIorxfrT15IEgaHvpJBq/OHiqnOWPKJbUl3JcxjcdviZZOKk85oK4Qg==",
      "license": "MIT",
      "dependencies": {
        "@babel/runtime": "^7.25.0",
        "flow-enums-runtime": "^0.0.6"
      },
      "engines": {
        "node": "^20.19.4 || ^22.13.0 || ^24.3.0 || >= 25.0.0"
      }
    },
    "node_modules/@expo/metro/node_modules/metro-source-map": {
      "version": "0.84.5",
      "resolved": "https://registry.npmjs.org/metro-source-map/-/metro-source-map-0.84.5.tgz",
      "integrity": "sha512-2BtV5L9uPc49F13Gn5wiP6bX/EncqzqTIk2VL/0F/96Vo0YEOjluT/qktQjFODfqGFsucwnh5mPEAl/2jVEfeg==",
      "license": "MIT",
      "dependencies": {
        "@babel/traverse": "^7.29.0",
        "@babel/types": "^7.29.0",
        "flow-enums-runtime": "^0.0.6",
        "invariant": "^2.2.4",
        "metro-symbolicate": "0.84.5",
        "nullthrows": "^1.1.1",
        "ob1": "0.84.5",
        "source-map": "^0.5.6",
        "vlq": "^1.0.0"
      },
      "engines": {
        "node": "^20.19.4 || ^22.13.0 || ^24.3.0 || >= 25.0.0"
      }
    },
    "node_modules/@expo/metro/node_modules/metro-symbolicate": {
      "version": "0.84.5",
      "resolved": "https://registry.npmjs.org/metro-symbolicate/-/metro-symbolicate-0.84.5.tgz",
      "integrity": "sha512-rQ40zYDAkaWBN9yvjUuAD0ZpzBMZSoKyGYXnb5JrfbKjun7fTvfoLHL3KXFYenBTYZkQtlp4cKSCv/1utxFyOw==",
      "license": "MIT",
      "dependencies": {
        "flow-enums-runtime": "^0.0.6",
        "invariant": "^2.2.4",
        "metro-source-map": "0.84.5",
        "nullthrows": "^1.1.1",
        "source-map": "^0.5.6",
        "vlq": "^1.0.0"
      },
      "bin": {
        "metro-symbolicate": "src/index.js"
      },
      "engines": {
        "node": "^20.19.4 || ^22.13.0 || ^24.3.0 || >= 25.0.0"
      }
    },
    "node_modules/@expo/metro/node_modules/metro-transform-plugins": {
      "version": "0.84.5",
      "resolved": "https://registry.npmjs.org/metro-transform-plugins/-/metro-transform-plugins-0.84.5.tgz",
      "integrity": "sha512-+InaSVGaOyt0DyRo4Y/zIdPI6CZwnbNho5LAL23tgmuGwv7fyfkF7kKfPjZcfxXBcoYdTLLFnCfCH/dHSiCqNg==",
      "license": "MIT",
      "dependencies": {
        "@babel/core": "^7.25.2",
        "@babel/generator": "^7.29.1",
        "@babel/template": "^7.28.6",
        "@babel/traverse": "^7.29.0",
        "flow-enums-runtime": "^0.0.6",
        "nullthrows": "^1.1.1"
      },
      "engines": {
        "node": "^20.19.4 || ^22.13.0 || ^24.3.0 || >= 25.0.0"
      }
    },
    "node_modules/@expo/metro/node_modules/metro-transform-worker": {
      "version": "0.84.5",
      "resolved": "https://registry.npmjs.org/metro-transform-worker/-/metro-transform-worker-0.84.5.tgz",
      "integrity": "sha512-ui1Z8x4s5RL36gMmKLaMMO7O9NNDHNdthEZSCDQHAau3JcAsTaFOK6I+2q4I/kW5u8hSEjJk9L45TXSVJw6g1A==",
      "license": "MIT",
      "dependencies": {
        "@babel/core": "^7.25.2",
        "@babel/generator": "^7.29.1",
        "@babel/parser": "^7.29.0",
        "@babel/types": "^7.29.0",
        "flow-enums-runtime": "^0.0.6",
        "metro": "0.84.5",
        "metro-babel-transformer": "0.84.5",
        "metro-cache": "0.84.5",
        "metro-cache-key": "0.84.5",
        "metro-minify-terser": "0.84.5",
        "metro-source-map": "0.84.5",
        "metro-transform-plugins": "0.84.5",
        "nullthrows": "^1.1.1"
      },
      "engines": {
        "node": "^20.19.4 || ^22.13.0 || ^24.3.0 || >= 25.0.0"
      }
    },
    "node_modules/@expo/metro/node_modules/mime-db": {
      "version": "1.54.0",
      "resolved": "https://registry.npmjs.org/mime-db/-/mime-db-1.54.0.tgz",
      "integrity": "sha512-aU5EJuIN2WDemCcAp2vFBfp/m4EAhWJnUNSSw0ixs7/kXbd6Pg64EmwJkNdFhB8aWt1sH2CTXrLxo/iAGV3oPQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/@expo/metro/node_modules/mime-types": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/mime-types/-/mime-types-3.0.2.tgz",
      "integrity": "sha512-Lbgzdk0h4juoQ9fCKXW4by0UJqj+nOOrI9MJ1sSj4nI8aI2eo1qmvQEie4VD1glsS250n15LsWsYtCugiStS5A==",
      "license": "MIT",
      "dependencies": {
        "mime-db": "^1.54.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/@expo/metro/node_modules/negotiator": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/negotiator/-/negotiator-1.1.0.tgz",
      "integrity": "sha512-NMPBRMJgiQHjbd8phG3Vebdx4kZ1H121rbl5IkMqeOsahptB9BKo/d7oJ3zTXqTgagn2bWlNSXkh0QUGM31RYg==",
      "license": "MIT",
      "dependencies": {
        "content-type": "^2.1.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/@expo/metro/node_modules/ob1": {
      "version": "0.84.5",
      "resolved": "https://registry.npmjs.org/ob1/-/ob1-0.84.5.tgz",
      "integrity": "sha512-aH9RkoZc7w/90HBamFxTw8ZLFr05wXS+iOnvmrgo53Ep8Pyrm5FieQSaPIVROkfFVQISeD/zo92fes26TOwe+A==",
      "license": "MIT",
      "dependencies": {
        "flow-enums-runtime": "^0.0.6"
      },
      "engines": {
        "node": "^20.19.4 || ^22.13.0 || ^24.3.0 || >= 25.0.0"
      }
    },
    "node_modules/@expo/osascript": {
      "version": "2.7.1",
      "resolved": "https://registry.npmjs.org/@expo/osascript/-/osascript-2.7.1.tgz",
      "integrity": "sha512-Zn03EX6In7ts2lPUW2ESUSkEhEWQN1qqsiXjadtZMJOuZRkMiAg1ZQHuvz9DjByDWNJ2pBwAGyrts9lj9k389g==",
      "license": "MIT",
      "dependencies": {
        "@expo/spawn-async": "^1.8.0"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@expo/package-manager": {
      "version": "1.13.1",
      "resolved": "https://registry.npmjs.org/@expo/package-manager/-/package-manager-1.13.1.tgz",
      "integrity": "sha512-y/K+CaYYpZpNGZhSX4HyLT/vyIunFjNfyoxNysPBCefeLKI/VCx6f9LNPzrxayr3rCYO5bl9O8H+HRQK265Nkg==",
      "license": "MIT",
      "dependencies": {
        "@expo/json-file": "^11.0.1",
        "@expo/spawn-async": "^1.8.0",
        "chalk": "^4.0.0",
        "npm-package-arg": "^11.0.0",
        "ora": "^3.4.0",
        "resolve-workspace-root": "^2.0.0"
      }
    },
    "node_modules/@expo/plist": {
      "version": "0.8.1",
      "resolved": "https://registry.npmjs.org/@expo/plist/-/plist-0.8.1.tgz",
      "integrity": "sha512-3gTReGIUm0oRaMClsAJYxBnVPCl6fVpsl8HS+DTVxDhW4GyVyxg9E/Znm3BvcHtUJ51RJJI14pC1wvrNilCRHw==",
      "license": "MIT",
      "dependencies": {
        "@xmldom/xmldom": "^0.8.8",
        "base64-js": "^1.5.1",
        "xmlbuilder": "^15.1.1"
      }
    },
    "node_modules/@expo/prebuild-config": {
      "version": "57.0.15",
      "resolved": "https://registry.npmjs.org/@expo/prebuild-config/-/prebuild-config-57.0.15.tgz",
      "integrity": "sha512-xTbWHroj0PDmlbqvmU+zF9ZZxveJkiuyiPoeRJYRGruFHebRAWnoTdw5S7d/UCzDBI8ropGGu9g2eb2nMxtvAw==",
      "license": "MIT",
      "dependencies": {
        "@expo/config": "~57.0.9",
        "@expo/config-plugins": "~57.0.9",
        "@expo/config-types": "^57.0.2",
        "@expo/image-utils": "^0.11.5",
        "@expo/json-file": "^11.0.1",
        "@react-native/normalize-colors": "0.86.3",
        "debug": "^4.3.1",
        "expo-modules-autolinking": "~57.0.12",
        "resolve-from": "^5.0.0",
        "semver": "^7.6.0"
      }
    },
    "node_modules/@expo/require-utils": {
      "version": "57.0.5",
      "resolved": "https://registry.npmjs.org/@expo/require-utils/-/require-utils-57.0.5.tgz",
      "integrity": "sha512-kTAXj9lDFEIPMsbAOGCGbjBbMF0oi7CqkYM79KOX0DDD9wSwXmlKL1z2h8OwsrBf7mbOo2DjlRvZu4BEjrIxGw==",
      "license": "MIT",
      "dependencies": {
        "@babel/code-frame": "^7.20.0",
        "@babel/core": "^7.25.2",
        "@babel/plugin-transform-modules-commonjs": "^7.24.8"
      },
      "peerDependencies": {
        "typescript": "^5.0.0 || ^5.0.0-0 || ^6.0.0 || ^7.0.0"
      },
      "peerDependenciesMeta": {
        "typescript": {
          "optional": true
        }
      }
    },
    "node_modules/@expo/schema-utils": {
      "version": "57.0.2",
      "resolved": "https://registry.npmjs.org/@expo/schema-utils/-/schema-utils-57.0.2.tgz",
      "integrity": "sha512-fMu/jyN0l1Wzv7XkeWR4IYCx1M8ryui3FdBNGrWwbRgJ7EhxXxK8E2jxP2W3pbgUwUY0V3hG8+GyfCZwny+Lxw==",
      "license": "MIT"
    },
    "node_modules/@expo/sdk-runtime-versions": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/@expo/sdk-runtime-versions/-/sdk-runtime-versions-1.0.0.tgz",
      "integrity": "sha512-Doz2bfiPndXYFPMRwPyGa1k5QaKDVpY806UJj570epIiMzWaYyCtobasyfC++qfIXVb5Ocy7r3tP9d62hAQ7IQ==",
      "license": "MIT"
    },
    "node_modules/@expo/spawn-async": {
      "version": "1.8.0",
      "resolved": "https://registry.npmjs.org/@expo/spawn-async/-/spawn-async-1.8.0.tgz",
      "integrity": "sha512-eb9xxd/LbuEGSdua4NumCu/McVB9EM+F/JxB9pWgnERw4HQ9XyTNH1KapG6oqLWR8TuRK2LQfzJlmNi94CVobw==",
      "license": "MIT",
      "dependencies": {
        "cross-spawn": "^7.0.6"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@expo/sudo-prompt": {
      "version": "9.3.2",
      "resolved": "https://registry.npmjs.org/@expo/sudo-prompt/-/sudo-prompt-9.3.2.tgz",
      "integrity": "sha512-HHQigo3rQWKMDzYDLkubN5WQOYXJJE2eNqIQC2axC2iO3mHdwnIR7FgZVvHWtBwAdzBgAP0ECp8KqS8TiMKvgw==",
      "license": "MIT"
    },
    "node_modules/@expo/vector-icons": {
      "version": "15.1.1",
      "resolved": "https://registry.npmjs.org/@expo/vector-icons/-/vector-icons-15.1.1.tgz",
      "integrity": "sha512-Iu2VkcoI5vygbtYngm7jb4ifxElNVXQYdDrYkT7UCEIiKLeWnQY0wf2ZhHZ+Wro6Sc5TaumpKUOqDRpLi5rkvw==",
      "license": "MIT",
      "peerDependencies": {
        "expo-font": ">=14.0.4",
        "react": "*",
        "react-native": "*"
      }
    },
    "node_modules/@expo/xcpretty": {
      "version": "4.4.5",
      "resolved": "https://registry.npmjs.org/@expo/xcpretty/-/xcpretty-4.4.5.tgz",
      "integrity": "sha512-J3eL4n4h5QTwfD0SIz8OIk6/+sOL/hFZAMacgCM07UNlxBQfJipEpIC2AQxvGkbYeStByJ0TVhQAJo+DeNgaSQ==",
      "license": "BSD-3-Clause",
      "dependencies": {
        "@babel/code-frame": "^7.20.0",
        "chalk": "^4.1.0",
        "js-yaml": "^4.1.0"
      },
      "bin": {
        "excpretty": "build/cli.js"
      }
    },
    "node_modules/@expo/xcpretty/node_modules/argparse": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/argparse/-/argparse-2.0.1.tgz",
      "integrity": "sha512-8+9WqebbFzpX9OR+Wa6O29asIogeRMzcGtAINdpMHHyAg10f05aSFVBbcEqGf/PXw1EjAZ+q2/bEBg3DvurK3Q==",
      "license": "Python-2.0"
    },
    "node_modules/@expo/xcpretty/node_modules/js-yaml": {
      "version": "4.3.2",
      "resolved": "https://registry.npmjs.org/js-yaml/-/js-yaml-4.3.2.tgz",
      "integrity": "sha512-SFNOvSJ+Dgf/9An904Yx+CgSlIPCkIpao4qo51lpee25TIRejdH3rhR4EZMGoNx3/TP3O+wzWuiTFl4sqbltzA==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/puzrin"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/nodeca"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "argparse": "^2.0.1"
      },
      "bin": {
        "js-yaml": "bin/js-yaml.js"
      }
    },
    "node_modules/@isaacs/ttlcache": {
      "version": "1.4.1",
      "resolved": "https://registry.npmjs.org/@isaacs/ttlcache/-/ttlcache-1.4.1.tgz",
      "integrity": "sha512-RQgQ4uQ+pLbqXfOmieB91ejmLwvSgv9nLx6sT6sD83s7umBypgg+OIBOBbEUiJXrfpnp9j0mRhYYdzp9uqq3lA==",
      "license": "ISC",
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@jest/schemas": {
      "version": "29.6.3",
      "resolved": "https://registry.npmjs.org/@jest/schemas/-/schemas-29.6.3.tgz",
      "integrity": "sha512-mo5j5X+jIZmJQveBKeS/clAueipV7KgiX1vMgCxam1RNYiqE1w62n0/tJJnHtjW8ZHcQco5gY85jA3mi0L+nSA==",
      "license": "MIT",
      "dependencies": {
        "@sinclair/typebox": "^0.27.8"
      },
      "engines": {
        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
      }
    },
    "node_modules/@jest/types": {
      "version": "29.6.3",
      "resolved": "https://registry.npmjs.org/@jest/types/-/types-29.6.3.tgz",
      "integrity": "sha512-u3UPsIilWKOM3F9CXtrG8LEJmNxwoCQC/XVj4IKYXvvpx7QIi/Kg1LI5uDmDpKlac62NUtX7eLjRh+jVZcLOzw==",
      "license": "MIT",
      "dependencies": {
        "@jest/schemas": "^29.6.3",
        "@types/istanbul-lib-coverage": "^2.0.0",
        "@types/istanbul-reports": "^3.0.0",
        "@types/node": "*",
        "@types/yargs": "^17.0.8",
        "chalk": "^4.0.0"
      },
      "engines": {
        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
      }
    },
    "node_modules/@jridgewell/gen-mapping": {
      "version": "0.3.13",
      "resolved": "https://registry.npmjs.org/@jridgewell/gen-mapping/-/gen-mapping-0.3.13.tgz",
      "integrity": "sha512-2kkt/7niJ6MgEPxF0bYdQ6etZaA+fQvDcLKckhy1yIQOzaoKjBBjSj63/aLVjYE3qhRt5dvM+uUyfCg6UKCBbA==",
      "license": "MIT",
      "dependencies": {
        "@jridgewell/sourcemap-codec": "^1.5.0",
        "@jridgewell/trace-mapping": "^0.3.24"
      }
    },
    "node_modules/@jridgewell/remapping": {
      "version": "2.3.5",
      "resolved": "https://registry.npmjs.org/@jridgewell/remapping/-/remapping-2.3.5.tgz",
      "integrity": "sha512-LI9u/+laYG4Ds1TDKSJW2YPrIlcVYOwi2fUC6xB43lueCjgxV4lffOCZCtYFiH6TNOX+tQKXx97T4IKHbhyHEQ==",
      "license": "MIT",
      "dependencies": {
        "@jridgewell/gen-mapping": "^0.3.5",
        "@jridgewell/trace-mapping": "^0.3.24"
      }
    },
    "node_modules/@jridgewell/resolve-uri": {
      "version": "3.1.2",
      "resolved": "https://registry.npmjs.org/@jridgewell/resolve-uri/-/resolve-uri-3.1.2.tgz",
      "integrity": "sha512-bRISgCIjP20/tbWSPWMEi54QVPRZExkuD9lJL+UIxUKtwVJA8wW1Trb1jMs1RFXo1CBTNZ/5hpC9QvmKWdopKw==",
      "license": "MIT",
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/@jridgewell/source-map": {
      "version": "0.3.11",
      "resolved": "https://registry.npmjs.org/@jridgewell/source-map/-/source-map-0.3.11.tgz",
      "integrity": "sha512-ZMp1V8ZFcPG5dIWnQLr3NSI1MiCU7UETdS/A0G8V/XWHvJv3ZsFqutJn1Y5RPmAPX6F3BiE397OqveU/9NCuIA==",
      "license": "MIT",
      "dependencies": {
        "@jridgewell/gen-mapping": "^0.3.5",
        "@jridgewell/trace-mapping": "^0.3.25"
      }
    },
    "node_modules/@jridgewell/sourcemap-codec": {
      "version": "1.5.5",
      "resolved": "https://registry.npmjs.org/@jridgewell/sourcemap-codec/-/sourcemap-codec-1.5.5.tgz",
      "integrity": "sha512-cYQ9310grqxueWbl+WuIUIaiUaDcj7WOq5fVhEljNVgRfOUhY9fy2zTvfoqWsnebh8Sl70VScFbICvJnLKB0Og==",
      "license": "MIT"
    },
    "node_modules/@jridgewell/trace-mapping": {
      "version": "0.3.31",
      "resolved": "https://registry.npmjs.org/@jridgewell/trace-mapping/-/trace-mapping-0.3.31.tgz",
      "integrity": "sha512-zzNR+SdQSDJzc8joaeP8QQoCQr8NuYx2dIIytl1QeBEZHJ9uW6hebsrYgbz8hJwUQao3TWCMtmfV8Nu1twOLAw==",
      "license": "MIT",
      "dependencies": {
        "@jridgewell/resolve-uri": "^3.1.0",
        "@jridgewell/sourcemap-codec": "^1.4.14"
      }
    },
    "node_modules/@react-native-async-storage/async-storage": {
      "version": "2.2.0",
      "resolved": "https://registry.npmjs.org/@react-native-async-storage/async-storage/-/async-storage-2.2.0.tgz",
      "integrity": "sha512-gvRvjR5JAaUZF8tv2Kcq/Gbt3JHwbKFYfmb445rhOj6NUMx3qPLixmDx5pZAyb9at1bYvJ4/eTUipU5aki45xw==",
      "license": "MIT",
      "dependencies": {
        "merge-options": "^3.0.4"
      },
      "peerDependencies": {
        "react-native": "^0.0.0-0 || >=0.65 <1.0"
      }
    },
    "node_modules/@react-native/assets-registry": {
      "version": "0.86.3",
      "resolved": "https://registry.npmjs.org/@react-native/assets-registry/-/assets-registry-0.86.3.tgz",
      "integrity": "sha512-TDhgCZA4wjJg84d5A9swiOQYPIWSKEEVdg9IwMFZDupQzW/F3QoLUrfAJOcalgqTDA9/buTB8awhE3Whwg6u9Q==",
      "license": "MIT",
      "engines": {
        "node": "^20.19.4 || ^22.13.0 || ^24.3.0 || >= 25.0.0"
      }
    },
    "node_modules/@react-native/babel-plugin-codegen": {
      "version": "0.86.3",
      "resolved": "https://registry.npmjs.org/@react-native/babel-plugin-codegen/-/babel-plugin-codegen-0.86.3.tgz",
      "integrity": "sha512-O6Xza4JBGPIU8J7YbKTyBoYL4thpy8jMW/oaLDWdAyOwYHKIjK47pAL5HUEbOe2bWz2PEKjbYRF2ApkJv1ottQ==",
      "license": "MIT",
      "dependencies": {
        "@babel/traverse": "^7.29.0",
        "@react-native/codegen": "0.86.3"
      },
      "engines": {
        "node": "^20.19.4 || ^22.13.0 || ^24.3.0 || >= 25.0.0"
      }
    },
    "node_modules/@react-native/codegen": {
      "version": "0.86.3",
      "resolved": "https://registry.npmjs.org/@react-native/codegen/-/codegen-0.86.3.tgz",
      "integrity": "sha512-Ux4jHi0fh+bdtVEcL0gaPLbY56V+SvFUDl/8sRAE1jdb4k+o7fT/4Nc29yz4X+qfjstkSqObQTMBGhdzxH9JvA==",
      "license": "MIT",
      "dependencies": {
        "@babel/core": "^7.25.2",
        "@babel/parser": "^7.29.0",
        "hermes-parser": "0.36.0",
        "invariant": "^2.2.4",
        "nullthrows": "^1.1.1",
        "tinyglobby": "^0.2.15",
        "yargs": "^17.6.2"
      },
      "engines": {
        "node": "^20.19.4 || ^22.13.0 || ^24.3.0 || >= 25.0.0"
      },
      "peerDependencies": {
        "@babel/core": "*"
      }
    },
    "node_modules/@react-native/community-cli-plugin": {
      "version": "0.86.3",
      "resolved": "https://registry.npmjs.org/@react-native/community-cli-plugin/-/community-cli-plugin-0.86.3.tgz",
      "integrity": "sha512-qSDL9LQc5mZSZPNczT95WU9YQuPzxBklgON9vLhhqfI0yWIwKInqFx88dQ/uiEXBtf0yossthaQIqA4Ml6bF6g==",
      "license": "MIT",
      "dependencies": {
        "@react-native/dev-middleware": "0.86.3",
        "debug": "^4.4.0",
        "invariant": "^2.2.4",
        "metro": "^0.84.3",
        "metro-config": "^0.84.3",
        "metro-core": "^0.84.3",
        "semver": "^7.1.3"
      },
      "engines": {
        "node": "^20.19.4 || ^22.13.0 || ^24.3.0 || >= 25.0.0"
      },
      "peerDependencies": {
        "@react-native-community/cli": "*",
        "@react-native/metro-config": "0.86.3"
      },
      "peerDependenciesMeta": {
        "@react-native-community/cli": {
          "optional": true
        },
        "@react-native/metro-config": {
          "optional": true
        }
      }
    },
    "node_modules/@react-native/debugger-frontend": {
      "version": "0.86.3",
      "resolved": "https://registry.npmjs.org/@react-native/debugger-frontend/-/debugger-frontend-0.86.3.tgz",
      "integrity": "sha512-TQmeofQ0PcuylhhlleOeuzHYZfbrgm3gayXzowqUEzgRisTm1D40/J3ggqs7XkQi5HP5ZA3n8dHmKL9vIzPcsw==",
      "license": "BSD-3-Clause",
      "engines": {
        "node": "^20.19.4 || ^22.13.0 || ^24.3.0 || >= 25.0.0"
      }
    },
    "node_modules/@react-native/debugger-shell": {
      "version": "0.86.3",
      "resolved": "https://registry.npmjs.org/@react-native/debugger-shell/-/debugger-shell-0.86.3.tgz",
      "integrity": "sha512-O4ds+J7xZfxkbih9T+cAGegBdvKSPKYJm/lDgC9CpEjFMkmzWTpVLU3Qsv9sqZuo58z+sGhIcJfPsCFFWHpqbQ==",
      "license": "MIT",
      "dependencies": {
        "cross-spawn": "^7.0.6",
        "debug": "^4.4.0",
        "fb-dotslash": "0.5.8"
      },
      "engines": {
        "node": "^20.19.4 || ^22.13.0 || ^24.3.0 || >= 25.0.0"
      }
    },
    "node_modules/@react-native/dev-middleware": {
      "version": "0.86.3",
      "resolved": "https://registry.npmjs.org/@react-native/dev-middleware/-/dev-middleware-0.86.3.tgz",
      "integrity": "sha512-LiEPTqTg/63bYUnrPyHLfjTDCNhA/+CUqI1+DsA9tYyewtSbULd5awsva6SgE10I+2iMhgKXS3ymkhU/kSCrGA==",
      "license": "MIT",
      "dependencies": {
        "@isaacs/ttlcache": "^1.4.1",
        "@react-native/debugger-frontend": "0.86.3",
        "@react-native/debugger-shell": "0.86.3",
        "chrome-launcher": "^0.15.2",
        "chromium-edge-launcher": "^0.3.0",
        "connect": "^3.6.5",
        "debug": "^4.4.0",
        "invariant": "^2.2.4",
        "nullthrows": "^1.1.1",
        "open": "^7.0.3",
        "serve-static": "^1.16.2",
        "ws": "^7.5.10"
      },
      "engines": {
        "node": "^20.19.4 || ^22.13.0 || ^24.3.0 || >= 25.0.0"
      }
    },
    "node_modules/@react-native/gradle-plugin": {
      "version": "0.86.3",
      "resolved": "https://registry.npmjs.org/@react-native/gradle-plugin/-/gradle-plugin-0.86.3.tgz",
      "integrity": "sha512-lxmx0GqLEWRIpZfpYFXlYVIs3ENQwaW6Vmp6oi29l2GoQJ1wZfFZRdMimDWlGEk8LKfHar3QH3iaPMkTcK9lEQ==",
      "license": "MIT",
      "engines": {
        "node": "^20.19.4 || ^22.13.0 || ^24.3.0 || >= 25.0.0"
      }
    },
    "node_modules/@react-native/js-polyfills": {
      "version": "0.86.3",
      "resolved": "https://registry.npmjs.org/@react-native/js-polyfills/-/js-polyfills-0.86.3.tgz",
      "integrity": "sha512-eYIJ0es967+tePBFQDnl/gidVFxLns3fnbiK6rxscQrGodvuUO6hwxpQnfNynJ8MjbbndImXihXjcnJdc7SzJg==",
      "license": "MIT",
      "engines": {
        "node": "^20.19.4 || ^22.13.0 || ^24.3.0 || >= 25.0.0"
      }
    },
    "node_modules/@react-native/normalize-colors": {
      "version": "0.86.3",
      "resolved": "https://registry.npmjs.org/@react-native/normalize-colors/-/normalize-colors-0.86.3.tgz",
      "integrity": "sha512-Cv3CDkprb67GrzuaS9BGbBJC/6G4lIw3nyKOHRKTqTTum4bn37y5+R0Z04L8mcbQN85eEohNrRwb7IOM4j6uvg==",
      "license": "MIT"
    },
    "node_modules/@react-native/virtualized-lists": {
      "version": "0.86.3",
      "resolved": "https://registry.npmjs.org/@react-native/virtualized-lists/-/virtualized-lists-0.86.3.tgz",
      "integrity": "sha512-1j44NEyNn05Ut40vHAmoSWbsIcybFkMAOBTwQt1PrESyfSS+qBoyU1LGIogNva0VIa0rQyEC5PzbA7R4/7Nhyw==",
      "license": "MIT",
      "dependencies": {
        "invariant": "^2.2.4",
        "nullthrows": "^1.1.1"
      },
      "engines": {
        "node": "^20.19.4 || ^22.13.0 || ^24.3.0 || >= 25.0.0"
      },
      "peerDependencies": {
        "@types/react": "^19.2.0",
        "react": "*",
        "react-native": "0.86.3"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/@react-navigation/core": {
      "version": "7.17.0",
      "resolved": "https://registry.npmjs.org/@react-navigation/core/-/core-7.17.0.tgz",
      "integrity": "sha512-E4Kr1PRrhKiVn1RdMdPIG1rCfrKh+HiVJ2smdLsh9D95Q2z0a9dGE9yHpRQ2pAUiiwOfgloLqegkPb8g+TcCBA==",
      "license": "MIT",
      "dependencies": {
        "@react-navigation/routers": "^7.5.3",
        "escape-string-regexp": "^4.0.0",
        "fast-deep-equal": "^3.1.3",
        "nanoid": "^3.3.11",
        "query-string": "^7.1.3",
        "react-is": "^19.1.0",
        "use-latest-callback": "^0.2.4",
        "use-sync-external-store": "^1.5.0"
      },
      "peerDependencies": {
        "react": ">= 18.2.0"
      }
    },
    "node_modules/@react-navigation/elements": {
      "version": "2.9.12",
      "resolved": "https://registry.npmjs.org/@react-navigation/elements/-/elements-2.9.12.tgz",
      "integrity": "sha512-LSaQUj5SV9OXVRcxT8mqETDoM7BOKCveCvuLjdAr9NZnPDM5HW8uDnvW/sCa8oEFy+22+ojoXtHFKsfnesgBbw==",
      "license": "MIT",
      "dependencies": {
        "color": "^4.2.3",
        "use-latest-callback": "^0.2.4",
        "use-sync-external-store": "^1.5.0"
      },
      "peerDependencies": {
        "@react-native-masked-view/masked-view": ">= 0.2.0",
        "@react-navigation/native": "^7.2.0",
        "react": ">= 18.2.0",
        "react-native": "*",
        "react-native-safe-area-context": ">= 4.0.0"
      },
      "peerDependenciesMeta": {
        "@react-native-masked-view/masked-view": {
          "optional": true
        }
      }
    },
    "node_modules/@react-navigation/native": {
      "version": "7.2.0",
      "resolved": "https://registry.npmjs.org/@react-navigation/native/-/native-7.2.0.tgz",
      "integrity": "sha512-kEuqIS1MkzzLD45Fp17CrxAchoB4W6tMfc541merUgtAeNNsg06gRrvmuLv6LAYvpLifGdXuSjpluPIu/VmbQw==",
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@react-navigation/core": "^7.17.0",
        "escape-string-regexp": "^4.0.0",
        "fast-deep-equal": "^3.1.3",
        "nanoid": "^3.3.11",
        "use-latest-callback": "^0.2.4"
      },
      "peerDependencies": {
        "react": ">= 18.2.0",
        "react-native": "*"
      }
    },
    "node_modules/@react-navigation/routers": {
      "version": "7.5.3",
      "resolved": "https://registry.npmjs.org/@react-navigation/routers/-/routers-7.5.3.tgz",
      "integrity": "sha512-1tJHg4KKRJuQ1/EvJxatrMef3NZXEPzwUIUZ3n1yJ2t7Q97siwRtbynRpQG9/69ebbtiZ8W3ScOZF/OmhvM4Rg==",
      "license": "MIT",
      "dependencies": {
        "nanoid": "^3.3.11"
      }
    },
    "node_modules/@react-navigation/stack": {
      "version": "7.8.7",
      "resolved": "https://registry.npmjs.org/@react-navigation/stack/-/stack-7.8.7.tgz",
      "integrity": "sha512-DXQrzDkMfpnju5d+3pnYEWSe0bZCcXfwAvhP9dw5v8CviVR0BhtYxVQVemkNIbwkLBAMOt6U4Py15mLS+Fkrag==",
      "license": "MIT",
      "dependencies": {
        "@react-navigation/elements": "^2.9.12",
        "color": "^4.2.3",
        "use-latest-callback": "^0.2.4"
      },
      "peerDependencies": {
        "@react-navigation/native": "^7.2.0",
        "react": ">= 18.2.0",
        "react-native": "*",
        "react-native-gesture-handler": ">= 2.0.0",
        "react-native-safe-area-context": ">= 4.0.0",
        "react-native-screens": ">= 4.0.0"
      }
    },
    "node_modules/@sinclair/typebox": {
      "version": "0.27.10",
      "resolved": "https://registry.npmjs.org/@sinclair/typebox/-/typebox-0.27.10.tgz",
      "integrity": "sha512-MTBk/3jGLNB2tVxv6uLlFh1iu64iYOQ2PbdOSK3NW8JZsmlaOh2q6sdtKowBhfw8QFLmYNzTW4/oK4uATIi6ZA==",
      "license": "MIT"
    },
    "node_modules/@types/hammerjs": {
      "version": "2.0.46",
      "resolved": "https://registry.npmjs.org/@types/hammerjs/-/hammerjs-2.0.46.tgz",
      "integrity": "sha512-ynRvcq6wvqexJ9brDMS4BnBLzmr0e14d6ZJTEShTBWKymQiHwlAyGu0ZPEFI2Fh1U53F7tN9ufClWM5KvqkKOw==",
      "license": "MIT"
    },
    "node_modules/@types/istanbul-lib-coverage": {
      "version": "2.0.6",
      "resolved": "https://registry.npmjs.org/@types/istanbul-lib-coverage/-/istanbul-lib-coverage-2.0.6.tgz",
      "integrity": "sha512-2QF/t/auWm0lsy8XtKVPG19v3sSOQlJe/YHZgfjb/KBBHOGSV+J2q/S671rcq9uTBrLAXmZpqJiaQbMT+zNU1w==",
      "license": "MIT"
    },
    "node_modules/@types/istanbul-lib-report": {
      "version": "3.0.3",
      "resolved": "https://registry.npmjs.org/@types/istanbul-lib-report/-/istanbul-lib-report-3.0.3.tgz",
      "integrity": "sha512-NQn7AHQnk/RSLOxrBbGyJM/aVQ+pjj5HCgasFxc0K/KhoATfQ/47AyUl15I2yBUpihjmas+a+VJBOqecrFH+uA==",
      "license": "MIT",
      "dependencies": {
        "@types/istanbul-lib-coverage": "*"
      }
    },
    "node_modules/@types/istanbul-reports": {
      "version": "3.0.4",
      "resolved": "https://registry.npmjs.org/@types/istanbul-reports/-/istanbul-reports-3.0.4.tgz",
      "integrity": "sha512-pk2B1NWalF9toCRu6gjBzR69syFjP4Od8WRAX+0mmf9lAjCRicLOWc+ZrxZHx/0XRjotgkF9t6iaMJ+aXcOdZQ==",
      "license": "MIT",
      "dependencies": {
        "@types/istanbul-lib-report": "*"
      }
    },
    "node_modules/@types/node": {
      "version": "25.5.0",
      "resolved": "https://registry.npmjs.org/@types/node/-/node-25.5.0.tgz",
      "integrity": "sha512-jp2P3tQMSxWugkCUKLRPVUpGaL5MVFwF8RDuSRztfwgN1wmqJeMSbKlnEtQqU8UrhTmzEmZdu2I6v2dpp7XIxw==",
      "license": "MIT",
      "dependencies": {
        "undici-types": "~7.18.0"
      }
    },
    "node_modules/@types/react": {
      "version": "19.2.18",
      "resolved": "https://registry.npmjs.org/@types/react/-/react-19.2.18.tgz",
      "integrity": "sha512-AnzbBERsrLKtk2XSfTbYRLjQPdy116Sty4q+T+Bp3IC4l6jNBvreVPAHmpq9qhXQM7CXZPjLVmGMw9sy+hxQ3w==",
      "license": "MIT",
      "dependencies": {
        "csstype": "^3.2.2"
      }
    },
    "node_modules/@types/react-test-renderer": {
      "version": "19.1.0",
      "resolved": "https://registry.npmjs.org/@types/react-test-renderer/-/react-test-renderer-19.1.0.tgz",
      "integrity": "sha512-XD0WZrHqjNrxA/MaR9O22w/RNidWR9YZmBdRGI7wcnWGrv/3dA8wKCJ8m63Sn+tLJhcjmuhOi629N66W6kgWzQ==",
      "license": "MIT",
      "dependencies": {
        "@types/react": "*"
      }
    },
    "node_modules/@types/yargs": {
      "version": "17.0.35",
      "resolved": "https://registry.npmjs.org/@types/yargs/-/yargs-17.0.35.tgz",
      "integrity": "sha512-qUHkeCyQFxMXg79wQfTtfndEC+N9ZZg76HJftDJp+qH2tV7Gj4OJi7l+PiWwJ+pWtW8GwSmqsDj/oymhrTWXjg==",
      "license": "MIT",
      "dependencies": {
        "@types/yargs-parser": "*"
      }
    },
    "node_modules/@types/yargs-parser": {
      "version": "21.0.3",
      "resolved": "https://registry.npmjs.org/@types/yargs-parser/-/yargs-parser-21.0.3.tgz",
      "integrity": "sha512-I4q9QU9MQv4oEOz4tAHJtNz1cwuLxn2F3xcc2iV5WdqLPpUnj30aUuxt1mAxYTG+oe8CZMV/+6rU4S4gRDzqtQ==",
      "license": "MIT"
    },
    "node_modules/@ungap/structured-clone": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/@ungap/structured-clone/-/structured-clone-1.3.0.tgz",
      "integrity": "sha512-WmoN8qaIAo7WTYWbAZuG8PYEhn5fkz7dZrqTBZ7dtt//lL2Gwms1IcnQ5yHqjDfX8Ft5j4YzDM23f87zBfDe9g==",
      "license": "ISC"
    },
    "node_modules/@xmldom/xmldom": {
      "version": "0.8.15",
      "resolved": "https://registry.npmjs.org/@xmldom/xmldom/-/xmldom-0.8.15.tgz",
      "integrity": "sha512-/5NV/vDALVFDXgLmfsy9TRCBlKwO2LNBFzpzvb9iIj+jR+eSc6DLYYvVOdivT/jm7MtU6TebYuRmzEOI7w40UA==",
      "license": "MIT",
      "engines": {
        "node": ">=10.0.0"
      }
    },
    "node_modules/abort-controller": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/abort-controller/-/abort-controller-3.0.0.tgz",
      "integrity": "sha512-h8lQ8tacZYnR3vNQTgibj+tODHI5/+l06Au2Pcriv/Gmet0eaj4TwWH41sO9wnHDiQsEj19q0drzdWdeAHtweg==",
      "license": "MIT",
      "dependencies": {
        "event-target-shim": "^5.0.0"
      },
      "engines": {
        "node": ">=6.5"
      }
    },
    "node_modules/accepts": {
      "version": "1.3.8",
      "resolved": "https://registry.npmjs.org/accepts/-/accepts-1.3.8.tgz",
      "integrity": "sha512-PYAthTa2m2VKxuvSD3DPC/Gy+U+sOA1LAuT8mkmRuvw+NACSaeXEQ+NHcVF7rONl6qcaxV3Uuemwawk+7+SJLw==",
      "license": "MIT",
      "dependencies": {
        "mime-types": "~2.1.34",
        "negotiator": "0.6.3"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/acorn": {
      "version": "8.16.0",
      "resolved": "https://registry.npmjs.org/acorn/-/acorn-8.16.0.tgz",
      "integrity": "sha512-UVJyE9MttOsBQIDKw1skb9nAwQuR5wuGD3+82K6JgJlm/Y+KI92oNsMNGZCYdDsVtRHSak0pcV5Dno5+4jh9sw==",
      "license": "MIT",
      "bin": {
        "acorn": "bin/acorn"
      },
      "engines": {
        "node": ">=0.4.0"
      }
    },
    "node_modules/agent-base": {
      "version": "7.1.4",
      "resolved": "https://registry.npmjs.org/agent-base/-/agent-base-7.1.4.tgz",
      "integrity": "sha512-MnA+YT8fwfJPgBx3m60MNqakm30XOkyIoH1y6huTQvC0PwZG7ki8NacLBcrPbNoo8vEZy7Jpuk7+jMO+CUovTQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 14"
      }
    },
    "node_modules/agent-cli-detector": {
      "version": "0.1.7",
      "resolved": "https://registry.npmjs.org/agent-cli-detector/-/agent-cli-detector-0.1.7.tgz",
      "integrity": "sha512-d8OWDVdZMgjhLUT9ZPgSv/BdFFF9pVuscC0JdUSz3bjwE15gcp6u/o0/JooM2yyAWC49KThFhXlgTXRa9B7yng==",
      "license": "MIT",
      "bin": {
        "agent-cli-detector": "dist/cli.js"
      },
      "engines": {
        "node": ">=18.18"
      }
    },
    "node_modules/anser": {
      "version": "1.4.10",
      "resolved": "https://registry.npmjs.org/anser/-/anser-1.4.10.tgz",
      "integrity": "sha512-hCv9AqTQ8ycjpSd3upOJd7vFwW1JaoYQ7tpham03GJ1ca8/65rqn0RpaWpItOAd6ylW9wAw6luXYPJIyPFVOww==",
      "license": "MIT"
    },
    "node_modules/ansi-escapes": {
      "version": "4.3.2",
      "resolved": "https://registry.npmjs.org/ansi-escapes/-/ansi-escapes-4.3.2.tgz",
      "integrity": "sha512-gKXj5ALrKWQLsYG9jlTRmR/xKluxHV+Z9QEwNIgCfM1/uwPMCuzVVnh5mwTd+OuBZcwSIMbqssNWRm1lE51QaQ==",
      "license": "MIT",
      "dependencies": {
        "type-fest": "^0.21.3"
      },
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/ansi-escapes/node_modules/type-fest": {
      "version": "0.21.3",
      "resolved": "https://registry.npmjs.org/type-fest/-/type-fest-0.21.3.tgz",
      "integrity": "sha512-t0rzBq87m3fVcduHDUFhKmyyX+9eo6WQjZvf51Ea/M0Q7+T374Jp1aUiyUl0GKxp8M/OETVHSDvmkyPgvX+X2w==",
      "license": "(MIT OR CC0-1.0)",
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/ansi-regex": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/ansi-regex/-/ansi-regex-5.0.1.tgz",
      "integrity": "sha512-quJQXlTSUGL2LH9SUXo8VwsY4soanhgo6LNSm84E1LBcE8s3O0wpdiRzyR9z/ZZJMlMWv37qOOb9pdJlMUEKFQ==",
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/ansi-styles": {
      "version": "4.3.0",
      "resolved": "https://registry.npmjs.org/ansi-styles/-/ansi-styles-4.3.0.tgz",
      "integrity": "sha512-zbB9rCJAT1rbjiVDb2hqKFHNYLxgtk8NURxZ3IZwD3F6NtxbXZQCnnSi1Lkx+IDohdPlFp222wVALIheZJQSEg==",
      "license": "MIT",
      "dependencies": {
        "color-convert": "^2.0.1"
      },
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/chalk/ansi-styles?sponsor=1"
      }
    },
    "node_modules/arg": {
      "version": "5.0.2",
      "resolved": "https://registry.npmjs.org/arg/-/arg-5.0.2.tgz",
      "integrity": "sha512-PYjyFOLKQ9y57JvQ6QLo8dAgNqswh8M1RMJYdQduT6xbWSgK36P/Z/v+p888pM69jMMfS8Xd8F6I1kQ/I9HUGg==",
      "license": "MIT"
    },
    "node_modules/asap": {
      "version": "2.0.6",
      "resolved": "https://registry.npmjs.org/asap/-/asap-2.0.6.tgz",
      "integrity": "sha512-BSHWgDSAiKs50o2Re8ppvp3seVHXSRM44cdSsT9FfNEUUZLOGWVCsiWaRPWM1Znn+mqZ1OfVZ3z3DWEzSp7hRA==",
      "license": "MIT"
    },
    "node_modules/babel-plugin-polyfill-corejs2": {
      "version": "0.4.17",
      "resolved": "https://registry.npmjs.org/babel-plugin-polyfill-corejs2/-/babel-plugin-polyfill-corejs2-0.4.17.tgz",
      "integrity": "sha512-aTyf30K/rqAsNwN76zYrdtx8obu0E4KoUME29B1xj+B3WxgvWkp943vYQ+z8Mv3lw9xHXMHpvSPOBxzAkIa94w==",
      "license": "MIT",
      "dependencies": {
        "@babel/compat-data": "^7.28.6",
        "@babel/helper-define-polyfill-provider": "^0.6.8",
        "semver": "^6.3.1"
      },
      "peerDependencies": {
        "@babel/core": "^7.4.0 || ^8.0.0-0 <8.0.0"
      }
    },
    "node_modules/babel-plugin-polyfill-corejs2/node_modules/semver": {
      "version": "6.3.1",
      "resolved": "https://registry.npmjs.org/semver/-/semver-6.3.1.tgz",
      "integrity": "sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==",
      "license": "ISC",
      "bin": {
        "semver": "bin/semver.js"
      }
    },
    "node_modules/babel-plugin-polyfill-corejs3": {
      "version": "0.13.0",
      "resolved": "https://registry.npmjs.org/babel-plugin-polyfill-corejs3/-/babel-plugin-polyfill-corejs3-0.13.0.tgz",
      "integrity": "sha512-U+GNwMdSFgzVmfhNm8GJUX88AadB3uo9KpJqS3FaqNIPKgySuvMb+bHPsOmmuWyIcuqZj/pzt1RUIUZns4y2+A==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-define-polyfill-provider": "^0.6.5",
        "core-js-compat": "^3.43.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.4.0 || ^8.0.0-0 <8.0.0"
      }
    },
    "node_modules/babel-plugin-polyfill-regenerator": {
      "version": "0.6.8",
      "resolved": "https://registry.npmjs.org/babel-plugin-polyfill-regenerator/-/babel-plugin-polyfill-regenerator-0.6.8.tgz",
      "integrity": "sha512-M762rNHfSF1EV3SLtnCJXFoQbbIIz0OyRwnCmV0KPC7qosSfCO0QLTSuJX3ayAebubhE6oYBAYPrBA5ljowaZg==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-define-polyfill-provider": "^0.6.8"
      },
      "peerDependencies": {
        "@babel/core": "^7.4.0 || ^8.0.0-0 <8.0.0"
      }
    },
    "node_modules/babel-plugin-react-compiler": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/babel-plugin-react-compiler/-/babel-plugin-react-compiler-1.0.0.tgz",
      "integrity": "sha512-Ixm8tFfoKKIPYdCCKYTsqv+Fd4IJ0DQqMyEimo+pxUOMUR9cVPlwTrFt9Avu+3cb6Zp3mAzl+t1MrG2fxxKsxw==",
      "license": "MIT",
      "dependencies": {
        "@babel/types": "^7.26.0"
      }
    },
    "node_modules/babel-plugin-react-native-web": {
      "version": "0.21.2",
      "resolved": "https://registry.npmjs.org/babel-plugin-react-native-web/-/babel-plugin-react-native-web-0.21.2.tgz",
      "integrity": "sha512-SPD0J6qjJn8231i0HZhlAGH6NORe+QvRSQM2mwQEzJ2Fb3E4ruWTiiicPlHjmeWShDXLcvoorOCXjeR7k/lyWA==",
      "license": "MIT"
    },
    "node_modules/babel-plugin-syntax-hermes-parser": {
      "version": "0.36.0",
      "resolved": "https://registry.npmjs.org/babel-plugin-syntax-hermes-parser/-/babel-plugin-syntax-hermes-parser-0.36.0.tgz",
      "integrity": "sha512-LhD0xdoedDw7ansQgXbB2DADLZIK/LRXuWNBPuVzMc5S2WK5GyT89tCM+cQzxFGO0mGyLK6D5TrVOJJzAoDy8Q==",
      "license": "MIT",
      "dependencies": {
        "hermes-parser": "0.36.0"
      }
    },
    "node_modules/babel-plugin-transform-flow-enums": {
      "version": "0.0.2",
      "resolved": "https://registry.npmjs.org/babel-plugin-transform-flow-enums/-/babel-plugin-transform-flow-enums-0.0.2.tgz",
      "integrity": "sha512-g4aaCrDDOsWjbm0PUUeVnkcVd6AKJsVc/MbnPhEotEpkeJQP6b8nzewohQi7+QS8UyPehOhGWn0nOwjvWpmMvQ==",
      "license": "MIT",
      "dependencies": {
        "@babel/plugin-syntax-flow": "^7.12.1"
      }
    },
    "node_modules/babel-preset-expo": {
      "version": "57.0.11",
      "resolved": "https://registry.npmjs.org/babel-preset-expo/-/babel-preset-expo-57.0.11.tgz",
      "integrity": "sha512-R0NouDI3nzQUsjBh5TUJSDXLmuVzE2bp2YE0ywJkKxzrdWVjShpAlZMBuDeOQy6iKGB6ZCCvMqbQvpqgNMJ7iw==",
      "license": "MIT",
      "dependencies": {
        "@babel/generator": "^7.20.5",
        "@babel/helper-module-imports": "^7.25.9",
        "@babel/plugin-proposal-decorators": "^7.12.9",
        "@babel/plugin-proposal-export-default-from": "^7.24.7",
        "@babel/plugin-syntax-dynamic-import": "^7.8.3",
        "@babel/plugin-syntax-export-default-from": "^7.24.7",
        "@babel/plugin-syntax-nullish-coalescing-operator": "^7.8.3",
        "@babel/plugin-syntax-optional-chaining": "^7.8.3",
        "@babel/plugin-transform-async-generator-functions": "^7.25.4",
        "@babel/plugin-transform-async-to-generator": "^7.24.7",
        "@babel/plugin-transform-block-scoping": "^7.25.0",
        "@babel/plugin-transform-class-properties": "^7.25.4",
        "@babel/plugin-transform-class-static-block": "^7.27.1",
        "@babel/plugin-transform-classes": "^7.25.4",
        "@babel/plugin-transform-destructuring": "^7.24.8",
        "@babel/plugin-transform-export-namespace-from": "^7.25.9",
        "@babel/plugin-transform-flow-strip-types": "^7.25.2",
        "@babel/plugin-transform-for-of": "^7.24.7",
        "@babel/plugin-transform-logical-assignment-operators": "^7.24.7",
        "@babel/plugin-transform-modules-commonjs": "^7.24.8",
        "@babel/plugin-transform-named-capturing-groups-regex": "^7.24.7",
        "@babel/plugin-transform-nullish-coalescing-operator": "^7.24.7",
        "@babel/plugin-transform-object-rest-spread": "^7.24.7",
        "@babel/plugin-transform-optional-catch-binding": "^7.24.7",
        "@babel/plugin-transform-optional-chaining": "^7.24.8",
        "@babel/plugin-transform-parameters": "^7.24.7",
        "@babel/plugin-transform-private-methods": "^7.24.7",
        "@babel/plugin-transform-private-property-in-object": "^7.24.7",
        "@babel/plugin-transform-react-display-name": "^7.24.7",
        "@babel/plugin-transform-react-jsx": "^7.28.6",
        "@babel/plugin-transform-react-jsx-development": "^7.27.1",
        "@babel/plugin-transform-react-pure-annotations": "^7.27.1",
        "@babel/plugin-transform-runtime": "^7.24.7",
        "@babel/plugin-transform-typescript": "^7.25.2",
        "@babel/plugin-transform-unicode-regex": "^7.24.7",
        "@babel/preset-typescript": "^7.23.0",
        "@react-native/babel-plugin-codegen": "0.86.3",
        "babel-plugin-react-compiler": "^1.0.0",
        "babel-plugin-react-native-web": "~0.21.0",
        "babel-plugin-syntax-hermes-parser": "^0.36.0",
        "babel-plugin-transform-flow-enums": "^0.0.2",
        "debug": "^4.3.4"
      },
      "peerDependencies": {
        "@babel/runtime": "^7.20.0",
        "expo": "*",
        "expo-widgets": "^57.0.18",
        "react-refresh": ">=0.14.0 <1.0.0"
      },
      "peerDependenciesMeta": {
        "@babel/runtime": {
          "optional": true
        },
        "expo": {
          "optional": true
        },
        "expo-widgets": {
          "optional": true
        }
      }
    },
    "node_modules/babel-preset-expo/node_modules/babel-plugin-syntax-hermes-parser": {
      "version": "0.36.1",
      "resolved": "https://registry.npmjs.org/babel-plugin-syntax-hermes-parser/-/babel-plugin-syntax-hermes-parser-0.36.1.tgz",
      "integrity": "sha512-ycduwJbvdvIMmVvlAZqGggS+pm5Eu4Bk9pcV9Sm2Z4PJNRVsKkv0g7vHj+LeuC1gHTeF67sJXFOq61IlqCa2hA==",
      "license": "MIT",
      "dependencies": {
        "hermes-parser": "0.36.1"
      }
    },
    "node_modules/babel-preset-expo/node_modules/hermes-estree": {
      "version": "0.36.1",
      "resolved": "https://registry.npmjs.org/hermes-estree/-/hermes-estree-0.36.1.tgz",
      "integrity": "sha512-guv1nQ6IJ7S83NRFPWc3SA7IBZrdNC9kapwOq6uXvF4wP+sDCgjzQbKPCoyYmoyZRzztF/n/c36l/rccCZSiCw==",
      "license": "MIT"
    },
    "node_modules/babel-preset-expo/node_modules/hermes-parser": {
      "version": "0.36.1",
      "resolved": "https://registry.npmjs.org/hermes-parser/-/hermes-parser-0.36.1.tgz",
      "integrity": "sha512-GApNk4zLHi2UWoWZZkx7LNCOSzLSc5lB55pZ/PhK7ycFeg7u5LcF88p/WbpIi1XUDtE0MpHE3uRR3u3KB7TjSQ==",
      "license": "MIT",
      "dependencies": {
        "hermes-estree": "0.36.1"
      }
    },
    "node_modules/base64-js": {
      "version": "1.5.1",
      "resolved": "https://registry.npmjs.org/base64-js/-/base64-js-1.5.1.tgz",
      "integrity": "sha512-AKpaYlHn8t4SVbOHCy+b5+KKgvR4vrsD8vbvrbiQJps7fKDTkjkDry6ji0rUJjC0kzbNePLwzxq8iypo41qeWA==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ],
      "license": "MIT"
    },
    "node_modules/baseline-browser-mapping": {
      "version": "2.11.15",
      "resolved": "https://registry.npmjs.org/baseline-browser-mapping/-/baseline-browser-mapping-2.11.15.tgz",
      "integrity": "sha512-FwMjJJ7HnyZpWe+oWxegG0fezZyBZUagI5LZEoO3GCbtbKNwRfMH9Ue5d5v01PNePBy1QSfPSDTTeVL0Hb9EzA==",
      "license": "Apache-2.0",
      "bin": {
        "baseline-browser-mapping": "dist/cli.cjs"
      },
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/big-integer": {
      "version": "1.6.52",
      "resolved": "https://registry.npmjs.org/big-integer/-/big-integer-1.6.52.tgz",
      "integrity": "sha512-QxD8cf2eVqJOOz63z6JIN9BzvVs/dlySa5HGSBH5xtR8dPteIRQnBxxKqkNTiT6jbDTF6jAfrd4oMcND9RGbQg==",
      "license": "Unlicense",
      "engines": {
        "node": ">=0.6"
      }
    },
    "node_modules/boolbase": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/boolbase/-/boolbase-1.0.0.tgz",
      "integrity": "sha512-JZOSA7Mo9sNGB8+UjSgzdLtokWAky1zbztM3WRLCbZ70/3cTANmQmOdR7y2g+J0e2WXywy1yS468tY+IruqEww==",
      "license": "ISC"
    },
    "node_modules/bplist-creator": {
      "version": "0.1.0",
      "resolved": "https://registry.npmjs.org/bplist-creator/-/bplist-creator-0.1.0.tgz",
      "integrity": "sha512-sXaHZicyEEmY86WyueLTQesbeoH/mquvarJaQNbjuOQO+7gbFcDEWqKmcWA4cOTLzFlfgvkiVxolk1k5bBIpmg==",
      "license": "MIT",
      "dependencies": {
        "stream-buffers": "2.2.x"
      }
    },
    "node_modules/bplist-parser": {
      "version": "0.3.1",
      "resolved": "https://registry.npmjs.org/bplist-parser/-/bplist-parser-0.3.1.tgz",
      "integrity": "sha512-PyJxiNtA5T2PlLIeBot4lbp7rj4OadzjnMZD/G5zuBNt8ei/yCU7+wW0h2bag9vr8c+/WuRWmSxbqAl9hL1rBA==",
      "license": "MIT",
      "dependencies": {
        "big-integer": "1.6.x"
      },
      "engines": {
        "node": ">= 5.10.0"
      }
    },
    "node_modules/brace-expansion": {
      "version": "5.0.9",
      "resolved": "https://registry.npmjs.org/brace-expansion/-/brace-expansion-5.0.9.tgz",
      "integrity": "sha512-ScQ4IuvIEF1TMlP7Zt+vjJ//9zlPb2SDcxWxM3bk8s6t6GGdJ7KO1dCcTidOPJKePW30LE/2cT7wCyPho9/Wxg==",
      "license": "MIT",
      "dependencies": {
        "balanced-match": "^4.0.2"
      },
      "engines": {
        "node": "20 || >=22"
      }
    },
    "node_modules/brace-expansion/node_modules/balanced-match": {
      "version": "4.0.4",
      "resolved": "https://registry.npmjs.org/balanced-match/-/balanced-match-4.0.4.tgz",
      "integrity": "sha512-BLrgEcRTwX2o6gGxGOCNyMvGSp35YofuYzw9h1IMTRmKqttAZZVU67bdb9Pr2vUHA8+j3i2tJfjO6C6+4myGTA==",
      "license": "MIT",
      "engines": {
        "node": "18 || 20 || >=22"
      }
    },
    "node_modules/braces": {
      "version": "3.0.3",
      "resolved": "https://registry.npmjs.org/braces/-/braces-3.0.3.tgz",
      "integrity": "sha512-yQbXgO/OSZVD2IsiLlro+7Hf6Q18EJrKSEsdoMzKePKXct3gvD8oLcOQdIzGupr5Fj+EDe8gO/lxc1BzfMpxvA==",
      "license": "MIT",
      "dependencies": {
        "fill-range": "^7.1.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/browserslist": {
      "version": "4.28.8",
      "resolved": "https://registry.npmjs.org/browserslist/-/browserslist-4.28.8.tgz",
      "integrity": "sha512-V2NpofLblG64mfOtSgDhOJESZEGogzDMBv/q+W6oc4LXWP/q75eOXoOaaOu1EOadB9U4Bwx/e0yzbvwKH8zalA==",
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/browserslist"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/browserslist"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "baseline-browser-mapping": "^2.11.12",
        "caniuse-lite": "^1.0.30001809",
        "electron-to-chromium": "^1.5.402",
        "node-releases": "^2.0.53",
        "update-browserslist-db": "^1.3.0"
      },
      "bin": {
        "browserslist": "cli.js"
      },
      "engines": {
        "node": "^6 || ^7 || ^8 || ^9 || ^10 || ^11 || ^12 || >=13.7"
      }
    },
    "node_modules/bser": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/bser/-/bser-2.1.1.tgz",
      "integrity": "sha512-gQxTNE/GAfIIrmHLUE3oJyp5FO6HRBfhjnw4/wMmA63ZGDJnWBmgY/lyQBpnDUkGmAhbSe39tx2d/iTOAfglwQ==",
      "license": "Apache-2.0",
      "dependencies": {
        "node-int64": "^0.4.0"
      }
    },
    "node_modules/buffer-from": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/buffer-from/-/buffer-from-1.1.2.tgz",
      "integrity": "sha512-E+XQCRwSbaaiChtv6k6Dwgc+bx+Bs6vuKJHHl5kox/BaKbhiXzqQOwK4cO22yElGp2OCmjwVhT3HmxgyPGnJfQ==",
      "license": "MIT"
    },
    "node_modules/bytes": {
      "version": "3.1.2",
      "resolved": "https://registry.npmjs.org/bytes/-/bytes-3.1.2.tgz",
      "integrity": "sha512-/Nf7TyzTx6S3yRJObOAV7956r8cr2+Oj8AC5dt8wSP3BQAoeX58NoHyCU8P8zGkNXStjTSi6fzO6F0pBdcYbEg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/camelcase": {
      "version": "6.3.0",
      "resolved": "https://registry.npmjs.org/camelcase/-/camelcase-6.3.0.tgz",
      "integrity": "sha512-Gmy6FhYlCY7uOElZUSbxo2UCDH8owEk996gkbrpsgGtrJLM3J7jGxl9Ic7Qwwj4ivOE5AWZWRMecDdF7hqGjFA==",
      "license": "MIT",
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/caniuse-lite": {
      "version": "1.0.30001809",
      "resolved": "https://registry.npmjs.org/caniuse-lite/-/caniuse-lite-1.0.30001809.tgz",
      "integrity": "sha512-xxWVywk6a6Arlk+hymeycyn/VgqEfLDxupvhH/xiY5SJ/18kmi9o6MiO320DCUzypORHLtvh0I4i04tUhCNHNQ==",
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/browserslist"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/caniuse-lite"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "CC-BY-4.0"
    },
    "node_modules/chalk": {
      "version": "4.1.2",
      "resolved": "https://registry.npmjs.org/chalk/-/chalk-4.1.2.tgz",
      "integrity": "sha512-oKnbhFyRIXpUuez8iBMmyEa4nbj4IOQyuhc/wy9kY7/WVPcwIO9VA668Pu8RkO7+0G76SLROeyw9CpQ061i4mA==",
      "license": "MIT",
      "dependencies": {
        "ansi-styles": "^4.1.0",
        "supports-color": "^7.1.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/chalk/chalk?sponsor=1"
      }
    },
    "node_modules/chrome-launcher": {
      "version": "0.15.2",
      "resolved": "https://registry.npmjs.org/chrome-launcher/-/chrome-launcher-0.15.2.tgz",
      "integrity": "sha512-zdLEwNo3aUVzIhKhTtXfxhdvZhUghrnmkvcAq2NoDd+LeOHKf03H5jwZ8T/STsAlzyALkBVK552iaG1fGf1xVQ==",
      "license": "Apache-2.0",
      "dependencies": {
        "@types/node": "*",
        "escape-string-regexp": "^4.0.0",
        "is-wsl": "^2.2.0",
        "lighthouse-logger": "^1.0.0"
      },
      "bin": {
        "print-chrome-path": "bin/print-chrome-path.js"
      },
      "engines": {
        "node": ">=12.13.0"
      }
    },
    "node_modules/chromium-edge-launcher": {
      "version": "0.3.0",
      "resolved": "https://registry.npmjs.org/chromium-edge-launcher/-/chromium-edge-launcher-0.3.0.tgz",
      "integrity": "sha512-p03azHlGjtyRvFEee3cyvtsRYdniSkwjkzmM/KmVnqT5d7QkkwpJBhis/zCLMYdQMVJ5tt140TBNqqrZPaWeFA==",
      "license": "Apache-2.0",
      "dependencies": {
        "@types/node": "*",
        "escape-string-regexp": "^4.0.0",
        "is-wsl": "^2.2.0",
        "lighthouse-logger": "^1.0.0",
        "mkdirp": "^1.0.4"
      }
    },
    "node_modules/ci-info": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/ci-info/-/ci-info-2.0.0.tgz",
      "integrity": "sha512-5tK7EtrZ0N+OLFMthtqOj4fI2Jeb88C4CAZPu25LDVUgXJ0A3Js4PMGqrn0JU1W0Mh1/Z8wZzYPxqUrXeBboCQ==",
      "license": "MIT"
    },
    "node_modules/cli-cursor": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/cli-cursor/-/cli-cursor-2.1.0.tgz",
      "integrity": "sha512-8lgKz8LmCRYZZQDpRyT2m5rKJ08TnU4tR9FFFW2rxpxR1FzWi4PQ/NfyODchAatHaUgnSPVcx/R5w6NuTBzFiw==",
      "license": "MIT",
      "dependencies": {
        "restore-cursor": "^2.0.0"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/cli-spinners": {
      "version": "2.9.2",
      "resolved": "https://registry.npmjs.org/cli-spinners/-/cli-spinners-2.9.2.tgz",
      "integrity": "sha512-ywqV+5MmyL4E7ybXgKys4DugZbX0FC6LnwrhjuykIjnK9k8OQacQ7axGKnjDXWNhns0xot3bZI5h55H8yo9cJg==",
      "license": "MIT",
      "engines": {
        "node": ">=6"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/cliui": {
      "version": "8.0.1",
      "resolved": "https://registry.npmjs.org/cliui/-/cliui-8.0.1.tgz",
      "integrity": "sha512-BSeNnyus75C4//NQ9gQt1/csTXyo/8Sb+afLAkzAptFuMsod9HFokGNudZpi/oQV73hnVK+sR+5PVRMd+Dr7YQ==",
      "license": "ISC",
      "dependencies": {
        "string-width": "^4.2.0",
        "strip-ansi": "^6.0.1",
        "wrap-ansi": "^7.0.0"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/clone": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/clone/-/clone-1.0.4.tgz",
      "integrity": "sha512-JQHZ2QMW6l3aH/j6xCqQThY/9OH4D/9ls34cgkUBiEeocRTU04tHfKPBsUK1PqZCUQM7GiA0IIXJSuXHI64Kbg==",
      "license": "MIT",
      "engines": {
        "node": ">=0.8"
      }
    },
    "node_modules/color": {
      "version": "4.2.3",
      "resolved": "https://registry.npmjs.org/color/-/color-4.2.3.tgz",
      "integrity": "sha512-1rXeuUUiGGrykh+CeBdu5Ie7OJwinCgQY0bc7GCRxy5xVHy+moaqkpL/jqQq0MtQOeYcrqEz4abc5f0KtU7W4A==",
      "license": "MIT",
      "dependencies": {
        "color-convert": "^2.0.1",
        "color-string": "^1.9.0"
      },
      "engines": {
        "node": ">=12.5.0"
      }
    },
    "node_modules/color-convert": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/color-convert/-/color-convert-2.0.1.tgz",
      "integrity": "sha512-RRECPsj7iu/xb5oKYcsFHSppFNnsj/52OVTRKb4zP5onXwVF3zVmmToNcOfGC+CRDpfK/U584fMg38ZHCaElKQ==",
      "license": "MIT",
      "dependencies": {
        "color-name": "~1.1.4"
      },
      "engines": {
        "node": ">=7.0.0"
      }
    },
    "node_modules/color-name": {
      "version": "1.1.4",
      "resolved": "https://registry.npmjs.org/color-name/-/color-name-1.1.4.tgz",
      "integrity": "sha512-dOy+3AuW3a2wNbZHIuMZpTcgjGuLU/uBL/ubcZF9OXbDo8ff4O8yVp5Bf0efS8uEoYo5q4Fx7dY9OgQGXgAsQA==",
      "license": "MIT"
    },
    "node_modules/color-string": {
      "version": "1.9.1",
      "resolved": "https://registry.npmjs.org/color-string/-/color-string-1.9.1.tgz",
      "integrity": "sha512-shrVawQFojnZv6xM40anx4CkoDP+fZsw/ZerEMsW/pyzsRbElpsL/DBVW7q3ExxwusdNXI3lXpuhEZkzs8p5Eg==",
      "license": "MIT",
      "dependencies": {
        "color-name": "^1.0.0",
        "simple-swizzle": "^0.2.2"
      }
    },
    "node_modules/commander": {
      "version": "7.2.0",
      "resolved": "https://registry.npmjs.org/commander/-/commander-7.2.0.tgz",
      "integrity": "sha512-QrWXB+ZQSVPmIWIhtEO9H+gwHaMGYiF5ChvoJ+K9ZGHG/sVsa6yiesAD1GC/x46sET00Xlwo1u49RVVVzvcSkw==",
      "license": "MIT",
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/compressible": {
      "version": "2.0.18",
      "resolved": "https://registry.npmjs.org/compressible/-/compressible-2.0.18.tgz",
      "integrity": "sha512-AF3r7P5dWxL8MxyITRMlORQNaOA2IkAFaTr4k7BUumjPtRpGDTZpl0Pb1XCO6JeDCBdp126Cgs9sMxqSjgYyRg==",
      "license": "MIT",
      "dependencies": {
        "mime-db": ">= 1.43.0 < 2"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/compression": {
      "version": "1.8.1",
      "resolved": "https://registry.npmjs.org/compression/-/compression-1.8.1.tgz",
      "integrity": "sha512-9mAqGPHLakhCLeNyxPkK4xVo746zQ/czLH1Ky+vkitMnWfWZps8r0qXuwhwizagCRttsL4lfG4pIOvaWLpAP0w==",
      "license": "MIT",
      "dependencies": {
        "bytes": "3.1.2",
        "compressible": "~2.0.18",
        "debug": "2.6.9",
        "negotiator": "~0.6.4",
        "on-headers": "~1.1.0",
        "safe-buffer": "5.2.1",
        "vary": "~1.1.2"
      },
      "engines": {
        "node": ">= 0.8.0"
      }
    },
    "node_modules/compression/node_modules/debug": {
      "version": "2.6.9",
      "resolved": "https://registry.npmjs.org/debug/-/debug-2.6.9.tgz",
      "integrity": "sha512-bC7ElrdJaJnPbAP+1EotYvqZsb3ecl5wi6Bfi6BJTUcNowp6cvspg0jXznRTKDjm/E7AdgFBVeAPVMNcKGsHMA==",
      "license": "MIT",
      "dependencies": {
        "ms": "2.0.0"
      }
    },
    "node_modules/compression/node_modules/ms": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.0.0.tgz",
      "integrity": "sha512-Tpp60P6IUJDTuOq/5Z8cdskzJujfwqfOTkrwIwj7IRISpnkJnT6SyJ4PCPnGMoFjC9ddhal5KVIYtAt97ix05A==",
      "license": "MIT"
    },
    "node_modules/compression/node_modules/negotiator": {
      "version": "0.6.4",
      "resolved": "https://registry.npmjs.org/negotiator/-/negotiator-0.6.4.tgz",
      "integrity": "sha512-myRT3DiWPHqho5PrJaIRyaMv2kgYf0mUVgBNOYMuCH5Ki1yEiQaf/ZJuQ62nvpc44wL5WDbTX7yGJi1Neevw8w==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/connect": {
      "version": "3.7.0",
      "resolved": "https://registry.npmjs.org/connect/-/connect-3.7.0.tgz",
      "integrity": "sha512-ZqRXc+tZukToSNmh5C2iWMSoV3X1YUcPbqEM4DkEG5tNQXrQUZCNVGGv3IuicnkMtPfGf3Xtp8WCXs295iQ1pQ==",
      "license": "MIT",
      "dependencies": {
        "debug": "2.6.9",
        "finalhandler": "1.1.2",
        "parseurl": "~1.3.3",
        "utils-merge": "1.0.1"
      },
      "engines": {
        "node": ">= 0.10.0"
      }
    },
    "node_modules/connect/node_modules/debug": {
      "version": "2.6.9",
      "resolved": "https://registry.npmjs.org/debug/-/debug-2.6.9.tgz",
      "integrity": "sha512-bC7ElrdJaJnPbAP+1EotYvqZsb3ecl5wi6Bfi6BJTUcNowp6cvspg0jXznRTKDjm/E7AdgFBVeAPVMNcKGsHMA==",
      "license": "MIT",
      "dependencies": {
        "ms": "2.0.0"
      }
    },
    "node_modules/connect/node_modules/ms": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.0.0.tgz",
      "integrity": "sha512-Tpp60P6IUJDTuOq/5Z8cdskzJujfwqfOTkrwIwj7IRISpnkJnT6SyJ4PCPnGMoFjC9ddhal5KVIYtAt97ix05A==",
      "license": "MIT"
    },
    "node_modules/content-type": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/content-type/-/content-type-2.1.0.tgz",
      "integrity": "sha512-mj7UPXE0jaqaOsukNZRUEfEi2AcL7C/vwmwcHV0O97eO1E1pxBZuyjlZrx5seTaNBg1U6+o35wpa35Qfcc+7ag==",
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/convert-source-map": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/convert-source-map/-/convert-source-map-2.0.0.tgz",
      "integrity": "sha512-Kvp459HrV2FEJ1CAsi1Ku+MY3kasH19TFykTz2xWmMeq6bk2NU3XXvfJ+Q61m0xktWwt+1HSYf3JZsTms3aRJg==",
      "license": "MIT"
    },
    "node_modules/core-js-compat": {
      "version": "3.50.0",
      "resolved": "https://registry.npmjs.org/core-js-compat/-/core-js-compat-3.50.0.tgz",
      "integrity": "sha512-XGpFGbMLHwSt74YLTKho7Ib242qi6O8MSX+sRokV4oz7iKXvQWGYZthjIhjRGMxjzVkAubBO512dKGYcefmX3Q==",
      "license": "MIT",
      "dependencies": {
        "browserslist": "^4.28.7"
      },
      "engines": {
        "node": ">=6.4.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/core-js"
      }
    },
    "node_modules/cross-fetch": {
      "version": "3.2.0",
      "resolved": "https://registry.npmjs.org/cross-fetch/-/cross-fetch-3.2.0.tgz",
      "integrity": "sha512-Q+xVJLoGOeIMXZmbUK4HYk+69cQH6LudR0Vu/pRm2YlU/hDV9CiS0gKUMaWY5f2NeUH9C1nV3bsTlCo0FsTV1Q==",
      "license": "MIT",
      "dependencies": {
        "node-fetch": "^2.7.0"
      }
    },
    "node_modules/cross-spawn": {
      "version": "7.0.6",
      "resolved": "https://registry.npmjs.org/cross-spawn/-/cross-spawn-7.0.6.tgz",
      "integrity": "sha512-uV2QOWP2nWzsy2aMp8aRibhi9dlzF5Hgh5SHaB9OiTGEyDTiJJyx0uy51QXdyWbtAHNua4XJzUKca3OzKUd3vA==",
      "license": "MIT",
      "dependencies": {
        "path-key": "^3.1.0",
        "shebang-command": "^2.0.0",
        "which": "^2.0.1"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/css-in-js-utils": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/css-in-js-utils/-/css-in-js-utils-3.1.0.tgz",
      "integrity": "sha512-fJAcud6B3rRu+KHYk+Bwf+WFL2MDCJJ1XG9x137tJQ0xYxor7XziQtuGFbWNdqrvF4Tk26O3H73nfVqXt/fW1A==",
      "license": "MIT",
      "dependencies": {
        "hyphenate-style-name": "^1.0.3"
      }
    },
    "node_modules/css-select": {
      "version": "5.2.2",
      "resolved": "https://registry.npmjs.org/css-select/-/css-select-5.2.2.tgz",
      "integrity": "sha512-TizTzUddG/xYLA3NXodFM0fSbNizXjOKhqiQQwvhlspadZokn1KDy0NZFS0wuEubIYAV5/c1/lAr0TaaFXEXzw==",
      "license": "BSD-2-Clause",
      "dependencies": {
        "boolbase": "^1.0.0",
        "css-what": "^6.1.0",
        "domhandler": "^5.0.2",
        "domutils": "^3.0.1",
        "nth-check": "^2.0.1"
      },
      "funding": {
        "url": "https://github.com/sponsors/fb55"
      }
    },
    "node_modules/css-tree": {
      "version": "1.1.3",
      "resolved": "https://registry.npmjs.org/css-tree/-/css-tree-1.1.3.tgz",
      "integrity": "sha512-tRpdppF7TRazZrjJ6v3stzv93qxRcSsFmW6cX0Zm2NVKpxE1WV1HblnghVv9TreireHkqI/VDEsfolRF1p6y7Q==",
      "license": "MIT",
      "dependencies": {
        "mdn-data": "2.0.14",
        "source-map": "^0.6.1"
      },
      "engines": {
        "node": ">=8.0.0"
      }
    },
    "node_modules/css-tree/node_modules/source-map": {
      "version": "0.6.1",
      "resolved": "https://registry.npmjs.org/source-map/-/source-map-0.6.1.tgz",
      "integrity": "sha512-UjgapumWlbMhkBgzT7Ykc5YXUT46F0iKu8SGXq0bcwP5dz/h0Plj6enJqjz1Zbq2l5WaqYnrVbwWOWMyF3F47g==",
      "license": "BSD-3-Clause",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/css-what": {
      "version": "6.2.2",
      "resolved": "https://registry.npmjs.org/css-what/-/css-what-6.2.2.tgz",
      "integrity": "sha512-u/O3vwbptzhMs3L1fQE82ZSLHQQfto5gyZzwteVIEyeaY5Fc7R4dapF/BvRoSYFeqfBk4m0V1Vafq5Pjv25wvA==",
      "license": "BSD-2-Clause",
      "engines": {
        "node": ">= 6"
      },
      "funding": {
        "url": "https://github.com/sponsors/fb55"
      }
    },
    "node_modules/csstype": {
      "version": "3.2.3",
      "resolved": "https://registry.npmjs.org/csstype/-/csstype-3.2.3.tgz",
      "integrity": "sha512-z1HGKcYy2xA8AGQfwrn0PAy+PB7X/GSj3UVJW9qKyn43xWa+gl5nXmU4qqLMRzWVLFC8KusUX8T/0kCiOYpAIQ==",
      "license": "MIT"
    },
    "node_modules/debug": {
      "version": "4.4.3",
      "resolved": "https://registry.npmjs.org/debug/-/debug-4.4.3.tgz",
      "integrity": "sha512-RGwwWnwQvkVfavKVt22FGLw+xYSdzARwm0ru6DhTVA3umU5hZc28V3kO4stgYryrTlLpuvgI9GiijltAjNbcqA==",
      "license": "MIT",
      "dependencies": {
        "ms": "^2.1.3"
      },
      "engines": {
        "node": ">=6.0"
      },
      "peerDependenciesMeta": {
        "supports-color": {
          "optional": true
        }
      }
    },
    "node_modules/decode-uri-component": {
      "version": "0.2.2",
      "resolved": "https://registry.npmjs.org/decode-uri-component/-/decode-uri-component-0.2.2.tgz",
      "integrity": "sha512-FqUYQ+8o158GyGTrMFJms9qh3CqTKvAqgqsTnkLI8sKu0028orqBhxNMFkFen0zGyg6epACD32pjVk58ngIErQ==",
      "license": "MIT",
      "engines": {
        "node": ">=0.10"
      }
    },
    "node_modules/deepmerge": {
      "version": "4.3.1",
      "resolved": "https://registry.npmjs.org/deepmerge/-/deepmerge-4.3.1.tgz",
      "integrity": "sha512-3sUqbMEc77XqpdNO7FRyRog+eW3ph+GYCbj+rK+uYyRMuwsVy0rMiVtPn+QJlKFvWP/1PYpapqYn0Me2knFn+A==",
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/defaults": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/defaults/-/defaults-1.0.4.tgz",
      "integrity": "sha512-eFuaLoy/Rxalv2kr+lqMlUnrDWV+3j4pljOIJgLIhI058IQfWJ7vXhyEIHu+HtC738klGALYxOKDO0bQP3tg8A==",
      "license": "MIT",
      "dependencies": {
        "clone": "^1.0.2"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/depd": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/depd/-/depd-2.0.0.tgz",
      "integrity": "sha512-g7nH6P6dyDioJogAAGprGpCtVImJhpPk/roCzdb3fIh61/s/nPsfR6onyMwkCAR/OlC3yBC0lESvUoQEAssIrw==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/destroy": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/destroy/-/destroy-1.2.0.tgz",
      "integrity": "sha512-2sJGJTaXIIaR1w4iJSNoN0hnMY7Gpc/n8D4qSCJw8QqFWXf7cuAgnEHxBpweaVcPevC2l3KpjYCx3NypQQgaJg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8",
        "npm": "1.2.8000 || >= 1.4.16"
      }
    },
    "node_modules/detect-libc": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/detect-libc/-/detect-libc-2.1.2.tgz",
      "integrity": "sha512-Btj2BOOO83o3WyH59e8MgXsxEQVcarkUOpEYrubB0urwnN10yQ364rsiByU11nZlqWYZm05i/of7io4mzihBtQ==",
      "license": "Apache-2.0",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/dnssd-advertise": {
      "version": "1.1.6",
      "resolved": "https://registry.npmjs.org/dnssd-advertise/-/dnssd-advertise-1.1.6.tgz",
      "integrity": "sha512-Ndrrf6BMPalkQPd/zubL+4YghH2J9NspapQ09uDXwYbvOPkP0oaqf5CkcwJ0b50kS2O3ul6yVu+jz+RY62Cejg==",
      "license": "MIT"
    },
    "node_modules/dom-serializer": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/dom-serializer/-/dom-serializer-2.0.0.tgz",
      "integrity": "sha512-wIkAryiqt/nV5EQKqQpo3SToSOV9J0DnbJqwK7Wv/Trc92zIAYZ4FlMu+JPFW1DfGFt81ZTCGgDEabffXeLyJg==",
      "license": "MIT",
      "dependencies": {
        "domelementtype": "^2.3.0",
        "domhandler": "^5.0.2",
        "entities": "^4.2.0"
      },
      "funding": {
        "url": "https://github.com/cheeriojs/dom-serializer?sponsor=1"
      }
    },
    "node_modules/domelementtype": {
      "version": "2.3.0",
      "resolved": "https://registry.npmjs.org/domelementtype/-/domelementtype-2.3.0.tgz",
      "integrity": "sha512-OLETBj6w0OsagBwdXnPdN0cnMfF9opN69co+7ZrbfPGrdpPVNBUj02spi6B1N7wChLQiPn4CSH/zJvXw56gmHw==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/fb55"
        }
      ],
      "license": "BSD-2-Clause"
    },
    "node_modules/domhandler": {
      "version": "5.0.3",
      "resolved": "https://registry.npmjs.org/domhandler/-/domhandler-5.0.3.tgz",
      "integrity": "sha512-cgwlv/1iFQiFnU96XXgROh8xTeetsnJiDsTc7TYCLFd9+/WNkIqPTxiM/8pSd8VIrhXGTf1Ny1q1hquVqDJB5w==",
      "license": "BSD-2-Clause",
      "dependencies": {
        "domelementtype": "^2.3.0"
      },
      "engines": {
        "node": ">= 4"
      },
      "funding": {
        "url": "https://github.com/fb55/domhandler?sponsor=1"
      }
    },
    "node_modules/domutils": {
      "version": "3.2.2",
      "resolved": "https://registry.npmjs.org/domutils/-/domutils-3.2.2.tgz",
      "integrity": "sha512-6kZKyUajlDuqlHKVX1w7gyslj9MPIXzIFiz/rGu35uC1wMi+kMhQwGhl4lt9unC9Vb9INnY9Z3/ZA3+FhASLaw==",
      "license": "BSD-2-Clause",
      "dependencies": {
        "dom-serializer": "^2.0.0",
        "domelementtype": "^2.3.0",
        "domhandler": "^5.0.3"
      },
      "funding": {
        "url": "https://github.com/fb55/domutils?sponsor=1"
      }
    },
    "node_modules/ee-first": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/ee-first/-/ee-first-1.1.1.tgz",
      "integrity": "sha512-WMwm9LhRUo+WUaRN+vRuETqG89IgZphVSNkdFgeb6sS/E4OrDIN7t48CAewSHXc6C8lefD8KKfr5vY61brQlow==",
      "license": "MIT"
    },
    "node_modules/electron-to-chromium": {
      "version": "1.5.409",
      "resolved": "https://registry.npmjs.org/electron-to-chromium/-/electron-to-chromium-1.5.409.tgz",
      "integrity": "sha512-ChI4N44d0B4A6C8prnNjMOaGgE59fUyEVYcRYm2XEXIjMbbvF5i9UL1cblDbpGqiU0uS8FE8UcKxqZqTXdmzbQ==",
      "license": "ISC"
    },
    "node_modules/emoji-regex": {
      "version": "8.0.0",
      "resolved": "https://registry.npmjs.org/emoji-regex/-/emoji-regex-8.0.0.tgz",
      "integrity": "sha512-MSjYzcWNOA0ewAHpz0MxpYFvwg6yjy1NG3xteoqz644VCo/RPgnr1/GGt+ic3iJTzQ8Eu3TdM14SawnVUmGE6A==",
      "license": "MIT"
    },
    "node_modules/encodeurl": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/encodeurl/-/encodeurl-1.0.2.tgz",
      "integrity": "sha512-TPJXq8JqFaVYm2CWmPvnP2Iyo4ZSM7/QKcSmuMLDObfpH5fi7RUGmd/rTDf+rut/saiDiQEeVTNgAmJEdAOx0w==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/entities": {
      "version": "4.5.0",
      "resolved": "https://registry.npmjs.org/entities/-/entities-4.5.0.tgz",
      "integrity": "sha512-V0hjH4dGPh9Ao5p0MoRY6BVqtwCjhz6vI5LT8AJ55H+4g9/4vbHx1I54fS0XuclLhDHArPQCiMjDxjaL8fPxhw==",
      "license": "BSD-2-Clause",
      "engines": {
        "node": ">=0.12"
      },
      "funding": {
        "url": "https://github.com/fb55/entities?sponsor=1"
      }
    },
    "node_modules/error-stack-parser": {
      "version": "2.1.4",
      "resolved": "https://registry.npmjs.org/error-stack-parser/-/error-stack-parser-2.1.4.tgz",
      "integrity": "sha512-Sk5V6wVazPhq5MhpO+AUxJn5x7XSXGl1R93Vn7i+zS15KDVxQijejNCrz8340/2bgLBjR9GtEG8ZVKONDjcqGQ==",
      "license": "MIT",
      "dependencies": {
        "stackframe": "^1.3.4"
      }
    },
    "node_modules/es-errors": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/es-errors/-/es-errors-1.3.0.tgz",
      "integrity": "sha512-Zf5H2Kxt2xjTvbJvP2ZWLEICxA6j+hAmMzIlypy4xcBg1vKVnx89Wy0GbS+kf5cwCVFFzdCFh2XSCFNULS6csw==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/escalade": {
      "version": "3.2.0",
      "resolved": "https://registry.npmjs.org/escalade/-/escalade-3.2.0.tgz",
      "integrity": "sha512-WUj2qlxaQtO4g6Pq5c29GTcWGDyd8itL8zTlipgECz3JesAiiOKotd8JU6otB3PACgG6xkJUyVhboMS+bje/jA==",
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/escape-html": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/escape-html/-/escape-html-1.0.3.tgz",
      "integrity": "sha512-NiSupZ4OeuGwr68lGIeym/ksIZMJodUGOSCZ/FSnTxcrekbvqrgdUxlJOMpijaKZVjAJrWrGs/6Jy8OMuyj9ow==",
      "license": "MIT"
    },
    "node_modules/escape-string-regexp": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/escape-string-regexp/-/escape-string-regexp-4.0.0.tgz",
      "integrity": "sha512-TtpcNJ3XAzx3Gq8sWRzJaVajRs0uVxA2YAkdb1jm2YkPz4G6egUFAyA3n5vtEIZefPk5Wa4UXbKuS5fKkJWdgA==",
      "license": "MIT",
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/etag": {
      "version": "1.8.1",
      "resolved": "https://registry.npmjs.org/etag/-/etag-1.8.1.tgz",
      "integrity": "sha512-aIL5Fx7mawVa300al2BnEE4iNvo1qETxLrPI/o05L7z6go7fCw1J6EQmbK4FmJ2AS7kgVF/KEZWufBfdClMcPg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/event-target-shim": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/event-target-shim/-/event-target-shim-5.0.1.tgz",
      "integrity": "sha512-i/2XbnSz/uxRCU6+NdVJgKWDTM427+MqYbkQzD321DuCQJUqOuJKIA0IM2+W2xtYHdKOmZ4dR6fExsd4SXL+WQ==",
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/expo": {
      "version": "57.0.21",
      "resolved": "https://registry.npmjs.org/expo/-/expo-57.0.21.tgz",
      "integrity": "sha512-lQmC0kCJCleO+uLUwHXY0pLDzcvedKEsX+pmJp4mSxn3JlWDTZvUb0e5UIlV7+bqlN68LpAeKG4c2lrN4zuP0Q==",
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@babel/runtime": "^7.20.0",
        "@expo/cli": "^57.0.23",
        "@expo/config": "~57.0.9",
        "@expo/config-plugins": "~57.0.9",
        "@expo/devtools": "~57.0.1",
        "@expo/dom-webview": "~57.0.1",
        "@expo/fingerprint": "^0.20.12",
        "@expo/local-build-cache-provider": "^57.0.8",
        "@expo/log-box": "^57.0.4",
        "@expo/metro": "~56.0.2",
        "@expo/metro-config": "~57.0.12",
        "@ungap/structured-clone": "^1.3.0",
        "babel-preset-expo": "~57.0.11",
        "expo-asset": "~57.0.16",
        "expo-constants": "~57.0.17",
        "expo-file-system": "~57.0.6",
        "expo-font": "~57.0.3",
        "expo-keep-awake": "~57.0.1",
        "expo-modules-autolinking": "~57.0.12",
        "expo-modules-core": "~57.0.17",
        "pretty-format": "^29.7.0",
        "react-refresh": "^0.14.2",
        "whatwg-url-minimum": "^0.1.2"
      },
      "bin": {
        "expo": "bin/cli",
        "expo-modules-autolinking": "bin/autolinking",
        "fingerprint": "bin/fingerprint"
      },
      "peerDependencies": {
        "@expo/dom-webview": "*",
        "@expo/metro-runtime": "*",
        "react": "*",
        "react-dom": "*",
        "react-native": "*",
        "react-native-web": "*",
        "react-native-webview": "*"
      },
      "peerDependenciesMeta": {
        "@expo/dom-webview": {
          "optional": true
        },
        "@expo/metro-runtime": {
          "optional": true
        },
        "react-dom": {
          "optional": true
        },
        "react-native-web": {
          "optional": true
        },
        "react-native-webview": {
          "optional": true
        }
      }
    },
    "node_modules/expo-asset": {
      "version": "57.0.16",
      "resolved": "https://registry.npmjs.org/expo-asset/-/expo-asset-57.0.16.tgz",
      "integrity": "sha512-IBRfQdW3iFT+GOBERMZLZM1MUNyrjMgMskuD0elVZ1ae44858UFlTJkHO3f8vi+u5zuv7O7KofsiN8NMG/uWzw==",
      "license": "MIT",
      "dependencies": {
        "@expo/image-utils": "^0.11.5",
        "expo-constants": "~57.0.17"
      },
      "peerDependencies": {
        "expo": "*",
        "react": "*",
        "react-native": "*"
      }
    },
    "node_modules/expo-constants": {
      "version": "57.0.17",
      "resolved": "https://registry.npmjs.org/expo-constants/-/expo-constants-57.0.17.tgz",
      "integrity": "sha512-cPWYBKN1SEbg2lXg2f8VkePJqGZrJPLvVdQDCTfbFu9sQHO1M31Y1zILReUuGnmt/VKeUz40ze579vR00xGu/A==",
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@expo/env": "~2.4.3"
      },
      "peerDependencies": {
        "expo": "*",
        "react-native": "*"
      }
    },
    "node_modules/expo-document-picker": {
      "version": "57.0.1",
      "resolved": "https://registry.npmjs.org/expo-document-picker/-/expo-document-picker-57.0.1.tgz",
      "integrity": "sha512-qBwM5oxDZ3I9kwFD3pUE1oK/WNv9artoEKO6UpqhQgNRr0XA1ALRVWYjkF4+ge9lUNDRehjTm/jenINkzqg84g==",
      "license": "MIT",
      "peerDependencies": {
        "expo": "*"
      }
    },
    "node_modules/expo-file-system": {
      "version": "57.0.7",
      "resolved": "https://registry.npmjs.org/expo-file-system/-/expo-file-system-57.0.7.tgz",
      "integrity": "sha512-1vkZRadOsIputFDBcclqBa1pO3iXOO6iIsdqJipQWw4V5TSnWgmRTuOF7ro8IzrVue+PHbum++KCG3Tawem4cg==",
      "license": "MIT",
      "peerDependencies": {
        "expo": "*",
        "react-native": "*"
      }
    },
    "node_modules/expo-font": {
      "version": "57.0.3",
      "resolved": "https://registry.npmjs.org/expo-font/-/expo-font-57.0.3.tgz",
      "integrity": "sha512-kiVUnc2A8vAvO2FfDJTsQa5BwmY+PAkof/1wRb5MOkcX1jtiaSTwz9gCUAyscMBFLundZDmZrLy1P7LZVC+NvA==",
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "fontfaceobserver": "^2.1.0"
      },
      "peerDependencies": {
        "expo": "*",
        "react": "*",
        "react-native": "*"
      }
    },
    "node_modules/expo-image-loader": {
      "version": "57.0.1",
      "resolved": "https://registry.npmjs.org/expo-image-loader/-/expo-image-loader-57.0.1.tgz",
      "integrity": "sha512-uhrZKLT/cTl2mXyR28kPpVkS5O+PK9N1QA/07IFM4f5T4g0lTW1JHT3NEWwEEsGFldPmVX4j7LwUVVZxE+woug==",
      "license": "MIT",
      "peerDependencies": {
        "expo": "*"
      }
    },
    "node_modules/expo-image-picker": {
      "version": "57.0.16",
      "resolved": "https://registry.npmjs.org/expo-image-picker/-/expo-image-picker-57.0.16.tgz",
      "integrity": "sha512-9CrY/hoBHI2GsOo/4AWz6cInRHhGhhCmbza3JYr4j3P/NWpthLlIm0IXSWpxadSYJx0a2FAti0f7XWMg95aPEg==",
      "license": "MIT",
      "dependencies": {
        "expo-image-loader": "~57.0.1"
      },
      "peerDependencies": {
        "expo": "*"
      }
    },
    "node_modules/expo-keep-awake": {
      "version": "57.0.1",
      "resolved": "https://registry.npmjs.org/expo-keep-awake/-/expo-keep-awake-57.0.1.tgz",
      "integrity": "sha512-28lkFImeXTS+bhAjuCFV7w7tW5bXg27BJVrxv+nC/nyYa86qEa0oFeHwqol6ha5k4pdVDQgBF09GM4A1k76Ssg==",
      "license": "MIT",
      "peerDependencies": {
        "expo": "*",
        "react": "*"
      }
    },
    "node_modules/expo-modules-autolinking": {
      "version": "57.0.12",
      "resolved": "https://registry.npmjs.org/expo-modules-autolinking/-/expo-modules-autolinking-57.0.12.tgz",
      "integrity": "sha512-Q8KAlq37nLKsQ+HsS9NpQVpd5jCgqtu694TDUNHBUBpV9ViD82mRBh8Uug/h68RG9xnLS+kuL4nYaCuFRghHjg==",
      "license": "MIT",
      "dependencies": {
        "@expo/require-utils": "^57.0.5",
        "@expo/spawn-async": "^1.8.0",
        "chalk": "^4.1.0",
        "commander": "^7.2.0"
      },
      "bin": {
        "expo-modules-autolinking": "bin/expo-modules-autolinking.js"
      }
    },
    "node_modules/expo-modules-jsi": {
      "version": "57.1.0",
      "resolved": "https://registry.npmjs.org/expo-modules-jsi/-/expo-modules-jsi-57.1.0.tgz",
      "integrity": "sha512-a5ckeHfnbYfonhcHGkM0EU/a0Keh+/OufXy/HyFS+spr5Ib0N4Oh1ZsSYFQhp5xdOUFkVofKRhfH+VmcccIIpA==",
      "license": "MIT",
      "peerDependencies": {
        "react-native": "*"
      }
    },
    "node_modules/expo-server": {
      "version": "57.0.3",
      "resolved": "https://registry.npmjs.org/expo-server/-/expo-server-57.0.3.tgz",
      "integrity": "sha512-aK+LdKzauHSGmsOStZtyxdzv0zWssCkxTw3m4QuOhfDSJsZaMRTd9O41d8ixU/QfELTbaJ0oRNcF7JFV/7O9YQ==",
      "license": "MIT",
      "peer": true,
      "engines": {
        "node": ">=20.16.0"
      }
    },
    "node_modules/expo-status-bar": {
      "version": "57.0.1",
      "resolved": "https://registry.npmjs.org/expo-status-bar/-/expo-status-bar-57.0.1.tgz",
      "integrity": "sha512-Xwaq1gAoVRWx5dPG5VhT5RSbnI9OilhZnO5qoPBnUaBAa5VzRzfdS8q0/bsPt0jR2DKLtGuP0bQ6efMJ4RIMDg==",
      "license": "MIT",
      "peerDependencies": {
        "expo": "*",
        "react": "*",
        "react-native": "*"
      }
    },
    "node_modules/expo-web-browser": {
      "version": "57.0.2",
      "resolved": "https://registry.npmjs.org/expo-web-browser/-/expo-web-browser-57.0.2.tgz",
      "integrity": "sha512-3vl5kvd7PB48ub6PpNIJUuPxO8xVa6D8RnIgNba6SXRwqFprOfeEZgwTgtm41kz0AAtvMOztUVNEUkwrHKjqMQ==",
      "license": "MIT",
      "peerDependencies": {
        "expo": "*",
        "react-native": "*"
      }
    },
    "node_modules/expo/node_modules/@expo/cli": {
      "version": "57.0.23",
      "resolved": "https://registry.npmjs.org/@expo/cli/-/cli-57.0.23.tgz",
      "integrity": "sha512-stzSYxVwbWGbKR+mrYT6s4Rt6HrcUxb0JrHyebDGL4ehpvfRTv0rMzn4Q7fqB6f5wJ1KCmf6OAgqgK+TTB8/FA==",
      "license": "MIT",
      "dependencies": {
        "@expo/code-signing-certificates": "^0.0.6",
        "@expo/config": "~57.0.9",
        "@expo/config-plugins": "~57.0.9",
        "@expo/devcert": "^1.2.1",
        "@expo/env": "~2.4.3",
        "@expo/image-utils": "^0.11.5",
        "@expo/inline-modules": "^0.1.7",
        "@expo/json-file": "^11.0.1",
        "@expo/log-box": "^57.0.4",
        "@expo/metro": "~56.0.2",
        "@expo/metro-config": "~57.0.12",
        "@expo/metro-file-map": "^57.0.3",
        "@expo/osascript": "^2.7.1",
        "@expo/package-manager": "^1.13.1",
        "@expo/plist": "^0.8.1",
        "@expo/prebuild-config": "^57.0.15",
        "@expo/require-utils": "^57.0.5",
        "@expo/router-server": "^57.0.9",
        "@expo/schema-utils": "^57.0.2",
        "@expo/spawn-async": "^1.8.0",
        "@expo/ws-tunnel": "^2.0.0",
        "@expo/xcpretty": "^4.4.4",
        "@react-native/dev-middleware": "0.86.3",
        "accepts": "^1.3.8",
        "agent-cli-detector": "0.1.7",
        "arg": "^5.0.2",
        "bplist-creator": "0.1.0",
        "bplist-parser": "^0.3.1",
        "chalk": "^4.0.0",
        "ci-info": "^3.3.0",
        "compression": "^1.7.4",
        "connect": "^3.7.0",
        "debug": "^4.3.4",
        "dnssd-advertise": "^1.1.4",
        "expo-server": "^57.0.3",
        "fetch-nodeshim": "^0.4.10",
        "getenv": "^2.0.0",
        "glob": "^13.0.0",
        "lan-network": "^0.2.1",
        "multitars": "^1.0.2",
        "node-forge": "^1.3.3",
        "npm-package-arg": "^11.0.0",
        "ora": "^3.4.0",
        "picomatch": "^4.0.4",
        "pretty-format": "^29.7.0",
        "progress": "^2.0.3",
        "prompts": "^2.3.2",
        "resolve-from": "^5.0.0",
        "sandbox-cli-detector": "^0.2.0",
        "semver": "^7.6.0",
        "send": "^0.19.0",
        "slugify": "^1.3.4",
        "stacktrace-parser": "^0.1.10",
        "structured-headers": "^0.4.1",
        "terminal-link": "^2.1.1",
        "toqr": "^0.1.1",
        "wrap-ansi": "^7.0.0",
        "ws": "^8.12.1",
        "zod": "^3.25.76"
      },
      "bin": {
        "expo-internal": "main.js"
      },
      "peerDependencies": {
        "expo": "*",
        "expo-router": "*",
        "react-native": "*"
      },
      "peerDependenciesMeta": {
        "expo-router": {
          "optional": true
        },
        "react-native": {
          "optional": true
        }
      }
    },
    "node_modules/expo/node_modules/@expo/cli/node_modules/@expo/router-server": {
      "version": "57.0.9",
      "resolved": "https://registry.npmjs.org/@expo/router-server/-/router-server-57.0.9.tgz",
      "integrity": "sha512-/PxRQozFesIyCJZOAtrQE8XcmcojNiL5ctPMQnbE4ojC2EJPu0zc7c0Y4PuXsoRxrZxm8Usw76/lCVrXcfTZ2w==",
      "license": "MIT",
      "dependencies": {
        "debug": "^4.3.4"
      },
      "peerDependencies": {
        "@expo/metro-runtime": "^57.0.15",
        "expo": "*",
        "expo-constants": "^57.0.17",
        "expo-font": "^57.0.3",
        "expo-router": "*",
        "expo-server": "^57.0.3",
        "react": "*",
        "react-dom": "*",
        "react-server-dom-webpack": "~19.0.1 || ~19.1.2 || ~19.2.1"
      },
      "peerDependenciesMeta": {
        "@expo/metro-runtime": {
          "optional": true
        },
        "expo-router": {
          "optional": true
        },
        "react-dom": {
          "optional": true
        },
        "react-server-dom-webpack": {
          "optional": true
        }
      }
    },
    "node_modules/expo/node_modules/@expo/ws-tunnel": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/@expo/ws-tunnel/-/ws-tunnel-2.0.0.tgz",
      "integrity": "sha512-j+JfTRdCk820J9dU0sA2SqshQIKFOMo7ED84w9MJFcebfbNQgsLztEY/SABDkGnjatrW4xGqnUhVRxSBVyCkXw==",
      "license": "MIT",
      "peerDependencies": {
        "ws": "^8.0.0"
      }
    },
    "node_modules/expo/node_modules/ci-info": {
      "version": "3.9.0",
      "resolved": "https://registry.npmjs.org/ci-info/-/ci-info-3.9.0.tgz",
      "integrity": "sha512-NIxF55hv4nSqQswkAeiOi1r83xy8JldOFDTWiug55KBu9Jnblncd2U6ViHmYgHf01TPZS77NJBhBMKdWj9HQMQ==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/sibiraj-s"
        }
      ],
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/expo/node_modules/expo-modules-core": {
      "version": "57.0.17",
      "resolved": "https://registry.npmjs.org/expo-modules-core/-/expo-modules-core-57.0.17.tgz",
      "integrity": "sha512-hHJwGHW0sMQiOLzEEl1QbJeWkBEBgjlPjrdBVGWlzvgUbCXJfFbDU2nhxoyzLMZnvHkpIzpiJjj5cM5W8gbudA==",
      "license": "MIT",
      "dependencies": {
        "@expo/expo-modules-macros-plugin": "0.6.1",
        "expo-modules-jsi": "~57.1.0",
        "invariant": "^2.2.4"
      },
      "peerDependencies": {
        "react": "*",
        "react-native": "*",
        "react-native-worklets": "^0.7.4 || ^0.8.0 || ^0.9.0 || ^0.10.0"
      },
      "peerDependenciesMeta": {
        "react-native-worklets": {
          "optional": true
        }
      }
    },
    "node_modules/expo/node_modules/picomatch": {
      "version": "4.0.7",
      "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-4.0.7.tgz",
      "integrity": "sha512-qcJu88Q2IWqJsDD529JKMdwGm/dvInW4HvQnRwiH9JtihJvzGOscDtHE3x1pBKeUOTysQ8kVmLnJ2kJu7yhcGA==",
      "license": "MIT",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/sponsors/jonschlinkert"
      }
    },
    "node_modules/expo/node_modules/ws": {
      "version": "8.21.3",
      "resolved": "https://registry.npmjs.org/ws/-/ws-8.21.3.tgz",
      "integrity": "sha512-201TZ/kPWxoPr/OKWjquZR1SWKXcvxdH+e1xrx89b3YbmzLMFCLfnaG1HFIgWzJOEWZ7MvpK++odZufgYR50Rw==",
      "license": "MIT",
      "peer": true,
      "engines": {
        "node": ">=10.0.0"
      },
      "peerDependencies": {
        "bufferutil": "^4.0.1",
        "utf-8-validate": ">=5.0.2"
      },
      "peerDependenciesMeta": {
        "bufferutil": {
          "optional": true
        },
        "utf-8-validate": {
          "optional": true
        }
      }
    },
    "node_modules/exponential-backoff": {
      "version": "3.1.3",
      "resolved": "https://registry.npmjs.org/exponential-backoff/-/exponential-backoff-3.1.3.tgz",
      "integrity": "sha512-ZgEeZXj30q+I0EN+CbSSpIyPaJ5HVQD18Z1m+u1FXbAeT94mr1zw50q4q6jiiC447Nl/YTcIYSAftiGqetwXCA==",
      "license": "Apache-2.0"
    },
    "node_modules/fast-deep-equal": {
      "version": "3.1.3",
      "resolved": "https://registry.npmjs.org/fast-deep-equal/-/fast-deep-equal-3.1.3.tgz",
      "integrity": "sha512-f3qQ9oQy9j2AhBe/H9VC91wLmKBCCU/gDOnKNAYG5hswO7BLKj09Hc5HYNz9cGI++xlpDCIgDaitVs03ATR84Q==",
      "license": "MIT"
    },
    "node_modules/fb-dotslash": {
      "version": "0.5.8",
      "resolved": "https://registry.npmjs.org/fb-dotslash/-/fb-dotslash-0.5.8.tgz",
      "integrity": "sha512-XHYLKk9J4BupDxi9bSEhkfss0m+Vr9ChTrjhf9l2iw3jB5C7BnY4GVPoMcqbrTutsKJso6yj2nAB6BI/F2oZaA==",
      "license": "(MIT OR Apache-2.0)",
      "bin": {
        "dotslash": "bin/dotslash"
      },
      "engines": {
        "node": ">=20"
      }
    },
    "node_modules/fb-watchman": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/fb-watchman/-/fb-watchman-2.0.2.tgz",
      "integrity": "sha512-p5161BqbuCaSnB8jIbzQHOlpgsPmK5rJVDfDKO91Axs5NC1uu3HRQm6wt9cd9/+GtQQIO53JdGXXoyDpTAsgYA==",
      "license": "Apache-2.0",
      "dependencies": {
        "bser": "2.1.1"
      }
    },
    "node_modules/fbjs": {
      "version": "3.0.5",
      "resolved": "https://registry.npmjs.org/fbjs/-/fbjs-3.0.5.tgz",
      "integrity": "sha512-ztsSx77JBtkuMrEypfhgc3cI0+0h+svqeie7xHbh1k/IKdcydnvadp/mUaGgjAOXQmQSxsqgaRhS3q9fy+1kxg==",
      "license": "MIT",
      "dependencies": {
        "cross-fetch": "^3.1.5",
        "fbjs-css-vars": "^1.0.0",
        "loose-envify": "^1.0.0",
        "object-assign": "^4.1.0",
        "promise": "^7.1.1",
        "setimmediate": "^1.0.5",
        "ua-parser-js": "^1.0.35"
      }
    },
    "node_modules/fbjs-css-vars": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/fbjs-css-vars/-/fbjs-css-vars-1.0.2.tgz",
      "integrity": "sha512-b2XGFAFdWZWg0phtAWLHCk836A1Xann+I+Dgd3Gk64MHKZO44FfoD1KxyvbSh0qZsIoXQGGlVztIY+oitJPpRQ==",
      "license": "MIT"
    },
    "node_modules/fbjs/node_modules/promise": {
      "version": "7.3.1",
      "resolved": "https://registry.npmjs.org/promise/-/promise-7.3.1.tgz",
      "integrity": "sha512-nolQXZ/4L+bP/UGlkfaIujX9BKxGwmQ9OT4mOt5yvy8iK1h3wqTEJCijzGANTCCl9nWjY41juyAn2K3Q1hLLTg==",
      "license": "MIT",
      "dependencies": {
        "asap": "~2.0.3"
      }
    },
    "node_modules/fetch-nodeshim": {
      "version": "0.4.10",
      "resolved": "https://registry.npmjs.org/fetch-nodeshim/-/fetch-nodeshim-0.4.10.tgz",
      "integrity": "sha512-m6I8ALe4L4XpdETy7MJZWs6L1IVMbjs99bwbpIKphxX+0CTns4IKDWJY0LWfr4YsFjfg+z1TjzTMU8lKl8rG0w==",
      "license": "MIT"
    },
    "node_modules/fill-range": {
      "version": "7.1.1",
      "resolved": "https://registry.npmjs.org/fill-range/-/fill-range-7.1.1.tgz",
      "integrity": "sha512-YsGpe3WHLK8ZYi4tWDg2Jy3ebRz2rXowDxnld4bkQB00cc/1Zw9AWnC0i9ztDJitivtQvaI9KaLyKrc+hBW0yg==",
      "license": "MIT",
      "dependencies": {
        "to-regex-range": "^5.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/filter-obj": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/filter-obj/-/filter-obj-1.1.0.tgz",
      "integrity": "sha512-8rXg1ZnX7xzy2NGDVkBVaAy+lSlPNwad13BtgSlLuxfIslyt5Vg64U7tFcCt4WS1R0hvtnQybT/IyCkGZ3DpXQ==",
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/finalhandler": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/finalhandler/-/finalhandler-1.1.2.tgz",
      "integrity": "sha512-aAWcW57uxVNrQZqFXjITpW3sIUQmHGG3qSb9mUah9MgMC4NeWhNOlNjXEYq3HjRAvL6arUviZGGJsBg6z0zsWA==",
      "license": "MIT",
      "dependencies": {
        "debug": "2.6.9",
        "encodeurl": "~1.0.2",
        "escape-html": "~1.0.3",
        "on-finished": "~2.3.0",
        "parseurl": "~1.3.3",
        "statuses": "~1.5.0",
        "unpipe": "~1.0.0"
      },
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/finalhandler/node_modules/debug": {
      "version": "2.6.9",
      "resolved": "https://registry.npmjs.org/debug/-/debug-2.6.9.tgz",
      "integrity": "sha512-bC7ElrdJaJnPbAP+1EotYvqZsb3ecl5wi6Bfi6BJTUcNowp6cvspg0jXznRTKDjm/E7AdgFBVeAPVMNcKGsHMA==",
      "license": "MIT",
      "dependencies": {
        "ms": "2.0.0"
      }
    },
    "node_modules/finalhandler/node_modules/ms": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.0.0.tgz",
      "integrity": "sha512-Tpp60P6IUJDTuOq/5Z8cdskzJujfwqfOTkrwIwj7IRISpnkJnT6SyJ4PCPnGMoFjC9ddhal5KVIYtAt97ix05A==",
      "license": "MIT"
    },
    "node_modules/flow-enums-runtime": {
      "version": "0.0.6",
      "resolved": "https://registry.npmjs.org/flow-enums-runtime/-/flow-enums-runtime-0.0.6.tgz",
      "integrity": "sha512-3PYnM29RFXwvAN6Pc/scUfkI7RwhQ/xqyLUyPNlXUp9S40zI8nup9tUSrTLSVnWGBN38FNiGWbwZOB6uR4OGdw==",
      "license": "MIT"
    },
    "node_modules/fontfaceobserver": {
      "version": "2.3.0",
      "resolved": "https://registry.npmjs.org/fontfaceobserver/-/fontfaceobserver-2.3.0.tgz",
      "integrity": "sha512-6FPvD/IVyT4ZlNe7Wcn5Fb/4ChigpucKYSvD6a+0iMoLn2inpo711eyIcKjmDtE5XNcgAkSH9uN/nfAeZzHEfg==",
      "license": "BSD-2-Clause"
    },
    "node_modules/fresh": {
      "version": "0.5.2",
      "resolved": "https://registry.npmjs.org/fresh/-/fresh-0.5.2.tgz",
      "integrity": "sha512-zJ2mQYM18rEFOudeV4GShTGIQ7RbzA7ozbU9I/XBpm7kqgMywgmylMwXHxZJmkVoYkna9d2pVXVXPdYTP9ej8Q==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/function-bind": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/function-bind/-/function-bind-1.1.2.tgz",
      "integrity": "sha512-7XHNxH7qX9xG5mIwxkhumTox/MIRNcOgDrxWsMt2pAr23WHp6MrRlN7FBSFpCpr+oVO0F744iUgR82nJMfG2SA==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/gensync": {
      "version": "1.0.0-beta.2",
      "resolved": "https://registry.npmjs.org/gensync/-/gensync-1.0.0-beta.2.tgz",
      "integrity": "sha512-3hN7NaskYvMDLQY55gnW3NQ+mesEAepTqlg+VEbj7zzqEMBVNhzcGYYeqFo/TlYz6eQiFcp1HcsCZO+nGgS8zg==",
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/get-caller-file": {
      "version": "2.0.5",
      "resolved": "https://registry.npmjs.org/get-caller-file/-/get-caller-file-2.0.5.tgz",
      "integrity": "sha512-DyFP3BM/3YHTQOCUL/w0OZHR0lpKeGrxotcHWcqNEdnltqFwXVfhEBQ94eIo34AfQpo0rGki4cyIiftY06h2Fg==",
      "license": "ISC",
      "engines": {
        "node": "6.* || 8.* || >= 10.*"
      }
    },
    "node_modules/getenv": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/getenv/-/getenv-2.0.0.tgz",
      "integrity": "sha512-VilgtJj/ALgGY77fiLam5iD336eSWi96Q15JSAG1zi8NRBysm3LXKdGnHb4m5cuyxvOLQQKWpBZAT6ni4FI2iQ==",
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/glob": {
      "version": "13.0.6",
      "resolved": "https://registry.npmjs.org/glob/-/glob-13.0.6.tgz",
      "integrity": "sha512-Wjlyrolmm8uDpm/ogGyXZXb1Z+Ca2B8NbJwqBVg0axK9GbBeoS7yGV6vjXnYdGm6X53iehEuxxbyiKp8QmN4Vw==",
      "license": "BlueOak-1.0.0",
      "dependencies": {
        "minimatch": "^10.2.2",
        "minipass": "^7.1.3",
        "path-scurry": "^2.0.2"
      },
      "engines": {
        "node": "18 || 20 || >=22"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/graceful-fs": {
      "version": "4.2.11",
      "resolved": "https://registry.npmjs.org/graceful-fs/-/graceful-fs-4.2.11.tgz",
      "integrity": "sha512-RbJ5/jmFcNNCcDV5o9eTnBLJ/HszWV0P73bc+Ff4nS/rJj+YaS6IGyiOL0VoBYX+l1Wrl3k63h/KrH+nhJ0XvQ==",
      "license": "ISC"
    },
    "node_modules/has-flag": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/has-flag/-/has-flag-4.0.0.tgz",
      "integrity": "sha512-EykJT/Q1KjTWctppgIAgfSO0tKVuZUjhgMr17kqTumMl6Afv3EISleU7qZUzoXDFTAHTDC4NOoG/ZxU3EvlMPQ==",
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/hasown": {
      "version": "2.0.4",
      "resolved": "https://registry.npmjs.org/hasown/-/hasown-2.0.4.tgz",
      "integrity": "sha512-T2UbfbBEF32wiepXIsMlTW9+dDYC6wMh/t/vYA4tuOMKqWz/n3vr1NFSxQiyP+zk2mXsoMA/i/7qV6LKut1t1A==",
      "license": "MIT",
      "dependencies": {
        "function-bind": "^1.1.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/hermes-compiler": {
      "version": "250829098.0.17",
      "resolved": "https://registry.npmjs.org/hermes-compiler/-/hermes-compiler-250829098.0.17.tgz",
      "integrity": "sha512-qG1PXzTEtriF6oQLZF3vyHhSMxOdW5h2TqqLri0rdpstPustd2fSvRZQMVAPdlhgFwBfYnj3OUZtiO6LjYsEFw==",
      "license": "MIT"
    },
    "node_modules/hermes-estree": {
      "version": "0.36.0",
      "resolved": "https://registry.npmjs.org/hermes-estree/-/hermes-estree-0.36.0.tgz",
      "integrity": "sha512-A1+8zn5oss2CFP7pKsOaxorQG6FNIz1WU1VDqruLPPZl3LVgeE2C5xfFg8Ow6/Ow4mSslLLtYP1J3n38eKyW9w==",
      "license": "MIT"
    },
    "node_modules/hermes-parser": {
      "version": "0.36.0",
      "resolved": "https://registry.npmjs.org/hermes-parser/-/hermes-parser-0.36.0.tgz",
      "integrity": "sha512-GdpwMmH5x6IpC1cijvcvYnlPB60Mh6kTSF/NFdYV/j56gYdi+0RIakYs+eqOV+bbO0SW7mgVVGSsTJxyPQfo3w==",
      "license": "MIT",
      "dependencies": {
        "hermes-estree": "0.36.0"
      }
    },
    "node_modules/hoist-non-react-statics": {
      "version": "3.3.2",
      "resolved": "https://registry.npmjs.org/hoist-non-react-statics/-/hoist-non-react-statics-3.3.2.tgz",
      "integrity": "sha512-/gGivxi8JPKWNm/W0jSmzcMPpfpPLc3dY/6GxhX2hQ9iGj3aDfklV4ET7NjKpSinLpJ5vafa9iiGIEZg10SfBw==",
      "license": "BSD-3-Clause",
      "dependencies": {
        "react-is": "^16.7.0"
      }
    },
    "node_modules/hoist-non-react-statics/node_modules/react-is": {
      "version": "16.13.1",
      "resolved": "https://registry.npmjs.org/react-is/-/react-is-16.13.1.tgz",
      "integrity": "sha512-24e6ynE2H+OKt4kqsOvNd8kBpV65zoxbA4BVsEOB3ARVWQki/DHzaUoC5KuON/BiccDaCCTZBuOcfZs70kR8bQ==",
      "license": "MIT"
    },
    "node_modules/hosted-git-info": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/hosted-git-info/-/hosted-git-info-7.0.2.tgz",
      "integrity": "sha512-puUZAUKT5m8Zzvs72XWy3HtvVbTWljRE66cP60bxJzAqf2DgICo7lYTY2IHUmLnNpjYvw5bvmoHvPc0QO2a62w==",
      "license": "ISC",
      "dependencies": {
        "lru-cache": "^10.0.1"
      },
      "engines": {
        "node": "^16.14.0 || >=18.0.0"
      }
    },
    "node_modules/hosted-git-info/node_modules/lru-cache": {
      "version": "10.4.3",
      "resolved": "https://registry.npmjs.org/lru-cache/-/lru-cache-10.4.3.tgz",
      "integrity": "sha512-JNAzZcXrCt42VGLuYz0zfAzDfAvJWW6AfYlDBQyDV5DClI2m5sAmK+OIO7s59XfsRsWHp02jAJrRadPRGTt6SQ==",
      "license": "ISC"
    },
    "node_modules/http-errors": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/http-errors/-/http-errors-2.0.1.tgz",
      "integrity": "sha512-4FbRdAX+bSdmo4AUFuS0WNiPz8NgFt+r8ThgNWmlrjQjt1Q7ZR9+zTlce2859x4KSXrwIsaeTqDoKQmtP8pLmQ==",
      "license": "MIT",
      "dependencies": {
        "depd": "~2.0.0",
        "inherits": "~2.0.4",
        "setprototypeof": "~1.2.0",
        "statuses": "~2.0.2",
        "toidentifier": "~1.0.1"
      },
      "engines": {
        "node": ">= 0.8"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/http-errors/node_modules/statuses": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/statuses/-/statuses-2.0.2.tgz",
      "integrity": "sha512-DvEy55V3DB7uknRo+4iOGT5fP1slR8wQohVdknigZPMpMstaKJQWhwiYBACJE3Ul2pTnATihhBYnRhZQHGBiRw==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/https-proxy-agent": {
      "version": "7.0.6",
      "resolved": "https://registry.npmjs.org/https-proxy-agent/-/https-proxy-agent-7.0.6.tgz",
      "integrity": "sha512-vK9P5/iUfdl95AI+JVyUuIcVtd4ofvtrOr3HNtM2yxC9bnMbEdp3x01OhQNnjb8IJYi38VlTE3mBXwcfvywuSw==",
      "license": "MIT",
      "dependencies": {
        "agent-base": "^7.1.2",
        "debug": "4"
      },
      "engines": {
        "node": ">= 14"
      }
    },
    "node_modules/hyphenate-style-name": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/hyphenate-style-name/-/hyphenate-style-name-1.1.0.tgz",
      "integrity": "sha512-WDC/ui2VVRrz3jOVi+XtjqkDjiVjTtFaAGiW37k6b+ohyQ5wYDOGkvCZa8+H0nx3gyvv0+BST9xuOgIyGQ00gw==",
      "license": "BSD-3-Clause"
    },
    "node_modules/ignore": {
      "version": "5.3.2",
      "resolved": "https://registry.npmjs.org/ignore/-/ignore-5.3.2.tgz",
      "integrity": "sha512-hsBTNUqQTDwkWtcdYI2i06Y/nUBEsNEDJKjWdigLvegy8kDuJAS8uRlpkkcQpyEXL0Z/pjDy5HBmMjRCJ2gq+g==",
      "license": "MIT",
      "engines": {
        "node": ">= 4"
      }
    },
    "node_modules/inherits": {
      "version": "2.0.4",
      "resolved": "https://registry.npmjs.org/inherits/-/inherits-2.0.4.tgz",
      "integrity": "sha512-k/vGaX4/Yla3WzyMCvTQOXYeIHvqOKtnqBduzTHpzpQZzAskKMhZ2K+EnBiSM9zGSoIFeMpXKxa4dYeZIQqewQ==",
      "license": "ISC"
    },
    "node_modules/inline-style-prefixer": {
      "version": "7.0.1",
      "resolved": "https://registry.npmjs.org/inline-style-prefixer/-/inline-style-prefixer-7.0.1.tgz",
      "integrity": "sha512-lhYo5qNTQp3EvSSp3sRvXMbVQTLrvGV6DycRMJ5dm2BLMiJ30wpXKdDdgX+GmJZ5uQMucwRKHamXSst3Sj/Giw==",
      "license": "MIT",
      "dependencies": {
        "css-in-js-utils": "^3.1.0"
      }
    },
    "node_modules/invariant": {
      "version": "2.2.4",
      "resolved": "https://registry.npmjs.org/invariant/-/invariant-2.2.4.tgz",
      "integrity": "sha512-phJfQVBuaJM5raOpJjSfkiD6BpbCE4Ns//LaXl6wGYtUBY83nWS6Rf9tXm2e8VaK60JEjYldbPif/A2B1C2gNA==",
      "license": "MIT",
      "dependencies": {
        "loose-envify": "^1.0.0"
      }
    },
    "node_modules/is-arrayish": {
      "version": "0.3.4",
      "resolved": "https://registry.npmjs.org/is-arrayish/-/is-arrayish-0.3.4.tgz",
      "integrity": "sha512-m6UrgzFVUYawGBh1dUsWR5M2Clqic9RVXC/9f8ceNlv2IcO9j9J/z8UoCLPqtsPBFNzEpfR3xftohbfqDx8EQA==",
      "license": "MIT"
    },
    "node_modules/is-core-module": {
      "version": "2.16.2",
      "resolved": "https://registry.npmjs.org/is-core-module/-/is-core-module-2.16.2.tgz",
      "integrity": "sha512-evOr8xfXKxE6qSR0hSXL2r3sd7ALj8+7jQEUvPYcm5sgZFdJ+AYzT6yNmJenvIYQBgIGwfwz08sL8zoL7yq2BA==",
      "license": "MIT",
      "dependencies": {
        "hasown": "^2.0.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-docker": {
      "version": "2.2.1",
      "resolved": "https://registry.npmjs.org/is-docker/-/is-docker-2.2.1.tgz",
      "integrity": "sha512-F+i2BKsFrH66iaUFc0woD8sLy8getkwTwtOBjvs56Cx4CgJDeKQeqfz8wAYiSb8JOprWhHH5p77PbmYCvvUuXQ==",
      "license": "MIT",
      "bin": {
        "is-docker": "cli.js"
      },
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/is-fullwidth-code-point": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/is-fullwidth-code-point/-/is-fullwidth-code-point-3.0.0.tgz",
      "integrity": "sha512-zymm5+u+sCsSWyD9qNaejV3DFvhCKclKdizYaJUuHA83RLjb7nSuGnddCHGv0hk+KY7BMAlsWeK4Ueg6EV6XQg==",
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/is-number": {
      "version": "7.0.0",
      "resolved": "https://registry.npmjs.org/is-number/-/is-number-7.0.0.tgz",
      "integrity": "sha512-41Cifkg6e8TylSpdtTpeLVMqvSBEVzTttHvERD741+pnZ8ANv0004MRL43QKPDlK9cGvNp6NZWZUBlbGXYxxng==",
      "license": "MIT",
      "engines": {
        "node": ">=0.12.0"
      }
    },
    "node_modules/is-plain-obj": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/is-plain-obj/-/is-plain-obj-2.1.0.tgz",
      "integrity": "sha512-YWnfyRwxL/+SsrWYfOpUtz5b3YD+nyfkHvjbcanzk8zgyO4ASD67uVMRt8k5bM4lLMDnXfriRhOpemw+NfT1eA==",
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/is-wsl": {
      "version": "2.2.0",
      "resolved": "https://registry.npmjs.org/is-wsl/-/is-wsl-2.2.0.tgz",
      "integrity": "sha512-fKzAra0rGJUUBwGBgNkHZuToZcn+TtXHpeCgmkMJMMYx1sQDYaCSyjJBSCa2nH1DGm7s3n1oBnohoVTBaN7Lww==",
      "license": "MIT",
      "dependencies": {
        "is-docker": "^2.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/isexe": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/isexe/-/isexe-2.0.0.tgz",
      "integrity": "sha512-RHxMLp9lnKHGHRng9QFhRCMbYAcVpn69smSGcq3f36xjgVVWThj4qqLbTLlq7Ssj8B+fIQ1EuCEGI2lKsyQeIw==",
      "license": "ISC"
    },
    "node_modules/jest-get-type": {
      "version": "29.6.3",
      "resolved": "https://registry.npmjs.org/jest-get-type/-/jest-get-type-29.6.3.tgz",
      "integrity": "sha512-zrteXnqYxfQh7l5FHyL38jL39di8H8rHoecLH3JNxH3BwOrBsNeabdap5e0I23lD4HHI8W5VFBZqG4Eaq5LNcw==",
      "license": "MIT",
      "engines": {
        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
      }
    },
    "node_modules/jest-util": {
      "version": "29.7.0",
      "resolved": "https://registry.npmjs.org/jest-util/-/jest-util-29.7.0.tgz",
      "integrity": "sha512-z6EbKajIpqGKU56y5KBUgy1dt1ihhQJgWzUlZHArA/+X2ad7Cb5iF+AK1EWVL/Bo7Rz9uurpqw6SiBCefUbCGA==",
      "license": "MIT",
      "dependencies": {
        "@jest/types": "^29.6.3",
        "@types/node": "*",
        "chalk": "^4.0.0",
        "ci-info": "^3.2.0",
        "graceful-fs": "^4.2.9",
        "picomatch": "^2.2.3"
      },
      "engines": {
        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
      }
    },
    "node_modules/jest-util/node_modules/ci-info": {
      "version": "3.9.0",
      "resolved": "https://registry.npmjs.org/ci-info/-/ci-info-3.9.0.tgz",
      "integrity": "sha512-NIxF55hv4nSqQswkAeiOi1r83xy8JldOFDTWiug55KBu9Jnblncd2U6ViHmYgHf01TPZS77NJBhBMKdWj9HQMQ==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/sibiraj-s"
        }
      ],
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/jest-validate": {
      "version": "29.7.0",
      "resolved": "https://registry.npmjs.org/jest-validate/-/jest-validate-29.7.0.tgz",
      "integrity": "sha512-ZB7wHqaRGVw/9hST/OuFUReG7M8vKeq0/J2egIGLdvjHCmYqGARhzXmtgi+gVeZ5uXFF219aOc3Ls2yLg27tkw==",
      "license": "MIT",
      "dependencies": {
        "@jest/types": "^29.6.3",
        "camelcase": "^6.2.0",
        "chalk": "^4.0.0",
        "jest-get-type": "^29.6.3",
        "leven": "^3.1.0",
        "pretty-format": "^29.7.0"
      },
      "engines": {
        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
      }
    },
    "node_modules/jest-worker": {
      "version": "29.7.0",
      "resolved": "https://registry.npmjs.org/jest-worker/-/jest-worker-29.7.0.tgz",
      "integrity": "sha512-eIz2msL/EzL9UFTFFx7jBTkeZfku0yUAyZZZmJ93H2TYEiroIx2PQjEXcwYtYl8zXCxb+PAmA2hLIt/6ZEkPHw==",
      "license": "MIT",
      "dependencies": {
        "@types/node": "*",
        "jest-util": "^29.7.0",
        "merge-stream": "^2.0.0",
        "supports-color": "^8.0.0"
      },
      "engines": {
        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
      }
    },
    "node_modules/jest-worker/node_modules/supports-color": {
      "version": "8.1.1",
      "resolved": "https://registry.npmjs.org/supports-color/-/supports-color-8.1.1.tgz",
      "integrity": "sha512-MpUEN2OodtUzxvKQl72cUF7RQ5EiHsGvSsVG0ia9c5RbWGL2CI4C7EpPS8UTBIplnlzZiNuV56w+FuNxy3ty2Q==",
      "license": "MIT",
      "dependencies": {
        "has-flag": "^4.0.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/chalk/supports-color?sponsor=1"
      }
    },
    "node_modules/jimp-compact": {
      "version": "0.16.1",
      "resolved": "https://registry.npmjs.org/jimp-compact/-/jimp-compact-0.16.1.tgz",
      "integrity": "sha512-dZ6Ra7u1G8c4Letq/B5EzAxj4tLFHL+cGtdpR+PVm4yzPDj+lCk+AbivWt1eOM+ikzkowtyV7qSqX6qr3t71Ww==",
      "license": "MIT"
    },
    "node_modules/js-tokens": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/js-tokens/-/js-tokens-4.0.0.tgz",
      "integrity": "sha512-RdJUflcE3cUzKiMqQgsCu06FPu9UdIJO0beYbPhHN4k6apgJtifcoCtT9bcxOpYBtpD2kCM6Sbzg4CausW/PKQ==",
      "license": "MIT"
    },
    "node_modules/jsc-safe-url": {
      "version": "0.2.4",
      "resolved": "https://registry.npmjs.org/jsc-safe-url/-/jsc-safe-url-0.2.4.tgz",
      "integrity": "sha512-0wM3YBWtYePOjfyXQH5MWQ8H7sdk5EXSwZvmSLKk2RboVQ2Bu239jycHDz5J/8Blf3K0Qnoy2b6xD+z10MFB+Q==",
      "license": "0BSD"
    },
    "node_modules/jsesc": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/jsesc/-/jsesc-3.1.0.tgz",
      "integrity": "sha512-/sM3dO2FOzXjKQhJuo0Q173wf2KOo8t4I8vHy6lF9poUp7bKT0/NHE8fPX23PwfhnykfqnC2xRxOnVw5XuGIaA==",
      "license": "MIT",
      "bin": {
        "jsesc": "bin/jsesc"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/json5": {
      "version": "2.2.3",
      "resolved": "https://registry.npmjs.org/json5/-/json5-2.2.3.tgz",
      "integrity": "sha512-XmOWe7eyHYH14cLdVPoyg+GOH3rYX++KpzrylJwSW98t3Nk+U8XOl8FWKOgwtzdb8lXGf6zYwDUzeHMWfxasyg==",
      "license": "MIT",
      "bin": {
        "json5": "lib/cli.js"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/kleur": {
      "version": "3.0.3",
      "resolved": "https://registry.npmjs.org/kleur/-/kleur-3.0.3.tgz",
      "integrity": "sha512-eTIzlVOSUR+JxdDFepEYcBMtZ9Qqdef+rnzWdRZuMbOywu5tO2w2N7rqjoANZ5k9vywhL6Br1VRjUIgTQx4E8w==",
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/lan-network": {
      "version": "0.2.1",
      "resolved": "https://registry.npmjs.org/lan-network/-/lan-network-0.2.1.tgz",
      "integrity": "sha512-ONPnazC96VKDntab9j9JKwIWhZ4ZUceB4A9Epu4Ssg0hYFmtHZSeQ+n15nIwTFmcBUKtExOer8WTJ4GF9MO64A==",
      "license": "MIT",
      "bin": {
        "lan-network": "dist/lan-network-cli.js"
      }
    },
    "node_modules/leven": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/leven/-/leven-3.1.0.tgz",
      "integrity": "sha512-qsda+H8jTaUaN/x5vzW2rzc+8Rw4TAQ/4KjB46IwK5VH+IlVeeeje/EoZRpiXvIqjFgK84QffqPztGI3VBLG1A==",
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/lighthouse-logger": {
      "version": "1.4.2",
      "resolved": "https://registry.npmjs.org/lighthouse-logger/-/lighthouse-logger-1.4.2.tgz",
      "integrity": "sha512-gPWxznF6TKmUHrOQjlVo2UbaL2EJ71mb2CCeRs/2qBpi4L/g4LUVc9+3lKQ6DTUZwJswfM7ainGrLO1+fOqa2g==",
      "license": "Apache-2.0",
      "dependencies": {
        "debug": "^2.6.9",
        "marky": "^1.2.2"
      }
    },
    "node_modules/lighthouse-logger/node_modules/debug": {
      "version": "2.6.9",
      "resolved": "https://registry.npmjs.org/debug/-/debug-2.6.9.tgz",
      "integrity": "sha512-bC7ElrdJaJnPbAP+1EotYvqZsb3ecl5wi6Bfi6BJTUcNowp6cvspg0jXznRTKDjm/E7AdgFBVeAPVMNcKGsHMA==",
      "license": "MIT",
      "dependencies": {
        "ms": "2.0.0"
      }
    },
    "node_modules/lighthouse-logger/node_modules/ms": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.0.0.tgz",
      "integrity": "sha512-Tpp60P6IUJDTuOq/5Z8cdskzJujfwqfOTkrwIwj7IRISpnkJnT6SyJ4PCPnGMoFjC9ddhal5KVIYtAt97ix05A==",
      "license": "MIT"
    },
    "node_modules/lightningcss": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss/-/lightningcss-1.33.0.tgz",
      "integrity": "sha512-WkUDrojuJs0xkgGf2udWxa3yGBRxPtxUkB79i6aCZLRgc7PM8fZe9TosfPDcvEpQZbuFASnHYmRLBLUbmLOIIA==",
      "license": "MPL-2.0",
      "dependencies": {
        "detect-libc": "^2.0.3"
      },
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      },
      "optionalDependencies": {
        "lightningcss-android-arm64": "1.33.0",
        "lightningcss-darwin-arm64": "1.33.0",
        "lightningcss-darwin-x64": "1.33.0",
        "lightningcss-freebsd-x64": "1.33.0",
        "lightningcss-linux-arm-gnueabihf": "1.33.0",
        "lightningcss-linux-arm64-gnu": "1.33.0",
        "lightningcss-linux-arm64-musl": "1.33.0",
        "lightningcss-linux-x64-gnu": "1.33.0",
        "lightningcss-linux-x64-musl": "1.33.0",
        "lightningcss-win32-arm64-msvc": "1.33.0",
        "lightningcss-win32-x64-msvc": "1.33.0"
      }
    },
    "node_modules/lightningcss-android-arm64": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-android-arm64/-/lightningcss-android-arm64-1.33.0.tgz",
      "integrity": "sha512-gEpRTalKdosp4Bb8qWtc2iOgE5SeIHlpS1up9bFq2wAyYhl1UdTObYiHe98zEM9SQvSoqQZ1IQD0JNpg3Ml5pg==",
      "cpu": [
        "arm64"
      ],
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-darwin-arm64": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-darwin-arm64/-/lightningcss-darwin-arm64-1.33.0.tgz",
      "integrity": "sha512-Sciaz8eenNTKn9b3t7+xr0ipTp9YxKQY4npwQ3mrRuL0BAVHBLyZxofhaKBAVtzmtRZ/zTyo0/to4B1uWG/Djg==",
      "cpu": [
        "arm64"
      ],
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-darwin-x64": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-darwin-x64/-/lightningcss-darwin-x64-1.33.0.tgz",
      "integrity": "sha512-Z5UPAxzrjlWNNyGy6i65cJzzvgJ5D3T6wMvs+gWpY9d7qRhANrxqAp6LhxIgZhWEw18RfJTGcRxjuLIBr+m8XQ==",
      "cpu": [
        "x64"
      ],
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-freebsd-x64": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-freebsd-x64/-/lightningcss-freebsd-x64-1.33.0.tgz",
      "integrity": "sha512-QQM/Ti/hQajJwCY+RiWuCZ9sdtI/XQk7nDK5vC8kkdwixezOlDgvDx7+RT+QjK6FcFT4MpsuoBnHIo/O3StRRg==",
      "cpu": [
        "x64"
      ],
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-arm-gnueabihf": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-arm-gnueabihf/-/lightningcss-linux-arm-gnueabihf-1.33.0.tgz",
      "integrity": "sha512-N7FVBe6iS24MlM6R/4RBTxGhQheZGs7tiQ9U32UtF75NzP5Q7xWPRqLBCKxlRQRk3rY1jCIPLzx7WzOhuUIRLQ==",
      "cpu": [
        "arm"
      ],
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-arm64-gnu": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-arm64-gnu/-/lightningcss-linux-arm64-gnu-1.33.0.tgz",
      "integrity": "sha512-j2v/itmy4HlNxlc6voKXYgBqNi0Ng2LShg4z7GufpEgs05P+2suBVyi9I6YHq5uoVFx9ETin3eCEhLVyXGQnKg==",
      "cpu": [
        "arm64"
      ],
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-arm64-musl": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-arm64-musl/-/lightningcss-linux-arm64-musl-1.33.0.tgz",
      "integrity": "sha512-yiO5ROMuYQgXbC60yjZU5CYSFZGKXL0HFATXt9mHJn1+zW55oCtMI9NfcVhYLMFDL7gV7oBPon/EmMMGg2OvtQ==",
      "cpu": [
        "arm64"
      ],
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-x64-gnu": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-x64-gnu/-/lightningcss-linux-x64-gnu-1.33.0.tgz",
      "integrity": "sha512-ar+Ju7LmcN0Jo4FpL4hpFybwNG9/3A/Br5KW2n2jyODg3MEZXaDYADdemoNS+BDNfMgKvylJLj4S5tyRActuAg==",
      "cpu": [
        "x64"
      ],
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-x64-musl": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-x64-musl/-/lightningcss-linux-x64-musl-1.33.0.tgz",
      "integrity": "sha512-RYiYbkokw0trfKqqzfF55lginwEPrD3OJDfTuJzFs1MK6iFnDenaz1fqLLtX4ITG3OktJQXOeTaw1awrBAlZPw==",
      "cpu": [
        "x64"
      ],
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-win32-arm64-msvc": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-win32-arm64-msvc/-/lightningcss-win32-arm64-msvc-1.33.0.tgz",
      "integrity": "sha512-1K+MPfLSFVpphzpdbfkhlWk6wBrTObBzS2T6db10PNOZgR9GoVsAWzwNyuhUYYbTp23j+4RrncfujZ4uAzXvwA==",
      "cpu": [
        "arm64"
      ],
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-win32-x64-msvc": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-win32-x64-msvc/-/lightningcss-win32-x64-msvc-1.33.0.tgz",
      "integrity": "sha512-OlEICDx/Xl0FqSp4bry8zFnCvGpig3Gl4gCquvYwHuqJKEC1+n9NgDniFvqHGmMv1ZkqDJrDqKKSykTDX+ehuA==",
      "cpu": [
        "x64"
      ],
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lodash.debounce": {
      "version": "4.0.8",
      "resolved": "https://registry.npmjs.org/lodash.debounce/-/lodash.debounce-4.0.8.tgz",
      "integrity": "sha512-FT1yDzDYEoYWhnSGnpE/4Kj1fLZkDFyqRb7fNt6FdYOSxlUWAtp42Eh6Wb0rGIv/m9Bgo7x4GhQbm5Ys4SG5ow==",
      "license": "MIT"
    },
    "node_modules/lodash.throttle": {
      "version": "4.1.1",
      "resolved": "https://registry.npmjs.org/lodash.throttle/-/lodash.throttle-4.1.1.tgz",
      "integrity": "sha512-wIkUCfVKpVsWo3JSZlc+8MB5it+2AN5W8J7YVMST30UrvcQNZ1Okbj+rbVniijTWE6FGYy4XJq/rHkas8qJMLQ==",
      "license": "MIT"
    },
    "node_modules/log-symbols": {
      "version": "2.2.0",
      "resolved": "https://registry.npmjs.org/log-symbols/-/log-symbols-2.2.0.tgz",
      "integrity": "sha512-VeIAFslyIerEJLXHziedo2basKbMKtTw3vfn5IzG0XTjhAVEJyNHnL2p7vc+wBDSdQuUpNw3M2u6xb9QsAY5Eg==",
      "license": "MIT",
      "dependencies": {
        "chalk": "^2.0.1"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/log-symbols/node_modules/ansi-styles": {
      "version": "3.2.1",
      "resolved": "https://registry.npmjs.org/ansi-styles/-/ansi-styles-3.2.1.tgz",
      "integrity": "sha512-VT0ZI6kZRdTh8YyJw3SMbYm/u+NqfsAxEpWO0Pf9sq8/e94WxxOpPKx9FR1FlyCtOVDNOQ+8ntlqFxiRc+r5qA==",
      "license": "MIT",
      "dependencies": {
        "color-convert": "^1.9.0"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/log-symbols/node_modules/chalk": {
      "version": "2.4.2",
      "resolved": "https://registry.npmjs.org/chalk/-/chalk-2.4.2.tgz",
      "integrity": "sha512-Mti+f9lpJNcwF4tWV8/OrTTtF1gZi+f8FqlyAdouralcFWFQWF2+NgCHShjkCb+IFBLq9buZwE1xckQU4peSuQ==",
      "license": "MIT",
      "dependencies": {
        "ansi-styles": "^3.2.1",
        "escape-string-regexp": "^1.0.5",
        "supports-color": "^5.3.0"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/log-symbols/node_modules/color-convert": {
      "version": "1.9.3",
      "resolved": "https://registry.npmjs.org/color-convert/-/color-convert-1.9.3.tgz",
      "integrity": "sha512-QfAUtd+vFdAtFQcC8CCyYt1fYWxSqAiK2cSD6zDB8N3cpsEBAvRxp9zOGg6G/SHHJYAT88/az/IuDGALsNVbGg==",
      "license": "MIT",
      "dependencies": {
        "color-name": "1.1.3"
      }
    },
    "node_modules/log-symbols/node_modules/color-name": {
      "version": "1.1.3",
      "resolved": "https://registry.npmjs.org/color-name/-/color-name-1.1.3.tgz",
      "integrity": "sha512-72fSenhMw2HZMTVHeCA9KCmpEIbzWiQsjN+BHcBbS9vr1mtt+vJjPdksIBNUmKAW8TFUDPJK5SUU3QhE9NEXDw==",
      "license": "MIT"
    },
    "node_modules/log-symbols/node_modules/escape-string-regexp": {
      "version": "1.0.5",
      "resolved": "https://registry.npmjs.org/escape-string-regexp/-/escape-string-regexp-1.0.5.tgz",
      "integrity": "sha512-vbRorB5FUQWvla16U8R/qgaFIya2qGzwDrNmCZuYKrbdSUMG6I1ZCGQRefkRVhuOkIGVne7BQ35DSfo1qvJqFg==",
      "license": "MIT",
      "engines": {
        "node": ">=0.8.0"
      }
    },
    "node_modules/log-symbols/node_modules/has-flag": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/has-flag/-/has-flag-3.0.0.tgz",
      "integrity": "sha512-sKJf1+ceQBr4SMkvQnBDNDtf4TXpVhVGateu0t918bl30FnbE2m4vNLX+VWe/dpjlb+HugGYzW7uQXH98HPEYw==",
      "license": "MIT",
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/log-symbols/node_modules/supports-color": {
      "version": "5.5.0",
      "resolved": "https://registry.npmjs.org/supports-color/-/supports-color-5.5.0.tgz",
      "integrity": "sha512-QjVjwdXIt408MIiAqCX4oUKsgU2EqAGzs2Ppkm4aQYbjm+ZEWEcW4SfFNTr4uMNZma0ey4f5lgLrkB0aX0QMow==",
      "license": "MIT",
      "dependencies": {
        "has-flag": "^3.0.0"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/loose-envify": {
      "version": "1.4.0",
      "resolved": "https://registry.npmjs.org/loose-envify/-/loose-envify-1.4.0.tgz",
      "integrity": "sha512-lyuxPGr/Wfhrlem2CL/UcnUc1zcqKAImBDzukY7Y5F/yQiNdko6+fRLevlw1HgMySw7f611UIY408EtxRSoK3Q==",
      "license": "MIT",
      "dependencies": {
        "js-tokens": "^3.0.0 || ^4.0.0"
      },
      "bin": {
        "loose-envify": "cli.js"
      }
    },
    "node_modules/lru-cache": {
      "version": "5.1.1",
      "resolved": "https://registry.npmjs.org/lru-cache/-/lru-cache-5.1.1.tgz",
      "integrity": "sha512-KpNARQA3Iwv+jTA0utUVVbrh+Jlrr1Fv0e56GGzAFOXN7dk/FviaDW8LHmK52DlcH4WP2n6gI8vN1aesBFgo9w==",
      "license": "ISC",
      "dependencies": {
        "yallist": "^3.0.2"
      }
    },
    "node_modules/makeerror": {
      "version": "1.0.12",
      "resolved": "https://registry.npmjs.org/makeerror/-/makeerror-1.0.12.tgz",
      "integrity": "sha512-JmqCvUhmt43madlpFzG4BQzG2Z3m6tvQDNKdClZnO3VbIudJYmxsT0FNJMeiB2+JTSlTQTSbU8QdesVmwJcmLg==",
      "license": "BSD-3-Clause",
      "dependencies": {
        "tmpl": "1.0.5"
      }
    },
    "node_modules/marky": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/marky/-/marky-1.3.0.tgz",
      "integrity": "sha512-ocnPZQLNpvbedwTy9kNrQEsknEfgvcLMvOtz3sFeWApDq1MXH1TqkCIx58xlpESsfwQOnuBO9beyQuNGzVvuhQ==",
      "license": "Apache-2.0"
    },
    "node_modules/mdn-data": {
      "version": "2.0.14",
      "resolved": "https://registry.npmjs.org/mdn-data/-/mdn-data-2.0.14.tgz",
      "integrity": "sha512-dn6wd0uw5GsdswPFfsgMp5NSB0/aDe6fK94YJV/AJDYXL6HVLWBsxeq7js7Ad+mU2K9LAlwpk6kN2D5mwCPVow==",
      "license": "CC0-1.0"
    },
    "node_modules/memoize-one": {
      "version": "5.2.1",
      "resolved": "https://registry.npmjs.org/memoize-one/-/memoize-one-5.2.1.tgz",
      "integrity": "sha512-zYiwtZUcYyXKo/np96AGZAckk+FWWsUdJ3cHGGmld7+AhvcWmQyGCYUh1hc4Q/pkOhb65dQR/pqCyK0cOaHz4Q==",
      "license": "MIT"
    },
    "node_modules/merge-options": {
      "version": "3.0.4",
      "resolved": "https://registry.npmjs.org/merge-options/-/merge-options-3.0.4.tgz",
      "integrity": "sha512-2Sug1+knBjkaMsMgf1ctR1Ujx+Ayku4EdJN4Z+C2+JzoeF7A3OZ9KM2GY0CpQS51NR61LTurMJrRKPhSs3ZRTQ==",
      "license": "MIT",
      "dependencies": {
        "is-plain-obj": "^2.1.0"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/merge-stream": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/merge-stream/-/merge-stream-2.0.0.tgz",
      "integrity": "sha512-abv/qOcuPfk3URPfDzmZU1LKmuw8kT+0nIHvKrKgFrwifol/doWcdA4ZqsWQ8ENrFKkd67Mfpo/LovbIUsbt3w==",
      "license": "MIT"
    },
    "node_modules/metro": {
      "version": "0.84.6",
      "resolved": "https://registry.npmjs.org/metro/-/metro-0.84.6.tgz",
      "integrity": "sha512-ty/tx/imE5Ph2gvPU788Ckim6RAC2tyZxLz2hWRgC9U7/fGKV7qY/slADy0qHPEw9cpUgc4BfmV3oUsYwm7oeg==",
      "license": "MIT",
      "dependencies": {
        "@babel/code-frame": "^7.29.0",
        "@babel/core": "^7.25.2",
        "@babel/generator": "^7.29.1",
        "@babel/parser": "^7.29.0",
        "@babel/template": "^7.28.6",
        "@babel/traverse": "^7.29.0",
        "@babel/types": "^7.29.0",
        "accepts": "^2.0.0",
        "ci-info": "^2.0.0",
        "connect": "^3.6.5",
        "debug": "^4.4.0",
        "error-stack-parser": "^2.0.6",
        "flow-enums-runtime": "^0.0.6",
        "graceful-fs": "^4.2.4",
        "hermes-parser": "0.35.0",
        "invariant": "^2.2.4",
        "jest-worker": "^29.7.0",
        "jsc-safe-url": "^0.2.2",
        "lodash.throttle": "^4.1.1",
        "metro-babel-transformer": "0.84.6",
        "metro-cache": "0.84.6",
        "metro-cache-key": "0.84.6",
        "metro-config": "0.84.6",
        "metro-core": "0.84.6",
        "metro-file-map": "0.84.6",
        "metro-resolver": "0.84.6",
        "metro-runtime": "0.84.6",
        "metro-source-map": "0.84.6",
        "metro-symbolicate": "0.84.6",
        "metro-transform-plugins": "0.84.6",
        "metro-transform-worker": "0.84.6",
        "mime-types": "^3.0.1",
        "nullthrows": "^1.1.1",
        "serialize-error": "^2.1.0",
        "source-map": "^0.5.6",
        "throat": "^5.0.0",
        "ws": "^7.5.10",
        "yargs": "^17.6.2"
      },
      "bin": {
        "metro": "src/cli.js"
      },
      "engines": {
        "node": "^20.19.4 || ^22.13.0 || ^24.3.0 || >= 25.0.0"
      }
    },
    "node_modules/metro-babel-transformer": {
      "version": "0.84.6",
      "resolved": "https://registry.npmjs.org/metro-babel-transformer/-/metro-babel-transformer-0.84.6.tgz",
      "integrity": "sha512-B1ozl6KxFHbQjXZ2U8WiTPWXylqiD3V4EXyV5r0fqETOrqIrJlBvbVTD82UxIN+B3Vpe4l8G1tb15ocd2RyOQA==",
      "license": "MIT",
      "dependencies": {
        "@babel/core": "^7.25.2",
        "flow-enums-runtime": "^0.0.6",
        "hermes-parser": "0.35.0",
        "metro-cache-key": "0.84.6",
        "nullthrows": "^1.1.1"
      },
      "engines": {
        "node": "^20.19.4 || ^22.13.0 || ^24.3.0 || >= 25.0.0"
      }
    },
    "node_modules/metro-babel-transformer/node_modules/hermes-estree": {
      "version": "0.35.0",
      "resolved": "https://registry.npmjs.org/hermes-estree/-/hermes-estree-0.35.0.tgz",
      "integrity": "sha512-xVx5Opwy8Oo1I5yGpVRhCvWL/iV3M+ylksSKVNlxxD90cpDpR/AR1jLYqK8HWihm065a6UI3HeyAmYzwS8NOOg==",
      "license": "MIT"
    },
    "node_modules/metro-babel-transformer/node_modules/hermes-parser": {
      "version": "0.35.0",
      "resolved": "https://registry.npmjs.org/hermes-parser/-/hermes-parser-0.35.0.tgz",
      "integrity": "sha512-9JLjeHxBx8T4CAsydZR49PNZUaix+WpQJwu9p2010lu+7Kwl6D/7wYFFJxoz+aXkaaClp9Zfg6W6/zVlSJORaA==",
      "license": "MIT",
      "dependencies": {
        "hermes-estree": "0.35.0"
      }
    },
    "node_modules/metro-cache": {
      "version": "0.84.6",
      "resolved": "https://registry.npmjs.org/metro-cache/-/metro-cache-0.84.6.tgz",
      "integrity": "sha512-KBJVpb02oKNO+jlWQ1Aax7cd11YP0MClDaMgx6C4MhyZ9g95J/dC1Bo6sCzXaU9L9h/w5cQfT5zDkGW5sOj99A==",
      "license": "MIT",
      "dependencies": {
        "exponential-backoff": "^3.1.1",
        "flow-enums-runtime": "^0.0.6",
        "https-proxy-agent": "^7.0.5",
        "metro-core": "0.84.6"
      },
      "engines": {
        "node": "^20.19.4 || ^22.13.0 || ^24.3.0 || >= 25.0.0"
      }
    },
    "node_modules/metro-cache-key": {
      "version": "0.84.6",
      "resolved": "https://registry.npmjs.org/metro-cache-key/-/metro-cache-key-0.84.6.tgz",
      "integrity": "sha512-6tyXt1BZ/3U183XV48oif7Nm65TE+pTo0Vs31u4FxMgqiYQR/SiSr3RoXn3pmy4pd280ZmLmct0x3jZpu0pV4A==",
      "license": "MIT",
      "dependencies": {
        "flow-enums-runtime": "^0.0.6"
      },
      "engines": {
        "node": "^20.19.4 || ^22.13.0 || ^24.3.0 || >= 25.0.0"
      }
    },
    "node_modules/metro-config": {
      "version": "0.84.6",
      "resolved": "https://registry.npmjs.org/metro-config/-/metro-config-0.84.6.tgz",
      "integrity": "sha512-cD2mLEofcuV26kxSV4hfV1Pbuh6igdUhYQriO8ZVeJ7HyZfq4/wqHV0gSR7fEO8NUp9odr60/Kzm5YakmghWwQ==",
      "license": "MIT",
      "dependencies": {
        "connect": "^3.6.5",
        "flow-enums-runtime": "^0.0.6",
        "jest-validate": "^29.7.0",
        "metro": "0.84.6",
        "metro-cache": "0.84.6",
        "metro-core": "0.84.6",
        "metro-runtime": "0.84.6",
        "yaml": "^2.6.1"
      },
      "engines": {
        "node": "^20.19.4 || ^22.13.0 || ^24.3.0 || >= 25.0.0"
      }
    },
    "node_modules/metro-core": {
      "version": "0.84.6",
      "resolved": "https://registry.npmjs.org/metro-core/-/metro-core-0.84.6.tgz",
      "integrity": "sha512-ZqYskM8+f3PFMosBDJd8DLqRvT1ltRGhWL/ZfTpBvf4SoadO30VVrdhAoHFVGz3G1CJpWa3fgZH7nnnX/ybllA==",
      "license": "MIT",
      "dependencies": {
        "flow-enums-runtime": "^0.0.6",
        "lodash.throttle": "^4.1.1",
        "metro-resolver": "0.84.6"
      },
      "engines": {
        "node": "^20.19.4 || ^22.13.0 || ^24.3.0 || >= 25.0.0"
      }
    },
    "node_modules/metro-file-map": {
      "version": "0.84.6",
      "resolved": "https://registry.npmjs.org/metro-file-map/-/metro-file-map-0.84.6.tgz",
      "integrity": "sha512-ov9VywWBsHPt54Zc7/DxWvqjTwxuZvhfeyHg8ZAMGKtf2PcH1wS3EnoBH7In53Rspk/eXVWAO5+avxunPn081w==",
      "license": "MIT",
      "dependencies": {
        "debug": "^4.4.0",
        "fb-watchman": "^2.0.0",
        "flow-enums-runtime": "^0.0.6",
        "graceful-fs": "^4.2.4",
        "invariant": "^2.2.4",
        "jest-worker": "^29.7.0",
        "micromatch": "^4.0.4",
        "nullthrows": "^1.1.1",
        "walker": "^1.0.7"
      },
      "engines": {
        "node": "^20.19.4 || ^22.13.0 || ^24.3.0 || >= 25.0.0"
      }
    },
    "node_modules/metro-minify-terser": {
      "version": "0.84.6",
      "resolved": "https://registry.npmjs.org/metro-minify-terser/-/metro-minify-terser-0.84.6.tgz",
      "integrity": "sha512-SqhB/Kxrw0XfyW0k8mEscqX/CQopm6Fp3EpdSIPzvKfGgQp9bTMahg9PAdVsXUmIWwErbmFw1VqB+VFBOKksUw==",
      "license": "MIT",
      "dependencies": {
        "flow-enums-runtime": "^0.0.6",
        "terser": "^5.15.0"
      },
      "engines": {
        "node": "^20.19.4 || ^22.13.0 || ^24.3.0 || >= 25.0.0"
      }
    },
    "node_modules/metro-resolver": {
      "version": "0.84.6",
      "resolved": "https://registry.npmjs.org/metro-resolver/-/metro-resolver-0.84.6.tgz",
      "integrity": "sha512-PplpGc/OCLxgKeLNsLQO/VHsYDIvkcGGr3zNT7UanHCGRqhxKv245o+naV8cRI4/pcLqyc+9j+J0AJbT3Kp5Sg==",
      "license": "MIT",
      "dependencies": {
        "flow-enums-runtime": "^0.0.6"
      },
      "engines": {
        "node": "^20.19.4 || ^22.13.0 || ^24.3.0 || >= 25.0.0"
      }
    },
    "node_modules/metro-runtime": {
      "version": "0.84.6",
      "resolved": "https://registry.npmjs.org/metro-runtime/-/metro-runtime-0.84.6.tgz",
      "integrity": "sha512-47EYO/DOai0PA3GoAyDpyXOgHNMwbl/Z9dQlQineDLHkpD42xOwMrIx1crT0+n6F+aGoEyxZmeFwfMzaIqVqKQ==",
      "license": "MIT",
      "dependencies": {
        "@babel/runtime": "^7.25.0",
        "flow-enums-runtime": "^0.0.6"
      },
      "engines": {
        "node": "^20.19.4 || ^22.13.0 || ^24.3.0 || >= 25.0.0"
      }
    },
    "node_modules/metro-source-map": {
      "version": "0.84.6",
      "resolved": "https://registry.npmjs.org/metro-source-map/-/metro-source-map-0.84.6.tgz",
      "integrity": "sha512-4p/EplRbgNxhdqA6kAj1AmIq9qqYXYSAjgxuZ73rYA+p037xDDrxK8CyDKNfbn1k6aMuVt8LV0fpt7NHUTKiZw==",
      "license": "MIT",
      "dependencies": {
        "@babel/traverse": "^7.29.0",
        "@babel/types": "^7.29.0",
        "flow-enums-runtime": "^0.0.6",
        "invariant": "^2.2.4",
        "metro-symbolicate": "0.84.6",
        "nullthrows": "^1.1.1",
        "ob1": "0.84.6",
        "source-map": "^0.5.6",
        "vlq": "^1.0.0"
      },
      "engines": {
        "node": "^20.19.4 || ^22.13.0 || ^24.3.0 || >= 25.0.0"
      }
    },
    "node_modules/metro-symbolicate": {
      "version": "0.84.6",
      "resolved": "https://registry.npmjs.org/metro-symbolicate/-/metro-symbolicate-0.84.6.tgz",
      "integrity": "sha512-wJFyyF5ysbVyoYVWGL6GwVMiNnGllwDU2gF096376fl0fc8IFUlADSyNlswj31K9og2sOilXe/FdyWFPczPUYg==",
      "license": "MIT",
      "dependencies": {
        "flow-enums-runtime": "^0.0.6",
        "invariant": "^2.2.4",
        "metro-source-map": "0.84.6",
        "nullthrows": "^1.1.1",
        "source-map": "^0.5.6",
        "vlq": "^1.0.0"
      },
      "bin": {
        "metro-symbolicate": "src/index.js"
      },
      "engines": {
        "node": "^20.19.4 || ^22.13.0 || ^24.3.0 || >= 25.0.0"
      }
    },
    "node_modules/metro-transform-plugins": {
      "version": "0.84.6",
      "resolved": "https://registry.npmjs.org/metro-transform-plugins/-/metro-transform-plugins-0.84.6.tgz",
      "integrity": "sha512-pROPMFaj25Y9+3LlLqpBRz/7B/2YPnfEQz/z3juYxkh3FGQ+3c/Qh4E+khPSTdwTw0M6LitLYHMqaHMbQmuBJw==",
      "license": "MIT",
      "dependencies": {
        "@babel/core": "^7.25.2",
        "@babel/generator": "^7.29.1",
        "@babel/template": "^7.28.6",
        "@babel/traverse": "^7.29.0",
        "flow-enums-runtime": "^0.0.6",
        "nullthrows": "^1.1.1"
      },
      "engines": {
        "node": "^20.19.4 || ^22.13.0 || ^24.3.0 || >= 25.0.0"
      }
    },
    "node_modules/metro-transform-worker": {
      "version": "0.84.6",
      "resolved": "https://registry.npmjs.org/metro-transform-worker/-/metro-transform-worker-0.84.6.tgz",
      "integrity": "sha512-xLTVrOENaHR9DiuhnHS+zcle0rKsCy2CpXSIx7xD+zhJs+qVRNUyV7Z1zIt/0P/d0cSGVx846R+dIjHEudhcww==",
      "license": "MIT",
      "dependencies": {
        "@babel/core": "^7.25.2",
        "@babel/generator": "^7.29.1",
        "@babel/parser": "^7.29.0",
        "@babel/types": "^7.29.0",
        "flow-enums-runtime": "^0.0.6",
        "metro": "0.84.6",
        "metro-babel-transformer": "0.84.6",
        "metro-cache": "0.84.6",
        "metro-cache-key": "0.84.6",
        "metro-minify-terser": "0.84.6",
        "metro-source-map": "0.84.6",
        "metro-transform-plugins": "0.84.6",
        "nullthrows": "^1.1.1"
      },
      "engines": {
        "node": "^20.19.4 || ^22.13.0 || ^24.3.0 || >= 25.0.0"
      }
    },
    "node_modules/metro/node_modules/accepts": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/accepts/-/accepts-2.0.0.tgz",
      "integrity": "sha512-5cvg6CtKwfgdmVqY1WIiXKc3Q1bkRqGLi+2W/6ao+6Y7gu/RCwRuAhGEzh5B4KlszSuTLgZYuqFqo5bImjNKng==",
      "license": "MIT",
      "dependencies": {
        "mime-types": "^3.0.0",
        "negotiator": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/metro/node_modules/hermes-estree": {
      "version": "0.35.0",
      "resolved": "https://registry.npmjs.org/hermes-estree/-/hermes-estree-0.35.0.tgz",
      "integrity": "sha512-xVx5Opwy8Oo1I5yGpVRhCvWL/iV3M+ylksSKVNlxxD90cpDpR/AR1jLYqK8HWihm065a6UI3HeyAmYzwS8NOOg==",
      "license": "MIT"
    },
    "node_modules/metro/node_modules/hermes-parser": {
      "version": "0.35.0",
      "resolved": "https://registry.npmjs.org/hermes-parser/-/hermes-parser-0.35.0.tgz",
      "integrity": "sha512-9JLjeHxBx8T4CAsydZR49PNZUaix+WpQJwu9p2010lu+7Kwl6D/7wYFFJxoz+aXkaaClp9Zfg6W6/zVlSJORaA==",
      "license": "MIT",
      "dependencies": {
        "hermes-estree": "0.35.0"
      }
    },
    "node_modules/metro/node_modules/mime-db": {
      "version": "1.54.0",
      "resolved": "https://registry.npmjs.org/mime-db/-/mime-db-1.54.0.tgz",
      "integrity": "sha512-aU5EJuIN2WDemCcAp2vFBfp/m4EAhWJnUNSSw0ixs7/kXbd6Pg64EmwJkNdFhB8aWt1sH2CTXrLxo/iAGV3oPQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/metro/node_modules/mime-types": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/mime-types/-/mime-types-3.0.2.tgz",
      "integrity": "sha512-Lbgzdk0h4juoQ9fCKXW4by0UJqj+nOOrI9MJ1sSj4nI8aI2eo1qmvQEie4VD1glsS250n15LsWsYtCugiStS5A==",
      "license": "MIT",
      "dependencies": {
        "mime-db": "^1.54.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/metro/node_modules/negotiator": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/negotiator/-/negotiator-1.1.0.tgz",
      "integrity": "sha512-NMPBRMJgiQHjbd8phG3Vebdx4kZ1H121rbl5IkMqeOsahptB9BKo/d7oJ3zTXqTgagn2bWlNSXkh0QUGM31RYg==",
      "license": "MIT",
      "dependencies": {
        "content-type": "^2.1.0"
      },
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/micromatch": {
      "version": "4.0.8",
      "resolved": "https://registry.npmjs.org/micromatch/-/micromatch-4.0.8.tgz",
      "integrity": "sha512-PXwfBhYu0hBCPw8Dn0E+WDYb7af3dSLVWKi3HGv84IdF4TyFoC0ysxFd0Goxw7nSv4T/PzEJQxsYsEiFCKo2BA==",
      "license": "MIT",
      "dependencies": {
        "braces": "^3.0.3",
        "picomatch": "^2.3.1"
      },
      "engines": {
        "node": ">=8.6"
      }
    },
    "node_modules/mime": {
      "version": "1.6.0",
      "resolved": "https://registry.npmjs.org/mime/-/mime-1.6.0.tgz",
      "integrity": "sha512-x0Vn8spI+wuJ1O6S7gnbaQg8Pxh4NNHb7KSINmEWKiPE4RKOplvijn+NkmYmmRgP68mc70j2EbeTFRsrswaQeg==",
      "license": "MIT",
      "bin": {
        "mime": "cli.js"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/mime-db": {
      "version": "1.52.0",
      "resolved": "https://registry.npmjs.org/mime-db/-/mime-db-1.52.0.tgz",
      "integrity": "sha512-sPU4uV7dYlvtWJxwwxHD0PuihVNiE7TyAbQ5SWxDCB9mUYvOgroQOwYQQOKPJ8CIbE+1ETVlOoK1UC2nU3gYvg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/mime-types": {
      "version": "2.1.35",
      "resolved": "https://registry.npmjs.org/mime-types/-/mime-types-2.1.35.tgz",
      "integrity": "sha512-ZDY+bPm5zTTF+YpCrAU9nK0UgICYPT0QtT1NZWFv4s++TNkcgVaT0g6+4R2uI4MjQjzysHB1zxuWL50hzaeXiw==",
      "license": "MIT",
      "dependencies": {
        "mime-db": "1.52.0"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/mimic-fn": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/mimic-fn/-/mimic-fn-1.2.0.tgz",
      "integrity": "sha512-jf84uxzwiuiIVKiOLpfYk7N46TSy8ubTonmneY9vrpHNAnp0QBt2BxWV9dO3/j+BoVAb+a5G6YDPW3M5HOdMWQ==",
      "license": "MIT",
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/minimatch": {
      "version": "10.2.6",
      "resolved": "https://registry.npmjs.org/minimatch/-/minimatch-10.2.6.tgz",
      "integrity": "sha512-vpLQEs+VLCr1nU0BXS07maYoFwlDAH0gngQuuttxIwutDFEMHq2blX+8vpgxDdK3J1PwjCJiep77OitTZ4Ll1A==",
      "license": "BlueOak-1.0.0",
      "dependencies": {
        "brace-expansion": "^5.0.8"
      },
      "engines": {
        "node": "18 || 20 || >=22"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/minipass": {
      "version": "7.1.3",
      "resolved": "https://registry.npmjs.org/minipass/-/minipass-7.1.3.tgz",
      "integrity": "sha512-tEBHqDnIoM/1rXME1zgka9g6Q2lcoCkxHLuc7ODJ5BxbP5d4c2Z5cGgtXAku59200Cx7diuHTOYfSBD8n6mm8A==",
      "license": "BlueOak-1.0.0",
      "engines": {
        "node": ">=16 || 14 >=14.17"
      }
    },
    "node_modules/mkdirp": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/mkdirp/-/mkdirp-1.0.4.tgz",
      "integrity": "sha512-vVqVZQyf3WLx2Shd0qJ9xuvqgAyKPLAiqITEtqW0oIUjzo3PePDd6fW9iFz30ef7Ysp/oiWqbhszeGWW2T6Gzw==",
      "license": "MIT",
      "bin": {
        "mkdirp": "bin/cmd.js"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/ms": {
      "version": "2.1.3",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
      "license": "MIT"
    },
    "node_modules/multitars": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/multitars/-/multitars-1.0.2.tgz",
      "integrity": "sha512-6GwVw5eLi9sThdtlS4PKwC7yRLaf45pYhIEzKBHdKxi+YOXGKFX8acIniH+Uh/+k9mS2lQOupTccjoe5r0/1IQ==",
      "license": "MIT"
    },
    "node_modules/nanoid": {
      "version": "3.3.18",
      "resolved": "https://registry.npmjs.org/nanoid/-/nanoid-3.3.18.tgz",
      "integrity": "sha512-DTg4MJbGMWkfi6VZFdNt2/caMbQy4Ou+Op/hJQvGEWcnVfoA1QA+xzRKAzw9jD6+GVOOeYr/mIcuDSdug6F6+w==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "bin": {
        "nanoid": "bin/nanoid.cjs"
      },
      "engines": {
        "node": "^10 || ^12 || ^13.7 || ^14 || >=15.0.1"
      }
    },
    "node_modules/negotiator": {
      "version": "0.6.3",
      "resolved": "https://registry.npmjs.org/negotiator/-/negotiator-0.6.3.tgz",
      "integrity": "sha512-+EUsqGPLsM+j/zdChZjsnX51g4XrHFOIXwfnCVPGlQk/k5giakcKsuxCObBRu6DSm9opw/O6slWbJdghQM4bBg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/node-fetch": {
      "version": "2.7.0",
      "resolved": "https://registry.npmjs.org/node-fetch/-/node-fetch-2.7.0.tgz",
      "integrity": "sha512-c4FRfUm/dbcWZ7U+1Wq0AwCyFL+3nt2bEw05wfxSz+DWpWsitgmSgYmy2dQdWyKC1694ELPqMs/YzUSNozLt8A==",
      "license": "MIT",
      "dependencies": {
        "whatwg-url": "^5.0.0"
      },
      "engines": {
        "node": "4.x || >=6.0.0"
      },
      "peerDependencies": {
        "encoding": "^0.1.0"
      },
      "peerDependenciesMeta": {
        "encoding": {
          "optional": true
        }
      }
    },
    "node_modules/node-forge": {
      "version": "1.4.0",
      "resolved": "https://registry.npmjs.org/node-forge/-/node-forge-1.4.0.tgz",
      "integrity": "sha512-LarFH0+6VfriEhqMMcLX2F7SwSXeWwnEAJEsYm5QKWchiVYVvJyV9v7UDvUv+w5HO23ZpQTXDv/GxdDdMyOuoQ==",
      "license": "(BSD-3-Clause OR GPL-2.0)",
      "engines": {
        "node": ">= 6.13.0"
      }
    },
    "node_modules/node-int64": {
      "version": "0.4.0",
      "resolved": "https://registry.npmjs.org/node-int64/-/node-int64-0.4.0.tgz",
      "integrity": "sha512-O5lz91xSOeoXP6DulyHfllpq+Eg00MWitZIbtPfoSEvqIHdl5gfcY6hYzDWnj0qD5tz52PI08u9qUvSVeUBeHw==",
      "license": "MIT"
    },
    "node_modules/node-releases": {
      "version": "2.0.53",
      "resolved": "https://registry.npmjs.org/node-releases/-/node-releases-2.0.53.tgz",
      "integrity": "sha512-D9UOmYG3UH1V+ENW56t5QXBwJw1YEY18ruVeus89Rw+SyIgjPkCO84bRzO3uNIYosJbNwiabWVn48o3uJLjxFQ==",
      "license": "MIT",
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/npm-package-arg": {
      "version": "11.0.3",
      "resolved": "https://registry.npmjs.org/npm-package-arg/-/npm-package-arg-11.0.3.tgz",
      "integrity": "sha512-sHGJy8sOC1YraBywpzQlIKBE4pBbGbiF95U6Auspzyem956E0+FtDtsx1ZxlOJkQCZ1AFXAY/yuvtFYrOxF+Bw==",
      "license": "ISC",
      "dependencies": {
        "hosted-git-info": "^7.0.0",
        "proc-log": "^4.0.0",
        "semver": "^7.3.5",
        "validate-npm-package-name": "^5.0.0"
      },
      "engines": {
        "node": "^16.14.0 || >=18.0.0"
      }
    },
    "node_modules/nth-check": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/nth-check/-/nth-check-2.1.1.tgz",
      "integrity": "sha512-lqjrjmaOoAnWfMmBPL+XNnynZh2+swxiX3WUE0s4yEHI6m+AwrK2UZOimIRl3X/4QctVqS8AiZjFqyOGrMXb/w==",
      "license": "BSD-2-Clause",
      "dependencies": {
        "boolbase": "^1.0.0"
      },
      "funding": {
        "url": "https://github.com/fb55/nth-check?sponsor=1"
      }
    },
    "node_modules/nullthrows": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/nullthrows/-/nullthrows-1.1.1.tgz",
      "integrity": "sha512-2vPPEi+Z7WqML2jZYddDIfy5Dqb0r2fze2zTxNNknZaFpVHU3mFB3R+DWeJWGVx0ecvttSGlJTI+WG+8Z4cDWw==",
      "license": "MIT"
    },
    "node_modules/ob1": {
      "version": "0.84.6",
      "resolved": "https://registry.npmjs.org/ob1/-/ob1-0.84.6.tgz",
      "integrity": "sha512-+s+6zjd0X68hfAcn92NsEPXnSYOF3O7exw/Fj4UfRTB+UL+Tdjdkzu5/4WquXlzqgvNm8FWuuW6/0Yd8S2rYxw==",
      "license": "MIT",
      "dependencies": {
        "flow-enums-runtime": "^0.0.6"
      },
      "engines": {
        "node": "^20.19.4 || ^22.13.0 || ^24.3.0 || >= 25.0.0"
      }
    },
    "node_modules/object-assign": {
      "version": "4.1.1",
      "resolved": "https://registry.npmjs.org/object-assign/-/object-assign-4.1.1.tgz",
      "integrity": "sha512-rJgTQnkUnH1sFw8yT6VSU3zD3sWmu6sZhIseY8VX+GRu3P6F7Fu+JNDoXfklElbLJSnc3FUQHVe4cU5hj+BcUg==",
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/on-finished": {
      "version": "2.3.0",
      "resolved": "https://registry.npmjs.org/on-finished/-/on-finished-2.3.0.tgz",
      "integrity": "sha512-ikqdkGAAyf/X/gPhXGvfgAytDZtDbr+bkNUJ0N9h5MI/dmdgCs3l6hoHrcUv41sRKew3jIwrp4qQDXiK99Utww==",
      "license": "MIT",
      "dependencies": {
        "ee-first": "1.1.1"
      },
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/on-headers": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/on-headers/-/on-headers-1.1.0.tgz",
      "integrity": "sha512-737ZY3yNnXy37FHkQxPzt4UZ2UWPWiCZWLvFZ4fu5cueciegX0zGPnrlY6bwRg4FdQOe9YU8MkmJwGhoMybl8A==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/onetime": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/onetime/-/onetime-2.0.1.tgz",
      "integrity": "sha512-oyyPpiMaKARvvcgip+JV+7zci5L8D1W9RZIz2l1o08AM3pfspitVWnPt3mzHcBPp12oYMTy0pqrFs/C+m3EwsQ==",
      "license": "MIT",
      "dependencies": {
        "mimic-fn": "^1.0.0"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/open": {
      "version": "7.4.2",
      "resolved": "https://registry.npmjs.org/open/-/open-7.4.2.tgz",
      "integrity": "sha512-MVHddDVweXZF3awtlAS+6pgKLlm/JgxZ90+/NBurBoQctVOOB/zDdVjcyPzQ+0laDGbsWgrRkflI65sQeOgT9Q==",
      "license": "MIT",
      "dependencies": {
        "is-docker": "^2.0.0",
        "is-wsl": "^2.1.1"
      },
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/ora": {
      "version": "3.4.0",
      "resolved": "https://registry.npmjs.org/ora/-/ora-3.4.0.tgz",
      "integrity": "sha512-eNwHudNbO1folBP3JsZ19v9azXWtQZjICdr3Q0TDPIaeBQ3mXLrh54wM+er0+hSp+dWKf+Z8KM58CYzEyIYxYg==",
      "license": "MIT",
      "dependencies": {
        "chalk": "^2.4.2",
        "cli-cursor": "^2.1.0",
        "cli-spinners": "^2.0.0",
        "log-symbols": "^2.2.0",
        "strip-ansi": "^5.2.0",
        "wcwidth": "^1.0.1"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/ora/node_modules/ansi-regex": {
      "version": "4.1.1",
      "resolved": "https://registry.npmjs.org/ansi-regex/-/ansi-regex-4.1.1.tgz",
      "integrity": "sha512-ILlv4k/3f6vfQ4OoP2AGvirOktlQ98ZEL1k9FaQjxa3L1abBgbuTDAdPOpvbGncC0BTVQrl+OM8xZGK6tWXt7g==",
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/ora/node_modules/ansi-styles": {
      "version": "3.2.1",
      "resolved": "https://registry.npmjs.org/ansi-styles/-/ansi-styles-3.2.1.tgz",
      "integrity": "sha512-VT0ZI6kZRdTh8YyJw3SMbYm/u+NqfsAxEpWO0Pf9sq8/e94WxxOpPKx9FR1FlyCtOVDNOQ+8ntlqFxiRc+r5qA==",
      "license": "MIT",
      "dependencies": {
        "color-convert": "^1.9.0"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/ora/node_modules/chalk": {
      "version": "2.4.2",
      "resolved": "https://registry.npmjs.org/chalk/-/chalk-2.4.2.tgz",
      "integrity": "sha512-Mti+f9lpJNcwF4tWV8/OrTTtF1gZi+f8FqlyAdouralcFWFQWF2+NgCHShjkCb+IFBLq9buZwE1xckQU4peSuQ==",
      "license": "MIT",
      "dependencies": {
        "ansi-styles": "^3.2.1",
        "escape-string-regexp": "^1.0.5",
        "supports-color": "^5.3.0"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/ora/node_modules/color-convert": {
      "version": "1.9.3",
      "resolved": "https://registry.npmjs.org/color-convert/-/color-convert-1.9.3.tgz",
      "integrity": "sha512-QfAUtd+vFdAtFQcC8CCyYt1fYWxSqAiK2cSD6zDB8N3cpsEBAvRxp9zOGg6G/SHHJYAT88/az/IuDGALsNVbGg==",
      "license": "MIT",
      "dependencies": {
        "color-name": "1.1.3"
      }
    },
    "node_modules/ora/node_modules/color-name": {
      "version": "1.1.3",
      "resolved": "https://registry.npmjs.org/color-name/-/color-name-1.1.3.tgz",
      "integrity": "sha512-72fSenhMw2HZMTVHeCA9KCmpEIbzWiQsjN+BHcBbS9vr1mtt+vJjPdksIBNUmKAW8TFUDPJK5SUU3QhE9NEXDw==",
      "license": "MIT"
    },
    "node_modules/ora/node_modules/escape-string-regexp": {
      "version": "1.0.5",
      "resolved": "https://registry.npmjs.org/escape-string-regexp/-/escape-string-regexp-1.0.5.tgz",
      "integrity": "sha512-vbRorB5FUQWvla16U8R/qgaFIya2qGzwDrNmCZuYKrbdSUMG6I1ZCGQRefkRVhuOkIGVne7BQ35DSfo1qvJqFg==",
      "license": "MIT",
      "engines": {
        "node": ">=0.8.0"
      }
    },
    "node_modules/ora/node_modules/has-flag": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/has-flag/-/has-flag-3.0.0.tgz",
      "integrity": "sha512-sKJf1+ceQBr4SMkvQnBDNDtf4TXpVhVGateu0t918bl30FnbE2m4vNLX+VWe/dpjlb+HugGYzW7uQXH98HPEYw==",
      "license": "MIT",
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/ora/node_modules/strip-ansi": {
      "version": "5.2.0",
      "resolved": "https://registry.npmjs.org/strip-ansi/-/strip-ansi-5.2.0.tgz",
      "integrity": "sha512-DuRs1gKbBqsMKIZlrffwlug8MHkcnpjs5VPmL1PAh+mA30U0DTotfDZ0d2UUsXpPmPmMMJ6W773MaA3J+lbiWA==",
      "license": "MIT",
      "dependencies": {
        "ansi-regex": "^4.1.0"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/ora/node_modules/supports-color": {
      "version": "5.5.0",
      "resolved": "https://registry.npmjs.org/supports-color/-/supports-color-5.5.0.tgz",
      "integrity": "sha512-QjVjwdXIt408MIiAqCX4oUKsgU2EqAGzs2Ppkm4aQYbjm+ZEWEcW4SfFNTr4uMNZma0ey4f5lgLrkB0aX0QMow==",
      "license": "MIT",
      "dependencies": {
        "has-flag": "^3.0.0"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/parse-png": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/parse-png/-/parse-png-2.1.0.tgz",
      "integrity": "sha512-Nt/a5SfCLiTnQAjx3fHlqp8hRgTL3z7kTQZzvIMS9uCAepnCyjpdEc6M/sz69WqMBdaDBw9sF1F1UaHROYzGkQ==",
      "license": "MIT",
      "dependencies": {
        "pngjs": "^3.3.0"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/parseurl": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/parseurl/-/parseurl-1.3.3.tgz",
      "integrity": "sha512-CiyeOxFT/JZyN5m0z9PfXw4SCBJ6Sygz1Dpl0wqjlhDEGGBP1GnsUVEL0p63hoG1fcj3fHynXi9NYO4nWOL+qQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/path-key": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/path-key/-/path-key-3.1.1.tgz",
      "integrity": "sha512-ojmeN0qd+y0jszEtoY48r0Peq5dwMEkIlCOu6Q5f41lfkswXuKtYrhgoTpLnyIcHm24Uhqx+5Tqm2InSwLhE6Q==",
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/path-parse": {
      "version": "1.0.7",
      "resolved": "https://registry.npmjs.org/path-parse/-/path-parse-1.0.7.tgz",
      "integrity": "sha512-LDJzPVEEEPR+y48z93A0Ed0yXb8pAByGWo/k5YYdYgpY2/2EsOsksJrq7lOHxryrVOn1ejG6oAp8ahvOIQD8sw==",
      "license": "MIT"
    },
    "node_modules/path-scurry": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/path-scurry/-/path-scurry-2.0.2.tgz",
      "integrity": "sha512-3O/iVVsJAPsOnpwWIeD+d6z/7PmqApyQePUtCndjatj/9I5LylHvt5qluFaBT3I5h3r1ejfR056c+FCv+NnNXg==",
      "license": "BlueOak-1.0.0",
      "dependencies": {
        "lru-cache": "^11.0.0",
        "minipass": "^7.1.2"
      },
      "engines": {
        "node": "18 || 20 || >=22"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/path-scurry/node_modules/lru-cache": {
      "version": "11.5.2",
      "resolved": "https://registry.npmjs.org/lru-cache/-/lru-cache-11.5.2.tgz",
      "integrity": "sha512-4pfM1Ff0x50o0tQwb5ucw/RzNyD0/YJME6IVcStalZuMWxdt3sR3huStTtxz4PUmvZfRguvDejasvQ2kifR11g==",
      "license": "BlueOak-1.0.0",
      "engines": {
        "node": "20 || >=22"
      }
    },
    "node_modules/picocolors": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/picocolors/-/picocolors-1.1.1.tgz",
      "integrity": "sha512-xceH2snhtb5M9liqDsmEw56le376mTZkEX/jEb/RxNFyegNul7eNslCXP9FDj/Lcu0X8KEyMceP2ntpaHrDEVA==",
      "license": "ISC"
    },
    "node_modules/picomatch": {
      "version": "2.3.2",
      "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-2.3.2.tgz",
      "integrity": "sha512-V7+vQEJ06Z+c5tSye8S+nHUfI51xoXIXjHQ99cQtKUkQqqO1kO/KCJUfZXuB47h/YBlDhah2H3hdUGXn8ie0oA==",
      "license": "MIT",
      "engines": {
        "node": ">=8.6"
      },
      "funding": {
        "url": "https://github.com/sponsors/jonschlinkert"
      }
    },
    "node_modules/plist": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/plist/-/plist-3.1.1.tgz",
      "integrity": "sha512-ZIfcLJC+7E7FBFnDxm9MPmt7D+DidyQ26lewieO75AdhA2ayMtsJSES0iWzqJQbcVRSrTufQoy0DR94xHue0oA==",
      "license": "MIT",
      "dependencies": {
        "@xmldom/xmldom": "^0.9.10",
        "base64-js": "^1.5.1",
        "xmlbuilder": "^15.1.1"
      },
      "engines": {
        "node": ">=10.4.0"
      }
    },
    "node_modules/plist/node_modules/@xmldom/xmldom": {
      "version": "0.9.12",
      "resolved": "https://registry.npmjs.org/@xmldom/xmldom/-/xmldom-0.9.12.tgz",
      "integrity": "sha512-5AXjrcMClTryPe9LgZrygpB1lj7s0S9E0+W+AHaVKAVyHanafK86iPSvG5xHVSp/jC+VH1UXu0TAEmY279xH7A==",
      "license": "MIT",
      "engines": {
        "node": ">=14.6"
      }
    },
    "node_modules/pngjs": {
      "version": "3.4.0",
      "resolved": "https://registry.npmjs.org/pngjs/-/pngjs-3.4.0.tgz",
      "integrity": "sha512-NCrCHhWmnQklfH4MtJMRjZ2a8c80qXeMlQMv2uVp9ISJMTt562SbGd6n2oq0PaPgKm7Z6pL9E2UlLIhC+SHL3w==",
      "license": "MIT",
      "engines": {
        "node": ">=4.0.0"
      }
    },
    "node_modules/postcss": {
      "version": "8.5.28",
      "resolved": "https://registry.npmjs.org/postcss/-/postcss-8.5.28.tgz",
      "integrity": "sha512-RRuzqDtt5Y9h3quz5hWhK+TPnsmVs6WwSU6LkJMeY4HstUEDuYTG8UJSdawMRzmzAtV+KEoG8N3Qg2qLy5vM/A==",
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/postcss"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "nanoid": "^3.3.18",
        "picocolors": "^1.1.1",
        "source-map-js": "^1.2.1"
      },
      "engines": {
        "node": "^10 || ^12 || >=14"
      }
    },
    "node_modules/postcss-value-parser": {
      "version": "4.2.0",
      "resolved": "https://registry.npmjs.org/postcss-value-parser/-/postcss-value-parser-4.2.0.tgz",
      "integrity": "sha512-1NNCs6uurfkVbeXG4S8JFT9t19m45ICnif8zWLd5oPSZ50QnwMfK+H3jv408d4jw/7Bttv5axS5IiHoLaVNHeQ==",
      "license": "MIT"
    },
    "node_modules/pretty-format": {
      "version": "29.7.0",
      "resolved": "https://registry.npmjs.org/pretty-format/-/pretty-format-29.7.0.tgz",
      "integrity": "sha512-Pdlw/oPxN+aXdmM9R00JVC9WVFoCLTKJvDVLgmJ+qAffBMxsV85l/Lu7sNx4zSzPyoL2euImuEwHhOXdEgNFZQ==",
      "license": "MIT",
      "dependencies": {
        "@jest/schemas": "^29.6.3",
        "ansi-styles": "^5.0.0",
        "react-is": "^18.0.0"
      },
      "engines": {
        "node": "^14.15.0 || ^16.10.0 || >=18.0.0"
      }
    },
    "node_modules/pretty-format/node_modules/ansi-styles": {
      "version": "5.2.0",
      "resolved": "https://registry.npmjs.org/ansi-styles/-/ansi-styles-5.2.0.tgz",
      "integrity": "sha512-Cxwpt2SfTzTtXcfOlzGEee8O+c+MmUgGrNiBcXnuWxuFJHe6a5Hz7qwhwe5OgaSYI0IJvkLqWX1ASG+cJOkEiA==",
      "license": "MIT",
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/chalk/ansi-styles?sponsor=1"
      }
    },
    "node_modules/pretty-format/node_modules/react-is": {
      "version": "18.3.1",
      "resolved": "https://registry.npmjs.org/react-is/-/react-is-18.3.1.tgz",
      "integrity": "sha512-/LLMVyas0ljjAtoYiPqYiL8VWXzUUdThrmU5+n20DZv+a+ClRoevUzw5JxU+Ieh5/c87ytoTBV9G1FiKfNJdmg==",
      "license": "MIT"
    },
    "node_modules/proc-log": {
      "version": "4.2.0",
      "resolved": "https://registry.npmjs.org/proc-log/-/proc-log-4.2.0.tgz",
      "integrity": "sha512-g8+OnU/L2v+wyiVK+D5fA34J7EH8jZ8DDlvwhRCMxmMj7UCBvxiO1mGeN+36JXIKF4zevU4kRBd8lVgG9vLelA==",
      "license": "ISC",
      "engines": {
        "node": "^14.17.0 || ^16.13.0 || >=18.0.0"
      }
    },
    "node_modules/progress": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/progress/-/progress-2.0.3.tgz",
      "integrity": "sha512-7PiHtLll5LdnKIMw100I+8xJXR5gW2QwWYkT6iJva0bXitZKa/XMrSbdmg3r2Xnaidz9Qumd0VPaMrZlF9V9sA==",
      "license": "MIT",
      "engines": {
        "node": ">=0.4.0"
      }
    },
    "node_modules/promise": {
      "version": "8.3.0",
      "resolved": "https://registry.npmjs.org/promise/-/promise-8.3.0.tgz",
      "integrity": "sha512-rZPNPKTOYVNEEKFaq1HqTgOwZD+4/YHS5ukLzQCypkj+OkYx7iv0mA91lJlpPPZ8vMau3IIGj5Qlwrx+8iiSmg==",
      "license": "MIT",
      "dependencies": {
        "asap": "~2.0.6"
      }
    },
    "node_modules/prompts": {
      "version": "2.4.2",
      "resolved": "https://registry.npmjs.org/prompts/-/prompts-2.4.2.tgz",
      "integrity": "sha512-NxNv/kLguCA7p3jE8oL2aEBsrJWgAakBpgmgK6lpPWV+WuOmY6r2/zbAVnP+T8bQlA0nzHXSJSJW0Hq7ylaD2Q==",
      "license": "MIT",
      "dependencies": {
        "kleur": "^3.0.3",
        "sisteransi": "^1.0.5"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/query-string": {
      "version": "7.1.3",
      "resolved": "https://registry.npmjs.org/query-string/-/query-string-7.1.3.tgz",
      "integrity": "sha512-hh2WYhq4fi8+b+/2Kg9CEge4fDPvHS534aOOvOZeQ3+Vf2mCFsaFBYj0i+iXcAq6I9Vzp5fjMFBlONvayDC1qg==",
      "license": "MIT",
      "dependencies": {
        "decode-uri-component": "^0.2.2",
        "filter-obj": "^1.1.0",
        "split-on-first": "^1.0.0",
        "strict-uri-encode": "^2.0.0"
      },
      "engines": {
        "node": ">=6"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/range-parser": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/range-parser/-/range-parser-1.2.1.tgz",
      "integrity": "sha512-Hrgsx+orqoygnmhFbKaHE6c296J+HTAQXoxEF6gNupROmmGJRoyzfG3ccAveqCBrwr/2yxQ5BVd/GTl5agOwSg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/react": {
      "version": "19.2.3",
      "resolved": "https://registry.npmjs.org/react/-/react-19.2.3.tgz",
      "integrity": "sha512-Ku/hhYbVjOQnXDZFv2+RibmLFGwFdeeKHFcOTlrt7xplBnya5OGn/hIRDsqDiSUcfORsDC7MPxwork8jBwsIWA==",
      "license": "MIT",
      "peer": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/react-devtools-core": {
      "version": "6.1.5",
      "resolved": "https://registry.npmjs.org/react-devtools-core/-/react-devtools-core-6.1.5.tgz",
      "integrity": "sha512-ePrwPfxAnB+7hgnEr8vpKxL9cmnp7F322t8oqcPshbIQQhDKgFDW4tjhF2wjVbdXF9O/nyuy3sQWd9JGpiLPvA==",
      "license": "MIT",
      "dependencies": {
        "shell-quote": "^1.6.1",
        "ws": "^7"
      }
    },
    "node_modules/react-dom": {
      "version": "19.2.3",
      "resolved": "https://registry.npmjs.org/react-dom/-/react-dom-19.2.3.tgz",
      "integrity": "sha512-yELu4WmLPw5Mr/lmeEpox5rw3RETacE++JgHqQzd2dg+YbJuat3jH4ingc+WPZhxaoFzdv9y33G+F7Nl5O0GBg==",
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "scheduler": "^0.27.0"
      },
      "peerDependencies": {
        "react": "^19.2.3"
      }
    },
    "node_modules/react-freeze": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/react-freeze/-/react-freeze-1.0.4.tgz",
      "integrity": "sha512-r4F0Sec0BLxWicc7HEyo2x3/2icUTrRmDjaaRyzzn+7aDyFZliszMDOgLVwSnQnYENOlL1o569Ze2HZefk8clA==",
      "license": "MIT",
      "engines": {
        "node": ">=10"
      },
      "peerDependencies": {
        "react": ">=17.0.0"
      }
    },
    "node_modules/react-is": {
      "version": "19.2.4",
      "resolved": "https://registry.npmjs.org/react-is/-/react-is-19.2.4.tgz",
      "integrity": "sha512-W+EWGn2v0ApPKgKKCy/7s7WHXkboGcsrXE+2joLyVxkbyVQfO3MUEaUQDHoSmb8TFFrSKYa9mw64WZHNHSDzYA==",
      "license": "MIT"
    },
    "node_modules/react-native": {
      "version": "0.86.3",
      "resolved": "https://registry.npmjs.org/react-native/-/react-native-0.86.3.tgz",
      "integrity": "sha512-JR5s3bM9ezud+Mw24GlNXNfthqPIKwrQgPPJcam+L97t2sKjjEavhCzBn+fyqZZRcM5+XlhYxpTxVkK7e1n38Q==",
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@react-native/assets-registry": "0.86.3",
        "@react-native/codegen": "0.86.3",
        "@react-native/community-cli-plugin": "0.86.3",
        "@react-native/gradle-plugin": "0.86.3",
        "@react-native/js-polyfills": "0.86.3",
        "@react-native/normalize-colors": "0.86.3",
        "@react-native/virtualized-lists": "0.86.3",
        "abort-controller": "^3.0.0",
        "anser": "^1.4.9",
        "ansi-regex": "^5.0.0",
        "babel-plugin-syntax-hermes-parser": "0.36.0",
        "base64-js": "^1.5.1",
        "commander": "^12.0.0",
        "flow-enums-runtime": "^0.0.6",
        "hermes-compiler": "250829098.0.17",
        "invariant": "^2.2.4",
        "memoize-one": "^5.0.0",
        "metro-runtime": "^0.84.3",
        "metro-source-map": "^0.84.3",
        "nullthrows": "^1.1.1",
        "pretty-format": "^29.7.0",
        "promise": "^8.3.0",
        "react-devtools-core": "^6.1.5",
        "react-refresh": "^0.14.0",
        "regenerator-runtime": "^0.13.2",
        "scheduler": "0.27.0",
        "semver": "^7.1.3",
        "stacktrace-parser": "^0.1.10",
        "tinyglobby": "^0.2.15",
        "whatwg-fetch": "^3.0.0",
        "ws": "^7.5.10",
        "yargs": "^17.6.2"
      },
      "bin": {
        "react-native": "cli.js"
      },
      "engines": {
        "node": "^20.19.4 || ^22.13.0 || ^24.3.0 || >= 25.0.0"
      },
      "peerDependencies": {
        "@react-native/jest-preset": "0.86.3",
        "@types/react": "^19.1.1",
        "react": "^19.2.3"
      },
      "peerDependenciesMeta": {
        "@react-native/jest-preset": {
          "optional": true
        },
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/react-native-gesture-handler": {
      "version": "2.32.0",
      "resolved": "https://registry.npmjs.org/react-native-gesture-handler/-/react-native-gesture-handler-2.32.0.tgz",
      "integrity": "sha512-uYIMOKlKENORq2SABE+jIjbPU+h5I/sQKcq2v16zRq848nwEp1fWRVwML4QWqijc8UcXJC25o54S8GQd4Mf2OA==",
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@egjs/hammerjs": "^2.0.17",
        "@types/react-test-renderer": "^19.1.0",
        "hoist-non-react-statics": "^3.3.0",
        "invariant": "^2.2.4"
      },
      "peerDependencies": {
        "react": "*",
        "react-native": "*"
      }
    },
    "node_modules/react-native-safe-area-context": {
      "version": "5.7.0",
      "resolved": "https://registry.npmjs.org/react-native-safe-area-context/-/react-native-safe-area-context-5.7.0.tgz",
      "integrity": "sha512-/9/MtQz8ODphjsLdZ+GZAIcC/RtoqW9EeShf7Uvnfgm/pzYrJ75y3PV/J1wuAV1T5Dye5ygq4EAW20RoBq0ABQ==",
      "license": "MIT",
      "peer": true,
      "peerDependencies": {
        "react": "*",
        "react-native": "*"
      }
    },
    "node_modules/react-native-screens": {
      "version": "4.26.2",
      "resolved": "https://registry.npmjs.org/react-native-screens/-/react-native-screens-4.26.2.tgz",
      "integrity": "sha512-2XnWsZToKj76trGtEZzx5ELD/qOICFEprEeUntImmitQFVUkea27fiWdUSITArI356Y1qynpXZINW+Unbhky/A==",
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "react-freeze": "^1.0.0",
        "warn-once": "^0.1.0"
      },
      "peerDependencies": {
        "react": "*",
        "react-native": "*"
      }
    },
    "node_modules/react-native-svg": {
      "version": "15.15.4",
      "resolved": "https://registry.npmjs.org/react-native-svg/-/react-native-svg-15.15.4.tgz",
      "integrity": "sha512-boT/vIRgj6zZKBpfTPJJiYWMbZE9duBMOwPK6kCSTgxsS947IFMOq9OgIFkpWZTB7t229H24pDRkh3W9ZK/J1A==",
      "license": "MIT",
      "dependencies": {
        "css-select": "^5.1.0",
        "css-tree": "^1.1.3",
        "warn-once": "0.1.1"
      },
      "peerDependencies": {
        "react": "*",
        "react-native": "*"
      }
    },
    "node_modules/react-native-web": {
      "version": "0.21.2",
      "resolved": "https://registry.npmjs.org/react-native-web/-/react-native-web-0.21.2.tgz",
      "integrity": "sha512-SO2t9/17zM4iEnFvlu2DA9jqNbzNhoUP+AItkoCOyFmDMOhUnBBznBDCYN92fGdfAkfQlWzPoez6+zLxFNsZEg==",
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@babel/runtime": "^7.18.6",
        "@react-native/normalize-colors": "^0.74.1",
        "fbjs": "^3.0.4",
        "inline-style-prefixer": "^7.0.1",
        "memoize-one": "^6.0.0",
        "nullthrows": "^1.1.1",
        "postcss-value-parser": "^4.2.0",
        "styleq": "^0.1.3"
      },
      "peerDependencies": {
        "react": "^18.0.0 || ^19.0.0",
        "react-dom": "^18.0.0 || ^19.0.0"
      }
    },
    "node_modules/react-native-web/node_modules/@react-native/normalize-colors": {
      "version": "0.74.89",
      "resolved": "https://registry.npmjs.org/@react-native/normalize-colors/-/normalize-colors-0.74.89.tgz",
      "integrity": "sha512-qoMMXddVKVhZ8PA1AbUCk83trpd6N+1nF2A6k1i6LsQObyS92fELuk8kU/lQs6M7BsMHwqyLCpQJ1uFgNvIQXg==",
      "license": "MIT"
    },
    "node_modules/react-native-web/node_modules/memoize-one": {
      "version": "6.0.0",
      "resolved": "https://registry.npmjs.org/memoize-one/-/memoize-one-6.0.0.tgz",
      "integrity": "sha512-rkpe71W0N0c0Xz6QD0eJETuWAJGnJ9afsl1srmwPrI+yBCkge5EycXXbYRyvL29zZVUWQCY7InPRCv3GDXuZNw==",
      "license": "MIT"
    },
    "node_modules/react-native/node_modules/commander": {
      "version": "12.1.0",
      "resolved": "https://registry.npmjs.org/commander/-/commander-12.1.0.tgz",
      "integrity": "sha512-Vw8qHK3bZM9y/P10u3Vib8o/DdkvA2OtPtZvD871QKjy74Wj1WSKFILMPRPSdUSx5RFK1arlJzEtA4PkFgnbuA==",
      "license": "MIT",
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/react-refresh": {
      "version": "0.14.2",
      "resolved": "https://registry.npmjs.org/react-refresh/-/react-refresh-0.14.2.tgz",
      "integrity": "sha512-jCvmsr+1IUSMUyzOkRcvnVbX3ZYC6g9TDrDbFuFmRDq7PD4yaGbLKNQL6k2jnArV8hjYxh7hVhAZB6s9HDGpZA==",
      "license": "MIT",
      "peer": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/regenerate": {
      "version": "1.4.2",
      "resolved": "https://registry.npmjs.org/regenerate/-/regenerate-1.4.2.tgz",
      "integrity": "sha512-zrceR/XhGYU/d/opr2EKO7aRHUeiBI8qjtfHqADTwZd6Szfy16la6kqD0MIUs5z5hx6AaKa+PixpPrR289+I0A==",
      "license": "MIT"
    },
    "node_modules/regenerate-unicode-properties": {
      "version": "10.2.2",
      "resolved": "https://registry.npmjs.org/regenerate-unicode-properties/-/regenerate-unicode-properties-10.2.2.tgz",
      "integrity": "sha512-m03P+zhBeQd1RGnYxrGyDAPpWX/epKirLrp8e3qevZdVkKtnCrjjWczIbYc8+xd6vcTStVlqfycTx1KR4LOr0g==",
      "license": "MIT",
      "dependencies": {
        "regenerate": "^1.4.2"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/regenerator-runtime": {
      "version": "0.13.11",
      "resolved": "https://registry.npmjs.org/regenerator-runtime/-/regenerator-runtime-0.13.11.tgz",
      "integrity": "sha512-kY1AZVr2Ra+t+piVaJ4gxaFaReZVH40AKNo7UCX6W+dEwBo/2oZJzqfuN1qLq1oL45o56cPaTXELwrTh8Fpggg==",
      "license": "MIT"
    },
    "node_modules/regexpu-core": {
      "version": "6.4.0",
      "resolved": "https://registry.npmjs.org/regexpu-core/-/regexpu-core-6.4.0.tgz",
      "integrity": "sha512-0ghuzq67LI9bLXpOX/ISfve/Mq33a4aFRzoQYhnnok1JOFpmE/A2TBGkNVenOGEeSBCjIiWcc6MVOG5HEQv0sA==",
      "license": "MIT",
      "dependencies": {
        "regenerate": "^1.4.2",
        "regenerate-unicode-properties": "^10.2.2",
        "regjsgen": "^0.8.0",
        "regjsparser": "^0.13.0",
        "unicode-match-property-ecmascript": "^2.0.0",
        "unicode-match-property-value-ecmascript": "^2.2.1"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/regjsgen": {
      "version": "0.8.0",
      "resolved": "https://registry.npmjs.org/regjsgen/-/regjsgen-0.8.0.tgz",
      "integrity": "sha512-RvwtGe3d7LvWiDQXeQw8p5asZUmfU1G/l6WbUXeHta7Y2PEIvBTwH6E2EfmYUK8pxcxEdEmaomqyp0vZZ7C+3Q==",
      "license": "MIT"
    },
    "node_modules/regjsparser": {
      "version": "0.13.2",
      "resolved": "https://registry.npmjs.org/regjsparser/-/regjsparser-0.13.2.tgz",
      "integrity": "sha512-NgRBy2Nx/bE+9F27nVHnqcN5HjyLmecqsqx2PJHu3/IEtADD4WuxuXIVExD5PoSDFVrl78dOonfcOe5O+5nbzQ==",
      "license": "BSD-2-Clause",
      "dependencies": {
        "jsesc": "~3.1.0"
      },
      "bin": {
        "regjsparser": "bin/parser"
      }
    },
    "node_modules/require-directory": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/require-directory/-/require-directory-2.1.1.tgz",
      "integrity": "sha512-fGxEI7+wsG9xrvdjsrlmL22OMTTiHRwAMroiEeMgq8gzoLC/PQr7RsRDSTLUg/bZAZtF+TVIkHc6/4RIKrui+Q==",
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/resolve": {
      "version": "1.22.12",
      "resolved": "https://registry.npmjs.org/resolve/-/resolve-1.22.12.tgz",
      "integrity": "sha512-TyeJ1zif53BPfHootBGwPRYT1RUt6oGWsaQr8UyZW/eAm9bKoijtvruSDEmZHm92CwS9nj7/fWttqPCgzep8CA==",
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "is-core-module": "^2.16.1",
        "path-parse": "^1.0.7",
        "supports-preserve-symlinks-flag": "^1.0.0"
      },
      "bin": {
        "resolve": "bin/resolve"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/resolve-from": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/resolve-from/-/resolve-from-5.0.0.tgz",
      "integrity": "sha512-qYg9KP24dD5qka9J47d0aVky0N+b4fTU89LN9iDnjB5waksiC49rvMB0PrUJQGoTmH50XPiqOvAjDfaijGxYZw==",
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/resolve-workspace-root": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/resolve-workspace-root/-/resolve-workspace-root-2.0.1.tgz",
      "integrity": "sha512-nR23LHAvaI6aHtMg6RWoaHpdR4D881Nydkzi2CixINyg9T00KgaJdJI6Vwty+Ps8WLxZHuxsS0BseWjxSA4C+w==",
      "license": "MIT"
    },
    "node_modules/restore-cursor": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/restore-cursor/-/restore-cursor-2.0.0.tgz",
      "integrity": "sha512-6IzJLuGi4+R14vwagDHX+JrXmPVtPpn4mffDJ1UdR7/Edm87fl6yi8mMBIVvFtJaNTUvjughmW4hwLhRG7gC1Q==",
      "license": "MIT",
      "dependencies": {
        "onetime": "^2.0.0",
        "signal-exit": "^3.0.2"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/safe-buffer": {
      "version": "5.2.1",
      "resolved": "https://registry.npmjs.org/safe-buffer/-/safe-buffer-5.2.1.tgz",
      "integrity": "sha512-rp3So07KcdmmKbGvgaNxQSJr7bGVSVk5S9Eq1F+ppbRo70+YeaDxkw5Dd8NPN+GD6bjnYm2VuPuCXmpuYvmCXQ==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ],
      "license": "MIT"
    },
    "node_modules/sandbox-cli-detector": {
      "version": "0.2.0",
      "resolved": "https://registry.npmjs.org/sandbox-cli-detector/-/sandbox-cli-detector-0.2.0.tgz",
      "integrity": "sha512-4lyHX0ZU0AZKwjgZ1InxZAa3PNpyEb8rOQ+Zss1ReYmhNzW0Q+h1zE5nvniXN0HaAWZaZE1zgVNEirb0R7LmNg==",
      "license": "MIT",
      "bin": {
        "sandbox-cli-detector": "dist/cli.js"
      },
      "engines": {
        "node": ">=18.18"
      }
    },
    "node_modules/sax": {
      "version": "1.6.1",
      "resolved": "https://registry.npmjs.org/sax/-/sax-1.6.1.tgz",
      "integrity": "sha512-42tBVwLWnaQvW5zc4HbZrTuWccECCZfBi92FDuwtqxasH+JbPB3/FOKb1m222K42R4WxuxzzMsTswfzgtSu64Q==",
      "license": "BlueOak-1.0.0",
      "engines": {
        "node": ">=11.0.0"
      }
    },
    "node_modules/scheduler": {
      "version": "0.27.0",
      "resolved": "https://registry.npmjs.org/scheduler/-/scheduler-0.27.0.tgz",
      "integrity": "sha512-eNv+WrVbKu1f3vbYJT/xtiF5syA5HPIMtf9IgY/nKg0sWqzAUEvqY/xm7OcZc/qafLx/iO9FgOmeSAp4v5ti/Q==",
      "license": "MIT"
    },
    "node_modules/semver": {
      "version": "7.7.4",
      "resolved": "https://registry.npmjs.org/semver/-/semver-7.7.4.tgz",
      "integrity": "sha512-vFKC2IEtQnVhpT78h1Yp8wzwrf8CM+MzKMHGJZfBtzhZNycRFnXsHk6E5TxIkkMsgNS7mdX3AGB7x2QM2di4lA==",
      "license": "ISC",
      "bin": {
        "semver": "bin/semver.js"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/send": {
      "version": "0.19.2",
      "resolved": "https://registry.npmjs.org/send/-/send-0.19.2.tgz",
      "integrity": "sha512-VMbMxbDeehAxpOtWJXlcUS5E8iXh6QmN+BkRX1GARS3wRaXEEgzCcB10gTQazO42tpNIya8xIyNx8fll1OFPrg==",
      "license": "MIT",
      "dependencies": {
        "debug": "2.6.9",
        "depd": "2.0.0",
        "destroy": "1.2.0",
        "encodeurl": "~2.0.0",
        "escape-html": "~1.0.3",
        "etag": "~1.8.1",
        "fresh": "~0.5.2",
        "http-errors": "~2.0.1",
        "mime": "1.6.0",
        "ms": "2.1.3",
        "on-finished": "~2.4.1",
        "range-parser": "~1.2.1",
        "statuses": "~2.0.2"
      },
      "engines": {
        "node": ">= 0.8.0"
      }
    },
    "node_modules/send/node_modules/debug": {
      "version": "2.6.9",
      "resolved": "https://registry.npmjs.org/debug/-/debug-2.6.9.tgz",
      "integrity": "sha512-bC7ElrdJaJnPbAP+1EotYvqZsb3ecl5wi6Bfi6BJTUcNowp6cvspg0jXznRTKDjm/E7AdgFBVeAPVMNcKGsHMA==",
      "license": "MIT",
      "dependencies": {
        "ms": "2.0.0"
      }
    },
    "node_modules/send/node_modules/debug/node_modules/ms": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.0.0.tgz",
      "integrity": "sha512-Tpp60P6IUJDTuOq/5Z8cdskzJujfwqfOTkrwIwj7IRISpnkJnT6SyJ4PCPnGMoFjC9ddhal5KVIYtAt97ix05A==",
      "license": "MIT"
    },
    "node_modules/send/node_modules/encodeurl": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/encodeurl/-/encodeurl-2.0.0.tgz",
      "integrity": "sha512-Q0n9HRi4m6JuGIV1eFlmvJB7ZEVxu93IrMyiMsGC0lrMJMWzRgx6WGquyfQgZVb31vhGgXnfmPNNXmxnOkRBrg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/send/node_modules/on-finished": {
      "version": "2.4.1",
      "resolved": "https://registry.npmjs.org/on-finished/-/on-finished-2.4.1.tgz",
      "integrity": "sha512-oVlzkg3ENAhCk2zdv7IJwd/QUD4z2RxRwpkcGY8psCVcCYZNq4wYnVWALHM+brtuJjePWiYF/ClmuDr8Ch5+kg==",
      "license": "MIT",
      "dependencies": {
        "ee-first": "1.1.1"
      },
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/send/node_modules/statuses": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/statuses/-/statuses-2.0.2.tgz",
      "integrity": "sha512-DvEy55V3DB7uknRo+4iOGT5fP1slR8wQohVdknigZPMpMstaKJQWhwiYBACJE3Ul2pTnATihhBYnRhZQHGBiRw==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/serialize-error": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/serialize-error/-/serialize-error-2.1.0.tgz",
      "integrity": "sha512-ghgmKt5o4Tly5yEG/UJp8qTd0AN7Xalw4XBtDEKP655B699qMEtra1WlXeE6WIvdEG481JvRxULKsInq/iNysw==",
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/serve-static": {
      "version": "1.16.3",
      "resolved": "https://registry.npmjs.org/serve-static/-/serve-static-1.16.3.tgz",
      "integrity": "sha512-x0RTqQel6g5SY7Lg6ZreMmsOzncHFU7nhnRWkKgWuMTu5NN0DR5oruckMqRvacAN9d5w6ARnRBXl9xhDCgfMeA==",
      "license": "MIT",
      "dependencies": {
        "encodeurl": "~2.0.0",
        "escape-html": "~1.0.3",
        "parseurl": "~1.3.3",
        "send": "~0.19.1"
      },
      "engines": {
        "node": ">= 0.8.0"
      }
    },
    "node_modules/serve-static/node_modules/encodeurl": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/encodeurl/-/encodeurl-2.0.0.tgz",
      "integrity": "sha512-Q0n9HRi4m6JuGIV1eFlmvJB7ZEVxu93IrMyiMsGC0lrMJMWzRgx6WGquyfQgZVb31vhGgXnfmPNNXmxnOkRBrg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/setimmediate": {
      "version": "1.0.5",
      "resolved": "https://registry.npmjs.org/setimmediate/-/setimmediate-1.0.5.tgz",
      "integrity": "sha512-MATJdZp8sLqDl/68LfQmbP8zKPLQNV6BIZoIgrscFDQ+RsvK/BxeDQOgyxKKoh0y/8h3BqVFnCqQ/gd+reiIXA==",
      "license": "MIT"
    },
    "node_modules/setprototypeof": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/setprototypeof/-/setprototypeof-1.2.0.tgz",
      "integrity": "sha512-E5LDX7Wrp85Kil5bhZv46j8jOeboKq5JMmYM3gVGdGH8xFpPWXUMsNrlODCrkoxMEeNi/XZIwuRvY4XNwYMJpw==",
      "license": "ISC"
    },
    "node_modules/shebang-command": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/shebang-command/-/shebang-command-2.0.0.tgz",
      "integrity": "sha512-kHxr2zZpYtdmrN1qDjrrX/Z1rR1kG8Dx+gkpK1G4eXmvXswmcE1hTWBWYUzlraYw1/yZp6YuDY77YtvbN0dmDA==",
      "license": "MIT",
      "dependencies": {
        "shebang-regex": "^3.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/shebang-regex": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/shebang-regex/-/shebang-regex-3.0.0.tgz",
      "integrity": "sha512-7++dFhtcx3353uBaq8DDR4NuxBetBzC7ZQOhmTQInHEd6bSrXdiEyzCvG07Z44UYdLShWUyXt5M/yhz8ekcb1A==",
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/shell-quote": {
      "version": "1.8.3",
      "resolved": "https://registry.npmjs.org/shell-quote/-/shell-quote-1.8.3.tgz",
      "integrity": "sha512-ObmnIF4hXNg1BqhnHmgbDETF8dLPCggZWBjkQfhZpbszZnYur5DUljTcCHii5LC3J5E0yeO/1LIMyH+UvHQgyw==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/signal-exit": {
      "version": "3.0.7",
      "resolved": "https://registry.npmjs.org/signal-exit/-/signal-exit-3.0.7.tgz",
      "integrity": "sha512-wnD2ZE+l+SPC/uoS0vXeE9L1+0wuaMqKlfz9AMUo38JsyLSBWSFcHR1Rri62LZc12vLr1gb3jl7iwQhgwpAbGQ==",
      "license": "ISC"
    },
    "node_modules/simple-plist": {
      "version": "1.3.1",
      "resolved": "https://registry.npmjs.org/simple-plist/-/simple-plist-1.3.1.tgz",
      "integrity": "sha512-iMSw5i0XseMnrhtIzRb7XpQEXepa9xhWxGUojHBL43SIpQuDQkh3Wpy67ZbDzZVr6EKxvwVChnVpdl8hEVLDiw==",
      "license": "MIT",
      "dependencies": {
        "bplist-creator": "0.1.0",
        "bplist-parser": "0.3.1",
        "plist": "^3.0.5"
      }
    },
    "node_modules/simple-swizzle": {
      "version": "0.2.4",
      "resolved": "https://registry.npmjs.org/simple-swizzle/-/simple-swizzle-0.2.4.tgz",
      "integrity": "sha512-nAu1WFPQSMNr2Zn9PGSZK9AGn4t/y97lEm+MXTtUDwfP0ksAIX4nO+6ruD9Jwut4C49SB1Ws+fbXsm/yScWOHw==",
      "license": "MIT",
      "dependencies": {
        "is-arrayish": "^0.3.1"
      }
    },
    "node_modules/sisteransi": {
      "version": "1.0.5",
      "resolved": "https://registry.npmjs.org/sisteransi/-/sisteransi-1.0.5.tgz",
      "integrity": "sha512-bLGGlR1QxBcynn2d5YmDX4MGjlZvy2MRBDRNHLJ8VI6l6+9FUiyTFNJ0IveOSP0bcXgVDPRcfGqA0pjaqUpfVg==",
      "license": "MIT"
    },
    "node_modules/slugify": {
      "version": "1.6.9",
      "resolved": "https://registry.npmjs.org/slugify/-/slugify-1.6.9.tgz",
      "integrity": "sha512-vZ7rfeehZui7wQs438JXBckYLkIIdfHOXsaVEUMyS5fHo1483l1bMdo0EDSWYclY0yZKFOipDy4KHuKs6ssvdg==",
      "license": "MIT",
      "engines": {
        "node": ">=8.0.0"
      }
    },
    "node_modules/source-map": {
      "version": "0.5.7",
      "resolved": "https://registry.npmjs.org/source-map/-/source-map-0.5.7.tgz",
      "integrity": "sha512-LbrmJOMUSdEVxIKvdcJzQC+nQhe8FUZQTXQy6+I75skNgn3OoQ0DZA8YnFa7gp8tqtL3KPf1kmo0R5DoApeSGQ==",
      "license": "BSD-3-Clause",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/source-map-js": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/source-map-js/-/source-map-js-1.2.1.tgz",
      "integrity": "sha512-UXWMKhLOwVKb728IUtQPXxfYU+usdybtUrK/8uGE8CQMvrhOpwvzDBwj0QhSL7MQc7vIsISBG8VQ8+IDQxpfQA==",
      "license": "BSD-3-Clause",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/source-map-support": {
      "version": "0.5.21",
      "resolved": "https://registry.npmjs.org/source-map-support/-/source-map-support-0.5.21.tgz",
      "integrity": "sha512-uBHU3L3czsIyYXKX88fdrGovxdSCoTGDRZ6SYXtSRxLZUzHg5P/66Ht6uoUlHu9EZod+inXhKo3qQgwXUT/y1w==",
      "license": "MIT",
      "dependencies": {
        "buffer-from": "^1.0.0",
        "source-map": "^0.6.0"
      }
    },
    "node_modules/source-map-support/node_modules/source-map": {
      "version": "0.6.1",
      "resolved": "https://registry.npmjs.org/source-map/-/source-map-0.6.1.tgz",
      "integrity": "sha512-UjgapumWlbMhkBgzT7Ykc5YXUT46F0iKu8SGXq0bcwP5dz/h0Plj6enJqjz1Zbq2l5WaqYnrVbwWOWMyF3F47g==",
      "license": "BSD-3-Clause",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/split-on-first": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/split-on-first/-/split-on-first-1.1.0.tgz",
      "integrity": "sha512-43ZssAJaMusuKWL8sKUBQXHWOpq8d6CfN/u1p4gUzfJkM05C8rxTmYrkIPTXapZpORA6LkkzcUulJ8FqA7Uudw==",
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/stackframe": {
      "version": "1.3.4",
      "resolved": "https://registry.npmjs.org/stackframe/-/stackframe-1.3.4.tgz",
      "integrity": "sha512-oeVtt7eWQS+Na6F//S4kJ2K2VbRlS9D43mAlMyVpVWovy9o+jfgH8O9agzANzaiLjclA0oYzUXEM4PurhSUChw==",
      "license": "MIT"
    },
    "node_modules/stacktrace-parser": {
      "version": "0.1.11",
      "resolved": "https://registry.npmjs.org/stacktrace-parser/-/stacktrace-parser-0.1.11.tgz",
      "integrity": "sha512-WjlahMgHmCJpqzU8bIBy4qtsZdU9lRlcZE3Lvyej6t4tuOuv1vk57OW3MBrj6hXBFx/nNoC9MPMTcr5YA7NQbg==",
      "license": "MIT",
      "dependencies": {
        "type-fest": "^0.7.1"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/statuses": {
      "version": "1.5.0",
      "resolved": "https://registry.npmjs.org/statuses/-/statuses-1.5.0.tgz",
      "integrity": "sha512-OpZ3zP+jT1PI7I8nemJX4AKmAX070ZkYPVWV/AaKTJl+tXCTGyVdC1a4SL8RUQYEwk/f34ZX8UTykN68FwrqAA==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/stream-buffers": {
      "version": "2.2.0",
      "resolved": "https://registry.npmjs.org/stream-buffers/-/stream-buffers-2.2.0.tgz",
      "integrity": "sha512-uyQK/mx5QjHun80FLJTfaWE7JtwfRMKBLkMne6udYOmvH0CawotVa7TfgYHzAnpphn4+TweIx1QKMnRIbipmUg==",
      "license": "Unlicense",
      "engines": {
        "node": ">= 0.10.0"
      }
    },
    "node_modules/strict-uri-encode": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/strict-uri-encode/-/strict-uri-encode-2.0.0.tgz",
      "integrity": "sha512-QwiXZgpRcKkhTj2Scnn++4PKtWsH0kpzZ62L2R6c/LUVYv7hVnZqcg2+sMuT6R7Jusu1vviK/MFsu6kNJfWlEQ==",
      "license": "MIT",
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/string-width": {
      "version": "4.2.3",
      "resolved": "https://registry.npmjs.org/string-width/-/string-width-4.2.3.tgz",
      "integrity": "sha512-wKyQRQpjJ0sIp62ErSZdGsjMJWsap5oRNihHhu6G7JVO/9jIB6UyevL+tXuOqrng8j/cxKTWyWUwvSTriiZz/g==",
      "license": "MIT",
      "dependencies": {
        "emoji-regex": "^8.0.0",
        "is-fullwidth-code-point": "^3.0.0",
        "strip-ansi": "^6.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/strip-ansi": {
      "version": "6.0.1",
      "resolved": "https://registry.npmjs.org/strip-ansi/-/strip-ansi-6.0.1.tgz",
      "integrity": "sha512-Y38VPSHcqkFrCpFnQ9vuSXmquuv5oXOKpGeT6aGrr3o3Gc9AlVa6JBfUSOCnbxGGZF+/0ooI7KrPuUSztUdU5A==",
      "license": "MIT",
      "dependencies": {
        "ansi-regex": "^5.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/structured-headers": {
      "version": "0.4.1",
      "resolved": "https://registry.npmjs.org/structured-headers/-/structured-headers-0.4.1.tgz",
      "integrity": "sha512-0MP/Cxx5SzeeZ10p/bZI0S6MpgD+yxAhi1BOQ34jgnMXsCq3j1t6tQnZu+KdlL7dvJTLT3g9xN8tl10TqgFMcg==",
      "license": "MIT"
    },
    "node_modules/styleq": {
      "version": "0.1.3",
      "resolved": "https://registry.npmjs.org/styleq/-/styleq-0.1.3.tgz",
      "integrity": "sha512-3ZUifmCDCQanjeej1f6kyl/BeP/Vae5EYkQ9iJfUm/QwZvlgnZzyflqAsAWYURdtea8Vkvswu2GrC57h3qffcA==",
      "license": "MIT"
    },
    "node_modules/supports-color": {
      "version": "7.2.0",
      "resolved": "https://registry.npmjs.org/supports-color/-/supports-color-7.2.0.tgz",
      "integrity": "sha512-qpCAvRl9stuOHveKsn7HncJRvv501qIacKzQlO/+Lwxc9+0q2wLyv4Dfvt80/DPn2pqOBsJdDiogXGR9+OvwRw==",
      "license": "MIT",
      "dependencies": {
        "has-flag": "^4.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/supports-hyperlinks": {
      "version": "2.3.0",
      "resolved": "https://registry.npmjs.org/supports-hyperlinks/-/supports-hyperlinks-2.3.0.tgz",
      "integrity": "sha512-RpsAZlpWcDwOPQA22aCH4J0t7L8JmAvsCxfOSEwm7cQs3LshN36QaTkwd70DnBOXDWGssw2eUoc8CaRWT0XunA==",
      "license": "MIT",
      "dependencies": {
        "has-flag": "^4.0.0",
        "supports-color": "^7.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/supports-preserve-symlinks-flag": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/supports-preserve-symlinks-flag/-/supports-preserve-symlinks-flag-1.0.0.tgz",
      "integrity": "sha512-ot0WnXS9fgdkgIcePe6RHNk1WA8+muPa6cSjeR3V8K27q9BB1rTE3R1p7Hv0z1ZyAc8s6Vvv8DIyWf681MAt0w==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/terminal-link": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/terminal-link/-/terminal-link-2.1.1.tgz",
      "integrity": "sha512-un0FmiRUQNr5PJqy9kP7c40F5BOfpGlYTrxonDChEZB7pzZxRNp/bt+ymiy9/npwXya9KH99nJ/GXFIiUkYGFQ==",
      "license": "MIT",
      "dependencies": {
        "ansi-escapes": "^4.2.1",
        "supports-hyperlinks": "^2.0.0"
      },
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/terser": {
      "version": "5.46.1",
      "resolved": "https://registry.npmjs.org/terser/-/terser-5.46.1.tgz",
      "integrity": "sha512-vzCjQO/rgUuK9sf8VJZvjqiqiHFaZLnOiimmUuOKODxWL8mm/xua7viT7aqX7dgPY60otQjUotzFMmCB4VdmqQ==",
      "license": "BSD-2-Clause",
      "dependencies": {
        "@jridgewell/source-map": "^0.3.3",
        "acorn": "^8.15.0",
        "commander": "^2.20.0",
        "source-map-support": "~0.5.20"
      },
      "bin": {
        "terser": "bin/terser"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/terser/node_modules/commander": {
      "version": "2.20.3",
      "resolved": "https://registry.npmjs.org/commander/-/commander-2.20.3.tgz",
      "integrity": "sha512-GpVkmM8vF2vQUkj2LvZmD35JxeJOLCwJ9cUkugyk2nuhbv3+mJvpLYYt+0+USMxE+oj+ey/lJEnhZw75x/OMcQ==",
      "license": "MIT"
    },
    "node_modules/throat": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/throat/-/throat-5.0.0.tgz",
      "integrity": "sha512-fcwX4mndzpLQKBS1DVYhGAcYaYt7vsHNIvQV+WXMvnow5cgjPphq5CaayLaGsjRdSCKZFNGt7/GYAuXaNOiYCA==",
      "license": "MIT"
    },
    "node_modules/tinyglobby": {
      "version": "0.2.17",
      "resolved": "https://registry.npmjs.org/tinyglobby/-/tinyglobby-0.2.17.tgz",
      "integrity": "sha512-wXR/dYpcqKmfWpEdZjiKJOwCNFndD0DMnrW/cYjVGttEkBfVgcLFHoNrlj47mjOVic9yyNu65alsgF4NQyTa2g==",
      "license": "MIT",
      "dependencies": {
        "fdir": "^6.5.0",
        "picomatch": "^4.0.4"
      },
      "engines": {
        "node": ">=12.0.0"
      },
      "funding": {
        "url": "https://github.com/sponsors/SuperchupuDev"
      }
    },
    "node_modules/tinyglobby/node_modules/fdir": {
      "version": "6.5.0",
      "resolved": "https://registry.npmjs.org/fdir/-/fdir-6.5.0.tgz",
      "integrity": "sha512-tIbYtZbucOs0BRGqPJkshJUYdL+SDH7dVM8gjy+ERp3WAUjLEFJE+02kanyHtwjWOnwrKYBiwAmM0p4kLJAnXg==",
      "license": "MIT",
      "engines": {
        "node": ">=12.0.0"
      },
      "peerDependencies": {
        "picomatch": "^3 || ^4"
      },
      "peerDependenciesMeta": {
        "picomatch": {
          "optional": true
        }
      }
    },
    "node_modules/tinyglobby/node_modules/picomatch": {
      "version": "4.0.7",
      "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-4.0.7.tgz",
      "integrity": "sha512-qcJu88Q2IWqJsDD529JKMdwGm/dvInW4HvQnRwiH9JtihJvzGOscDtHE3x1pBKeUOTysQ8kVmLnJ2kJu7yhcGA==",
      "license": "MIT",
      "peer": true,
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/sponsors/jonschlinkert"
      }
    },
    "node_modules/tmpl": {
      "version": "1.0.5",
      "resolved": "https://registry.npmjs.org/tmpl/-/tmpl-1.0.5.tgz",
      "integrity": "sha512-3f0uOEAQwIqGuWW2MVzYg8fV/QNnc/IpuJNG837rLuczAaLVHslWHZQj4IGiEl5Hs3kkbhwL9Ab7Hrsmuj+Smw==",
      "license": "BSD-3-Clause"
    },
    "node_modules/to-regex-range": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/to-regex-range/-/to-regex-range-5.0.1.tgz",
      "integrity": "sha512-65P7iz6X5yEr1cwcgvQxbbIw7Uk3gOy5dIdtZ4rDveLqhrdJP+Li/Hx6tyK0NEb+2GCyneCMJiGqrADCSNk8sQ==",
      "license": "MIT",
      "dependencies": {
        "is-number": "^7.0.0"
      },
      "engines": {
        "node": ">=8.0"
      }
    },
    "node_modules/toidentifier": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/toidentifier/-/toidentifier-1.0.1.tgz",
      "integrity": "sha512-o5sSPKEkg/DIQNmH43V0/uerLrpzVedkUh8tGNvaeXpfpuwjKenlSox/2O/BTlZUtEe+JG7s5YhEz608PlAHRA==",
      "license": "MIT",
      "engines": {
        "node": ">=0.6"
      }
    },
    "node_modules/toqr": {
      "version": "0.1.1",
      "resolved": "https://registry.npmjs.org/toqr/-/toqr-0.1.1.tgz",
      "integrity": "sha512-FWAPzCIHZHnrE/5/w9MPk0kK25hSQSH2IKhYh9PyjS3SG/+IEMvlwIHbhz+oF7xl54I+ueZlVnMjyzdSwLmAwA==",
      "license": "MIT"
    },
    "node_modules/tr46": {
      "version": "0.0.3",
      "resolved": "https://registry.npmjs.org/tr46/-/tr46-0.0.3.tgz",
      "integrity": "sha512-N3WMsuqV66lT30CrXNbEjx4GEwlow3v6rr4mCcv6prnfwhS01rkgyFdjPNBYd9br7LpXV1+Emh01fHnq2Gdgrw==",
      "license": "MIT"
    },
    "node_modules/type-fest": {
      "version": "0.7.1",
      "resolved": "https://registry.npmjs.org/type-fest/-/type-fest-0.7.1.tgz",
      "integrity": "sha512-Ne2YiiGN8bmrmJJEuTWTLJR32nh/JdL1+PSicowtNb0WFpn59GK8/lfD61bVtzguz7b3PBt74nxpv/Pw5po5Rg==",
      "license": "(MIT OR CC0-1.0)",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/ua-parser-js": {
      "version": "1.0.41",
      "resolved": "https://registry.npmjs.org/ua-parser-js/-/ua-parser-js-1.0.41.tgz",
      "integrity": "sha512-LbBDqdIC5s8iROCUjMbW1f5dJQTEFB1+KO9ogbvlb3nm9n4YHa5p4KTvFPWvh2Hs8gZMBuiB1/8+pdfe/tDPug==",
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/ua-parser-js"
        },
        {
          "type": "paypal",
          "url": "https://paypal.me/faisalman"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/faisalman"
        }
      ],
      "license": "MIT",
      "bin": {
        "ua-parser-js": "script/cli.js"
      },
      "engines": {
        "node": "*"
      }
    },
    "node_modules/undici-types": {
      "version": "7.18.2",
      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-7.18.2.tgz",
      "integrity": "sha512-AsuCzffGHJybSaRrmr5eHr81mwJU3kjw6M+uprWvCXiNeN9SOGwQ3Jn8jb8m3Z6izVgknn1R0FTCEAP2QrLY/w==",
      "license": "MIT"
    },
    "node_modules/unicode-canonical-property-names-ecmascript": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/unicode-canonical-property-names-ecmascript/-/unicode-canonical-property-names-ecmascript-2.0.1.tgz",
      "integrity": "sha512-dA8WbNeb2a6oQzAQ55YlT5vQAWGV9WXOsi3SskE3bcCdM0P4SDd+24zS/OCacdRq5BkdsRj9q3Pg6YyQoxIGqg==",
      "license": "MIT",
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/unicode-match-property-ecmascript": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/unicode-match-property-ecmascript/-/unicode-match-property-ecmascript-2.0.0.tgz",
      "integrity": "sha512-5kaZCrbp5mmbz5ulBkDkbY0SsPOjKqVS35VpL9ulMPfSl0J0Xsm+9Evphv9CoIZFwre7aJoa94AY6seMKGVN5Q==",
      "license": "MIT",
      "dependencies": {
        "unicode-canonical-property-names-ecmascript": "^2.0.0",
        "unicode-property-aliases-ecmascript": "^2.0.0"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/unicode-match-property-value-ecmascript": {
      "version": "2.2.1",
      "resolved": "https://registry.npmjs.org/unicode-match-property-value-ecmascript/-/unicode-match-property-value-ecmascript-2.2.1.tgz",
      "integrity": "sha512-JQ84qTuMg4nVkx8ga4A16a1epI9H6uTXAknqxkGF/aFfRLw1xC/Bp24HNLaZhHSkWd3+84t8iXnp1J0kYcZHhg==",
      "license": "MIT",
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/unicode-property-aliases-ecmascript": {
      "version": "2.2.0",
      "resolved": "https://registry.npmjs.org/unicode-property-aliases-ecmascript/-/unicode-property-aliases-ecmascript-2.2.0.tgz",
      "integrity": "sha512-hpbDzxUY9BFwX+UeBnxv3Sh1q7HFxj48DTmXchNgRa46lO8uj3/1iEn3MiNUYTg1g9ctIqXCCERn8gYZhHC5lQ==",
      "license": "MIT",
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/unpipe": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/unpipe/-/unpipe-1.0.0.tgz",
      "integrity": "sha512-pjy2bYhSsufwWlKwPc+l3cN7+wuJlK6uz0YdJEOlQDbl6jo/YlPi4mb8agUkVC8BF7V8NuzeyPNqRksA3hztKQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/update-browserslist-db": {
      "version": "1.3.1",
      "resolved": "https://registry.npmjs.org/update-browserslist-db/-/update-browserslist-db-1.3.1.tgz",
      "integrity": "sha512-ZZ61DsRsOnakl74HAmp3oSN4aXUmEWXf+i/yv0h7tIBfICc3VdrFErQKUUKPgu3AMsTUMbcongALEN4l6GSUrQ==",
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/browserslist"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/browserslist"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "escalade": "^3.2.0",
        "picocolors": "^1.1.1"
      },
      "bin": {
        "update-browserslist-db": "cli.js"
      },
      "peerDependencies": {
        "browserslist": ">= 4.21.0"
      }
    },
    "node_modules/use-latest-callback": {
      "version": "0.2.6",
      "resolved": "https://registry.npmjs.org/use-latest-callback/-/use-latest-callback-0.2.6.tgz",
      "integrity": "sha512-FvRG9i1HSo0wagmX63Vrm8SnlUU3LMM3WyZkQ76RnslpBrX694AdG4A0zQBx2B3ZifFA0yv/BaEHGBnEax5rZg==",
      "license": "MIT",
      "peerDependencies": {
        "react": ">=16.8"
      }
    },
    "node_modules/use-sync-external-store": {
      "version": "1.6.0",
      "resolved": "https://registry.npmjs.org/use-sync-external-store/-/use-sync-external-store-1.6.0.tgz",
      "integrity": "sha512-Pp6GSwGP/NrPIrxVFAIkOQeyw8lFenOHijQWkUTrDvrF4ALqylP2C/KCkeS9dpUM3KvYRQhna5vt7IL95+ZQ9w==",
      "license": "MIT",
      "peerDependencies": {
        "react": "^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0"
      }
    },
    "node_modules/utils-merge": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/utils-merge/-/utils-merge-1.0.1.tgz",
      "integrity": "sha512-pMZTvIkT1d+TFGvDOqodOclx0QWkkgi6Tdoa8gC8ffGAAqz9pzPTZWAybbsHHoED/ztMtkv/VoYTYyShUn81hA==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4.0"
      }
    },
    "node_modules/uuid": {
      "version": "7.0.3",
      "resolved": "https://registry.npmjs.org/uuid/-/uuid-7.0.3.tgz",
      "integrity": "sha512-DPSke0pXhTZgoF/d+WSt2QaKMCFSfx7QegxEWT+JOuHF5aWrKEn0G+ztjuJg/gG8/ItK+rbPCD/yNv8yyih6Cg==",
      "deprecated": "uuid@10 and below is no longer supported.  For ESM codebases, update to uuid@latest.  For CommonJS codebases, use uuid@11 (but be aware this version will likely be deprecated in 2028).",
      "license": "MIT",
      "bin": {
        "uuid": "dist/bin/uuid"
      }
    },
    "node_modules/validate-npm-package-name": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/validate-npm-package-name/-/validate-npm-package-name-5.0.1.tgz",
      "integrity": "sha512-OljLrQ9SQdOUqTaQxqL5dEfZWrXExyyWsozYlAWFawPVNuD83igl7uJD2RTkNMbniIYgt8l81eCJGIdQF7avLQ==",
      "license": "ISC",
      "engines": {
        "node": "^14.17.0 || ^16.13.0 || >=18.0.0"
      }
    },
    "node_modules/vary": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/vary/-/vary-1.1.2.tgz",
      "integrity": "sha512-BNGbWLfd0eUPabhkXUVm0j8uuvREyTh5ovRa/dyow/BqAbZJyC+5fU+IzQOzmAKzYqYRAISoRhdQr3eIZ/PXqg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/vlq": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/vlq/-/vlq-1.0.1.tgz",
      "integrity": "sha512-gQpnTgkubC6hQgdIcRdYGDSDc+SaujOdyesZQMv6JlfQee/9Mp0Qhnys6WxDWvQnL5WZdT7o2Ul187aSt0Rq+w==",
      "license": "MIT"
    },
    "node_modules/walker": {
      "version": "1.0.8",
      "resolved": "https://registry.npmjs.org/walker/-/walker-1.0.8.tgz",
      "integrity": "sha512-ts/8E8l5b7kY0vlWLewOkDXMmPdLcVV4GmOQLyxuSswIJsweeFZtAsMF7k1Nszz+TYBQrlYRmzOnr398y1JemQ==",
      "license": "Apache-2.0",
      "dependencies": {
        "makeerror": "1.0.12"
      }
    },
    "node_modules/warn-once": {
      "version": "0.1.1",
      "resolved": "https://registry.npmjs.org/warn-once/-/warn-once-0.1.1.tgz",
      "integrity": "sha512-VkQZJbO8zVImzYFteBXvBOZEl1qL175WH8VmZcxF2fZAoudNhNDvHi+doCaAEdU2l2vtcIwa2zn0QK5+I1HQ3Q==",
      "license": "MIT"
    },
    "node_modules/wcwidth": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/wcwidth/-/wcwidth-1.0.1.tgz",
      "integrity": "sha512-XHPEwS0q6TaxcvG85+8EYkbiCux2XtWG2mkc47Ng2A77BQu9+DqIOJldST4HgPkuea7dvKSj5VgX3P1d4rW8Tg==",
      "license": "MIT",
      "dependencies": {
        "defaults": "^1.0.3"
      }
    },
    "node_modules/whatwg-fetch": {
      "version": "3.6.20",
      "resolved": "https://registry.npmjs.org/whatwg-fetch/-/whatwg-fetch-3.6.20.tgz",
      "integrity": "sha512-EqhiFU6daOA8kpjOWTL0olhVOF3i7OrFzSYiGsEMB8GcXS+RrzauAERX65xMeNWVqxA6HXH2m69Z9LaKKdisfg==",
      "license": "MIT"
    },
    "node_modules/whatwg-url": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/whatwg-url/-/whatwg-url-5.0.0.tgz",
      "integrity": "sha512-saE57nupxk6v3HY35+jzBwYa0rKSy0XR8JSxZPwgLr7ys0IBzhGviA1/TUGJLmSVqs8pb9AnvICXEuOHLprYTw==",
      "license": "MIT",
      "dependencies": {
        "tr46": "~0.0.3",
        "webidl-conversions": "^3.0.0"
      }
    },
    "node_modules/whatwg-url-minimum": {
      "version": "0.1.2",
      "resolved": "https://registry.npmjs.org/whatwg-url-minimum/-/whatwg-url-minimum-0.1.2.tgz",
      "integrity": "sha512-XPEm0XFQWNVG292lII1PrRRJl3sItrs7CettZ4ncYxuDVpLyy+NwlGyut2hXI0JswcJUxeCH+CyOJK0ZzAXD6A==",
      "license": "MIT"
    },
    "node_modules/whatwg-url/node_modules/webidl-conversions": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/webidl-conversions/-/webidl-conversions-3.0.1.tgz",
      "integrity": "sha512-2JAn3z8AR6rjK8Sm8orRC0h/bcl/DqL7tRPdGZ4I1CjdF+EaMLmYxBHyXuKL849eucPFhvBoxMsflfOb8kxaeQ==",
      "license": "BSD-2-Clause"
    },
    "node_modules/which": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/which/-/which-2.0.2.tgz",
      "integrity": "sha512-BLI3Tl1TW3Pvl70l3yq3Y64i+awpwXqsGBYWkkqMtnbXgrMD+yj7rhW0kuEDxzJaYXGjEW5ogapKNMEKNMjibA==",
      "license": "ISC",
      "dependencies": {
        "isexe": "^2.0.0"
      },
      "bin": {
        "node-which": "bin/node-which"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/wrap-ansi": {
      "version": "7.0.0",
      "resolved": "https://registry.npmjs.org/wrap-ansi/-/wrap-ansi-7.0.0.tgz",
      "integrity": "sha512-YVGIj2kamLSTxw6NsZjoBxfSwsn0ycdesmc4p+Q21c5zPuZ1pl+NfxVdxPtdHvmNVOQ6XSYG4AUtyt/Fi7D16Q==",
      "license": "MIT",
      "dependencies": {
        "ansi-styles": "^4.0.0",
        "string-width": "^4.1.0",
        "strip-ansi": "^6.0.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/chalk/wrap-ansi?sponsor=1"
      }
    },
    "node_modules/ws": {
      "version": "7.5.10",
      "resolved": "https://registry.npmjs.org/ws/-/ws-7.5.10.tgz",
      "integrity": "sha512-+dbF1tHwZpXcbOJdVOkzLDxZP1ailvSxM6ZweXTegylPny803bFhA+vqBYw4s31NSAk4S2Qz+AKXK9a4wkdjcQ==",
      "license": "MIT",
      "engines": {
        "node": ">=8.3.0"
      },
      "peerDependencies": {
        "bufferutil": "^4.0.1",
        "utf-8-validate": "^5.0.2"
      },
      "peerDependenciesMeta": {
        "bufferutil": {
          "optional": true
        },
        "utf-8-validate": {
          "optional": true
        }
      }
    },
    "node_modules/xcode": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/xcode/-/xcode-3.0.1.tgz",
      "integrity": "sha512-kCz5k7J7XbJtjABOvkc5lJmkiDh8VhjVCGNiqdKCscmVpdVUpEAyXv1xmCLkQJ5dsHqx3IPO4XW+NTDhU/fatA==",
      "license": "Apache-2.0",
      "dependencies": {
        "simple-plist": "^1.1.0",
        "uuid": "^7.0.3"
      },
      "engines": {
        "node": ">=10.0.0"
      }
    },
    "node_modules/xml2js": {
      "version": "0.6.0",
      "resolved": "https://registry.npmjs.org/xml2js/-/xml2js-0.6.0.tgz",
      "integrity": "sha512-eLTh0kA8uHceqesPqSE+VvO1CDDJWMwlQfB6LuN6T8w6MaDJ8Txm8P7s5cHD0miF0V+GGTZrDQfxPZQVsur33w==",
      "license": "MIT",
      "dependencies": {
        "sax": ">=0.6.0",
        "xmlbuilder": "~11.0.0"
      },
      "engines": {
        "node": ">=4.0.0"
      }
    },
    "node_modules/xml2js/node_modules/xmlbuilder": {
      "version": "11.0.1",
      "resolved": "https://registry.npmjs.org/xmlbuilder/-/xmlbuilder-11.0.1.tgz",
      "integrity": "sha512-fDlsI/kFEx7gLvbecc0/ohLG50fugQp8ryHzMTuW9vSa1GJ0XYWKnhsUx7oie3G98+r56aTQIUB4kht42R3JvA==",
      "license": "MIT",
      "engines": {
        "node": ">=4.0"
      }
    },
    "node_modules/xmlbuilder": {
      "version": "15.1.1",
      "resolved": "https://registry.npmjs.org/xmlbuilder/-/xmlbuilder-15.1.1.tgz",
      "integrity": "sha512-yMqGBqtXyeN1e3TGYvgNgDVZ3j84W4cwkOXQswghol6APgZWaff9lnbvN7MHYJOiXsvGPXtjTYJEiC9J2wv9Eg==",
      "license": "MIT",
      "engines": {
        "node": ">=8.0"
      }
    },
    "node_modules/y18n": {
      "version": "5.0.8",
      "resolved": "https://registry.npmjs.org/y18n/-/y18n-5.0.8.tgz",
      "integrity": "sha512-0pfFzegeDWJHJIAmTLRP2DwHjdF5s7jo9tuztdQxAhINCdvS+3nGINqPd00AphqJR/0LhANUS6/+7SCb98YOfA==",
      "license": "ISC",
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/yallist": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/yallist/-/yallist-3.1.1.tgz",
      "integrity": "sha512-a4UGQaWPH59mOXUYnAG2ewncQS4i4F43Tv3JoAM+s2VDAmS9NsK8GpDMLrCHPksFT7h3K6TOoUNn2pb7RoXx4g==",
      "license": "ISC"
    },
    "node_modules/yaml": {
      "version": "2.8.3",
      "resolved": "https://registry.npmjs.org/yaml/-/yaml-2.8.3.tgz",
      "integrity": "sha512-AvbaCLOO2Otw/lW5bmh9d/WEdcDFdQp2Z2ZUH3pX9U2ihyUY0nvLv7J6TrWowklRGPYbB/IuIMfYgxaCPg5Bpg==",
      "license": "ISC",
      "bin": {
        "yaml": "bin.mjs"
      },
      "engines": {
        "node": ">= 14.6"
      },
      "funding": {
        "url": "https://github.com/sponsors/eemeli"
      }
    },
    "node_modules/yargs": {
      "version": "17.7.2",
      "resolved": "https://registry.npmjs.org/yargs/-/yargs-17.7.2.tgz",
      "integrity": "sha512-7dSzzRQ++CKnNI/krKnYRV7JKKPUXMEh61soaHKg9mrWEhzFWhFnxPxGl+69cD1Ou63C13NUPCnmIcrvqCuM6w==",
      "license": "MIT",
      "dependencies": {
        "cliui": "^8.0.1",
        "escalade": "^3.1.1",
        "get-caller-file": "^2.0.5",
        "require-directory": "^2.1.1",
        "string-width": "^4.2.3",
        "y18n": "^5.0.5",
        "yargs-parser": "^21.1.1"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/yargs-parser": {
      "version": "21.1.1",
      "resolved": "https://registry.npmjs.org/yargs-parser/-/yargs-parser-21.1.1.tgz",
      "integrity": "sha512-tVpsJW7DdjecAiFpbIB1e3qxIQsE6NoPc5/eTdrbbIC4h0LVsWhnoa3g+m2HclBIujHzsxZ4VJVA+GUuc2/LBw==",
      "license": "ISC",
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/zod": {
      "version": "3.25.76",
      "resolved": "https://registry.npmjs.org/zod/-/zod-3.25.76.tgz",
      "integrity": "sha512-gzUt/qt81nXsFGKIFcC3YnfEAx5NkunCfnDlvuBSSFS02bcXu4Lmea0AFIUwbLWxWPx3d9p8S5QoaujKcNQxcQ==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/colinhacks"
      }
    }
  }
}
```

## Fichier : sweeted-frontend\package.json

```json
{
  "license": "0BSD",
  "main": "index.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "@expo/vector-icons": "^15.0.3",
    "@react-native-async-storage/async-storage": "^2.2.0",
    "@react-navigation/native": "*",
    "@react-navigation/stack": "*",
    "expo": "~57.0.0",
    "expo-document-picker": "~57.0.1",
    "expo-file-system": "~57.0.7",
    "expo-font": "~57.0.3",
    "expo-image-picker": "~57.0.16",
    "expo-status-bar": "~57.0.1",
    "expo-web-browser": "~57.0.2",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "react-native": "0.86.3",
    "react-native-gesture-handler": "~2.32.0",
    "react-native-safe-area-context": "~5.7.0",
    "react-native-screens": "~4.26.0",
    "react-native-svg": "15.15.4",
    "react-native-web": "^0.21.0"
  },
  "private": true
}
```

## Fichier : sweeted-frontend\README.md

```markdown
# Sweeted Frontend

## Configuration Réseau (API)

L'application communique avec le backend via `sweeted-frontend/config/api.js`. L'URL de base s'adapte automatiquement selon l'environnement :

- **Émulateur Android :** `http://10.0.2.2:3000/api`
- **iOS Simulator / Web :** `http://localhost:3000/api`
- **Device physique :** Définir la variable d'environnement Expo `EXPO_PUBLIC_API_URL` pointant vers l'IP locale de votre machine (ex: `http://192.168.1.42:3000/api`).
```

## Fichier : yfy

```text
sweeted-frontend/
├── App.js             # Point d'entrée principal avec navigation
├── index.js           # Registration Expo
├── app.json           # Configuration Expo
├── package.json       # Dépendances
├── assets/            # Images (logo, icônes ISPM)
├── components/        # Composants réutilisables
│   ├── Post.js        # Carte de post
│   ├── ReactionButton.js # Bouton de réaction avec emojis
│   ├── profil.js      # Écran de profil
│   └── AssetExample.js
├── ecran/             # Écrans principaux
│   ├── Home/          # Accueil avec liste de posts
│   │   └── Home.js
│   ├── PostDetails/   # Détails d'un post + commentaires
│   │   └── PostDetails.js 
│   ├── Search.js      # Recherche avec historique
│   └── tabs/          # Navigation par onglets
│       └── index.js
├── user/
│   └── user.js        # Ancienne version de l'écran de login (dupliqué)
└── Untitled file.js



Bug: SSL Aiven non configuré dans db.js
visible pendant le dev front: TOUT OU RIEN : si le backend ne se connecte pas, rien ne marche
Peut attendre ?: ⛔ À vérifier maintenant (30 s) : lance le backend et appelle GET /api/posts. Si ça répond → rien à faire, passe au front. Si erreur SSL → à corriger avant tout
```

## Annexe : fichiers exclus (volontairement, avec raison)

| Fichier | Taille | Raison |
|---|---|---|
| .expo/ | ? | dossier ignore (contenu regenere/telecharge) |
| .git/ | ? | dossier ignore (contenu regenere/telecharge) |
| .vscode/ | ? | dossier ignore (contenu regenere/telecharge) |
| node_modules/ | ? | dossier ignore (contenu regenere/telecharge) |
| server-err.log | 0 o | extension ignoree (binaire/media/genere) |
| server-out.log | 7 Ko | extension ignoree (binaire/media/genere) |
| server.log | 2 Ko | extension ignoree (binaire/media/genere) |
| sweeted-backend\.env | 220 o | secret (contenu masque) |
| sweeted-backend\node_modules/ | ? | dossier ignore (contenu regenere/telecharge) |
| sweeted-backend\uploads\file-1786995572163-306771736.pdf | 680 Ko | extension ignoree (binaire/media/genere) |
| sweeted-backend\uploads\mjGoku.jpg | 44 Ko | extension ignoree (binaire/media/genere) |
| sweeted-backend\uploads\post-1789127835384-339413324.jpeg | 14 o | extension ignoree (binaire/media/genere) |
| sweeted-backend\uploads\post-1789127897864-517975702.jpeg | 14 o | extension ignoree (binaire/media/genere) |
| sweeted-backend\uploads\post-1789145043417-82198511.jpeg | 33 Ko | extension ignoree (binaire/media/genere) |
| sweeted-backend\web-err.log | 0 o | extension ignoree (binaire/media/genere) |
| sweeted-backend\web-out.log | 0 o | extension ignoree (binaire/media/genere) |
| sweeted-frontend\.expo/ | ? | dossier ignore (contenu regenere/telecharge) |
| sweeted-frontend\8ltEY16Q.jpg | 77 Ko | extension ignoree (binaire/media/genere) |
| sweeted-frontend\assets\adaptive-icon.png | 17 Ko | extension ignoree (binaire/media/genere) |
| sweeted-frontend\assets\favicon.png | 1 Ko | extension ignoree (binaire/media/genere) |
| sweeted-frontend\assets\icon.png | 22 Ko | extension ignoree (binaire/media/genere) |
| sweeted-frontend\assets\ispm.png | 381 Ko | extension ignoree (binaire/media/genere) |
| sweeted-frontend\assets\maPolice\police.ttf | 530 o | extension ignoree (binaire/media/genere) |
| sweeted-frontend\assets\snack-icon.png | 13 Ko | extension ignoree (binaire/media/genere) |
| sweeted-frontend\assets\splash-icon.png | 17 Ko | extension ignoree (binaire/media/genere) |
| sweeted-frontend\node_modules/ | ? | dossier ignore (contenu regenere/telecharge) |
| sweeted-frontend\sweeted_logo-no_background.png | 85 Ko | extension ignoree (binaire/media/genere) |
| sweeted-frontend\web-out.log | 3 Ko | extension ignoree (binaire/media/genere) |
