'use client';

import React, { useState } from 'react';

import { Chip } from '@/shared/components/chip';

const ChipTestPage = () => {
  // Thumbs 칩의 토글 상태 관리
  const [isThumbsToggled, setIsThumbsToggled] = useState(false);
  const handleThumbsClick = () => {
    setIsThumbsToggled(!isThumbsToggled);
  };

  // Compare 칩의 목록을 상태로 관리 (삭제 기능 테스트용)
  const [compareChips, setCompareChips] = useState([
    { id: 1, text: 'Sony WH-1300XM3', colorKey: '1번' as const },
    { id: 2, text: 'Air Pods Max', colorKey: '2번' as const },
  ]);
  const handleRemoveChip = (id: number) => {
    setCompareChips(compareChips.filter((chip) => chip.id !== id));
  };

  return (
    <div className='flex flex-col gap-5 p-5'>
      <h1 className='text-3xl font-bold text-white'>Chip 컴포넌트 테스트 코드</h1>

      {/* Category 칩 사용법 */}
      <div>
        <h3 className='mb-2 text-xl font-semibold text-white'>
          카테고리 칩: (고정된 색상, 클릭 가능)
        </h3>
        <div className='flex flex-wrap items-center gap-2'>
          {/* variant와 colorKey를 필수로 전달 */}
          <Chip variant='category' clickable colorKey='영화' textSize='category'>
            영화
          </Chip>
          <Chip variant='category' clickable colorKey='드라마' textSize='category'>
            드라마
          </Chip>
          <Chip variant='category' clickable colorKey='공연/뮤지컬' textSize='category'>
            공연/뮤지컬
          </Chip>
          <Chip variant='category' clickable colorKey='애니메이션' textSize='category'>
            애니메이션
          </Chip>
          <Chip variant='category' clickable colorKey='다큐멘터리' textSize='category'>
            다큐멘터리
          </Chip>
          <Chip variant='category' clickable colorKey='키즈' textSize='category'>
            키즈
          </Chip>
          <Chip variant='category' clickable colorKey='예능' textSize='category'>
            예능
          </Chip>
        </div>
      </div>

      {/* Ranking 칩 사용법 */}
      <div>
        <h3 className='mb-2 text-xl font-semibold text-white'>
          랭킹 칩: (순위에 따른 고정된 색상)
        </h3>
        <div className='flex flex-wrap items-center gap-2'>
          {/* variant와 colorKey를 필수로 전달 */}
          <Chip variant='ranking' colorKey='1등' textSize='ranking'>
            1등
          </Chip>
          <Chip variant='ranking' colorKey='2등' textSize='ranking'>
            2등
          </Chip>
          <Chip variant='ranking' colorKey='3등' textSize='ranking'>
            3등
          </Chip>
          <Chip variant='ranking' colorKey='4등' textSize='ranking'>
            4등
          </Chip>
          <Chip variant='ranking' colorKey='5등' textSize='ranking'>
            5등
          </Chip>
        </div>
      </div>

      {/* Filter 칩 사용법 */}
      <div>
        <h3 className='mb-2 text-xl font-semibold text-white'>필터 칩: (아이콘 포함, 클릭 가능)</h3>
        <div className='flex flex-wrap items-center gap-2'>
          {/* variant="filter", clickable prop 전달 */}
          <Chip variant='filter' clickable textSize='filter'>
            필터
          </Chip>
          <Chip variant='filter' clickable textSize='filter'>
            장르
          </Chip>
        </div>
      </div>

      {/* Thumbs 칩 사용법 */}
      <div>
        <h3 className='mb-2 text-xl font-semibold text-white'>
          좋아요 칩: (토글 상태에 따라 색상 변경)
        </h3>
        <div className='flex flex-wrap items-center gap-2'>
          {/* variant="thumbs", isToggled prop과 onClick 핸들러 전달 */}
          <Chip
            variant='thumbs'
            clickable
            isToggled={isThumbsToggled}
            onClick={handleThumbsClick}
            textSize='thumbs'
          >
            132
          </Chip>
        </div>
      </div>

      {/* Compare 칩 사용법 */}
      <div>
        <h3 className='mb-2 text-xl font-semibold text-white'>비교 칩: (삭제 버튼 포함)</h3>
        <div className='flex flex-wrap items-center gap-2'>
          {/* variant="compare", colorKey, onRemove 핸들러 전달 */}
          {compareChips.map((chip) => (
            <Chip
              key={chip.id}
              variant='compare'
              colorKey={chip.colorKey}
              onRemove={() => handleRemoveChip(chip.id)}
              textSize='compare'
            >
              {chip.text}
            </Chip>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChipTestPage;
