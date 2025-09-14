'use client';

import lottie from 'lottie-web';
import { useEffect, useRef, useState } from 'react';

const SEEN_KEY = 'splashShown';

export default function SplashScreen() {
  const ref = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 이미 본 적 있으면 안 보여줌
    if (sessionStorage.getItem(SEEN_KEY)) {
      setVisible(false);
      return;
    }

    if (!ref.current) return;

    const anim = lottie.loadAnimation({
      container: ref.current,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      path: '/lotties/splash.json',
    });

    const id = requestAnimationFrame(() => setEntered(true));

    anim.addEventListener('complete', () => {
      sessionStorage.setItem(SEEN_KEY, 'true'); // 한 번만 뜨도록 기록
      setEntered(false);
      setTimeout(() => setVisible(false), 400);
    });

    return () => {
      cancelAnimationFrame(id);
      anim.destroy();
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = visible ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className='bg-black-900 fixed inset-0 z-50 flex items-center justify-center'>
      <div
        ref={ref}
        className={`h-[240px] w-[240px] transition-opacity duration-400 ease-out ${
          entered ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
