'use client';

import lottie from 'lottie-web';
import { useEffect, useRef, useState } from 'react';

export default function SplashScreen() {
  const ref = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
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
      setEntered(false);
      setTimeout(() => setVisible(false), 200);
    });

    return () => {
      cancelAnimationFrame(id);
      anim.destroy();
    };
  }, []);

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className='bg-black-900 fixed inset-0 z-50 flex items-center justify-center'>
      <div
        ref={ref}
        className={`h-[240px] w-[240px] transition-opacity duration-200 ease-out ${entered ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
}
