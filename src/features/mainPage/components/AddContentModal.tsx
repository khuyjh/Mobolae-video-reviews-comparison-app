// src/features/mainPage/components/AddContentModal.tsx
'use client';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { useForm, Controller, SubmitErrorHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

import BaseModal from '@/shared/components/BaseModal';
import Button from '@/shared/components/Button';
import Dropdown from '@/shared/components/Dropdown';
import ImageUploader from '@/shared/components/imageUploader';
import Input from '@/shared/components/Input';
import TextAreaWithCounter from '@/shared/components/textAreaWithCounter';
import { CATEGORIES } from '@/shared/constants/constants';

/** --------------------------------
 * 더미 API (실서비스 API로 교체)
 * -------------------------------- */
async function checkDuplicateProductName(name: string): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 120));
  // TODO: 실제 중복 검사 API 연동
  return false;
}
async function createProduct(values: ProductFormValues): Promise<{ productId: number }> {
  await new Promise((r) => setTimeout(r, 600));
  return { productId: 1234 };
}

/** --------------------------------
 * 상수/타입/유틸
 * -------------------------------- */
const NAME_MAX = 20;
const DESCRIPTION_MAX = 500;
const DESCRIPTION_MIN = 10;
/** 대표 이미지는 1장만 허용 */
const MAX_IMAGES = 1;

type CategoryOption = { name: string; value: number };

/** 안전 숫자 변환 (Dropdown onChange 시 string/number/boolean 혼용 대비) */
const toNumber = (v: unknown): number => {
  if (typeof v === 'number') return v;
  if (typeof v === 'string') {
    const n = Number(v);
    return Number.isNaN(n) ? 0 : n;
  }
  return 0;
};

/** --------------------------------
 * zod 스키마
 * - blur 요구사항: 설명의 "필수" / "10자 미만" 메시지 분리 노출
 *   - .min(1) → "상품 설명은 필수 입력입니다."
 *   - superRefine → 비어있지 않을 때 10자 미만이면 "최소 10자 이상 적어주세요."
 * -------------------------------- */
const schema = z.object({
  name: z
    .string()
    .trim()
    .min(1, '상품 이름은 필수 입력입니다.')
    .max(NAME_MAX, `최대 ${NAME_MAX}자까지 입력할 수 있습니다.`),

  categoryId: z.number().int().min(1, '카테고리를 선택해주세요.'),

  description: z
    .string()
    .trim()
    .min(1, '상품 설명은 필수 입력입니다.')
    .superRefine((v, ctx) => {
      if (v.length > 0 && v.length < DESCRIPTION_MIN) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '최소 10자 이상 적어주세요.',
        });
      }
    })
    .max(DESCRIPTION_MAX, `최대 ${DESCRIPTION_MAX}자까지 입력할 수 있습니다.`),

  images: z
    .array(z.instanceof(File))
    .min(1, '대표 이미지를 추가해주세요.')
    .max(MAX_IMAGES, `대표 이미지는 ${MAX_IMAGES}장만 업로드할 수 있습니다.`),
});

type ProductFormValues = z.infer<typeof schema>;

/** --------------------------------
 * Dropdown 타입 어댑터
 * - 프로젝트 Dropdown의 onChange 시그니처 (string|number|boolean)에 맞춰 변환
 * -------------------------------- */
function CategoryDropdown({
  value,
  options,
  onChange,
}: {
  value: number;
  options: CategoryOption[];
  onChange: (id: number) => void;
}) {
  return (
    <Dropdown
      initialValue={value > 0 ? options.find((o) => o.value === value) : undefined}
      options={options}
      placeholder='카테고리 선택'
      onChange={(val: string | number | boolean) => onChange(toNumber(val))}
      className='w-full max-w-none'
      triggerClassName='w-full'
    />
  );
}

/** --------------------------------
 * 컴포넌트
 * -------------------------------- */
