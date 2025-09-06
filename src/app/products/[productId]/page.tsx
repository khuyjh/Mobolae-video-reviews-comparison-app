import { Metadata } from 'next';

import ProductDetailsPageClient from '@/features/products/components/productDetailsPageClient';
import { TEAM_ID } from '@/shared/constants/constants';

import { retrieveProduct } from '../../../../openapi/requests/services.gen';

export const metadata: Metadata = {
  title: '콘텐츠 상세',
  description: '콘텐츠 상세 페이지',
};

interface ProductPageProps {
  params: {
    productId: string;
  };
}

export default async function Page({ params }: ProductPageProps) {
  const { productId } = params;

  /* 서버에서 콘텐츠 상세 정보 조회 */
  const response = await retrieveProduct({
    path: {
      teamId: TEAM_ID!,
      productId: Number(productId),
    },
  });

  const product = response.data;

  /* 콘텐츠 데이터가 없을 시 */
  if (!product) {
    return <div>Loading...</div>; // 임시
  }

  return <ProductDetailsPageClient product={product} />;
}
