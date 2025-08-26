import Button from '@/shared/components/Button';
import Input from '@/shared/components/Input';
import PasswordInput from '@/shared/components/PasswordInput';

const TestJung = () => {
  return (
    <>
      <Button variant='primary'>테스트 버튼</Button>
      <br />
      <Button variant='primary' disabled={true}>
        비활성화 버튼
      </Button>
      <br />
      <Button variant='secondary'>테스트 버튼</Button>
      <br />
      <Button variant='tertiary'>테스트 버튼</Button>
      <br />
      <Button>일단 이럴일은 없겠지만 내용이 매우 긴 버튼 12345678923456712345678</Button>
      <br />
      <Button className='max-w-none'>너비 커스텀 버튼</Button>
      <br />
      <br />
      <Input placeholder='아무 것도 없는 인풋' />
      <br />
      <Input label='라벨만 있는 인풋' />
      <br />
      <Input label='라벨과' helperText='헬퍼 텍스트가 있는 인풋' />
      <br />
      <Input placeholder='너비 커스텀' className='w-30' />
      <br />
      <PasswordInput label='비밀번호' />
    </>
  );
};

export default TestJung;
