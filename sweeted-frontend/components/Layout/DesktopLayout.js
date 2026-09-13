import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Sidebar from './Sidebar';
import DesktopHeader from './DesktopHeader';
import { useTheme } from '../../context/ThemeContext';

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
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);

  return (
    <View style={[styles.desktopContainer, { backgroundColor: colors.screenBackground }]}>
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

        <View style={[styles.contentArea, { backgroundColor: colors.screenBackground }]}>
          {children}
        </View>
      </View>
    </View>
  );
};

export default DesktopLayout;

const getStyles = (colors) => StyleSheet.create({
  desktopContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.screenBackground,
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
    backgroundColor: colors.screenBackground,
  },
});
