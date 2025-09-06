'use client';

import { ImagePlus, X } from 'lucide-react';
import { useRef, ChangeEvent } from 'react';

import { cn } from '@/shared/lib/cn';

/**
 * value: 현재 선택된 이미지 배열
 * onChange: 새로운 파일이 선택 되었을 때 호출되는 함수
 * onRemove: 이미지가 삭제되었을 때 호출되는 함수
 * maxImages: 이미지 최대 개수 (기본값 1)
 * previewUrls: 이미지 미리보기
 */
interface ImageUploaderProps {
  value: File[];
  onChange: (newFiles: File[]) => void;
  onRemove: (index: number) => void;
  maxImages?: number;
  className?: string;
  previewUrls: string[];
}

const IMAGE_ITEM_BASE_CLASSES = 'bg-black-800 group relative rounded-[8px] border border-black-700';

const IMAGE_ITEM_SIZES = 'w-full aspect-square md:h-[135px] md:w-[135px] xl:h-[160px] xl:w-[160px]';

const IMAGE_REMOVE_BUTTON_CLASSES =
  'bg-black-900/60 absolute top-1 right-1 rounded-full p-1 opacity-0 transition-opacity group-hover:opacity-100';

export default function ImageUploader({
  value,
  onChange,
  onRemove,
  maxImages = 1, // 기본값 1
  className,
  previewUrls,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      if (e.target) e.target.value = '';
      return;
    }
    const newFilesArray = Array.from(files);
    onChange(newFilesArray);
    if (e.target) e.target.value = '';
  };

  const handleImageRemove = (index: number) => {
    onRemove(index);
  };

  const canAddMore = value.length < maxImages;

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* 이미지 개수 별 레이아웃 */}
      <div
        className={cn(
          maxImages === 1
            ? 'flex' // 1장일 때
            : `grid grid-cols-${maxImages} gap-2`, // 여러 장일 때
        )}
      >
        {previewUrls.map((previewUrl, index) => (
          <div
            key={`${value[index]?.name ?? 'img'}-${index}`}
            className={cn(IMAGE_ITEM_BASE_CLASSES, IMAGE_ITEM_SIZES)}
          >
            <img
              src={previewUrl}
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

        {canAddMore && (
          <label
            htmlFor='file-upload'
            aria-label='이미지 첨부'
            tabIndex={0}
            role='button'
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();

                fileInputRef.current?.click();
              }
            }}
            className={cn(
              IMAGE_ITEM_BASE_CLASSES,
              IMAGE_ITEM_SIZES,
              'hover:bg-black-700 flex cursor-pointer items-center justify-center transition-colors',
              'focus:ring-main focus:ring-1 focus:outline-none',
            )}
          >
            <ImagePlus className='size-8 text-gray-600' />
          </label>
        )}
      </div>

      <input
        id='file-upload'
        type='file'
        ref={fileInputRef}
        onChange={handleFileChange}
        {...(maxImages > 1 ? { multiple: true } : {})}
        accept='image/*'
        className='hidden'
      />
    </div>
  );
}
