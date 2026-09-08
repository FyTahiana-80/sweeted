import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { apiFetch } from '../config/apiClient';
import { formatRelativeTime } from '../components/formatTime';
import { COLORS, SPACING, RADIUS } from '../config/theme';

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNotifications = useCallback(async () => {
    setError('');

    const result = await apiFetch('/notifications');
    if (result.ok) {
      setNotifications(result.data?.notifications || []);
      setUnreadCount(result.data?.unread_count || 0);
    } else {
      let message;
      if (result.errorType === 'network') {
        message = 'Impossible de joindre le serveur. Vérifiez votre connexion.';
      } else if (result.errorType === 'auth') {
        message = 'Vous devez être connecté pour voir vos notifications.';
      } else {
        message = result.data?.message || 'Impossible de charger les notifications.';
      }
      setError(message);
    }

    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [fetchNotifications])
  );

  const openNotification = async (item) => {
    if (item.is_read !== 1) {
      const readResult = await apiFetch(`/notifications/${item.id}/read`, { method: 'PUT' });
      if (readResult.ok) {
        setNotifications(prev =>
          prev.map(n => (n.id === item.id ? { ...n, is_read: 1 } : n))
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    }

    if (item.id_official_post) {
      navigation.navigate('OfficialDetails', {
        official: {
          id: item.id_official_post,
          content: item.official_content,
          image_url: item.official_image_url,
          is_pinned: item.official_is_pinned,
          created_at: item.official_created_at,
          display_name: null,
          avatar_url: null,
        },
      });
    }
  };

  const markAllRead = async () => {
    const result = await apiFetch('/notifications/read-all', { method: 'PUT' });
    if (result.ok) {
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
    }
  };

  const renderNotification = ({ item }) => (
    <TouchableOpacity
      style={[styles.notifItem, item.is_read !== 1 && styles.notifItemUnread]}
      onPress={() => openNotification(item)}
      activeOpacity={0.7}
    >
      <View style={[styles.notifIcon, item.is_read !== 1 && styles.notifIconUnread]}>
        <Icon name="bullhorn-outline" size={22} color={COLORS.primary} />
      </View>
      <View style={styles.notifContent}>
        <Text style={styles.notifMessage} numberOfLines={3}>{item.message}</Text>
        <Text style={styles.notifTime}>{formatRelativeTime(item.created_at)}</Text>
      </View>
      {item.is_read !== 1 ? <View style={styles.unreadDot} /> : null}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 ? (
          <TouchableOpacity style={styles.markAllButton} onPress={markAllRead}>
            <Text style={styles.markAllText}>Tout lire</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.spacer} />
        )}
      </View>

      {error ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {loading && notifications.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => item.id.toString()}
          renderItem={renderNotification}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            !loading ? (
              <View style={styles.emptyContainer}>
                <Icon name="bell-outline" size={48} color={COLORS.textLight} />
                <Text style={styles.emptyText}>Aucune notification.</Text>
              </View>
            ) : null
          }
        />
      )}
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
  markAllButton: {
    padding: SPACING.sm,
  },
  markAllText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 13,
  },
  spacer: {
    width: 68,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingVertical: 8,
    flexGrow: 1,
  },
  notifItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  notifItemUnread: {
    backgroundColor: '#F2FAF5',
  },
  notifIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.screenBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  notifIconUnread: {
    backgroundColor: '#E8F5EC',
  },
  notifContent: {
    flex: 1,
  },
  notifMessage: {
    fontSize: 14,
    color: COLORS.textDark,
    lineHeight: 19,
  },
  notifTime: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 3,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
    marginLeft: SPACING.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
});