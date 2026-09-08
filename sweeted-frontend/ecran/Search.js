import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  FlatList, Image, ActivityIndicator
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { apiFetch } from '../config/apiClient';
import { API_BASE_URL } from '../config/api';
import { COLORS, SPACING, RADIUS } from '../config/theme';

export default function SearchScreen({ onBack }) {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [statsMap, setStatsMap] = useState({});

  const insets = useSafeAreaInsets();

  useEffect(() => {
    apiFetch('/auth/me').then(result => {
      if (result.ok && result.data) setCurrentUserId(result.data.id);
    });
  }, []);

  const fetchStats = async (users) => {
    const entries = await Promise.all(
      users.map(async (u) => {
        if (u.id === currentUserId) return [u.id, null];
        const result = await apiFetch(`/users/${u.id}/stats`);
        if (result.ok && result.data) {
          return [u.id, { is_following: !!result.data.is_following, followers_count: result.data.followers_count }];
        }
        return [u.id, null];
      })
    );
    setStatsMap(Object.fromEntries(entries));
  };

  const handleFollowToggle = async (user) => {
    const current = statsMap[user.id];
    if (!current || current.is_following === null) return;
    const newState = { ...current, is_following: !current.is_following, followers_count: current.followers_count + (current.is_following ? -1 : 1) };
    setStatsMap(prev => ({ ...prev, [user.id]: newState }));

    const result = await apiFetch(`/follow/${user.id}`, {
      method: current.is_following ? 'DELETE' : 'POST',
    });
    if (!result.ok) {
      setStatsMap(prev => ({ ...prev, [user.id]: current }));
      if (result.status === 409) return;
      setError(result.data?.message || 'Impossible de mettre à jour le suivi.');
    } else if (result.data && typeof result.data.followers_count === 'number') {
      setStatsMap(prev => ({
        ...prev,
        [user.id]: { is_following: !!result.data.is_following, followers_count: result.data.followers_count },
      }));
    }
  };

  const handleSearch = useCallback(async (query) => {
    if (!query || query.trim().length === 0) {
      setResults([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    setError('');
    setSearched(true);

    const result = await apiFetch(`/users/search?q=${encodeURIComponent(query.trim())}`);

    if (result.ok) {
      setResults(result.data || []);
      fetchStats(result.data || []);
    } else {
      if (result.errorType === 'network') {
        setError('Impossible de joindre le serveur.');
      } else if (result.errorType === 'auth') {
        setError('Vous devez être connecté pour rechercher.');
      } else {
        setError(result.data?.message || 'Erreur lors de la recherche.');
      }
      setResults([]);
    }

    setLoading(false);
  }, []);

  const onChangeText = useCallback((text) => {
    setSearch(text);
    if (text.trim().length === 0) {
      setResults([]);
      setSearched(false);
      setError('');
    }
  }, []);

  const onSubmitEditing = useCallback(() => {
    handleSearch(search);
  }, [search, handleSearch]);

  const renderUserItem = ({ item }) => {
    const stats = statsMap[item.id];
    const isSelf = currentUserId && Number(item.id) === Number(currentUserId);
    const showFollow = !isSelf && stats && stats.is_following !== null;

    return (
      <TouchableOpacity style={styles.itemRow}>
        <View style={styles.itemLeft}>
          <View style={styles.iconContainer}>
            {item.avatar_url ? (
              <Image source={{ uri: item.avatar_url.startsWith('http') ? item.avatar_url : `${API_BASE_URL.replace('/api', '')}${item.avatar_url}` }} style={styles.avatarImage} />
            ) : (
              <Feather name="user" size={18} color="#666" />
            )}
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.itemTitle} numberOfLines={1}>
              {item.display_name || item.matricule_number}
            </Text>
            <Text style={styles.itemSubtitle}>
              {item.matricule_number}
              {showFollow ? ` · ${stats.followers_count} abonné${stats.followers_count > 1 ? 's' : ''}` : ''}
            </Text>
          </View>
        </View>
        {showFollow ? (
          <TouchableOpacity
            style={[styles.followButton, stats.is_following && styles.followButtonActive]}
            onPress={() => handleFollowToggle(item)}
            activeOpacity={0.7}
          >
            <Text style={stats.is_following ? styles.followButtonTextActive : styles.followButtonText}>
              {stats.is_following ? 'Ne plus suivre' : 'Suivre'}
            </Text>
          </TouchableOpacity>
        ) : null}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.safeContainer, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={26} color="black" />
        </TouchableOpacity>

        <View style={styles.searchBarWrapper}>
          <Ionicons name="search" size={18} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Rechercher sur Sweeted"
            placeholderTextColor="#888"
            value={search}
            onChangeText={onChangeText}
            onSubmitEditing={onSubmitEditing}
            returnKeyType="search"
            autoFocus
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => onChangeText('')} style={styles.clearBtn}>
              <Ionicons name="close-circle" size={18} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {error ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={COLORS.primary} />
        </View>
      ) : searched && results.length === 0 && !error ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucun résultat pour "{search}"</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderUserItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#fff' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
  backBtn: { padding: 5 },
  searchBarWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
    borderRadius: RADIUS.full,
    height: 40,
    marginLeft: 10,
    paddingHorizontal: 15,
  },
  searchIcon: { marginRight: 8 },
  clearBtn: { marginLeft: 5 },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingVertical: 0,
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

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 15,
    textAlign: 'center',
  },

  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  itemLeft: { flexDirection: 'row', alignItems: 'center', flex: 0.9 },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F0F2F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  avatarImage: { width: '100%', height: '100%' },
  textContainer: { flex: 1 },
  itemTitle: { fontSize: 16, color: '#1c1e21', fontWeight: '500' },
  itemSubtitle: { fontSize: 13, color: '#65676b', marginTop: 2 },
  followButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    marginLeft: 10,
  },
  followButtonActive: {
    backgroundColor: COLORS.toggleInactive,
  },
  followButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  followButtonTextActive: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 13,
  },
});
