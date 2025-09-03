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
}

type ImageEntry = { file: File; url: string };

export default function ReviewAddModal({ isOpen, onClose, rating }: Props) {
  const [reviewText, setReviewText] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);

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
      toast.error(
        <div>
          이미 존재하는 파일은
          <br />
          추가할 수 없습니다.
        </div>,
      );
    }

    if (uniqueNewFiles.length === 0) return;

    const remain = 3 - imageFiles.length;
    if (remain <= 0) return;

    const filesToAdd = uniqueNewFiles.slice(0, remain);
    setImageFiles((prev) => [...prev, ...filesToAdd]);
  };

  const handleImageRemove = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

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
          maxLength={500}
          placeholder='리뷰를 작성해 주세요'
          className='mt-3 md:mt-4'
        />
        <ImageUploader
          value={imageFiles}
          onChange={handleImageChange}
          onRemove={handleImageRemove}
          previewUrls={previews.map((p) => p.url)}
          maxImages={3}
          className='mt-2.5'
        />
        <p className='text-xs-medium mt-1.5 text-gray-400'>
          이미지는 최대 3개까지 첨부할 수 있습니다.
        </p>
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
}
