import React, { useState, useEffect, useMemo } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { apiFetch } from '../config/apiClient';
import { useTheme } from '../context/ThemeContext';

export default function ReactionButton({ total, hasReacted: initialHasReacted = false, onReact, postId }) {
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const [isReacting, setIsReacting] = useState(false);
  const [hasReacted, setHasReacted] = useState(initialHasReacted);
  const [reactionCount, setReactionCount] = useState(total);
  const [error, setError] = useState('');
  useEffect(() => { setHasReacted(initialHasReacted); }, [initialHasReacted]);
  useEffect(() => { if (typeof total === 'number') setReactionCount(total); }, [total]);

const handleToggleReact = async (e) => {
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
    setIsReacting(true);
    setError('');

    const method = hasReacted ? 'DELETE' : 'POST';
    const result = await apiFetch(`/sweets/${postId}`, {
      method,
      ...(method === 'DELETE' ? {} : { body: JSON.stringify({}) }),
    });

    if (result.ok) {
      const newHasReacted = !hasReacted;
      setHasReacted(newHasReacted);
      setReactionCount(prev => (newHasReacted ? prev + 1 : Math.max(0, prev - 1)));
      if (onReact) onReact(newHasReacted);
    } else {
      let message;
      if (result.errorType === 'auth') {
        message = 'Vous devez être connecté pour réagir.';
      } else {
        message = result.data?.message || 'Impossible d\'enregistrer la réaction.';
      }
      setError(message);
    }

    setIsReacting(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.totalContainer}>
          <Icon name="heart" size={14} color={colors.reaction} />
          <Text style={styles.totalText}>{reactionCount}</Text>
        </View>

        <TouchableOpacity
          onPress={handleToggleReact}
          disabled={isReacting}
          style={[styles.mainButton, hasReacted && styles.mainButtonActive]}
          activeOpacity={0.7}
        >
          <Icon name={hasReacted ? "heart" : "heart-outline"} size={24} color={hasReacted ? colors.danger : colors.reaction} />
          <Text style={[styles.reactText, hasReacted && styles.reactTextActive]}>
            {hasReacted ? "J'aime déjà" : "Aimer"}
          </Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const getStyles = (colors) => StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  totalText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.reaction,
  },
  mainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.inputBackground,
    gap: 8,
  },
  mainButtonActive: {
    backgroundColor: colors.danger + '1A',
  },
  reactText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  reactTextActive: {
    color: colors.danger,
  },
  errorText: {
    marginTop: 6,
    color: colors.danger,
    fontSize: 12,
    textAlign: 'center',
  },
});