import { sortByRatingDescending, sortByReviewCountDescending } from './productSorters';

import type { ProductOrderKey } from '../types/SortDropdownTypes';
import type { ContentApi } from '@/shared/types/content';

const sortContents = (list: ContentApi[], order: ProductOrderKey): ContentApi[] => {
  const copy = [...list];

  switch (order) {
    case 'rating':
      return copy.sort(sortByRatingDescending);

    case 'reviewCount':
      return copy.sort(sortByReviewCountDescending);

    case 'recent':
    default:
      return copy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
};

export default sortContents;
