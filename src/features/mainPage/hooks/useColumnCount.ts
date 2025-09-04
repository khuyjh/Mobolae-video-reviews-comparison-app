'use client';

import { useEffect, useState } from 'react';

const useColumnCount = () => {
  // md 미만: 2열 , xl 이상: 3열
  const [cols, setCols] = useState(2);

  useEffect(() => {
    const mqXl = window.matchMedia('(min-width: 1280px)');

    const update = () => {
      if (mqXl.matches) setCols(3);
      else setCols(2);
    };

    update();
    mqXl.addEventListener?.('change', update);
    return () => {
      mqXl.removeEventListener?.('change', update);
    };
  }, []);

  return cols;
};

export default useColumnCount;
