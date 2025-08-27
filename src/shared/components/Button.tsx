import { ComponentPropsWithoutRef } from 'react';

import { cn } from '../lib/cn';

interface Props extends ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'secondary' | 'tertiary';
}

const Button = ({ className, type = 'button', variant = 'primary', ...props }: Props) => {
  return (
    <button className={cn(BASE_STYLE, VARIANT_STYLE[variant], className)} type={type} {...props}>
      {props.children}
    </button>
  );
};

export default Button;

const VARIANT_STYLE = {
  primary:
    'transition-all ease-in-out duration-200 bg-main text-white disabled:bg-black-700 disabled:text-gray-600 hover:bg-red',
  secondary:
    'bg-transparent text-main border-1 border-main hover:border-red hover:text-red hover:bg-red/10',
  tertiary:
    'bg-transparent text-gray-600 border-1 border-gray-600 hover:border-gray-400 hover:text-gray-400 hover:bg-gray-400/10',
};

const BASE_STYLE =
  'xl:text-lg-semibold flex h-[50px] w-full max-w-[335px] cursor-pointer items-center justify-center rounded-md font-semibold whitespace-nowrap disabled:cursor-auto md:h-[55px] md:max-w-110 xl:h-[65px] xl:max-w-160';
