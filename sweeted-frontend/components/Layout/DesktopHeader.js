import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS, FONTS } from '../../config/theme';

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
  return (
    <View style={styles.headerContainer}>
      {/* Barre de recherche centrale */}
      <TouchableOpacity
        style={styles.searchBar}
        onPress={onOpenSearch}
        activeOpacity={0.8}
      >
        <Feather name="search" size={18} color={COLORS.textSecondary} style={styles.searchIcon} />
        <Text style={styles.searchPlaceholder}>Rechercher sur Sweeted...</Text>
      </TouchableOpacity>

      {/* Switch de mode Étudiant / Officiel (si applicable) */}
      {(mode === ETUDIANT || mode === OFFICIEL) && (
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, mode === ETUDIANT && styles.activeToggle]}
            onPress={() => onSetMode(ETUDIANT)}
            activeOpacity={0.8}
          >
            <Text style={mode === ETUDIANT ? styles.activeToggleText : styles.toggleText}>
              Étudiant
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, mode === OFFICIEL && styles.activeToggle]}
            onPress={() => onSetMode(OFFICIEL)}
            activeOpacity={0.8}
          >
            <Text style={mode === OFFICIEL ? styles.activeToggleText : styles.toggleText}>
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
          <Feather name="bell" size={20} color={COLORS.textDark} />
          {unreadCount > 0 && (
            <View style={styles.badge}>
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
            <View style={styles.avatarPlaceholder}>
              <Feather name="user" size={18} color={COLORS.textDark} />
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DesktopHeader;

const styles = StyleSheet.create({
  headerContainer: {
    height: 64,
    backgroundColor: COLORS.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
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
    backgroundColor: COLORS.inputBackground,
    borderRadius: RADIUS.full,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchPlaceholder: {
    color: COLORS.placeholder,
    fontSize: FONTS.sizeBody,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.toggleBackground,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.toggleBorder,
    overflow: 'hidden',
    marginHorizontal: SPACING.lg,
  },
  toggleButton: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.full,
  },
  activeToggle: {
    backgroundColor: COLORS.toggleActive,
  },
  activeToggleText: {
    fontSize: FONTS.sizeBody,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  toggleText: {
    fontSize: FONTS.sizeBody,
    color: COLORS.black,
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
    backgroundColor: COLORS.screenBackground,
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
    borderColor: COLORS.primary,
  },
  avatarPlaceholder: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.screenBackground,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: COLORS.danger,
    borderRadius: RADIUS.full,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: 'bold',
  },
});
