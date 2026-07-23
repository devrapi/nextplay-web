import { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Users, UserCog, Gamepad2, Pencil, ExternalLink, ListTree, Plus, Check, UserPlus, UserMinus, Trash2 } from 'lucide-react';
import PageHeader from '../../../shared/components/PageHeader';
import DetailCard from '../../../shared/components/DetailCard';
import StatsCard from '../../../shared/components/StatsCard';
import InfoRow from '../../../shared/components/InfoRow';
import Badge from '../../../shared/components/Badge';
import ErrorState from '../../../shared/components/ErrorState';
import Spinner from '../../../shared/components/Spinner';
import Modal from '../../../shared/components/Modal';
import { useToast } from '../../../shared/context/ToastContext';
import { teamService } from '../services/teamService';
import { gameService } from '../../games/services/gameService';
import type { Team, TeamPlayer } from '../types';
import type { Game } from '../../games/types';
import type { Coach } from '../../coaches/types';

export default function TeamDetailPage() {
  const { id } = useParams<{ id: string }>();
  const teamId = Number(id);
  const { addToast } = useToast();

  const [team, setTeam] = useState<Team | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [showCoachModal, setShowCoachModal] = useState(false);
  const [availableCoaches, setAvailableCoaches] = useState<Coach[]>([]);
  const [coachesLoading, setCoachesLoading] = useState(false);
  const [selectedCoachId, setSelectedCoachId] = useState<number | null>(null);
  const [coachSubmitting, setCoachSubmitting] = useState(false);
  const [coachRemoving, setCoachRemoving] = useState(false);

  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [availablePlayers, setAvailablePlayers] = useState<TeamPlayer[]>([]);
  const [playersLoading, setPlayersLoading] = useState(false);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<number[]>([]);
  const [playersSubmitting, setPlayersSubmitting] = useState(false);
  const [removingPlayerId, setRemovingPlayerId] = useState<number | null>(null);

  const fetchTeam = useCallback(async () => {
    try {
      const { data } = await teamService.get(teamId, { include: 'players' });
      setTeam(data);
    } catch {
      setError(true);
    }
  }, [teamId]);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      setLoading(true);
      setError(false);
      try {
        const [tRes, gRes] = await Promise.all([
          teamService.get(teamId, { include: 'players' }),
          gameService.list({ per_page: 100 }),
        ]);
        setTeam(tRes.data);
        setGames(gRes.data.filter((g) => g.home_team_id === teamId || g.away_team_id === teamId));
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, teamId]);

  const openCoachModal = async () => {
    setShowCoachModal(true);
    setSelectedCoachId(null);
    setCoachesLoading(true);
    try {
      const res = await teamService.availableCoaches(teamId);
      setAvailableCoaches(res.data);
    } catch {
      addToast('error', 'Failed to load available coaches');
    } finally {
      setCoachesLoading(false);
    }
  };

  const handleAssignCoach = async () => {
    if (!selectedCoachId) return;
    setCoachSubmitting(true);
    try {
      await teamService.assignCoach(teamId, { coach_id: selectedCoachId });
      addToast('success', 'Coach assigned successfully');
      setShowCoachModal(false);
      fetchTeam();
    } catch {
      addToast('error', 'Failed to assign coach');
    } finally {
      setCoachSubmitting(false);
    }
  };

  const handleRemoveCoach = async () => {
    setCoachRemoving(true);
    try {
      await teamService.removeCoach(teamId);
      addToast('success', 'Coach removed successfully');
      fetchTeam();
    } catch {
      addToast('error', 'Failed to remove coach');
    } finally {
      setCoachRemoving(false);
    }
  };

  const openPlayerModal = async () => {
    setShowPlayerModal(true);
    setSelectedPlayerIds([]);
    setPlayersLoading(true);
    try {
      const existingIds = new Set(team?.team_players?.map((p) => p.id) ?? []);
      const res = await teamService.availablePlayers(teamId);
      setAvailablePlayers(res.data.filter((p) => !existingIds.has(p.id)));
    } catch {
      addToast('error', 'Failed to load available players');
    } finally {
      setPlayersLoading(false);
    }
  };

  const togglePlayerSelection = (playerId: number) => {
    setSelectedPlayerIds((prev) =>
      prev.includes(playerId) ? prev.filter((p) => p !== playerId) : [...prev, playerId],
    );
  };

  const handleAssignPlayers = async () => {
    if (selectedPlayerIds.length === 0) return;

    const conflict = availablePlayers
      .filter((p) => selectedPlayerIds.includes(p.id))
      .find((p) =>
        p.jersey_number != null &&
        teamPlayers.some((tp) => tp.jersey_number === p.jersey_number),
      );
    if (conflict) {
      addToast('error', `Jersey #${conflict.jersey_number} is already taken on this team`);
      return;
    }

    setPlayersSubmitting(true);
    try {
      await teamService.assignPlayers(teamId, { player_ids: selectedPlayerIds });
      addToast('success', 'Players assigned successfully');
      setShowPlayerModal(false);
      fetchTeam();
    } catch {
      addToast('error', 'Failed to assign players');
    } finally {
      setPlayersSubmitting(false);
    }
  };

  const handleRemovePlayer = async (playerId: number) => {
    setRemovingPlayerId(playerId);
    try {
      await teamService.removePlayer(teamId, playerId);
      addToast('success', 'Player removed from team');
      fetchTeam();
    } catch {
      addToast('error', 'Failed to remove player');
    } finally {
      setRemovingPlayerId(null);
    }
  };

  if (error) return <ErrorState onRetry={() => window.location.reload()} />;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (!team) return null;

  const upcomingGames = games.filter((g) => g.status === 'scheduled');
  const completedGames = games.filter((g) => g.status === 'completed');
  const teamPlayers = team.team_players ?? [];

  return (
    <div>
      <PageHeader
        title={team.name}
        breadcrumbs={[
          { label: 'Teams', to: '/admin/teams' },
          { label: team.name },
        ]}
        backTo="/admin/teams"
        actions={
          <Link
            to={`/admin/teams/${team.id}/edit`}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatsCard label="Players" value={team.team_players_count ?? teamPlayers.length} icon={Users} color="indigo" />
            <StatsCard label="Upcoming Games" value={upcomingGames.length} icon={Gamepad2} color="amber" />
            <StatsCard label="Completed" value={completedGames.length} icon={ListTree} color="emerald" />
          </div>

          {team.coach ? (
            <DetailCard
              title="Assigned Coach"
              actions={
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={openCoachModal}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveCoach}
                    disabled={coachRemoving}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                  >
                    {coachRemoving ? <Spinner /> : <UserMinus className="h-3.5 w-3.5" />}
                    Remove
                  </button>
                </div>
              }
            >
              <Link
                to={`/admin/coaches/${team.coach.id}`}
                className="flex items-center gap-4 p-3 -mx-2 rounded-xl hover:bg-gray-50 transition"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm font-bold shrink-0">
                  {team.coach.first_name[0]}{team.coach.last_name[0]}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{team.coach.first_name} {team.coach.last_name}</p>
                  <p className="text-xs text-gray-500">
                    {team.coach.teams_count != null && team.coach.teams_count > 1 ? `Coaches ${team.coach.teams_count} teams` : 'Team coach'}
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 text-gray-300" />
              </Link>
            </DetailCard>
          ) : (
            <DetailCard
              title="Assigned Coach"
              actions={
                <button
                  type="button"
                  onClick={openCoachModal}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  Assign Coach
                </button>
              }
            >
              <div className="flex flex-col items-center py-6 text-center">
                <UserCog className="h-8 w-8 text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No coach assigned to this team.</p>
              </div>
            </DetailCard>
          )}

          <DetailCard
            title="Players"
            actions={
              <button
                type="button"
                onClick={openPlayerModal}
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition"
              >
                <Plus className="h-3.5 w-3.5" />
                Assign Players
              </button>
            }
          >
            {teamPlayers.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <Users className="h-8 w-8 text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No players assigned to this team.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-50">
                  <thead>
                    <tr className="bg-gray-50/60">
                      <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Player</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Position</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">#</th>
                      <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {teamPlayers.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50/60 transition">
                        <td className="whitespace-nowrap px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-bold shrink-0">
                              {p.first_name[0]}{p.last_name[0]}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{p.first_name} {p.last_name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{p.position || '—'}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{p.jersey_number ?? '—'}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemovePlayer(p.id)}
                            disabled={removingPlayerId === p.id}
                            className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition disabled:opacity-50"
                            aria-label={`Remove ${p.first_name} ${p.last_name}`}
                          >
                            {removingPlayerId === p.id ? <Spinner /> : <Trash2 className="h-4 w-4" />}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </DetailCard>

          <DetailCard
            title="Scheduled Games"
            actions={
              <Link
                to="/admin/games"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                View all
              </Link>
            }
          >
            {games.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <Gamepad2 className="h-8 w-8 text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No games scheduled for this team.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {games.slice(0, 5).map((g) => (
                  <Link
                    key={g.id}
                    to={`/admin/games/${g.id}`}
                    className="flex items-center justify-between py-3 hover:bg-gray-50/60 rounded-lg px-2 -mx-2 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50">
                        <Gamepad2 className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          <span className={g.home_team_id === team.id ? 'text-indigo-600 font-semibold' : ''}>{g.home_team?.name ?? `Team #${g.home_team_id}`}</span>
                          {' vs '}
                          <span className={g.away_team_id === team.id ? 'text-indigo-600 font-semibold' : ''}>{g.away_team?.name ?? `Team #${g.away_team_id}`}</span>
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(g.scheduled_at).toLocaleDateString()} · <Badge color={g.status === 'completed' ? 'emerald' : g.status === 'scheduled' ? 'blue' : 'amber'}>{g.status}</Badge>
                          {g.home_score != null && ` · ${g.home_score} - ${g.away_score}`}
                        </p>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-300" />
                  </Link>
                ))}
                {games.length > 5 && (
                  <Link to="/admin/games" className="block py-3 text-center text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    View all {games.length} games
                  </Link>
                )}
              </div>
            )}
          </DetailCard>
        </div>

        <div className="space-y-6">
          <DetailCard title="Team Information">
            <dl>
              <InfoRow label="Name" value={team.name} />
              <InfoRow label="Description" value={team.description} />
              <InfoRow
                label="Coach"
                value={
                  team.coach ? (
                    <Link to={`/admin/coaches/${team.coach.id}`} className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-500 font-medium">
                      <UserCog className="h-3.5 w-3.5" />
                      {team.coach.first_name} {team.coach.last_name}
                    </Link>
                  ) : (
                    <span className="text-gray-400">No coach assigned</span>
                  )
                }
              />
              <InfoRow label="Players" value={team.team_players_count ?? teamPlayers.length} />
              <InfoRow label="Division" value={team.division?.name ?? '—'} />
            </dl>
          </DetailCard>
        </div>
      </div>

      <Modal open={showCoachModal} title="Assign Coach" onClose={() => setShowCoachModal(false)}>
        {coachesLoading ? (
          <Modal.Loading />
        ) : availableCoaches.length === 0 ? (
          <Modal.Empty icon={UserCog} message="No available coaches to assign." subtext="All coaches are already assigned to teams." />
        ) : (
          <>
            <div className="max-h-72 overflow-y-auto space-y-1">
              {availableCoaches.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCoachId(c.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                    selectedCoachId === c.id ? 'bg-indigo-50 ring-1 ring-indigo-200' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-bold shrink-0">
                    {c.first_name[0]}{c.last_name[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{c.first_name} {c.last_name}</p>
                    {c.teams_count != null && <p className="text-xs text-gray-500">{c.teams_count} team{c.teams_count !== 1 ? 's' : ''}</p>}
                  </div>
                  {selectedCoachId === c.id && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            <Modal.Footer>
              <div />
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowCoachModal(false)} className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition">Cancel</button>
                <button type="button" onClick={handleAssignCoach} disabled={!selectedCoachId || coachSubmitting} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed">
                  {coachSubmitting && <Spinner />}
                  Assign Coach
                </button>
              </div>
            </Modal.Footer>
          </>
        )}
      </Modal>

      <Modal open={showPlayerModal} title="Assign Players" onClose={() => setShowPlayerModal(false)}>
        {playersLoading ? (
          <Modal.Loading />
        ) : availablePlayers.length === 0 ? (
          <Modal.Empty icon={Users} message="No available players to assign." subtext="All players may already be on a team." />
        ) : (
          <>
            <div className="max-h-72 overflow-y-auto space-y-1">
              {availablePlayers.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => togglePlayerSelection(p.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                    selectedPlayerIds.includes(p.id) ? 'bg-indigo-50 ring-1 ring-indigo-200' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-bold shrink-0">
                    {p.first_name[0]}{p.last_name[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{p.first_name} {p.last_name}</p>
                    <p className="text-xs text-gray-500">
                      {p.position ? p.position : 'No position'}
                      {p.jersey_number != null ? ` · #${p.jersey_number}` : ''}
                    </p>
                  </div>
                  {p.jersey_number != null && teamPlayers.some((tp) => tp.jersey_number === p.jersey_number) && (
                    <span className="text-[10px] text-red-500 font-medium whitespace-nowrap mr-1"># taken</span>
                  )}
                  <div className={`flex h-5 w-5 items-center justify-center rounded border-2 transition ${
                    selectedPlayerIds.includes(p.id) ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'
                  }`}>
                    {selectedPlayerIds.includes(p.id) && <Check className="h-3 w-3 text-white" />}
                  </div>
                </button>
              ))}
            </div>
            <Modal.Footer>
              <p className="text-sm text-gray-500">{selectedPlayerIds.length} player{selectedPlayerIds.length !== 1 ? 's' : ''} selected</p>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowPlayerModal(false)} className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition">Cancel</button>
                <button type="button" onClick={handleAssignPlayers} disabled={selectedPlayerIds.length === 0 || playersSubmitting} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed">
                  {playersSubmitting && <Spinner />}
                  Assign Players
                </button>
              </div>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </div>
  );
}
