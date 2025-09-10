// 비교 선택 모달
import { useState } from 'react';

import { CompareCandidate } from '@/features/compare/types/compareTypes';
import BaseModal from '@/shared/components/BaseModal';
import Button from '@/shared/components/Button';
import { useCompareStore } from '@/shared/stores/useCompareStore';

import { CompareModalType } from '.';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onChangeType: (type: CompareModalType) => void;
  product: CompareCandidate;
}

const CompareReplaceSelectModal = ({ isOpen, onClose, onChangeType, product }: Props) => {
  const { a, b, trySetA, trySetB } = useCompareStore();
  const [selected, setSelected] = useState<'A' | 'B'>('A');

  const handleReplace = () => {
    if (!product) return;
    if (selected === 'A') {
      trySetA(product);
    } else {
      trySetB(product);
    }
    onChangeType('replaceDone');
  };

  return (
    <BaseModal title='비교 상품 교체 선택' size='M' isOpen={isOpen} onClose={onClose}>
      <div className='flex flex-col items-center gap-7.5 px-5 pb-5 md:gap-10 md:px-10 md:pb-8 xl:pb-10'>
        <p className='text-xl-semibold xl:text-2xl-semibold text-center'>
          지금 보신 &apos;{product.name}&apos;
          <br />
          어떤 콘텐츠와 교체할까요?
        </p>

        <div className='flex w-full flex-col items-center gap-3'>
          {a && (
            <Button
              variant={selected === 'A' ? 'secondary' : 'tertiary'}
              onClick={() => setSelected('A')}
            >
              {a.name}
            </Button>
          )}
          {b && (
            <Button
              variant={selected === 'B' ? 'secondary' : 'tertiary'}
              onClick={() => setSelected('B')}
            >
              {b.name}
            </Button>
          )}
        </div>

        <Button variant='primary' onClick={handleReplace}>
          교체하기
        </Button>
      </div>
    </BaseModal>
  );
};

export default CompareReplaceSelectModal;
