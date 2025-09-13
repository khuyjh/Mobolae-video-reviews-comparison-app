'use client';
import { useEffect, useRef, useState } from 'react';

/** busy=true면 즉시 true, busy=false여도 holdMs 동안 true 유지 */
export const useMinHold = (busy: boolean, holdMs = 400, resetKey?: unknown) => {
  const [show, setShow] = useState(busy);
  const startRef = useRef<number | null>(busy ? Date.now() : null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 요청 식별자 바뀌면(예: requestTick) 초기화
  useEffect(() => {
    if (resetKey !== undefined) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = null;
      setShow(busy);
      startRef.current = busy ? Date.now() : null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  useEffect(() => {
    if (busy) {
      if (timerRef.current) clearTimeout(timerRef.current);
      setShow(true);
      startRef.current = Date.now();
      return;
    }
    const started = startRef.current ?? Date.now();
    const elapsed = Date.now() - started;
    const remain = Math.max(0, holdMs - elapsed);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setShow(false);
      timerRef.current = null;
      startRef.current = null;
    }, remain);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [busy, holdMs]);

  return show;
};
