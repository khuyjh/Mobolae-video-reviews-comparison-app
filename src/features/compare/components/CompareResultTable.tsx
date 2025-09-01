// 비교 결과 테이블 컴포넌트
// 역할: 항목별 수치와 “상품1 승/무/상품2 승” 표시, 색상 하이라이트, 비교하기 전에는 로딩? 이미지
'use client';

import { CompareRow, METRIC_CONFIG, MetricKey } from '../types/compareTypes';

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

  return (
    <div className={`overflow-x-auto ${className ?? ''}`}>
      <div className='border-black-700 bg-black-900/40 min-w-[680px] overflow-hidden rounded-xl border'>
        <table className='w-full text-sm'>
          <caption className='sr-only'>항목별 비교 결과 테이블</caption>
          <thead className='bg-black-800/60 text-gray-300'>
            <tr>
              <th scope='col' className='w-1/4 px-6 py-4 text-left'>
                기준
              </th>
              <th scope='col' className='px-6 py-4 text-left'>
                {aName}
              </th>
              <th scope='col' className='px-6 py-4 text-left'>
                {bName}
              </th>
              <th scope='col' className='w-28 px-6 py-4 text-left'>
                결과
              </th>
            </tr>
          </thead>

          <tbody className='text-gray-200'>
            {rows.map((r) => (
              <tr key={r.id} className='border-black-800 border-t'>
                <th scope='row' className='px-6 py-4 font-medium text-gray-400'>
                  {r.label}
                </th>

                <td className={`px-6 py-4 ${r.winner === 'A' ? 'text-green-500' : ''}`}>
                  {format(r.id, r.valueA)}
                </td>

                <td className={`px-6 py-4 ${r.winner === 'B' ? 'text-pink-500' : ''}`}>
                  {format(r.id, r.valueB)}
                </td>

                <td className='px-6 py-4 text-xs'>
                  {r.winner === 'A' ? '상품 1 승리' : r.winner === 'B' ? '상품 2 승리' : '무승부'}
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
