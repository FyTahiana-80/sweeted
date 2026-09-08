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