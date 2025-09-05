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
import TextAreaWithCounter from '@/shared/components/textAreaWithCounter';
import { CATEGORIES, TEAM_ID } from '@/shared/constants/constants';

import NameDuplicateGuideInput from './NameDuplicateGuideInput';
import { useProductNameSearch } from '../hooks/useProductNameSearch';

/**
 * 상수 / 타입
 */
const NAME_MAX_LENGTH = 20;
const DESCRIPTION_MAX_LENGTH = 500;
const DESCRIPTION_MIN_LENGTH = 10;
const MAX_IMAGE_COUNT = 1;

type CategoryOption = { name: string; value: number };

/**
 * 프로젝트 Dropdown 시그니처와의 혼합 타입을 number로 수렴
 */
const toNumber = (value: unknown): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

/**
 * Zod 스키마
 * - blur 요구 사항: “필수/최대”는 일반 체인으로, “설명 10자 미만”은 superRefine로 분기 메시지 제공
 */
const schema = z.object({
  name: z
    .string()
    .trim()
    .min(1, '상품 이름은 필수 입력입니다.')
    .max(NAME_MAX_LENGTH, `최대 ${NAME_MAX_LENGTH}자까지 입력할 수 있습니다.`),

  categoryId: z.number().int().min(1, '카테고리를 선택해주세요.'),

  description: z
    .string()
    .trim()
    .min(1, '상품 설명은 필수 입력입니다.')
    .superRefine((value, ctx) => {
      if (value.length > 0 && value.length < DESCRIPTION_MIN_LENGTH) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '최소 10자 이상 적어주세요.',
        });
      }
    })
    .max(DESCRIPTION_MAX_LENGTH, `최대 ${DESCRIPTION_MAX_LENGTH}자까지 입력할 수 있습니다.`),

  images: z
    .array(z.instanceof(File))
    .min(1, '대표 이미지를 추가해주세요.')
    .max(MAX_IMAGE_COUNT, `대표 이미지는 ${MAX_IMAGE_COUNT}장만 업로드할 수 있습니다.`),
});

type ProductFormValues = z.infer<typeof schema>;

/**
 * Dropdown 어댑터
 * - 프로젝트 컴포넌트의 onChange 시그니처를 React Hook Form이 기대하는 number 값으로 맞춤
 */
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

/**
 * 상품 추가 모달
 * - React Hook Form + Zod로 blur/submit 검증을 일원화
 * - 이름 입력 시 서버에서 유사 이름을 안내(선택 불가)
 * - blur 시 완전 일치 → “이미 등록된 상품입니다.” 토스트
 * - 대표 이미지는 1장만 허용
 */
