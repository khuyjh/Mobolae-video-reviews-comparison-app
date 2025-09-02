// 비교 결과 문구 출력 컴포넌트
// 역할: 누가 승리/무승부인지, “3개 중 2개 우세” 같은 요약 문구만 표시
import { cn } from '@/shared/lib/cn';

import { WINNER_CONFIG, WinnerCode } from '../types/compareTypes';

type ResultSummaryProps = {
  aName: string;
  bName: string;
  aWins: number;
  bWins: number;
  ties: number;
};

// 공통 스타일 토큰
const SUMMARY_TEXT = 'text-xl-semibold md:text-xl-semibold lg:text-2xl-semibold font-semibold';
const CAPTION_STYLE = 'text-xs-medium md:text-xs-medium lg:text-base-medium mt-2 text-gray-400';
const DESCRIPTION_COLOR = 'text-white';

const CompareResultSummary = ({ aName, bName, aWins, bWins, ties }: ResultSummaryProps) => {
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
        <span className={color}>무승부</span>
        <span className='ml-[4px] text-gray-400'>입니다!</span>
      </>
    ) : (
      <>
        <span title={winnerName} className={color}>
          <span className='inline-block max-w-[220px] truncate whitespace-nowrap md:max-w-none'>
            {winnerName}
          </span>
        </span>
        <span className={DESCRIPTION_COLOR}> 콘텐츠가</span>
        <br className='lg:hidden' />
        <span className={DESCRIPTION_COLOR}>승리하였습니다!</span>
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
    </div>
  );
};

export default CompareResultSummary;
