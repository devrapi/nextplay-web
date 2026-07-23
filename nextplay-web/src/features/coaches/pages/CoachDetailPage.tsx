import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Users, Pencil, ExternalLink } from 'lucide-react';
import PageHeader from '../../../shared/components/PageHeader';
import DetailCard from '../../../shared/components/DetailCard';
import StatsCard from '../../../shared/components/StatsCard';
import InfoRow from '../../../shared/components/InfoRow';
import ErrorState from '../../../shared/components/ErrorState';
import { coachService } from '../services/coachService';
import { teamService } from '../../teams/services/teamService';
import type { Coach } from '../types';
import type { Team } from '../../teams/types';

export default function CoachDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [coach, setCoach] = useState<Coach | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      setLoading(true);
      setError(false);
      try {
        const [{ data: c }, tRes] = await Promise.all([
          coachService.get(Number(id)),
          teamService.list({ per_page: 100 }),
        ]);
        setCoach(c);
        setTeams(tRes.data.filter((t) => t.coach_id === c.id));
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

  if (!coach) return null;

  return (
    <div>
      <PageHeader
        title={`${coach.first_name} ${coach.last_name}`}
        breadcrumbs={[
          { label: 'Coaches', to: '/admin/coaches' },
          { label: `${coach.first_name} ${coach.last_name}` },
        ]}
        backTo="/admin/coaches"
        actions={
          <Link
            to={`/admin/coaches/${coach.id}/edit`}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <StatsCard label="Teams Handled" value={teams.length} icon={Users} color="indigo" />
          </div>

          <DetailCard title="Teams Handled">
            {teams.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <Users className="h-8 w-8 text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No teams assigned to this coach.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {teams.map((t) => (
                  <Link
                    key={t.id}
                    to={`/admin/teams/${t.id}`}
                    className="flex items-center justify-between py-3 hover:bg-gray-50/60 rounded-lg px-2 -mx-2 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">
                        <Users className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{t.name}</p>
                        <p className="text-xs text-gray-500">
                          {t.team_players_count != null && `${t.team_players_count} players`}
                          {t.division != null && (t.team_players_count != null ? ' · ' : '')}
                          {t.division?.name}
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
          <DetailCard title="Coach Information">
            <dl>
              <InfoRow label="Name" value={`${coach.first_name} ${coach.last_name}`} />
              <InfoRow label="Bio" value={coach.bio} />
              <InfoRow label="Teams" value={teams.length} />
            </dl>
          </DetailCard>
        </div>
      </div>
    </div>
  );
}
