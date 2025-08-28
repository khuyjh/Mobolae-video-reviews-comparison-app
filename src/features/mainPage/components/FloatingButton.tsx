'use client';

import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

import { cn } from '@/shared/lib/cn';

interface FloatingButtonProps {
  /** 로그인 여부 등으로 노출 제어 */
  isVisible?: boolean;
}

/** 공통 버튼 스타일 */
const BASE_CLASSES = `
    fixed z-30 h-[60px] w-[60px] rounded-full bg-main text-white
    transition-all duration-300 cursor-pointer
    active:opacity-80
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2
    right-5 bottom-10
    md:right-[30px] md:bottom-[60px]
    xl:right-[180px] xl:bottom-[90px]
  `;

/**
 * 플로팅 버튼 (모달 연동 전, 버튼만 존재)
 *
 * - 스크롤 방향 상태를 문자열로 관리
 *   - 'down': 내릴 때 → 반투명(bg-main/60)
 *   - 'up': 올릴 때 → 불투명(bg-main)
 *   - null: 초기 상태
 * - 지금은 클릭 시 console.log만 출력
 *   - 나중에 shadcn/ui Dialog 연결 시 onClick에 모달 오픈 로직 추가
 */
const FloatingButton = ({ isVisible = true }: FloatingButtonProps) => {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    let prevY = window.scrollY;

    const onScroll = () => {
      const currentY = window.scrollY;
      if (currentY > prevY) {
        setScrollDirection('down');
      } else if (currentY < prevY) {
        setScrollDirection('up');
      }
      prevY = currentY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!isVisible) return null;

  const handleClick = () => {
    console.log('콘텐츠 추가 버튼 클릭');
    // TODO: 나중에 shadcn/ui Dialog 오픈 로직 연결
  };

  const OPACITY_CLASS = scrollDirection === 'down' ? 'opacity-60' : 'opacity-100';

  return (
    <button
      type='button'
      onClick={handleClick}
      aria-label='콘텐츠 추가'
      className={cn(
        BASE_CLASSES,
        OPACITY_CLASS,
        'hover:bg-red hover:scale-105 hover:opacity-100 focus-visible:opacity-100',
      )}
    >
      <Plus className='mx-auto size-10' strokeWidth={2} />
      <span className='sr-only'>콘텐츠 추가</span>
    </button>
  );
};

export default FloatingButton;
