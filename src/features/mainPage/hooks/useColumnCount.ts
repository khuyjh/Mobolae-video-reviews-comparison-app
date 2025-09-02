'use client';

import { useEffect, useState } from 'react';

const useColumnCount = () => {
  // md 미만: 2열, md 이상: 2열, xl 이상: 3열
  const [cols, setCols] = useState(2);

  useEffect(() => {
    const mqMd = window.matchMedia('(min-width: 768px)');
    const mqXl = window.matchMedia('(min-width: 1280px)');

    const update = () => {
      if (mqXl.matches) setCols(3);
      else setCols(2);
    };

    update();
    mqMd.addEventListener?.('change', update);
    mqXl.addEventListener?.('change', update);
    return () => {
      mqMd.removeEventListener?.('change', update);
      mqXl.removeEventListener?.('change', update);
    };
  }, []);

  return cols;
};

export default useColumnCount;
