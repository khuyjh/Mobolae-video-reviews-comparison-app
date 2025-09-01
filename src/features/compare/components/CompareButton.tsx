// 비교하기 버튼 (입력창 2개 selected시 활성화)
'use client';

import { ButtonHTMLAttributes } from 'react';

import { cn } from '@/shared/lib/cn';

type CompareButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
  /** 기본 라벨을 바꾸고 싶으면 children값 수정합니다 */
};

const CompareButton = ({
  disabled,
  className,
  children = '비교하기',
  ...rest
}: CompareButtonProps) => {
  const enabled = !disabled;

  return (
    <button
      type='button'
      disabled={disabled}
      className={cn(
        // 레이아웃- 그리드 정렬 같은 건 부모에서 넣도록 className으로 받습니다
        // 이 부분은 스타일 구분을 위해 상수화 하지 않았습니다. 추후 수정 가능
        // 기본 스타일값
        'rounded-lg leading-none font-semibold transition-colors',
        'focus-visible:ring-main focus-visible:ring-2 focus-visible:outline-none',
        // 크기
        'h-[50px] md:h-[60px] xl:h-[70px]',
        'w-full max-w-[335px] md:w-[164px] md:max-w-none xl:w-[200px]',
        // 상태
        enabled
          ? 'text-black-900 bg-main-gradient cursor-pointer hover:brightness-120 active:scale-[0.99]'
          : 'bg-black-800 text-gray-600 disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
};

export default CompareButton;
