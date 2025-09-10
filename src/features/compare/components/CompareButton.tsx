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
  /** 클릭 시도 결과를 부모(page)로 알려주는 콜백 */
  onResult?: (ok: boolean, reason: string | null) => void;
};

/**
 * CompareButton
 * - 활성화 판정은 스토어의 파생 셀렉터(canCompare)로 통일
 * - 클릭 시 store.requestCompare() 호출(스토어 내부에서도 재검증)
 * - 결과를 onResult로 부모에게 알림 → 부모가 토스트 처리
 */

const CompareButton = ({
  disabled: disabledProp,
  className,
  label = '비교하기',
  onResult,
}: CompareButtonProps) => {
  const canCompare = useCompareStore((s) => s.canCompare());
  const requestCompare = useCompareStore((s) => s.requestCompare);

  // 문자열로 구독하면 클릭 전 계산값일 수 있어서 함수로 구독
  const invalidReasonFn = useCompareStore((s) => s.invalidReason);
  //  실제 활성화 여부: 스토어 판정 && 부모 강제 비활성 아님
  const enabled = canCompare && !disabledProp;

  const handleClick = () => {
    if (!enabled) return;
    // 최종 검증 결과(불린)를 받아서 부모에게 전달
    const ok = requestCompare();
    if (onResult) {
      const reason = ok ? null : invalidReasonFn();
      onResult(ok, reason);
    }
  };

  return (
    <button
      type='button'
      onClick={handleClick}
      disabled={!enabled} // 비활성화 상태 실제 클릭 방지
      aria-disabled={!enabled}
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
