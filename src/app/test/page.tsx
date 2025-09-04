'use client';

import { useState } from 'react';

import CompareModal, { CompareModalType } from '@/features/product/components/productModal';
import Button from '@/shared/components/Button';

export default function TestPage() {
  const [modalType, setModalType] = useState<CompareModalType | null>(null);

  return (
    <div className='flex flex-col gap-4 p-8'>
      {/* 테스트용 버튼 */}
      <Button onClick={() => setModalType('added')}>Case 0: 등록됨</Button>
      <Button onClick={() => setModalType('ready')}>Case 1: 비교 가능</Button>
      <Button onClick={() => setModalType('replaceSelect')}>Case 2: 교체 선택</Button>
      <Button onClick={() => setModalType('replaceDone')}>Case 3: 교체 완료</Button>

      {/* 모달 */}
      {modalType && (
        <CompareModal
          type={modalType}
          isOpen={!!modalType}
          onClose={() => setModalType(null)}
          onChangeType={setModalType}
        />
      )}
    </div>
  );
}
