import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
  Avatar,
  Divider,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import InsightsIcon from '@mui/icons-material/Insights';
import HubIcon from '@mui/icons-material/Hub';
import { summaryStats } from '../data/teamData';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    {
      path: '/',
      label: 'Asosiy Dashboard',
      icon: <DashboardIcon />,
      badge: 'Live',
      badgeColor: '#3b82f6',
    },
    {
      path: '/team',
      label: 'Jamoa Aʼzolari',
      icon: <PeopleIcon />,
      badge: `${summaryStats.totalMembers} aʼzo`,
      badgeColor: '#8b5cf6',
    },
    {
      path: '/records',
      label: 'Barcha Bizneslar',
      icon: <BusinessCenterIcon />,
      badge: `${summaryStats.totalRecords}`,
      badgeColor: '#10b981',
    },
    {
      path: '/analytics',
      label: 'Statistika & Tahlil',
      icon: <InsightsIcon />,
    },
  ];

  return (
    <Box
      component="aside"
      sx={{
        width: 270,
        height: '100vh',
        backgroundColor: '#0c1322',
        position: 'sticky',
        top: 0,
        left: 0,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        zIndex: 100,
        boxShadow: '4px 0 24px rgba(0, 0, 0, 0.4)',
      }}
    >
      {/* Brand Header */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
          background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.4) 0%, transparent 100%)',
        }}
      >
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
          }}
        >
          <HubIcon sx={{ color: '#fff', fontSize: 26 }} />
        </Box>
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              fontSize: '1.15rem',
              letterSpacing: '-0.3px',
              color: '#ffffff',
              lineHeight: 1.2,
            }}
          >
            AdminPortal
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: '#94a3b8',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}
          >
            Business Database
          </Typography>
        </Box>
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ p: 2, flex: 1, overflowY: 'auto' }}>
        <Typography
          variant="caption"
          sx={{
            px: 1.5,
            mb: 1,
            display: 'block',
            color: '#64748b',
            fontWeight: 700,
            fontSize: '0.7rem',
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
          }}
        >
          Navigatsiya
        </Typography>

        <List disablePadding>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.8 }}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  sx={{
                    borderRadius: '12px',
                    py: 1.3,
                    px: 1.8,
                    backgroundColor: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                    color: isActive ? '#ffffff' : '#94a3b8',
                    border: isActive ? '1px solid rgba(59, 130, 246, 0.35)' : '1px solid transparent',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      backgroundColor: isActive ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      color: '#ffffff',
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 36,
                      color: isActive ? '#38bdf8' : '#64748b',
                      transition: 'color 0.2s',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography sx={{ fontSize: '0.9rem', fontWeight: isActive ? 700 : 500, color: 'inherit' }}>
                        {item.label}
                      </Typography>
                    }
                  />
                  {item.badge && (
                    <Chip
                      label={item.badge}
                      size="small"
                      sx={{
                        height: 22,
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        backgroundColor: isActive
                          ? item.badgeColor || '#3b82f6'
                          : 'rgba(255, 255, 255, 0.08)',
                        color: isActive ? '#ffffff' : '#cbd5e1',
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* System Status / Quick Info */}
      <Box sx={{ p: 2, mx: 2, mb: 2, backgroundColor: '#131d31', borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
            Tizim holati
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#22c55e',
                boxShadow: '0 0 8px #22c55e',
              }}
            />
            <Typography variant="caption" sx={{ color: '#4ade80', fontWeight: 700, fontSize: '0.7rem' }}>
              ONLINE
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2" sx={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.8rem' }}>
          {summaryStats.totalRecords} ta biznes yuklangan
        </Typography>
        <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.3 }}>
          {summaryStats.citiesCount} shahar boʻyicha toʻliq baza
        </Typography>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.07)' }} />

      {/* User profile footer */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          backgroundColor: '#0a0f1d',
        }}
      >
        <Avatar
          sx={{
            width: 38,
            height: 38,
            bgcolor: '#3b82f6',
            fontSize: '0.95rem',
            fontWeight: 700,
            border: '2px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          AD
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              color: '#f8fafc',
              fontSize: '0.85rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            Admin Boshqaruv
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>
            superadmin@crm.uz
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
