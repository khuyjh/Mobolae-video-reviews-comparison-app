import { ChipProps } from '../../shared/components/chip';

const RANK_LABELS = ['1등', '2등', '3등', '4등', '5등'] as const;
type RankLabel = (typeof RANK_LABELS)[number]; // "1등" | "2등" | "3등" | "4등" | "5등"

export function buildRankingMap<T extends { id: number; reviewCount: number }>(
  items: T[],
): Map<number, number> {
  return new Map(
    [...items]
      .sort((a, b) => b.reviewCount - a.reviewCount)
      .slice(0, 5)
      .map((item, index) => [item.id, index + 1]),
  );
}

export function toRankingChip(id: number, rankingMap: Map<number, number>): ChipProps | null {
  const rank = rankingMap.get(id);
  if (!rank || rank > 5) return null;

  // 타입 안전한 방식으로 라벨 가져오기
  const rankLabel = RANK_LABELS[rank - 1] as RankLabel;

  return {
    variant: 'ranking',
    colorKey: rankLabel, // 이제 타입 안전함
    children: rankLabel,
  };
}
