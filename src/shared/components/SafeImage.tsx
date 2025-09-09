//아이템 카드 폴백 이미지 처리용 컴포넌트
'use client';

import Image, { ImageProps } from 'next/image';

import { useState } from 'react';

const fallbackImage = '/images/FallbackImg.png';

type Props = ImageProps;

const SafeImage = ({ src, alt, ...props }: Props) => {
  const [errored, setError] = useState(false);
  const isFallback = !src || errored;

  return (
    <Image
      {...props}
      src={errored ? fallbackImage : src}
      alt={alt}
      onError={() => setError(true)}
      className={isFallback ? 'bg-black-800 object-contain' : 'object-cover'}
    />
  );
};

export default SafeImage;
