import React from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import TableChartIcon from '@mui/icons-material/TableChart';
import CodeIcon from '@mui/icons-material/Code';
import { exportToCSV, exportToJSON, allBusinessRecords } from '../data/teamData';

interface TopHeaderProps {
  title: string;
  subtitle?: string;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  onAddNewClick?: () => void;
}

const TopHeader: React.FC<TopHeaderProps> = ({
  title,
  subtitle,
  searchQuery = '',
  onSearchChange,
  onAddNewClick,
}) => {
  const [exportAnchorEl, setExportAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleExportOpen = (event: React.MouseEvent<HTMLElement>) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setExportAnchorEl(null);
  };

  const handleDownloadCSV = () => {
    exportToCSV(allBusinessRecords, 'barcha-bizneslar.csv');
    handleExportClose();
  };

  const handleDownloadJSON = () => {
    exportToJSON(allBusinessRecords, 'barcha-bizneslar.json');
    handleExportClose();
  };

  return (
    <Box
      sx={{
        mb: 4,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', md: 'center' },
        gap: 2,
        pb: 3,
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Title & subtitle */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: '#ffffff',
              fontSize: { xs: '1.6rem', md: '2rem' },
              letterSpacing: '-0.5px',
            }}
          >
            {title}
          </Typography>
          <Chip
            label="Admin V2"
            size="small"
            sx={{
              backgroundColor: 'rgba(59, 130, 246, 0.15)',
              color: '#60a5fa',
              fontWeight: 700,
              fontSize: '0.7rem',
              border: '1px solid rgba(59, 130, 246, 0.3)',
            }}
          />
        </Box>
        {subtitle && (
          <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            {subtitle}
          </Typography>
        )}
      </Box>

      {/* Action Toolbar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          flexWrap: 'wrap',
          width: { xs: '100%', md: 'auto' },
        }}
      >
        {onSearchChange && (
          <TextField
            size="small"
            placeholder="Biznes yoki raqam qidirish..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#64748b', fontSize: 20 }} />
                  </InputAdornment>
                ),
                sx: {
                  backgroundColor: '#131d31',
                  color: '#ffffff',
                  borderRadius: 2.5,
                  fontSize: '0.875rem',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  '& fieldset': { border: 'none' },
                  '&:hover': {
                    backgroundColor: '#17233c',
                  },
                  width: { xs: '100%', sm: 260 },
                },
              },
            }}
          />
        )}

        <Button
          variant="outlined"
          startIcon={<FileDownloadIcon />}
          onClick={handleExportOpen}
          sx={{
            color: '#94a3b8',
            borderColor: 'rgba(255, 255, 255, 0.12)',
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 2.5,
            px: 2,
            py: 0.9,
            '&:hover': {
              borderColor: '#38bdf8',
              color: '#38bdf8',
              backgroundColor: 'rgba(56, 189, 248, 0.08)',
            },
          }}
        >
          Eksport
        </Button>

        <Menu
          anchorEl={exportAnchorEl}
          open={Boolean(exportAnchorEl)}
          onClose={handleExportClose}
          slotProps={{
            paper: {
              sx: {
                backgroundColor: '#131d31',
                color: '#f8fafc',
                borderRadius: 2.5,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              },
            },
          }}
        >
          <MenuItem onClick={handleDownloadCSV} sx={{ py: 1.2 }}>
            <ListItemIcon sx={{ color: '#10b981', minWidth: 32 }}>
              <TableChartIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="CSV fayl (Excel format)" />
          </MenuItem>
          <MenuItem onClick={handleDownloadJSON} sx={{ py: 1.2 }}>
            <ListItemIcon sx={{ color: '#6366f1', minWidth: 32 }}>
              <CodeIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="JSON format" />
          </MenuItem>
        </Menu>

        {onAddNewClick && (
          <Button
            variant="contained"
            startIcon={<AddCircleIcon />}
            onClick={onAddNewClick}
            sx={{
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: 2.5,
              px: 2.5,
              py: 0.9,
              boxShadow: '0 4px 14px rgba(59, 130, 246, 0.35)',
              '&:hover': {
                backgroundColor: '#2563eb',
              },
            }}
          >
            Yangi Biznes
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default TopHeader;
