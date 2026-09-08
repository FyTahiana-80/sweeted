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
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

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
      data: { message: 'Impossible de joindre le serveur. Vérifiez votre connexion.' },
      errorType: 'network',
    };
  }
}
