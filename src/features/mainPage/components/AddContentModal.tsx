'use client';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { Controller, SubmitErrorHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

import BaseModal from '@/shared/components/BaseModal';
import Button from '@/shared/components/Button';
import Dropdown from '@/shared/components/Dropdown';
import ImageUploader from '@/shared/components/imageUploader';
import TextAreaWithCounter from '@/shared/components/textAreaWithCounter';
import { CATEGORIES, TEAM_ID } from '@/shared/constants/constants';
import { normalizeForCompare } from '@/shared/utils/normalize';

import NameDuplicateGuideInput from './NameDuplicateGuideInput';
import { useProductNameSearch } from '../hooks/useProductNameSearch';

/* ───────── 상수 / 타입 ───────── */

const NAME_MAX_LENGTH = 20;
const DESCRIPTION_MAX_LENGTH = 500;
const DESCRIPTION_MIN_LENGTH = 10;
const MAX_IMAGE_COUNT = 1;

type CategoryOption = { name: string; value: number };

/** Dropdown 값을 number로 수렴 */
const toNumber = (value: unknown): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const n = Number(value);
    return Number.isNaN(n) ? 0 : n;
  }
  return 0;
};

/* Zod 스키마 (기본 필수/길이만 담당; 중복 검사는 onBlur에서 처리) */
const schema = z.object({
  name: z
    .string()
    .trim()
    .min(1, '콘텐츠 제목은 필수 입력입니다.')
    .max(NAME_MAX_LENGTH, `최대 ${NAME_MAX_LENGTH}자까지 입력할 수 있습니다.`),

  categoryId: z.number().int().min(1, '카테고리를 선택해주세요.'),

  description: z
    .string()
    .trim()
    .min(1, '콘텐츠 설명은 필수 입력입니다.')
    .superRefine((v, ctx) => {
      if (v.length > 0 && v.length < DESCRIPTION_MIN_LENGTH) {
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

/* Dropdown 어댑터 */
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

/* ───────── 콘텐츠 추가 모달 ─────────
 * - 제목 onBlur 한 곳에서만: 빈값/중복 판정 + 토스트 1회
 * - 버튼 비활성화는 "라이브 중복"도 반영(토스트는 onBlur만)
 * - 설명 blur 시 에러 토스트(필수/10자 미만) 재도입
 * - 제출 시엔 조용히 가드(토스트 X)
 */
export default function AddContentModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();

  const { control, handleSubmit, watch, setValue, reset, formState, setError, clearErrors } =
    useForm<ProductFormValues>({
      resolver: zodResolver(schema),
      mode: 'onBlur',
      defaultValues: { name: '', categoryId: 0, description: '', images: [] },
    });

  const { errors, isSubmitting, touchedFields } = formState;

  /* 열릴 때 폼 초기화 */
  useEffect(() => {
    if (isOpen) {
      reset({ name: '', categoryId: 0, description: '', images: [] });
    }
  }, [isOpen, reset]);

  /* 미리보기 URL 생성/해제 */
  const imageFiles = watch('images') ?? [];
  const previewUrls = useMemo(() => imageFiles.map((f) => URL.createObjectURL(f)), [imageFiles]);
  useEffect(() => () => previewUrls.forEach((u) => URL.revokeObjectURL(u)), [previewUrls]);

  /* 이미지 선택 (1장만, 중복 파일 방지) */
  const handleImageChange = (newFiles: File[]): void => {
    const current = watch('images') ?? [];

    if (current.length >= MAX_IMAGE_COUNT) {
      toast.error('대표 이미지는 1장만 업로드할 수 있습니다.');
      return;
    }

    if (!newFiles?.length) return;

    if (newFiles.length > 1) {
      toast.error('대표 이미지는 1장만 가능합니다. \n 첫 번째 파일만 등록합니다.');
    }

    const file = newFiles[0];
    if (!file) return;

    const dup = current.some((f) => f.name === file.name && f.size === file.size);
    if (dup) {
      toast.error('이미 선택한 파일입니다.');
      return;
    }

    setValue('images', [file], {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  /* 파생 값 & 서버 검색 */
  const nameValue = watch('name') ?? '';
  const descriptionValue = watch('description') ?? '';
  const categoryId = watch('categoryId') ?? 0;

  const { data: productNameCandidates = [], isLoading } = useProductNameSearch(
    TEAM_ID,
    nameValue,
    10,
  );

  /* 후보를 정규화 Set으로 보관(중복 판정용) */
  const normalizedCandidates = useMemo(
    () => new Set(productNameCandidates.map((n) => normalizeForCompare(n))),
    [productNameCandidates],
  );

  /* 현재 입력이 "라이브" 중복인지 (토스트는 onBlur에서만, 버튼 비활성화만 여기서) */
  const liveNameDuplicate = useMemo(() => {
    const norm = normalizeForCompare(nameValue.trim());
    return norm !== '' && normalizedCandidates.has(norm);
  }, [nameValue, normalizedCandidates]);

  /* onBlur에서만 토스트 + 에러 설정(빈값/중복) */
  const handleNameBlur = (): void => {
    const trimmed = nameValue.trim();

    if (trimmed === '') {
      setError('name', {
        type: 'required',
        message: '콘텐츠 제목은 필수 입력입니다.',
      });
      toast.error('콘텐츠 제목은 필수 입력입니다.');
      return;
    }

    if (liveNameDuplicate) {
      setError('name', {
        type: 'duplicate',
        message: '이미 등록된 콘텐츠입니다.',
      });
      toast.error('이미 등록된 콘텐츠입니다.');
      return;
    }

    if (errors.name) {
      clearErrors('name');
    }
  };

  /* 설명: blur 시 에러 토스트(필수/10자 미만) */
  useEffect(() => {
    if (touchedFields.description && errors.description?.message) {
      toast.error(errors.description.message);
    }
  }, [touchedFields.description, errors.description?.message]);

  /* 버튼 활성화: name 에러 또는 "라이브 중복"이면 비활성화 */
  const isSubmitReady =
    nameValue.trim().length > 0 &&
    categoryId > 0 &&
    descriptionValue.trim().length >= DESCRIPTION_MIN_LENGTH &&
    imageFiles.length === MAX_IMAGE_COUNT &&
    !isSubmitting &&
    !errors.name &&
    !liveNameDuplicate;

  /* 제출: blur 없이 바로 눌러도 조용히 가드(토스트 X) */
  const onValid = async (_values: ProductFormValues): Promise<void> => {
    const trimmed = nameValue.trim();

    if (trimmed === '') {
      setError('name', {
        type: 'required',
        message: '콘텐츠 제목은 필수 입력입니다.',
      });
      return;
    }

    if (liveNameDuplicate) {
      setError('name', {
        type: 'duplicate',
        message: '이미 등록된 콘텐츠입니다.',
      });
      return;
    }

    try {
      // TODO: 실제 생성 API 연동
      const productId = 1234;
      onClose();
      router.push(`/product/${productId}`);
    } catch {
      toast.error('콘텐츠 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  /* 제출 실패: 모든 에러 메시지 합쳐서 토스트 */
  const onInvalid: SubmitErrorHandler<ProductFormValues> = (formErrors) => {
    const messages = Object.values(formErrors)
      .map((e) => e?.message)
      .filter(Boolean) as string[];

    Array.from(new Set(messages)).forEach((m) => toast.error(m));
  };

  /* 카테고리 옵션 */
  const categoryOptions: CategoryOption[] = useMemo(
    () => CATEGORIES.map((c) => ({ name: c.name, value: c.id })),
    [],
  );

  return (
    <BaseModal title='콘텐츠 추가' isOpen={isOpen} onClose={onClose} size='L'>
      <form onSubmit={handleSubmit(onValid, onInvalid)} className='md:px-5 md:pb-5'>
        <h2 className='text-xl-semibold md:text-2xl-semibold mb-10'>콘텐츠 추가</h2>

        <div className='flex flex-col items-start justify-end gap-[10px] md:flex-row-reverse md:gap-[15px]'>
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

          {/* 제목 / 카테고리 */}
          <div className='flex w-full flex-col gap-[10px] md:max-w-90 md:gap-[15px]'>
            {/* 제목: 표시 전용(자식), 판정/토스트는 부모 onBlur */}
            <Controller
              control={control}
              name='name'
              render={({ field }) => (
                <NameDuplicateGuideInput
                  value={field.value ?? ''}
                  onChange={(next) => field.onChange(next.slice(0, NAME_MAX_LENGTH))}
                  onBlur={() => {
                    field.onBlur();
                    handleNameBlur();
                  }}
                  names={productNameCandidates}
                  isLoading={isLoading}
                  maxLength={NAME_MAX_LENGTH}
                  aria-invalid={Boolean(errors.name) || liveNameDuplicate}
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

        {/* 설명 */}
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
                placeholder='콘텐츠 설명을 입력하세요 (최소 10자)'
                className='mt-1'
                aria-invalid={Boolean(errors.description)}
                onBlur={field.onBlur}
              />
            )}
          />
        </div>

        {/* 제출 */}
        <Button
          type='submit'
          variant='primary'
          className='mt-5 w-full max-w-none md:mt-10 md:max-w-none'
          disabled={!isSubmitReady}
        >
          {isSubmitting ? '등록 중…' : '콘텐츠 등록'}
        </Button>
      </form>
    </BaseModal>
  );
}
