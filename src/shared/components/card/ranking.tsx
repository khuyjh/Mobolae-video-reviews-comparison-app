import React from 'react';

type Variant = 'ranking' | 'follower' | 'review_profile';

type ProfileBadgeProps = {
  variant: Variant;
  name: string;
  avatarSrc: string;
  rankLabel?: string;
  follwers?: number;
  review?: number;
  rating?: number;
  className?: string;
};

function profileBadge({
  variant,
  name,
  avatarSrc,
  rankLabel,
  follwers,
  review,
  rating,
  className,
}: ProfileBadgeProps) {
  return <></>;
}
