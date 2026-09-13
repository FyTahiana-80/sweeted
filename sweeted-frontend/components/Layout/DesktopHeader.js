import React, { useMemo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SPACING, RADIUS, SHADOWS, FONTS } from '../../config/theme';
import { useTheme } from '../../context/ThemeContext';

const ETUDIANT = 'etudiant';
const OFFICIEL = 'officiel';

/**
 * En-tête Desktop (largeur >= 768px).
 * Propose la barre de recherche globale, le toggle de mode et les accès rapides (notifications, profil).
 */
const DesktopHeader = ({
  mode,
  onSetMode,
  onOpenSearch,
  unreadCount = 0,
  avatarUrl,
  navigation,
}) => {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);

  return (
    <View style={[styles.headerContainer, { backgroundColor: colors.cardBackground, borderBottomColor: colors.divider }]}>
      {/* Barre de recherche centrale */}
      <TouchableOpacity
        style={[styles.searchBar, { backgroundColor: colors.inputBackground }]}
        onPress={onOpenSearch}
        activeOpacity={0.8}
      >
        <Feather name="search" size={18} color={colors.textSecondary} style={styles.searchIcon} />
        <Text style={[styles.searchPlaceholder, { color: colors.placeholder }]}>Rechercher sur Sweeted...</Text>
      </TouchableOpacity>

      {/* Switch de mode Étudiant / Officiel (si applicable) */}
      {(mode === ETUDIANT || mode === OFFICIEL) && (
        <View style={[styles.toggleContainer, { backgroundColor: colors.toggleBackground, borderColor: colors.toggleBorder }]}>
          <TouchableOpacity
            style={[styles.toggleButton, mode === ETUDIANT && [styles.activeToggle, { backgroundColor: colors.primary }]]}
            onPress={() => onSetMode(ETUDIANT)}
            activeOpacity={0.8}
          >
            <Text style={mode === ETUDIANT ? [styles.activeToggleText, { color: colors.onPrimary }] : [styles.toggleText, { color: colors.textDark }]}>
              Étudiant
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, mode === OFFICIEL && [styles.activeToggle, { backgroundColor: colors.primary }]]}
            onPress={() => onSetMode(OFFICIEL)}
            activeOpacity={0.8}
          >
            <Text style={mode === OFFICIEL ? [styles.activeToggleText, { color: colors.onPrimary }] : [styles.toggleText, { color: colors.textDark }]}>
              Officiel
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Actions à droite */}
      <View style={styles.actionsRight}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation?.navigate('Notifications')}
          activeOpacity={0.7}
        >
          <Feather name="bell" size={20} color={colors.textDark} />
          {unreadCount > 0 && (
            <View style={[styles.badge, { backgroundColor: colors.danger }]}>
              <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.profileBtn}
          onPress={() => navigation?.navigate('Profile')}
          activeOpacity={0.7}
        >
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: colors.inputBackground }]}>
              <Feather name="user" size={18} color={colors.textDark} />
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DesktopHeader;

const getStyles = (colors) => StyleSheet.create({
  headerContainer: {
    height: 64,
    backgroundColor: colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    zIndex: 10,
    ...SHADOWS.small,
  },
  searchBar: {
    flex: 1,
    maxWidth: 420,
    height: 40,
    backgroundColor: colors.inputBackground,
    borderRadius: RADIUS.full,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchPlaceholder: {
    color: colors.placeholder,
    fontSize: FONTS.sizeBody,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.toggleBackground,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: colors.toggleBorder,
    overflow: 'hidden',
    marginHorizontal: SPACING.lg,
  },
  toggleButton: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.full,
  },
  activeToggle: {
    backgroundColor: colors.toggleActive,
  },
  activeToggleText: {
    fontSize: FONTS.sizeBody,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  toggleText: {
    fontSize: FONTS.sizeBody,
    color: colors.textPrimary,
  },
  actionsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.full,
    backgroundColor: colors.screenBackground,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  profileBtn: {
    marginLeft: SPACING.xs,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  avatarPlaceholder: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.screenBackground,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.divider,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: colors.danger,
    borderRadius: RADIUS.full,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: colors.onPrimary,
    fontSize: 9,
    fontWeight: 'bold',
  },
});
