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
