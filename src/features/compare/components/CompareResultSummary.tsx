// 비교 결과 문구 출력 컴포넌트
// 역할: 누가 승리/무승부인지, “3개 중 2개 우세” 같은 요약 문구만 표시
import { cn } from '@/shared/lib/cn';

import { WINNER_TEXT_COLOR } from '../types/compareTypes';
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

  const isDraw = aWins === bWins;
  // 2) 승자 계산(컴포넌트 안에서 '한 번만')
  const winnerIsA = aWins > bWins; // true면 콘텐츠 1(왼쪽) 승
  // const winnerSide: WinnerSide = winnerIsA ? 'A' : 'B';
  const winnerName = winnerIsA ? aName : bName;
  const winnerCount = Math.max(aWins, bWins);

  if (isDraw) {
    return (
      <div className='mb-[40px] text-center md:mb-[80px]'>
        <h3 className={`${cn(SUMMARY_TEXT)} text-white`}>
          {/* 1행 */}
          <span>무승부</span>
          <span>입니다!</span>
        </h3>
      </div>
    );
  }

  return (
    <div className='mb-[40px] text-center md:mb-[80px]'>
      <h3 className={SUMMARY_TEXT}>
        {/* 1행: [승자명] */}
        <span className={WINNER_TEXT_COLOR[winnerIsA ? 'A' : 'B']} title={winnerName}>
          {winnerName}
        </span>
        <span className={DESCRIPTION_COLOR}> 콘텐츠가 </span>

        {/*모바일/태블릿에서는 줄바꿈, 데스크탑(lg+)에서는 같은 줄 */}
        <br className='lg:hidden' />

        {/* 2행(모바일/태블릿) 또는 같은 줄(데스크탑) */}
        <span className={DESCRIPTION_COLOR}>승리하였습니다!</span>
      </h3>

      <p className={CAPTION_STYLE}>
        {total}가지 항목 중 {winnerCount}개 항목에서 우세합니다.
      </p>
    </div>
  );
};

export default CompareResultSummary;
