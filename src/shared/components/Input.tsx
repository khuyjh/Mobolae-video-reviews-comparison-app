'use client';

import { ComponentPropsWithRef } from 'react';
import { FieldError } from 'react-hook-form';

import { cn } from '../lib/cn';

export interface InputProps extends ComponentPropsWithRef<'input'> {
  label?: string;
  error?: FieldError;
  helperText?: string;
}

const BASE_INPUT_STYLE =
  'bg-black-800 border-black-700 w-full rounded-md border-1 px-5 py-4 placeholder:text-gray-600 focus:border-gray-400 md:max-w-110 xl:max-w-160 xl:py-[22px]';

const Input = ({ className, label, error, helperText, ...props }: InputProps) => {
  const inputId = props.id;

  return (
    <div className='text-md-regular xl:text-base-regular text-white'>
      {label && (
        <label className='mb-[10px] block' htmlFor={inputId}>
          {label}
        </label>
      )}

      <input
        className={cn(
          BASE_INPUT_STYLE,
          {
            'border-red': error,
            'mb-[10px]': helperText || error,
          },
          className,
        )}
        id={inputId}
        {...props}
      />

      {error ? (
        <p className='text-red text-xs-regular xl:text-md-regular'>{error.message}</p>
      ) : (
        <p className='text-xs-regular xl:text-md-regular text-gray-600'>{helperText}</p>
      )}
    </div>
  );
};

export default Input;
