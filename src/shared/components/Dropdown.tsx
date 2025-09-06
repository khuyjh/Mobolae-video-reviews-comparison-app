// 공용 단일 선택형 드롭다운 ui
'use client';

import { useRef, useState } from 'react';

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
  className?: string; // 드롭다운 컨테이너 커스텀 스타일 props
  triggerClassName?: string; // 트리거 부분 커스텀 스타일 props
  contentClassName?: string; // 내려오는 패널 부분 커스텀 스타일 props
}

// 드롭다운 내부 css값
const SELECTTRIGGER_STYLE =
  'border border-black-700 bg-black-800 !h-auto w-full rounded-lg px-[20px] py-[17px] text-gray-600 text-sm xl:text-base outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-main)] cursor-pointer data-[placeholder]:text-gray-500 md:py-[19px] xl:py-[23px] [&_svg]:text-gray-400 [&_svg]:!opacity-100 [&_svg]:transition-colors data-[state=open]:[&_svg]:text-white data-[state=open]:[&_svg]:!opacity-100 [&>svg]:transition-transform data-[state=open]:[&>svg]:rotate-180';
const SELECTCONTENT_STYLE =
  'bg-black-800 border-black-700 box-border w-[--radix-select-trigger-width] border p-0 [&_[data-radix-select-viewport]]:gap-[10px] [&_[data-radix-select-viewport]]:p-2';
const SELECTITEM_STYLE =
  'mt-[5px] first:mt-0 data-[highlighted]:bg-black-700 data-[state=checked]:bg-black-700 rounded-md !px-[20px] !py-[6px] text-gray-600 text-sm xl:text-base data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[highlighted]:text-white data-[state=checked]:text-white';

const Dropdown = ({
  initialValue,
  onChange,
  placeholder,
  options,
  className,
  triggerClassName,
  contentClassName,
}: SelectDropdownProps) => {
  // 내부 상태는 문자열로 보관 (Radix 규칙)
  const [value, setValue] = useState<string | undefined>(
    initialValue ? String(initialValue.value) : undefined,
  );

  //  Trigger에 대한 ref (닫힐 때 blur 위해 필요)
  const triggerRef = useRef<HTMLButtonElement>(null);

  //  포인터로 닫혔는지 추적하는 플래그
  const lastByPointerRef = useRef(false);

  return (
    <div className={cn('w-full max-w-[355px] md:w-[360px] xl:max-w-[400px]', className)}>
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
        <SelectTrigger
          ref={triggerRef}
          className={cn('w-full', SELECTTRIGGER_STYLE, triggerClassName)}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent
          sideOffset={4}
          collisionPadding={0}
          className={cn(SELECTCONTENT_STYLE, 'w-[--radix-select-trigger-width]', contentClassName)}
          onPointerDown={() => {
            lastByPointerRef.current = true;
          }}
          // ✅ 콘텐츠 외부를 클릭해서 닫히는 경우 → 포인터 상호작용 표시
          onPointerDownOutside={() => {
            lastByPointerRef.current = true;
          }}
          // ✅ 닫힐 때 Radix가 기본적으로 Trigger로 포커스를 되돌리는데,
          // 포인터 상호작용으로 닫힌 경우에는 이를 막고 Trigger를 blur 처리하여 링 제거
          onCloseAutoFocus={(e) => {
            if (lastByPointerRef.current) {
              e.preventDefault(); // Trigger로의 자동 포커스 복귀 방지
              lastByPointerRef.current = false;
              // 다음 틱에 blur (안전)
              requestAnimationFrame(() => triggerRef.current?.blur());
            }
            // 키보드로 닫힌 경우(Escape/Enter)에는 기본 포커스 복귀를 유지 → 접근성 OK
          }}
        >
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
