'use client';

import { Star } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { toast } from 'react-toastify';

import BaseModal from '@/shared/components/BaseModal';
import Button from '@/shared/components/Button';
import { Chip } from '@/shared/components/chip';
import ImageUploader from '@/shared/components/imageUploader';
import TextAreaWithCounter from '@/shared/components/textAreaWithCounter';
import { cn } from '@/shared/lib/cn';
import { toCategoryChip } from '@/shared/utils/categoryUtil';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  rating: number;
  mode: 'add' | 'edit'; // 리뷰 생성 | 리뷰 수정
  review?: {
    id: number;
    content: string;
    rating: number;
    images: { id: number; url: string }[];
  };
}

type ImageEntry = { file: File; url: string };

export default function ReviewModal({ isOpen, onClose, rating, mode, review }: Props) {
  const [reviewText, setReviewText] = useState(mode === 'edit' && review ? review.content : '');
  /* 기존 이미지 (수정에서만 초기화) */
  const [existingImages, setExistingImages] = useState(
    mode === 'edit' && review ? review.images : [],
  );
  /* 신규 업로드 이미지 파일 */
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const maxImages = 3;
  /* 신규 이미지 -> 미리보기 URL 변환 */
  const previews = useMemo<ImageEntry[]>(() => {
    return imageFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
  }, [imageFiles]);

  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  const handleImageChange = (newFiles: File[]) => {
    if (!newFiles || newFiles.length === 0) return;

    let duplicatesFound = false;

    const uniqueNewFiles = newFiles.filter((file) => {
      const isDuplicate = imageFiles.some(
        (existingFile) => existingFile.name === file.name && existingFile.size === file.size,
      );
      if (isDuplicate) duplicatesFound = true;
      return !isDuplicate;
    });

    if (duplicatesFound) {
      toast.error('이미 존재하는 파일은\n추가할 수 없습니다.');
    }

    if (uniqueNewFiles.length === 0) return;
    /* 기존 이미지 + 신규 이미지 */
    const remain = maxImages - (existingImages.length + imageFiles.length);
    if (remain <= 0) return;

    const filesToAdd = uniqueNewFiles.slice(0, remain);
    setImageFiles((prev) => [...prev, ...filesToAdd]);
  };
  /* 신규 이미지 삭제 */
  const handleImageRemove = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };
  /* 기존 이미지 삭제 */
  const handleExistingImageRemove = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleModalClose = () => {
    setReviewText(mode === 'edit' && review ? review.content : '');
    setExistingImages(mode === 'edit' && review ? review.images : []);
    setImageFiles([]);
    onClose();
  };

  const handleReviewBlur = () => {
    if (reviewText.trim().length === 0) {
      toast.error('리뷰 내용을 입력해주세요.');
    } else if (reviewText.trim().length < 10) {
      toast.error('최소 10자 이상 적어주세요.');
    }
  };

  const handleSubmit = () => {
    if (mode === 'add') {
      const body = {
        productId: 1,
        content: reviewText,
        rating,
        images: previews.map((p) => p.url), // 신규 이미지 URL
      };
      console.log('POST body:', body);
    } else {
      const body = {
        content: reviewText,
        rating,
        images: [
          ...existingImages.map((img) => ({ id: img.id })), // 기존 이미지 id만 전송
          ...previews.map((p) => ({ source: p.url })), // 신규 이미지는 url 전송
        ],
      };
      console.log('PATCH body:', body);
    }
    handleModalClose();
  };

  const productCategory = { id: 1, name: '' };
  const categoryChipProps = toCategoryChip(productCategory);

  const isReviewValid = reviewText.trim().length >= 10;

  return (
    <BaseModal
      title={mode === 'add' ? '리뷰 작성 모달' : '리뷰 수정 모달'}
      isOpen={isOpen}
      onClose={handleModalClose}
      size='L'
    >
      <div className='flex-col px-5 pb-4 md:px-10 md:pb-10'>
        <div className='flex flex-col items-start'>
          <Chip {...categoryChipProps} />
          <h2 className='text-xl-semibold mt-2.5 text-white'>
            글자수체크해보려고합니다.혹시제목이길면어떻게될까요굿
          </h2>

          <div className='mt-5 md:mt-10'>
            <div role='img' aria-label={`현재 별점 ${rating}점`} className='flex gap-1'>
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className={cn(
                    'size-7',
                    index < rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'fill-gray-400 text-gray-400',
                  )}
                />
              ))}
            </div>
          </div>
        </div>
        <TextAreaWithCounter
          value={reviewText}
          onChange={setReviewText}
          onBlur={handleReviewBlur}
          maxLength={500}
          placeholder={mode === 'add' ? '리뷰를 작성해 주세요' : '리뷰를 수정해 주세요'}
          className='mt-3 md:mt-4'
        />

        <ImageUploader
          value={imageFiles}
          onChange={handleImageChange}
          onRemove={(index) => {
            if (index < existingImages.length) {
              handleExistingImageRemove(index);
            } else {
              handleImageRemove(index - existingImages.length);
            }
          }}
          previewUrls={[...existingImages.map((img) => img.url), ...previews.map((p) => p.url)]}
          maxImages={maxImages}
          className='mt-2.5'
        />
        <p className='text-xs-medium mt-1.5 text-gray-400'>
          이미지는 최대 {maxImages}개까지 첨부할 수 있습니다.
        </p>
        <Button
          variant='primary'
          className='mt-8 w-full max-w-full md:max-w-full xl:max-w-full'
          disabled={!isReviewValid}
          onClick={handleSubmit}
        >
          {mode === 'add' ? '작성하기' : '수정하기'}
        </Button>
      </div>
    </BaseModal>
  );
}
