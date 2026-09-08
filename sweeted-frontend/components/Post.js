import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Entypo, Ionicons, MaterialCommunityIcons as MIcon } from '@expo/vector-icons';
import ReactionButton from './ReactionButton';
import { formatRelativeTime } from './formatTime';
import { COLORS } from '../config/theme';

export default function Post({ post, onReact, currentUserId, role, onDelete, onEdit, onBookmark, onOpenFile }) {
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
    if (e) e.stopPropagation();
    setShowMenu(prev => !prev);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image source={{ uri: post.avatar }} style={styles.avatar} />
          <View>
            <Text style={styles.user}>{post.user}</Text>
            <Text style={styles.time}>{formatRelativeTime(post.created_at)}</Text>
          </View>
        </View>

        {canManage && (
          <TouchableOpacity
            onPress={toggleMenu}
            style={styles.optionsButton}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            activeOpacity={0.6}
          >
            <Entypo name="dots-three-horizontal" size={20} color={COLORS.textDark} />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.content}>{post.content}</Text>

      {post.image && (
        <Image source={{ uri: post.image }} style={styles.postImage} />
      )}

      {hasAttachment && onOpenFile ? (
        <TouchableOpacity
          style={styles.attachmentChip}
          onPress={() => onOpenFile(post)}
          activeOpacity={0.7}
        >
          <MIcon name="file-pdf-box" size={20} color={COLORS.danger} />
          <Text style={styles.attachmentName} numberOfLines={1}>
            {post.file_name || 'Pièce jointe'}
          </Text>
          <View style={styles.attachmentBadge}>
            <Text style={styles.attachmentBadgeText}>PDF</Text>
          </View>
        </TouchableOpacity>
      ) : null}

      <View style={styles.footer}>
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
              color={isBookmarked ? COLORS.primary : COLORS.textSecondary}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Dropdown menu ancré à la carte (fonctionne sur web + mobile) */}
      {showMenu && (
        <View style={styles.dropdownOverlay}>
          <TouchableOpacity style={styles.dropdownBackdrop} onPress={() => setShowMenu(false)} />
          <View style={styles.dropdown}>
            <Text style={styles.menuTitle}>Options du post</Text>
            {isAuthor ? (
              <TouchableOpacity style={styles.menuItem} onPress={handleEdit}>
                <Ionicons name="pencil-outline" size={20} color={COLORS.textDark} />
                <Text style={styles.menuItemText}>Modifier le post</Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity style={[styles.menuItem, styles.menuItemDanger]} onPress={() => { setShowMenu(false); setConfirmDelete(true); }}>
              <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
              <Text style={[styles.menuItemText, { color: COLORS.danger }]}>Supprimer le post</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowMenu(false)}>
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Confirmation de suppression */}
      {confirmDelete && (
        <View style={styles.confirmOverlay}>
          <TouchableOpacity style={styles.confirmBackdrop} onPress={() => setConfirmDelete(false)} />
          <View style={styles.confirmBox}>
            <Text style={styles.confirmTitle}>Confirmer la suppression</Text>
            <Text style={styles.confirmSubTitle}>Voulez-vous vraiment supprimer ce post ?</Text>
            <View style={styles.confirmActions}>
              <TouchableOpacity style={styles.confirmCancelBtn} onPress={() => setConfirmDelete(false)}>
                <Text style={styles.confirmCancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmDeleteBtn} onPress={handleDelete}>
                <Text style={styles.confirmDeleteText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 15,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
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
    backgroundColor: '#ddd',
  },
  user: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000',
  },
  time: {
    fontSize: 11,
    color: '#999',
    marginTop: 1,
  },
  content: {
    fontSize: 16,
    color: '#1c1e21',
    lineHeight: 22,
    marginBottom: 10,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#eee',
  },
  attachmentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F7',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginBottom: 10,
    gap: 8,
  },
  attachmentName: {
    flex: 1,
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  attachmentBadge: {
    backgroundColor: COLORS.danger,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  attachmentBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 5,
    borderTopWidth: 1,
    borderTopColor: '#F0F2F5',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuItemDanger: {
    borderBottomWidth: 0,
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  cancelButton: {
    marginTop: 15,
    paddingVertical: 10,
    backgroundColor: '#F5F5F7',
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontWeight: 'bold',
    color: '#666',
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
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 15,
  },
  confirmBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  confirmTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 8,
  },
  confirmSubTitle: {
    fontSize: 14,
    color: '#666',
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
    backgroundColor: '#F0F2F5',
    alignItems: 'center',
  },
  confirmCancelText: {
    fontWeight: '600',
    color: '#444',
  },
  confirmDeleteBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: COLORS.danger,
    alignItems: 'center',
  },
  confirmDeleteText: {
    fontWeight: 'bold',
    color: 'white',
  },
});