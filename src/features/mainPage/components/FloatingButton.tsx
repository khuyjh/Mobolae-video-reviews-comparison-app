'use client';

import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

import { cn } from '@/shared/lib/cn';

import AddContentModal from './AddContentModal';

interface FloatingButtonProps {
  /** 로그인 여부 등으로 노출 제어 */
  isVisible?: boolean;
}

const BASE_CLASSES = `
  fixed z-30 h-[60px] w-[60px] rounded-full bg-main text-white
  transition-all duration-300 cursor-pointer
  active:opacity-80
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2
  right-5 bottom-10
  md:right-[30px] md:bottom-[60px]
  xl:right-[180px] xl:bottom-[90px]
`;

const FloatingButton = ({ isVisible = true }: FloatingButtonProps) => {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let prevY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y > prevY) setScrollDirection('down');
      else if (y < prevY) setScrollDirection('up');
      prevY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!isVisible) return null;

  const OPACITY_CLASS = scrollDirection === 'down' ? 'opacity-60' : 'opacity-100';

  return (
    <>
      <button
        type='button'
        onClick={() => setOpen(true)}
        aria-label='콘텐츠 추가'
        className={cn(
          BASE_CLASSES,
          OPACITY_CLASS,
          'hover:scale-105 hover:opacity-100 hover:brightness-120 focus-visible:opacity-100',
        )}
      >
        <Plus className='mx-auto size-10' strokeWidth={2} />
        <span className='sr-only'>콘텐츠 추가</span>
      </button>

      {/* 버튼 내부에서 모달 상태 관리 */}
      <AddContentModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default FloatingButton;
