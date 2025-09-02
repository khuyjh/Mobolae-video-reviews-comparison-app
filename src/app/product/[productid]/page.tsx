import { notFound } from 'next/navigation';

import ProductCard from '@/features/product/components/productCard/productCard';
import ReviewListClient from '@/features/product/components/ReviewListClient';
import Statistics from '@/features/product/components/statisticsCard';
import serverApi from '@/shared/api/serverApi';

export default async function ProductPage({ params }: { params: { productid: string } }) {
  // 🚨 params.id 대신 params.productid를 사용합니다.
  const productId = params.productid;

  // URL에 id가 없거나 유효하지 않은 경우를 대비 (선택사항이지만 권장)
  if (!productId || isNaN(Number(productId))) {
    notFound();
  }

  const productData = await serverApi.get(`/products/${productId}`);
  const initialReviewsData = await serverApi.get(
    `/products/${productId}/reviews?sort=latest&page=1`,
  );

  return (
    <main className='mx-auto px-[20px] pt-[30px] pb-[223px] md:max-w-[684px] md:px-[30px] md:pt-[40px] md:pb-[147px] xl:max-w-[940px] xl:pt-[60px] xl:pb-[120px]'>
      <div className='flex flex-col gap-[60px] xl:gap-[80px]'>
        {/* 상세 섹션 - 서버 컴포넌트로 렌더링 */}
        <ProductCard
          imageSrc={productData.contentImage}
          category={{ id: productData.categoryId, name: productData.categoryName }}
          title={productData.title}
          views={productData.views}
          description={productData.description}
          isEditable={true}
        />

        {/* 통계 섹션 - 서버 컴포넌트로 렌더링 */}
        <section className='flex flex-col gap-[30px]'>
          <h2 className='text-lg-semibold md:text-base-semibold xl:text-xl-semibold text-white'>
            콘텐츠 통계
          </h2>
          <Statistics
            favoriteCount={productData.favoriteCount}
            rating={productData.rating}
            reviewCount={productData.reviewCount}
            favoriteComparison={productData.favoriteComparison}
            ratingComparison={productData.ratingComparison}
            reviewComparison={productData.reviewComparison}
          />
        </section>

        {/* 리뷰 섹션 - 클라이언트 컴포넌트에 초기 데이터 전달 */}
        <ReviewListClient productId={productId} initialReviews={initialReviewsData} />
      </div>
    </main>
  );
}
