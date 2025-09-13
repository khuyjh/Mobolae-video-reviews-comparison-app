'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useScrollDirection } from '@/shared/hooks/useScrollDirection';
import { cn } from '@/shared/lib/cn';

const BASE_CLASSES = `
  fixed z-30 h-[60px] w-[60px] rounded-full bg-main text-white cursor-pointer
  active:opacity-80
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2
  right-5 bottom-[110px]
  md:right-[30px] md:bottom-[130px]
  xl:right-[180px] xl:bottom-[160px]
`;

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const scrollDirection = useScrollDirection();

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

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          key='scroll-to-top'
          initial={{ opacity: 0 }}
          animate={{ opacity: scrollDirection === 'down' ? 0.6 : 1 }}
          whileHover={{ opacity: 1, scale: 1.05, filter: 'brightness(1.25)' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          onClick={scrollToTop}
          aria-label='맨 위로 스크롤'
          className={cn(BASE_CLASSES)}
        >
          <ArrowUp className='mx-auto size-10' strokeWidth={2} />
          <span className='sr-only'>맨 위로 스크롤</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
