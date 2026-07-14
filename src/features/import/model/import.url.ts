export function normalizeMediaUrl(raw: string): string {
  let url = raw.trim();
  url = url.replace(/^["'<\[(]+|["'>\]);,]+$/g, '');

  if (!url) return url;
  if (url.startsWith('//')) return `https:${url}`;
  if (!/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(url)) return `https://${url}`;

  return url;
}

export function isHttpMediaUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}