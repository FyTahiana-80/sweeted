import React, { useMemo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { SPACING, RADIUS, SHADOWS, FONTS } from '../../config/theme';
import { useTheme } from '../../context/ThemeContext';

const ETUDIANT = 'etudiant';
const OFFICIEL = 'officiel';
const CODE = 'code';
const FICHIERS = 'fichiers';

/**
 * Composant Sidebar pour l'affichage Desktop (largeur >= 768px).
 * Remplace la Bottom Tab Bar mobile.
 */
const Sidebar = ({
  currentMode,
  onSelectMode,
  onOpenCreatePost,
  unreadCount = 0,
  navigation,
  avatarUrl,
}) => {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);

  const navItems = [
    {
      id: ETUDIANT,
      label: 'Fil d’actualité',
      icon: 'home',
      badge: 0,
    },
    {
      id: OFFICIEL,
      label: 'Officiels',
      icon: 'volume-2',
      badge: 0,
    },
    {
      id: CODE,
      label: 'Studio',
      icon: 'code',
      badge: 0,
    },
    {
      id: FICHIERS,
      label: 'Fichiers & PDF',
      icon: 'folder',
      badge: 0,
    },
  ];

  return (
    <View style={[styles.sidebarContainer, { backgroundColor: colors.cardBackground, borderRightColor: colors.divider }]}>
      {/* En-tête de la Sidebar avec Logo */}
      <View style={[styles.logoSection, { borderBottomColor: colors.divider }]}>
        <Image
          source={require('../../sweeted_logo-no_background.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      {/* Navigation principale */}
      <View style={styles.navSection}>
        {navItems.map((item) => {
          const isActive = currentMode === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.navItem, 
                isActive && [styles.navItemActive, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : colors.toggleActive }]
              ]}
              onPress={() => onSelectMode(item.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconWrapper, { backgroundColor: colors.screenBackground }, isActive && [styles.iconWrapperActive, { backgroundColor: colors.primary }]]}>
                <Feather
                  name={item.icon}
                  size={20}
                  color={isActive ? colors.onPrimary : colors.textSecondary}
                />
              </View>
              <Text style={[styles.navLabel, { color: colors.textDark }, isActive && [styles.navLabelActive, { color: colors.primary }]]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Bouton d'action "Créer un post" (si mode étudiant ou officiel) */}
      {(currentMode === ETUDIANT || currentMode === OFFICIEL) && (
        <TouchableOpacity
          style={[styles.createPostButton, { backgroundColor: colors.primary }]}
          onPress={onOpenCreatePost}
          activeOpacity={0.85}
        >
          <Ionicons name="add-circle-outline" size={20} color={colors.onPrimary} />
          <Text style={styles.createPostButtonText}>Nouveau post</Text>
        </TouchableOpacity>
      )}

      <View style={styles.spacer} />

      {/* Raccourcis rapides bas de Sidebar */}
      <View style={[styles.footerSection, { borderTopColor: colors.divider }]}>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => navigation?.navigate('Notifications')}
          activeOpacity={0.7}
        >
          <View style={styles.footerIconWrapper}>
            <Feather name="bell" size={18} color={colors.textSecondary} />
            {unreadCount > 0 && (
              <View style={[styles.badge, { backgroundColor: colors.danger }]}>
                <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
              </View>
            )}
          </View>
          <Text style={[styles.footerLabel, { color: colors.textDark }]}>Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => navigation?.navigate('Profile')}
          activeOpacity={0.7}
        >
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={[styles.avatarImage, { backgroundColor: colors.screenBackground }]} />
          ) : (
            <View style={styles.footerIconWrapper}>
              <Feather name="user" size={18} color={colors.textSecondary} />
            </View>
          )}
          <Text style={[styles.footerLabel, { color: colors.textDark }]}>Mon Profil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Sidebar;

const getStyles = (colors) => StyleSheet.create({
  sidebarContainer: {
    width: 300,
    backgroundColor: colors.cardBackground,
    borderRightWidth: 1,
    borderRightColor: colors.divider,
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    flexDirection: 'column',
    height: '100%',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  logoImage: {
    width: 140,
    height: 70,
  },
  tagline: {
    fontSize: FONTS.sizeSmall,
    color: colors.textMuted,
    fontWeight: '500',
    marginTop: -4,
  },
  navSection: {
    gap: SPACING.sm,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.lg,
    gap: SPACING.md,
    backgroundColor: 'transparent',
  },
  navItemActive: {
    backgroundColor: colors.toggleActive,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    backgroundColor: colors.screenBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapperActive: {
    backgroundColor: colors.primary,
  },
  navLabel: {
    fontSize: FONTS.sizeBody,
    color: colors.textDark,
    fontWeight: '500',
  },
  navLabelActive: {
    fontSize: FONTS.sizeBody,
    color: colors.primaryDark,
    fontWeight: '700',
  },
  createPostButton: {
    marginTop: SPACING.xl,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.full,
    gap: SPACING.sm,
    ...SHADOWS.medium,
  },
  createPostButtonText: {
    color: colors.onPrimary,
    fontSize: FONTS.sizeBody,
    fontWeight: '700',
  },
  spacer: {
    flex: 1,
  },
  footerSection: {
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: SPACING.md,
    gap: SPACING.xs,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.md,
    gap: SPACING.md,
  },
  footerIconWrapper: {
    position: 'relative',
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.screenBackground,
  },
  footerLabel: {
    fontSize: FONTS.sizeBody,
    color: colors.textSecondary,
    fontWeight: '500',
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
