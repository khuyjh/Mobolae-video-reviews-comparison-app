import localFont from 'next/font/local';

import AuthGuard from '@/features/auth/components/AuthGuard';
import GlobalNav from '@/shared/components/GlobalNav';
import ScrollToTop from '@/shared/components/scrollToTop';
import { ToastProvider } from '@/shared/components/toastProvider';
import QueryProvider from '@/shared/providers/QueryProvider';

import type { Metadata } from 'next';

import '@/styles/globals.css';

const pretendard = localFont({
  src: [
    {
      path: '../../public/fonts/Pretendard-Light.woff',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Pretendard-Regular.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Pretendard-Medium.woff',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Pretendard-SemiBold.woff',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Pretendard-Bold.woff',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-nanumSquare',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'mobolae - 모볼래?',
  description: '영상 매체 추천, 비교 웹 애플리케이션',
  icons: {
    icon: '/icons/FaviconBg152.png',
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