export default function AddContentModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();

  /**
   * RHF 설정
   * - mode: 'onBlur' → blur 시 필드 검증 (요구사항과 일치)
   * - zodResolver(schema) → blur/submit 모두 동일 규칙 적용
   */
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState, // errors, isSubmitting, touchedFields 사용
  } = useForm<ProductFormValues>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      categoryId: 0,
      description: '',
      images: [],
    },
  });

  const { errors, isSubmitting, touchedFields } = formState;

  /** 모달 오픈 시 폼 초기화 */
  useEffect(() => {
    if (isOpen) {
      reset({ name: '', categoryId: 0, description: '', images: [] });
    }
  }, [isOpen, reset]);

  /** 이미지 프리뷰 URL 생성/해제 */
  const images = watch('images') ?? [];
  const previewUrls = useMemo(() => images.map((f) => URL.createObjectURL(f)), [images]);
  useEffect(() => {
    return () => previewUrls.forEach((u) => URL.revokeObjectURL(u));
  }, [previewUrls]);

  /**
   * blur 시 에러 토스트
   * - touchedFields를 함께 조건으로 걸어 blur 상황에서만 토스트 출력
   * - submit 실패 시에는 onInvalid에서 일괄 토스트
   */
  useEffect(() => {
    if (touchedFields.name && errors.name?.message) toast.error(errors.name.message);
  }, [touchedFields.name, errors.name?.message]);
  useEffect(() => {
    if (touchedFields.description && errors.description?.message) {
      toast.error(errors.description.message);
    }
  }, [touchedFields.description, errors.description?.message]);

  /** 이름 blur에서 중복 검사 (스키마 필수/길이와 별개로 추가 검증) */
  const handleNameBlur = async (): Promise<void> => {
    const name = (watch('name') ?? '').trim();
    if (!name) return; // "상품 이름은 필수 입력입니다."는 위 useEffect에서 이미 토스트
    const duplicated = await checkDuplicateProductName(name);
    if (duplicated) toast.error('이미 등록된 상품입니다.');
  };

  /** 이미지 onChange (1장만 허용 + 다중 드롭/중복 방지) */
  const handleImageChange = (newFiles: File[]): void => {
    const current = watch('images') ?? [];
    if (current.length >= MAX_IMAGES) {
      toast.error('대표 이미지는 1장만 업로드할 수 있습니다.');
      return;
    }
    if (!newFiles || newFiles.length === 0) return;

    if (newFiles.length > 1) {
      toast.error('대표 이미지는 1장만 가능합니다. \n 첫 번째 파일만 등록합니다.');
    }
    const first = newFiles[0];
    if (!first) return;

    const dup = current.some((f) => f.name === first.name && f.size === first.size);
    if (dup) {
      toast.error('이미 선택한 파일입니다.');
      return;
    }

    setValue('images', [first], { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  };

  /** 제출 성공/실패 핸들러 */
  const onValid = async (values: ProductFormValues): Promise<void> => {
    try {
      const { productId } = await createProduct({
        ...values,
        name: values.name.trim(),
        description: values.description.trim(),
      });
      onClose();
      router.push(`/product/${productId}`);
    } catch {
      toast.error('상품 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  const onInvalid: SubmitErrorHandler<ProductFormValues> = (formErrors) => {
    const msgs = Object.values(formErrors)
      .map((e) => e?.message)
      .filter(Boolean) as string[];
    Array.from(new Set(msgs)).forEach((m) => toast.error(m)); // 중복 제거 후 토스트
  };

  /** 파생 값 (버튼 활성화 가드) */
  const nameVal = watch('name') ?? '';
  const descVal = watch('description') ?? '';
  const categoryId = watch('categoryId') ?? 0;

  const categoryOptions: CategoryOption[] = useMemo(
    () => CATEGORIES.map((c) => ({ name: c.name, value: c.id })),
    [],
  );

  const isReady =
    nameVal.trim().length > 0 &&
    categoryId > 0 &&
    descVal.trim().length >= DESCRIPTION_MIN &&
    images.length === MAX_IMAGES &&
    !isSubmitting;

  return (
    <BaseModal title='상품 추가' isOpen={isOpen} onClose={onClose} size='L'>
      <form onSubmit={handleSubmit(onValid, onInvalid)} className='md:px-5 md:pb-5'>
        <h2 className='text-xl-semibold md:text-2xl-semibold mb-10'>상품 추가</h2>

        <div className='flex flex-col items-center gap-[10px] md:flex-row-reverse md:gap-[15px]'>
          {/* 대표 이미지 (1장만) */}
          <ImageUploader
            value={images}
            onChange={handleImageChange}
            onRemove={() =>
              setValue('images', [], { shouldDirty: true, shouldTouch: true, shouldValidate: true })
            }
            previewUrls={previewUrls}
            showAddButton={images.length < MAX_IMAGES}
            className='w-[140px]'
          />

          {/* 이름 / 카테고리 */}
          <div className='flex w-full flex-col gap-[10px] md:max-w-90 md:gap-[15px]'>
            {/* 상품 이름: 20자 초과 차단 + blur 필수/중복 검사 + 글자수 카운터 */}
            <Controller
              control={control}
              name='name'
              render={({ field }) => (
                <div className='relative'>
                  <Input
                    id='product-name'
                    maxLength={NAME_MAX}
                    className='pr-10' // 내부 오른쪽에 공간 확보
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange((e.target.value || '').slice(0, NAME_MAX))}
                    onBlur={async () => {
                      field.onBlur();
                      await handleNameBlur();
                    }}
                  />
                  <span className='pointer-events-none absolute right-3 bottom-1/2 translate-y-1/2 text-xs text-gray-600'>
                    {(field.value ?? '').length}/{NAME_MAX}
                  </span>
                </div>
              )}
            />

            {/* 카테고리: 어댑터로 타입을 맞춰 안전하게 값만 number로 세팅 */}
            <CategoryDropdown
              value={categoryId}
              options={categoryOptions}
              onChange={(id) =>
                setValue('categoryId', id, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                })
              }
            />
          </div>
        </div>

        {/* 상품 설명: 500자 초과 차단 + onBlur 직접 연결 (RHF) */}
        <div className='mt-[10px] md:mt-[15px]'>
          <Controller
            control={control}
            name='description'
            render={({ field }) => (
              <TextAreaWithCounter
                value={field.value ?? ''}
                onChange={(v) => field.onChange((v || '').slice(0, DESCRIPTION_MAX))} // 초과 차단
                onBlur={field.onBlur} // RHF blur → 스키마 검증 (빈 값/10자 미만 메시지 분리)
                maxLength={DESCRIPTION_MAX}
                placeholder='상품 설명을 입력하세요 (최소 10자)'
                className='mt-1'
                aria-invalid={Boolean(errors.description)}
              />
            )}
          />
        </div>

        {/* 제출 */}
        <Button
          type='submit'
          variant='primary'
          className='mt-5 w-full max-w-none md:mt-10 md:max-w-none'
          disabled={!isReady}
        >
          {isSubmitting ? '등록 중…' : '상품 등록'}
        </Button>
      </form>
    </BaseModal>
  );
}
