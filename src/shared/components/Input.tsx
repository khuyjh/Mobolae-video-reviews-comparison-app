'use client';

import { ComponentPropsWithRef, useState } from 'react';
import { FieldError } from 'react-hook-form';

import VisibilityOffIcon from '../../../public/icons/VisibilityOffIcon.svg';
import VisibilityOnIcon from '../../../public/icons/VisibilityOnIcon.svg';
import { cn } from '../lib/cn';

export interface InputProps extends ComponentPropsWithRef<'input'> {
  label?: string;
  error?: FieldError | undefined;
  helperText?: string;
  hasButton?: boolean;
}

const Input = ({
  className,
  label,
  error,
  helperText,
  hasButton = false,
  type,
  ...props
}: InputProps) => {
  const inputId = props.id;
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  //password 타입과 버튼이 모두 있을 때 비밀번호 표시 토글이 동작하도록 제어
  const getType = () => {
    if (type !== 'password' || !hasButton) return type;

    return isPasswordVisible ? 'text' : 'password';
  };

  const handleClickToggleVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <div className='text-md-regular xl:text-base-regular text-white'>
      {label && (
        <label className='mb-[10px] block' htmlFor={inputId}>
          {label}
        </label>
      )}

      <div className={cn('relative', { 'mb-[10px]': helperText || error })}>
        <input
          className={cn(
            BASE_INPUT_STYLE,
            {
              'border-red': error,
            },
            className,
          )}
          type={getType()}
          {...props}
        />
        {hasButton && (
          <button
            className='absolute top-[50%] right-5 translate-y-[-50%] cursor-pointer'
            type='button'
            onClick={handleClickToggleVisibility}
            aria-label={isPasswordVisible ? '비밀번호 숨기기' : '비밀번호 보기'}
          >
            {isPasswordVisible ? <VisibilityOnIcon /> : <VisibilityOffIcon />}
          </button>
        )}
      </div>

      {error ? (
        <p className='text-red text-xs-regular xl:text-md-regular'>{error.message}</p>
      ) : (
        <p className='text-xs-regular xl:text-md-regular text-gray-600'>{helperText}</p>
      )}
    </div>
  );
};

const BASE_INPUT_STYLE =
  'bg-black-800 border-black-700 w-full rounded-md border-1 px-5 py-4 placeholder:text-gray-600 focus:border-1 focus:border-main focus:outline-none md:max-w-110 xl:max-w-160 xl:py-[22px]';

export default Input;
