import React, { useMemo, useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  View, Text, StyleSheet, FlatList, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform, Image, Alert, Modal, ActivityIndicator
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Post from '../../components/Post';
import { apiFetch } from '../../config/apiClient';
import { API_BASE_URL } from '../../config/api';
import { openPdf } from '../../config/openPdf';
import { SPACING, RADIUS } from '../../config/theme';

export default function PostDetails({ route }) {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => getStyles(colors, isDark), [colors, isDark]);
  const { post: initialPost } = route.params;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [currentPost, setCurrentPost] = useState(initialPost);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentError, setCommentError] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchComments();
    fetchMe();
  }, []);

  const handleReact = (added) => {
    setCurrentPost(p => ({
      ...p,
      totalReactions: added ? (p.totalReactions || 0) + 1 : Math.max(0, (p.totalReactions || 0) - 1),
      has_reacted: added,
    }));
  };

  const handleBookmark = async (postId, bookmarked) => {
    setCurrentPost(p => ({ ...p, is_bookmarked: bookmarked }));
    const result = await apiFetch(`/bookmarks/${postId}`, {
      method: bookmarked ? 'POST' : 'DELETE',
    });
    if (!result.ok) {
      setCurrentPost(p => ({ ...p, is_bookmarked: !bookmarked }));
      if (result.status === 409) return;
      Alert.alert('Erreur', result.data?.message || "Impossible de mettre à jour l'enregistrement.");
    }
  };

  const handleDeletePost = async (postId) => {
    const result = await apiFetch(`/posts/${postId}`, { method: 'DELETE' });
    if (result.ok) {
      navigation.goBack();
    } else {
      Alert.alert('Erreur', result.data?.message || 'Impossible de supprimer le post.');
    }
  };

  const handleEditPost = (p) => {
    setEditContent(p.content || '');
    setEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim()) {
      Alert.alert('Erreur', 'Le contenu ne peut pas être vide.');
      return;
    }
    setIsEditing(true);
    const result = await apiFetch(`/posts/${currentPost.id}`, {
      method: 'PUT',
      body: JSON.stringify({ content: editContent.trim() }),
    });
    setIsEditing(false);
    if (result.ok) {
      setCurrentPost(p => ({ ...p, content: editContent.trim() }));
      setEditModalVisible(false);
    } else {
      Alert.alert('Erreur', result.data?.message || 'Impossible de modifier le post.');
    }
  };

  const fetchMe = async () => {
    const result = await apiFetch('/auth/me');
    if (result.ok && result.data) {
      setCurrentUserId(result.data.id);
      setCurrentUserRole(result.data.role);
    }
  };

  const fetchComments = async () => {
    setLoading(true);
    setError('');

    const result = await apiFetch(`/comments/${currentPost.id}`);

    if (result.ok) {
      const enrichedComments = (result.data || []).map(comment => ({
        ...comment,
        user: comment.display_name || `Utilisateur ${comment.user_id}`,
        text: comment.content,
        avatar: comment.avatar_url ? (comment.avatar_url.startsWith('http') ? comment.avatar_url : `${API_BASE_URL.replace('/api', '')}${comment.avatar_url}`) : `https://i.pravatar.cc/150?u=user${comment.user_id}`,
      }));
      setComments(enrichedComments);
    } else {
      let message;
      if (result.errorType === 'network') {
        message = 'Impossible de joindre le serveur. Vérifiez votre connexion.';
      } else if (result.errorType === 'auth') {
        message = 'Vous devez être connecté pour voir les commentaires.';
      } else if (result.errorType === 'validation') {
        message = result.data?.message || 'La requête de commentaires est invalide.';
      } else if (result.errorType === 'server') {
        message = 'Le serveur a rencontré une erreur lors du chargement des commentaires.';
      } else {
        message = result.data?.message || 'Impossible de charger les commentaires.';
      }
      setError(message);
      setComments([]);
    }

    setLoading(false);
  };

  const addComment = async () => {
    if (newComment.trim().length === 0) return;

    setCommentError('');

    const result = await apiFetch(`/comments/${currentPost.id}`, {
      method: 'POST',
      body: JSON.stringify({ content: newComment }),
    });

    if (result.ok) {
      setNewComment('');
      fetchComments();
      return;
    }

    let message;
    if (result.errorType === 'auth') {
      message = 'Vous devez être connecté pour ajouter un commentaire.';
    } else if (result.errorType === 'validation') {
      message = result.data?.message || 'Le commentaire est invalide.';
    } else if (result.errorType === 'server') {
      message = 'Le serveur a rencontré une erreur lors de l’ajout du commentaire.';
    } else {
      message = result.data?.message || 'Impossible d’ajouter le commentaire.';
    }
    setCommentError(message);
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails du post</Text>
        <View style={styles.spacer} />
      </View>

      {error ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <FlatList
        data={comments}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Post
              post={currentPost}
              onReact={handleReact}
              currentUserId={currentUserId}
              role={currentUserRole}
              onBookmark={handleBookmark}
              onDelete={handleDeletePost}
              onEdit={handleEditPost}
              onOpenFile={(p) => {
                if (!p.file_path) return;
                openPdf(`${API_BASE_URL.replace('/api', '')}${p.file_path}`);
              }}
            />
            <Text style={styles.sectionTitle}>Commentaires ({comments.length})</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.commentItem}>
            <Image source={{ uri: item.avatar }} style={styles.commentAvatar} />
            <View style={styles.commentTextContainer}>
              <Text style={styles.commentUser}>{item.user}</Text>
              <Text style={styles.commentText}>{item.text}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucun commentaire. Lance la discussion !</Text>
          </View>
        }
      />

      <View style={styles.inputWrapper}>
        {commentError ? (
          <Text style={styles.commentErrorText}>{commentError}</Text>
        ) : null}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Écrire un commentaire..."
            placeholderTextColor={colors.placeholder}
            value={newComment}
            onChangeText={setNewComment}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, !newComment.trim() && styles.sendButtonDisabled]}
            onPress={addComment}
            disabled={!newComment.trim()}
          >
            <Icon name="send" size={24} color={newComment.trim() ? colors.primary : colors.disabled} />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={editModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!isEditing) {
            setEditModalVisible(false);
            setEditContent('');
          }
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Modifier le post</Text>
              <TouchableOpacity onPress={() => { setEditModalVisible(false); setEditContent(''); }} disabled={isEditing}>
                <Icon name="close" size={24} color={colors.textDark} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.editTextInput}
              multiline
              value={editContent}
              onChangeText={setEditContent}
              editable={!isEditing}
            />
            <TouchableOpacity
              style={[styles.saveEditBtn, isEditing && styles.saveEditBtnDisabled]}
              onPress={handleSaveEdit}
              disabled={isEditing}
            >
              {isEditing ? (
                <ActivityIndicator color={colors.onPrimary} />
              ) : (
                <Text style={styles.saveEditText}>Enregistrer</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const getStyles = (colors, isDark) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
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
  spacer: {
    width: 40,
  },
  errorBanner: {
    backgroundColor: colors.danger + '1A',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  errorText: {
    color: colors.danger,
    textAlign: 'center',
  },
  headerContainer: { borderBottomWidth: 1, borderBottomColor: colors.divider, marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginHorizontal: SPACING.lg, marginBottom: SPACING.md, color: colors.textDark },
  listContent: { paddingBottom: 20 },

  commentItem: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: 12,
    alignItems: 'flex-start',
  },
  commentAvatar: { width: 36, height: 36, borderRadius: 18, marginRight: SPACING.md },
  commentTextContainer: { flex: 1, backgroundColor: '#F2F3F5', padding: 10, borderRadius: RADIUS.xl },
  commentUser: { fontWeight: 'bold', fontSize: 13, marginBottom: 2, color: colors.primary },
  commentText: { fontSize: 14, color: colors.textDark, lineHeight: 18 },

  inputWrapper: {
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    backgroundColor: colors.background,
  },
  commentErrorText: {
    color: colors.danger,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    paddingVertical: 8,
    fontSize: 15,
    color: colors.textDark,
  },
  sendButton: { marginLeft: 10, padding: 5 },
  sendButtonDisabled: { opacity: 0.5 },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.cardBackground,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    width: '100%',
    maxWidth: 500,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  editTextInput: {
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    minHeight: 100,
    fontSize: 15,
    color: colors.textDark,
    textAlignVertical: 'top',
    marginBottom: SPACING.lg,
  },
  saveEditBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  saveEditBtnDisabled: {
    opacity: 0.6,
  },
  saveEditText: {
    color: colors.onPrimary,
    fontWeight: 'bold',
    fontSize: 15,
  },
  emptyContainer: {
    paddingVertical: 30,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
  },
});