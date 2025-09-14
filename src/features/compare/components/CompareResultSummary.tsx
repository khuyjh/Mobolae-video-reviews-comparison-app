// 비교 결과 문구 출력 컴포넌트
// 역할: 누가 승리/무승부인지, “3개 중 2개 우세” 같은 요약 문구만 표시
import Link from 'next/link';

import clsx from 'clsx';

import { WINNER_CONFIG, WinnerCode } from '../types/compareTypes';
type ResultSummaryProps = {
  aId: number;
  bId: number;
  aName: string;
  bName: string;
  aWins: number;
  bWins: number;
  ties: number;
};

// 공통 스타일 상수화
const SUMMARY_TEXT = 'text-xl-semibold md:text-xl-semibold lg:text-2xl-semibold font-semibold';
const CAPTION_STYLE = 'text-xs-medium md:text-xs-medium lg:text-base-medium mt-2 text-gray-400';
const DESCRIPTION_STYLE = 'text-white align-middle';
const LINK_TEXT_BASE =
  'text-xs-medium md:text-xs-medium lg:text-base-medium decoration-transparent hover:decoration-current focus-visible:decoration-current ' +
  'rounded-md outline-none focus-visible:ring-2 focus-visible:ring-color-main ' +
  'max-w-[240px] truncate text-center';
const PILL_CONTAINER_BASE =
  'inline-flex items-center justify-center gap-[10px] rounded-lg px-[10px] py-[8px] ' +
  'transition hover:opacity-90';
const PILL_COLOR = {
  A: 'bg-green-50 text-green-500',
  B: 'bg-pink-50 text-pink-500',
} as const;

function DetailLink({
  href,
  text,
  ariaLabel,
  side,
}: {
  href: string;
  text: string;
  ariaLabel: string;
  side: Extract<WinnerCode, 'A' | 'B'>;
}) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      title={text}
      className={clsx(PILL_CONTAINER_BASE, PILL_COLOR[side])}
    >
      <span className={LINK_TEXT_BASE}>{text} 리뷰 보기</span>
    </Link>
  );
}

const CompareResultSummary = ({
  aId,
  bId,
  aName,
  bName,
  aWins,
  bWins,
  ties,
}: ResultSummaryProps) => {
  const total = aWins + bWins + ties;

  // 1) 승패 쪽 계산 (A/B/TIE)
  const side: WinnerCode = aWins === bWins ? 'TIE' : aWins > bWins ? 'A' : 'B';

  // 2) 공용 설정에서 색/문구를 가져옵니다.
  const { color } = WINNER_CONFIG[side];

  // 3) 승자 이름/카운트 계산 (무승부면 둘 다 사용 안 함)
  const winnerName = side === 'A' ? aName : side === 'B' ? bName : '';
  const winnerCount = Math.max(aWins, bWins);

  const resultHeading =
    side === 'TIE' ? (
      <>
        <span className={color}>두 콘텐츠의 평이</span>
        <span className='ml-[4px] text-gray-400'>비슷합니다.</span>
      </>
    ) : (
      <>
        <span title={winnerName} className={`${color} align-middle`}>
          <span className='max-w-[220px] truncate whitespace-nowrap md:max-w-none'>
            {winnerName}{' '}
          </span>
        </span>
        {/* 앞 공백 제거하고 뒤에 공백을 명시적으로 추가 */}
        <span className={DESCRIPTION_STYLE}>콘텐츠가</span>{' '}
        {/* 모바일/태블릿에선 줄바꿈, 데스크탑에선 안 보임 */}
        <br className='lg:hidden' />
        <span className={DESCRIPTION_STYLE}>더 선호됩니다!</span>
      </>
    );

  const captionText =
    side === 'TIE'
      ? `${total}가지 항목 중 ${ties}개가 동일합니다.`
      : `${total}가지 항목 중 ${winnerCount}개 항목에서 우세합니다.`;

  return (
    <div className='mb-[40px] text-center md:mb-[80px]'>
      <h3 className={SUMMARY_TEXT}>{resultHeading}</h3>
      <p className={CAPTION_STYLE}>{captionText}</p>
      <div className='mt-3 flex flex-col items-center gap-2'>
        <DetailLink
          href={`/products/${aId}`}
          text={aName}
          side='A' // ← 색 자동 적용
          ariaLabel={`콘텐츠 1 “${aName}” 상세 페이지로 이동`}
        />
        <DetailLink
          href={`/products/${bId}`}
          text={bName}
          side='B'
          ariaLabel={`콘텐츠 2 “${bName}” 상세 페이지로 이동`}
        />
      </div>
    </div>
  );
};

export default CompareResultSummary;
