'use client';

import { Search, AlertTriangle } from 'lucide-react';

type ContentEmptyProps = {
  /** 상태: 기본값 'empty' */
  variant?: 'empty' | 'error';
  /** 제목 문구 */
  title?: string;
  /** 설명 문구 */
  description?: string;
};

const ContentEmpty = ({ variant = 'empty', title, description }: ContentEmptyProps) => {
  const isError = variant === 'error';

  return (
    <div className='flex flex-col items-center justify-center py-20 text-center'>
      {isError ? (
        <AlertTriangle
          aria-hidden='true'
          className='mb-6 h-16 w-16 text-red-500'
          strokeWidth={1.5}
        />
      ) : (
        <Search aria-hidden='true' className='mb-6 h-16 w-16 text-gray-500' strokeWidth={1.5} />
      )}

      <h2 className='text-lg-semibold mb-2 text-white'>
        {title ??
          (isError ? '콘텐츠를 불러오는 중 문제가 발생했어요' : '아직 등록된 콘텐츠가 없어요')}
      </h2>

      <p className='text-gray-400'>
        {description ??
          (isError
            ? '잠시 후 다시 시도해주세요'
            : '화면 하단의 플로팅 버튼을 눌러 콘텐츠를 추가해보세요')}
      </p>
    </div>
  );
};

export default ContentEmpty;
