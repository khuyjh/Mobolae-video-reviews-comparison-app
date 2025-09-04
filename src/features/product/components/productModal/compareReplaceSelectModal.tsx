// 비교 선택 모달
import { useState } from 'react';

import BaseModal from '@/shared/components/BaseModal';
import Button from '@/shared/components/Button';

import { CompareModalType } from '.';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onChangeType: (next: CompareModalType) => void;
}

/* mock 데이터 */
const mockProductName = '뷰티 인사이드';
const mockCompareNameone = 'DP';
const mockCompareNametwo = '더 글로리';

const CompareReplaceSelectModal = ({ isOpen, onClose, onChangeType }: Props) => {
  const [selected, setSelected] = useState<'A' | 'B'>('A');

  return (
    <BaseModal title='비교 상품 교체 선택' size='M' isOpen={isOpen} onClose={onClose}>
      <div className='flex flex-col items-center gap-7.5 px-5 pb-5 md:gap-10 md:px-10 md:pb-8 xl:pb-10'>
        <p className='text-xl-semibold xl:text-2xl-semibold text-center'>
          지금 보신 &apos;{mockProductName}&apos;
          <br />
          어떤 콘텐츠와 비교할까요?
        </p>

        <div className='flex w-full flex-col items-center gap-3'>
          <Button
            variant={selected === 'A' ? 'secondary' : 'tertiary'}
            onClick={() => setSelected('A')}
          >
            {mockCompareNameone}
          </Button>
          <Button
            variant={selected === 'B' ? 'secondary' : 'tertiary'}
            onClick={() => setSelected('B')}
          >
            {mockCompareNametwo}
          </Button>
        </div>

        <Button variant='primary' onClick={() => onChangeType('replaceDone')}>
          교체하기
        </Button>
      </div>
    </BaseModal>
  );
};

export default CompareReplaceSelectModal;
