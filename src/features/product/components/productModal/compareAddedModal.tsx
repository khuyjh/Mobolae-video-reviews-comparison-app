// 비교 콘텐츠 0개

import BaseModal from '@/shared/components/BaseModal';
import Button from '@/shared/components/Button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CompareAddedModal = ({ isOpen, onClose }: Props) => {
  return (
    <BaseModal title='비교 콘텐츠 등록' size='M' isOpen={isOpen} onClose={onClose}>
      <div className='flex flex-col items-center gap-7.5 px-5 pb-5 md:gap-10 md:px-10 md:pb-10'>
        <p className='text-xl-semibold xl:text-2xl-semibold'>비교 콘텐츠가 등록되었습니다!</p>
        <Button variant='primary' onClick={onClose}>
          확인
        </Button>
      </div>
    </BaseModal>
  );
};

export default CompareAddedModal;
