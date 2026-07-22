import { Routes, Route } from 'react-router-dom';
import PublicLayout from '../shared/components/PublicLayout';
import AdminLayout from '../shared/components/AdminLayout';
import HomePage from '../features/public/HomePage';
import SchedulePage from '../features/public/SchedulePage';
import ResultsPage from '../features/public/ResultsPage';
import StandingsPage from '../features/public/StandingsPage';
import TeamsPage from '../features/public/TeamsPage';
import PlayersPage from '../features/public/PlayersPage';
import NewsPage from '../features/public/NewsPage';
import GalleryPage from '../features/public/GalleryPage';
import ContactPage from '../features/public/ContactPage';
import AdminDashboardPage from '../features/admin/AdminDashboardPage';
import { GuestRoute, LoginPage, ProtectedRoute } from '../features/auth';

export default function AppRouter() {
  return (
    <Routes>
      {/* Guest-only: redirect to /admin if already authenticated */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Public site */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/standings" element={<StandingsPage />} />
        <Route path="/teams" element={<TeamsPage />} />
        <Route path="/players" element={<PlayersPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* Protected admin area */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
