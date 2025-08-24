// 공용 단일 선택형 드롭다운 ui
'use client';

import { useState } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { cn } from '@/shared/lib/cn';

interface Option {
  name: string;
  value: string | number | boolean;
}

interface SelectDropdownProps {
  initialValue?: Option;
  onChange: (value: string | number | boolean) => void;
  placeholder?: string;
  options: Option[];
}

// 드롭다운 내부 css값
const SELECTTRIGGER_STYLE =
  'border border-black-700 bg-black-800 !h-auto w-full rounded-lg border px-[20px] py-[17px] text-gray-600 text-sm xl:text-base outline-none focus:ring-0 focus-visible:ring-0 data-[placeholder]:text-gray-500 md:py-[19px] xl:py-[23px] [&_svg]:text-gray-400 [&_svg]:!opacity-100 [&_svg]:transition-colors data-[state=open]:[&_svg]:text-white data-[state=open]:[&_svg]:!opacity-100 [&>svg]:transition-transform data-[state=open]:[&>svg]:rotate-180 data-[state=open]:ring-2 data-[state=open]:ring-gray-400 data-[state=open]:ring-offset-0';
const SELECTCONTENT_STYLE =
  'bg-black-800 border-black-700 box-border w-[--radix-select-trigger-width] border p-0 [&_[data-radix-select-viewport]]:gap-[10px] [&_[data-radix-select-viewport]]:p-2';
const SELECTITEM_STYLE =
  'mt-[5px] first:mt-0 data-[highlighted]:bg-black-700 data-[state=checked]:bg-black-700 rounded-md !px-[20px] !py-[6px] text-gray-600 text-sm xl:text-base data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[highlighted]:text-white data-[state=checked]:text-white';

const Dropdown = ({ initialValue, onChange, placeholder, options }: SelectDropdownProps) => {
  // 내부 상태는 문자열로 보관 (Radix 규칙)
  const [value, setValue] = useState<string | undefined>(
    initialValue ? String(initialValue.value) : undefined,
  );

  return (
    <div className='w-[355px] md:w-[360px] xl:w-[400px]'>
      <Select
        value={value}
        onValueChange={(v) => {
          setValue(v);
          // 원래 타입으로 돌려주고 싶다면 숫자/불리언 캐스팅
          const opt = options.find((o) => String(o.value) === v);
          if (!opt) return;
          const raw = opt.value;
          onChange(raw); // 필요하면 여기서 Number/Boolean 변환
        }}
      >
        <SelectTrigger className={cn(SELECTTRIGGER_STYLE)}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent sideOffset={4} collisionPadding={0} className={cn(SELECTCONTENT_STYLE)}>
          {options.map((c) => (
            <SelectItem
              key={String(c.value)}
              value={String(c.value)}
              className={cn(SELECTITEM_STYLE)}
            >
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default Dropdown;
// TODO 팀 폰트 클래스 적용시 shadcn 기본 색상 설정이 이기는 문제에 대해 알아보기, 팀 폰트 클래스로 변경 시도해보기
