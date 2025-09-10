// 비교 모달들 관리

import { CompareCandidate } from '@/features/compare/types/compareTypes';

import CompareAddedModal from './compareAddedModal';
import CompareReadyModal from './compareReadyModal';
import CompareReplaceDoneModal from './compareReplaceDoneModal';
import CompareReplaceSelectModal from './compareReplaceSelectModal';

export type CompareModalType = 'added' | 'ready' | 'replaceSelect' | 'replaceDone';

interface CompareModalProps {
  type: CompareModalType;
  isOpen: boolean;
  onClose: () => void;
  onChangeType: (type: CompareModalType) => void;
  product?: CompareCandidate;
}

const CompareModal = ({ type, isOpen, onClose, onChangeType, product }: CompareModalProps) => {
  switch (type) {
    case 'added':
      return <CompareAddedModal isOpen={isOpen} onClose={onClose} />;
    case 'ready':
      return <CompareReadyModal isOpen={isOpen} onClose={onClose} />;
    case 'replaceSelect':
      return (
        <CompareReplaceSelectModal
          isOpen={isOpen}
          onClose={onClose}
          onChangeType={onChangeType}
          product={product!}
        />
      );
    case 'replaceDone':
      return <CompareReplaceDoneModal isOpen={isOpen} onClose={onClose} />;
    default:
      return null;
  }
};

export default CompareModal;
