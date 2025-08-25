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
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h1>Chip 컴포넌트 사용 가이드</h1>

      {/* 1. Category 칩 사용법 */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <h3>카테고리 칩: (고정된 색상, 클릭 가능)</h3>
        {/* variant와 colorKey를 필수로 전달 */}
        <Chip variant='category' clickable colorKey='영화'>
          영화
        </Chip>
        <Chip variant='category' clickable colorKey='드라마'>
          드라마
        </Chip>
        <Chip variant='category' clickable colorKey='공연/뮤지컬'>
          공연/뮤지컬
        </Chip>
        <Chip variant='category' clickable colorKey='애니메이션'>
          애니메이션
        </Chip>
        <Chip variant='category' clickable colorKey='다큐멘터리'>
          다큐멘터리
        </Chip>
        <Chip variant='category' clickable colorKey='키즈'>
          키즈
        </Chip>
        <Chip variant='category' clickable colorKey='예능'>
          예능
        </Chip>
      </div>

      {/* 2. Ranking 칩 사용법 */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <h3>랭킹 칩: (순위에 따른 고정된 색상)</h3>
        {/* variant와 colorKey를 필수로 전달 */}
        <Chip variant='ranking' colorKey='1등'>
          1등
        </Chip>
        <Chip variant='ranking' colorKey='2등'>
          2등
        </Chip>
        <Chip variant='ranking' colorKey='3등'>
          3등
        </Chip>
        <Chip variant='ranking' colorKey='4등'>
          4등
        </Chip>
        <Chip variant='ranking' colorKey='5등'>
          5등
        </Chip>
      </div>

      {/* 3. Filter 칩 사용법 */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <h3>필터 칩: (아이콘 포함, 클릭 가능)</h3>
        {/* variant="filter", clickable prop 전달 */}
        <Chip variant='filter' clickable>
          필터
        </Chip>
        <Chip variant='filter' clickable>
          장르
        </Chip>
      </div>

      {/* 4. Thumbs 칩 사용법 */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <h3>좋아요 칩: (토글 상태에 따라 색상 변경)</h3>
        {/* variant="thumbs", isToggled prop과 onClick 핸들러 전달 */}
        <Chip variant='thumbs' clickable isToggled={isThumbsToggled} onClick={handleThumbsClick}>
          좋아요
        </Chip>
      </div>

      {/* 5. Compare 칩 사용법 */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <h3>비교 칩: (삭제 버튼 포함)</h3>
        {/* variant="compare", colorKey, onRemove 핸들러 전달 */}
        {compareChips.map((chip) => (
          <Chip
            key={chip.id}
            variant='compare'
            colorKey={chip.colorKey}
            onRemove={() => handleRemoveChip(chip.id)}
          >
            {chip.text}
          </Chip>
        ))}
      </div>
    </div>
  );
};

export default ChipTestPage;
