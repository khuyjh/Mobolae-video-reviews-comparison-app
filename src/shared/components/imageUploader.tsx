'use client';

import { ImagePlus, X } from 'lucide-react';
import { useRef, ChangeEvent } from 'react';

import { cn } from '@/shared/lib/cn';

/**
 * value: 현재 선택된 이미지 배열
 * onChange: 새로운 파일이 선택 되었을 때 호출되는 함수
 * onRemove: 이미지가 삭제되었을 때 호출되는 함수
 * previewUrls: 이미지 미리보기
 * showAddButton: 이미지 추가 버튼 여부
 */
interface ImageUploaderProps {
  value: File[];
  onChange: (newFiles: File[]) => void;
  onRemove: (index: number) => void;
  className?: string;
  previewUrls: string[];
  showAddButton?: boolean;
}

const IMAGE_ITEM_BASE_CLASSES = 'bg-black-800 group relative rounded-[8px] border border-gray-700';

const IMAGE_ITEM_SIZES = 'w-full aspect-square md:h-[135px] md:w-[135px] xl:h-[160px] xl:w-[160px]';
const IMAGE_REMOVE_BUTTON_CLASSES =
  'bg-black-900/60 absolute top-1 right-1 rounded-full p-1 opacity-0 transition-opacity group-hover:opacity-100';

export default function ImageUploader({
  value,
  onChange,
  onRemove,
  className,
  previewUrls,
  showAddButton = true,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    /* 파일이 없거나 빈 배열인 경우 */
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

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className='grid grid-cols-3 gap-2'>
        {/* URL은 부모로부터 받은 previewUrls를 직접 사용 */}
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

        {showAddButton && (
          <label
            htmlFor='file-upload'
            aria-label='이미지 첨부'
            className={cn(
              IMAGE_ITEM_BASE_CLASSES,
              IMAGE_ITEM_SIZES,
              'hover:bg-black-700 flex cursor-pointer items-center justify-center transition-colors',
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
        multiple
        accept='image/*'
        className='hidden'
      />
    </div>
  );
}
