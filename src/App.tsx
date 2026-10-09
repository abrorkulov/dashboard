import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import RequireAuth from './auth/RequireAuth';
import Home from './pages/Home';
import Team from './pages/Team';
import Records from './pages/Records';
import Analytics from './pages/Analytics';
import Instagram from './pages/Instagram';
import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Tizimga kirish sahifasi */}
        <Route path="/login" element={<Login />} />

        {/* Barcha sahifalar umumiy qoliplar (AppLayout) ichida va himoyalangan */}
        <Route
          element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/team" element={<Team />} />
          <Route path="/records" element={<Records />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/instagram" element={<Instagram />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
