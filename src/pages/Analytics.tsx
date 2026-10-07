import {
  Box,
  Typography,
  Grid,
  Card,
  LinearProgress,
  Chip,
} from '@mui/material';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import PeopleIcon from '@mui/icons-material/People';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import VerifiedIcon from '@mui/icons-material/Verified';
import TopHeader from '../components/TopHeader';
import { allBusinessRecords, allTeamMembers, summaryStats } from '../data/teamData';

const Analytics = () => {
  // Compute city distribution
  const cityCounts: Record<string, number> = {};
  allBusinessRecords.forEach((r) => {
    cityCounts[r.city] = (cityCounts[r.city] || 0) + 1;
  });

  const cityList = Object.entries(cityCounts).sort((a, b) => b[1] - a[1]);

  // Compute category distribution (top 6)
  const categoryCounts: Record<string, number> = {};
  allBusinessRecords.forEach((r) => {
    categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
  });
  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const phoneValidCount = allBusinessRecords.filter((r) => r.phone && r.phone.length > 5).length;
  const _addressValidCount = allBusinessRecords.filter((r) => r.address && r.address.length > 3).length;
  const _webValidCount = allBusinessRecords.filter((r) => Boolean(r.link)).length;

  return (
    <Box sx={{ width: '100%' }}>
      <TopHeader
        title="Statistika va Tahlil"
        subtitle="Bizneslar bazasi boʻyicha toʻliq tahliliy koʻrsatkichlar"
      />

      {/* KPI Cards */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              backgroundColor: '#121b2d',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: 3,
              p: 2.5,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                Jami Bizneslar
              </Typography>
              <VerifiedIcon sx={{ color: '#3b82f6' }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', mb: 0.5 }}>
              {summaryStats.totalRecords}
            </Typography>
            <Typography variant="caption" sx={{ color: '#22c55e', fontWeight: 600 }}>
              100% faol yozuvlar
            </Typography>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              backgroundColor: '#121b2d',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              borderRadius: 3,
              p: 2.5,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                Telefon Qamrovi
              </Typography>
              <PhoneInTalkIcon sx={{ color: '#8b5cf6' }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', mb: 0.5 }}>
              {Math.round((phoneValidCount / allBusinessRecords.length) * 100)}%
            </Typography>
            <Typography variant="caption" sx={{ color: '#a78bfa' }}>
              {phoneValidCount} ta yozuvda aloqa bor
            </Typography>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              backgroundColor: '#121b2d',
              border: '1px solid rgba(236, 72, 153, 0.2)',
              borderRadius: 3,
              p: 2.5,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                Qamrab Olingan Shaharlar
              </Typography>
              <LocationCityIcon sx={{ color: '#ec4899' }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', mb: 0.5 }}>
              {cityList.length}
            </Typography>
            <Typography variant="caption" sx={{ color: '#f472b6' }}>
              Toshkent, Buxoro, Qarshi va b.
            </Typography>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              backgroundColor: '#121b2d',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: 3,
              p: 2.5,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                Jamoa Samaradorligi
              </Typography>
              <PeopleIcon sx={{ color: '#10b981' }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', mb: 0.5 }}>
              ~{Math.round(summaryStats.totalRecords / summaryStats.totalMembers)}
            </Typography>
            <Typography variant="caption" sx={{ color: '#34d399' }}>
              Har bir aʼzoga oʻrtacha
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Charts / Progress bars section */}
      <Grid container spacing={3}>
        {/* City distribution */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              backgroundColor: '#121b2d',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 3,
              p: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff', mb: 2.5 }}>
              Shaharlar Boʻyicha Taqsimot
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.2 }}>
              {cityList.map(([cityName, count]) => {
                const percent = Math.round((count / allBusinessRecords.length) * 100);
                return (
                  <Box key={cityName}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                      <Typography variant="body2" sx={{ color: '#e2e8f0', fontWeight: 600 }}>
                        {cityName}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                        {count} ta ({percent}%)
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={percent}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'rgba(255, 255, 255, 0.06)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#3b82f6',
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>
                );
              })}
            </Box>
          </Card>
        </Grid>

        {/* Member contributions */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              backgroundColor: '#121b2d',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 3,
              p: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff', mb: 2.5 }}>
              Jamoa Aʼzolari Hissasi
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {allTeamMembers.map((m) => {
                const percent = Math.round((m.recordsCount / allBusinessRecords.length) * 100);
                return (
                  <Box key={m.id}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.6 }}>
                      <Typography variant="body2" sx={{ color: '#e2e8f0', fontWeight: 600 }}>
                        {m.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                        {m.recordsCount} ta ({percent}%)
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={percent}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'rgba(255, 255, 255, 0.06)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: m.color,
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>
                );
              })}
            </Box>
          </Card>
        </Grid>

        {/* Top categories */}
        <Grid size={{ xs: 12 }}>
          <Card
            sx={{
              backgroundColor: '#121b2d',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 3,
              p: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff', mb: 2.5 }}>
              Eng Ommabop Kategoriyalar
            </Typography>
            <Grid container spacing={2}>
              {topCategories.map(([category, count]) => (
                <Grid key={category} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Box
                    sx={{
                      p: 2,
                      backgroundColor: '#16223b',
                      borderRadius: 2.5,
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ color: '#f8fafc', fontWeight: 700, mb: 1 }}>
                      {category}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip
                        label={`${count} ta yozuv`}
                        size="small"
                        sx={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontWeight: 600 }}
                      />
                      <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                        {Math.round((count / allBusinessRecords.length) * 100)}% ulush
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;
