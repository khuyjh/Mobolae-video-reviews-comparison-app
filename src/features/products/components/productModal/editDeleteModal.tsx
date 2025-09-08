'use client';

import { useState, useMemo, useEffect } from 'react';
import { toast } from 'react-toastify';

import BaseModal from '@/shared/components/BaseModal';
import Button from '@/shared/components/Button';
import { Chip } from '@/shared/components/chip';
import DeleteConfirmModal from '@/shared/components/deleteConfirmModal';
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
  const [text, setText] = useState('');

  const handleModalClose = () => {
    setImages([]);
    setText('');
    onClose();
  };

  /* 삭제 확인 모달 상태 */
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  /* 미리보기 URL */
  const previewUrls = useMemo(() => {
    return images.map((file) => URL.createObjectURL(file));
  }, [images]);

  /* cleanup: URL 해제 */
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const isFormValid = images.length > 0 && text.trim().length >= 10;

  const handleTextareaBlur = () => {
    const trimmedText = text.trim();
    if (trimmedText.length === 0) {
      toast.error('설명 내용을 입력해주세요.');
    } else if (trimmedText.length < 10) {
      toast.error('최소 10자 이상 적어주세요.');
    }
  };

  return (
    <div>
      <BaseModal title='수정/삭제 모달' isOpen={isOpen} onClose={handleModalClose} size='L'>
        <div className='flex flex-col px-5 pb-5 md:px-10 md:pb-10'>
          {/* 카테고리 칩 */}
          <div className='flex justify-start'>
            <Chip {...toCategoryChip(category)} />
          </div>

          {/* 콘텐츠명 */}
          <h2 className='text-xl-semibold xl:text-2xl-semibold mt-2.5'>{name}</h2>

          {/* 이미지 업로더 */}
          <ImageUploader
            value={images}
            onChange={setImages}
            onRemove={(index) => {
              setImages((prev) => prev.filter((_, i) => i !== index));
            }}
            previewUrls={previewUrls}
            maxImages={1}
            className='mt-10'
          />

          {/* 설명 입력 */}
          <TextAreaWithCounter
            value={text}
            onChange={setText}
            onBlur={handleTextareaBlur}
            placeholder='감독, 출연진, 줄거리 등을 입력해 주세요.'
            className='mt-2.5 md:mt-3.5'
          />

          {/* 버튼 영역 */}
          <div className='mt-5 flex flex-row gap-4 md:mt-10'>
            <Button variant='secondary' onClick={() => setIsDeleteModalOpen(true)}>
              삭제하기
            </Button>
            <Button variant='primary' disabled={!isFormValid}>
              수정하기
            </Button>
          </div>
        </div>
      </BaseModal>

      {/* 삭제 확인 모달 */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          console.log('삭제 confirmed');
          setIsDeleteModalOpen(false);
          onClose();
        }}
      />
    </div>
  );
}
