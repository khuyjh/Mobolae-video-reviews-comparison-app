import { cookies } from 'next/headers';

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

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const accessToken = cookieStore.get('accessToken')?.value;

  const response = await retrieveProduct({
    path: {
      teamId: TEAM_ID!,
      productId: Number(productId),
    },
    headers: {
      cookie: cookieHeader,
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}), // accessToken 있으면 붙여줌
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

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const accessToken = cookieStore.get('accessToken')?.value;

  /* 서버에서 콘텐츠 상세 정보 조회 */
  const response = await retrieveProduct({
    path: {
      teamId: TEAM_ID!,
      productId: Number(productId),
    },
    headers: {
      cookie: cookieHeader,
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });

  const product = response.data;

  type SortType = 'recent' | 'ratingDesc' | 'ratingAsc' | 'likeCount';

  /* 정렬 옵션 SSR 첫 페이지 패치 */
  const ORDERS = ['recent', 'ratingDesc', 'ratingAsc', 'likeCount'] as const;

  /* SSR에서 리뷰 첫 페이지 조회 */
  const reviewResponses = await Promise.all(
    ORDERS.map((order) =>
      listReviews({
        path: { teamId: TEAM_ID!, productId: Number(productId) },
        query: { order },
        headers: {
          cookie: cookieHeader,
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      }),
    ),
  );

  /* 정렬한 리뷰 데이터 전달 */
  const initialReviews = ORDERS.reduce(
    (acc, order, i) => {
      acc[order as SortType] = reviewResponses[i].data!;
      return acc;
    },
    {} as Record<SortType, ListReviewsResponse>,
  );

  /* 콘텐츠 데이터가 없을 시 */
  if (!product) {
    return <div>Loading...</div>; // 임시
  }

  return <ProductDetailsPageClient product={product} initialReviews={initialReviews} />;
}
