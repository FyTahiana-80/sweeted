import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator,
  RefreshControl, Alert, Modal
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { apiFetch } from '../../config/apiClient';
import { appendFilePart } from '../../config/fileUpload';
import { API_BASE_URL, fileUrl } from '../../config/api';
import { openPdf, downloadFileUrl } from '../../config/openPdf';
import { formatRelativeTime } from '../../components/formatTime';
import { SPACING, RADIUS } from '../../config/theme';

const MINE = 'mine';
const PUBLIC = 'public';

const fileIcon = (type) => {
  if (type === 'code') return 'code-tags';
  if (type === 'image') return 'image-outline';
  return 'file-pdf-box';
};

const formatSize = (bytes) => {
  if (!bytes && bytes !== 0) return '';
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
};

export default function Fichiers({ onOpenInStudio }) {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => getStyles(colors, isDark), [colors, isDark]);
  const [scope, setScope] = useState(MINE);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    setFeedback({ type: '', message: '' });
    const result = await apiFetch(`/files?scope=${scope}`);
    if (result.ok) {
      setFiles(result.data || []);
    } else {
      setFeedback({
        type: 'error',
        message: result.data?.message || 'Impossible de charger les fichiers.',
      });
    }
    setLoading(false);
  }, [scope]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchFiles().then(() => setRefreshing(false));
  }, [fetchFiles]);

  const pickAndUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        type: ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'],
      });
      if (result.canceled || !result.assets?.[0]) return;

      const asset = result.assets[0];
      setUploading(true);
      setFeedback({ type: '', message: '' });

      const formData = new FormData();
      const upFile = await appendFilePart(formData, 'file', asset.uri, asset.name || 'fichier', asset.mimeType || 'application/pdf');
      if (!upFile.ok) {
        setUploading(false);
        setFeedback({ type: 'error', message: 'Lecture fichier impossible : ' + upFile.debug });
        return;
      }

      const uploadResult = await apiFetch('/files', { method: 'POST', body: formData });
      setUploading(false);

      if (uploadResult.ok) {
        setFeedback({ type: 'success', message: 'Fichier uploadé avec succès.' });
        fetchFiles();
      } else {
        setFeedback({
          type: 'error',
          message: uploadResult.data?.message || 'Impossible d\'uploader le fichier.',
        });
      }
    } catch {
      setUploading(false);
      setFeedback({ type: 'error', message: 'Impossible d\'uploader le fichier.' });
    }
  };

  const handleRead = (file) => {
    if (file.type === 'code') {
      if (onOpenInStudio) onOpenInStudio(file.id);
      return;
    }
    const url = fileUrl(file.path);
    if (!url) return;
    openPdf(url);
  };

  const handleDownload = async (file) => {
    const url = await downloadFileUrl(file.id);
    if (!url) return;
    openPdf(url);
  };

  const confirmDelete = (file) => {
    setDeleteTarget(file);
  };

  const doDeleteFile = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const result = await apiFetch(`/files/${deleteTarget.id}`, { method: 'DELETE' });
    setIsDeleting(false);
    if (result.ok) {
      setFiles(prev => prev.filter(f => f.id !== deleteTarget.id));
      setDeleteTarget(null);
      setFeedback({ type: 'success', message: 'Fichier supprimé.' });
    } else {
      setDeleteTarget(null);
      setFeedback({ type: 'error', message: result.data?.message || 'Impossible de supprimer le fichier.' });
    }
  };

  const renderFile = ({ item }) => (
    <View style={styles.row}>
      <View style={styles.fileIconContainer}>
        <Icon name={fileIcon(item.type)} size={28} color={colors.primary} />
      </View>
      <View style={styles.fileInfo}>
        <Text style={styles.fileName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.fileMetaRow}>
          {item.type !== 'code' && item.type !== 'image' ? (
            <Text style={styles.fileMeta}>PDF</Text>
          ) : null}
          {item.type === 'code' && item.language ? (
            <Text style={styles.fileMeta}>{item.language}</Text>
          ) : null}
          <Text style={styles.fileMeta}>{formatSize(item.size)}</Text>
          {scope === PUBLIC && item.display_name ? (
            <Text style={styles.fileMeta}>par {item.display_name}</Text>
          ) : null}
          <Text style={styles.fileMeta}>{item.download_count || 0} ↓</Text>
        </View>
        <Text style={styles.fileTime}>{formatRelativeTime(item.created_at)}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => handleRead(item)}>
          <Icon name="book-open-variant" size={18} color={colors.primary} />
          <Text style={styles.actionText}>Lire</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => handleDownload(item)}>
          <Icon name="download" size={18} color={colors.primary} />
          <Text style={styles.actionText}>Télécharger</Text>
        </TouchableOpacity>
        {scope === MINE ? (
          <TouchableOpacity style={styles.actionBtn} onPress={() => confirmDelete(item)}>
            <Icon name="delete-outline" size={18} color={colors.danger} />
            <Text style={[styles.actionText, styles.deleteText]}>Supprimer</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Fichiers</Text>
        <TouchableOpacity
          style={[styles.uploadButton, uploading && styles.uploadButtonDisabled]}
          onPress={pickAndUpload}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator size="small" color={colors.onPrimary} />
          ) : (
            <>
              <Icon name="upload" size={18} color={colors.onPrimary} />
              <Text style={styles.uploadButtonText}>Upload</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.chipsRow}>
        <TouchableOpacity
          style={[styles.chip, scope === MINE && styles.chipActive]}
          onPress={() => setScope(MINE)}
        >
          <Text style={scope === MINE ? styles.chipTextActive : styles.chipText}>Mes fichiers</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.chip, scope === PUBLIC && styles.chipActive]}
          onPress={() => setScope(PUBLIC)}
        >
          <Text style={scope === PUBLIC ? styles.chipTextActive : styles.chipText}>Partagés</Text>
        </TouchableOpacity>
      </View>

      {feedback.message ? (
        <View style={feedback.type === 'error' ? styles.errorBanner : styles.successBanner}>
          <Text style={feedback.type === 'error' ? styles.errorText : styles.successText}>
            {feedback.message}
          </Text>
        </View>
      ) : null}

      {loading && files.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={files}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderFile}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            !loading ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {scope === MINE
                    ? 'Aucun fichier. Utilisez Upload pour en ajouter un.'
                    : 'Aucun fichier partagé pour le moment.'}
                </Text>
              </View>
            ) : null
          }
        />
      )}

      <Modal
        visible={deleteTarget !== null}
        transparent
        animationType="fade"
        onRequestClose={() => { if (!isDeleting) setDeleteTarget(null); }}
      >
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmBox}>
            <Text style={styles.confirmTitle}>Confirmer la suppression</Text>
            <Text style={styles.confirmText}>Voulez-vous vraiment supprimer ce fichier ?</Text>
            <View style={styles.confirmActions}>
              <TouchableOpacity style={styles.confirmCancelBtn} onPress={() => setDeleteTarget(null)} disabled={isDeleting}>
                <Text style={styles.confirmCancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmDeleteBtn} onPress={doDeleteFile} disabled={isDeleting}>
                {isDeleting ? (
                  <ActivityIndicator color={colors.onPrimary} />
                ) : (
                  <Text style={styles.confirmDeleteText}>Supprimer</Text>
                )}
              </TouchableOpacity>
            </View>
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
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    gap: 5,
    minWidth: 90,
    justifyContent: 'center',
  },
  uploadButtonDisabled: {
    opacity: 0.6,
  },
  uploadButtonText: {
    color: colors.onPrimary,
    fontWeight: 'bold',
    fontSize: 13,
  },
  chipsRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  chip: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  chipActive: {
    backgroundColor: colors.toggleActive,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextActive: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: 'bold',
  },
  errorBanner: {
    backgroundColor: colors.danger + '1A',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.sm,
  },
  successBanner: {
    backgroundColor: '#EAF7EE',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.sm,
  },
  errorText: {
    color: colors.danger,
    textAlign: 'center',
  },
  successText: {
    color: colors.primary,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 130,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    elevation: 1,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  fileIconContainer: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: colors.primary + '1F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  fileInfo: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  fileName: {
    fontWeight: 'bold',
    fontSize: 14,
    color: colors.textDark,
  },
  fileMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 3,
    flexWrap: 'wrap',
  },
  fileMeta: {
    fontSize: 11,
    color: colors.textMuted,
  },
  fileTime: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 2,
  },
  actions: {
    gap: 6,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  deleteText: {
    color: colors.danger,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
  },
  confirmOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  confirmBox: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 360,
  },
  confirmTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 8,
  },
  confirmText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 18,
  },
  confirmActions: {
    flexDirection: 'row',
    gap: 12,
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