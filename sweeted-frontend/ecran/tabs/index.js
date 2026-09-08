import React, { useState, useRef, useCallback } from 'react';
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
import { API_BASE_URL } from '../../config/api';
import { COLORS, SPACING, RADIUS, SHADOWS, FONTS, BREAKPOINTS } from '../../config/theme';

const ETUDIANT = 'etudiant';
const OFFICIEL = 'officiel';
const CODE = 'code';
const FICHIERS = 'fichiers';

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
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
  const [selectedImage, setSelectedImage] = useState(null);
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

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setCreateFeedback({ type: 'error', message: 'Permission d\'accès à la galerie refusée.' });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const removeImage = () => setSelectedImage(null);

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
    if (!postContent.trim() && !selectedImage && !selectedPdf) {
      setCreateFeedback({ type: 'error', message: 'Veuillez écrire quelque chose, ajouter une image ou un PDF.' });
      return;
    }

    setIsCreating(true);
    setCreateFeedback({ type: '', message: '' });

    const formData = new FormData();
    formData.append('content', postContent.trim());

    if (selectedImage) {
      const filename = selectedImage.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      formData.append('image', { uri: selectedImage, name: filename, type });
    }

    if (selectedPdf) {
      formData.append('file', {
        uri: selectedPdf.uri,
        name: selectedPdf.name || 'piece-jointe.pdf',
        type: selectedPdf.mimeType || 'application/pdf',
      });
    }

    const result = await apiFetch('/posts', {
      method: 'POST',
      body: formData,
    });

    setIsCreating(false);

    if (result.ok) {
      setPostContent('');
      setSelectedImage(null);
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
          setSelectedImage(null);
          setSelectedPdf(null);
          setCreateFeedback({ type: '', message: '' });
        }
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.centeredView}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Créer un post</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowCreateModal(false);
                  setSelectedImage(null);
                  setSelectedPdf(null);
                  setCreateFeedback({ type: '', message: '' });
                }}
                disabled={isCreating}
              >
                <Ionicons name="close" size={28} color={COLORS.textDark} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.textInput}
              placeholder="Quoi de neuf?"
              placeholderTextColor={COLORS.placeholder}
              multiline
              value={postContent}
              onChangeText={setPostContent}
              editable={!isCreating}
            />

            {selectedImage ? (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
                <TouchableOpacity style={styles.removeImageButton} onPress={removeImage} disabled={isCreating}>
                  <Ionicons name="close-circle" size={28} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            ) : null}

            <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage} disabled={isCreating}>
              <Ionicons name="image-outline" size={24} color={COLORS.primary} />
              <Text style={styles.imagePickerText}>Ajouter une image</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.imagePickerButton} onPress={pickPdf} disabled={isCreating}>
              <Ionicons name="document-attach-outline" size={24} color={COLORS.primary} />
              <Text style={styles.imagePickerText}>Ajouter un PDF</Text>
            </TouchableOpacity>

            {selectedPdf ? (
              <View style={styles.pdfChip}>
                <Ionicons name="document-text-outline" size={18} color={COLORS.primary} />
                <Text style={styles.pdfChipText} numberOfLines={1}>{selectedPdf.name || 'piece-jointe.pdf'}</Text>
                <TouchableOpacity onPress={removePdf} disabled={isCreating} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Ionicons name="close-circle" size={22} color={COLORS.textMuted} />
                </TouchableOpacity>
              </View>
            ) : null}

            {createFeedback.message ? (
              <Text style={createFeedback.type === 'error' ? styles.feedbackError : styles.feedbackSuccess}>
                {createFeedback.message}
              </Text>
            ) : null}

            <TouchableOpacity
              style={[styles.submitButton, isCreating && styles.submitButtonDisabled]}
              onPress={handleCreatePost}
              disabled={isCreating}
            >
              {isCreating ? (
                <ActivityIndicator color={COLORS.white} />
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
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + SPACING.sm }]}>
        <View style={styles.headerRow}>
          <Image
            source={require('../../sweeted_logo-no_background.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <View style={styles.headerRight}>
            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.headerIconBtn} onPress={() => setIsSearching(true)}>
                <Feather name="search" size={22} color={COLORS.black} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerIconBtn} onPress={() => navigation.navigate('Notifications')}>
                <Feather name="bell" size={22} color={COLORS.black} />
                {unreadCount > 0 ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
                  </View>
                ) : null}
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerIconBtn} onPress={() => navigation.navigate('Profile')}>
                {avatarUrl ? (
                  <Image source={{ uri: avatarUrl }} style={styles.headerAvatar} />
                ) : (
                  <Feather name="user" size={22} color={COLORS.black} />
                )}
              </TouchableOpacity>
            </View>

            {mode === ETUDIANT || mode === OFFICIEL ? (
              <View style={styles.toggleContainer}>
                <TouchableOpacity
                  style={[styles.toggleButton, mode === ETUDIANT && styles.activeToggle]}
                  onPress={() => setMode(ETUDIANT)}
                >
                  <Text style={mode === ETUDIANT ? styles.activeToggleText : styles.toggleText}>Etudiant</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleButton, mode === OFFICIEL && styles.activeToggle]}
                  onPress={() => setMode(OFFICIEL)}
                >
                  <Text style={mode === OFFICIEL ? styles.activeToggleText : styles.toggleText}>Officiel</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {renderContent()}
      </View>

      <View style={[styles.bottomNavContainer, { paddingBottom: insets.bottom }]}>
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={[styles.navItem, mode === ETUDIANT && styles.navItemActive]}
            onPress={() => setMode(ETUDIANT)}
          >
            <Feather name="home" size={24} color={COLORS.white} />
            <Text style={mode === ETUDIANT ? styles.navLabelActive : styles.navLabel}>Accueil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navItem, mode === OFFICIEL && styles.navItemActive]}
            onPress={() => setMode(OFFICIEL)}
          >
            <Feather name="megaphone" size={24} color={COLORS.white} />
            <Text style={mode === OFFICIEL ? styles.navLabelActive : styles.navLabel}>Officiels</Text>
          </TouchableOpacity>

          {mode === ETUDIANT || mode === OFFICIEL ? <View style={{ width: 62 }} /> : null}

          <TouchableOpacity
            style={[styles.navItem, mode === CODE && styles.navItemActive]}
            onPress={() => setMode(CODE)}
          >
            <Feather name="code" size={24} color={COLORS.white} />
            <Text style={mode === CODE ? styles.navLabelActive : styles.navLabel}>Code</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navItem, mode === FICHIERS && styles.navItemActive]}
            onPress={() => setMode(FICHIERS)}
          >
            <Feather name="folder" size={24} color={COLORS.white} />
            <Text style={mode === FICHIERS ? styles.navLabelActive : styles.navLabel}>Fichiers</Text>
          </TouchableOpacity>
        </View>

        {mode === ETUDIANT || mode === OFFICIEL ? (
          <View style={styles.fabWrapper}>
            <TouchableOpacity
              style={styles.fab}
              onPress={() => setShowCreateModal(true)}
            >
              <Ionicons name="add" size={32} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>

      {renderCreateModal()}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  desktopRootContainer: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: COLORS.screenBackground,
  },
  container: {
    flex: 1,
    ...(Platform.OS === 'web' && { height: '100vh', maxHeight: '100vh' }),
    backgroundColor: COLORS.background,
    position: 'relative',
  },
  content: {
    flex: 1,
    minHeight: 0,
    paddingBottom: 65,
  },
  header: {
    backgroundColor: COLORS.headerGreen,
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
    backgroundColor: '#DDD',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -4,
    backgroundColor: COLORS.danger,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: COLORS.headerGreen,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.toggleBackground,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.toggleBorder,
    overflow: 'hidden',
  },
  toggleButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xl,
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
  bottomNavContainer: {
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: COLORS.headerGreen,
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
    color: COLORS.white,
    fontWeight: '500',
  },
  navLabelActive: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  fabWrapper: {
    position: 'absolute',
    top: -25,
    alignSelf: 'center',
  },
  fab: {
    backgroundColor: COLORS.headerGreen,
    width: 55,
    height: 55,
    borderRadius: RADIUS.fab,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: COLORS.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
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
    backgroundColor: COLORS.white,
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
    color: COLORS.textDark,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    fontSize: FONTS.sizeRegular,
    color: COLORS.textDark,
    minHeight: 80,
    marginBottom: SPACING.md,
    textAlignVertical: 'top',
  },
  imagePreviewContainer: {
    position: 'relative',
    marginBottom: SPACING.md,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: 180,
    borderRadius: RADIUS.md,
  },
  removeImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.md,
    gap: 8,
  },
  imagePickerText: {
    color: COLORS.primary,
    fontSize: FONTS.sizeBody,
    fontWeight: '600',
  },
  pdfChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.screenBackground,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.md,
    gap: 8,
  },
  pdfChipText: {
    flex: 1,
    color: COLORS.textDark,
    fontSize: 13,
  },
  submitButton: {
    backgroundColor: COLORS.headerGreen,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizeRegular,
    fontWeight: 'bold',
  },
  feedbackError: {
    color: COLORS.danger,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  feedbackSuccess: {
    color: COLORS.primary,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
});