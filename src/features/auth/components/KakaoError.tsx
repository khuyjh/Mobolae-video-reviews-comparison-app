import Link from 'next/link';

import Button from '@/shared/components/Button';

const KakaoError = () => {
  return (
    <div className='flex flex-col items-center gap-20 px-5 pt-64 md:gap-30 md:pt-96 xl:gap-35 xl:pt-80'>
      <p className='text-xl-semibold xl:text-2xl-semibold text-white'>비정상적인 접근입니다.</p>
      <Link className='w-full md:w-110 xl:w-160' href='/'>
        <Button className='max-w-none' variant='primary'>
          홈으로 가기
        </Button>
      </Link>
    </div>
  );
};

export default KakaoError;
