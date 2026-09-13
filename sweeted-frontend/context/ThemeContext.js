import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PALETTES, getTheme } from '../config/theme';

const STORAGE_PALETTE_KEY = '@sweeted_theme_palette';
const STORAGE_DARK_KEY = '@sweeted_theme_is_dark';

const FALLBACK_COLORS = getTheme('emerald', false);

const ThemeContext = createContext({
  colors: FALLBACK_COLORS,
  isDark: false,
  palette: 'emerald',
  palettes: Object.values(PALETTES),
  setPalette: () => {},
  toggleDarkMode: () => {},
  setIsDark: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [paletteId, setPaletteId] = useState('emerald');
  const [isDark, setIsDarkState] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Charger les préférences sauvegardées au démarrage
  useEffect(() => {
    (async () => {
      try {
        const savedPalette = await AsyncStorage.getItem(STORAGE_PALETTE_KEY);
        const savedDark = await AsyncStorage.getItem(STORAGE_DARK_KEY);

        if (savedPalette && PALETTES[savedPalette]) {
          setPaletteId(savedPalette);
        }
        if (savedDark !== null) {
          setIsDarkState(savedDark === 'true');
        }
      } catch (err) {
        console.warn('Erreur chargement thème:', err);
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  // Calculer les couleurs actives (immuable — ne pas muter l'objet partagé).
  // Ne PAS utiliser Object.assign(COLORS) : les StyleSheet.create() figent
  // les valeurs à l'import, donc la mutation ne rafraîchit jamais l'UI.
  // Chaque écran doit consommer `colors` via useTheme() + styles dynamiques.
  const colors = useMemo(() => getTheme(paletteId, isDark), [paletteId, isDark]);

  const setPalette = useCallback(async (id) => {
    if (!PALETTES[id]) return;
    setPaletteId(id);
    try {
      await AsyncStorage.setItem(STORAGE_PALETTE_KEY, id);
    } catch (err) {
      console.warn('Erreur sauvegarde palette:', err);
    }
  }, []);

  const setIsDark = useCallback(async (darkValue) => {
    const nextVal = Boolean(darkValue);
    setIsDarkState(nextVal);
    try {
      await AsyncStorage.setItem(STORAGE_DARK_KEY, String(nextVal));
    } catch (err) {
      console.warn('Erreur sauvegarde mode sombre:', err);
    }
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDarkState((prev) => {
      const nextVal = !prev;
      AsyncStorage.setItem(STORAGE_DARK_KEY, String(nextVal)).catch((err) =>
        console.warn('Erreur sauvegarde mode sombre:', err)
      );
      return nextVal;
    });
  }, []);

  const value = useMemo(() => ({
    colors,
    isDark,
    palette: paletteId,
    palettes: Object.values(PALETTES),
    setPalette,
    toggleDarkMode,
    setIsDark,
    isLoaded,
  }), [colors, isDark, paletteId, isLoaded]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
