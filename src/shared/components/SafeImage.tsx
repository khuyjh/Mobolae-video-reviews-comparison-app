'use client';

import Image, { type ImageProps } from 'next/image';

import clsx from 'clsx';
import { useState, type SyntheticEvent } from 'react';

const FALLBACK_SRC = '/images/FallbackImg.png';

type Props = ImageProps & {
  /** 로딩 중 스켈레톤 표시 여부 (기본: true) */
  showSkeleton?: boolean;
  /** 스켈레톤 오버레이 클래스 */
  skeletonClassName?: string;
  /** 래퍼(div) 클래스 (기본: relative h-full w-full overflow-hidden) */
  wrapperClassName?: string;
};

/**
 * SafeImage
 * - 로딩 전: 스켈레톤 오버레이
 * - 로딩 성공: 이미지 opacity 페이드인
 * - 로딩 실패: 폴백 이미지로 대체
 */
const SafeImage = ({
  src,
  alt,
  className,
  showSkeleton = true,
  skeletonClassName,
  wrapperClassName,
  onError,
  onLoadingComplete,
  ...props
}: Props) => {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  const isFallback = !src || errored;
  const finalSrc = isFallback ? FALLBACK_SRC : src;

  const handleError = (e: SyntheticEvent<HTMLImageElement>) => {
    setErrored(true); // 폴백으로 전환
    setLoaded(false); // 폴백 로딩 동안에도 스켈레톤 유지
    onError?.(e);
    e.currentTarget.onerror = null; // 재귀 방지
  };

  const handleComplete = (img: HTMLImageElement) => {
    setLoaded(true); // 완료 → 페이드인
    onLoadingComplete?.(img);
  };

  return (
    <div className={clsx('relative h-full w-full overflow-hidden', wrapperClassName)}>
      <Image
        {...props}
        src={finalSrc}
        alt={alt}
        onError={handleError}
        onLoadingComplete={handleComplete}
        className={clsx(
          'transition-opacity duration-300',
          loaded ? 'opacity-100' : 'opacity-0',
          isFallback ? 'bg-black-800 object-contain' : 'object-cover',
          className,
        )}
      />
      {showSkeleton && !loaded && (
        <div
          aria-hidden='true'
          className={clsx(
            'bg-black-700/60 pointer-events-none absolute inset-0 animate-pulse',
            skeletonClassName,
          )}
        />
      )}
    </div>
  );
};

export default SafeImage;
