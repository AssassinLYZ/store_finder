export function capitalize(word: string): string {
  if (!word) return '';
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}
export const highlightMatch = (searchText: string, text: string) => {
  if (!searchText) return text;

  const escaped = searchText
    .split('')
    .map((c) => c.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'))
    .join('\\s*');

  const regex = new RegExp(`(${escaped.trim()})`, 'i');

  return text.replace(regex, '<mark>$1</mark>');
};

export const getMapUrl = (location: string) => {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location)}`;
};

export function normalizeStr(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}