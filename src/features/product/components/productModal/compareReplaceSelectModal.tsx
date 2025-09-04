import BaseModal from '@/shared/components/BaseModal';
import Button from '@/shared/components/Button';

import { CompareModalType } from '.';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onChangeType: (next: CompareModalType) => void;
}

const CompareReplaceSelectModal = ({ isOpen, onClose, onChangeType }: Props) => {
  return (
    <BaseModal title='비교 상품 교체 선택' size='M' isOpen={isOpen} onClose={onClose}>
      <div className='flex flex-col gap-6 p-6'>
        <p>
          ooo <br />
          어떤 콘텐츠와 비교할까요?
        </p>

        {/* 교체할 후보 버튼 2개 (임시 UI) */}
        <div className='flex flex-col gap-3'>
          <Button variant='secondary'>상품 A</Button>
          <Button variant='secondary'>상품 B</Button>
        </div>

        {/* 교체하기 버튼 */}
        <Button variant='primary' onClick={() => onChangeType('replaceDone')}>
          교체하기
        </Button>
      </div>
    </BaseModal>
  );
};

export default CompareReplaceSelectModal;
