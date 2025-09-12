'use client';

import { useQueryClient } from '@tanstack/react-query';
import { Star } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { toast } from 'react-toastify';

import BaseModal from '@/shared/components/BaseModal';
import Button from '@/shared/components/Button';
import { Chip } from '@/shared/components/chip';
import ImageUploader from '@/shared/components/imageUploader';
import TextAreaWithCounter from '@/shared/components/textAreaWithCounter';
import { TEAM_ID } from '@/shared/constants/constants';
import { cn } from '@/shared/lib/cn';
import { toCategoryChip } from '@/shared/utils/categoryUtil';

import {
  useCreateReview,
  useUpdateReview,
  useImageUpload,
} from '../../../../../openapi/queries/queries';

import type { CreateReviewData, UpdateReviewData } from '../../../../../openapi/requests/types.gen';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  rating: number;
  mode: 'add' | 'edit'; // 리뷰 작성/수정 모드
  productId: number;
  productName: string;
  productCategory: { id: number; name: string };
  review?: {
    id: number;
    content: string;
    rating: number;
    images: { id: number; url: string }[];
  };
}

type ImageEntry = { file: File; url: string };

const ReviewModal = ({
  isOpen,
  onClose,
  rating,
  mode,
  productId,
  productName,
  productCategory,
  review,
}: Props) => {
  const queryClient = useQueryClient();

  /* 리뷰 초기 값 (수정 모드) */
  const initialReviewText = review?.content || '';
  const initialExistingImages = useMemo(() => review?.images || [], [review]);
  const initialRating = mode === 'edit' && review ? review.rating : rating;

  /* 상태 관리 */
  const [reviewText, setReviewText] = useState(mode === 'edit' && review ? review.content : '');
  const [existingImages, setExistingImages] = useState(
    mode === 'edit' && review ? review.images : [],
  );
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [currentRating, setCurrentRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  /* 미리보기용 URL 생성 */
  const maxImages = 3;
  const previews = useMemo<ImageEntry[]>(() => {
    return imageFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
  }, [imageFiles]);

  /* 메모리 누수 방지 */
  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  /* 새로운 이미지 추가 */
  const handleImageChange = (newFiles: File[]) => {
    if (!newFiles || newFiles.length === 0) return;
    let duplicatesFound = false;

    /* 중복 파일 체크 */
    const uniqueNewFiles = newFiles.filter((file) => {
      const isDuplicate = imageFiles.some(
        (existingFile) => existingFile.name === file.name && existingFile.size === file.size,
      );
      if (isDuplicate) duplicatesFound = true;
      return !isDuplicate;
    });

    if (duplicatesFound) toast.error('이미 존재하는 파일은 추가할 수 없습니다.');
    if (uniqueNewFiles.length === 0) return;

    /* 최대 업로드 개수 제한 */
    const remain = maxImages - (existingImages.length + imageFiles.length);
    if (remain <= 0) return;

    const filesToAdd = uniqueNewFiles.slice(0, remain);
    setImageFiles((prev) => [...prev, ...filesToAdd]);
  };

  /* 새 이미지 제거 */
  const handleImageRemove = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  /* 기존 이미지 제거 */
  const handleExistingImageRemove = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  /* 모달 닫기 -> 입력값 초기화 */
  const handleModalClose = () => {
    setReviewText(mode === 'edit' && review ? review.content : '');
    setExistingImages(mode === 'edit' && review ? review.images : []);
    setImageFiles([]);
    setCurrentRating(initialRating);
    onClose();
  };

  /* 리뷰 blur 시 유효성 검사  */
  const handleReviewBlur = () => {
    if (reviewText.trim().length === 0) toast.error('리뷰 내용을 입력해주세요.');
    else if (reviewText.trim().length < 10) toast.error('최소 10자 이상 적어주세요.');
  };

  /* API hooks */
  const createReviewMutation = useCreateReview();
  const updateReviewMutation = useUpdateReview();
  const uploadImageMutation = useImageUpload();

  const handleSubmit = async () => {
    try {
      /* 새 이미지 서버 업로드 -> URL 얻기 */
      const uploadedUrls: string[] = [];
      for (const file of imageFiles) {
        const res = await uploadImageMutation.mutateAsync({
          path: { teamId: TEAM_ID as string },
          body: { image: file },
        });
        const url = res?.data?.url;
        if (url) uploadedUrls.push(url);
      }
      /* 신규 리뷰 작성 */
      if (mode === 'add') {
        const payload: CreateReviewData = {
          path: { teamId: TEAM_ID as string },
          body: {
            productId,
            rating: currentRating,
            content: reviewText,
            ...(uploadedUrls.length > 0 ? { images: uploadedUrls } : {}),
          },
        };
        await createReviewMutation.mutateAsync(payload);
        toast.success('리뷰가 작성되었습니다.');
      } else if (mode === 'edit' && review) {
        /* 기존 리뷰 수정 */
        const payload: UpdateReviewData = {
          path: { teamId: TEAM_ID as string, reviewId: review.id },
          body: {
            rating: currentRating,
            content: reviewText,
            ...(existingImages.length > 0 || uploadedUrls.length > 0
              ? {
                  images: [
                    ...existingImages.map((img) => ({ id: img.id })), // 유지할 기존 이미지
                    ...uploadedUrls.map((u) => ({ source: u })), // 새로 추가한 이미지
                  ],
                }
              : {}),
          },
        };
        await updateReviewMutation.mutateAsync(payload);
        toast.success('리뷰가 수정되었습니다.');
      }

      /* 리스트 실시간 갱신 */
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });

      handleModalClose();
    } catch {
      toast.error('요청 중 오류가 발생했습니다.');
    }
  };

  const categoryChipProps = toCategoryChip(productCategory);

  const isReviewValid = reviewText.trim().length >= 10;
  const isAddModeValid = mode === 'add' ? currentRating > 0 : true;

  /* 수정모드 변경사항 감지 */
  const hasChanges = useMemo(() => {
    const isTextChanged = reviewText !== initialReviewText;
    const isExistingImagesModified = existingImages.length !== initialExistingImages.length;
    const isNewImageAdded = imageFiles.length > 0;
    const isExistingImageOrderChanged =
      JSON.stringify(existingImages) !== JSON.stringify(initialExistingImages);
    const isRatingChanged = currentRating !== initialRating;

    return (
      isTextChanged ||
      isExistingImagesModified ||
      isNewImageAdded ||
      isExistingImageOrderChanged ||
      isRatingChanged
    );
  }, [
    reviewText,
    existingImages,
    imageFiles,
    currentRating,
    initialReviewText,
    initialExistingImages,
    initialRating,
  ]);

  return (
    <BaseModal
      title={mode === 'add' ? '리뷰 작성 모달' : '리뷰 수정 모달'}
      isOpen={isOpen}
      onClose={handleModalClose}
      size='L'
    >
      <div className='flex flex-col px-5 pb-4 md:px-10 md:pb-10'>
        <div className='flex flex-col items-start'>
          <Chip {...categoryChipProps} />
          <h2 className='text-xl-semibold mt-2.5 text-white'>{productName}</h2>

          <div className='mt-5 md:mt-10'>
            <div role='img' aria-label={`현재 별점 ${rating}점`} className='flex gap-1'>
              {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                return (
                  <Star
                    key={index}
                    onClick={() => setCurrentRating(starValue)}
                    onMouseEnter={() => setHoverRating(starValue)}
                    onMouseLeave={() => setHoverRating(null)}
                    className={cn(
                      'size-7 cursor-pointer transition-colors',
                      starValue <= (hoverRating ?? currentRating)
                        ? hoverRating
                          ? 'fill-yellow-300 text-yellow-300'
                          : 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-400 text-gray-400',
                    )}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <TextAreaWithCounter
          value={reviewText}
          onChange={setReviewText}
          onBlur={handleReviewBlur}
          maxLength={500}
          placeholder={
            mode === 'add' ? '최소 10자 이상 리뷰를 작성해 주세요' : '리뷰를 수정해 주세요'
          }
          className='mt-3 md:mt-4'
        />

        <ImageUploader
          value={imageFiles}
          onChange={handleImageChange}
          onRemove={(index) => {
            if (index < existingImages.length) handleExistingImageRemove(index);
            else handleImageRemove(index - existingImages.length);
          }}
          previewUrls={[...existingImages.map((img) => img.url), ...previews.map((p) => p.url)]}
          maxImages={maxImages}
          className='mt-2.5 w-[120px] max-w-none'
        />

        <p className='text-xs-medium mt-1.5 text-gray-400'>
          이미지는 최대 {maxImages}개까지 첨부할 수 있습니다.
        </p>

        <Button
          variant='primary'
          className='mt-8 w-full max-w-full md:max-w-full xl:max-w-full'
          disabled={!isReviewValid || !isAddModeValid || (mode === 'edit' && !hasChanges)}
          onClick={handleSubmit}
        >
          {mode === 'add' ? '작성하기' : '수정하기'}
        </Button>
      </div>
    </BaseModal>
  );
};

export default ReviewModal;
