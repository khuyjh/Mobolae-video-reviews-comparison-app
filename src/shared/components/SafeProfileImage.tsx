import Image from 'next/image';

import { ComponentProps } from 'react';

import profileFallbackImage from '../../../public/images/ProfileFallbackImg.png';
import { cn } from '../lib/cn';

const IMG_WRAPPER =
  'mx-auto h-[120px] w-[120px] xl:w-[180px] xl:h-[180px] overflow-hidden rounded-full';
const IMG_STYLE = 'h-full w-full object-cover';

const SafeProfileImage = ({ className, src, alt, ...props }: ComponentProps<typeof Image>) => {
  const profileUrl = src as string;
  return (
    <div className={cn(IMG_WRAPPER, className)}>
      <Image
        className={IMG_STYLE}
        src={
          profileUrl.includes('sprint-fe-project.s3.ap-northeast-2.amazonaws.com')
            ? src
            : profileFallbackImage.src
        }
        alt={`${alt} 프로필 이미지`}
        {...props}
      />
    </div>
  );
};

export default SafeProfileImage;
