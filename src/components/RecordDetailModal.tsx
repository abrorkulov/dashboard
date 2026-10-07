import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Button,
  Chip,
  Divider,
  Snackbar,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LaunchIcon from '@mui/icons-material/Launch';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import type { BusinessRecord } from '../data/teamData';

interface RecordDetailModalProps {
  record: BusinessRecord | null;
  onClose: () => void;
}

const RecordDetailModal = ({ record, onClose }: RecordDetailModalProps) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!record) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setToastMessage(`${label} nusxalandi!`);
  };

  const getCleanPhone = (phone: string) => {
    return phone.replace(/[^\d+]/g, '');
  };

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${record.name} ${record.address} ${record.city}`
  )}`;

  return (
    <>
      <Dialog
        open={Boolean(record)}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              backgroundColor: '#0f172a',
              color: '#f8fafc',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
              overflow: 'hidden',
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
        {/* Header with gradient badge */}
        <Box
          sx={{
            p: 3,
            background: 'linear-gradient(135deg, #1e293b 0%, #1e1b4b 100%)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            position: 'relative',
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 16,
              top: 16,
              color: '#94a3b8',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: '#fff',
              },
            }}
            size="small"
          >
            <CloseIcon fontSize="small" />
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Chip
              label={record.city}
              size="small"
              sx={{
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                color: '#60a5fa',
                fontWeight: 700,
                fontSize: '0.75rem',
                border: '1px solid rgba(59, 130, 246, 0.3)',
              }}
            />
            <Chip
              icon={<CheckCircleIcon sx={{ '&&': { color: '#4ade80', fontSize: 16 } }} />}
              label="Tasdiqlangan"
              size="small"
              sx={{
                backgroundColor: 'rgba(34, 197, 94, 0.15)',
                color: '#4ade80',
                fontWeight: 600,
                fontSize: '0.75rem',
                border: '1px solid rgba(34, 197, 94, 0.25)',
              }}
            />
          </Box>

          <Typography variant="h5" sx={{ fontWeight: 800, color: '#ffffff', pr: 4, mb: 1 }}>
            {record.name}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#cbd5e1' }}>
            <CategoryIcon sx={{ fontSize: 18, color: '#38bdf8' }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {record.category}
            </Typography>
          </Box>
        </Box>

        <DialogContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Member added info */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              backgroundColor: '#162032',
              borderRadius: 2.5,
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <PersonIcon sx={{ color: '#818cf8', fontSize: 24 }} />
              <Box>
                <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                  Maʼlumot qoʻshgan aʼzo
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                  {record.member}
                </Typography>
              </Box>
            </Box>
            <Chip
              label="Jamoa aʼzosi"
              size="small"
              sx={{ backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', fontSize: '0.75rem' }}
            />
          </Box>

          {/* Contact Section */}
          <Box
            sx={{
              p: 2.5,
              backgroundColor: '#131d31',
              borderRadius: 3,
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <Typography variant="caption" sx={{ color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px', display: 'block', mb: 1.5 }}>
              Aloqa maʼlumotlari
            </Typography>

            {record.phone ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5, mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      p: 1.2,
                      borderRadius: 2,
                      backgroundColor: 'rgba(34, 197, 94, 0.15)',
                      color: '#4ade80',
                      display: 'flex',
                    }}
                  >
                    <PhoneIcon fontSize="small" />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                      Telefon raqami
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700, color: '#f8fafc', letterSpacing: '0.3px' }}>
                      {record.phone}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<ContentCopyIcon fontSize="inherit" />}
                    onClick={() => copyToClipboard(record.phone, 'Telefon raqami')}
                    sx={{
                      color: '#94a3b8',
                      borderColor: 'rgba(255, 255, 255, 0.12)',
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      '&:hover': {
                        borderColor: '#60a5fa',
                        color: '#60a5fa',
                        backgroundColor: 'rgba(59, 130, 246, 0.08)',
                      },
                    }}
                  >
                    Nusxalash
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    component="a"
                    href={`tel:${getCleanPhone(record.phone)}`}
                    startIcon={<PhoneIcon fontSize="inherit" />}
                    sx={{
                      backgroundColor: '#22c55e',
                      color: '#fff',
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      '&:hover': { backgroundColor: '#16a34a' },
                    }}
                  >
                    Qoʻngʻiroq
                  </Button>
                </Box>
              </Box>
            ) : (
              <Typography variant="body2" sx={{ color: '#64748b', fontStyle: 'italic' }}>
                Telefon koʻrsatilmagan
              </Typography>
            )}

            <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.06)' }} />

            {/* Address */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, flex: 1, minWidth: '200px' }}>
                <Box
                  sx={{
                    p: 1.2,
                    borderRadius: 2,
                    backgroundColor: 'rgba(236, 72, 153, 0.15)',
                    color: '#f472b6',
                    display: 'flex',
                    mt: 0.3,
                  }}
                >
                  <LocationOnIcon fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                    Manzil
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#e2e8f0', lineHeight: 1.5 }}>
                    {record.address || `${record.city} shahri`}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<ContentCopyIcon fontSize="inherit" />}
                  onClick={() => copyToClipboard(record.address || record.city, 'Manzil')}
                  sx={{
                    color: '#94a3b8',
                    borderColor: 'rgba(255, 255, 255, 0.12)',
                    textTransform: 'none',
                    fontSize: '0.8rem',
                    '&:hover': { borderColor: '#f472b6', color: '#f472b6' },
                  }}
                >
                  Nusxalash
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  component="a"
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<LaunchIcon fontSize="inherit" />}
                  sx={{
                    backgroundColor: '#3b82f6',
                    color: '#fff',
                    textTransform: 'none',
                    fontSize: '0.8rem',
                    '&:hover': { backgroundColor: '#2563eb' },
                  }}
                >
                  Xaritada ochish
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Links & Extra info */}
          {record.link && (
            <Box
              sx={{
                p: 2,
                backgroundColor: '#131d31',
                borderRadius: 2.5,
                border: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <LaunchIcon sx={{ color: '#38bdf8', fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: '#cbd5e1', fontWeight: 600 }}>
                  Veb-sayt / Ijtimoiy tarmoq
                </Typography>
              </Box>
              <Button
                variant="outlined"
                size="small"
                component="a"
                href={record.link.startsWith('http') ? record.link : `https://${record.link}`}
                target="_blank"
                rel="noopener noreferrer"
                endIcon={<LaunchIcon fontSize="inherit" />}
                sx={{
                  color: '#38bdf8',
                  borderColor: 'rgba(56, 189, 248, 0.4)',
                  textTransform: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  '&:hover': { backgroundColor: 'rgba(56, 189, 248, 0.1)', borderColor: '#38bdf8' },
                }}
              >
                Saytga oʻtish
              </Button>
            </Box>
          )}

          {record.note && (
            <Box
              sx={{
                p: 2,
                backgroundColor: 'rgba(245, 158, 11, 0.08)',
                borderRadius: 2.5,
                border: '1px solid rgba(245, 158, 11, 0.2)',
              }}
            >
              <Typography variant="caption" sx={{ color: '#fbbf24', fontWeight: 700, display: 'block', mb: 0.5 }}>
                Izoh / Taklif
              </Typography>
              <Typography variant="body2" sx={{ color: '#fef3c7' }}>
                {record.note}
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      <Snackbar
        open={Boolean(toastMessage)}
        autoHideDuration={2500}
        onClose={() => setToastMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setToastMessage(null)} severity="success" sx={{ width: '100%', borderRadius: 2 }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default RecordDetailModal;
