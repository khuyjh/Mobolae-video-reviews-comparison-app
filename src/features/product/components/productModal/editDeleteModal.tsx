// EditDeleteModal.tsx
'use client';

import { useState } from 'react';

import BaseModal from '@/shared/components/BaseModal';
import Button from '@/shared/components/Button';
import { Chip } from '@/shared/components/chip';
import ImageUploader from '@/shared/components/imageUploader';
import TextAreaWithCounter from '@/shared/components/textAreaWithCounter';
import { toCategoryChip } from '@/shared/utils/categoryUtil';

interface EditDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  name?: string;
  category?: { id: number; name: string };
}

export default function EditDeleteModal({
  isOpen,
  onClose,
  name = '뷰티 인사이드',
  category = { id: 1, name: '영화' },
}: EditDeleteModalProps) {
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [text, setText] = useState('');

  return (
    <BaseModal title='수정/삭제 모달' isOpen={isOpen} onClose={onClose} size='L'>
      <div className='flex flex-col px-5 pb-5'>
        <h2 className='text-xl-semibold xl:text-2xl-semibold'>콘텐츠 수정/삭제</h2>
        {/* 카테고리 칩 */}
        <div className='mt-5 flex justify-start'>
          <Chip {...toCategoryChip(category)} />
        </div>

        {/* 콘텐츠명 */}
        <h2 className='text-xl-semibold xl:text-2xl-semibold mt-2.5'>{name}</h2>

        {/* 이미지 업로더 */}
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
          maxImages={1}
          className='mt-5'
        />

        {/* 설명 입력 */}
        <TextAreaWithCounter
          value={text}
          onChange={setText}
          placeholder='감독, 출연진, 줄거리 등을 입력해 주세요.'
          className='mt-2.5'
        />

        {/* 버튼 영역 */}
        <div className='mt-5 flex flex-row gap-4'>
          <Button variant='secondary'>삭제하기</Button>
          <Button variant='primary'>수정하기</Button>
        </div>
      </div>
    </BaseModal>
  );
}
