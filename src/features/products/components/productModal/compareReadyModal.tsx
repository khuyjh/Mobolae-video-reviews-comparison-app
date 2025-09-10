//비교 콘텐츠 1개

import Link from 'next/link';

import BaseModal from '@/shared/components/BaseModal';
import Button from '@/shared/components/Button';
import { useCompareStore } from '@/shared/stores/useCompareStore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CompareReadyModal = ({ isOpen, onClose }: Props) => {
  const { a, b } = useCompareStore();

  return (
    <BaseModal title='비교 가능' size='M' isOpen={isOpen} onClose={onClose}>
      <div className='flex flex-col items-center gap-7.5 px-5 pb-5 md:gap-10 md:px-10 md:pb-10'>
        <p className='text-xl-semibold xl:text-2xl-semibold'>
          비교하기가 가능합니다! <br />
          확인하러 가시겠습니까?
        </p>
        <div className='flex w-full justify-between gap-4'>
          <Button variant='secondary' onClick={onClose}>
            아니오
          </Button>
          <Link href='/compare' className='w-full'>
            <Button variant='primary' onClick={onClose}>
              예
            </Button>
          </Link>
        </div>
      </div>
    </BaseModal>
  );
};

export default CompareReadyModal;
