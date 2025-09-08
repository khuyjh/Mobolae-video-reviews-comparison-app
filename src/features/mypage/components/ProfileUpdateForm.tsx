import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import Button from '@/shared/components/Button';
import ImageUploader from '@/shared/components/imageUploader';
import Input from '@/shared/components/Input';
import TextAreaWithCounter from '@/shared/components/textAreaWithCounter';

const ProfileUpdateForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm({
    // resolver=zodResolver(),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {},
  });
  const value: File[] = [];

  const onChangeImage = () => {
    //이미지 배열에 대해 프리뷰 url 생성 해야함
    //api 호출로 url 변환시켜서 field로 건네줘야 함
  };

  return (
    <form className='flex flex-col gap-[10px] px-1 md:gap-[15px] md:pb-5 xl:gap-5'>
      <h2 className='text-xl-medium xl:text-2xl-medium mb-[10px] md:mb-[25px]'>프로필 편집</h2>
      <ImageUploader
        className='w-[50%]'
        value={value}
        onChange={() => {}}
        onRemove={() => {}}
        previewUrls={value.map((file) => URL.createObjectURL(file))}
      />
      <Input className='md:text-base-regular md:max-w-none' placeholder='닉네임을 입력해 주세요' />
      <TextAreaWithCounter className='h-30' value='' onChange={() => {}} />
      <Button className='mt-[10px] max-w-none md:mt-[25px] md:max-w-none xl:mt-5' variant='primary'>
        저장하기
      </Button>
    </form>
  );
};

export default ProfileUpdateForm;
