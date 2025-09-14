import type { ContentItem } from '@/shared/types/content';

type ProductLike = {
  id: number;
  name?: string;
  title?: string;
  image?: string | null;
  favoriteCount?: number;
  reviewCount?: number;
  averageRating?: number;
  rating?: number;
};

const isRecord = (record: unknown): record is Record<string, unknown> =>
  typeof record === 'object' && record !== null;

const getProp = <T>(obj: unknown, key: string): T | undefined => {
  if (!isRecord(obj)) return undefined;
  return obj[key] as T | undefined;
};

const isProductLike = (record: unknown): record is ProductLike => {
  if (!isRecord(record)) return false;
  const id = record['id'];
  return typeof id === 'number';
};

const getProductLike = (item: unknown): ProductLike | undefined => {
  const base = getProp<unknown>(item, 'product') ?? item;
  return isProductLike(base) ? base : undefined;
};

export type MapOptions = {
  preferSelfRating?: boolean;
  selfRatingKey?: string;
};

const toSrc = (url?: string | null): string =>
  url && url.trim() !== '' ? url : '/images/ProfileFallbackImg.png';

export function mapToContentItem(x: unknown, opts?: MapOptions): ContentItem {
  const p = getProductLike(x);
  const selfRating = getProp<number>(x, opts?.selfRatingKey ?? 'rating');

  const rating = opts?.preferSelfRating
    ? Number(selfRating ?? p?.averageRating ?? p?.rating ?? 0)
    : Number(p?.averageRating ?? p?.rating ?? selfRating ?? 0);

  return {
    contentId: p?.id ?? 0,
    title: p?.name ?? p?.title ?? '이름 없는 콘텐츠',
    contentImage: toSrc(p?.image ?? null),
    favoriteCount: Number(p?.favoriteCount ?? 0),
    reviewCount: Number(p?.reviewCount ?? 0),
    rating,
  };
}
