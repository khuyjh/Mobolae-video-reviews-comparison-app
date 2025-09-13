'use client';

import React from 'react';

const Cell = ({ className = '' }: { className?: string }) => (
  <div className={`bg-black-700/50 h-5 w-full animate-pulse rounded ${className}`} />
);

const Row = () => (
  <div className='border-black-700/30 grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] items-center gap-4 border-b py-4'>
    <Cell className='w-24' />
    <Cell className='w-20 justify-self-center' />
    <Cell className='w-20 justify-self-center' />
    <Cell className='w-20 justify-self-center' />
  </div>
);

const SummarySkeleton = () => (
  <div className='mb-[40px] text-center md:mb-[90px]'>
    <div className='bg-black-700/50 mx-auto h-7 w-[240px] animate-pulse rounded-md md:w-[300px] lg:h-8' />
    <div className='bg-black-700/40 mx-auto mt-2 h-4 w-[200px] animate-pulse rounded md:w-[240px]' />
  </div>
);

/**
 * CompareResultSkeleton
 * - 상단 요약(서머리) + 헤더 + 테이블 스켈레톤
 * - pending 구간에서 사용
 */
const CompareResultSkeleton = () => (
  <section aria-busy='true' aria-labelledby='compare-result-skeleton'>
    <h2 id='compare-result-skeleton' className='sr-only'>
      비교 결과 로딩 중
    </h2>

    {/* 상단 요약 스켈레톤 */}
    <SummarySkeleton />

    {/* 테이블 프레임 */}
    <div className='border-black-700/30 rounded-xl border p-5'>
      {/* 테이블 헤더 라인 */}
      <div className='mb-3 grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] items-center gap-4 text-sm text-gray-500'>
        <span>기준</span>
        <span className='justify-self-center'>A</span>
        <span className='justify-self-center'>B</span>
        <span className='justify-self-center'>결과</span>
      </div>

      {/* 3줄 정도 스켈레톤 로우 */}
      <Row />
      <Row />
      <Row />
      <Row />
    </div>
  </section>
);

export default CompareResultSkeleton;
