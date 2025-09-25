import Image from 'next/image';

import LogoIcon from '../../../public/icons/LogoIcon-48.webp';

interface Props {
  loadingText: string;
}

const LoadingImage = ({ loadingText }: Props) => {
  return (
    <div className='text-xl-regular flex h-21 flex-col items-center justify-between text-gray-600'>
      {/* 아이콘 이미지 */}
      <Image
        src={LogoIcon}
        alt='logo'
        width={48}
        height={48}
        className='animate-bounce'
        priority
        unoptimized
      />

      <div>
        {loadingText.split('').map((letter, i) => (
          <span
            className='bounce-delay text-main inline-block opacity-70'
            key={i}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
};

export default LoadingImage;
