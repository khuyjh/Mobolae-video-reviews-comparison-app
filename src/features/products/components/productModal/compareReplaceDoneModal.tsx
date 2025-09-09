// 비교 콘텐츠 선택 후
import Link from 'next/link';

import BaseModal from '@/shared/components/BaseModal';
import Button from '@/shared/components/Button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CompareReplaceDoneModal = ({ isOpen, onClose }: Props) => {
  return (
    <BaseModal title='비교 콘텐츠 교체 완료' size='M' isOpen={isOpen} onClose={onClose}>
      <div className='flex flex-col items-center gap-7.5 px-5 pb-5 md:gap-11 md:px-10 md:pb-10 xl:gap-10'>
        <p className='text-xl-semibold xl:text-2xl-semibold text-center'>
          비교 콘텐츠가 교체되었습니다. <br />
          바로 확인해 보시겠어요?
        </p>
        <Link href='/compare' className='flex w-full justify-center'>
          <Button variant='primary' onClick={onClose}>
            바로가기
          </Button>
        </Link>
      </div>
    </BaseModal>
  );
};

export default CompareReplaceDoneModal;
