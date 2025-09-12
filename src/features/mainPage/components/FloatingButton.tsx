'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';

import RedirectModal from '@/features/auth/components/RedirectModal';
import { useScrollDirection } from '@/shared/hooks/useScrollDirection'; // ✅ 추가
import { cn } from '@/shared/lib/cn';
import { useUserStore } from '@/shared/stores/userStore';

import AddContentModal from './AddContentModal';

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
  const scrollDirection = useScrollDirection();

  const [openAdd, setOpenAdd] = useState(false);
  const [openRedirect, setOpenRedirect] = useState(false);

  const isLoggedIn = useUserStore((state) => state.isLoggedIn);

  const OPACITY_CLASS = scrollDirection === 'down' ? 'opacity-60' : 'opacity-100';

  const handleClick = () => {
    if (!isLoggedIn) {
      setOpenRedirect(true);
      return;
    }
    setOpenAdd(true);
  };

  return (
    <>
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

      <AddContentModal isOpen={openAdd} onClose={() => setOpenAdd(false)} />
      <RedirectModal isOpen={openRedirect} onClose={() => setOpenRedirect(false)} />
    </>
  );
};

export default FloatingButton;
