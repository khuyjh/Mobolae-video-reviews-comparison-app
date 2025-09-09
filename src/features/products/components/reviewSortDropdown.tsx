'use client';

import SortDropdown from '@/shared/components/SortDropdown';
import { ReviewOrderKey, REVIEW_ORDER_OPTIONS } from '@/shared/types/SortDropdownTypes';

interface ReviewSortDropdownProps {
  value: ReviewOrderKey;
  onChange: (value: ReviewOrderKey) => void;
}

const ReviewSortDropdown = ({ value, onChange }: ReviewSortDropdownProps) => {
  return (
    <SortDropdown<ReviewOrderKey>
      options={REVIEW_ORDER_OPTIONS}
      value={value}
      onChange={onChange}
    />
  );
};

export default ReviewSortDropdown;
