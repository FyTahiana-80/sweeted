import React, { useMemo, useState, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';
import { FlatList, View, StyleSheet, StatusBar, TouchableOpacity, Text, RefreshControl, Alert, Modal, TextInput, ActivityIndicator, Platform } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import Post from '../../components/Post';
import { apiFetch } from '../../config/apiClient';
import { API_BASE_URL } from '../../config/api';
import { openPdf } from '../../config/openPdf';
import { SPACING } from '../../config/theme';
import { useTheme } from '../../context/ThemeContext';
import ScrollProgress from '../../components/ScrollProgress';

const POSTS_PER_PAGE = 20;


const hideFeedScrollbar = () => {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return;
  if (document.getElementById('hide-feed-scrollbar')) return;
  const style = document.createElement('style');
  style.id = 'hide-feed-scrollbar';
  style.textContent = '[data-testid="home-feed"]{scrollbar-width:none;-ms-overflow-style:none;}[data-testid="home-feed"]::-webkit-scrollbar{display:none;width:0 !important;height:0 !important;}';
  document.head.appendChild(style);
};
const Home = forwardRef((props, ref) => {
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => getStyles(colors, isDark), [colors, isDark]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    hideFeedScrollbar();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPosts(0);
    }, [])
  );

  const fetchCurrentUser = async () => {
    const result = await apiFetch('/auth/me');
    if (result.ok && result.data) {
      setCurrentUserId(result.data.id);
      setCurrentUserRole(result.data.role);
    }
  };

  const fetchPosts = async (newOffset = 0) => {
    if (newOffset === 0) setLoading(true);
    setError('');

    const result = await apiFetch(`/posts?limit=${POSTS_PER_PAGE}&offset=${newOffset}`);

    if (result.ok) {
      const data = result.data || [];
      const enrichedPosts = data.map(post => ({
        ...post,
        user: post.display_name || `Utilisateur ${post.user_id}`,
        avatar: post.avatar_url ? (post.avatar_url.startsWith('http') ? post.avatar_url : `${API_BASE_URL.replace('/api', '')}${post.avatar_url}`) : `https://i.pravatar.cc/150?u=user${post.user_id}`,
        totalReactions: Number(post.total_reactions) || 0,
        has_reacted: !!post.has_reacted,
        is_bookmarked: !!post.is_bookmarked,
        image: post.image_url ? `${API_BASE_URL.replace('/api', '')}${post.image_url}` : null,
        file_id: post.file_id || null,
        file_name: post.file_name || null,
        file_type: post.file_type || null,
        file_path: post.file_path || null,
        created_at: post.created_at,
      }));

      if (newOffset === 0) {
        setPosts(enrichedPosts);
      } else {
        setPosts(prev => [...prev, ...enrichedPosts]);
      }

      setOffset(newOffset);
      setHasMore(data.length >= POSTS_PER_PAGE);
    } else {
      let message;
      if (result.errorType === 'network') {
        message = 'Impossible de joindre le serveur. Vérifiez votre connexion.';
      } else if (result.errorType === 'auth') {
        message = 'Vous devez être connecté pour voir les posts.';
      } else {
        message = result.data?.message || 'Impossible de charger les posts.';
      }
      setError(message);
    }

    setLoading(false);
  };

  const handleFeedScroll = (e) => {
    const n = (e && e.nativeEvent) || {};
    if (!n.contentOffset || !n.contentSize || !n.layoutMeasurement) return;
    const max = n.contentSize.height - n.layoutMeasurement.height;
    setScrollProgress(max > 0 ? Math.min(1, Math.max(0, n.contentOffset.y / max)) : 0);
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts(0).then(() => setRefreshing(false));
  }, []);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !loading) {
      fetchPosts(offset + POSTS_PER_PAGE);
    }
  }, [hasMore, loading, offset]);

  useImperativeHandle(ref, () => ({
    refreshPosts: () => fetchPosts(0)
  }));

  const handleReact = (postId, added) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, totalReactions: added ? post.totalReactions + 1 : Math.max(0, post.totalReactions - 1), has_reacted: added }
          : post
      )
    );
  };

  const handleBookmark = async (postId, bookmarked) => {
    setPosts(prev =>
      prev.map(p => (p.id === postId ? { ...p, is_bookmarked: bookmarked } : p))
    );
    const result = await apiFetch(`/bookmarks/${postId}`, {
      method: bookmarked ? 'POST' : 'DELETE',
    });
    if (!result.ok) {
      setPosts(prev =>
        prev.map(p => (p.id === postId ? { ...p, is_bookmarked: !bookmarked } : p))
      );
      if (result.status === 409) return;
      Alert.alert('Erreur', result.data?.message || 'Impossible de mettre à jour l\'enregistrement.');
    }
  };

  const handleDeletePost = async (postId) => {
    const result = await apiFetch(`/posts/${postId}`, { method: 'DELETE' });
    if (result.ok) {
      setPosts(prev => prev.filter(p => p.id !== postId));
    } else {
      Alert.alert('Erreur', result.data?.message || 'Impossible de supprimer le post.');
    }
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setEditContent(post.content);
    setEditModalVisible(true);
  };

  const handleOpenFile = (post) => {
    if (!post.file_path) return;
    openPdf(`${API_BASE_URL.replace('/api', '')}${post.file_path}`);
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim()) {
      Alert.alert('Erreur', 'Le contenu ne peut pas être vide.');
      return;
    }

    setIsEditing(true);
    const result = await apiFetch(`/posts/${editingPost.id}`, {
      method: 'PUT',
      body: JSON.stringify({ content: editContent.trim() }),
    });
    setIsEditing(false);

    if (result.ok) {
      setPosts(prev =>
        prev.map(p =>
          p.id === editingPost.id ? { ...p, content: editContent.trim() } : p
        )
      );
      setEditModalVisible(false);
      setEditingPost(null);
      setEditContent('');
    } else {
      Alert.alert('Erreur', result.data?.message || 'Impossible de modifier le post.');
    }
  };

  if (loading && posts.length === 0) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.screenBackground }]}>
        <Text style={{ color: colors.textDark }}>Chargement des posts...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.screenBackground }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {error ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        style={{ flex: 1, width: '100%', maxWidth: 770, alignSelf: 'center' }}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={[styles.postCard, { backgroundColor: colors.cardBackground, borderColor: isDark ? colors.divider : 'transparent', borderWidth: isDark ? 1 : 0 }]}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => navigation.navigate('PostDetails', { post: item })}
            >
              <Post
                post={item}
                onReact={(added) => handleReact(item.id, added)}
                currentUserId={currentUserId}
                role={currentUserRole}
                onDelete={handleDeletePost}
                onEdit={handleEditPost}
                onBookmark={(postId, bookmarked) => handleBookmark(postId, bookmarked)}
                onOpenFile={handleOpenFile}
              />
            </TouchableOpacity>

            <View style={styles.commentActionArea}>
              <View style={[styles.divider, { backgroundColor: colors.divider }]} />
              <TouchableOpacity
                style={styles.commentInfo}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('PostDetails', { post: item })}
              >
                <Icon name="chat-outline" size={20} color={colors.primary} />
                <Text style={[styles.commentText, { color: colors.textSecondary }]}>Voir ou ajouter un commentaire...</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        testID="home-feed"
        onScroll={handleFeedScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          !loading && !error ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Aucun post pour le moment. Sois le premier a publier !</Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          hasMore && posts.length > 0 ? (
            <View style={styles.loadingMore}>
              <Text style={styles.loadingMoreText}>Chargement...</Text>
            </View>
          ) : null
        }
      />

      <View style={styles.progressRing} pointerEvents="none">
        <ScrollProgress progress={scrollProgress} />
      </View>

      <Modal
        visible={editModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!isEditing) {
            setEditModalVisible(false);
            setEditingPost(null);
            setEditContent('');
          }
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textDark }]}>Modifier le post</Text>
              <TouchableOpacity onPress={() => { setEditModalVisible(false); setEditingPost(null); setEditContent(''); }} disabled={isEditing}>
                <Icon name="close" size={28} color={colors.textDark} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={[styles.textInput, { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.divider }]}
              placeholder="Modifier votre post..."
              placeholderTextColor={colors.placeholder}
              multiline
              value={editContent}
              onChangeText={setEditContent}
              editable={!isEditing}
            />
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: colors.primary }, isEditing && { opacity: 0.6 }]}
              onPress={handleSaveEdit}
              disabled={isEditing}
            >
              {isEditing ? (
                <ActivityIndicator color={colors.onPrimary} />
              ) : (
                <Text style={styles.submitButtonText}>Enregistrer</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
});

Home.displayName = 'Home';

export default Home;

const getStyles = (colors, isDark) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.screenBackground,
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
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  errorText: {
    color: colors.danger,
    textAlign: 'center',
  },
  listContent: {
    paddingVertical: 10,
    paddingBottom: 120,
  },
  postCard: {
    backgroundColor: colors.cardBackground,
    marginBottom: 12,
    marginHorizontal: 12,
    elevation: 1,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  commentActionArea: {
    paddingHorizontal: 15,
    paddingBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginBottom: 10,
  },
  commentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentText: {
    marginLeft: 8,
    color: colors.textMuted,
    fontSize: 13,
    fontStyle: 'italic',
  },
  loadingMore: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingMoreText: {
    color: colors.textMuted,
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    width: '85%',
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: colors.textDark,
    minHeight: 100,
    marginBottom: 15,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressRing: {
    position: 'absolute',
    right: 18,
    bottom: Platform.OS === 'web' ? 24 : 96,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.cardBackground,
    elevation: 5,
    zIndex: 10,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
  },
});