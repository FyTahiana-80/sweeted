import React, { useMemo, useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { RADIUS } from '../config/theme';

/**
 * Carrousel d'images : une seule image visible à la fois,
 * flèche gauche = précédent, flèche droite = suivant.
 * Les flèches + le compteur n'apparaissent que s'il y a plusieurs images.
 */
export default function OfficialCarousel({ images = [], height, onPressImage }) {
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const [index, setIndex] = useState(0);

  const list = Array.isArray(images) ? images.filter(Boolean) : [];
  const count = list.length;

  useEffect(() => {
    setIndex(0);
  }, [(list || []).join('|')]);

  if (count === 0) return null;

  const safeIndex = Math.min(index, count - 1);
  const goPrev = () => setIndex((safeIndex - 1 + count) % count);
  const goNext = () => setIndex((safeIndex + 1) % count);
  const boxHeight = height || (Platform.OS === 'web' ? 320 : 220);

  return (
    <View style={[styles.container, { height: boxHeight }]}>
      <TouchableOpacity
        activeOpacity={0.95}
        style={styles.imageTouch}
        onPress={() => onPressImage && onPressImage(safeIndex)}
        disabled={!onPressImage}
      >
        <Image
          source={{ uri: list[safeIndex] }}
          style={styles.image}
          resizeMode={Platform.OS === 'web' ? 'contain' : 'cover'}
        />
      </TouchableOpacity>

      {count > 1 ? (
        <>
          <TouchableOpacity style={[styles.arrow, styles.arrowLeft]} onPress={goPrev} activeOpacity={0.8}>
            <Icon name="chevron-left" size={30} color={colors.onPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.arrow, styles.arrowRight]} onPress={goNext} activeOpacity={0.8}>
            <Icon name="chevron-right" size={30} color={colors.onPrimary} />
          </TouchableOpacity>
          <View style={styles.counter}>
            <Text style={styles.counterText}>{`${safeIndex + 1} / ${count}`}</Text>
          </View>
        </>
      ) : null}
    </View>
  );
}

const getStyles = (colors) => StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: RADIUS.lg,
    backgroundColor: colors.inputBackground,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 12,
  },
  imageTouch: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  arrow: {
    position: 'absolute',
    top: '50%',
    marginTop: -22,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  arrowLeft: {
    left: 8,
  },
  arrowRight: {
    right: 8,
  },
  counter: {
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
    zIndex: 5,
  },
  counterText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
});
