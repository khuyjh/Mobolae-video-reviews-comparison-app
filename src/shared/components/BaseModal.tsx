import { DialogTitle } from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';
import { ReactNode } from 'react';

import { Dialog, DialogContent } from './ui/dialog';
import { cn } from '../lib/cn';

/*
title: 해당 모달이 무엇인지 알려주는 aria-label의 역할을 합니다.
shadcn의 규칙에 따라서 title을 반드시 포함하고, sr-only처리를 해서 ui에는 표시되지 않도록 합니다.

closeOnOutsideClick: 모달 밖 overlay를 눌렀을 때, 모달이 닫히는 동작을 허용할 것인지 정합니다.

onClose: 모달 밖 overlay를 눌렀을 때, 또는 x버튼을 눌렀을 때 닫히도록 isOpen을 제어하는 함수를 넘겨줍니다.
 */
interface BaseModalProps {
  children: ReactNode;
  className?: string;
  size?: 'M' | 'L';
  title: string;
  isOpen: boolean;
  closeOnOutsideClick?: boolean;
  onClose: () => void;
}

const SIZE_STYLE = {
  M: 'md:max-w-125',
  L: 'md:max-w-[590px] xl:max-w-155',
};

const CLOSE_BUTTON_STYLE =
  "flex justify-end transition-opacity hover:opacity-70 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-6 md:[&_svg:not([class*='size-'])]:size-9 xl:[&_svg:not([class*='size-h'])]:size-10";

const BaseModal = ({
  children,
  className,
  size = 'M',
  title,
  isOpen,
  closeOnOutsideClick = true,
  onClose,
}: BaseModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={closeOnOutsideClick ? onClose : undefined}>
      <DialogContent className={cn('bg-black-900 text-white', SIZE_STYLE[size], className)}>
        <DialogTitle className='sr-only'>{title}</DialogTitle>
        <button type='button' className={CLOSE_BUTTON_STYLE} onClick={onClose}>
          <XIcon className='text-white' />
          <span className='sr-only'>Close</span>
        </button>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default BaseModal;
