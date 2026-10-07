import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Paper,
  LinearProgress,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PhoneIcon from '@mui/icons-material/Phone';
import TopHeader from '../components/TopHeader';
import RecordDetailModal from '../components/RecordDetailModal';
import AddRecordModal from '../components/AddRecordModal';
import Modal from '../components/Modal';
import type { BusinessRecord, TeamMember } from '../data/teamData';
import {
  allBusinessRecords,
  allTeamMembers,
  summaryStats,
  exportToCSV,
} from '../data/teamData';

const Home = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState<BusinessRecord[]>(allBusinessRecords);
  const [selectedRecord, setSelectedRecord] = useState<BusinessRecord | null>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>('all');

  const stats = [
    {
      title: 'Jami Bizneslar',
      value: `${records.length} ta`,
      sub: 'Baza toʻliq yuklandi',
      icon: <AssessmentIcon sx={{ fontSize: 32, color: '#38bdf8' }} />,
      color: '#3b82f6',
      bgGlow: 'rgba(59, 130, 246, 0.15)',
    },
    {
      title: 'Jamoa Aʼzolari',
      value: `${allTeamMembers.length} kishi`,
      sub: 'Barcha aʼzolar faol',
      icon: <PeopleIcon sx={{ fontSize: 32, color: '#a78bfa' }} />,
      color: '#8b5cf6',
      bgGlow: 'rgba(139, 92, 246, 0.15)',
    },
    {
      title: 'Qamrab Olingan Shaharlar',
      value: `${summaryStats.citiesCount} shahar`,
      sub: 'Toshkent, Buxoro, Qarshi...',
      icon: <LocationCityIcon sx={{ fontSize: 32, color: '#f472b6' }} />,
      color: '#ec4899',
      bgGlow: 'rgba(236, 72, 153, 0.15)',
    },
    {
      title: 'Aloqa Aniqligi',
      value: `${summaryStats.verifiedPercentage}%`,
      sub: 'Telefon raqamlar tasdiqlangan',
      icon: <TrendingUpIcon sx={{ fontSize: 32, color: '#34d399' }} />,
      color: '#10b981',
      bgGlow: 'rgba(16, 185, 129, 0.15)',
    },
  ];

  const handleAddNewRecord = (newRecord: BusinessRecord) => {
    setRecords((prev) => [newRecord, ...prev]);
  };

  const filteredRecentRecords = records
    .filter((r) => selectedCityFilter === 'all' || r.city.toLowerCase() === selectedCityFilter.toLowerCase())
    .slice(0, 10);

  return (
    <Box sx={{ width: '100%' }}>
      <TopHeader
        title="Admin Dashboard"
        subtitle="Bizneslar bazasi va jamoa faoliyati boʻyicha tezkor umumiy koʻrinish"
        onAddNewClick={() => setIsAddModalOpen(true)}
      />

      {/* KPI Stats Grid */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              className="glow-card"
              sx={{
                backgroundColor: '#121b2d',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 3.5,
                p: 2.5,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 600, mb: 0.5 }}>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 800, letterSpacing: '-0.5px' }}>
                      {stat.value}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2.5,
                      backgroundColor: stat.bgGlow,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
                  {stat.sub}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Action Buttons */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#f8fafc', fontWeight: 700 }}>
          Tezkor Amallar
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => setIsAddModalOpen(true)}
              startIcon={<AddIcon />}
              sx={{
                backgroundColor: '#2563eb',
                py: 1.8,
                borderRadius: 2.5,
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.95rem',
                boxShadow: '0 4px 16px rgba(37, 99, 235, 0.3)',
                '&:hover': { backgroundColor: '#1d4ed8' },
              }}
            >
              Yangi Biznes Qoʻshish
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => exportToCSV(records, 'bizneslar-eksport.csv')}
              startIcon={<DownloadIcon />}
              sx={{
                backgroundColor: '#059669',
                py: 1.8,
                borderRadius: 2.5,
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.95rem',
                boxShadow: '0 4px 16px rgba(5, 150, 105, 0.3)',
                '&:hover': { backgroundColor: '#047857' },
              }}
            >
              CSV / Excel ga Eksport
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate('/records')}
              startIcon={<StorefrontIcon />}
              sx={{
                backgroundColor: '#7c3aed',
                py: 1.8,
                borderRadius: 2.5,
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.95rem',
                boxShadow: '0 4px 16px rgba(124, 58, 237, 0.3)',
                '&:hover': { backgroundColor: '#6d28d9' },
              }}
            >
              Barcha 282+ Bizneslar
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate('/team')}
              startIcon={<PeopleIcon />}
              sx={{
                backgroundColor: '#0284c7',
                py: 1.8,
                borderRadius: 2.5,
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.95rem',
                boxShadow: '0 4px 16px rgba(2, 132, 199, 0.3)',
                '&:hover': { backgroundColor: '#0369a1' },
              }}
            >
              Jamoa Maʼlumotlari
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Team Members Performance Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ color: '#f8fafc', fontWeight: 700 }}>
              Jamoa Aʼzolari va Yozuvlar
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              Istalgan aʼzoga bosib, uning barcha yozuvlarini oching
            </Typography>
          </Box>
          <Button
            onClick={() => navigate('/team')}
            endIcon={<ArrowForwardIcon />}
            sx={{ color: '#38bdf8', textTransform: 'none', fontWeight: 600 }}
          >
            Jamoa sahifasiga oʻtish
          </Button>
        </Box>

        <Paper
          sx={{
            backgroundColor: '#121b2d',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 3.5,
            overflow: 'hidden',
          }}
        >
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: '#16223b' }}>
                <TableRow>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 700, py: 1.8 }}>Jamoa Aʼzosi</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 700, py: 1.8 }}>Hudud</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 700, py: 1.8 }}>Yozuvlar Soni</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 700, py: 1.8 }}>Hissa</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 700, py: 1.8, textAlign: 'right' }}>Amal</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allTeamMembers.map((member) => {
                  const share = Math.round((member.recordsCount / allBusinessRecords.length) * 100);
                  return (
                    <TableRow
                      key={member.id}
                      hover
                      onClick={() => setSelectedMember(member)}
                      sx={{
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        '&:hover': { backgroundColor: 'rgba(59, 130, 246, 0.08)' },
                      }}
                    >
                      <TableCell sx={{ color: '#ffffff', py: 1.6 }}>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                            {member.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748b' }}>
                            {member.role}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 1.6 }}>
                        <Chip
                          label={member.city}
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.06)',
                            color: '#cbd5e1',
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ py: 1.6 }}>
                        <Chip
                          label={`${member.recordsCount} ta biznes`}
                          size="small"
                          sx={{
                            backgroundColor: `${member.color}25`,
                            color: member.color,
                            fontWeight: 700,
                            border: `1px solid ${member.color}50`,
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ py: 1.6, minWidth: 150 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <LinearProgress
                            variant="determinate"
                            value={share}
                            sx={{
                              flex: 1,
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: 'rgba(255, 255, 255, 0.06)',
                              '& .MuiLinearProgress-bar': { backgroundColor: member.color },
                            }}
                          />
                          <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                            {share}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 1.6, textAlign: 'right' }}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMember(member);
                          }}
                          sx={{
                            textTransform: 'none',
                            color: '#38bdf8',
                            borderColor: 'rgba(56, 189, 248, 0.3)',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            borderRadius: 2,
                            '&:hover': {
                              backgroundColor: 'rgba(56, 189, 248, 0.1)',
                              borderColor: '#38bdf8',
                            },
                          }}
                        >
                          Bazasini ochish
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      {/* Recent Business Records Section */}
      <Box>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ color: '#f8fafc', fontWeight: 700 }}>
              Soʻnggi Qoʻshilgan Bizneslar
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              Istalgan biznesga bosib, uning telefon raqamini nusxalash yoki xaritadan koʻrish mumkin
            </Typography>
          </Box>

          {/* City filter chips */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label="Barchasi"
              onClick={() => setSelectedCityFilter('all')}
              clickable
              sx={{
                backgroundColor: selectedCityFilter === 'all' ? '#3b82f6' : '#16223b',
                color: selectedCityFilter === 'all' ? '#fff' : '#94a3b8',
                fontWeight: 600,
              }}
            />
            {summaryStats.cities.slice(0, 4).map((city) => (
              <Chip
                key={city}
                label={city}
                onClick={() => setSelectedCityFilter(city)}
                clickable
                sx={{
                  backgroundColor: selectedCityFilter === city ? '#3b82f6' : '#16223b',
                  color: selectedCityFilter === city ? '#fff' : '#94a3b8',
                  fontWeight: 600,
                }}
              />
            ))}
          </Box>
        </Box>

        <Paper
          sx={{
            backgroundColor: '#121b2d',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 3.5,
            overflow: 'hidden',
          }}
        >
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: '#16223b' }}>
                <TableRow>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 700, py: 1.8 }}>Biznes Nomi</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 700, py: 1.8 }}>Kategoriya</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 700, py: 1.8 }}>Telefon</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 700, py: 1.8 }}>Shahar / Manzil</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 700, py: 1.8 }}>Masʼul Aʼzo</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 700, py: 1.8, textAlign: 'right' }}>Amal</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRecentRecords.map((item) => (
                  <TableRow
                    key={item.id}
                    hover
                    onClick={() => setSelectedRecord(item)}
                    sx={{
                      cursor: 'pointer',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      '&:hover': { backgroundColor: 'rgba(59, 130, 246, 0.08)' },
                    }}
                  >
                    <TableCell sx={{ py: 1.6 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#ffffff' }}>
                        {item.name}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1.6 }}>
                      <Chip
                        label={item.category}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(56, 189, 248, 0.12)',
                          color: '#38bdf8',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 1.6, color: '#4ade80', fontWeight: 600, fontSize: '0.85rem' }}>
                      {item.phone ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                          <PhoneIcon sx={{ fontSize: 16 }} />
                          {item.phone}
                        </Box>
                      ) : (
                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                          Mavjud emas
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ py: 1.6, color: '#94a3b8', fontSize: '0.82rem', maxWidth: 220 }}>
                      <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.address || item.city}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 1.6 }}>
                      <Chip
                        label={item.member}
                        size="small"
                        sx={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#cbd5e1' }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 1.6, textAlign: 'right' }}>
                      <Button
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRecord(item);
                        }}
                        sx={{ textTransform: 'none', color: '#38bdf8', fontWeight: 600, fontSize: '0.8rem' }}
                      >
                        Batafsil
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/records')}
            endIcon={<ArrowForwardIcon />}
            sx={{
              color: '#38bdf8',
              borderColor: 'rgba(56, 189, 248, 0.4)',
              textTransform: 'none',
              fontWeight: 700,
              px: 3,
              py: 1,
              borderRadius: 2.5,
              '&:hover': { backgroundColor: 'rgba(56, 189, 248, 0.1)', borderColor: '#38bdf8' },
            }}
          >
            Barcha {records.length} ta biznesni toʻliq koʻrish
          </Button>
        </Box>
      </Box>

      {/* Record detail modal */}
      <RecordDetailModal record={selectedRecord} onClose={() => setSelectedRecord(null)} />

      {/* Team Member data modal */}
      {selectedMember && (
        <Modal
          isOpen={Boolean(selectedMember)}
          onClose={() => setSelectedMember(null)}
          title={
            <Box>
              <span>{selectedMember.name} — Barcha Bizneslar</span>
            </Box>
          }
          subtitle={`${selectedMember.city} • Jami ${selectedMember.records.length} ta biznes roʻyxati`}
        >
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              Istalgan kartochkaga bosib, aloqa yoki xaritani koʻring
            </Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={() => exportToCSV(selectedMember.records, `${selectedMember.name}-bizneslar.csv`)}
              startIcon={<DownloadIcon />}
              sx={{ color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.3)', textTransform: 'none' }}
            >
              Ushbu aʼzo maʼlumotlarini yuklab olish
            </Button>
          </Box>
          <Grid container spacing={2}>
            {selectedMember.records.map((rec) => (
              <Grid key={rec.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card
                  onClick={() => setSelectedRecord(rec)}
                  sx={{
                    p: 2,
                    backgroundColor: '#121b2d',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 2.5,
                    cursor: 'pointer',
                    '&:hover': { borderColor: '#3b82f6', transform: 'translateY(-2px)' },
                    transition: 'all 0.2s',
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#fff', mb: 0.5 }}>
                    {rec.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#38bdf8', display: 'block', mb: 1 }}>
                    {rec.category}
                  </Typography>
                  {rec.phone && (
                    <Typography variant="body2" sx={{ color: '#4ade80', fontSize: '0.8rem', mb: 0.5 }}>
                      📞 {rec.phone}
                    </Typography>
                  )}
                  {rec.address && (
                    <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                      📍 {rec.address}
                    </Typography>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
        </Modal>
      )}

      {/* Add New Record Modal */}
      <AddRecordModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddNewRecord}
      />
    </Box>
  );
};

export default Home;
