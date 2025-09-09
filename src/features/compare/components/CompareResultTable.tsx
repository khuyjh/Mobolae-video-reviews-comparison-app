// 비교 결과 테이블 컴포넌트
// 역할: 항목별 수치와 “상품1 승/무/상품2 승” 표시, 색상 하이라이트, 비교하기 전에는 안내 사항 문구
'use client';

import { cn } from '@/shared/lib/cn';

import { CompareRow, METRIC_CONFIG, MetricKey, WINNER_CONFIG } from '../types/compareTypes';

type Props = {
  /** 헤더 표기용(툴팁/접근성에서 사용) */
  aName: string;
  bName: string;
  /** 테이블 행 데이터 */
  rows: CompareRow[];
  className?: string;
};

// 결과 테이블 스타일
const TABLE_TEXT_STYLE = 'text-xs-semibold md:text-md-semibold lg:text-base-semibold';
const COL_W_EDGE = 'w-[100px] md:w-[144px] lg:w-[180px]'; // 기준/결과 열 폭
const CONTENT_STYLE = 'px-[12px] py-[12px] md:px-[24px] md:py-[16px] lg:px-[28px] lg:py-[20px]';
const CELL_PADDING = 'px-[16px] py-[12px] md:px-[24px] md:py-[16px] lg:px-[28px] lg:py-[20px]'; // 셀 패딩

const CompareResultTable = ({ aName, bName, rows, className }: Props) => {
  const format = (id: MetricKey, n: number) => {
    const fmt = METRIC_CONFIG[id]?.formatter;
    return fmt ? fmt(n) : n.toLocaleString();
  };

  return (
    <div className={cn('w-full', className)}>
      <div className='border-black-700 bg-black-800 mx-auto w-full overflow-hidden rounded-xl border md:max-w-[960px] lg:max-w-[1040px]'>
        <table className={cn('w-full table-fixed', TABLE_TEXT_STYLE)}>
          <caption className='sr-only'>항목별 비교 결과 테이블</caption>
          {/* ── 헤더: 첫 행의 폭이 전체 레이아웃을 결정(table-fixed) ── */}
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
          {/* ── 본문 ── */}
          <tbody className='text-center text-gray-200'>
            {rows.map((r) => (
              <tr key={r.id} className='border-black-700 border-t'>
                <th scope='row' className={cn('text-gray-400', CELL_PADDING)}>
                  {r.label}
                </th>
                {/* 값 A: A가 이겼을 때만 색상 적용 */}
                <td className={cn(CELL_PADDING, r.winner === 'A' && WINNER_CONFIG.A.color)}>
                  {format(r.id, r.valueA)}
                </td>
                {/* 값 B: B가 이겼을 때만 색상 적용 */}
                <td className={cn(CELL_PADDING, r.winner === 'B' && WINNER_CONFIG.B.color)}>
                  {format(r.id, r.valueB)}
                </td>

                {/* 결과 컬럼 */}
                <td className={cn(CELL_PADDING, WINNER_CONFIG[r.winner].color)}>
                  {WINNER_CONFIG[r.winner].text}
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
