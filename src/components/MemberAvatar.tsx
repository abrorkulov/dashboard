import React from 'react';

interface MemberAvatarProps {
  name: string;
  color?: string;
  size?: number;
  fontSize?: string;
}

/** Jamoa aʼzosining bosh harflaridan iborat avatari */
const MemberAvatar: React.FC<MemberAvatarProps> = ({
  name,
  color = '#1f5ae0',
  size = 42,
  fontSize = '0.9rem',
}) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white"
      style={{
        width: size,
        height: size,
        fontSize,
        background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
        boxShadow: `0 4px 14px ${color}33`,
      }}
      aria-hidden
    >
      {initials}
    </span>
  );
};

export default MemberAvatar;
