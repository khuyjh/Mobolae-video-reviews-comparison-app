// EditDeleteModal.tsx
'use client';

import { useState } from 'react';

import BaseModal from '@/shared/components/BaseModal';
import Button from '@/shared/components/Button';
import Dropdown from '@/shared/components/Dropdown';
import ImageUploader from '@/shared/components/imageUploader';
import TextAreaWithCounter from '@/shared/components/textAreaWithCounter';

interface EditDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const dummyOptions = [
  { name: '옵션 1', value: '1' },
  { name: '옵션 2', value: '2' },
];

export default function EditDeleteModal({ isOpen, onClose }: EditDeleteModalProps) {
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [text, setText] = useState('');

  return (
    <BaseModal title='편집/삭제 모달' isOpen={isOpen} onClose={onClose} size='L'>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-4 md:flex-row'>
          <div className='order-1 md:order-2 md:w-1/2'>
            <ImageUploader
              value={images}
              onChange={(files) => {
                setImages(files);
                setPreviewUrls(files.map((f) => URL.createObjectURL(f)));
              }}
              onRemove={(index) => {
                const newFiles = images.filter((_, i) => i !== index);
                setImages(newFiles);
                setPreviewUrls(newFiles.map((f) => URL.createObjectURL(f)));
              }}
              previewUrls={previewUrls}
            />
          </div>

          {/* 드롭다운 */}
          <div className='order-2 flex flex-col gap-4 md:order-1 md:w-1/2'>
            <Dropdown options={dummyOptions} onChange={() => {}} placeholder='드롭다운 1' />
            <Dropdown options={dummyOptions} onChange={() => {}} placeholder='드롭다운 2' />
          </div>
        </div>

        {/* 텍스트 인풋 */}
        <TextAreaWithCounter value={text} onChange={setText} placeholder='텍스트 입력' />

        {/* 버튼 영역 */}
        <div className='flex flex-row gap-4'>
          <Button variant='primary'>삭제하기</Button>
          <Button variant='primary'>저장하기</Button>
        </div>
      </div>
    </BaseModal>
  );
}
