import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const Modal = ({ isOpen, onClose, title, subtitle, children, maxWidth = 'lg' }: ModalProps) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      slotProps={{
        paper: {
          sx: {
            backgroundColor: '#0f172a',
            color: '#f8fafc',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
            maxHeight: '90vh',
            backgroundImage: 'none',
          },
        },
        backdrop: {
          sx: {
            backgroundColor: 'rgba(5, 8, 16, 0.8)',
            backdropFilter: 'blur(8px)',
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          px: 3,
          py: 2.2,
          backgroundColor: '#131d33',
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#f8fafc', fontSize: '1.25rem' }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5, fontSize: '0.875rem' }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: '#94a3b8',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
            },
          }}
          size="small"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 3, overflowY: 'auto' }}>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
