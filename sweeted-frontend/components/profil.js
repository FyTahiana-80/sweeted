import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator, TextInput, Modal, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { apiFetch } from '../config/apiClient';
import { appendFilePart, cleanUri, imageMime } from '../config/fileUpload';
import { API_BASE_URL } from '../config/api';
import { SPACING } from '../config/theme';
import { useTheme } from '../context/ThemeContext';

const assetUrl = (url) => {
  if (!url) return null;
  return url.startsWith('http') ? url : `${API_BASE_URL.replace('/api', '')}${url}`;
};

export default function ProfileScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { colors, isDark, palette, palettes, setPalette, toggleDarkMode } = useTheme();
  const styles = useMemo(() => getStyles(colors, isDark), [colors, isDark]);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editVisible, setEditVisible] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [filiere, setFiliere] = useState('');
  const [avatarUri, setAvatarUri] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const [createUserVisible, setCreateUserVisible] = useState(false);
  const [cuMatricule, setCuMatricule] = useState('');
  const [cuPassword, setCuPassword] = useState('');
  const [cuRole, setCuRole] = useState('1');
  const [cuSaving, setCuSaving] = useState(false);
  const [cuFeedback, setCuFeedback] = useState({ type: '', message: '' });

  const ROLES = [
    { id: '1', label: 'Admin' },
    { id: '2', label: 'Modérateur' },
    { id: '3', label: 'Utilisateur' },
  ];

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

  const fetchProfile = async () => {
    setLoading(true);
    setError('');

    const result = await apiFetch('/auth/me');

    if (result.ok && result.data) {
      setUser(result.data);
      const statsResult = await apiFetch(`/users/${result.data.id}/stats`);
      if (statsResult.ok) {
        setStats(statsResult.data);
      }
      const bookmarksResult = await apiFetch('/bookmarks');
      if (bookmarksResult.ok) {
        setBookmarks((bookmarksResult.data || []).map(b => ({
          ...b,
          user: b.display_name || `Utilisateur ${b.user_id}`,
          avatar: b.avatar_url || `https://i.pravatar.cc/150?u=user${b.user_id}`,
          totalReactions: Number(b.total_reactions) || 0,
          has_reacted: !!b.has_reacted,
          is_bookmarked: true,
          image: b.image_url ? assetUrl(b.image_url) : null,
          images: Array.isArray(b.images) && b.images.length > 0
            ? b.images.map(im => assetUrl(im.image_url))
            : (b.image_url ? [assetUrl(b.image_url)] : []),
        })));
      }
    } else {
      if (result.errorType === 'auth') {
        setError('Vous devez être connecté pour voir votre profil.');
      } else {
        setError(result.data?.message || 'Impossible de charger le profil.');
      }
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userRole');
    } catch {}
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  const openEdit = () => {
    if (!user) return;
    setDisplayName(user.display_name || '');
    setBio(user.bio || '');
    setFiliere(user.filiere || '');
    setAvatarUri(null);
    setSaveError('');
    setEditVisible(true);
  };

  const pickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setSaveError('Permission d\'accès à la galerie refusée.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.[0]) {
      setAvatarUri(result.assets[0].uri);
      setSaveError('');
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    if (!displayName.trim() && !bio.trim() && !filiere.trim() && !avatarUri) {
      setSaving(false);
      setSaveError("Modifie au moins un champ avant d'enregistrer.");
      return;
    }
    setSaveError('');

    const formData = new FormData();
    if (displayName.trim()) formData.append('display_name', displayName.trim());
    if (bio.trim()) formData.append('bio', bio.trim());
    if (filiere.trim()) formData.append('filiere', filiere.trim());

    if (avatarUri) {
      const rawName = String(avatarUri).split('?')[0].split('/').pop() || 'avatar.jpg';
      const upAv = await appendFilePart(formData, 'avatar', cleanUri(avatarUri), rawName, imageMime(rawName));
      if (!upAv.ok) {
        setSaving(false);
        setSaveError("Lecture de l'image impossible : " + upAv.debug);
        return;
      }
    }

    const result = await apiFetch('/users/me', { method: 'PUT', body: formData });
    setSaving(false);

    if (result.ok) {
      setEditVisible(false);
      fetchProfile();
      return;
    }

    if (result.errorType === 'validation') {
      setSaveError(result.data?.message || 'Veuillez vérifier les champs du profil.');
    } else if (result.errorType === 'server') {
      setSaveError('Le serveur a rencontré une erreur lors de la sauvegarde.');
    } else {
      setSaveError(result.data?.message || 'Impossible de mettre à jour le profil.');
    }
  };

  const openCreateUser = () => {
    setCuMatricule('');
    setCuPassword('');
    setCuRole('1');
    setCuFeedback({ type: '', message: '' });
    setCreateUserVisible(true);
  };

  const submitCreateUser = async () => {
    if (!cuMatricule.trim()) {
      setCuFeedback({ type: 'error', message: 'Le matricule est requis.' });
      return;
    }
    if (cuPassword.length < 8) {
      setCuFeedback({ type: 'error', message: 'Le mot de passe doit contenir au moins 8 caractères.' });
      return;
    }
    setCuSaving(true);
    setCuFeedback({ type: '', message: '' });
    const result = await apiFetch('/auth/create-user', {
      method: 'POST',
      body: JSON.stringify({
        matricule_number: cuMatricule.trim(),
        password: cuPassword,
        id_role: Number(cuRole),
      }),
    });
    setCuSaving(false);
    if (result.ok) {
      setCuFeedback({ type: 'success', message: result.data?.message || 'Utilisateur créé.' });
      setTimeout(() => setCreateUserVisible(false), 1200);
    } else {
      setCuFeedback({
        type: 'error',
        message: result.data?.message || 'Impossible de créer l\'utilisateur.',
      });
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  const displayNameLabel = user?.display_name || user?.matricule_number || 'Utilisateur';
  const tag = `@${user?.matricule_number || ''}`;
  const avatar = assetUrl(user?.avatar_url) || 'https://via.placeholder.com/100';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil</Text>
        <TouchableOpacity onPress={openEdit}>
          <Ionicons name="create-outline" size={24} color={colors.textDark} />
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.profileSection}>
            <Image source={{ uri: avatar }} style={styles.avatar} />
            <Text style={styles.userName}>{displayNameLabel}</Text>
            <Text style={styles.userTag}>{tag}</Text>
            {user?.filiere ? (
              <Text style={styles.userFiliere}>
                <Ionicons name="school-outline" size={13} color={colors.textMuted} /> {user.filiere}
              </Text>
            ) : null}
            {user?.bio ? <Text style={styles.userBio}>{user.bio}</Text> : null}
            <TouchableOpacity style={styles.editButton} onPress={openEdit}>
              <Ionicons name="create-outline" size={16} color={colors.primary} />
              <Text style={styles.editButtonText}>Modifier le profil</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{stats?.followers_count ?? 0}</Text>
              <Text style={styles.statLabel}>Abonnés</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{stats?.following_count ?? 0}</Text>
              <Text style={styles.statLabel}>Abonnements</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{bookmarks.length}</Text>
              <Text style={styles.statLabel}>Enregistrés</Text>
            </View>
          </View>

          {/* Section Thème */}
          <View style={[styles.menuSection, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.themeHeaderRow}>
              <View style={styles.themeHeaderLeft}>
                <Text style={[styles.sectionTitle, { color: colors.textDark, marginBottom: 0 }]}>
                  Thème
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.darkModeToggle,
                  { backgroundColor: isDark ? colors.primary : colors.inputBackground }
                ]}
                onPress={toggleDarkMode}
                activeOpacity={0.8}
              >
                <Ionicons 
                  name={isDark ? "moon" : "moon-outline"} 
                  size={15} 
                  color={colors.textDark} 
                />
                <Text style={[styles.darkModeText, { color: colors.textDark }]}>
                  {isDark ? 'Mode Sombre' : 'Mode Clair'}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.themeSubtitle, { color: colors.textSecondary }]}>
              Couleur : <Text style={{ color: colors.primary, fontWeight: '700' }}>{palettes.find(p => p.id === palette)?.name || 'sweeted'}</Text>
            </Text>

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={styles.paletteScroll}
            >
              {palettes.map((p) => {
                const isSelected = palette === p.id;
                const paletteColors = isDark ? p.dark : p.light;
                return (
                  <TouchableOpacity
                    key={p.id}
                    style={[
                      styles.paletteCard,
                      {
                        backgroundColor: paletteColors.cardBackground,
                        borderColor: isSelected ? p.primaryColor : colors.divider,
                        borderWidth: isSelected ? 2 : 1,
                      },
                    ]}
                    onPress={() => setPalette(p.id)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.paletteColorCircle, { backgroundColor: p.primaryColor }]}>
                      {isSelected && <Ionicons name="checkmark" size={14} color={colors.onPrimary} />}
                    </View>
                    <Text 
                      style={[
                        styles.paletteName, 
                        { color: paletteColors.text, fontWeight: isSelected ? '700' : '600' }
                      ]} 
                      numberOfLines={1}
                    >
                      {p.name}
                    </Text>
                    <Text 
                      style={[styles.paletteDesc, { color: paletteColors.textMuted }]} 
                      numberOfLines={1}
                    >
                      {p.description}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>Vos enregistrements</Text>
            {bookmarks.length === 0 ? (
              <Text style={styles.emptyBookmarks}>
                Aucun post enregistré pour le moment. Touchez le signet sur un post pour le retrouver ici.
              </Text>
            ) : (
              bookmarks.map(item => (
                <TouchableOpacity
                  key={item.id.toString()}
                  style={styles.bookmarkRow}
                  onPress={() => navigation.navigate('PostDetails', { post: item })}
                >
                  <View style={styles.bookmarkLeft}>
                    <Ionicons name="bookmark" size={18} color={colors.primary} />
                    <View style={styles.bookmarkTextContainer}>
                      <Text style={styles.bookmarkContent} numberOfLines={2}>{item.content || '(post sans texte)'}</Text>
                      <Text style={styles.bookmarkMeta}>{item.user} · {item.totalReactions} réaction{item.totalReactions > 1 ? 's' : ''}</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                </TouchableOpacity>
              ))
            )}
          </View>

          {user?.role === 'Admin' ? (
            <View style={styles.menuSection}>
              <Text style={styles.sectionTitle}>Administration</Text>
              <TouchableOpacity style={styles.bookmarkRow} onPress={openCreateUser}>
                <View style={styles.bookmarkLeft}>
                  <Ionicons name="person-add-outline" size={20} color={colors.primary} />
                  <View style={styles.bookmarkTextContainer}>
                    <Text style={styles.bookmarkContent}>Créer un compte utilisateur</Text>
                    <Text style={styles.bookmarkMeta}>Admin · Modérateur · Utilisateur</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
          ) : null}

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Déconnexion</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      <Modal
        visible={editVisible}
        transparent
        animationType="slide"
        onRequestClose={() => !saving && setEditVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Modifier le profil</Text>
              <TouchableOpacity onPress={() => setEditVisible(false)} disabled={saving}>
                <Ionicons name="close" size={26} color={colors.textDark} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <TouchableOpacity style={styles.avatarPicker} onPress={pickAvatar} disabled={saving}>
                <Image
                  source={{ uri: avatarUri || avatar }}
                  style={styles.avatarPreview}
                />
                <Text style={styles.avatarPickerText}>Changer la photo</Text>
              </TouchableOpacity>

              <Text style={styles.inputLabel}>Nom d'affichage (max 100)</Text>
              <TextInput
                style={styles.input}
                value={displayName}
                onChangeText={setDisplayName}
                maxLength={100}
                editable={!saving}
              />

              <Text style={styles.inputLabel}>Filière (max 100)</Text>
              <TextInput
                style={styles.input}
                value={filiere}
                onChangeText={setFiliere}
                maxLength={100}
                placeholder="Ex : GCA-12"
                placeholderTextColor={colors.placeholder}
                editable={!saving}
              />

              <Text style={styles.inputLabel}>Bio (max 280)</Text>
              <TextInput
                style={[styles.input, styles.bioInput]}
                value={bio}
                onChangeText={setBio}
                maxLength={280}
                multiline
                placeholder="J'aime les Panini..."
                placeholderTextColor={colors.placeholder}
                editable={!saving}
              />

              {saveError ? <Text style={styles.saveError}>{saveError}</Text> : null}

              <TouchableOpacity
                style={[styles.submitButton, saving && styles.submitButtonDisabled]}
                onPress={saveProfile}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color={colors.onPrimary} />
                ) : (
                  <Text style={styles.submitButtonText}>Enregistrer</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={createUserVisible}
        transparent
        animationType="slide"
        onRequestClose={() => !cuSaving && setCreateUserVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Créer un compte</Text>
              <TouchableOpacity onPress={() => setCreateUserVisible(false)} disabled={cuSaving}>
                <Ionicons name="close" size={26} color={colors.textDark} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <Text style={styles.inputLabel}>Matricule</Text>
              <TextInput
                style={styles.input}
                value={cuMatricule}
                onChangeText={setCuMatricule}
                placeholder="Ex : 5-40014/25"
                placeholderTextColor={colors.placeholder}
                editable={!cuSaving}
                autoCapitalize="none"
              />

              <Text style={styles.inputLabel}>Mot de passe (min 8)</Text>
              <TextInput
                style={styles.input}
                value={cuPassword}
                onChangeText={setCuPassword}
                secureTextEntry
                editable={!cuSaving}
              />

              <Text style={styles.inputLabel}>Rôle</Text>
              <View style={styles.roleRow}>
                {ROLES.map(role => (
                  <TouchableOpacity
                    key={role.id}
                    style={[styles.roleChip, cuRole === role.id && styles.roleChipActive]}
                    onPress={() => setCuRole(role.id)}
                    disabled={cuSaving}
                  >
                    <Text style={cuRole === role.id ? styles.roleChipTextActive : styles.roleChipText}>
                      {role.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {cuFeedback.message ? (
                <Text style={cuFeedback.type === 'error' ? styles.saveError : styles.feedbackSuccess}>
                  {cuFeedback.message}
                </Text>
              ) : null}

              <TouchableOpacity
                style={[styles.submitButton, cuSaving && styles.submitButtonDisabled]}
                onPress={submitCreateUser}
                disabled={cuSaving}
              >
                {cuSaving ? (
                  <ActivityIndicator color={colors.onPrimary} />
                ) : (
                  <Text style={styles.submitButtonText}>Créer le compte</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const getStyles = (colors, isDark) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.screenBackground,
    ...(Platform.OS === 'web' ? { height: '100vh', maxHeight: '100vh', overflow: 'hidden' } : null),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  errorText: {
    color: colors.danger,
    textAlign: 'center',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: colors.cardBackground,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileSection: {
    alignItems: 'center',
    padding: 25,
    backgroundColor: colors.cardBackground,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.inputBackground,
    marginBottom: 12,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  userTag: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 3,
  },
  userFiliere: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 6,
  },
  userBio: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  editButtonText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    marginVertical: 10,
    paddingVertical: 15,
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  menuSection: {
    backgroundColor: colors.cardBackground,
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 10,
  },
  emptyBookmarks: {
    fontSize: 13,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  bookmarkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  bookmarkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  bookmarkTextContainer: {
    flex: 1,
  },
  bookmarkContent: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  bookmarkMeta: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 3,
  },
  logoutButton: {
    marginTop: 5,
    marginBottom: 30,
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: colors.danger + '1A',
    alignItems: 'center',
  },
  logoutText: {
    color: colors.danger,
    fontWeight: 'bold',
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
    width: '90%',
    maxHeight: '80%',
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
  avatarPicker: {
    alignItems: 'center',
    marginBottom: 18,
  },
  avatarPreview: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.inputBackground,
  },
  avatarPickerText: {
    marginTop: 8,
    color: colors.primary,
    fontWeight: '600',
  },
  inputLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.textDark,
  },
  bioInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveError: {
    color: colors.danger,
    marginTop: 12,
    textAlign: 'center',
  },
  feedbackSuccess: {
    color: colors.primary,
    marginTop: 12,
    textAlign: 'center',
  },
  roleRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  roleChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.inputBackground,
    alignItems: 'center',
  },
  roleChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  roleChipText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  roleChipTextActive: {
    color: colors.onPrimary,
    fontSize: 13,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 18,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  themeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  themeHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  darkModeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
  },
  darkModeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  themeSubtitle: {
    fontSize: 13,
    marginBottom: 12,
  },
  paletteScroll: {
    flexDirection: 'row',
    paddingBottom: 4,
  },
  paletteCard: {
    width: 130,
    padding: 12,
    borderRadius: 14,
    alignItems: 'center',
    marginRight: 10,
  },
  paletteColorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  paletteName: {
    fontSize: 13,
    marginBottom: 2,
    textAlign: 'center',
  },
  paletteDesc: {
    fontSize: 10,
    textAlign: 'center',
  },
});