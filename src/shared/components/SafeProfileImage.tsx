'use client';

import Image from 'next/image';

import { ComponentProps, useEffect, useState } from 'react';

import profileFallbackImage from '../../../public/images/ProfileFallbackImg.png';
import { cn } from '../lib/cn';

interface Props extends ComponentProps<typeof Image> {
  wrapperClassName?: string; // 래퍼(div)에 줄 클래스 (크기/rounded 등)
  imgClassName?: string; // <Image>에 줄 클래스
}

const SafeProfileImage = ({
  wrapperClassName,
  imgClassName,
  className, // 래퍼용
  src,
  alt,
  onError,
  onLoadingComplete,
  ...props
}: Props) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  const [loaded, setLoaded] = useState(false);

  const isFallback = !src || hasError;
  const finalSrc = isFallback ? profileFallbackImage.src : src;

  return (
    <div className={cn('relative overflow-hidden', wrapperClassName, className)}>
      <Image
        {...props}
        src={finalSrc}
        alt={`${alt} 프로필 이미지`}
        onError={(e) => {
          setHasError(true);
          onError?.(e);
          // next/image의 에러 핸들러가 재귀되지 않도록 방지
          e.currentTarget.onerror = null;
        }}
        onLoadingComplete={(img) => {
          setLoaded(true);
          onLoadingComplete?.(img);
        }}
        className={cn(
          // 로딩 후 부드럽게 표시
          'transition-opacity duration-300',
          loaded ? 'opacity-100' : 'opacity-0',
          // 폴백은 크롭 방지, 정상은 cover
          isFallback ? 'bg-black-800 object-contain' : 'object-cover',
          imgClassName,
        )}
      />

      {/* 로딩 중 스켈레톤 오버레이 */}
      {!loaded && <div aria-hidden className='bg-black-700/60 absolute inset-0 animate-pulse' />}
    </div>
  );
};

export default SafeProfileImage;
