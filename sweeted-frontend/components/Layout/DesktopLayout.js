import React from 'react';
import { StyleSheet, View } from 'react-native';
import Sidebar from './Sidebar';
import DesktopHeader from './DesktopHeader';
import { COLORS } from '../../config/theme';

/**
 * Conteneur global pour l'affichage Desktop (>= 768px).
 * Structure l'écran en deux colonnes : Sidebar à gauche, Contenu & Header à droite.
 */
const DesktopLayout = ({
  currentMode,
  onSelectMode,
  onOpenCreatePost,
  onOpenSearch,
  unreadCount,
  avatarUrl,
  navigation,
  children,
}) => {
  return (
    <View style={styles.desktopContainer}>
      {/* 1. Colonne de gauche : Sidebar fixe */}
      <Sidebar
        currentMode={currentMode}
        onSelectMode={onSelectMode}
        onOpenCreatePost={onOpenCreatePost}
        unreadCount={unreadCount}
        avatarUrl={avatarUrl}
        navigation={navigation}
      />

      {/* 2. Colonne de droite : En-tête + Zone de contenu */}
      <View style={styles.mainColumn}>
        <DesktopHeader
          mode={currentMode}
          onSetMode={onSelectMode}
          onOpenSearch={onOpenSearch}
          unreadCount={unreadCount}
          avatarUrl={avatarUrl}
          navigation={navigation}
        />

        <View style={styles.contentArea}>
          {children}
        </View>
      </View>
    </View>
  );
};

export default DesktopLayout;

const styles = StyleSheet.create({
  desktopContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.screenBackground,
    height: '100%',
    width: '100%',
  },
  mainColumn: {
    flex: 1,
    flexDirection: 'column',
    height: '100%',
    minWidth: 0,
  },
  contentArea: {
    flex: 1,
    minHeight: 0,
    backgroundColor: COLORS.screenBackground,
  },
});
