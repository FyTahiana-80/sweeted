// Formatage relatif commun aux cartes (posts, officiels, notifications)
export function formatRelativeTime(createdAt) {
  if (!createdAt) return '';

  const date = new Date(createdAt);
  if (isNaN(date.getTime())) return '';

  const now = new Date();
  const diffSeconds = Math.floor((now - date) / 1000);

  if (diffSeconds < 60) {
    return "à l'instant";
  }

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) {
    return `il y a ${diffMinutes} min`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `il y a ${diffHours} h`;
  }

  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: diffHours < 24 * 365 ? undefined : 'numeric',
  });
}