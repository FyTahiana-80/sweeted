import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform, Image
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Post from '../../components/Post';
import { apiFetch } from '../../config/apiClient';
import { API_BASE_URL } from '../../config/api';
import { openPdf } from '../../config/openPdf';
import { COLORS, SPACING, RADIUS } from '../../config/theme';

export default function PostDetails({ route }) {
  const { post } = route.params;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentError, setCommentError] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null);

  useEffect(() => {
    fetchComments();
    fetchMe();
  }, []);

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

    const result = await apiFetch(`/comments/${post.id}`);

    if (result.ok) {
      const enrichedComments = (result.data || []).map(comment => ({
        ...comment,
        user: comment.display_name || `Utilisateur ${comment.user_id}`,
        text: comment.content,
        avatar: comment.avatar_url || `https://i.pravatar.cc/150?u=user${comment.user_id}`,
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

    const result = await apiFetch(`/comments/${post.id}`, {
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
          <Icon name="arrow-left" size={24} color={COLORS.primary} />
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
            <Post post={post} onReact={() => {}} currentUserId={currentUserId} role={currentUserRole} onOpenFile={(p) => {
              if (!p.file_path) return;
              openPdf(`${API_BASE_URL.replace('/api', '')}${p.file_path}`);
            }} />
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
      />

      <View style={styles.inputWrapper}>
        {commentError ? (
          <Text style={styles.commentErrorText}>{commentError}</Text>
        ) : null}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Écrire un commentaire..."
            placeholderTextColor={COLORS.placeholder}
            value={newComment}
            onChangeText={setNewComment}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, !newComment.trim() && styles.sendButtonDisabled]}
            onPress={addComment}
            disabled={!newComment.trim()}
          >
            <Icon name="send" size={24} color={newComment.trim() ? COLORS.primary : COLORS.disabled} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
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
  spacer: {
    width: 40,
  },
  errorBanner: {
    backgroundColor: '#FFF0F0',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  errorText: {
    color: COLORS.danger,
    textAlign: 'center',
  },
  headerContainer: { borderBottomWidth: 1, borderBottomColor: COLORS.divider, marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginHorizontal: SPACING.lg, marginBottom: SPACING.md, color: COLORS.textDark },
  listContent: { paddingBottom: 20 },

  commentItem: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: 12,
    alignItems: 'flex-start',
  },
  commentAvatar: { width: 36, height: 36, borderRadius: 18, marginRight: SPACING.md },
  commentTextContainer: { flex: 1, backgroundColor: '#F2F3F5', padding: 10, borderRadius: RADIUS.xl },
  commentUser: { fontWeight: 'bold', fontSize: 13, marginBottom: 2, color: COLORS.primary },
  commentText: { fontSize: 14, color: '#444', lineHeight: 18 },

  inputWrapper: {
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    backgroundColor: COLORS.background,
  },
  commentErrorText: {
    color: COLORS.danger,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    paddingVertical: 8,
    fontSize: 15,
    color: COLORS.textDark,
  },
  sendButton: { marginLeft: 10, padding: 5 },
  sendButtonDisabled: { opacity: 0.5 },
});