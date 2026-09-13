import React, { useMemo, useState, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator,
  Modal, TextInput, RefreshControl, ScrollView, Alert
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { apiFetch } from '../../config/apiClient';
import { fileUrl } from '../../config/api';
import { openPdf, downloadFileUrl } from '../../config/openPdf';
import { formatRelativeTime } from '../../components/formatTime';
import { SPACING, RADIUS } from '../../config/theme';

const LANGUAGES = ['javascript', 'python', 'typescript', 'java', 'cpp', 'c', 'sql', 'html', 'css', 'json', 'bash', 'php', 'ruby', 'go', 'rust', 'markdown', 'text'];

const formatSize = (bytes) => {
  if (!bytes && bytes !== 0) return '';
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
};

const Studio = forwardRef((props, ref) => {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => getStyles(colors, isDark), [colors, isDark]);
  const { initialFileId, onInitialHandled } = props;
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const [editorVisible, setEditorVisible] = useState(false);
  const [editorFile, setEditorFile] = useState(null);
  const [editorName, setEditorName] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [editorLanguage, setEditorLanguage] = useState('javascript');
  const [editorVisibility, setEditorVisibility] = useState('prive');
  const [editorLoading, setEditorLoading] = useState(false);
  const [editorFeedback, setEditorFeedback] = useState({ type: '', message: '' });

  const [createVisible, setCreateVisible] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createLanguage, setCreateLanguage] = useState('javascript');
  const [createContent, setCreateContent] = useState('');
  const [creating, setCreating] = useState(false);
  const [createFeedback, setCreateFeedback] = useState({ type: '', message: '' });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    const result = await apiFetch('/files?scope=mine');
    if (result.ok) {
      setFiles(result.data || []);
    } else {
      setFeedback({
        type: 'error',
        message: result.data?.message || 'Impossible de charger le Studio.',
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchFiles().then(() => setRefreshing(false));
  }, [fetchFiles]);

  const openFile = useCallback(async (fileId) => {
    setEditorFeedback({ type: '', message: '' });
    setEditorLoading(true);
    const result = await apiFetch(`/files/${fileId}`);
    setEditorLoading(false);
    if (result.ok) {
      setEditorFile(result.data);
      setEditorName(result.data.name || '');
      setEditorContent(result.data.content || '');
      setEditorLanguage(result.data.language || 'javascript');
      setEditorVisibility(result.data.visibility || 'prive');
      setEditorVisible(true);
    } else {
      setEditorFeedback({
        type: 'error',
        message: result.data?.message || 'Impossible d\'ouvrir le fichier.',
      });
    }
  }, []);

  useImperativeHandle(ref, () => ({
    openFile,
    refresh: fetchFiles,
  }));

  useEffect(() => {
    if (initialFileId) {
      openFile(initialFileId);
      if (onInitialHandled) onInitialHandled();
    }
  }, [initialFileId, openFile, onInitialHandled]);

  const confirmDeleteFile = (file, isCode) => {
    setDeleteTarget({ file, isCode });
  };

  const doDeleteFile = async () => {
    if (!deleteTarget) return;
    const targetFile = deleteTarget.file;
    const targetIsCode = deleteTarget.isCode;
    setIsDeleting(true);
    if (targetIsCode && editorFile && editorFile.id === targetFile.id) {
      setEditorVisible(false);
      setEditorFile(null);
    }
    const result = await apiFetch(`/files/${targetFile.id}`, { method: 'DELETE' });
    setIsDeleting(false);
    if (result.ok) {
      setDeleteTarget(null);
      fetchFiles();
    } else {
      setDeleteTarget(null);
      setFeedback({ type: 'error', message: result.data && result.data.message ? result.data.message : 'Impossible de supprimer le fichier.' });
    }
  };

  const saveEditor = async () => {
    if (!editorName.trim()) {
      setEditorFeedback({ type: 'error', message: 'Le nom du fichier est requis.' });
      return;
    }
    setEditorFeedback({ type: '', message: '' });
    setEditorLoading(true);
    const result = await apiFetch(`/files/${editorFile.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: editorName.trim(),
        content: editorContent,
        visibility: editorVisibility,
      }),
    });
    setEditorLoading(false);
    if (result.ok) {
      setEditorFeedback({ type: 'success', message: 'Fichier enregistré.' });
      fetchFiles();
    } else {
      setEditorFeedback({
        type: 'error',
        message: result.data?.message || 'Impossible d\'enregistrer le fichier.',
      });
    }
  };

  const createFile = async () => {
    if (!createName.trim()) {
      setCreateFeedback({ type: 'error', message: 'Le nom du fichier est requis.' });
      return;
    }
    if (!createContent.trim()) {
      setCreateFeedback({ type: 'error', message: 'Le contenu du fichier est requis.' });
      return;
    }
    setCreating(true);
    setCreateFeedback({ type: '', message: '' });
    const result = await apiFetch('/files', {
      method: 'POST',
      body: JSON.stringify({
        name: createName.trim(),
        content: createContent,
        language: createLanguage,
      }),
    });
    setCreating(false);
    if (result.ok) {
      setCreateVisible(false);
      setCreateName('');
      setCreateContent('');
      setCreateLanguage('javascript');
      fetchFiles();
    } else {
      setCreateFeedback({
        type: 'error',
        message: result.data?.message || 'Impossible de créer le fichier.',
      });
    }
  };

  const codeFiles = files.filter(f => f.type === 'code');
  const pdfFiles = files.filter(f => f.type !== 'code');

  const renderCodeRow = ({ item }) => (
    <View style={styles.row}>
      <TouchableOpacity
        style={styles.rowMain}
        onPress={() => openFile(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.rowIcon}>
          <Icon name="code-tags" size={24} color={colors.primary} />
        </View>
        <View style={styles.rowInfo}>
          <Text style={styles.rowName} numberOfLines={1}>{item.name}</Text>
          <View style={styles.rowMeta}>
            <Text style={styles.rowMetaText}>{item.language}</Text>
            <Text style={styles.rowMetaText}>{formatSize(item.size)}</Text>
            <Icon
              name={item.visibility === 'public' ? 'earth' : 'lock-outline'}
              size={12}
              color={colors.textMuted}
            />
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.rowDeleteBtn}
        onPress={() => confirmDeleteFile(item, true)}
      >
        <Icon name="delete-outline" size={20} color={colors.danger} />
      </TouchableOpacity>
      <Icon name="chevron-right" size={20} color={colors.textMuted} />
    </View>
  );

  const renderPdfRow = ({ item }) => (
    <View style={styles.row}>
      <View style={styles.rowIcon}>
        <Icon name="file-pdf-box" size={24} color={colors.danger} />
      </View>
      <View style={styles.rowInfo}>
        <Text style={styles.rowName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.rowMetaText}>{formatRelativeTime(item.created_at)} • {formatSize(item.size)}</Text>
      </View>
      <View style={styles.rowActions}>
        <TouchableOpacity style={styles.rowAction} onPress={() => { const url = fileUrl(item.path); if (url) openPdf(url); }}>
          <Text style={styles.rowActionText}>Lire</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.rowAction} onPress={async () => {
          const url = await downloadFileUrl(item.id);
          if (url) openPdf(url);
        }}>
          <Text style={styles.rowActionText}>Télécharger</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.rowAction, styles.rowDeleteAction]}
          onPress={() => confirmDeleteFile(item, false)}
        >
          <Icon name="delete-outline" size={16} color={colors.danger} />
          <Text style={[styles.rowActionText, styles.deleteText]}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Studio</Text>
        <TouchableOpacity
          style={[styles.createButton, creating && styles.disabled]}
          onPress={() => { setCreateVisible(true); setCreateFeedback({ type: '', message: '' }); }}
        >
          <Icon name="plus" size={18} color={colors.onPrimary} />
          <Text style={styles.createButtonText}>Nouveau fichier</Text>
        </TouchableOpacity>
      </View>

      {feedback.message ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{feedback.message}</Text>
        </View>
      ) : null}

      {loading && files.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        >
          <Text style={styles.groupTitle}>Fichiers code</Text>
          {codeFiles.length === 0 ? (
            <Text style={styles.emptyText}>Aucun fichier code. Créez-en un avec « Nouveau fichier ».</Text>
          ) : (
            codeFiles.map(f => (
              <View key={`code-${f.id}`}>
                {renderCodeRow({ item: f })}
              </View>
            ))
          )}

          <Text style={styles.groupTitle}>Mes PDF</Text>
          {pdfFiles.length === 0 ? (
            <Text style={styles.emptyText}>Aucun PDF. Utilisez l'onglet Fichiers pour en uploader.</Text>
          ) : (
            pdfFiles.map(f => (
              <View key={`pdf-${f.id}`}>
                {renderPdfRow({ item: f })}
              </View>
            ))
          )}
        </ScrollView>
      )}
      <Modal
        visible={editorVisible}
        transparent
        animationType="slide"
        onRequestClose={() => {
          if (!editorLoading) setEditorVisible(false);
        }}
      >
        <View style={styles.editorModalOverlay}>
          <View style={styles.editorModal}>
            <View style={styles.editorHeader}>
              <Text style={styles.editorTitle} numberOfLines={1}>
                {editorFile ? `Éditeur — ${editorFile.name}` : 'Éditeur'}
              </Text>
              <TouchableOpacity onPress={() => setEditorVisible(false)} disabled={editorLoading}>
                <Icon name="close" size={28} color={colors.textDark} />
              </TouchableOpacity>
            </View>

            {editorFeedback.message ? (
              <View style={styles.inlineBanner}>
                <Text style={editorFeedback.type === 'error' ? styles.errorText : styles.successText}>
                  {editorFeedback.message}
                </Text>
              </View>
            ) : null}

            <ScrollView style={styles.editorScroll} keyboardShouldPersistTaps="handled">
              <Text style={styles.inputLabel}>Nom du fichier</Text>
              <TextInput
                style={styles.nameInput}
                value={editorName}
                onChangeText={setEditorName}
                placeholder="ex: script.js"
                editable={!editorLoading}
              />

              <Text style={styles.inputLabel}>Langage</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.languageRow}>
                {LANGUAGES.map(lang => (
                  <TouchableOpacity
                    key={lang}
                    style={[styles.languageChip, editorLanguage === lang && styles.languageChipActive]}
                    onPress={() => setEditorLanguage(lang)}
                  >
                    <Text style={editorLanguage === lang ? styles.languageChipTextActive : styles.languageChipText}>
                      {lang}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.inputLabel}>Contenu</Text>
              <TextInput
                style={styles.codeInput}
                value={editorContent}
                onChangeText={setEditorContent}
                multiline
                textAlignVertical="top"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!editorLoading}
                placeholder="// votre code ici"
                placeholderTextColor={colors.placeholder}
              />

              <Text style={styles.inputLabel}>Visibilité</Text>
              <View style={styles.visibilityRow}>
                <TouchableOpacity
                  style={[styles.visibilityChip, editorVisibility === 'prive' && styles.visibilityChipActive]}
                  onPress={() => setEditorVisibility('prive')}
                >
                  <Icon name="lock-outline" size={14} color={editorVisibility === 'prive' ? colors.onPrimary : colors.textMuted} />
                  <Text style={editorVisibility === 'prive' ? styles.visibilityTextActive : styles.visibilityText}>Privé</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.visibilityChip, editorVisibility === 'public' && styles.visibilityChipActive]}
                  onPress={() => setEditorVisibility('public')}
                >
                  <Icon name="earth" size={14} color={editorVisibility === 'public' ? colors.onPrimary : colors.textMuted} />
                  <Text style={editorVisibility === 'public' ? styles.visibilityTextActive : styles.visibilityText}>Public</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.saveButton, editorLoading && styles.disabled]}
                onPress={saveEditor}
                disabled={editorLoading}
              >
                {editorLoading ? (
                  <ActivityIndicator color={colors.onPrimary} />
                ) : (
                  <Text style={styles.saveButtonText}>Enregistrer</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={createVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!creating) setCreateVisible(false);
        }}
      >
        <View style={styles.createModalOverlay}>
          <View style={styles.createModal}>
            <View style={styles.editorHeader}>
              <Text style={styles.editorTitle}>Nouveau fichier code</Text>
              <TouchableOpacity onPress={() => setCreateVisible(false)} disabled={creating}>
                <Icon name="close" size={28} color={colors.textDark} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Nom du fichier</Text>
            <TextInput
              style={styles.nameInput}
              value={createName}
              onChangeText={setCreateName}
              placeholder="ex: script.py"
              editable={!creating}
            />

            <Text style={styles.inputLabel}>Langage</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.languageRow}>
              {LANGUAGES.map(lang => (
                <TouchableOpacity
                  key={lang}
                  style={[styles.languageChip, createLanguage === lang && styles.languageChipActive]}
                  onPress={() => setCreateLanguage(lang)}
                >
                  <Text style={createLanguage === lang ? styles.languageChipTextActive : styles.languageChipText}>
                    {lang}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.inputLabel}>Contenu</Text>
            <TextInput
              style={[styles.codeInput, { maxHeight: 220 }]}
              value={createContent}
              onChangeText={setCreateContent}
              multiline
              textAlignVertical="top"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!creating}
              placeholder="// votre code ici"
              placeholderTextColor={colors.placeholder}
            />

            {createFeedback.message ? (
              <Text style={createFeedback.type === 'error' ? styles.errorText : styles.successText}>
                {createFeedback.message}
              </Text>
            ) : null}

            <TouchableOpacity
              style={[styles.saveButton, creating && styles.disabled]}
              onPress={createFile}
              disabled={creating}
            >
              {creating ? (
                <ActivityIndicator color={colors.onPrimary} />
              ) : (
                <Text style={styles.saveButtonText}>Créer</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={deleteTarget !== null}
        transparent
        animationType="fade"
        onRequestClose={() => { if (!isDeleting) setDeleteTarget(null); }}
      >
        <View style={styles.createModalOverlay}>
          <View style={styles.createModal}>
            <View style={styles.editorHeader}>
              <Text style={styles.editorTitle}>Confirmer la suppression</Text>
              <TouchableOpacity onPress={() => setDeleteTarget(null)} disabled={isDeleting}>
                <Icon name="close" size={28} color={colors.textDark} />
              </TouchableOpacity>
            </View>
            <Text style={{ color: colors.textDark, fontSize: 14, marginVertical: 12 }}>Voulez-vous vraiment supprimer ce fichier ?</Text>
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: colors.danger }, isDeleting && styles.disabled]}
              onPress={doDeleteFile}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <ActivityIndicator color={colors.onPrimary} />
              ) : (
                <Text style={styles.saveButtonText}>Supprimer</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: colors.inputBackground, marginTop: 10 }]}
              onPress={() => setDeleteTarget(null)}
              disabled={isDeleting}
            >
              <Text style={[styles.saveButtonText, { color: colors.textDark }]}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
});

Studio.displayName = 'Studio';

export default Studio;

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
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    gap: 5,
  },
  createButtonText: {
    color: colors.onPrimary,
    fontWeight: 'bold',
    fontSize: 13,
  },
  disabled: {
    opacity: 0.6,
  },
  errorBanner: {
    backgroundColor: colors.danger + '1A',
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
  inlineBanner: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
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
  groupTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.xs,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 13,
    paddingHorizontal: SPACING.xs,
    marginBottom: SPACING.md,
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
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: colors.primary + '1F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  rowInfo: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  rowName: {
    fontWeight: 'bold',
    fontSize: 14,
    color: colors.textDark,
  },
  rowMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 3,
  },
  rowMetaText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  rowActions: {
    flexDirection: 'row',
    gap: 10,
  },
  rowAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    backgroundColor: colors.inputBackground,
    borderRadius: RADIUS.md,
  },
  rowMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowDeleteBtn: {
    padding: 6,
  },
  rowDeleteAction: {
    backgroundColor: colors.danger + '1A',
  },
  deleteText: {
    color: colors.danger,
  },
  rowActionText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  editorModalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
  },
  editorModal: {
    backgroundColor: colors.cardBackground,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    width: '94%',
    maxHeight: '88%',
  },
  editorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  editorTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.textDark,
    flex: 1,
    marginRight: SPACING.sm,
  },
  editorScroll: {
    flexGrow: 0,
  },
  inputLabel: {
    fontWeight: 'bold',
    fontSize: 13,
    color: colors.textDark,
    marginTop: SPACING.sm,
    marginBottom: 5,
  },
  nameInput: {
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    fontSize: 14,
    color: colors.textDark,
  },
  languageRow: {
    flexGrow: 0,
    marginTop: 4,
  },
  languageChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: colors.inputBackground,
    marginRight: 6,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  languageChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  languageChipText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  languageChipTextActive: {
    fontSize: 12,
    color: colors.onPrimary,
    fontWeight: '600',
  },
  codeInput: {
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    fontSize: 13,
    fontFamily: 'monospace',
    color: colors.textDark,
    minHeight: 180,
  },
  visibilityRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: 4,
  },
  visibilityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  visibilityChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  visibilityText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  visibilityTextActive: {
    fontSize: 12,
    color: colors.onPrimary,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: colors.headerGreen,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
  },
  saveButtonText: {
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  createModalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
  },
  createModal: {
    backgroundColor: colors.cardBackground,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    width: '94%',
    maxHeight: '85%',
  },
});