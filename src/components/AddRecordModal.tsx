import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  TextField,
  Button,
  MenuItem,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import type { BusinessRecord } from '../data/teamData';
import { allTeamMembers } from '../data/teamData';

interface AddRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newRecord: BusinessRecord) => void;
}

const AddRecordModal = ({ isOpen, onClose, onAdd }: AddRecordModalProps) => {
  const [name, setName] = useState('');
  const [member, setMember] = useState(allTeamMembers[0]?.name || 'Abdulloh');
  const [category, setCategory] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Toshkent');
  const [address, setAddress] = useState('');
  const [link, setLink] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const record: BusinessRecord = {
      id: `custom-${Date.now()}`,
      member,
      name: name.trim(),
      category: category.trim() || 'Xizmatlar',
      phone: phone.trim(),
      city,
      address: address.trim(),
      link: link.trim(),
      status: 'verified',
      raw: {},
    };

    onAdd(record);
    setName('');
    setCategory('');
    setPhone('');
    setAddress('');
    setLink('');
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            backgroundColor: '#0f172a',
            color: '#f8fafc',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
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
      <form onSubmit={handleSubmit}>
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 3,
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: '#131d33',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <AddCircleIcon sx={{ color: '#3b82f6' }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#f8fafc' }}>
              Yangi Biznes Qoʻshish
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: '#94a3b8' }} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            required
            fullWidth
            label="Biznes Nomi"
            placeholder="Masalan: Rayhon Milliy Taomlar"
            value={name}
            onChange={(e) => setName(e.target.value)}
            slotProps={{
              inputLabel: { sx: { color: '#94a3b8' } },
              input: { sx: { color: '#ffffff', backgroundColor: '#162032', borderRadius: 2 } },
            }}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              select
              fullWidth
              label="Kirituvchi aʼzo"
              value={member}
              onChange={(e) => setMember(e.target.value)}
              slotProps={{
                inputLabel: { sx: { color: '#94a3b8' } },
                input: { sx: { color: '#ffffff', backgroundColor: '#162032', borderRadius: 2 } },
              }}
            >
              {allTeamMembers.map((m) => (
                <MenuItem key={m.id} value={m.name}>
                  {m.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              fullWidth
              label="Shahar"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              slotProps={{
                inputLabel: { sx: { color: '#94a3b8' } },
                input: { sx: { color: '#ffffff', backgroundColor: '#162032', borderRadius: 2 } },
              }}
            >
              <MenuItem value="Toshkent">Toshkent</MenuItem>
              <MenuItem value="Samarqand">Samarqand</MenuItem>
              <MenuItem value="Buxoro">Buxoro</MenuItem>
              <MenuItem value="Qarshi">Qarshi</MenuItem>
              <MenuItem value="Andijon">Andijon</MenuItem>
              <MenuItem value="Fargʻona">Fargʻona</MenuItem>
            </TextField>
          </Box>

          <TextField
            fullWidth
            label="Kategoriya / Faoliyat turi"
            placeholder="Masalan: Restoran, Taʼlim, Mebel..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            slotProps={{
              inputLabel: { sx: { color: '#94a3b8' } },
              input: { sx: { color: '#ffffff', backgroundColor: '#162032', borderRadius: 2 } },
            }}
          />

          <TextField
            fullWidth
            label="Telefon raqami"
            placeholder="+998 90 123 45 67"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            slotProps={{
              inputLabel: { sx: { color: '#94a3b8' } },
              input: { sx: { color: '#ffffff', backgroundColor: '#162032', borderRadius: 2 } },
            }}
          />

          <TextField
            fullWidth
            label="Manzil"
            placeholder="Koʻcha, uy yoki moʻljal"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            slotProps={{
              inputLabel: { sx: { color: '#94a3b8' } },
              input: { sx: { color: '#ffffff', backgroundColor: '#162032', borderRadius: 2 } },
            }}
          />

          <TextField
            fullWidth
            label="Veb-sayt yoki havola (ixtiyoriy)"
            placeholder="https://example.uz"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            slotProps={{
              inputLabel: { sx: { color: '#94a3b8' } },
              input: { sx: { color: '#ffffff', backgroundColor: '#162032', borderRadius: 2 } },
            }}
          />
        </DialogContent>

        <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <Button onClick={onClose} sx={{ color: '#94a3b8', textTransform: 'none' }}>
            Bekor qilish
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: '#3b82f6',
              textTransform: 'none',
              fontWeight: 700,
              px: 3,
              borderRadius: 2,
              '&:hover': { backgroundColor: '#2563eb' },
            }}
          >
            Saqlash
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddRecordModal;
