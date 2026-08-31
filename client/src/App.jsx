import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import MainLayout from './layouts/MainLayout';
import AdminRoute from './layouts/AdminRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DailyGamePage from './pages/DailyGamePage';
import PracticeModePage from './pages/PracticeModePage';
import ResultPage from './pages/ResultPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import CreateChallengePage from './pages/CreateChallengePage';
import ChallengePage from './pages/ChallengePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSongs from './pages/admin/AdminSongs';
import AdminUsers from './pages/admin/AdminUsers';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="leaderboard" element={<LeaderboardPage />} />

            {/* Game Routes — open to everyone, no login required */}
            <Route path="play" element={<DailyGamePage />} />
            <Route path="practice" element={<PracticeModePage />} />
            <Route path="results/:gameId" element={<ResultPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="challenge/create" element={<CreateChallengePage />} />
            <Route path="challenge/:code" element={<ChallengePage />} />

            {/* Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="admin/songs" element={<AdminSongs />} />
              <Route path="admin/users" element={<AdminUsers />} />
            </Route>
          </Route>
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
