import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Trophy, Users, Gamepad2, Plus, Pencil, ExternalLink } from 'lucide-react';
import PageHeader from '../../../shared/components/PageHeader';
import DetailCard from '../../../shared/components/DetailCard';
import StatsCard from '../../../shared/components/StatsCard';
import InfoRow from '../../../shared/components/InfoRow';
import Badge from '../../../shared/components/Badge';
import ErrorState from '../../../shared/components/ErrorState';
import { seasonService } from '../services/seasonService';
import { tournamentService } from '../../tournaments/services/tournamentService';
import type { Season } from '../types';
import type { Tournament } from '../../tournaments/types';

export default function SeasonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [season, setSeason] = useState<Season | null>(null);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      setLoading(true);
      setError(false);
      try {
        const [{ data: s }, tRes] = await Promise.all([
          seasonService.get(Number(id)),
          tournamentService.list({ per_page: 100 }),
        ]);
        setSeason(s);
        setTournaments(tRes.data.filter((t) => t.season_id === s.id));
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

  if (!season) return null;

  const totalTeams = tournaments.reduce((sum, t) => sum + (t.divisions_count ?? 0), 0);
  const totalGames = 0;

  return (
    <div>
      <PageHeader
        title={season.name}
        breadcrumbs={[
          { label: 'Seasons', to: '/admin/seasons' },
          { label: season.name },
        ]}
        backTo="/admin/seasons"
        actions={
          <>
            <Link
              to={`/admin/seasons/${season.id}/edit`}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Link>
            <Link
              to="/admin/tournaments/new"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 shadow-sm transition"
            >
              <Plus className="h-4 w-4" />
              Add Tournament
            </Link>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatsCard label="Tournaments" value={tournaments.length} icon={Trophy} color="indigo" href="/admin/tournaments" />
            <StatsCard label="Teams" value={totalTeams} icon={Users} color="emerald" />
            <StatsCard label="Games" value={totalGames} icon={Gamepad2} color="amber" />
          </div>

          <DetailCard
            title="Tournaments"
            actions={
              <Link
                to="/admin/tournaments"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                View all
              </Link>
            }
          >
            {tournaments.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <Trophy className="h-8 w-8 text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No tournaments yet for this season.</p>
                <Link
                  to="/admin/tournaments/new"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Create a tournament
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {tournaments.map((t) => (
                  <Link
                    key={t.id}
                    to={`/admin/tournaments/${t.id}`}
                    className="flex items-center justify-between py-3 hover:bg-gray-50/60 rounded-lg px-2 -mx-2 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50">
                        <Trophy className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{t.name}</p>
                        <p className="text-xs text-gray-500">
                          {t.start_date ? new Date(t.start_date).toLocaleDateString() : 'No dates'} 
                          {t.divisions_count != null && ` · ${t.divisions_count} divisions`}
                        </p>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-300" />
                  </Link>
                ))}
              </div>
            )}
          </DetailCard>
        </div>

        <div className="space-y-6">
          <DetailCard title="Season Information">
            <dl>
              <InfoRow label="Name" value={season.name} />
              <InfoRow label="Status" value={<Badge color={season.is_active ? 'emerald' : 'gray'}>{season.is_active ? 'Active' : 'Inactive'}</Badge>} />
              <InfoRow label="Start Date" value={new Date(season.start_date).toLocaleDateString()} />
              <InfoRow label="End Date" value={new Date(season.end_date).toLocaleDateString()} />
              <InfoRow label="Tournaments" value={tournaments.length} />
            </dl>
          </DetailCard>
        </div>
      </div>
    </div>
  );
}
