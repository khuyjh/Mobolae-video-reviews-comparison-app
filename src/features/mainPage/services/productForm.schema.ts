// productForm.schema.ts
import { z } from 'zod';

export const NAME_MAX_LENGTH = 20;
export const DESCRIPTION_MAX_LENGTH = 500;
export const DESCRIPTION_MIN_LENGTH = 10;
export const MAX_IMAGE_COUNT = 1;

export const productCreateSchema = z.object({
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
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: '최소 10자 이상 적어주세요.' });
      }
    })
    .max(DESCRIPTION_MAX_LENGTH, `최대 ${DESCRIPTION_MAX_LENGTH}자까지 입력할 수 있습니다.`),

  images: z
    .array(z.instanceof(File))
    .min(1, '대표 이미지를 추가해주세요.')
    .max(MAX_IMAGE_COUNT, `대표 이미지는 ${MAX_IMAGE_COUNT}장만 업로드할 수 있습니다.`),
});

export type ProductFormValues = z.infer<typeof productCreateSchema>;
