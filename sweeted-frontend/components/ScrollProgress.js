import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';

const SIZE = 60;
const STROKE = 6;
const R = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * R;
const CENTER = SIZE / 2;

// Anneau circulaire de progression du scroll avec pourcentage.
export default function ScrollProgress({ progress }) {
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const p = Math.min(1, Math.max(0, progress || 0));
  const pct = Math.round(p * 100);
  return (
    <View style={styles.wrap} pointerEvents="none">
      <Svg width={SIZE} height={SIZE}>
        <Circle cx={CENTER} cy={CENTER} r={R} stroke={colors.divider} strokeWidth={STROKE} fill="none" />
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={R}
          stroke={colors.primary}
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

const getStyles = (colors) => StyleSheet.create({
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
    color: colors.textDark,
  },
});
