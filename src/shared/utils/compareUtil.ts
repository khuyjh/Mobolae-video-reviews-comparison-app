import { ChipProps } from '../../shared/components/chip';

export function toCompareChip(index: number, keyword: string): ChipProps {
  const colorKey = index === 0 ? '1번' : '2번';

  return {
    variant: 'compare',
    colorKey,
    children: keyword,
  };
}
