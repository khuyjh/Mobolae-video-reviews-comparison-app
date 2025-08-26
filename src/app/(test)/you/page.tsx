import CategoryMenu from '@/features/mainPage/components/CategoryMenu';
import FloatingButton from '@/features/mainPage/components/FloatingButton';
import MobileGnbSheet from '@/shared/components/MobileGnbSheet';

const TestYou = () => {
  return (
    <main className='grid grid-cols-1 gap-6 p-10 md:grid-cols-[260px_1fr]'>
      <MobileGnbSheet isLoggedIn={true} />
      <MobileGnbSheet isLoggedIn={false} />
      <FloatingButton />

      {/* PC/Tablet: 왼쪽 사이드바 슬롯 */}
      <aside id='desktop-category-slot' className='hidden md:block' />

      {/* 본문 */}
      <section className='space-y-4'>
        {/* 페이지 헤더 */}
        <header className='space-y-2'>
          <h1 className='text-2xl font-semibold text-white'>상품 목록</h1>
          {/* Mobile: 제목 아래 카테고리 트리거가 꽂힐 슬롯 */}
          <div id='mobile-category-slot' className='md:hidden' />
        </header>

        {/* 콘텐츠 영역 (목업) */}
        <ProductGrid />
      </section>

      {/* 카테고리 메뉴는 “한 번만” 선언 → 현재 뷰포트에 맞는 슬롯에 렌더됨 */}
      <CategoryMenu />
    </main>
  );
};

function ProductGrid() {
  return (
    <div className='grid grid-cols-2 gap-3 text-gray-600 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4'>
      {Array.from({ length: 32 }).map((_, i) => (
        <article key={i} className='border-black-800 rounded-xl border p-4 shadow-sm'>
          <div className='bg-black-800 aspect-[4/3] w-full rounded-lg' />
          <h3 className='text-base-medium mt-3'>상품 {i + 1}</h3>
          <p className='text-sm text-gray-400'>간단한 설명 텍스트</p>
        </article>
      ))}
    </div>
  );
}

export default TestYou;
