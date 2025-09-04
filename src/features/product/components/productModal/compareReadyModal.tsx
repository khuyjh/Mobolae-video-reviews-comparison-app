import BaseModal from '@/shared/components/BaseModal';
import Button from '@/shared/components/Button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CompareReadyModal = ({ isOpen, onClose }: Props) => {
  return (
    <BaseModal title='비교 가능' size='M' isOpen={isOpen} onClose={onClose}>
      <div className='flex flex-col items-center gap-6 p-6'>
        <p>비교하기가 가능합니다! 확인하러 가시겠습니까?</p>
        <div className='flex w-full justify-between gap-4'>
          <Button variant='secondary' onClick={onClose}>
            아니오
          </Button>
          <Button variant='primary' onClick={onClose}>
            예
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default CompareReadyModal;
