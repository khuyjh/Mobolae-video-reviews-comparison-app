// 비교 결과 문구 출력 컴포넌트
// 역할: 누가 승리/무승부인지, “3개 중 2개 우세” 같은 요약 문구만 표시

type ResultSummaryProps = {
  aName: string;
  bName: string;
  aWins: number;
  bWins: number;
  ties: number;
};

const CompareResultSummary = ({ aName, bName, aWins, bWins, ties }: ResultSummaryProps) => {
  const total = aWins + bWins + ties;
  const winner = aWins === bWins ? 'TIE' : aWins > bWins ? aName : bName;

  return (
    <div className='my-8 text-center'>
      <p className='text-lg font-semibold text-pink-400'>
        {winner === 'TIE' ? '무승부입니다!' : `${winner} 상품이 승리하였습니다!`}
      </p>
      <p className='mt-2 text-sm text-gray-400'>
        {total}가지 항목 중 {Math.max(aWins, bWins)}개 항목에서 우세합니다.
      </p>
    </div>
  );
};

export default CompareResultSummary;