export default function AddContentModal({
  isOpen,
  onClose,
}: {
  /** 모달 오픈 여부 */
  isOpen: boolean;
  /** 닫기 콜백 */
  onClose: () => void;
}) {
  const router = useRouter();

  // React Hook Form: blur 모드 + zodResolver 적용
  const { control, handleSubmit, watch, setValue, reset, formState } = useForm<ProductFormValues>({
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

  // 모달이 열릴 때마다 초기화
  useEffect(() => {
    if (isOpen) {
      reset({ name: '', categoryId: 0, description: '', images: [] });
    }
  }, [isOpen, reset]);

  // 이미지 미리보기 URL 생성/해제(메모리 누수 방지)
  const imageFiles = watch('images') ?? [];
  const previewUrls = useMemo(
    () => imageFiles.map((file) => URL.createObjectURL(file)),
    [imageFiles],
  );
  useEffect(() => {
    return () => previewUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [previewUrls]);

  // blur 시 에러 토스트: Form이 잡은 에러를 즉시 노출
  useEffect(() => {
    if (touchedFields.name && errors.name?.message) toast.error(errors.name.message);
  }, [touchedFields.name, errors.name?.message]);
  useEffect(() => {
    if (touchedFields.description && errors.description?.message) {
      toast.error(errors.description.message);
    }
  }, [touchedFields.description, errors.description?.message]);

  /**
   * 이미지 선택 처리
   * - 1장만 허용
   * - 다중 드롭 시 첫 장만
   * - 동일 파일(이름/사이즈) 중복 방지
   */
  const handleImageChange = (newFiles: File[]): void => {
    const currentFiles = watch('images') ?? [];
    if (currentFiles.length >= MAX_IMAGE_COUNT) {
      toast.error('대표 이미지는 1장만 업로드할 수 있습니다.');
      return;
    }
    if (!newFiles || newFiles.length === 0) return;

    if (newFiles.length > 1) {
      toast.error('대표 이미지는 1장만 가능합니다. \n 첫 번째 파일만 등록합니다.');
    }
    const firstFile = newFiles[0];
    if (!firstFile) return;

    const isDuplicate = currentFiles.some(
      (file) => file.name === firstFile.name && file.size === firstFile.size,
    );

    if (isDuplicate) {
      toast.error('이미 선택한 파일입니다.');
      return;
    }

    setValue('images', [firstFile], {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  /** 제출 성공/실패 처리 */
  const onValid = async (_values: ProductFormValues): Promise<void> => {
    try {
      // TODO: 실제 생성 API 연동
      const productId = 1234;
      onClose();
      router.push(`/product/${productId}`);
    } catch {
      toast.error('상품 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  /** 제출 실패 시: 현재 폼 모든 에러를 중복 제거하여 토스트 */
  const onInvalid: SubmitErrorHandler<ProductFormValues> = (formErrors) => {
    const messages = Object.values(formErrors)
      .map((error) => error?.message)
      .filter(Boolean) as string[];
    Array.from(new Set(messages)).forEach((message) => toast.error(message));
  };

  /**
   * 파생 값 & 서버 검색
   * - Controller 바깥에서 훅 호출(렌더/훅 규칙 문제 회피)
   * - 1자 이상부터 디바운스 검색 → 사용자 경험/부하 절충
   */
  const nameValue = watch('name') ?? '';
  const descriptionValue = watch('description') ?? '';
  const categoryId = watch('categoryId') ?? 0;

  const { data: productNameCandidates = [], isLoading } = useProductNameSearch(
    TEAM_ID,
    nameValue,
    10,
  );

  /** 카테고리 옵션: 숫자 id 유지 */
  const categoryOptions: CategoryOption[] = useMemo(
    () => CATEGORIES.map((c) => ({ name: c.name, value: c.id })),
    [],
  );

  /** 버튼 활성화: 시각적 가드 + 실수 방지 */
  const isSubmitReady =
    nameValue.trim().length > 0 &&
    categoryId > 0 &&
    descriptionValue.trim().length >= DESCRIPTION_MIN_LENGTH &&
    imageFiles.length === MAX_IMAGE_COUNT &&
    !isSubmitting;

  return (
    <BaseModal title='상품 추가' isOpen={isOpen} onClose={onClose} size='L'>
      <form onSubmit={handleSubmit(onValid, onInvalid)} className='md:px-5 md:pb-5'>
        <h2 className='text-xl-semibold md:text-2xl-semibold mb-10'>상품 추가</h2>
        <div className='flex flex-col items-start gap-[10px] md:flex-row-reverse md:gap-[15px]'>
          {/* 대표 이미지 (1장만) */}
          <ImageUploader
            value={imageFiles}
            onChange={handleImageChange}
            onRemove={() =>
              setValue('images', [], {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
              })
            }
            previewUrls={previewUrls}
            maxImages={MAX_IMAGE_COUNT}
            className='w-[140px]'
          />

          {/* 이름 / 카테고리 */}
          <div className='flex w-full flex-col gap-[10px] md:max-w-90 md:gap-[15px]'>
            {/* 상품 이름: 안내 전용 자동완성 + blur 완전 일치 중복 에러 */}
            <Controller
              control={control}
              name='name'
              render={({ field }) => (
                <NameDuplicateGuideInput
                  value={field.value ?? ''}
                  onChange={(next) => field.onChange(next.slice(0, NAME_MAX_LENGTH))}
                  onBlur={field.onBlur}
                  names={productNameCandidates} // 서버에서 가져온 유사 이름들(선택 불가)
                  isLoading={isLoading}
                  maxLength={NAME_MAX_LENGTH}
                  aria-invalid={Boolean(errors.name)}
                  onDuplicate={() => toast.error('이미 등록된 상품입니다.')}
                />
              )}
            />

            {/* 카테고리 */}
            <CategoryDropdown
              value={categoryId}
              options={categoryOptions}
              onChange={(id: number) =>
                setValue('categoryId', id, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                })
              }
            />
          </div>
        </div>

        {/* 상품 설명 */}
        <div className='mt-[10px] md:mt-[15px]'>
          <Controller
            control={control}
            name='description'
            render={({ field }) => (
              <TextAreaWithCounter
                value={field.value ?? ''}
                onChange={(next: string) =>
                  field.onChange((next || '').slice(0, DESCRIPTION_MAX_LENGTH))
                }
                maxLength={DESCRIPTION_MAX_LENGTH}
                placeholder='상품 설명을 입력하세요 (최소 10자)'
                className='mt-1'
                aria-invalid={Boolean(errors.description)}
                onBlur={field.onBlur}
              />
            )}
          />
        </div>

        {/* 제출 버튼 */}
        <Button
          type='submit'
          variant='primary'
          className='mt-5 w-full max-w-none md:mt-10 md:max-w-none'
          disabled={!isSubmitReady}
        >
          {isSubmitting ? '등록 중…' : '상품 등록'}
        </Button>
      </form>
    </BaseModal>
  );
}
