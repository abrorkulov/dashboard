import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import Home from './pages/Home';
import Team from './pages/Team';
import Records from './pages/Records';
import Analytics from './pages/Analytics';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Barcha sahifalar umumiy qoliplar (AppLayout) ichida */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/team" element={<Team />} />
          <Route path="/records" element={<Records />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
