import { ChipProps } from '../../shared/components/chip';

const categoryMap = {
  1: '영화',
  2: '드라마',
  3: '공연/뮤지컬',
  4: '애니메이션',
  5: '다큐멘터리',
  6: '키즈',
  7: '예능',
} as const;

export function toCategoryChip(category: { id: number; name: string }): ChipProps {
  const key = categoryMap[category.id as keyof typeof categoryMap];

  return {
    variant: 'category',
    colorKey: key,
    children: category.name,
  };
}
