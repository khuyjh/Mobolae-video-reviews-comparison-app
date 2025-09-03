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
    'bg-main-gradient text-black-900 disabled:bg-none disabled:bg-black-700 disabled:text-gray-600 disabled:hover:brightness-100 hover:brightness-120',
  secondary:
    'bg-transparent text-main-dark border-1 border-main-dark hover:border-main hover:text-main hover:bg-main/10',
  tertiary:
    'bg-transparent text-gray-600 border-1 border-gray-600 hover:border-gray-400 hover:text-gray-400 hover:bg-gray-400/10',
};

const BASE_STYLE =
  'transition-all ease-in-out duration-200 xl:text-lg-semibold flex h-[50px] w-full max-w-[335px] cursor-pointer items-center justify-center rounded-md font-semibold whitespace-nowrap disabled:cursor-auto md:h-[55px] md:max-w-110 xl:h-[65px] xl:max-w-160';
