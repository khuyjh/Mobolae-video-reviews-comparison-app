import { toast } from 'react-toastify';

import { useCompareStore } from '@/shared/stores/useCompareStore';

import type { CompareCandidate } from '@/features/compare/types/compareTypes';
import type { CompareModalType } from '@/features/products/components/productModal';

const TOAST_MESSAGES = {
  ALREADY_ADDED: '이미 비교 대상에 등록된 콘텐츠입니다.',
  DIFFERENT_CATEGORY: '카테고리가 다른 콘텐츠는 \n삭제 후 다시 비교할 수 있습니다.',
} as const;

interface HandleCompareClickParams {
  productId: number;
  title: string;
  categoryId: number;
  setCompareTarget: (item: CompareCandidate | null) => void;
  setCompareModalType: (type: CompareModalType) => void;
  setIsCompareModalOpen: (isOpen: boolean) => void;
}

export function handleCompareClick({
  productId,
  title,
  categoryId,
  setCompareTarget,
  setCompareModalType,
  setIsCompareModalOpen,
}: HandleCompareClickParams) {
  const { a, b, trySetA, trySetB } = useCompareStore.getState();

  const newItem: CompareCandidate = { id: productId, name: title, categoryId };

  if ((a && a.id === newItem.id) || (b && b.id === newItem.id)) {
    toast.error(TOAST_MESSAGES.ALREADY_ADDED);
    return;
  }

  setCompareTarget(newItem);

  if (!a) {
    const result = trySetA(newItem);
    if (!result.ok) {
      toast.error(TOAST_MESSAGES.DIFFERENT_CATEGORY);
      return;
    }
    setCompareModalType('added');
    setIsCompareModalOpen(true);
  } else if (!b) {
    const result = trySetB(newItem);
    if (!result.ok) {
      toast.error(TOAST_MESSAGES.DIFFERENT_CATEGORY);
      return;
    }
    setCompareModalType('ready');
    setIsCompareModalOpen(true);
  } else {
    if (a.categoryId !== newItem.categoryId || b.categoryId !== newItem.categoryId) {
      toast.error(TOAST_MESSAGES.DIFFERENT_CATEGORY);
      return;
    }
    setCompareModalType('replaceSelect');
    setIsCompareModalOpen(true);
  }
}
