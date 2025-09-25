'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import Button from '@/shared/components/Button';

const NotFoundPage = () => {
  const router = useRouter();

  return (
    <div className='fixed inset-0 flex flex-col items-center justify-center overflow-hidden px-4 text-center'>
      {/* 이미지 */}
      <div className='mb-4 w-full max-w-[300px]'>
        <Image
          src='/images/404.png'
          alt='404 Not Found'
          width={300}
          height={300}
          className='h-auto w-full object-contain'
          unoptimized
        />
      </div>

      {/* 텍스트 */}
      <h1 className='text-main mb-2 text-2xl font-semibold'>페이지를 찾을 수 없습니다.</h1>
      <p className='mb-24 text-gray-400'>
        요청하신 페이지가 존재하지 않거나,{' '}
        <span className='block md:inline'>이동되었을 수 있습니다.</span>
      </p>

      {/* 버튼 */}
      <Button onClick={() => router.push('/')} variant='primary'>
        메인 페이지로 이동
      </Button>
    </div>
  );
};

export default NotFoundPage;
