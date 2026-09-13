import React, { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  View, Text, StyleSheet, Image, TouchableOpacity, ScrollView,
  Modal, Animated, TextInput, Alert, ActivityIndicator, Platform
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { apiFetch } from '../../config/apiClient';
import { API_BASE_URL, fileUrl } from '../../config/api';
import { openPdf, downloadFileUrl } from '../../config/openPdf';
import OfficialCarousel from '../../components/OfficialCarousel';
import { formatRelativeTime } from '../../components/formatTime';
import { SPACING, RADIUS } from '../../config/theme';

export default function OfficialDetails({ route }) {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => getStyles(colors, isDark), [colors, isDark]);
  const { official: initialOfficial } = route.params;
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [data, setData] = useState(initialOfficial);
  const [isAdmin, setIsAdmin] = useState(false);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [scale, setScale] = useState(1);
  const animatedScale = useRef(new Animated.Value(1)).current;

  const [menuOpen, setMenuOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [editVisible, setEditVisible] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editBusy, setEditBusy] = useState(false);
  const [editFeedback, setEditFeedback] = useState({ type: '', message: '' });
  const [deleting, setDeleting] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);

  useEffect(() => {
    let active = true;
    apiFetch('/auth/me').then(result => {
      if (active && result.ok && result.data) {
        setIsAdmin(result.data.role === 'Admin');
      }
    });
    return () => { active = false; };
  }, []);

  // Recharge la publication (avec PDF joints) au cas où on arrive avec des données partielles
  useEffect(() => {
    let active = true;
    const id = initialOfficial?.id;
    if (!id) return () => { active = false; };
    apiFetch(`/official/${id}`).then(result => {
      if (active && result.ok && result.data) {
        setData(prev => ({ ...prev, ...result.data }));
      }
    });
    return () => { active = false; };
  }, [initialOfficial?.id]);

  const root = API_BASE_URL.replace('/api', '');
  const officialImages = useMemo(() => {
    if (data?.images && data.images.length > 0) {
      return data.images.map(im => `${root}${im.image_url}`);
    }
    if (data?.image) return [data.image];
    if (data?.image_url) {
      return [data.image_url.startsWith('http') ? data.image_url : `${root}${data.image_url}`];
    }
    return [];
  }, [data, root]);

  const officialImage = officialImages.length > 0 ? officialImages[Math.min(viewerIndex, officialImages.length - 1)] : null;

  const openViewer = (imageIndex = 0) => {
    setViewerIndex(imageIndex);
    setScale(1);
    animatedScale.setValue(1);
    setViewerVisible(true);
  };

  const toggleZoom = () => {
    const next = scale === 1 ? 2.5 : 1;
    setScale(next);
    Animated.timing(animatedScale, {
      toValue: next,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const authorName = data?.display_name || 'Direction ISPM';

  const openEdit = () => {
    setMenuOpen(false);
    setEditContent(data?.content || '');
    setEditFeedback({ type: '', message: '' });
    setEditVisible(true);
  };

  const saveEdit = async () => {
    if (!editContent.trim()) {
      setEditFeedback({ type: 'error', message: 'Le contenu ne peut pas être vide.' });
      return;
    }
    setEditBusy(true);
    setEditFeedback({ type: '', message: '' });
    const result = await apiFetch(`/official/${data.id}`, {
      method: 'PUT',
      body: JSON.stringify({ content: editContent.trim(), is_pinned: data.is_pinned }),
    });
    setEditBusy(false);
    if (result.ok) {
      setData(prev => ({ ...prev, content: editContent.trim() }));
      setEditVisible(false);
    } else {
      setEditFeedback({
        type: 'error',
        message: result.data?.message || 'Impossible de modifier la publication.',
      });
    }
  };

  const togglePin = async () => {
    setMenuOpen(false);
    const result = await apiFetch(`/official/${data.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        content: data.content || '',
        is_pinned: data.is_pinned === 1 ? 0 : 1,
      }),
    });
    if (result.ok) {
      setData(prev => ({ ...prev, is_pinned: prev.is_pinned === 1 ? 0 : 1 }));
    } else {
      Alert.alert('Erreur', result.data?.message || 'Impossible de modifier l\'épinglage.');
    }
  };

  const confirmDelete = useCallback(() => {
    setMenuOpen(false);
    setDeleteVisible(true);
  }, []);

  const doDeleteOfficial = async () => {
    setDeleting(true);
    const result = await apiFetch(`/official/${data.id}`, { method: 'DELETE' });
    setDeleting(false);
    if (result.ok) {
      setDeleteVisible(false);
      navigation.goBack();
    } else {
      setDeleteVisible(false);
      Alert.alert('Erreur', result.data?.message || 'Impossible de supprimer la publication.');
    }
  };
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Publication officielle</Text>
        <View style={styles.headerRight}>
          {isAdmin && !deleting ? (
            <View style={styles.menuContainer}>
              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => setMenuOpen(o => !o)}
              >
                <Icon name="dots-vertical" size={22} color={colors.primary} />
              </TouchableOpacity>
              {menuOpen ? (
                <View style={styles.dropdownOverlay}>
                  <TouchableOpacity style={styles.dropdownBackdrop} onPress={() => setMenuOpen(false)} />
                  <View style={styles.dropdown}>
                  <TouchableOpacity style={styles.dropdownItem} onPress={openEdit}>
                    <Icon name="pencil-outline" size={16} color={colors.textDark} />
                    <Text style={styles.dropdownText}>Modifier</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.dropdownItem} onPress={togglePin}>
                    <Icon
                      name={data?.is_pinned === 1 ? 'pin-off-outline' : 'pin-outline'}
                      size={16}
                      color={colors.textDark}
                    />
                    <Text style={styles.dropdownText}>
                      {data?.is_pinned === 1 ? 'Déépingler' : 'Épingler'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.dropdownItem} onPress={confirmDelete}>
                    <Icon name="delete-outline" size={16} color={colors.danger} />
                    <Text style={[styles.dropdownText, styles.dropdownTextDanger]}>Supprimer</Text>
                  </TouchableOpacity>
                </View>
                </View>
              ) : null}
            </View>
          ) : (
            <View style={styles.spacer} />
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {data ? (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.authorRow}>
                <View style={styles.authorAvatar}>
                  <Image
                    source={require('../../assets/ispm1.png')}
                    style={styles.authorLogo}
                    resizeMode="contain"
                  />
                </View>
                <View>
                  <Text style={styles.authorName}>{authorName}</Text>
                  <Text style={styles.time}>{formatRelativeTime(data.created_at)}</Text>
                </View>
              </View>
              {data.is_pinned === 1 ? (
                <View style={styles.pinnedBadge}>
                  <Icon name="pin" size={14} color={colors.primary} />
                  <Text style={styles.pinnedText}>Épinglé</Text>
                </View>
              ) : null}
            </View>

            {data.content ? <Text style={styles.content}>{data.content}</Text> : null}

            {officialImages.length > 0 ? (
              <OfficialCarousel
                images={officialImages}
                height={300}
                onPressImage={(i) => openViewer(i)}
              />
            ) : null}

            {data?.files && data.files.length > 0 ? (
              <View style={styles.filesContainer}>
                {data.files.map(file => (
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
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Cette publication n'existe plus.</Text>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={editVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!editBusy) {
            setEditVisible(false);
            setEditFeedback({ type: '', message: '' });
          }
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Modifier la publication</Text>
              <TouchableOpacity
                onPress={() => { setEditVisible(false); setEditFeedback({ type: '', message: '' }); }}
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
              style={[styles.saveButton, editBusy && styles.saveButtonDisabled]}
              onPress={saveEdit}
              disabled={editBusy}
            >
              {editBusy ? (
                <ActivityIndicator color={colors.onPrimary} />
              ) : (
                <Text style={styles.saveButtonText}>Enregistrer</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={viewerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setViewerVisible(false)}
      >
        <View style={styles.viewerOverlay}>
          <TouchableOpacity style={styles.viewerClose} onPress={() => setViewerVisible(false)}>
            <Icon name="close" size={30} color={colors.onPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.viewerImageContainer}
            activeOpacity={1}
            onPress={toggleZoom}
          >
            <Animated.Image
              source={{ uri: officialImage }}
              style={[styles.viewerImage, { transform: [{ scale: animatedScale }] }]}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.viewerHint}>
            {scale === 1 ? 'Double-toucher pour zoomer' : 'Double-toucher pour dézoomer'}
          </Text>
        </View>
      </Modal>

      <Modal
        visible={deleteVisible}
        transparent
        animationType="fade"
        onRequestClose={() => { if (!deleting) setDeleteVisible(false); }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmer la suppression</Text>
            <Text style={{ marginVertical: 14, color: colors.textSecondary }}>Voulez-vous vraiment supprimer cette publication officielle ?</Text>
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: colors.danger }, deleting && styles.saveButtonDisabled]}
              onPress={doDeleteOfficial}
              disabled={deleting}
            >
              {deleting ? (
                <ActivityIndicator color={colors.onPrimary} />
              ) : (
                <Text style={styles.saveButtonText}>Supprimer</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, styles.saveButtonDisabled, { backgroundColor: colors.inputBackground, marginTop: 10 }]}
              onPress={() => setDeleteVisible(false)}
              disabled={deleting}
            >
              <Text style={[styles.saveButtonText, { color: colors.textDark }]}>Annuler</Text>
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
    backgroundColor: colors.background,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    backgroundColor: colors.background,
  },
  backButton: {
    padding: SPACING.sm,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
  },
  menuContainer: {
    position: 'relative',
  },
  menuButton: {
    padding: SPACING.sm,
  },
  dropdown: {
    position: 'absolute',
    top: 34,
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
  spacer: {
    width: 40,
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
  saveButton: {
    backgroundColor: colors.headerGreen,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContent: {
    padding: SPACING.lg,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
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
    marginTop: SPACING.md,
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
  viewerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewerClose: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  viewerImageContainer: {
    width: '100%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewerImage: {
    width: '100%',
    height: '100%',
  },
  viewerHint: {
    position: 'absolute',
    bottom: 40,
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
  },
});