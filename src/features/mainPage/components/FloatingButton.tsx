'use client';

import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

import RedirectModal from '@/features/auth/components/RedirectModal';
import { cn } from '@/shared/lib/cn';
import { useUserStore } from '@/shared/stores/userStore';

import AddContentModal from './AddContentModal';

/**
 * FloatingButton 컴포넌트
 *
 * - 화면 우측 하단에 고정된 플로팅 버튼
 * - 클릭 시:
 *   - 로그인 O: AddContentModal 오픈
 *   - 로그인 X: RedirectModal 오픈
 * - 스크롤 방향에 따라 버튼 투명도(opacity) 변경
 *
 * SSG/SSR 페이지에서도 항상 렌더링되며,
 * 클릭 시점에만 로그인 여부를 확인해 분기한다.
 */
const BASE_CLASSES = `
  fixed z-30 h-[60px] w-[60px] rounded-full bg-main text-white
  transition-all duration-300 cursor-pointer
  active:opacity-80
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2
  right-5 bottom-10
  md:right-[30px] md:bottom-[60px]
  xl:right-[180px] xl:bottom-[90px]
`;

const FloatingButton = () => {
  // 현재 스크롤 방향 ('up' | 'down' | null)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);

  // 모달 오픈 상태 분리
  const [openAdd, setOpenAdd] = useState(false); //
  const [openRedirect, setOpenRedirect] = useState(false);

  // 전역 로그인 상태
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);

  // 스크롤 방향 감지
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

  // 스크롤 방향이 아래일 때는 투명도 낮춤
  const OPACITY_CLASS = scrollDirection === 'down' ? 'opacity-60' : 'opacity-100';

  // 클릭 시 로그인 여부로 분기
  const handleClick = () => {
    if (!isLoggedIn) {
      setOpenRedirect(true); // 미로그인 → 리다이렉트 모달
      return;
    }
    setOpenAdd(true); // 로그인 → 콘텐츠 추가 모달
  };

  return (
    <>
      {/* 플로팅 버튼 */}
      <button
        type='button'
        onClick={handleClick}
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

      {/* 모달들 */}
      <AddContentModal isOpen={openAdd} onClose={() => setOpenAdd(false)} />
      <RedirectModal isOpen={openRedirect} onClose={() => setOpenRedirect(false)} />
    </>
  );
};

export default FloatingButton;
