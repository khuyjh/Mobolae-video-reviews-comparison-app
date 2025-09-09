import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import Button from '@/shared/components/Button';
import ImageUploader from '@/shared/components/imageUploader';
import Input from '@/shared/components/Input';
import TextAreaWithCounter from '@/shared/components/textAreaWithCounter';
import { PATH_OPTION } from '@/shared/constants/constants';
import { useUserStore } from '@/shared/stores/userStore';

import { useMeKey, useUpdateMe } from '../../../../openapi/queries';
import { imageUpload, MeResponse, UpdateMeError } from '../../../../openapi/requests';
import { ProfileSchema, profileSchema } from '../schemas/profileSchema';

interface Props {
  userDetail: MeResponse;
  onClose: () => void;
}

const VALID_IMG_URL = 'sprint-fe-project.s3.ap-northeast-2.amazonaws.com';

const ProfileUpdateForm = ({ userDetail, onClose }: Props) => {
  /**
   * dummyFile: 초기 데이터로 유효한 image url이 있을 시에 임시 파일을 설정해 유효한 상태를 알림
   * isValidImg: next.config에 등록된 url인지 판별
   */
  const queryClient = useQueryClient();
  const updateUser = useUserStore((state) => state.updateUser);
  const dummyBlob = new Blob(['dummy img'], { type: 'jpg' });
  const dummyFile = new File([dummyBlob], 'dummy img');
  const isValidImg = userDetail.image?.includes(VALID_IMG_URL);
  const [file, setFile] = useState<File[]>(isValidImg ? [dummyFile] : []);
  const [previewUrl, setPreviewUrl] = useState<string[]>(
    isValidImg && userDetail.image ? [userDetail.image] : [],
  );
  const {
    register,
    control,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      image: userDetail.image ? userDetail.image : 'https://example.com/...',
      nickname: userDetail.nickname,
      description: userDetail.description,
    },
  });
  const { mutate } = useUpdateMe([], {
    onSuccess: (res: AxiosResponse) => {
      //me를 업데이트 함에 따라서 useMe의 쿼리키를 stale로 전환해서 마이페이지 정보 갱신
      queryClient.invalidateQueries({ queryKey: [useMeKey] });
      //응답 데이터로 전역 유저상태 갱신
      updateUser(res.data);
      toast.success('변경된 프로필이 저장되었습니다.');
      //모달 종료
      onClose();
    },
    onError: (e: UpdateMeError) => {
      if (axios.isAxiosError(e)) {
        const message = e.response?.data.message;
        const status = e.status;

        if (status === 400 && message.includes('닉네임')) {
          //중복 닉네임
          setError('nickname', { type: 'server', message: message });
          return;
        }
        // status 400 이외 에러
        toast.error(`문제가 발생했습니다.\n다시 시도해주세요.`);
        throw e;
      }
      // axios외 에러
      toast.error(`문제가 발생했습니다.\n다시 시도해주세요.`);
      throw e;
    },
  });

  const onSubmit: SubmitHandler<ProfileSchema> = (data) => {
    mutate({
      ...PATH_OPTION,
      body: data,
      throwOnError: true,
    });
  };

  useEffect(() => {
    return () => {
      //unmount될 때 미리보기가 지정되어 있다면 해제
      URL.revokeObjectURL(previewUrl[0]);
    };
  }, []);

  return (
    <form
      className='flex flex-col gap-[10px] px-1 md:gap-[15px] md:pb-5 xl:gap-5'
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className='text-xl-medium xl:text-2xl-medium mb-[10px] md:mb-[25px]'>프로필 편집</h2>
      <Controller
        name='image'
        control={control}
        render={({ field }) => (
          <ImageUploader
            className='w-[50%]'
            value={file}
            previewUrls={previewUrl}
            onChange={async (newFile: File[]) => {
              const currentFile = newFile[0];

              //등록한 이미지 url 변환 요청 실행
              try {
                const imgRes = await imageUpload({
                  ...PATH_OPTION,
                  body: { image: currentFile },
                  throwOnError: true,
                });

                const currentPreview = URL.createObjectURL(currentFile);
                setPreviewUrl([currentPreview]);
                setFile([currentFile]);
                field.onChange(imgRes.data.url);
              } catch (e) {
                toast.error(`오류가 발생했습니다.\n다시 시도해주세요.`);
                throw e;
              }
            }}
            onRemove={(index) => {
              setFile([]);
              URL.revokeObjectURL(previewUrl[index]);
              setPreviewUrl([]);
              if (isValidImg) {
                //유효한 이미지가 초기값인 경우 삭제하면 유효하지 않은 임시 url이 전달되어야 함
                field.onChange('https://example.com/...');
              } else {
                //초기값이 유효하지 않은 이미지면 파일을 삭제했을 때 초기의 유효하지 않은 값으로 롤백
                field.onChange(userDetail.image);
              }
            }}
          />
        )}
      />
      <Input
        className='md:text-base-regular md:max-w-none'
        id='nickname'
        type='text'
        placeholder='닉네임을 입력해 주세요'
        error={errors.nickname}
        {...register('nickname')}
      />
      <Controller
        name='description'
        control={control}
        render={({ field }) => (
          <TextAreaWithCounter
            value={field.value}
            onChange={(value: string) => {
              field.onChange(value);
            }}
            maxLength={300}
            placeholder='프로필 설명을 입력해주세요.'
          />
        )}
      />
      <Button
        className='mt-[10px] max-w-none md:mt-[25px] md:max-w-none xl:mt-5'
        variant='primary'
        type='submit'
        disabled={isSubmitting || !isDirty || !isValid}
      >
        {isSubmitting ? '프로필 저장중...' : '저장하기'}
      </Button>
    </form>
  );
};

export default ProfileUpdateForm;
