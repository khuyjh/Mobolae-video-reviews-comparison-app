// 공용 입력 검색시 정렬 함수
/**
 * 입력 쿼리(query)와 항목 텍스트의 일치도를 기준으로 완전 일치 > 접두 일치 > 포함 일치 > 그 외 순서로 정렬하는 비교 함수입니다.
 * querySort의 주 책임은 항목 배열을 쿼리 기반으로 정렬하는 것이라고 생각하기에 정규화 담당 함수인 normalize를 적용하진 않았습니다.(둘다 적용 가능)
 */

export type Normalizer = (text: string) => string;

export interface QuerySortOptions<T> {
  /** localeCompare에 사용할 로케일 (기본값: 'ko-KR') */
  locale?: string;

  /** 항목에서 비교에 사용할 텍스트를 뽑는 함수 (필수) */
  getText: (item: T) => string;

  /** 항목이 선택 불가(disabled)인지 판단하는 함수 (선택) */
  isDisabled?: (item: T) => boolean;

  /** 매칭 우선순위가 같은 경우 추가로 적용할 사용자 정의 정렬 규칙 (선택) */
  tieBreaker?: (left: T, right: T) => number;

  /** 텍스트 정규화 함수. 주지 않으면 기본 정규화를 사용 (선택) */
  normalizer?: Normalizer;
}

/** 기본 정규화: 유니코드 NFKC → trim → 소문자화
 * 더 엄격한 정규화는 normalize 적용
 */
function normalizeTextDefault(text: string, locale: string = 'ko-KR'): string {
  return text.normalize('NFKC').trim().toLocaleLowerCase(locale);
}

/** 매칭 우선순위 */
enum MatchPriority {
  Exact = 0, // 완전 일치
  Prefix = 1, // 접두 일치
  Contains = 2, // 포함 일치
  None = 3, // 불일치
}

/** 항목 텍스트와 쿼리의 매칭 우선순위를 계산 */
function computeMatchPriority(
  itemText: string,
  query: string,
  locale: string,
  normalizer: Normalizer | undefined,
): MatchPriority {
  const normalize = (value: string) =>
    normalizer ? normalizer(value) : normalizeTextDefault(value, locale);

  const normalizedItemText = normalize(itemText);
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) return MatchPriority.None;
  if (normalizedItemText === normalizedQuery) return MatchPriority.Exact;
  if (normalizedItemText.startsWith(normalizedQuery)) return MatchPriority.Prefix;
  if (normalizedItemText.includes(normalizedQuery)) return MatchPriority.Contains;
  return MatchPriority.None;
}

/**
 * 주어진 쿼리에 대해 Array.sort에 전달할 비교 함수를 생성
 *
 * 정렬 규칙:
 *  1) disabled(선택 불가) 항목은 항상 아래
 *  2) 매칭 우선순위: 완전 일치 > 접두 일치 > 포함 일치 > 불일치
 *  3) 사용자 제공 tieBreaker가 있으면 적용
 *  4) 텍스트 길이(짧을수록 위)
 *  5) localeCompare
 */
export function createQueryComparator<T>(
  query: string,
  options: QuerySortOptions<T>,
): (leftItem: T, rightItem: T) => number {
  const { locale = 'ko-KR', getText, isDisabled, tieBreaker, normalizer } = options;

  const isItemDisabled = (item: T): boolean => (isDisabled ? isDisabled(item) : false);

  return (leftItem: T, rightItem: T) => {
    // 1) disabled 우선 처리: true는 아래로
    const leftIsDisabled = isItemDisabled(leftItem);
    const rightIsDisabled = isItemDisabled(rightItem);
    if (leftIsDisabled !== rightIsDisabled) {
      return leftIsDisabled ? 1 : -1;
    }

    // 2) 매칭 우선순위 비교
    const leftPriority = computeMatchPriority(getText(leftItem), query, locale, normalizer);
    const rightPriority = computeMatchPriority(getText(rightItem), query, locale, normalizer);
    if (leftPriority !== rightPriority) {
      return leftPriority - rightPriority; // 숫자가 작을수록 상위
    }

    // 3) 사용자 정의 tie-breaker
    if (tieBreaker) {
      const tieBreakerResult = tieBreaker(leftItem, rightItem);
      if (tieBreakerResult !== 0) return tieBreakerResult;
    }

    // 4) 텍스트 길이(짧을수록 위)
    const leftText = getText(leftItem);
    const rightText = getText(rightItem);
    if (leftText.length !== rightText.length) {
      return leftText.length - rightText.length;
    }

    // 5) 마지막으로 localeCompare
    return leftText.localeCompare(rightText, locale);
  };
}
