import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Pencil } from 'lucide-react';
import PageHeader from '../../../shared/components/PageHeader';
import DetailCard from '../../../shared/components/DetailCard';
import InfoRow from '../../../shared/components/InfoRow';
import ErrorState from '../../../shared/components/ErrorState';
import { playerService } from '../services/playerService';
import type { Player } from '../types';

export default function PlayerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      setLoading(true);
      setError(false);
      try {
        const { data: p } = await playerService.get(Number(id));
        setPlayer(p);
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

  if (!player) return null;

  return (
    <div>
      <PageHeader
        title={`${player.first_name} ${player.last_name}`}
        breadcrumbs={[
          { label: 'Players', to: '/admin/players' },
          { label: `${player.first_name} ${player.last_name}` },
        ]}
        backTo="/admin/players"
        actions={
          <Link
            to={`/admin/players/${player.id}/edit`}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xl font-bold shrink-0">
              {player.first_name[0]}{player.last_name[0]}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{player.first_name} {player.last_name}</h2>
              <p className="text-sm text-gray-500">
                {player.birth_date ? `Born ${new Date(player.birth_date).toLocaleDateString()}` : 'Birth date not set'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <DetailCard title="Player Information">
            <dl>
              <InfoRow label="Full Name" value={`${player.first_name} ${player.last_name}`} />
              <InfoRow label="Birth Date" value={player.birth_date ? new Date(player.birth_date).toLocaleDateString() : '—'} />
            </dl>
          </DetailCard>
        </div>
      </div>
    </div>
  );
}
