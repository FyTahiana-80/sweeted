import React, { useEffect, useRef, useMemo } from 'react';
import { View, Image, StyleSheet, Animated, Easing } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const LOGO = require('../sweeted_logo-no_background.png');
const LOGO_WHITE = require('../sweeted_logo_no_background_white.png');

const SIZE = 300;
const BAND1 = 0.32;
const BAND2 = 0.32;

const revealStyle = (v, length) => ({
  width: v.interpolate({ inputRange: [0, 1], outputRange: [0, length] }),
});

export default function SweetedSplash({ onDone }) {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const logoSource = isDark ? LOGO_WHITE : LOGO;
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
          <Image source={logoSource} style={[styles.logoImg, { marginTop: 0 }]} />
        </Animated.View>
        <Animated.View style={[styles.band, styles.bandText, revealStyle(textW, SIZE)]}>
          <Image source={logoSource} style={[styles.logoImg, { marginTop: -SIZE * BAND1 }]} />
        </Animated.View>
        <Animated.View style={[styles.band, styles.bandBottom, revealStyle(bottomW, SIZE), { transform: [{ translateY: bottomY }] }]}>
          <Image source={logoSource} style={[styles.logoImg, { marginTop: -SIZE * (BAND1 + BAND2) }]} />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const getStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
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