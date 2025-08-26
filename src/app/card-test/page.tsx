import ProductCard from '@/shared/components/card/productCard/productCard';

const HomePage = () => {
  return (
    <div className='bg-black-900 justify-cente flex min-h-screen items-center'>
      <div className='bg-black-900 w-full rounded-lg shadow-xl'>
        <ProductCard
          imageSrc='https://www.apple.com/v/macbook-pro/specs/a/images/specs/16-inch/macbook_pro_16_inch__ea6m77f758eq_large.jpg'
          chipLabel='전자기기'
          title='MacBook PRo 14(M4 모델)'
          views={43521}
          description='Apple Intelligence는 당신이 글을 쓰고, 개성을 표출하고, 이것저것 척척 처리하는 것을 도와주는 개인용 지능 시스템입니다. 혁신적인 개인정보 보호 기능도 갖추고 있어 Apple은 물론 그 누구도 당신의 개인정보에 접근할 수 없으니 안심하고 쓸 수 있죠.'
          isEditable={true}
        />
      </div>
    </div>
  );
};

export default HomePage;
