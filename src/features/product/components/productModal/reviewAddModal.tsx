'use client';

import { Star } from 'lucide-react';
import { ImagePlus, X } from 'lucide-react';
import { useState, useRef, useMemo, useEffect, ChangeEvent } from 'react';
import { toast } from 'react-toastify';

import BaseModal from '@/shared/components/BaseModal';
import Button from '@/shared/components/Button';
import { Chip } from '@/shared/components/chip';
import { cn } from '@/shared/lib/cn';
import { toCategoryChip } from '@/shared/utils/categoryUtil';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  rating: number;
}

const IMAGE_ITEM_BASE_CLASSES = 'bg-black-800 group relative rounded-[8px] border border-gray-700';
const IMAGE_ITEM_SIZES = 'h-[140px] w-[140px] md:h-[145px] md:w-[135px] xl:h-[160px] xl:w-[160px]';
const IMAGE_REMOVE_BUTTON_CLASSES =
  'bg-black-900/60 absolute top-1 right-1 rounded-full p-1 opacity-0 transition-opacity group-hover:opacity-100';
const TEXTAREA_CLASSES =
  'bg-black-800 w-full resize-none rounded-[8px] border border-gray-700 p-4 pr-12 text-white placeholder-gray-500';

type ImageEntry = { file: File; url: string };

const ReviewAddModal = ({ isOpen, onClose, rating }: Props) => {
  /* 리뷰 텍스트 상태 관리 */
  const [reviewText, setReviewText] = useState('');

  /* 이미지 파일 상태 관리 */
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const MAX_IMAGES = 3;
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* files → previews (한 번 만들고 재사용) */
  const previews = useMemo<ImageEntry[]>(() => {
    return imageFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
  }, [imageFiles]);

  /* previews가 바뀌거나 컴포넌트 unmount 시 URL 해제 */
  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  /* 이미지 첨부 버튼 클릭 시 파일 입력창 열기 */
  const handleImageUploadClick = () => {
    if (imageFiles.length < MAX_IMAGES) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      if (e.target) e.target.value = '';
      return;
    }

    const newFilesArray = Array.from(files);
    let duplicatesFound = false;

    const uniqueNewFiles = newFilesArray.filter((file) => {
      const isDuplicate = imageFiles.some(
        (existingFile) => existingFile.name === file.name && existingFile.size === file.size,
      );
      if (isDuplicate) duplicatesFound = true;
      return !isDuplicate;
    });

    if (duplicatesFound) {
      toast.error(
        <>
          이미 존재하는 파일은
          <br />
          추가할 수 없습니다.
        </>,
      );
    }

    const totalFilesAfterAdd = imageFiles.length + uniqueNewFiles.length;
    if (totalFilesAfterAdd > MAX_IMAGES) {
      const filesToAdd = uniqueNewFiles.slice(0, MAX_IMAGES - imageFiles.length);
      setImageFiles((prevFiles) => [...prevFiles, ...filesToAdd]);
    } else {
      setImageFiles((prevFiles) => [...prevFiles, ...uniqueNewFiles]);
    }

    if (e.target) e.target.value = '';
  };

  /* 이미지 제거 */
  const handleImageRemove = (index: number) => {
    setImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  /* 모달 닫기 */
  const handleModalClose = () => {
    setReviewText('');
    setImageFiles([]);
    onClose();
  };

  const productCategory = { id: 1, name: '' };
  const categoryChipProps = toCategoryChip(productCategory);

  const isReviewValid = reviewText.trim().length > 0;

  return (
    <BaseModal title='리뷰 작성 모달' isOpen={isOpen} onClose={handleModalClose} size='L'>
      <div className='flex flex-col px-5 pb-4 md:px-10 md:pb-10'>
        {/* 칩, 제목, 별점 */}
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

        {/* 리뷰 작성 칸 */}
        <div className='relative mt-3 md:mt-4'>
          <label htmlFor='review-text' className='sr-only'>
            리뷰 작성
          </label>
          <textarea
            id='review-text'
            className={TEXTAREA_CLASSES}
            rows={5}
            placeholder='리뷰를 작성해 주세요'
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
          <div className='text-md-regular absolute right-4 bottom-4 text-gray-600'>
            {reviewText.length}/500
          </div>
        </div>

        {/* 이미지 첨부 칸 */}
        <div className='mt-2.5 flex flex-col gap-3'>
          <div className='flex items-center gap-2'>
            {previews.map((p, index) => (
              <div key={p.url} className={cn(IMAGE_ITEM_BASE_CLASSES, IMAGE_ITEM_SIZES)}>
                <img
                  src={p.url}
                  alt={`첨부 이미지 ${index + 1}`}
                  className='h-full w-full rounded-[8px] object-cover'
                />
                <button
                  type='button'
                  onClick={() => handleImageRemove(index)}
                  aria-label={`이미지 ${index + 1} 삭제`}
                  className={IMAGE_REMOVE_BUTTON_CLASSES}
                >
                  <X className='size-4 text-white' />
                </button>
              </div>
            ))}
            {imageFiles.length < MAX_IMAGES && (
              <button
                type='button'
                onClick={handleImageUploadClick}
                aria-label='이미지 첨부'
                className={cn(
                  IMAGE_ITEM_BASE_CLASSES,
                  IMAGE_ITEM_SIZES,
                  'flex items-center justify-center transition-opacity hover:opacity-80',
                )}
              >
                <ImagePlus className='size-8 text-gray-600' />
              </button>
            )}
          </div>
          <input
            type='file'
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept='image/*'
            className='hidden'
          />
          <p className='text-xs-medium text-gray-400'>이미지는 최대 3개까지 첨부할 수 있습니다.</p>
        </div>

        {/* 작성하기 버튼 */}
        <Button
          variant='primary'
          className='mt-8 w-full max-w-full md:max-w-full xl:max-w-full'
          disabled={!isReviewValid}
        >
          작성하기
        </Button>
      </div>
    </BaseModal>
  );
};

export default ReviewAddModal;
