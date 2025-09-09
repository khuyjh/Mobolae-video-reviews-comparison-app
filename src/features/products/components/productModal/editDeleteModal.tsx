'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useState, useMemo, useEffect } from 'react';
import { toast } from 'react-toastify';

import BaseModal from '@/shared/components/BaseModal';
import Button from '@/shared/components/Button';
import { Chip } from '@/shared/components/chip';
import DeleteConfirmModal from '@/shared/components/deleteConfirmModal';
import ImageUploader from '@/shared/components/imageUploader';
import TextAreaWithCounter from '@/shared/components/textAreaWithCounter';
import { TEAM_ID, PATH_OPTION } from '@/shared/constants/constants';
import { toCategoryChip } from '@/shared/utils/categoryUtil';

import {
  useDeleteProduct,
  useUpdateProduct,
  useImageUpload,
} from '../../../../../openapi/queries/queries';

interface EditDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  name: string;
  category: { id: number; name: string };
  description?: string;
  imageUrl?: string;
}

export default function EditDeleteModal({
  isOpen,
  onClose,
  productId,
  name,
  category,
  description = '',
  imageUrl,
}: EditDeleteModalProps) {
  const queryClient = useQueryClient();

  const [images, setImages] = useState<File[]>([]);
  const [text, setText] = useState(description);
  const [existingImage, setExistingImage] = useState<string | null>(imageUrl || null);

  const handleModalClose = () => {
    setImages([]);
    setText(description);
    setExistingImage(imageUrl || null);
    onClose();
  };

  /* 삭제 확인 모달 상태 */
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  /* 미리보기 URL */
  const previewUrls = useMemo(() => {
    const fileUrls = images.map((file) => URL.createObjectURL(file));
    return [...(existingImage ? [existingImage] : []), ...fileUrls]; // 기존 이미지 + 새 이미지
  }, [images, existingImage]);

  /* cleanup: URL 해제 */
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url);
      });
    };
  }, [previewUrls]);

  const isFormValid = (existingImage || images.length > 0) && text.trim().length >= 10;

  const handleTextareaBlur = () => {
    const trimmedText = text.trim();
    if (trimmedText.length === 0) {
      toast.error('설명 내용을 입력해주세요.');
    } else if (trimmedText.length < 10) {
      toast.error('최소 10자 이상 적어주세요.');
    }
  };

  /* API hooks */
  const deleteMutation = useDeleteProduct();
  const updateMutation = useUpdateProduct();
  const uploadImageMutation = useImageUpload();

  /* 삭제 처리 */
  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync({
        ...PATH_OPTION,
        path: { ...PATH_OPTION.path, productId },
      });
      toast.success('삭제되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      onClose();
    } catch {
      toast.error('삭제에 실패했습니다.');
    }
  };

  /* 수정 처리 */
  const handleUpdate = async () => {
    try {
      let finalImageUrl = existingImage || '';

      /* 새 이미지 업로드 */
      if (images.length > 0) {
        const res = await uploadImageMutation.mutateAsync({
          path: { teamId: TEAM_ID as string },
          body: { image: images[0] },
        });
        finalImageUrl = res?.data?.url ?? '';
      }

      const payload = {
        path: { teamId: TEAM_ID as string, productId },
        body: {
          categoryId: category.id,
          name,
          image: finalImageUrl,
          description: text,
        },
      };

      await updateMutation.mutateAsync(payload);
      toast.success('수정되었습니다.\n새로고침 후 반영됩니다.');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      onClose();
    } catch {
      toast.error('수정에 실패했습니다.');
    }
  };

  const categoryChipProps = category?.id ? toCategoryChip(category) : null;

  return (
    <div>
      <BaseModal title='수정/삭제 모달' isOpen={isOpen} onClose={handleModalClose} size='L'>
        <div className='flex flex-col px-5 pb-5 md:px-10 md:pb-10'>
          {/* 카테고리 칩 */}
          <div className='flex justify-start'>
            {categoryChipProps && <Chip {...categoryChipProps} />}
          </div>

          {/* 콘텐츠명 */}
          <h2 className='text-xl-semibold xl:text-2xl-semibold mt-2.5'>{name}</h2>

          {/* 이미지 업로더 */}
          <ImageUploader
            value={images}
            onChange={setImages}
            onRemove={(index) => {
              if (index === 0 && existingImage) {
                setExistingImage(null);
              } else {
                setImages((prev) => prev.filter((_, i) => i !== index - (existingImage ? 1 : 0)));
              }
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
            <Button variant='primary' disabled={!isFormValid} onClick={handleUpdate}>
              수정하기
            </Button>
          </div>
        </div>
      </BaseModal>

      {/* 삭제 확인 모달 */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
