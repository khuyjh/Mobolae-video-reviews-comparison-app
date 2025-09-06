// app/product/[productId]/page.tsx
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

  const response = await retrieveProduct({
    path: {
      teamId: TEAM_ID!,
      productId: Number(productId),
    },
  });

  const product = response.data;

  if (!product) {
    return <div>Loading...</div>;
  }

  return <ProductDetailsPageClient product={product} />;
}
