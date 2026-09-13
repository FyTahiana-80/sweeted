import React, { useMemo, useState, useRef, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  ActivityIndicator,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import Home from "../Home/Home";
import Officiels from "../Officiels/Officiels";
import SearchScreen from '../Search';
import Fichiers from "../Fichiers/Fichiers";
import Studio from "../Studio/Studio";
import DesktopLayout from '../../components/Layout/DesktopLayout';
import { apiFetch } from '../../config/apiClient';
import { appendFilePart, cleanUri, imageMime } from '../../config/fileUpload';
import { API_BASE_URL } from '../../config/api';
import { SPACING, RADIUS, SHADOWS, FONTS, BREAKPOINTS } from '../../config/theme';
import { useTheme } from '../../context/ThemeContext';

const ETUDIANT = 'etudiant';
const OFFICIEL = 'officiel';
const CODE = 'code';
const FICHIERS = 'fichiers';

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => getStyles(colors, isDark), [colors, isDark]);
  const homeRef = useRef(null);

  // Détection responsive via hook natif useWindowDimensions
  const { width } = useWindowDimensions();
  // Seuil de bascule Mobile <-> Desktop fixé à 768px (contrat prompt_maitre section 4)
  const isDesktop = width >= (BREAKPOINTS?.tablet || 768);

  const [mode, setMode] = useState(ETUDIANT);
  const [isSearching, setIsSearching] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createFeedback, setCreateFeedback] = useState({ type: '', message: '' });
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const studioRef = useRef(null);
  const [studioFileToOpen, setStudioFileToOpen] = useState(null);

  const fetchHeaderData = useCallback(async () => {
    const notifResult = await apiFetch('/notifications');
    if (notifResult.ok) {
      setUnreadCount(notifResult.data?.unread_count || 0);
    }
    const meResult = await apiFetch('/auth/me');
    if (meResult.ok && meResult.data?.avatar_url) {
      setAvatarUrl(
        meResult.data.avatar_url.startsWith('http')
          ? meResult.data.avatar_url
          : `${API_BASE_URL.replace('/api', '')}${meResult.data.avatar_url}`
      );
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchHeaderData();
    }, [fetchHeaderData])
  );

  const MAX_POST_IMAGES = 20;

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setCreateFeedback({ type: 'error', message: 'Permission d\'accès à la galerie refusée.' });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const uris = result.assets.map(a => a.uri).filter(Boolean);
      setSelectedImages(prev => {
        const merged = [...prev];
        for (const uri of uris) {
          if (!merged.includes(uri)) merged.push(uri);
        }
        if (merged.length > MAX_POST_IMAGES) {
          setCreateFeedback({ type: 'error', message: `Maximum ${MAX_POST_IMAGES} images par post.` });
        }
        return merged.slice(0, MAX_POST_IMAGES);
      });
    }
  };

  const removeImage = (uri) => setSelectedImages(prev => prev.filter(u => u !== uri));

  const pickPdf = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      type: 'application/pdf',
    });
    if (!result.canceled && result.assets?.[0]) {
      setSelectedPdf(result.assets[0]);
    }
  };

  const removePdf = () => setSelectedPdf(null);

  const handleCreatePost = async () => {
    if (!postContent.trim() && selectedImages.length === 0 && !selectedPdf) {
      setCreateFeedback({ type: 'error', message: 'Veuillez écrire quelque chose, ajouter des images ou un PDF.' });
      return;
    }

    setIsCreating(true);
    setCreateFeedback({ type: '', message: '' });

    const formData = new FormData();
    formData.append('content', postContent.trim());

    for (const uri of selectedImages) {
      const rawName = String(uri).split('?')[0].split('/').pop() || 'photo.jpg';
      const upImg = await appendFilePart(formData, 'image', cleanUri(uri), rawName, imageMime(rawName));
      if (!upImg.ok) {
        setIsCreating(false);
        setCreateFeedback({ type: 'error', message: 'Lecture image impossible : ' + upImg.debug });
        return;
      }
    }

    if (selectedPdf) {
      const upPdf = await appendFilePart(formData, 'file', cleanUri(selectedPdf.uri), selectedPdf.name || 'piece-jointe.pdf', selectedPdf.mimeType || 'application/pdf');
      if (!upPdf.ok) {
        setIsCreating(false);
        setCreateFeedback({ type: 'error', message: 'Lecture PDF impossible : ' + upPdf.debug });
        return;
      }
    }

    const result = await apiFetch('/posts', {
      method: 'POST',
      body: formData,
    });

    setIsCreating(false);

    if (result.ok) {
      setPostContent('');
      setSelectedImages([]);
      setSelectedPdf(null);
      if (homeRef.current) {
        homeRef.current.refreshPosts();
      }
      setShowCreateModal(false);
      return;
    }

    let message;
    if (result.errorType === 'auth') {
      message = 'Vous devez être connecté pour publier un post.';
    } else if (result.errorType === 'validation') {
      message = result.data?.message || 'Le contenu du post est invalide.';
    } else if (result.errorType === 'server') {
      message = 'Le serveur a rencontré une erreur lors de la publication.';
    } else {
      message = result.data?.message || 'Impossible de créer le post.';
    if (result.data?.details) {
      message = `${message} (${result.data.details})`;
    }
    }

    setCreateFeedback({ type: 'error', message });
  };

  if (isSearching) {
    return <SearchScreen onBack={() => setIsSearching(false)} />;
  }

  // Rendu de l'écran actif selon le mode sélectionné
  const renderContent = () => {
    if (mode === ETUDIANT) {
      return <Home ref={homeRef} />;
    }
    if (mode === OFFICIEL) {
      return <Officiels />;
    }
    if (mode === CODE) {
      return (
        <Studio
          ref={studioRef}
          initialFileId={studioFileToOpen}
          onInitialHandled={() => setStudioFileToOpen(null)}
        />
      );
    }
    return (
      <Fichiers
        onOpenInStudio={(fileId) => {
          setMode(CODE);
          setStudioFileToOpen(fileId);
        }}
      />
    );
  };

  // Modale de création de post (commune Mobile et Desktop)
  const renderCreateModal = () => (
    <Modal
      visible={showCreateModal}
      transparent
      animationType="fade"
      onRequestClose={() => {
        if (!isCreating) {
          setShowCreateModal(false);
          setPostContent('');
          setSelectedImages([]);
          setSelectedPdf(null);
          setCreateFeedback({ type: '', message: '' });
        }
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.centeredView}>
          <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textDark }]}>Créer un post</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowCreateModal(false);
                  setPostContent('');
                  setSelectedImages([]);
                  setSelectedPdf(null);
                  setCreateFeedback({ type: '', message: '' });
                }}
                disabled={isCreating}
              >
                <Ionicons name="close" size={28} color={colors.textDark} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={[styles.textInput, { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.divider }]}
              placeholder="Quoi de neuf?"
              placeholderTextColor={colors.placeholder}
              multiline
              value={postContent}
              onChangeText={setPostContent}
              editable={!isCreating}
            />

            {selectedImages.length > 0 ? (
              <View style={styles.multiPreviewRow}>
                {selectedImages.map(uri => (
                  <View key={uri} style={styles.thumbContainer}>
                    <Image source={{ uri }} style={styles.thumbPreview} />
                    <TouchableOpacity style={styles.removeThumbButton} onPress={() => removeImage(uri)} disabled={isCreating}>
                      <Ionicons name="close-circle" size={22} color={colors.onPrimary} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : null}

            <TouchableOpacity style={[styles.imagePickerButton, { borderColor: colors.divider, backgroundColor: colors.inputBackground }]} onPress={pickImage} disabled={isCreating}>
              <Ionicons name="image-outline" size={24} color={colors.primary} />
              <Text style={[styles.imagePickerText, { color: colors.primary }]}>
                {selectedImages.length > 0 ? `Ajouter d'autres images (${selectedImages.length}/20)` : 'Ajouter des images'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.imagePickerButton, { borderColor: colors.divider, backgroundColor: colors.inputBackground }]} onPress={pickPdf} disabled={isCreating}>
              <Ionicons name="document-attach-outline" size={24} color={colors.primary} />
              <Text style={[styles.imagePickerText, { color: colors.primary }]}>Ajouter un PDF</Text>
            </TouchableOpacity>

            {selectedPdf ? (
              <View style={[styles.pdfChip, { backgroundColor: colors.inputBackground, borderColor: colors.divider }]}>
                <Ionicons name="document-text-outline" size={18} color={colors.primary} />
                <Text style={[styles.pdfChipText, { color: colors.text }]} numberOfLines={1}>{selectedPdf.name || 'piece-jointe.pdf'}</Text>
                <TouchableOpacity onPress={removePdf} disabled={isCreating} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Ionicons name="close-circle" size={22} color={colors.textMuted} />
                </TouchableOpacity>
              </View>
            ) : null}

            {createFeedback.message ? (
              <Text style={createFeedback.type === 'error' ? styles.feedbackError : [styles.feedbackSuccess, { color: colors.primary }]}>
                {createFeedback.message}
              </Text>
            ) : null}

            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: colors.primary }, isCreating && styles.submitButtonDisabled]}
              onPress={handleCreatePost}
              disabled={isCreating}
            >
              {isCreating ? (
                <ActivityIndicator color={colors.onPrimary} />
              ) : (
                <Text style={styles.submitButtonText}>Publier</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // =========================================================================
  // BASCULE RESPONSIVE :
  // Si largeur >= 768px -> Layout Desktop avec Sidebar latérale gauche & Header
  // Si largeur < 768px  -> Layout Mobile d'origine avec En-tête vert & Bottom Tab Bar
  // =========================================================================
  if (isDesktop) {
    return (
      <View style={styles.desktopRootContainer}>
        <DesktopLayout
          currentMode={mode}
          onSelectMode={setMode}
          onOpenCreatePost={() => setShowCreateModal(true)}
          onOpenSearch={() => setIsSearching(true)}
          unreadCount={unreadCount}
          avatarUrl={avatarUrl}
          navigation={navigation}
        >
          {renderContent()}
        </DesktopLayout>
        {renderCreateModal()}
      </View>
    );
  }

  // Layout Mobile standard
  return (
    <View style={[styles.container, { backgroundColor: colors.screenBackground }]}>
      <View style={[styles.header, { paddingTop: insets.top + SPACING.sm, backgroundColor: isDark ? colors.cardBackground : colors.headerGreen, borderBottomColor: colors.divider }]}>
        <View style={styles.headerRow}>
          {mode === OFFICIEL ? (
            <View style={styles.logoBox}>
              <Image
                source={require('../../assets/ispm.png')}
                style={styles.logoBoxImage}
                resizeMode="contain"
              />
            </View>
          ) : (
            <Image
              source={isDark ? require('../../sweeted_logo_no_background_white.png') : require('../../sweeted_logo-no_background.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          )}

          <View style={styles.headerRight}>
            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.headerIconBtn} onPress={() => setIsSearching(true)}>
                <Feather name="search" size={22} color={colors.textDark} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerIconBtn} onPress={() => navigation.navigate('Notifications')}>
                <Feather name="bell" size={22} color={colors.textDark} />
                {unreadCount > 0 ? (
                  <View style={[styles.badge, { backgroundColor: colors.danger }]}>
                    <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
                  </View>
                ) : null}
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerIconBtn} onPress={() => navigation.navigate('Profile')}>
                {avatarUrl ? (
                  <Image source={{ uri: avatarUrl }} style={styles.headerAvatar} />
                ) : (
                  <Feather name="user" size={22} color={colors.textDark} />
                )}
              </TouchableOpacity>
            </View>

            {mode === ETUDIANT || mode === OFFICIEL ? (
              <View style={[styles.toggleContainer, { backgroundColor: colors.toggleBackground, borderColor: colors.toggleBorder }]}>
                <TouchableOpacity
                  style={[styles.toggleButton, mode === ETUDIANT && [styles.activeToggle, { backgroundColor: colors.toggleActive }]]}
                  onPress={() => setMode(ETUDIANT)}
                >
                  <Text style={mode === ETUDIANT ? [styles.activeToggleText, { color: colors.textPrimary }] : [styles.toggleText, { color: colors.textSecondary }]}>Etudiant</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleButton, mode === OFFICIEL && [styles.activeToggle, { backgroundColor: colors.toggleActive }]]}
                  onPress={() => setMode(OFFICIEL)}
                >
                  <Text style={mode === OFFICIEL ? [styles.activeToggleText, { color: colors.textPrimary }] : [styles.toggleText, { color: colors.textSecondary }]}>Officiel</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {renderContent()}
      </View>

      <View style={[
        styles.bottomNavContainer, 
        { 
          paddingBottom: insets.bottom, 
          backgroundColor: isDark ? colors.cardBackground : colors.headerGreen,
          borderTopWidth: isDark ? 1 : 0,
          borderTopColor: colors.divider,
        }
      ]}>
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={[styles.navItem, mode === ETUDIANT && styles.navItemActive]}
            onPress={() => setMode(ETUDIANT)}
          >
            <Feather name="home" size={24} color={colors.onHeader} />
            <Text style={mode === ETUDIANT ? styles.navLabelActive : styles.navLabel}>Accueil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navItem, mode === OFFICIEL && styles.navItemActive]}
            onPress={() => setMode(OFFICIEL)}
          >
            <Feather name="flag" size={24} color={colors.onHeader} />
            <Text style={mode === OFFICIEL ? styles.navLabelActive : styles.navLabel}>Officiels</Text>
          </TouchableOpacity>

          {mode === ETUDIANT || mode === OFFICIEL ? <View style={{ width: 62 }} /> : null}

          <TouchableOpacity
            style={[styles.navItem, mode === CODE && styles.navItemActive]}
            onPress={() => setMode(CODE)}
          >
            <Feather name="code" size={24} color={colors.onHeader} />
            <Text style={mode === CODE ? styles.navLabelActive : styles.navLabel}>Code</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navItem, mode === FICHIERS && styles.navItemActive]}
            onPress={() => setMode(FICHIERS)}
          >
            <Feather name="folder" size={24} color={colors.onHeader} />
            <Text style={mode === FICHIERS ? styles.navLabelActive : styles.navLabel}>Fichiers</Text>
          </TouchableOpacity>
        </View>

        {mode === ETUDIANT || mode === OFFICIEL ? (
          <View style={styles.fabWrapper}>
            <TouchableOpacity
              style={[styles.fab, { backgroundColor: colors.primary }]}
              onPress={() => setShowCreateModal(true)}
            >
              <Ionicons name="add" size={32} color={colors.onPrimary} />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>

      {renderCreateModal()}
    </View>
  );
};

