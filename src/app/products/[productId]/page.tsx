import { Metadata } from 'next';

import ProductDetailsPageClient from '@/features/products/components/productDetailsPageClient';
import { TEAM_ID } from '@/shared/constants/constants';

import { retrieveProduct, listReviews } from '../../../../openapi/requests/services.gen';

import type { ListReviewsResponse } from '../../../../openapi/requests/types.gen';

interface ProductPageProps {
  params: Promise<{
    productId: string;
  }>;
}

/* 메타데이터 */
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { productId } = await params;

  const response = await retrieveProduct({
    path: {
      teamId: TEAM_ID!,
      productId: Number(productId),
    },
  });

  const product = response.data;

  if (!product) {
    return {
      title: '콘텐츠 상세',
      description: '콘텐츠 상세 페이지',
    };
  }

  return {
    title: `${product.name} | 콘텐츠 상세`,
    description: product.description || '콘텐츠 상세 페이지',
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.image ? [product.image] : [],
    },
  };
}

export default async function Page({ params }: ProductPageProps) {
  const { productId } = await params;

  /* 서버에서 콘텐츠 상세 정보 조회 */
  const response = await retrieveProduct({
    path: {
      teamId: TEAM_ID!,
      productId: Number(productId),
    },
  });

  const product = response.data;

  /* SSR에서 리뷰 첫 페이지 조회 */
  const reviewResponse = await listReviews({
    path: { teamId: TEAM_ID!, productId: Number(productId) },
    query: { order: 'recent' }, // 최신순 1페이지
  });

  const initialReviews: ListReviewsResponse = reviewResponse.data!;

  /* 콘텐츠 데이터가 없을 시 */
  if (!product) {
    return <div>Loading...</div>; // 임시
  }

  return <ProductDetailsPageClient product={product} initialReviews={initialReviews} />;
}
