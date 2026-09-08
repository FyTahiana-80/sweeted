import { Platform } from 'react-native';

const getApiUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
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
