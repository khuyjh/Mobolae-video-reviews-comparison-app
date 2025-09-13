'use client';

import Image from 'next/image';

import { ComponentProps, useEffect, useState } from 'react';

import profileFallbackImage from '../../../public/images/ProfileFallbackImg.png';
import { cn } from '../lib/cn';

interface Props extends ComponentProps<typeof Image> {
  wrapperClassName?: string;
  imgClassName?: string;
}

const SafeProfileImage = ({
  wrapperClassName,
  imgClassName,
  className,
  src,
  alt,
  onError,
  ...props
}: Props) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  return (
    <div className={cn(wrapperClassName, className)}>
      <Image
        className={imgClassName}
        src={hasError ? profileFallbackImage.src : src}
        alt={`${alt} 프로필 이미지`}
        onError={(e) => {
          setHasError(true);
          e.currentTarget.onerror = null;
        }}
        {...props}
      />
    </div>
  );
};

export default SafeProfileImage;
