// 비교하기 페이지 입력창 컴포넌트
'use client';

import { useId } from 'react';

import Input, { type InputProps as BaseInputProps } from '@/shared/components/Input';

// 공용 Input의 InputProps를 BaseInputProps로 활용힙니다.
// 값 제어 관련 3가지(value, defaultValue, onChange)는 막아두고 query/onQueryChange로 대체합니다.(입력값과 선택값(Chip)을 잘 분리하기 위해)
type CompareInputFieldProps = Omit<BaseInputProps, 'value' | 'onChange' | 'defaultValue'> & {
  query: string; // 입력 중인 값
  onQueryChange: (next: string) => void; // 입력 변경 콜백
};

const CompareInputField = ({
  query,
  onQueryChange,
  placeholder = '콘텐츠를 입력해 주세요',
  ...rest
}: CompareInputFieldProps) => {
  // 접근성(ARIA/label 연결)을 높이기 위해 useId 사용
  const autoId = useId(); // 1) 외부 id 제공 여부 확인
  const { id: providedId, ...restProps } = rest;
  const resolvedId = providedId ?? autoId; // 외부 id 우선, 없으면 useId

  return (
    <Input
      id={resolvedId} // 2) label과 연결될 id 전달
      placeholder={placeholder}
      {...rest}
      value={query}
      onChange={(e) => onQueryChange(e.target.value)}
      role='combobox'
      aria-autocomplete='list'
      aria-expanded={false}
    ></Input>
  );
};

export default CompareInputField;
