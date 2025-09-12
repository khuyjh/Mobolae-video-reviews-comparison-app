import { Metadata } from 'next';

import { ProductDetailType } from '../../../openapi/requests';
import { META } from '../constants/metadata';

interface MetadataProps {
  product?: ProductDetailType;
  path?: string;
}

const getMetadata = ({ product, path }: MetadataProps) => {
  const { name, description, image, reviewCount, rating, favoriteCount } = product || {};

  const metaTitle = name ? `${name}의 리뷰는? | 모볼래` : META.title;
  const metaDescription = description
    ? `평점${rating?.toFixed(1)}점, ${reviewCount}개의 리뷰, ${favoriteCount}명이 찜한 ${name} - ${description}`
    : META.description;
  const pageUrl = path ? path : '';
  const metaOgImage = image || META.ogImage;

  const metadata: Metadata = {
    metadataBase: new URL(META.url),
    title: metaTitle,
    description: metaDescription,
    keywords: [...META.keywords],
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      siteName: metaTitle,
      locale: 'ko_KR',
      type: 'website',
      url: pageUrl,
      images: {
        url: metaOgImage,
      },
    },
    twitter: {
      title: metaTitle,
      description: metaDescription,
      images: {
        url: metaOgImage,
      },
    },
  };

  return metadata;
};

export default getMetadata;
