import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  FlatList, Image, ActivityIndicator, Modal
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { apiFetch } from '../config/apiClient';
import { API_BASE_URL } from '../config/api';
import { SPACING, RADIUS } from '../config/theme';

export default function SearchScreen({ onBack }) {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => getStyles(colors, isDark), [colors, isDark]);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [statsMap, setStatsMap] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);

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
          return [u.id, { is_following: !!result.data.is_following, followers_count: Number(result.data.followers_count) || 0 }];
        }
        return [u.id, null];
      })
    );
    setStatsMap(Object.fromEntries(entries));
  };

  const handleFollowToggle = async (user) => {
    const current = statsMap[user.id];
    if (!current || current.is_following === null) return;
    const newState = { ...current, is_following: !current.is_following, followers_count: (Number(current.followers_count) || 0) + (current.is_following ? -1 : 1) };
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
    <View style={styles.itemRow}>
        <TouchableOpacity style={styles.itemLeft} onPress={() => setSelectedUser(item)} activeOpacity={0.7}>
          <View style={styles.iconContainer}>
            {item.avatar_url ? (
              <Image source={{ uri: item.avatar_url.startsWith('http') ? item.avatar_url : `${API_BASE_URL.replace('/api', '')}${item.avatar_url}` }} style={styles.avatarImage} />
            ) : (
              <Feather name="user" size={18} color={colors.textSecondary} />
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
        </TouchableOpacity>
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
    </View>
    );
  };

  return (
    <View style={[styles.safeContainer, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={26} color={colors.textDark} />
        </TouchableOpacity>

        <View style={styles.searchBarWrapper}>
          <Ionicons name="search" size={18} color={colors.placeholder} style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Rechercher sur Sweeted"
            placeholderTextColor={colors.placeholder}
            value={search}
            onChangeText={onChangeText}
            onSubmitEditing={onSubmitEditing}
            returnKeyType="search"
            autoFocus
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => onChangeText('')} style={styles.clearBtn}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
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
          <ActivityIndicator size="small" color={colors.primary} />
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

      {/* Modal profil utilisateur sélectionné */}
      <Modal
        visible={selectedUser !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedUser(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.profileModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderTitle}>Détails de l'utilisateur</Text>
              <TouchableOpacity onPress={() => setSelectedUser(null)}>
                <Ionicons name="close" size={26} color={colors.textDark} />
              </TouchableOpacity>
            </View>

            {selectedUser && (
              <View style={styles.profileCard}>
                <View style={styles.profileAvatarLarge}>
                  {selectedUser.avatar_url ? (
                    <Image
                      source={{ uri: selectedUser.avatar_url.startsWith('http') ? selectedUser.avatar_url : `${API_BASE_URL.replace('/api', '')}${selectedUser.avatar_url}` }}
                      style={styles.avatarLargeImg}
                    />
                  ) : (
                    <Feather name="user" size={44} color={colors.textSecondary} />
                  )}
                </View>

                <Text style={styles.profileName}>
                  {selectedUser.display_name || selectedUser.matricule_number}
                </Text>
                <Text style={styles.profileMatricule}>
                  Matricule : {selectedUser.matricule_number}
                </Text>

                {selectedUser.filiere ? (
                  <View style={styles.filiereBadge}>
                    <Text style={styles.filiereText}>{selectedUser.filiere}</Text>
                  </View>
                ) : null}

                {selectedUser.bio ? (
                  <Text style={styles.profileBio}>{selectedUser.bio}</Text>
                ) : null}

                {statsMap[selectedUser.id] && (
                  <View style={styles.profileStatsRow}>
                    <View style={styles.statBox}>
                      <Text style={styles.statNum}>{statsMap[selectedUser.id].followers_count}</Text>
                      <Text style={styles.statLabel}>Abonné{statsMap[selectedUser.id].followers_count > 1 ? 's' : ''}</Text>
                    </View>
                  </View>
                )}

                {currentUserId && Number(selectedUser.id) !== Number(currentUserId) && statsMap[selectedUser.id] && (
                  <TouchableOpacity
                    style={[styles.modalFollowBtn, statsMap[selectedUser.id].is_following && styles.modalFollowBtnActive]}
                    onPress={() => handleFollowToggle(selectedUser)}
                    activeOpacity={0.8}
                  >
                    <Text style={statsMap[selectedUser.id].is_following ? styles.modalFollowBtnTextActive : styles.modalFollowBtnText}>
                      {statsMap[selectedUser.id].is_following ? 'Ne plus suivre' : "S'abonner"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const getStyles = (colors, isDark) => StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: colors.cardBackground },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.divider,
  },
  backBtn: { padding: 5 },
  searchBarWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
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
    color: colors.textPrimary,
    paddingVertical: 0,
  },

  errorBanner: {
    backgroundColor: colors.danger + '1A',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  errorText: {
    color: colors.danger,
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
    color: colors.textMuted,
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
    backgroundColor: colors.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  avatarImage: { width: '100%', height: '100%' },
  textContainer: { flex: 1 },
  itemTitle: { fontSize: 16, color: colors.text, fontWeight: '500' },
  itemSubtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  followButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    backgroundColor: colors.primary,
    marginLeft: 10,
  },
  followButtonActive: {
    backgroundColor: colors.toggleInactive,
  },
  followButtonText: {
    color: colors.onPrimary,
    fontWeight: 'bold',
    fontSize: 13,
  },
  followButtonTextActive: {
    color: colors.text,
    fontWeight: 'bold',
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  profileModal: {
    backgroundColor: colors.cardBackground,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    width: '100%',
    maxWidth: 380,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  modalHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  profileAvatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  avatarLargeImg: {
    width: '100%',
    height: '100%',
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
    textAlign: 'center',
  },
  profileMatricule: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: SPACING.sm,
  },
  filiereBadge: {
    backgroundColor: colors.toggleActive,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    marginBottom: SPACING.sm,
  },
  filiereText: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: '600',
  },
  profileBio: {
    fontSize: 14,
    color: colors.textDark,
    textAlign: 'center',
    marginVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    lineHeight: 20,
  },
  profileStatsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: SPACING.md,
  },
  statBox: {
    alignItems: 'center',
  },
  statNum: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  modalFollowBtn: {
    marginTop: SPACING.sm,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: RADIUS.full,
  },
  modalFollowBtnActive: {
    backgroundColor: colors.toggleInactive,
  },
  modalFollowBtnText: {
    color: colors.onPrimary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalFollowBtnTextActive: {
    color: colors.textDark,
    fontWeight: 'bold',
    fontSize: 14,
  },
});