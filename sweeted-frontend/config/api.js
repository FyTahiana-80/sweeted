import { Platform } from 'react-native';
import Constants from 'expo-constants';

const getApiUrl = () => {
  // 1. En mode Web (navigateur sur PC) : toujours joindre le serveur local
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.location && window.location.hostname) {
      return `http://${window.location.hostname}:3000/api`;
    }
    return 'http://localhost:3000/api';
  }

  // 2. Détection dynamique via Metro / Expo Go (s'adapte automatiquement à l'IP du PC)
  const hostUri = Constants.expoConfig?.hostUri || Constants.manifest2?.extra?.expoGo?.debuggerHost;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
      return `http://${ip}:3000/api`;
    }
  }

  // 3. Variable d'environnement explicite (.env)
  const fromEnv = (process.env.EXPO_PUBLIC_API_URL || '').trim().replace(/\/+$/,'');
  if (fromEnv) {
    return fromEnv;
  }

  // 4. Fallbacks
  if (__DEV__) {
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
