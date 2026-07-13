import type { MediaAsset } from '../../workout/model/workout.types';

const FORMAT_PRIORITY: Record<MediaAsset['format'], number> = {
  svg: 1,
  lottie: 2,
  webp: 3,
  png: 4,
  jpg: 5,
  gif: 6,
};

export function selectBestMediaAsset(
  assets: MediaAsset[] | undefined,
  role?: MediaAsset['role'],
): MediaAsset | null {
  if (!assets || assets.length === 0) {
    return null;
  }

  const filtered = role ? assets.filter((asset) => asset.role === role) : assets;
  const pool = filtered.length > 0 ? filtered : assets;

  const sorted = [...pool].sort((a, b) => {
    const priorityA = a.priority ?? FORMAT_PRIORITY[a.format];
    const priorityB = b.priority ?? FORMAT_PRIORITY[b.format];
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }
    return FORMAT_PRIORITY[a.format] - FORMAT_PRIORITY[b.format];
  });

  return sorted[0] ?? null;
}