export default HomeScreen;

const getStyles = (colors, isDark) => StyleSheet.create({
  desktopRootContainer: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: colors.screenBackground,
    ...(Platform.OS === 'web' && { height: '100vh', maxHeight: '100vh', overflow: 'hidden' }),
  },
  container: {
    flex: 1,
    ...(Platform.OS === 'web' && { height: '100vh', maxHeight: '100vh' }),
    backgroundColor: colors.background,
    position: 'relative',
  },
  content: {
    flex: 1,
    minHeight: 0,
    paddingBottom: 65,
  },
  header: {
    backgroundColor: colors.headerGreen,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    borderBottomLeftRadius: RADIUS.xxl,
    borderBottomRightRadius: RADIUS.xxl,
    zIndex: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 95,
    marginRight: SPACING.md,
    borderRadius: 35,
  },
  logoBox: {
    width: 100,
    height: 80,
    marginRight: SPACING.md,
    borderRadius: 35,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBoxImage: {
    width: 88,
    height: 70,
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
    gap: SPACING.md,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    alignSelf: 'flex-end',
  },
  headerIconBtn: {
    padding: 4,
    position: 'relative',
  },
  headerAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.divider,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -4,
    backgroundColor: colors.danger,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: colors.headerGreen,
  },
  badgeText: {
    color: colors.onPrimary,
    fontSize: 10,
    fontWeight: 'bold',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.toggleBackground,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: colors.toggleBorder,
    overflow: 'hidden',
  },
  toggleButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xl,
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
  bottomNavContainer: {
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: colors.headerGreen,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 62,
  },
  navItem: {
    padding: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    minWidth: 56,
  },
  navItemActive: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: RADIUS.md,
  },
  navLabel: {
    fontSize: 10,
    color: colors.onHeader,
    fontWeight: '500',
  },
  navLabelActive: {
    fontSize: 10,
    color: colors.onHeader,
    fontWeight: 'bold',
  },
  fabWrapper: {
    position: 'absolute',
    top: -25,
    alignSelf: 'center',
  },
  fab: {
    backgroundColor: colors.headerGreen,
    width: 55,
    height: 55,
    borderRadius: RADIUS.fab,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.onHeader,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  modalContent: {
    backgroundColor: colors.cardBackground,
    borderRadius: RADIUS.xl,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxl,
    width: '85%',
    maxWidth: 540,
    maxHeight: '80%',
    ...SHADOWS.large,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  modalTitle: {
    fontSize: FONTS.sizeTitle,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    fontSize: FONTS.sizeRegular,
    color: colors.textDark,
    minHeight: 80,
    marginBottom: SPACING.md,
    textAlignVertical: 'top',
  },
  multiPreviewRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: SPACING.md,
  },
  thumbContainer: {
    position: 'relative',
    width: 84,
    height: 84,
    borderRadius: RADIUS.md,
  },
  thumbPreview: {
    width: 84,
    height: 84,
    borderRadius: RADIUS.md,
  },
  removeThumbButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 11,
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.md,
    gap: 8,
  },
  imagePickerText: {
    color: colors.primary,
    fontSize: FONTS.sizeBody,
    fontWeight: '600',
  },
  pdfChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.screenBackground,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.md,
    gap: 8,
  },
  pdfChipText: {
    flex: 1,
    color: colors.textDark,
    fontSize: 13,
  },
  submitButton: {
    backgroundColor: colors.headerGreen,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: colors.onPrimary,
    fontSize: FONTS.sizeRegular,
    fontWeight: 'bold',
  },
  feedbackError: {
    color: colors.danger,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  feedbackSuccess: {
    color: colors.primary,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
});