import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Pencil, Trophy, ListTree, MapPin, Users, User, CalendarDays } from 'lucide-react';
import PageHeader from '../../../shared/components/PageHeader';
import DetailCard from '../../../shared/components/DetailCard';
import InfoRow from '../../../shared/components/InfoRow';
import Badge from '../../../shared/components/Badge';
import ErrorState from '../../../shared/components/ErrorState';
import { gameService } from '../services/gameService';
import type { Game } from '../types';

const statusColors = {
  scheduled: 'blue' as const,
  in_progress: 'amber' as const,
  completed: 'emerald' as const,
  postponed: 'rose' as const,
};

export default function GameDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      setLoading(true);
      setError(false);
      try {
        const { data } = await gameService.get(Number(id));
        setGame(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (error) return <ErrorState onRetry={() => window.location.reload()} />;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (!game) return null;

  const homeScore = game.home_score ?? '—';
  const awayScore = game.away_score ?? '—';

  return (
    <div>
      <PageHeader
        title={`${game.home_team?.name ?? `Team #${game.home_team_id}`} vs ${game.away_team?.name ?? `Team #${game.away_team_id}`}`}
        breadcrumbs={[
          { label: 'Games', to: '/admin/games' },
          { label: `${game.home_team?.name ?? `#${game.home_team_id}`} vs ${game.away_team?.name ?? `#${game.away_team_id}`}` },
        ]}
        backTo="/admin/games"
        actions={
          <Link
            to={`/admin/games/${game.id}/edit`}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center gap-2 text-center flex-1">
                <Link to={`/admin/teams/${game.home_team_id}`} className="group">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-50 group-hover:bg-indigo-100 transition mx-auto">
                    <Users className="h-6 w-6 text-indigo-600" />
                  </div>
                  <p className="mt-2 text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition">
                    {game.home_team?.name ?? `Team #${game.home_team_id}`}
                  </p>
                </Link>
                <span className="text-xs text-gray-500">Home</span>
              </div>

              <div className="flex items-center gap-4 px-6">
                <span className="text-3xl font-bold text-gray-900">{homeScore}</span>
                <span className="text-lg text-gray-300">:</span>
                <span className="text-3xl font-bold text-gray-900">{awayScore}</span>
              </div>

              <div className="flex flex-col items-center gap-2 text-center flex-1">
                <Link to={`/admin/teams/${game.away_team_id}`} className="group">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-amber-50 group-hover:bg-amber-100 transition mx-auto">
                    <Users className="h-6 w-6 text-amber-600" />
                  </div>
                  <p className="mt-2 text-sm font-semibold text-gray-900 group-hover:text-amber-600 transition">
                    {game.away_team?.name ?? `Team #${game.away_team_id}`}
                  </p>
                </Link>
                <span className="text-xs text-gray-500">Away</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2">
              <Badge color={statusColors[game.status]}>{game.status.replace('_', ' ')}</Badge>
              <span className="text-sm text-gray-500">
                {new Date(game.scheduled_at).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <DetailCard title="Game Details">
            <dl>
              <InfoRow label="Status" value={<Badge color={statusColors[game.status]}>{game.status.replace('_', ' ')}</Badge>} />
              <InfoRow label="Scheduled" value={new Date(game.scheduled_at).toLocaleString()} />
              <InfoRow label="Home Team" value={
                <Link to={`/admin/teams/${game.home_team_id}`} className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-500 font-medium">
                  <Users className="h-3.5 w-3.5" />
                  {game.home_team?.name ?? `Team #${game.home_team_id}`}
                </Link>
              } />
              <InfoRow label="Away Team" value={
                <Link to={`/admin/teams/${game.away_team_id}`} className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-500 font-medium">
                  <Users className="h-3.5 w-3.5" />
                  {game.away_team?.name ?? `Team #${game.away_team_id}`}
                </Link>
              } />
              <InfoRow label="Score" value={game.home_score != null ? `${game.home_score} - ${game.away_score}` : '—'} />
            </dl>
          </DetailCard>

          <DetailCard title="Relationships">
            <dl>
              {game.division && (
                <InfoRow label="Division" value={
                  <Link to={`/admin/divisions/${game.division.id}`} className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-500 font-medium">
                    <ListTree className="h-3.5 w-3.5" />
                    {game.division.name}
                  </Link>
                } />
              )}
              {game.division?.tournament && (
                <InfoRow label="Tournament" value={
                  <Link to={`/admin/tournaments/${game.division.tournament.id}`} className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-500 font-medium">
                    <Trophy className="h-3.5 w-3.5" />
                    {game.division.tournament.name}
                  </Link>
                } />
              )}
              {game.division?.tournament?.season && (
                <InfoRow label="Season" value={
                  <Link to={`/admin/seasons/${game.division.tournament.season.id}`} className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-500 font-medium">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {game.division.tournament.season.name}
                  </Link>
                } />
              )}
              <InfoRow label="Division ID" value={`#${game.division_id}`} />
              <InfoRow label="Venue" value={
                game.venue ? (
                  <Link to={`/admin/venues/${game.venue.id}`} className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-500 font-medium">
                    <MapPin className="h-3.5 w-3.5" />
                    {game.venue.name}
                  </Link>
                ) : (
                  <span className="text-gray-400">Not assigned</span>
                )
              } />
              <InfoRow label="MVP" value={
                game.mvp ? (
                  <Link to={`/admin/players/${game.mvp.id}`} className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-500 font-medium">
                    <User className="h-3.5 w-3.5" />
                    {game.mvp.first_name} {game.mvp.last_name}
                  </Link>
                ) : (
                  <span className="text-gray-400">—</span>
                )
              } />
            </dl>
          </DetailCard>
        </div>
      </div>
    </div>
  );
}
