import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Image, RefreshControl,
  Modal, TextInput, ActivityIndicator, Alert, Platform
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch } from '../../config/apiClient';
import { appendFilePart, cleanUri, imageMime } from '../../config/fileUpload';
import { API_BASE_URL, fileUrl } from '../../config/api';
import { openPdf, downloadFileUrl } from '../../config/openPdf';
import { formatRelativeTime } from '../../components/formatTime';
import OfficialCarousel from '../../components/OfficialCarousel';
import { SPACING, RADIUS } from '../../config/theme';

export default function Officiels() {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => getStyles(colors, isDark), [colors, isDark]);
  const navigation = useNavigation();
  const [officials, setOfficials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const [showPublish, setShowPublish] = useState(false);
  const [officialContent, setOfficialContent] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishFeedback, setPublishFeedback] = useState({ type: '', message: '' });

  const [menuOpenId, setMenuOpenId] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editBusy, setEditBusy] = useState(false);
  const [editFeedback, setEditFeedback] = useState({ type: '', message: '' });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let active = true;
    apiFetch('/auth/me').then(result => {
      if (!active) return;
      if (result.ok && result.data) {
        setIsAdmin(result.data.role === 'Admin');
        try { AsyncStorage.setItem('userRole', String(result.data.role || '')); } catch (ignored) {}
      }
    });
    return () => { active = false; };
  }, []);
  useFocusEffect(
    useCallback(() => {
      fetchOfficials();
    }, [])
  );

  const fetchOfficials = async () => {
    if (!refreshing) setLoading(true);
    setError('');

    const result = await apiFetch('/official');
    if (result.ok) {
      const enriched = (result.data || []).map(official => ({
        ...official,
        authorName: official.display_name || 'Direction ISPM',
        image: official.image_url ? `${API_BASE_URL.replace('/api', '')}${official.image_url}` : null,
      }));
      setOfficials(enriched);
    } else {
      let message;
      if (result.errorType === 'network') {
        message = 'Impossible de joindre le serveur. Vérifiez votre connexion.';
      } else if (result.errorType === 'auth') {
        message = 'Vous devez être connecté pour voir les publications officielles.';
      } else {
        message = result.data?.message || 'Impossible de charger les publications officielles.';
      }
      setError(message);
    }

    setLoading(false);
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchOfficials().then(() => setRefreshing(false));
  }, []);

  const MAX_OFFICIAL_IMAGES = 20;

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setPublishFeedback({ type: 'error', message: "Permission d'accès à la galerie refusée." });
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
        if (merged.length > MAX_OFFICIAL_IMAGES) {
          setPublishFeedback({ type: 'error', message: `Maximum ${MAX_OFFICIAL_IMAGES} images par publication.` });
        }
        return merged.slice(0, MAX_OFFICIAL_IMAGES);
      });
    }
  };

  const pickPdf = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets?.[0]) {
        const asset = result.assets[0];
        if (asset.size && asset.size > 10 * 1024 * 1024) {
          setPublishFeedback({ type: 'error', message: 'Le PDF ne peut pas dépasser 10 Mo.' });
          return;
        }
        setSelectedPdf({ uri: asset.uri, name: asset.name || 'document.pdf' });
      }
    } catch (e) {
      setPublishFeedback({ type: 'error', message: 'Impossible de sélectionner le PDF.' });
    }
  };

  const publishOfficial = async () => {
    if (!officialContent.trim() && selectedImages.length === 0 && !selectedPdf) {
      setPublishFeedback({ type: 'error', message: 'Veuillez écrire un contenu, ajouter des images ou un PDF.' });
      return;
    }

    setIsPublishing(true);
    setPublishFeedback({ type: '', message: '' });

    const formData = new FormData();
    formData.append('content', officialContent.trim());

    for (const uri of selectedImages) {
      const rawName = String(uri).split('?')[0].split('/').pop() || 'photo.jpg';
      const imgOk = await appendFilePart(formData, 'image', cleanUri(uri), rawName, imageMime(rawName));
      if (!imgOk.ok) {
        setIsPublishing(false);
        setPublishFeedback({ type: 'error', message: 'Lecture image impossible : ' + imgOk.debug });
        return;
      }
    }

    if (selectedPdf) {
      const pdfOk = await appendFilePart(formData, 'pdf', cleanUri(selectedPdf.uri), selectedPdf.name, 'application/pdf');
      if (!pdfOk.ok) {
        setIsPublishing(false);
        setPublishFeedback({ type: 'error', message: 'Lecture PDF impossible : ' + pdfOk.debug });
        return;
      }
    }

    const result = await apiFetch('/official', { method: 'POST', body: formData });
    setIsPublishing(false);

    if (result.ok) {
      setShowPublish(false);
      setOfficialContent('');
      setSelectedImages([]);
      setSelectedPdf(null);
      setPublishFeedback({ type: '', message: '' });
      fetchOfficials();
      return;
    }

    let message;
    if (result.errorType === 'auth') {
      message = 'Vous devez être connecté pour publier.';
    } else if (result.errorType === 'validation') {
      message = result.data?.message || 'La publication est invalide.';
    } else if (result.errorType === 'server') {
      message = 'Le serveur a rencontré une erreur lors de la publication.';
    } else {
      message = result.data?.message || 'Impossible de publier.';
    }
    setPublishFeedback({ type: 'error', message });
  };

  const openEdit = (official) => {
    setMenuOpenId(null);
    setEditTarget(official);
    setEditContent(official.content || '');
    setEditFeedback({ type: '', message: '' });
  };

  const saveEdit = async () => {
    if (!editTarget) return;
    if (!editContent.trim()) {
      setEditFeedback({ type: 'error', message: 'Le contenu ne peut pas être vide.' });
      return;
    }
    setEditBusy(true);
    setEditFeedback({ type: '', message: '' });
    const result = await apiFetch(`/official/${editTarget.id}`, {
      method: 'PUT',
      body: JSON.stringify({ content: editContent.trim(), is_pinned: editTarget.is_pinned }),
    });
    setEditBusy(false);
    if (result.ok) {
      setEditTarget(null);
      setEditContent('');
      fetchOfficials();
    } else {
      setEditFeedback({
        type: 'error',
        message: result.data?.message || 'Impossible de modifier la publication.',
      });
    }
  };

  const togglePin = async (official) => {
    setMenuOpenId(null);
    const result = await apiFetch(`/official/${official.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        content: official.content || '',
        is_pinned: official.is_pinned === 1 ? 0 : 1,
      }),
    });
    if (result.ok) {
      fetchOfficials();
    } else {
      Alert.alert('Erreur', result.data?.message || 'Impossible de modifier l\'épinglage.');
    }
  };

  const confirmDelete = (official) => {
    setMenuOpenId(null);
    setDeleteTarget(official);
  };

  const doDeleteOfficial = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const result = await apiFetch(`/official/${deleteTarget.id}`, { method: 'DELETE' });
    setIsDeleting(false);
    if (result.ok) {
      setDeleteTarget(null);
      fetchOfficials();
    } else {
      setDeleteTarget(null);
      Alert.alert('Erreur', result.data?.message || 'Impossible de supprimer la publication.');
    }
  };

  // URLs complètes des images : tableau `images` (multi) puis repli `image` / `image_url` (ancien format)
  const officialImageUrls = (official) => {
    const root = API_BASE_URL.replace('/api', '');
    if (official.images && official.images.length > 0) {
      return official.images.map(im => `${root}${im.image_url}`);
    }
    if (official.image) return [official.image];
    if (official.image_url) return [`${root}${official.image_url}`];
    return [];
  };

  const renderOfficial = ({ item }) => (
    <View style={styles.card}>

  return (
      <View style={styles.cardHeader}>
        <View style={styles.authorRow}>
          <View style={styles.authorAvatar}>
            <Image
              source={require('../../assets/ispm1.png')}
              style={styles.authorLogo}
              resizeMode="contain"
            />
          </View>
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>{item.authorName}</Text>
            <Text style={styles.time}>{formatRelativeTime(item.created_at)}</Text>
          </View>
        </View>
        <View style={styles.cardHeaderRight}>
          {item.is_pinned === 1 ? (
            <View style={styles.pinnedBadge}>
              <Icon name="pin" size={14} color={colors.primary} />
              <Text style={styles.pinnedText}>Épinglé</Text>
            </View>
          ) : null}
          {isAdmin ? (
            <View style={styles.menuContainer}>
              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => setMenuOpenId(menuOpenId === item.id ? null : item.id)}
              >
                <Icon name="dots-vertical" size={20} color={colors.textMuted} />
              </TouchableOpacity>
              {menuOpenId === item.id ? (
                <View style={styles.dropdownOverlay}>
                  <TouchableOpacity style={styles.dropdownBackdrop} onPress={() => setMenuOpenId(null)} />
                  <View style={styles.dropdown}>
                  <TouchableOpacity style={styles.dropdownItem} onPress={() => openEdit(item)}>
                    <Icon name="pencil-outline" size={16} color={colors.textDark} />
                    <Text style={styles.dropdownText}>Modifier</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.dropdownItem} onPress={() => togglePin(item)}>
                    <Icon
                      name={item.is_pinned === 1 ? 'pin-off-outline' : 'pin-outline'}
                      size={16}
                      color={colors.textDark}
                    />
                    <Text style={styles.dropdownText}>
                      {item.is_pinned === 1 ? 'Déépingler' : 'Épingler'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.dropdownItem} onPress={() => confirmDelete(item)}>
                    <Icon name="delete-outline" size={16} color={colors.danger} />
                    <Text style={[styles.dropdownText, styles.dropdownTextDanger]}>Supprimer</Text>
                  </TouchableOpacity>
                </View>
                </View>
              ) : null}
            </View>
          ) : null}
        </View>
      </View>

      {item.content ? <Text style={styles.content}>{item.content}</Text> : null}

      <OfficialCarousel
        images={officialImageUrls(item)}
        onPressImage={() => navigation.navigate('OfficialDetails', { official: item })}
      />

      {item.files && item.files.length > 0 ? (
        <View style={styles.filesContainer}>
          {item.files.map(file => (
            <View key={file.id} style={styles.fileRow}>
              <Icon name="file-pdf-box" size={18} color={colors.danger} />
              <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
              <TouchableOpacity
                style={styles.fileAction}
                onPress={() => { const url = fileUrl(file.path); if (url) openPdf(url); }}
              >
                <Text style={styles.fileActionText}>Lire</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.fileAction}
                onPress={async () => { const url = await downloadFileUrl(file.id); if (url) openPdf(url); }}
              >
                <Text style={styles.fileActionText}>Télécharger</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Publications officielles</Text>
        {isAdmin ? (
          <TouchableOpacity style={styles.publishButton} onPress={() => setShowPublish(true)}>
            <Icon name="plus-circle" size={18} color={colors.onPrimary} />
            <Text style={styles.publishButtonText}>Publier</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {error ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {loading && officials.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={officials}
          keyExtractor={item => item.id.toString()}
          renderItem={renderOfficial}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            !loading ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Aucune publication officielle pour le moment.</Text>
              </View>
            ) : null
          }
        />
      )}

      <Modal
        visible={showPublish}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!isPublishing) {
            setShowPublish(false);
            setSelectedImages([]);
            setSelectedPdf(null);
            setOfficialContent('');
            setPublishFeedback({ type: '', message: '' });
          }
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Publier un avis officiel</Text>
              <TouchableOpacity
                onPress={() => { setShowPublish(false); setOfficialContent(''); setSelectedImages([]); setSelectedPdf(null); setPublishFeedback({ type: '', message: '' }); }}
                disabled={isPublishing}
              >
                <Icon name="close" size={28} color={colors.textDark} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.textInput}
              placeholder="Contenu de l'avis (annonce, EDT, résultat...)"
              placeholderTextColor={colors.placeholder}
              multiline
              value={officialContent}
              onChangeText={setOfficialContent}
              editable={!isPublishing}
              maxLength={2000}
            />

            {selectedImages.length > 0 ? (
              <View style={styles.multiPreviewRow}>
                {selectedImages.map(uri => (
                  <View key={uri} style={styles.thumbContainer}>
                    <Image source={{ uri }} style={styles.thumbPreview} />
                    <TouchableOpacity
                      style={styles.removeThumbButton}
                      onPress={() => setSelectedImages(prev => prev.filter(u => u !== uri))}
                      disabled={isPublishing}
                    >
                      <Icon name="close-circle" size={22} color={colors.onPrimary} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : null}

            <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage} disabled={isPublishing}>
              <Icon name="image-outline" size={24} color={colors.primary} />
              <Text style={styles.imagePickerText}>
                {selectedImages.length > 0 ? `Ajouter d'autres images (${selectedImages.length}/20)` : 'Ajouter des images (EDT, affiches...)'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.imagePickerButton} onPress={pickPdf} disabled={isPublishing}>
              <Icon name="file-pdf-box" size={24} color={colors.primary} />
              <Text style={styles.imagePickerText}>Ajouter un PDF (règlement, note...)</Text>
            </TouchableOpacity>

            {selectedPdf ? (
              <View style={styles.pdfPreviewRow}>
                <Icon name="file-pdf-box" size={20} color={colors.danger} />
                <Text style={styles.pdfPreviewName} numberOfLines={1}>{selectedPdf.name}</Text>
                <TouchableOpacity onPress={() => setSelectedPdf(null)} disabled={isPublishing}>
                  <Icon name="close-circle" size={22} color={colors.textMuted} />
                </TouchableOpacity>
              </View>
            ) : null}

            {publishFeedback.message ? (
              <Text style={publishFeedback.type === 'error' ? styles.feedbackError : styles.feedbackSuccess}>
                {publishFeedback.message}
              </Text>
            ) : null}

            <TouchableOpacity
              style={[styles.submitButton, isPublishing && styles.submitButtonDisabled]}
              onPress={publishOfficial}
              disabled={isPublishing}
            >
              {isPublishing ? (
                <ActivityIndicator color={colors.onPrimary} />
              ) : (
                <Text style={styles.submitButtonText}>Publier</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={editTarget !== null}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!editBusy) {
            setEditTarget(null);
            setEditFeedback({ type: '', message: '' });
          }
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Modifier la publication</Text>
              <TouchableOpacity
                onPress={() => { setEditTarget(null); setEditFeedback({ type: '', message: '' }); }}
                disabled={editBusy}
              >
                <Icon name="close" size={28} color={colors.textDark} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.textInput}
              placeholder="Contenu de l'avis"
              placeholderTextColor={colors.placeholder}
              multiline
              value={editContent}
              onChangeText={setEditContent}
              editable={!editBusy}
              maxLength={2000}
            />

            {editFeedback.message ? (
              <Text style={editFeedback.type === 'error' ? styles.feedbackError : styles.feedbackSuccess}>
                {editFeedback.message}
              </Text>
            ) : null}

            <TouchableOpacity
              style={[styles.submitButton, editBusy && styles.submitButtonDisabled]}
              onPress={saveEdit}
              disabled={editBusy}
            >
              {editBusy ? (
                <ActivityIndicator color={colors.onPrimary} />
              ) : (
                <Text style={styles.submitButtonText}>Enregistrer</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={deleteTarget !== null}
        transparent
        animationType="fade"
        onRequestClose={() => { if (!isDeleting) setDeleteTarget(null); }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmer la suppression</Text>
            <Text style={{ marginVertical: 14, color: colors.textSecondary }}>Voulez-vous vraiment supprimer cette publication officielle ?</Text>
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: colors.danger }, isDeleting && styles.submitButtonDisabled]}
              onPress={doDeleteOfficial}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <ActivityIndicator color={colors.onPrimary} />
              ) : (
                <Text style={styles.submitButtonText}>Supprimer</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: colors.inputBackground, marginTop: 10 }]}
              onPress={() => setDeleteTarget(null)}
              disabled={isDeleting}
            >
              <Text style={[styles.submitButtonText, { color: colors.textDark }]}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const getStyles = (colors, isDark) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.screenBackground,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  publishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    gap: 5,
  },
  publishButtonText: {
    color: colors.onPrimary,
    fontWeight: 'bold',
    fontSize: 13,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorBanner: {
    backgroundColor: colors.danger + '1A',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  errorText: {
    color: colors.danger,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 130,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  cardHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  menuContainer: {
    position: 'relative',
  },
  menuButton: {
    padding: 2,
    marginRight: Platform.OS === 'android' ? '5%' : 0,
  },
  dropdown: {
    position: 'absolute',
    top: 28,
    right: 0,
    zIndex: 50,
    backgroundColor: colors.cardBackground,
    borderRadius: RADIUS.lg,
    paddingVertical: 4,
    minWidth: 150,
    elevation: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  dropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 60,
  },
  dropdownBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: 9,
  },
  dropdownText: {
    fontSize: 13,
    color: colors.textDark,
    fontWeight: '600',
  },
  dropdownTextDanger: {
    color: colors.danger,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '1F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  authorLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontWeight: 'bold',
    fontSize: 14,
    color: colors.textDark,
  },
  time: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 1,
  },
  pinnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '1F',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    gap: 3,
  },
  pinnedText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.primary,
  },
  content: {
    fontSize: 15,
    color: colors.textDark,
    lineHeight: 22,
    marginBottom: SPACING.md,
  },
  filesContainer: {
    gap: 6,
    marginTop: SPACING.xs,
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.screenBackground,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    gap: 6,
  },
  fileAction: {
    backgroundColor: colors.cardBackground,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  fileActionText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
  },
  fileName: {
    fontSize: 12,
    color: colors.textMuted,
    flex: 1,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  modalContent: {
    backgroundColor: colors.cardBackground,
    borderRadius: RADIUS.xl,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxl,
    width: Platform.OS === 'web' ? '92%' : '88%',
    maxWidth: 560,
    alignSelf: 'center',
    maxHeight: '82%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.textDark,
    flex: 1,
    marginRight: SPACING.sm,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    fontSize: 15,
    color: colors.textDark,
    minHeight: 90,
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
    overflow: 'visible',
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
    fontSize: 14,
    fontWeight: '600',
  },
  pdfPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.screenBackground,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 8,
    gap: 8,
    marginBottom: SPACING.md,
  },
  pdfPreviewName: {
    flex: 1,
    fontSize: 13,
    color: colors.textDark,
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
    fontSize: 16,
    fontWeight: 'bold',
  },
});