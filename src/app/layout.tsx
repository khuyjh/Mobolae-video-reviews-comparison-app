import localFont from 'next/font/local';

import AuthGuard from '@/features/auth/components/AuthGuard';
import GlobalNav from '@/shared/components/GlobalNav';
import ScrollToTop from '@/shared/components/scrollToTop';
import { META } from '@/shared/constants/metadata';
import QueryProvider from '@/shared/providers/QueryProvider';
import { ToastProvider } from '@/shared/providers/toastProvider';

import type { Metadata } from 'next';

import '@/styles/globals.css';

const pretendard = localFont({
  src: [
    {
      path: '../../public/fonts/Pretendard-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Pretendard-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Pretendard-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Pretendard-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Pretendard-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-nanumSquare',
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  title: META.title,
  description: META.description,
  keywords: [...META.keywords],
  icons: META.icons,
  openGraph: {
    title: META.title,
    description: META.description,
    siteName: META.siteName,
    locale: 'ko_KR',
    type: 'website',
    url: META.url,
    images: {
      url: META.ogImage,
    },
  },
  twitter: {
    title: META.title,
    description: META.description,
    images: {
      url: META.ogImage,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko'>
      <body className={`${pretendard.className} bg-black-900`}>
        <QueryProvider>
          <ToastProvider>
            <AuthGuard>
              <GlobalNav />
              {children}
              <ScrollToTop />
            </AuthGuard>
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
