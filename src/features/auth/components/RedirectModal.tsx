'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import BaseModal from '@/shared/components/BaseModal';
import Button from '@/shared/components/Button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const RedirectModal = ({ isOpen, onClose }: Props) => {
  const pathname = usePathname();
  const query = `?redirect_url=${pathname}`;

  return (
    <BaseModal title='로그인 화면 이동 모달' isOpen={isOpen} onClose={onClose}>
      <div className='p-5'>
        <p className='text-lg-medium md:text-xl-medium xl:text-2xl-medium text-center whitespace-pre-line'>{`로그인이 필요한 서비스입니다\n로그인 화면으로 이동하시겠습니까?`}</p>
        <div className='mt-5 flex gap-4 md:mt-10'>
          <Button variant='tertiary' onClick={onClose}>
            아니오
          </Button>
          <Link className='flex w-full' href={`/signin${query}`}>
            <Button> 예</Button>
          </Link>
        </div>
      </div>
    </BaseModal>
  );
};

export default RedirectModal;
