// 비교하기 버튼 (입력창 2개 selected시 활성화)
'use client';

import { cn } from '@/shared/lib/cn';
import { useCompareStore } from '@/shared/stores/useCompareStore';

type CompareButtonProps = {
  className?: string;
  /** 부모에서 강제로 비활성화할 수 있는 플래그 (선택) */
  disabled?: boolean;
  /** 레이블 커스텀 (기본: "비교하기") */
  label?: string;
};

/**
 * CompareButton
 * - 활성화 판정은 스토어의 파생 셀렉터(canCompare)로 통일
 *   -> a/b가 모두 선택되고, 서로 다른 항목일 때만 true
 * - 부모 disabledProp이 true면 무조건 비활성
 * - 클릭 시 store.requestCompare() 호출(스토어 내부에서도 재검증)
 */

const CompareButton = ({
  disabled: disabledProp,
  className,
  label = '비교하기',
}: CompareButtonProps) => {
  // 개별 selector로 원시값만 구독(객체 리턴 금지)
  const canCompare = useCompareStore((s) => s.canCompare());
  const requestCompare = useCompareStore((s) => s.requestCompare);

  //  실제 활성화 여부: 스토어 판정 && 부모 강제 비활성 아님
  const enabled = canCompare && !disabledProp;

  const handleClick = () => {
    // button[disabled]면 브라우저가 클릭 자체를 막지만 확실하게 막기 위한 용도
    if (!enabled) return;
    requestCompare();
  };

  return (
    <button
      type='button'
      onClick={handleClick}
      disabled={!enabled} // 비활성화 상태 실제 클릭 방지
      className={cn(
        // 레이아웃- 그리드 정렬 같은 건 부모에서 넣도록 className으로 받습니다
        // 이 부분은 스타일 구분을 위해 상수화 하지 않았습니다. 추후 수정 가능
        // 기본 스타일값
        'rounded-lg leading-none font-semibold transition-colors',
        'focus-visible:ring-main focus-visible:ring-2 focus-visible:outline-none',
        // 크기
        'h-[50px] md:h-[60px] xl:h-[70px]',
        'w-full max-w-none md:w-[164px] md:max-w-none xl:w-[200px]',
        // 상태
        enabled
          ? 'text-black-900 bg-main-gradient cursor-pointer hover:brightness-120 active:scale-[0.99]'
          : 'bg-black-800 text-gray-600 disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
    >
      {label}
    </button>
  );
};

export default CompareButton;
