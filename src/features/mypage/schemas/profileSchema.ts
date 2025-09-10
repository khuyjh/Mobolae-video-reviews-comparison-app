import z from 'zod';

const trimmedString = z.string().trim();
const requiredString = trimmedString.min(1, { message: '필수 입력 항목입니다.' });

export const profileSchema = z.object({
  image: trimmedString,
  nickname: requiredString.max(20, { message: '닉네임은 최대 20자까지 가능합니다.' }),
  description: trimmedString.max(300, { message: '소개글은 최대 300자까지 가능합니다.' }),
});

export type ProfileSchema = z.infer<typeof profileSchema>;
