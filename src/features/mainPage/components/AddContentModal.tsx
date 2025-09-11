'use client';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { Controller, SubmitErrorHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import BaseModal from '@/shared/components/BaseModal';
import Button from '@/shared/components/Button';
import Dropdown from '@/shared/components/Dropdown';
import ImageUploader from '@/shared/components/imageUploader';
import TextAreaWithCounter from '@/shared/components/textAreaWithCounter';
import { CATEGORIES, TEAM_ID, PATH_OPTION } from '@/shared/constants/constants';
import { normalizeForCompare } from '@/shared/utils/normalize';

import NameDuplicateGuideInput from './NameDuplicateGuideInput';
import { createProduct, imageUpload } from '../../../../openapi/requests';
import { useProductNameSearch } from '../hooks/useProductNameSearch';
import {
  productCreateSchema,
  NAME_MAX_LENGTH,
  DESCRIPTION_MAX_LENGTH,
  MAX_IMAGE_COUNT,
  type ProductFormValues,
} from '../services/productForm.schema';

/* ───────── 상수 / 타입 ───────── */

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
 * - 검증은 zod 스키마 한 곳에서만, UI는 결과만 반영
 * - 제목 onBlur에서만 토스트(빈값/중복)
 * - 설명 onBlur에서만 토스트(스키마 메시지)
 * - 버튼 활성화는 formState.isValid + 라이브중복만
 */
const AddContentModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState,
    setError,
    clearErrors,
    trigger,
    getFieldState,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productCreateSchema),
    mode: 'onChange', // ← isValid 즉시 반영
    reValidateMode: 'onChange',
    defaultValues: { name: '', categoryId: 0, description: '', images: [] },
  });

  const { errors, isSubmitting, touchedFields, isValid } = formState;

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
    TEAM_ID as string,
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

  /* 제목 onBlur: zod 에러 메시지 or 라이브 중복만 토스트 */
  const handleNameBlur = async (): Promise<void> => {
    await trigger('name');
    const msg = getFieldState('name').error?.message;
    if (msg) {
      toast.error(msg);
      return;
    }
    if (liveNameDuplicate) {
      setError('name', { type: 'duplicate', message: '이미 등록된 콘텐츠입니다.' });
      toast.error('이미 등록된 콘텐츠입니다.');
      return;
    }
    if (errors.name) clearErrors('name');
  };

  /* 설명: blur 시 스키마 에러 메시지만 토스트 */
  // 🔥 기존 useEffect 제거 → 중복 토스트 방지, onBlur에서만 처리

  /* 버튼 활성화는 스키마 판정 + 라이브중복만 반영 */
  const isSubmitReady = isValid && !liveNameDuplicate && !isSubmitting;

  /* 제출 */
  const onValid = async (_values: ProductFormValues): Promise<void> => {
    // 🔥 liveNameDuplicate 중복 검사 제거 (onBlur에서 이미 처리됨)

    const file = imageFiles?.[0];
    if (!file) {
      setError('images', { type: 'custom', message: '대표 이미지를 추가해주세요.' });
      return;
    }

    try {
      // 1) 이미지 업로드
      const uploadRes = await imageUpload({
        ...PATH_OPTION,
        body: { image: file },
        throwOnError: true,
      });
      const imageUrl = uploadRes.data.url;

      // 2) 생성
      const createRes = await createProduct({
        ...PATH_OPTION,
        body: {
          name: nameValue.trim(),
          categoryId,
          description: descriptionValue.trim(),
          image: imageUrl,
        },
        throwOnError: true,
      });
      const productId = createRes.data.id;

      if (!productId) throw new Error('생성 응답에 콘텐츠 ID가 없습니다.');
      toast.success('콘텐츠가 등록되었습니다.');
      onClose();
      router.push(`/products/${productId}`);
    } catch (e) {
      console.error(e);
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
    <BaseModal
      title='콘텐츠 추가'
      isOpen={isOpen}
      onClose={onClose}
      size='L'
      closeOnOutsideClick={false}
    >
      <form onSubmit={handleSubmit(onValid, onInvalid)} className='md:px-5 md:pb-5'>
        <h2 className='text-xl-semibold md:text-2xl-semibold mb-10'>콘텐츠 추가</h2>

        <div className='flex flex-col items-start justify-between gap-[10px] md:flex-row-reverse md:gap-[15px]'>
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
            className='w-1/2'
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
                  onBlur={async () => {
                    field.onBlur();
                    await handleNameBlur();
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
                placeholder='감독, 출연진, 줄거리 등을 입력해 주세요.'
                className='[&>textarea]:text-md-regular md:[&>textarea]:text-base-regular mt-1 [&>textarea]:pl-5'
                aria-invalid={Boolean(errors.description)}
                onBlur={async () => {
                  field.onBlur();
                  await trigger('description');
                  const msg = getFieldState('description').error?.message;
                  if (msg) toast.error(msg);
                }}
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
};

export default AddContentModal;
