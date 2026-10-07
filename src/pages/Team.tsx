import { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardActionArea,
  Chip,
  Button,
  TextField,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import DownloadIcon from '@mui/icons-material/Download';
import TopHeader from '../components/TopHeader';
import Modal from '../components/Modal';
import RecordDetailModal from '../components/RecordDetailModal';
import type { TeamMember, BusinessRecord } from '../data/teamData';
import { allTeamMembers, exportToCSV } from '../data/teamData';

const Team = () => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [modalSearchQuery, setModalSearchQuery] = useState('');
  const [selectedDetailRecord, setSelectedDetailRecord] = useState<BusinessRecord | null>(null);

  const handleCardClick = (member: TeamMember) => {
    setSelectedMember(member);
    setModalSearchQuery('');
    setIsModalOpen(true);
  };

  const filteredMembers = allTeamMembers.filter(
    (m) =>
      m.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
      m.city.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(memberSearchQuery.toLowerCase())
  );

  const filteredMemberRecords = selectedMember
    ? selectedMember.records.filter((rec) => {
        const query = modalSearchQuery.toLowerCase();
        return (
          rec.name.toLowerCase().includes(query) ||
          rec.category.toLowerCase().includes(query) ||
          rec.phone.toLowerCase().includes(query) ||
          rec.address.toLowerCase().includes(query)
        );
      })
    : [];

  return (
    <Box sx={{ width: '100%' }}>
      <TopHeader
        title="Jamoa Aʼzolari"
        subtitle="7 nafar aʼzo tomonidan toʻplangan barcha biznes maʼlumotlari"
        searchQuery={memberSearchQuery}
        onSearchChange={setMemberSearchQuery}
      />

      <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>
        Jamoa aʼzosini tanlang va uning barcha kiritgan bizneslari, telefon raqamlari va manzillarini koʻring.
      </Typography>

      {/* Member Cards Grid */}
      <Grid container spacing={3}>
        {filteredMembers.map((member) => (
          <Grid key={member.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Card
              className="glow-card"
              sx={{
                backgroundColor: '#121b2d',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 3.5,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'hidden',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  borderColor: member.color,
                  transform: 'translateY(-6px)',
                  boxShadow: `0 12px 30px -8px ${member.color}40`,
                },
              }}
            >
              <CardActionArea
                onClick={() => handleCardClick(member)}
                sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#f8fafc', mb: 0.5, textAlign: 'center' }}>
                  {member.name}
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    color: '#94a3b8',
                    textAlign: 'center',
                    display: 'block',
                    mb: 1.5,
                    fontSize: '0.8rem',
                  }}
                >
                  {member.role}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip
                    label={`${member.recordsCount} ta biznes`}
                    size="small"
                    sx={{
                      backgroundColor: member.color,
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                    }}
                  />
                  <Chip
                    label={member.city}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      color: '#cbd5e1',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  />
                </Box>

                {/* Categories badges */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, justifyContent: 'center', mt: 'auto' }}>
                  {member.categories.slice(0, 3).map((cat) => (
                    <Chip
                      key={cat}
                      label={cat}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        color: '#94a3b8',
                        fontSize: '0.7rem',
                        height: 22,
                      }}
                    />
                  ))}
                </Box>
              </CardActionArea>

              <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', gap: 1 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="small"
                  onClick={() => handleCardClick(member)}
                  sx={{
                    color: '#38bdf8',
                    borderColor: 'rgba(56, 189, 248, 0.3)',
                    textTransform: 'none',
                    fontWeight: 700,
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: 'rgba(56, 189, 248, 0.1)',
                      borderColor: '#38bdf8',
                    },
                  }}
                >
                  Bazasini ochish
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => exportToCSV(member.records, `${member.name}-bizneslar.csv`)}
                  sx={{
                    color: '#94a3b8',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    minWidth: 40,
                    p: 0,
                    borderRadius: 2,
                    '&:hover': {
                      color: '#fff',
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                  }}
                  title="CSV ga yuklash"
                >
                  <DownloadIcon fontSize="small" />
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Member Data Modal */}
      {selectedMember && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#f8fafc', lineHeight: 1.2 }}>
                {selectedMember.name} tomonidan kiritilgan bizneslar
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                {selectedMember.role} • {selectedMember.city}
              </Typography>
            </Box>
          }
          subtitle={`Jami ${selectedMember.recordsCount} ta biznes yozuvi`}
        >
          {/* Modal Toolbar: Search and Export */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
              mb: 3,
              p: 2,
              backgroundColor: '#111a2e',
              borderRadius: 2.5,
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <TextField
              size="small"
              placeholder={`${selectedMember.name} bazasidan qidirish...`}
              value={modalSearchQuery}
              onChange={(e) => setModalSearchQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#64748b', fontSize: 18 }} />
                    </InputAdornment>
                  ),
                  sx: {
                    color: '#fff',
                    backgroundColor: '#16223b',
                    borderRadius: 2,
                    fontSize: '0.85rem',
                    minWidth: 260,
                  },
                },
              }}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                Topildi: <strong style={{ color: '#fff' }}>{filteredMemberRecords.length}</strong> ta
              </Typography>
              <Button
                size="small"
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={() => exportToCSV(selectedMember.records, `${selectedMember.name}-bizneslar.csv`)}
                sx={{
                  backgroundColor: '#10b981',
                  color: '#fff',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2,
                  '&:hover': { backgroundColor: '#059669' },
                }}
              >
                CSV ga yuklash
              </Button>
            </Box>
          </Box>

          {/* Cards Grid of this member's data */}
          {filteredMemberRecords.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="body1" sx={{ color: '#94a3b8' }}>
                Hech qanday biznes topilmadi.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {filteredMemberRecords.map((item) => (
                <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card
                    onClick={() => setSelectedDetailRecord(item)}
                    sx={{
                      backgroundColor: '#121b2d',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: 3,
                      p: 2.2,
                      cursor: 'pointer',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: '#38bdf8',
                        transform: 'translateY(-3px)',
                        boxShadow: '0 8px 24px rgba(56, 189, 248, 0.15)',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.2, mb: 1.5 }}>
                      <Box
                        sx={{
                          p: 0.8,
                          borderRadius: 1.5,
                          backgroundColor: 'rgba(59, 130, 246, 0.15)',
                          color: '#38bdf8',
                          display: 'flex',
                        }}
                      >
                        <BusinessIcon fontSize="small" />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.95rem', lineHeight: 1.3 }}
                        >
                          {item.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: '#38bdf8', fontWeight: 600, display: 'block', mt: 0.3 }}
                        >
                          {item.category}
                        </Typography>
                      </Box>
                    </Box>

                    {item.phone && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <PhoneIcon sx={{ color: '#4ade80', fontSize: 16 }} />
                        <Typography variant="body2" sx={{ color: '#e2e8f0', fontSize: '0.82rem', fontWeight: 600 }}>
                          {item.phone}
                        </Typography>
                      </Box>
                    )}

                    {item.address && (
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mt: 'auto', pt: 1 }}>
                        <LocationOnIcon sx={{ color: '#94a3b8', fontSize: 16, mt: 0.2 }} />
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#94a3b8',
                            fontSize: '0.78rem',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {item.address}
                        </Typography>
                      </Box>
                    )}

                    <Box
                      sx={{
                        mt: 1.5,
                        pt: 1.2,
                        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Chip
                        label="Batafsil maʼlumot"
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.68rem',
                          backgroundColor: 'rgba(56, 189, 248, 0.12)',
                          color: '#38bdf8',
                          fontWeight: 600,
                        }}
                      />
                      <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 700, fontSize: '0.75rem' }}>
                        Ochish →
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Modal>
      )}

      {/* Detail Modal when any business card is clicked */}
      <RecordDetailModal
        record={selectedDetailRecord}
        onClose={() => setSelectedDetailRecord(null)}
      />
    </Box>
  );
};

export default Team;
