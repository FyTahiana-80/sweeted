import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Image, RefreshControl,
  Modal, TextInput, ActivityIndicator, Alert, Platform
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch } from '../../config/apiClient';
import { appendFilePart, cleanUri, imageMime } from '../../config/fileUpload';
import { API_BASE_URL, fileUrl } from '../../config/api';
import { openPdf, downloadFileUrl } from '../../config/openPdf';
import { formatRelativeTime } from '../../components/formatTime';
import { COLORS, SPACING, RADIUS } from '../../config/theme';

export default function Officiels() {
  const navigation = useNavigation();
  const [officials, setOfficials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const [showPublish, setShowPublish] = useState(false);
  const [officialContent, setOfficialContent] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
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
    (async () => {
      try {
        const role = await AsyncStorage.getItem('userRole');
        setIsAdmin(role === 'Admin');
      } catch {}
    })();
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

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setPublishFeedback({ type: 'error', message: "Permission d'accès à la galerie refusée." });
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

  const publishOfficial = async () => {
    if (!officialContent.trim() && !selectedImage) {
      setPublishFeedback({ type: 'error', message: 'Veuillez écrire un contenu ou ajouter une image.' });
      return;
    }

    setIsPublishing(true);
    setPublishFeedback({ type: '', message: '' });

    const formData = new FormData();
    formData.append('content', officialContent.trim());

    if (selectedImage) {
      const rawName = String(selectedImage).split('?')[0].split('/').pop() || 'photo.jpg';
      const imgOk = await appendFilePart(formData, 'image', cleanUri(selectedImage), rawName, imageMime(rawName));
      if (!imgOk.ok) {
        setIsPublishing(false);
        setPublishFeedback({ type: 'error', message: 'Lecture image impossible : ' + imgOk.debug });
        return;
      }
    }

    const result = await apiFetch('/official', { method: 'POST', body: formData });
    setIsPublishing(false);

    if (result.ok) {
      setShowPublish(false);
      setOfficialContent('');
      setSelectedImage(null);
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

  const renderOfficial = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.authorRow}>
          <View style={styles.authorAvatar}>
            <Icon name="school" size={22} color={COLORS.primary} />
          </View>
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>{item.authorName}</Text>
            <Text style={styles.time}>{formatRelativeTime(item.created_at)}</Text>
          </View>
        </View>
        <View style={styles.cardHeaderRight}>
          {item.is_pinned === 1 ? (
            <View style={styles.pinnedBadge}>
              <Icon name="pin" size={14} color={COLORS.primary} />
              <Text style={styles.pinnedText}>Épinglé</Text>
            </View>
          ) : null}
          {isAdmin ? (
            <View style={styles.menuContainer}>
              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => setMenuOpenId(menuOpenId === item.id ? null : item.id)}
              >
                <Icon name="dots-vertical" size={20} color={COLORS.textMuted} />
              </TouchableOpacity>
              {menuOpenId === item.id ? (
                <View style={styles.dropdown}>
                  <TouchableOpacity style={styles.dropdownItem} onPress={() => openEdit(item)}>
                    <Icon name="pencil-outline" size={16} color={COLORS.textDark} />
                    <Text style={styles.dropdownText}>Modifier</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.dropdownItem} onPress={() => togglePin(item)}>
                    <Icon
                      name={item.is_pinned === 1 ? 'pin-off-outline' : 'pin-outline'}
                      size={16}
                      color={COLORS.textDark}
                    />
                    <Text style={styles.dropdownText}>
                      {item.is_pinned === 1 ? 'Déépingler' : 'Épingler'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.dropdownItem} onPress={() => confirmDelete(item)}>
                    <Icon name="delete-outline" size={16} color={COLORS.danger} />
                    <Text style={[styles.dropdownText, styles.dropdownTextDanger]}>Supprimer</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          ) : null}
        </View>
      </View>

      {item.content ? <Text style={styles.content}>{item.content}</Text> : null}

      {item.image ? (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate('OfficialDetails', { official: item })}
        >
          <Image source={{ uri: item.image }} style={styles.officialImage} />
        </TouchableOpacity>
      ) : null}

      {item.files && item.files.length > 0 ? (
        <View style={styles.filesContainer}>
          {item.files.map(file => (
            <View key={file.id} style={styles.fileRow}>
              <Icon name="file-pdf-box" size={18} color={COLORS.danger} />
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
            <Icon name="plus-circle" size={18} color={COLORS.white} />
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
          <ActivityIndicator size="large" color={COLORS.primary} />
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
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
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
            setSelectedImage(null);
            setPublishFeedback({ type: '', message: '' });
          }
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Publier un avis officiel</Text>
              <TouchableOpacity
                onPress={() => { setShowPublish(false); setSelectedImage(null); setPublishFeedback({ type: '', message: '' }); }}
                disabled={isPublishing}
              >
                <Icon name="close" size={28} color={COLORS.textDark} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.textInput}
              placeholder="Contenu de l'avis (annonce, EDT, résultat...)"
              placeholderTextColor={COLORS.placeholder}
              multiline
              value={officialContent}
              onChangeText={setOfficialContent}
              editable={!isPublishing}
              maxLength={2000}
            />

            {selectedImage ? (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
                <TouchableOpacity style={styles.removeImageButton} onPress={() => setSelectedImage(null)} disabled={isPublishing}>
                  <Icon name="close-circle" size={28} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            ) : null}

            <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage} disabled={isPublishing}>
              <Icon name="image-outline" size={24} color={COLORS.primary} />
              <Text style={styles.imagePickerText}>Ajouter une image (EDT, affiche...)</Text>
            </TouchableOpacity>

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
                <ActivityIndicator color={COLORS.white} />
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
                <Icon name="close" size={28} color={COLORS.textDark} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.textInput}
              placeholder="Contenu de l'avis"
              placeholderTextColor={COLORS.placeholder}
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
                <ActivityIndicator color={COLORS.white} />
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
            <Text style={{ marginVertical: 14, color: COLORS.textSecondary }}>Voulez-vous vraiment supprimer cette publication officielle ?</Text>
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: COLORS.danger }, isDeleting && styles.submitButtonDisabled]}
              onPress={doDeleteOfficial}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.submitButtonText}>Supprimer</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: COLORS.inputBackground, marginTop: 10 }]}
              onPress={() => setDeleteTarget(null)}
              disabled={isDeleting}
            >
              <Text style={[styles.submitButtonText, { color: COLORS.textDark }]}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.screenBackground,
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
    color: COLORS.textDark,
  },
  publishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    gap: 5,
  },
  publishButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 13,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorBanner: {
    backgroundColor: '#FFF0F0',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  errorText: {
    color: COLORS.danger,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 130,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    elevation: 2,
    shadowColor: '#000',
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
  },
  dropdown: {
    position: 'absolute',
    top: 28,
    right: 0,
    zIndex: 50,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    paddingVertical: 4,
    minWidth: 150,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
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
    color: COLORS.textDark,
    fontWeight: '600',
  },
  dropdownTextDanger: {
    color: COLORS.danger,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5EC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontWeight: 'bold',
    fontSize: 14,
    color: COLORS.textDark,
  },
  time: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 1,
  },
  pinnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5EC',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    gap: 3,
  },
  pinnedText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  content: {
    fontSize: 15,
    color: COLORS.textDark,
    lineHeight: 22,
    marginBottom: SPACING.md,
  },
  officialImage: {
    width: '100%',
    height: Platform.OS === 'web' ? 420 : 200,
    resizeMode: Platform.OS === 'web' ? 'contain' : 'cover',
    borderRadius: RADIUS.lg,
    backgroundColor: '#eee',
    marginBottom: SPACING.md,
  },
  filesContainer: {
    gap: 6,
    marginTop: SPACING.xs,
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.screenBackground,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    gap: 6,
  },
  fileAction: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  fileActionText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primary,
  },
  fileName: {
    fontSize: 12,
    color: COLORS.textMuted,
    flex: 1,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxl,
    width: '88%',
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
    color: COLORS.textDark,
    flex: 1,
    marginRight: SPACING.sm,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    fontSize: 15,
    color: COLORS.textDark,
    minHeight: 90,
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
    height: 160,
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
    fontSize: 14,
    fontWeight: '600',
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
    fontSize: 16,
    fontWeight: 'bold',
  },
});