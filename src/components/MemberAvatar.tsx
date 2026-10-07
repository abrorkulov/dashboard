import React from 'react';
import { Box, Avatar } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

interface MemberAvatarProps {
  name: string;
  color?: string;
  size?: number;
  fontSize?: string;
  showIconOnly?: boolean;
}

const MemberAvatar: React.FC<MemberAvatarProps> = ({
  name,
  color = '#3b82f6',
  size = 42,
  fontSize = '0.9rem',
  showIconOnly = false,
}) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  if (showIconOnly) {
    return (
      <Box
        sx={{
          width: size,
          height: size,
          borderRadius: size > 50 ? '20px' : '12px',
          background: `linear-gradient(135deg, ${color} 0%, ${color}99 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 4px 14px ${color}35`,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          color: '#ffffff',
          flexShrink: 0,
        }}
      >
        <PersonIcon sx={{ fontSize: size * 0.55 }} />
      </Box>
    );
  }

  return (
    <Avatar
      sx={{
        width: size,
        height: size,
        borderRadius: size > 50 ? '22px' : '12px',
        background: `linear-gradient(135deg, ${color} 0%, ${color}aa 100%)`,
        color: '#ffffff',
        fontWeight: 800,
        fontSize,
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: `0 4px 16px ${color}40`,
        flexShrink: 0,
      }}
    >
      {initials}
    </Avatar>
  );
};

export default MemberAvatar;
