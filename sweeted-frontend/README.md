# Sweeted Frontend

## Configuration Réseau (API)

L'application communique avec le backend via `sweeted-frontend/config/api.js`. L'URL de base s'adapte automatiquement selon l'environnement :

- **Émulateur Android :** `http://10.0.2.2:3000/api`
- **iOS Simulator / Web :** `http://localhost:3000/api`
- **Device physique :** Définir la variable d'environnement Expo `EXPO_PUBLIC_API_URL` pointant vers l'IP locale de votre machine (ex: `http://192.168.1.42:3000/api`).
