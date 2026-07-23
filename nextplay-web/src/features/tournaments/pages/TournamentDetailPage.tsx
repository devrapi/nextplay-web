import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ListTree, Users, Gamepad2, Plus, Pencil, ExternalLink, CalendarDays } from 'lucide-react';
import PageHeader from '../../../shared/components/PageHeader';
import DetailCard from '../../../shared/components/DetailCard';
import StatsCard from '../../../shared/components/StatsCard';
import InfoRow from '../../../shared/components/InfoRow';
import ErrorState from '../../../shared/components/ErrorState';
import { tournamentService } from '../services/tournamentService';
import { divisionService } from '../../divisions/services/divisionService';
import type { Tournament } from '../types';
import type { Division } from '../../divisions/types';

export default function TournamentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      setLoading(true);
      setError(false);
      try {
        const [{ data: t }, dRes] = await Promise.all([
          tournamentService.get(Number(id)),
          divisionService.list({ per_page: 100 }),
        ]);
        setTournament(t);
        setDivisions(dRes.data.filter((d) => d.tournament_id === t.id));
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

  if (!tournament) return null;

  const totalTeams = divisions.reduce((sum, d) => sum + (d.teams_count ?? 0), 0);

  return (
    <div>
      <PageHeader
        title={tournament.name}
        breadcrumbs={[
          { label: 'Tournaments', to: '/admin/tournaments' },
          { label: tournament.name },
        ]}
        backTo="/admin/tournaments"
        actions={
          <>
            <Link
              to={`/admin/tournaments/${tournament.id}/edit`}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Link>
            <Link
              to="/admin/divisions/new"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 shadow-sm transition"
            >
              <Plus className="h-4 w-4" />
              Add Division
            </Link>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatsCard label="Divisions" value={divisions.length} icon={ListTree} color="indigo" href="/admin/divisions" />
            <StatsCard label="Teams" value={totalTeams} icon={Users} color="emerald" />
            <StatsCard label="Games" value={0} icon={Gamepad2} color="amber" />
          </div>

          <DetailCard
            title="Divisions"
            actions={
              <Link
                to="/admin/divisions"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                View all
              </Link>
            }
          >
            {divisions.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <ListTree className="h-8 w-8 text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No divisions yet for this tournament.</p>
                <Link
                  to="/admin/divisions/new"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Create a division
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {divisions.map((d) => (
                  <Link
                    key={d.id}
                    to={`/admin/divisions/${d.id}`}
                    className="flex items-center justify-between py-3 hover:bg-gray-50/60 rounded-lg px-2 -mx-2 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50">
                        <ListTree className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{d.name}</p>
                        <p className="text-xs text-gray-500">
                          {d.teams_count != null && `${d.teams_count} teams`}
                          {d.teams_count != null && d.games_count != null && ' · '}
                          {d.games_count != null && `${d.games_count} games`}
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
          <DetailCard title="Tournament Information">
            <dl>
              <InfoRow label="Name" value={tournament.name} />
              <InfoRow
                label="Season"
                value={
                  tournament.season ? (
                    <Link to={`/admin/seasons/${tournament.season.id}`} className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-500 font-medium">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {tournament.season.name}
                    </Link>
                  ) : `#${tournament.season_id}`
                }
              />
              <InfoRow label="Start Date" value={tournament.start_date ? new Date(tournament.start_date).toLocaleDateString() : '—'} />
              <InfoRow label="End Date" value={tournament.end_date ? new Date(tournament.end_date).toLocaleDateString() : '—'} />
              <InfoRow label="Divisions" value={divisions.length} />
              <InfoRow label="Teams" value={totalTeams} />
            </dl>
          </DetailCard>
        </div>
      </div>
    </div>
  );
}
