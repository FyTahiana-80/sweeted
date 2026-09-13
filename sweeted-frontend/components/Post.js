import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { Entypo, Ionicons, MaterialCommunityIcons as MIcon } from '@expo/vector-icons';
import ReactionButton from './ReactionButton';
import { formatRelativeTime } from './formatTime';
import { useTheme } from '../context/ThemeContext';

export default function Post({ post, onReact, currentUserId, role, onDelete, onEdit, onBookmark, onOpenFile }) {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => getStyles(colors, isDark), [colors, isDark]);
  const [showMenu, setShowMenu] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isAuthor = currentUserId && Number(post.user_id) === Number(currentUserId);
  const isMod = role === 'Admin' || role === 'Modérateur';
  const canManage = (isAuthor || isMod) && !!(onDelete || onEdit);
  const isBookmarked = !!post.is_bookmarked;
  const hasAttachment = !!post.file_id && post.file_type === 'file';

  const handleEdit = () => {
    setShowMenu(false);
    if (onEdit) onEdit(post);
  };

  const handleDelete = () => {
    setShowMenu(false);
    setConfirmDelete(false);
    if (onDelete) onDelete(post.id);
  };

  const toggleMenu = (e) => {
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
    setShowMenu(prev => !prev);
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: isDark ? colors.divider : 'transparent', borderWidth: isDark ? 1 : 0 }]}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image source={{ uri: post.avatar || 'https://i.pravatar.cc/150?u=default' }} style={styles.avatar} />
          <View>
            <Text style={[styles.user, { color: colors.textPrimary }]}>{post.user}</Text>
            <Text style={[styles.time, { color: colors.textSecondary }]}>{formatRelativeTime(post.created_at)}</Text>
          </View>
        </View>

        {canManage && (
          <TouchableOpacity
            onPress={toggleMenu}
            style={styles.optionsButton}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            activeOpacity={0.6}
          >
            <Entypo name="dots-three-horizontal" size={20} color={colors.textDark} />
          </TouchableOpacity>
        )}
      </View>

      <Text style={[styles.content, { color: colors.text }]}>{post.content}</Text>

      {post.image && (
        <Image source={{ uri: post.image }} style={styles.postImage} resizeMode={Platform.OS === 'web' ? 'contain' : 'cover'} />
      )}

      {hasAttachment && onOpenFile ? (
        <TouchableOpacity
          style={[styles.attachmentChip, { backgroundColor: colors.inputBackground, borderColor: colors.divider }]}
          onPress={() => onOpenFile(post)}
          activeOpacity={0.7}
        >
          <MIcon name="file-pdf-box" size={20} color={colors.danger} />
          <Text style={[styles.attachmentName, { color: colors.textDark }]} numberOfLines={1}>
            {post.file_name || 'Pièce jointe'}
          </Text>
          <View style={[styles.attachmentBadge, { backgroundColor: colors.danger }]}>
            <Text style={styles.attachmentBadgeText}>PDF</Text>
          </View>
        </TouchableOpacity>
      ) : null}

      <View style={[styles.footer, { borderTopColor: colors.divider }]}>
        <ReactionButton 
          total={post.totalReactions} 
          hasReacted={post.has_reacted}
          topEmojis={post.topEmojis}
          onReact={onReact}
          postId={post.id}
        />
        {onBookmark ? (
          <TouchableOpacity
            onPress={() => onBookmark(post.id, !isBookmarked)}
            style={styles.bookmarkButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.6}
          >
            <Ionicons
              name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
              size={22}
              color={isBookmarked ? colors.primary : colors.textSecondary}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Dropdown menu ancré à la carte (fonctionne sur web + mobile) */}
      {showMenu && (
        <View style={styles.dropdownOverlay}>
          <TouchableOpacity style={styles.dropdownBackdrop} onPress={() => setShowMenu(false)} />
          <View style={[styles.dropdown, { backgroundColor: colors.cardBackground, borderColor: colors.divider, borderWidth: 1 }]}>
            <Text style={[styles.menuTitle, { color: colors.textMuted }]}>Options du post</Text>
            {isAuthor ? (
              <TouchableOpacity style={styles.menuItem} onPress={handleEdit}>
                <Ionicons name="pencil-outline" size={20} color={colors.textDark} />
                <Text style={[styles.menuItemText, { color: colors.textDark }]}>Modifier le post</Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity style={[styles.menuItem, styles.menuItemDanger]} onPress={() => { setShowMenu(false); setConfirmDelete(true); }}>
              <Ionicons name="trash-outline" size={20} color={colors.danger} />
              <Text style={[styles.menuItemText, { color: colors.danger }]}>Supprimer le post</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.cancelButton, { backgroundColor: colors.inputBackground }]} onPress={() => setShowMenu(false)}>
              <Text style={[styles.cancelButtonText, { color: colors.textDark }]}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Confirmation de suppression */}
      {confirmDelete && (
        <View style={styles.confirmOverlay}>
          <TouchableOpacity style={styles.confirmBackdrop} onPress={() => setConfirmDelete(false)} />
          <View style={[styles.confirmBox, { backgroundColor: colors.cardBackground, borderColor: colors.divider, borderWidth: 1 }]}>
            <Text style={[styles.confirmTitle, { color: colors.textPrimary }]}>Confirmer la suppression</Text>
            <Text style={[styles.confirmSubTitle, { color: colors.textSecondary }]}>Voulez-vous vraiment supprimer ce post ?</Text>
            <View style={styles.confirmActions}>
              <TouchableOpacity style={[styles.confirmCancelBtn, { backgroundColor: colors.inputBackground }]} onPress={() => setConfirmDelete(false)}>
                <Text style={[styles.confirmCancelText, { color: colors.textDark }]}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.confirmDeleteBtn, { backgroundColor: colors.danger }]} onPress={handleDelete}>
                <Text style={styles.confirmDeleteText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const getStyles = (colors, isDark) => StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 15,
    borderRadius: 15,
    elevation: 3,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: colors.divider,
  },
  user: {
    fontWeight: 'bold',
    fontSize: 14,
    color: colors.textPrimary,
  },
  time: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  content: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 10,
  },
  postImage: {
    width: '100%',
    height: Platform.OS === 'web' ? 420 : 200,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: colors.inputBackground,
  },
  attachmentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.divider,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginBottom: 10,
    gap: 8,
  },
  attachmentName: {
    flex: 1,
    fontSize: 13,
    color: colors.textDark,
    fontWeight: '500',
  },
  attachmentBadge: {
    backgroundColor: colors.danger,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  attachmentBadgeText: {
    color: colors.onPrimary,
    fontSize: 10,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 5,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bookmarkButton: {
    padding: 6,
    borderRadius: 20,
  },
  optionsButton: {
    padding: 8,
    marginRight: Platform.OS === 'android' ? '5%' : 0,
    borderRadius: 20,
  },
  dropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
  },
  dropdownBackdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 40,
  },
  dropdown: {
    position: 'absolute',
    top: 48,
    right: 10,
    zIndex: 50,
    width: 220,
    backgroundColor: colors.cardBackground,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
    elevation: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: colors.textDark,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  menuItemDanger: {
    borderBottomWidth: 0,
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textDark,
  },
  cancelButton: {
    marginTop: 15,
    paddingVertical: 10,
    backgroundColor: colors.inputBackground,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontWeight: 'bold',
    color: colors.textSecondary,
  },
  confirmOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 60,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
  },
  confirmBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.backdrop,
    borderRadius: 15,
  },
  confirmBox: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  confirmTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  confirmSubTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  confirmActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  confirmCancelBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: colors.inputBackground,
    alignItems: 'center',
  },
  confirmCancelText: {
    fontWeight: '600',
    color: colors.textDark,
  },
  confirmDeleteBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: colors.danger,
    alignItems: 'center',
  },
  confirmDeleteText: {
    fontWeight: 'bold',
    color: colors.onPrimary,
  },
});