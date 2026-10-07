import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import Sidebar from './components/Navbar';
import Home from './pages/Home';
import Team from './pages/Team';
import Records from './pages/Records';
import Analytics from './pages/Analytics';
import './App.css';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#1d4ed8',
    },
    secondary: {
      main: '#8b5cf6',
    },
    background: {
      default: '#090d16',
      paper: '#121b2d',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
    },
    divider: 'rgba(255, 255, 255, 0.08)',
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Roboto", "Segoe UI", system-ui, sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Box
          sx={{
            display: 'flex',
            minHeight: '100vh',
            width: '100%',
            backgroundColor: '#090d16',
          }}
        >
          {/* Side Navbar */}
          <Sidebar />

          {/* Main Admin Viewport */}
          <Box
            component="main"
            sx={{
              flex: 1,
              minWidth: 0,
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#090d16',
            }}
          >
            <Box
              sx={{
                flex: 1,
                p: { xs: 2.5, md: 4 },
                maxWidth: 1600,
                width: '100%',
                mx: 'auto',
              }}
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/team" element={<Team />} />
                <Route path="/records" element={<Records />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Box>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
