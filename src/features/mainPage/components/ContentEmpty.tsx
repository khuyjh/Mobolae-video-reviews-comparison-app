'use client';

import { Inbox, AlertTriangle } from 'lucide-react';

type ContentEmptyProps = {
  /** 상태: 기본값 'empty' */
  variant?: 'empty' | 'error';
  /** 제목 문구 */
  title?: string;
  /** 설명 문구 (undefined면 아예 숨김) */
  description?: string;
};

const ContentEmpty = ({ variant = 'empty', title, description }: ContentEmptyProps) => {
  const isError = variant === 'error';

  const defaultTitle = isError
    ? '콘텐츠를 불러오는 중 문제가 발생했어요'
    : '아직 등록된 콘텐츠가 없어요';

  return (
    <div className='flex flex-col items-center justify-center py-20 text-center'>
      {isError ? (
        <AlertTriangle
          aria-hidden='true'
          className='mb-6 h-16 w-16 text-red-500'
          strokeWidth={1.5}
        />
      ) : (
        <Inbox aria-hidden='true' className='mb-6 h-16 w-16 text-gray-500' strokeWidth={1.5} />
      )}

      <h2 className='text-lg-semibold mb-2 text-white'>{title ?? defaultTitle}</h2>

      {/* description이 undefined가 아닐 때만 출력 */}
      {description !== undefined && <p className='text-gray-400'>{description}</p>}
    </div>
  );
};

export default ContentEmpty;
