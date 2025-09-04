'use client';

import { AlertTriangle } from 'lucide-react';

import BaseModal from '@/shared/components/BaseModal';
import Button from '@/shared/components/Button';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  return (
    <BaseModal title='삭제 확인 모달' isOpen={isOpen} onClose={onClose} size='M'>
      <div className='flex flex-col items-center px-6 pb-6'>
        {/* 아이콘 */}
        <AlertTriangle className='size-14 text-red-500' aria-hidden='true' />

        {/* 안내 문구 */}
        <p className='text-base-semibold md:text-mg-semibold xl:text-xl-semibold mt-4 text-center'>
          정말 삭제하시겠습니까?
        </p>

        {/* 버튼 영역 */}
        <div className='mt-6 flex w-full justify-center gap-4 xl:mt-7'>
          <Button variant='secondary' className='flex-1' onClick={onClose}>
            취소
          </Button>
          <Button variant='primary' className='flex-1' onClick={onConfirm}>
            확인
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}
