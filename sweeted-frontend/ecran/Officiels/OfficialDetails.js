import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity, ScrollView,
  Modal, Animated, TextInput, Alert, ActivityIndicator
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { apiFetch } from '../../config/apiClient';
import { API_BASE_URL } from '../../config/api';
import { formatRelativeTime } from '../../components/formatTime';
import { COLORS, SPACING, RADIUS } from '../../config/theme';

export default function OfficialDetails({ route }) {
  const { official: initialOfficial } = route.params;
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [data, setData] = useState(initialOfficial);
  const [isAdmin, setIsAdmin] = useState(false);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [scale, setScale] = useState(1);
  const animatedScale = useRef(new Animated.Value(1)).current;

  const [menuOpen, setMenuOpen] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editBusy, setEditBusy] = useState(false);
  const [editFeedback, setEditFeedback] = useState({ type: '', message: '' });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;
    apiFetch('/auth/me').then(result => {
      if (active && result.ok && result.data) {
        setIsAdmin(result.data.role === 'Admin');
      }
    });
    return () => { active = false; };
  }, []);

  const officialImage = data?.image_url
    ? data?.image_url.startsWith('http')
      ? data.image_url
      : `${API_BASE_URL.replace('/api', '')}${data.image_url}`
    : null;

  const openViewer = () => {
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
    Alert.alert(
      'Supprimer',
      'Voulez-vous vraiment supprimer cette publication officielle ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            const result = await apiFetch(`/official/${data.id}`, { method: 'DELETE' });
            setDeleting(false);
            if (result.ok) {
              navigation.goBack();
            } else {
              Alert.alert('Erreur', result.data?.message || 'Impossible de supprimer la publication.');
            }
          },
        },
      ]
    );
  }, [data, navigation]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Publication officielle</Text>
        <View style={styles.headerRight}>
          {isAdmin && !deleting ? (
            <View style={styles.menuContainer}>
              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => setMenuOpen(o => !o)}
              >
                <Icon name="dots-vertical" size={22} color={COLORS.primary} />
              </TouchableOpacity>
              {menuOpen ? (
                <View style={styles.dropdown}>
                  <TouchableOpacity style={styles.dropdownItem} onPress={openEdit}>
                    <Icon name="pencil-outline" size={16} color={COLORS.textDark} />
                    <Text style={styles.dropdownText}>Modifier</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.dropdownItem} onPress={togglePin}>
                    <Icon
                      name={data?.is_pinned === 1 ? 'pin-off-outline' : 'pin-outline'}
                      size={16}
                      color={COLORS.textDark}
                    />
                    <Text style={styles.dropdownText}>
                      {data?.is_pinned === 1 ? 'Déépingler' : 'Épingler'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.dropdownItem} onPress={confirmDelete}>
                    <Icon name="delete-outline" size={16} color={COLORS.danger} />
                    <Text style={[styles.dropdownText, styles.dropdownTextDanger]}>Supprimer</Text>
                  </TouchableOpacity>
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
                  <Icon name="school" size={22} color={COLORS.primary} />
                </View>
                <View>
                  <Text style={styles.authorName}>{authorName}</Text>
                  <Text style={styles.time}>{formatRelativeTime(data.created_at)}</Text>
                </View>
              </View>
              {data.is_pinned === 1 ? (
                <View style={styles.pinnedBadge}>
                  <Icon name="pin" size={14} color={COLORS.primary} />
                  <Text style={styles.pinnedText}>Épinglé</Text>
                </View>
              ) : null}
            </View>

            {data.content ? <Text style={styles.content}>{data.content}</Text> : null}

            {officialImage ? (
              <TouchableOpacity activeOpacity={0.9} onPress={openViewer}>
                <Image
                  source={{ uri: officialImage }}
                  style={styles.officialImage}
                  resizeMode="cover"
                />
                <View style={styles.zoomHint}>
                  <Icon name="fullscreen" size={16} color={COLORS.white} />
                  <Text style={styles.zoomHintText}>Toucher pour zoomer</Text>
                </View>
              </TouchableOpacity>
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
              style={[styles.saveButton, editBusy && styles.saveButtonDisabled]}
              onPress={saveEdit}
              disabled={editBusy}
            >
              {editBusy ? (
                <ActivityIndicator color={COLORS.white} />
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
            <Icon name="close" size={30} color={COLORS.white} />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    backgroundColor: COLORS.background,
  },
  backButton: {
    padding: SPACING.sm,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
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
  spacer: {
    width: 40,
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
  saveButton: {
    backgroundColor: COLORS.headerGreen,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContent: {
    padding: SPACING.lg,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
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
    height: 300,
    borderRadius: RADIUS.lg,
    backgroundColor: '#eee',
  },
  zoomHint: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 5,
  },
  zoomHintText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '600',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textMuted,
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