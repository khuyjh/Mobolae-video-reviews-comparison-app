import { ChipProps } from '../../shared/components/chip';

export function toCompareChip(index: 0 | 1, keyword: string): ChipProps {
  const colorKey: '1번' | '2번' = index === 0 ? '1번' : '2번';

  return {
    variant: 'compare',
    colorKey,
    children: keyword,
  };
}
