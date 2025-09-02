// 비교 결과 테이블 컴포넌트
// 역할: 항목별 수치와 “상품1 승/무/상품2 승” 표시, 색상 하이라이트, 비교하기 전에는 로딩? 이미지
'use client';

import { cn } from '@/shared/lib/cn';

import { CompareRow, METRIC_CONFIG, MetricKey, WINNER_TEXT_COLOR } from '../types/compareTypes';

type Row = {
  id: MetricKey;
  label: string;
  valueA: number;
  valueB: number;
  // 승리결과 타입
  winner: 'A' | 'B' | 'TIE';
};

type Props = {
  aName: string;
  bName: string;
  rows: CompareRow[];
  className?: string;
};

const CompareResultTable = ({ aName, bName, rows, className }: Props) => {
  const format = (id: MetricKey, n: number) => {
    const fmt = METRIC_CONFIG[id]?.formatter;
    return fmt ? fmt(n) : n.toLocaleString();
  };

  // 결과 테이블 스타일
  const TABLE_TEXT_STYLE = 'text-xs-semibold md:text-md-semibold lg:text-base-semibold';
  const WIN_TEXT = { A: '콘텐츠1 승리', B: '콘텐츠2 승리', TIE: '무승부' } as const;
  const COL_W_EDGE = 'w-[100px] md:w-[144px] lg:w-[180px]'; // 기준/결과 열 폭
  const CONTENT_STYLE = 'px-[12px] py-[12px] md:px-[24px] md:py-[16px] lg:px-[28px] lg:py-[20px]';
  const WIN_COLOR = {
    A: WINNER_TEXT_COLOR.A,
    B: WINNER_TEXT_COLOR.B,
    TIE: 'text-gray-400',
  } as const;

  return (
    <div className={cn('w-full', className)}>
      <div className='border-black-700 bg-black-800 mx-auto w-full overflow-hidden rounded-xl border md:max-w-[960px] lg:max-w-[1040px]'>
        <table className={cn('w-full table-fixed', TABLE_TEXT_STYLE)}>
          <caption className='sr-only'>항목별 비교 결과 테이블</caption>
          <thead className='bg-black-800/60 text-gray-400'>
            <tr>
              <th
                scope='col'
                className={`${COL_W_EDGE} px-[16px] py-[12px] text-center md:px-[24px] md:py-[16px] lg:px-[28px] lg:py-[20px]`}
              >
                기준
              </th>
              <th scope='col' className={CONTENT_STYLE}>
                콘텐츠1
              </th>
              <th scope='col' className={CONTENT_STYLE}>
                콘텐츠2
              </th>
              <th
                scope='col'
                className={`${COL_W_EDGE} px-[16px] py-[12px] text-center md:px-[24px] md:py-[16px] lg:px-[28px] lg:py-[20px]`}
              >
                결과
              </th>
            </tr>
          </thead>

          <tbody className='text-center text-gray-200'>
            {rows.map((r) => (
              <tr key={r.id} className='border-black-700 border-t'>
                <th
                  scope='row'
                  className='px-[16px] py-[12px] text-gray-400 md:px-[24px] md:py-[16px] lg:px-[28px] lg:py-[20px]'
                >
                  {r.label}
                </th>

                <td
                  className={cn(
                    'px-[16px] py-[12px] md:px-[24px] md:py-[16px] lg:px-[28px] lg:py-[20px]',
                    r.winner === 'A' && WIN_COLOR.A,
                  )}
                >
                  {format(r.id, r.valueA)}
                </td>

                <td
                  className={cn(
                    'px-[16px] py-[12px] md:px-[24px] md:py-[16px] lg:px-[28px] lg:py-[20px]',
                    r.winner === 'B' && WIN_COLOR.B,
                  )}
                >
                  {format(r.id, r.valueB)}
                </td>

                {/* 결과 컬럼 */}
                <td
                  className={cn(
                    'px-[16px] py-[12px] md:px-[24px] md:py-[16px] lg:px-[28px] lg:py-[20px]',
                    WIN_COLOR[r.winner],
                  )}
                >
                  {WIN_TEXT[r.winner]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompareResultTable;
