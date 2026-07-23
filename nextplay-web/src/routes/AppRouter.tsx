import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from '../shared/components/PublicLayout';
import AdminLayout from '../shared/components/AdminLayout';
import { GuestRoute, LoginPage, ProtectedRoute } from '../features/auth';

const AdminDashboardPage = lazy(() => import('../features/admin/AdminDashboardPage'));
const HomePage = lazy(() => import('../features/public/HomePage'));

const SeasonListPage = lazy(() => import('../features/seasons/pages/SeasonListPage'));
const SeasonDetailPage = lazy(() => import('../features/seasons/pages/SeasonDetailPage'));
const SeasonFormPage = lazy(() => import('../features/seasons/pages/SeasonFormPage'));

const TournamentListPage = lazy(() => import('../features/tournaments/pages/TournamentListPage'));
const TournamentDetailPage = lazy(() => import('../features/tournaments/pages/TournamentDetailPage'));
const TournamentFormPage = lazy(() => import('../features/tournaments/pages/TournamentFormPage'));

const DivisionListPage = lazy(() => import('../features/divisions/pages/DivisionListPage'));
const DivisionDetailPage = lazy(() => import('../features/divisions/pages/DivisionDetailPage'));
const DivisionFormPage = lazy(() => import('../features/divisions/pages/DivisionFormPage'));

const VenueListPage = lazy(() => import('../features/venues/pages/VenueListPage'));
const VenueFormPage = lazy(() => import('../features/venues/pages/VenueFormPage'));

const TeamListPage = lazy(() => import('../features/teams/pages/TeamListPage'));
const TeamDetailPage = lazy(() => import('../features/teams/pages/TeamDetailPage'));
const TeamFormPage = lazy(() => import('../features/teams/pages/TeamFormPage'));

const CoachListPage = lazy(() => import('../features/coaches/pages/CoachListPage'));
const CoachDetailPage = lazy(() => import('../features/coaches/pages/CoachDetailPage'));
const CoachFormPage = lazy(() => import('../features/coaches/pages/CoachFormPage'));

const PlayerListPage = lazy(() => import('../features/players/pages/PlayerListPage'));
const PlayerDetailPage = lazy(() => import('../features/players/pages/PlayerDetailPage'));
const PlayerFormPage = lazy(() => import('../features/players/pages/PlayerFormPage'));

const GameListPage = lazy(() => import('../features/games/pages/GameListPage'));
const GameDetailPage = lazy(() => import('../features/games/pages/GameDetailPage'));
const GameFormPage = lazy(() => import('../features/games/pages/GameFormPage'));

const RefereeListPage = lazy(() => import('../features/referees/pages/RefereeListPage'));
const RefereeFormPage = lazy(() => import('../features/referees/pages/RefereeFormPage'));

function LazyPage({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    }>
      {children}
    </Suspense>
  );
}

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<PublicLayout />}>
        <Route path="/" element={<LazyPage><HomePage /></LazyPage>} />
        <Route path="/schedule" element={<LazyPage><HomePage /></LazyPage>} />
        <Route path="/results" element={<LazyPage><HomePage /></LazyPage>} />
        <Route path="/standings" element={<LazyPage><HomePage /></LazyPage>} />
        <Route path="/teams" element={<LazyPage><HomePage /></LazyPage>} />
        <Route path="/players" element={<LazyPage><HomePage /></LazyPage>} />
        <Route path="/news" element={<LazyPage><HomePage /></LazyPage>} />
        <Route path="/gallery" element={<LazyPage><HomePage /></LazyPage>} />
        <Route path="/contact" element={<LazyPage><HomePage /></LazyPage>} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<LazyPage><AdminDashboardPage /></LazyPage>} />

          <Route path="seasons" element={<LazyPage><SeasonListPage /></LazyPage>} />
          <Route path="seasons/new" element={<LazyPage><SeasonFormPage /></LazyPage>} />
          <Route path="seasons/:id" element={<LazyPage><SeasonDetailPage /></LazyPage>} />
          <Route path="seasons/:id/edit" element={<LazyPage><SeasonFormPage /></LazyPage>} />

          <Route path="tournaments" element={<LazyPage><TournamentListPage /></LazyPage>} />
          <Route path="tournaments/new" element={<LazyPage><TournamentFormPage /></LazyPage>} />
          <Route path="tournaments/:id" element={<LazyPage><TournamentDetailPage /></LazyPage>} />
          <Route path="tournaments/:id/edit" element={<LazyPage><TournamentFormPage /></LazyPage>} />

          <Route path="divisions" element={<LazyPage><DivisionListPage /></LazyPage>} />
          <Route path="divisions/new" element={<LazyPage><DivisionFormPage /></LazyPage>} />
          <Route path="divisions/:id" element={<LazyPage><DivisionDetailPage /></LazyPage>} />
          <Route path="divisions/:id/edit" element={<LazyPage><DivisionFormPage /></LazyPage>} />

          <Route path="venues" element={<LazyPage><VenueListPage /></LazyPage>} />
          <Route path="venues/new" element={<LazyPage><VenueFormPage /></LazyPage>} />
          <Route path="venues/:id/edit" element={<LazyPage><VenueFormPage /></LazyPage>} />

          <Route path="teams" element={<LazyPage><TeamListPage /></LazyPage>} />
          <Route path="teams/new" element={<LazyPage><TeamFormPage /></LazyPage>} />
          <Route path="teams/:id" element={<LazyPage><TeamDetailPage /></LazyPage>} />
          <Route path="teams/:id/edit" element={<LazyPage><TeamFormPage /></LazyPage>} />

          <Route path="coaches" element={<LazyPage><CoachListPage /></LazyPage>} />
          <Route path="coaches/new" element={<LazyPage><CoachFormPage /></LazyPage>} />
          <Route path="coaches/:id" element={<LazyPage><CoachDetailPage /></LazyPage>} />
          <Route path="coaches/:id/edit" element={<LazyPage><CoachFormPage /></LazyPage>} />

          <Route path="players" element={<LazyPage><PlayerListPage /></LazyPage>} />
          <Route path="players/new" element={<LazyPage><PlayerFormPage /></LazyPage>} />
          <Route path="players/:id" element={<LazyPage><PlayerDetailPage /></LazyPage>} />
          <Route path="players/:id/edit" element={<LazyPage><PlayerFormPage /></LazyPage>} />

          <Route path="games" element={<LazyPage><GameListPage /></LazyPage>} />
          <Route path="games/new" element={<LazyPage><GameFormPage /></LazyPage>} />
          <Route path="games/:id" element={<LazyPage><GameDetailPage /></LazyPage>} />
          <Route path="games/:id/edit" element={<LazyPage><GameFormPage /></LazyPage>} />

          <Route path="referees" element={<LazyPage><RefereeListPage /></LazyPage>} />
          <Route path="referees/new" element={<LazyPage><RefereeFormPage /></LazyPage>} />
          <Route path="referees/:id/edit" element={<LazyPage><RefereeFormPage /></LazyPage>} />
        </Route>
      </Route>
    </Routes>
  );
}
