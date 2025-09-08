'use client';

import { cn } from '@/shared/lib/cn';

/*
 * value: 텍스트 입력 값
 * onChange: 값 변경 핸들러
 * maxLength: 최대 글자 수(기본 500)
 */
interface TextAreaWithCounterProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  maxLength?: number;
  placeholder?: string;
  className?: string;
}

const TEXTAREA_CLASSES =
  'bg-black-800 w-full h-full resize-none rounded-[8px] border border-black-700 p-4 pr-12 text-white placeholder-gray-500  focus:outline-none focus:ring-1 focus:ring-main';

export default function TextAreaWithCounter({
  value,
  onChange,
  onBlur,
  maxLength = 500,
  placeholder,
  className,
}: TextAreaWithCounterProps) {
  return (
    <div className={cn('relative h-30 w-full md:h-40', className)}>
      <textarea
        className={TEXTAREA_CLASSES}
        placeholder={placeholder}
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
      />
      <div className='text-md-regular absolute right-4 bottom-4 text-gray-600'>
        {value.length}/{maxLength}
      </div>
    </div>
  );
}
