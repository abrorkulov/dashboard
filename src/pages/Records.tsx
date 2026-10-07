import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardActionArea,
  Chip,
  TextField,
  MenuItem,
  Pagination,
  Button,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import TopHeader from '../components/TopHeader';
import RecordDetailModal from '../components/RecordDetailModal';
import AddRecordModal from '../components/AddRecordModal';
import type { BusinessRecord } from '../data/teamData';
import { allBusinessRecords, allTeamMembers, summaryStats } from '../data/teamData';

const Records = () => {
  const [records, setRecords] = useState<BusinessRecord[]>(allBusinessRecords);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedMember, setSelectedMember] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [page, setPage] = useState(1);
  const [selectedRecord, setSelectedRecord] = useState<BusinessRecord | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const pageSize = 24;

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchesSearch =
        searchQuery === '' ||
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.member.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCity = selectedCity === 'all' || r.city.toLowerCase() === selectedCity.toLowerCase();
      const matchesMember = selectedMember === 'all' || r.member.toLowerCase() === selectedMember.toLowerCase();

      return matchesSearch && matchesCity && matchesMember;
    });
  }, [records, searchQuery, selectedCity, selectedMember]);

  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, page, pageSize]);

  const handleAddNew = (newRecord: BusinessRecord) => {
    setRecords((prev) => [newRecord, ...prev]);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <TopHeader
        title="Barcha Bizneslar"
        subtitle={`Jami ${records.length} ta biznes yozuvlari roʻyxati`}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setPage(1);
        }}
        onAddNewClick={() => setIsAddModalOpen(true)}
      />

      {/* Filter and view control bar */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
          p: 2,
          backgroundColor: '#111a2e',
          borderRadius: 3,
          border: '1px solid rgba(255, 255, 255, 0.07)',
        }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
          {/* City filter */}
          <TextField
            select
            size="small"
            label="Shahar"
            value={selectedCity}
            onChange={(e) => {
              setSelectedCity(e.target.value);
              setPage(1);
            }}
            slotProps={{
              inputLabel: { sx: { color: '#94a3b8' } },
              input: {
                sx: {
                  color: '#fff',
                  backgroundColor: '#16223b',
                  borderRadius: 2,
                  minWidth: 140,
                  fontSize: '0.85rem',
                },
              },
            }}
          >
            <MenuItem value="all">Barcha shaharlar ({records.length})</MenuItem>
            {summaryStats.cities.map((city) => (
              <MenuItem key={city} value={city}>
                {city}
              </MenuItem>
            ))}
          </TextField>

          {/* Member filter */}
          <TextField
            select
            size="small"
            label="Jamoa Aʼzosi"
            value={selectedMember}
            onChange={(e) => {
              setSelectedMember(e.target.value);
              setPage(1);
            }}
            slotProps={{
              inputLabel: { sx: { color: '#94a3b8' } },
              input: {
                sx: {
                  color: '#fff',
                  backgroundColor: '#16223b',
                  borderRadius: 2,
                  minWidth: 150,
                  fontSize: '0.85rem',
                },
              },
            }}
          >
            <MenuItem value="all">Barcha aʼzolar (7)</MenuItem>
            {allTeamMembers.map((m) => (
              <MenuItem key={m.id} value={m.name}>
                {m.name} ({m.recordsCount})
              </MenuItem>
            ))}
          </TextField>

          {(selectedCity !== 'all' || selectedMember !== 'all' || searchQuery !== '') && (
            <Button
              size="small"
              onClick={() => {
                setSelectedCity('all');
                setSelectedMember('all');
                setSearchQuery('');
                setPage(1);
              }}
              sx={{ color: '#f87171', textTransform: 'none', fontSize: '0.8rem' }}
            >
              Filtrlarni tozalash
            </Button>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Topildi: <strong style={{ color: '#fff' }}>{filteredRecords.length}</strong> ta biznes
          </Typography>

          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, val) => val && setViewMode(val)}
            size="small"
            sx={{
              backgroundColor: '#16223b',
              borderRadius: 2,
              '& .MuiToggleButton-root': {
                color: '#94a3b8',
                border: 'none',
                px: 1.2,
                py: 0.6,
                '&.Mui-selected': {
                  color: '#38bdf8',
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                },
              },
            }}
          >
            <ToggleButton value="grid">
              <ViewModuleIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="table">
              <ViewListIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      {/* Grid Mode */}
      {viewMode === 'grid' ? (
        <Grid container spacing={2}>
          {paginatedRecords.map((record) => (
            <Grid key={record.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Card
                className="glow-card"
                onClick={() => setSelectedRecord(record)}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: '#121b2d',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 3,
                  cursor: 'pointer',
                  overflow: 'hidden',
                  position: 'relative',
                  '&:hover': {
                    borderColor: 'rgba(59, 130, 246, 0.4)',
                  },
                }}
              >
                <CardActionArea sx={{ flex: 1, p: 2.2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                  {/* Top tags */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1.5 }}>
                    <Chip
                      label={record.city}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(59, 130, 246, 0.15)',
                        color: '#60a5fa',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        height: 22,
                      }}
                    />
                    <Chip
                      label={record.member}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.06)',
                        color: '#94a3b8',
                        fontSize: '0.72rem',
                        height: 22,
                      }}
                    />
                  </Box>

                  {/* Business Name */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.2, mb: 1.5, width: '100%' }}>
                    <Box
                      sx={{
                        p: 0.8,
                        borderRadius: 1.5,
                        backgroundColor: 'rgba(59, 130, 246, 0.15)',
                        color: '#38bdf8',
                        display: 'flex',
                        mt: 0.3,
                      }}
                    >
                      <BusinessIcon sx={{ fontSize: 20 }} />
                    </Box>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 700,
                        color: '#f8fafc',
                        fontSize: '0.98rem',
                        lineHeight: 1.3,
                        flex: 1,
                      }}
                    >
                      {record.name}
                    </Typography>
                  </Box>

                  {/* Category */}
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#38bdf8',
                      fontWeight: 600,
                      mb: 1.5,
                      display: 'block',
                      backgroundColor: 'rgba(56, 189, 248, 0.08)',
                      px: 1,
                      py: 0.3,
                      borderRadius: 1.2,
                    }}
                  >
                    {record.category}
                  </Typography>

                  {/* Phone */}
                  {record.phone && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, width: '100%' }}>
                      <PhoneIcon sx={{ color: '#4ade80', fontSize: 16 }} />
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#e2e8f0',
                          fontSize: '0.82rem',
                          fontWeight: 500,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {record.phone}
                      </Typography>
                    </Box>
                  )}

                  {/* Address */}
                  {record.address && (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, width: '100%', mt: 'auto' }}>
                      <LocationOnIcon sx={{ color: '#94a3b8', fontSize: 16, mt: 0.2 }} />
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#94a3b8',
                          fontSize: '0.78rem',
                          lineHeight: 1.4,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {record.address}
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ mt: 1.5, pt: 1.2, borderTop: '1px solid rgba(255, 255, 255, 0.06)', width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                    <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 700, fontSize: '0.75rem' }}>
                      Batafsil koʻrish →
                    </Typography>
                  </Box>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        /* Table Mode */
        <Box
          sx={{
            backgroundColor: '#121b2d',
            borderRadius: 3,
            border: '1px solid rgba(255, 255, 255, 0.08)',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '2fr 1.5fr 1.5fr 2fr 1fr 100px',
              p: 2,
              backgroundColor: '#16223b',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              fontWeight: 700,
              fontSize: '0.82rem',
              color: '#94a3b8',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            <Box>Biznes Nomi</Box>
            <Box>Kategoriya</Box>
            <Box>Telefon</Box>
            <Box>Manzil</Box>
            <Box>Aʼzo</Box>
            <Box sx={{ textAlign: 'right' }}>Amal</Box>
          </Box>

          {paginatedRecords.map((record) => (
            <Box
              key={record.id}
              onClick={() => setSelectedRecord(record)}
              sx={{
                display: 'grid',
                gridTemplateColumns: '2fr 1.5fr 1.5fr 2fr 1fr 100px',
                p: 2,
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'background 0.2s',
                '&:hover': {
                  backgroundColor: 'rgba(59, 130, 246, 0.08)',
                },
              }}
            >
              <Box sx={{ pr: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#ffffff' }}>
                  {record.name}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  {record.city}
                </Typography>
              </Box>
              <Box sx={{ color: '#38bdf8', fontSize: '0.82rem', fontWeight: 600 }}>
                {record.category}
              </Box>
              <Box sx={{ color: '#4ade80', fontSize: '0.82rem', fontWeight: 500 }}>
                {record.phone || '—'}
              </Box>
              <Box sx={{ color: '#94a3b8', fontSize: '0.8rem', pr: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {record.address || '—'}
              </Box>
              <Box>
                <Chip label={record.member} size="small" sx={{ height: 20, fontSize: '0.7rem', backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#cbd5e1' }} />
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Button size="small" sx={{ textTransform: 'none', color: '#38bdf8', fontSize: '0.75rem', fontWeight: 600 }}>
                  Koʻrish
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, val) => {
              setPage(val);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            color="primary"
            sx={{
              '& .MuiPaginationItem-root': {
                color: '#94a3b8',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                '&.Mui-selected': {
                  backgroundColor: '#3b82f6',
                  color: '#ffffff',
                },
              },
            }}
          />
        </Box>
      )}

      {/* Detail Modal */}
      <RecordDetailModal
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />

      {/* Add Record Modal */}
      <AddRecordModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddNew}
      />
    </Box>
  );
};

export default Records;
