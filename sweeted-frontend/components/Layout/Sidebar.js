import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS, FONTS } from '../../config/theme';

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
      label: 'Sweet Studio',
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
    <View style={styles.sidebarContainer}>
      {/* En-tête de la Sidebar avec Logo */}
      <View style={styles.logoSection}>
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
              style={[styles.navItem, isActive && styles.navItemActive]}
              onPress={() => onSelectMode(item.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconWrapper, isActive && styles.iconWrapperActive]}>
                <Feather
                  name={item.icon}
                  size={20}
                  color={isActive ? COLORS.white : COLORS.textSecondary}
                />
              </View>
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Bouton d'action "Créer un post" (si mode étudiant ou officiel) */}
      {(currentMode === ETUDIANT || currentMode === OFFICIEL) && (
        <TouchableOpacity
          style={styles.createPostButton}
          onPress={onOpenCreatePost}
          activeOpacity={0.85}
        >
          <Ionicons name="add-circle-outline" size={20} color={COLORS.white} />
          <Text style={styles.createPostButtonText}>Nouveau post</Text>
        </TouchableOpacity>
      )}

      <View style={styles.spacer} />

      {/* Raccourcis rapides bas de Sidebar */}
      <View style={styles.footerSection}>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => navigation?.navigate('Notifications')}
          activeOpacity={0.7}
        >
          <View style={styles.footerIconWrapper}>
            <Feather name="bell" size={18} color={COLORS.textSecondary} />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
              </View>
            )}
          </View>
          <Text style={styles.footerLabel}>Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => navigation?.navigate('Profile')}
          activeOpacity={0.7}
        >
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
          ) : (
            <View style={styles.footerIconWrapper}>
              <Feather name="user" size={18} color={COLORS.textSecondary} />
            </View>
          )}
          <Text style={styles.footerLabel}>Mon Profil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Sidebar;

const styles = StyleSheet.create({
  sidebarContainer: {
    width: 260,
    backgroundColor: COLORS.cardBackground,
    borderRightWidth: 1,
    borderRightColor: COLORS.divider,
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
    borderBottomColor: COLORS.divider,
  },
  logoImage: {
    width: 140,
    height: 70,
  },
  tagline: {
    fontSize: FONTS.sizeSmall,
    color: COLORS.textMuted,
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
    backgroundColor: COLORS.toggleActive,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.screenBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapperActive: {
    backgroundColor: COLORS.primary,
  },
  navLabel: {
    fontSize: FONTS.sizeBody,
    color: COLORS.textDark,
    fontWeight: '500',
  },
  navLabelActive: {
    fontSize: FONTS.sizeBody,
    color: COLORS.primaryDark,
    fontWeight: '700',
  },
  createPostButton: {
    marginTop: SPACING.xl,
    backgroundColor: COLORS.headerGreen,
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
    color: COLORS.white,
    fontSize: FONTS.sizeBody,
    fontWeight: '700',
  },
  spacer: {
    flex: 1,
  },
  footerSection: {
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
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
    backgroundColor: COLORS.screenBackground,
  },
  footerLabel: {
    fontSize: FONTS.sizeBody,
    color: COLORS.textSecondary,
    fontWeight: '500',
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
