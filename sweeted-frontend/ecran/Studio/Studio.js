import React, { useState, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator,
  Modal, TextInput, RefreshControl, ScrollView, Alert
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { apiFetch } from '../../config/apiClient';
import { fileUrl } from '../../config/api';
import { openPdf, downloadFileUrl } from '../../config/openPdf';
import { formatRelativeTime } from '../../components/formatTime';
import { COLORS, SPACING, RADIUS } from '../../config/theme';

const LANGUAGES = ['javascript', 'python', 'typescript', 'java', 'cpp', 'c', 'sql', 'html', 'css', 'json', 'bash', 'php', 'ruby', 'go', 'rust', 'markdown', 'text'];

const formatSize = (bytes) => {
  if (!bytes && bytes !== 0) return '';
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
};

const Studio = forwardRef((props, ref) => {
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
    Alert.alert('Supprimer', `Voulez-vous vraiment supprimer « ${file.name} » ?`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          if (isCode && editorFile?.id === file.id) {
            setEditorVisible(false);
            setEditorFile(null);
          }
          const result = await apiFetch(`/files/${file.id}`, { method: 'DELETE' });
          if (result.ok) {
            fetchFiles();
          } else {
            Alert.alert('Erreur', result.data?.message || 'Impossible de supprimer le fichier.');
          }
        },
      },
    ]);
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
    <TouchableOpacity
        style={styles.row}
        onPress={() => openFile(item.id)}
        activeOpacity={0.7}
      >
      <View style={styles.rowIcon}>
        <Icon name="code-tags" size={24} color={COLORS.primary} />
      </View>
      <View style={styles.rowInfo}>
        <Text style={styles.rowName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.rowMeta}>
          <Text style={styles.rowMetaText}>{item.language}</Text>
          <Text style={styles.rowMetaText}>{formatSize(item.size)}</Text>
          <Icon
            name={item.visibility === 'public' ? 'earth' : 'lock-outline'}
            size={12}
            color={COLORS.textMuted}
          />
        </View>
      </View>
      <TouchableOpacity
        style={styles.rowDeleteBtn}
        onPress={(e) => {
          e.stopPropagation();
          confirmDeleteFile(item, true);
        }}
      >
        <Icon name="delete-outline" size={20} color={COLORS.danger} />
      </TouchableOpacity>
      <Icon name="chevron-right" size={20} color={COLORS.textMuted} />
    </TouchableOpacity>
  );

  const renderPdfRow = ({ item }) => (
    <View style={styles.row}>
      <View style={styles.rowIcon}>
        <Icon name="file-pdf-box" size={24} color={COLORS.danger} />
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
          <Icon name="delete-outline" size={16} color={COLORS.danger} />
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
          <Icon name="plus" size={18} color={COLORS.white} />
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
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
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

      {editorFeedback.message ? (
        <View style={styles.inlineBanner}>
          <Text style={editorFeedback.type === 'error' ? styles.errorText : styles.successText}>
            {editorFeedback.message}
          </Text>
        </View>
      ) : null}

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
                <Icon name="close" size={28} color={COLORS.textDark} />
              </TouchableOpacity>
            </View>

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
                placeholderTextColor={COLORS.placeholder}
              />

              <Text style={styles.inputLabel}>Visibilité</Text>
              <View style={styles.visibilityRow}>
                <TouchableOpacity
                  style={[styles.visibilityChip, editorVisibility === 'prive' && styles.visibilityChipActive]}
                  onPress={() => setEditorVisibility('prive')}
                >
                  <Icon name="lock-outline" size={14} color={editorVisibility === 'prive' ? COLORS.white : COLORS.textMuted} />
                  <Text style={editorVisibility === 'prive' ? styles.visibilityTextActive : styles.visibilityText}>Privé</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.visibilityChip, editorVisibility === 'public' && styles.visibilityChipActive]}
                  onPress={() => setEditorVisibility('public')}
                >
                  <Icon name="earth" size={14} color={editorVisibility === 'public' ? COLORS.white : COLORS.textMuted} />
                  <Text style={editorVisibility === 'public' ? styles.visibilityTextActive : styles.visibilityText}>Public</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.saveButton, editorLoading && styles.disabled]}
                onPress={saveEditor}
                disabled={editorLoading}
              >
                {editorLoading ? (
                  <ActivityIndicator color={COLORS.white} />
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
                <Icon name="close" size={28} color={COLORS.textDark} />
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
              placeholderTextColor={COLORS.placeholder}
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
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.saveButtonText}>Créer</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
});

Studio.displayName = 'Studio';

export default Studio;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.screenBackground,
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
    color: COLORS.textDark,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    gap: 5,
  },
  createButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 13,
  },
  disabled: {
    opacity: 0.6,
  },
  errorBanner: {
    backgroundColor: '#FFF0F0',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.sm,
  },
  errorText: {
    color: COLORS.danger,
    textAlign: 'center',
  },
  successText: {
    color: COLORS.primary,
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
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.xs,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 13,
    paddingHorizontal: SPACING.xs,
    marginBottom: SPACING.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: '#E8F5EC',
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
    color: COLORS.textDark,
  },
  rowMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 3,
  },
  rowMetaText: {
    fontSize: 11,
    color: COLORS.textMuted,
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
    backgroundColor: COLORS.inputBackground,
    borderRadius: RADIUS.md,
  },
  rowDeleteBtn: {
    padding: 6,
  },
  rowDeleteAction: {
    backgroundColor: '#FFF0F0',
  },
  deleteText: {
    color: COLORS.danger,
  },
  rowActionText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  editorModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
  },
  editorModal: {
    backgroundColor: COLORS.white,
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
    color: COLORS.textDark,
    flex: 1,
    marginRight: SPACING.sm,
  },
  editorScroll: {
    flexGrow: 0,
  },
  inputLabel: {
    fontWeight: 'bold',
    fontSize: 13,
    color: COLORS.textDark,
    marginTop: SPACING.sm,
    marginBottom: 5,
  },
  nameInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    fontSize: 14,
    color: COLORS.textDark,
  },
  languageRow: {
    flexGrow: 0,
    marginTop: 4,
  },
  languageChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.inputBackground,
    marginRight: 6,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  languageChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  languageChipText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  languageChipTextActive: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: '600',
  },
  codeInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    fontSize: 13,
    fontFamily: 'monospace',
    color: COLORS.textDark,
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
    backgroundColor: COLORS.inputBackground,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  visibilityChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  visibilityText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  visibilityTextActive: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: COLORS.headerGreen,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  createModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
  },
  createModal: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    width: '94%',
    maxHeight: '85%',
  },
});