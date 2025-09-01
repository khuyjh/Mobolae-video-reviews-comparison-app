'use client';

import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';

import { cn } from '@/shared/lib/cn';

const BASE_CLASSES = `fixed z-30 h-[60px] w-[60px] rounded-full bg-main text-white transition-all duration-300 cursor-pointer active:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 right-5 bottom-80 md:right-[30px] md:bottom-[130px] xl:right-[180px] xl:bottom-[160px]`;

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 2000);
    };

    const onScroll = () => {
      window.requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label='맨 위로 스크롤'
      className={cn(
        BASE_CLASSES,
        'hover:bg-main hover:scale-105 hover:brightness-125 focus-visible:opacity-100',
        //TODO: floating button와 위치 조절
      )}
    >
      <ArrowUp className='mx-auto size-10' strokeWidth={2} />
      <span className='sr-only'>맨 위로 스크롤</span>
    </button>
  );
}
