import { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ListTree, Users, Gamepad2, Plus, Pencil, ExternalLink, Trophy, Check, UserCog, Trash2 } from 'lucide-react';
import PageHeader from '../../../shared/components/PageHeader';
import DetailCard from '../../../shared/components/DetailCard';
import StatsCard from '../../../shared/components/StatsCard';
import InfoRow from '../../../shared/components/InfoRow';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import Badge from '../../../shared/components/Badge';
import ErrorState from '../../../shared/components/ErrorState';
import Spinner from '../../../shared/components/Spinner';
import Modal from '../../../shared/components/Modal';
import { useToast } from '../../../shared/context/ToastContext';
import { divisionService } from '../services/divisionService';
import { gameService } from '../../games/services/gameService';
import type { Division } from '../types';
import type { Game } from '../../games/types';
import type { Team } from '../../teams/types';

export default function DivisionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const divisionId = Number(id);
  const { addToast } = useToast();

  const [division, setDivision] = useState<Division | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [availableTeams, setAvailableTeams] = useState<Team[]>([]);
  const [teamsLoading, setTeamsLoading] = useState(false);
  const [selectedTeamIds, setSelectedTeamIds] = useState<number[]>([]);
  const [registering, setRegistering] = useState(false);

  const [removeTeamId, setRemoveTeamId] = useState<number | null>(null);
  const [removing, setRemoving] = useState(false);

  const fetchDivision = useCallback(async () => {
    try {
      const { data } = await divisionService.get(divisionId, { include: 'teams' });
      setDivision(data);
    } catch {
      setError(true);
    }
  }, [divisionId]);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      setLoading(true);
      setError(false);
      try {
        const [dRes, gRes] = await Promise.all([
          divisionService.get(divisionId, { include: 'teams' }),
          gameService.list({ per_page: 100 }),
        ]);
        setDivision(dRes.data);
        setGames(gRes.data.filter((g) => g.division_id === dRes.data.id));
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, divisionId]);

  const openRegisterModal = async () => {
    setShowRegisterModal(true);
    setSelectedTeamIds([]);
    setTeamsLoading(true);
    try {
      const registeredIds = new Set(division?.teams?.map((t) => t.id) ?? []);
      const res = await divisionService.availableTeams(divisionId);
      setAvailableTeams(res.data.filter((t) => !registeredIds.has(t.id)));
    } catch {
      addToast('error', 'Failed to load available teams');
    } finally {
      setTeamsLoading(false);
    }
  };

  const toggleTeamSelection = (teamId: number) => {
    setSelectedTeamIds((prev) =>
      prev.includes(teamId) ? prev.filter((t) => t !== teamId) : [...prev, teamId],
    );
  };

  const handleRegisterTeams = async () => {
    if (selectedTeamIds.length === 0) return;
    setRegistering(true);
    try {
      await divisionService.registerTeams(divisionId, { team_ids: selectedTeamIds });
      addToast('success', 'Teams registered successfully');
      setShowRegisterModal(false);
      fetchDivision();
    } catch {
      addToast('error', 'Failed to register teams');
    } finally {
      setRegistering(false);
    }
  };

  const handleRemoveTeam = async () => {
    if (removeTeamId === null) return;
    setRemoving(true);
    try {
      await divisionService.removeTeam(divisionId, removeTeamId);
      addToast('success', 'Team removed from division');
      fetchDivision();
    } catch {
      addToast('error', 'Failed to remove team');
    } finally {
      setRemoving(false);
      setRemoveTeamId(null);
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

  if (!division) return null;

  const upcomingGames = games.filter((g) => g.status === 'scheduled');
  const completedGames = games.filter((g) => g.status === 'completed');
  const registeredTeams = division.teams ?? [];

  return (
    <div>
      <PageHeader
        title={division.name}
        breadcrumbs={[
          { label: 'Divisions', to: '/admin/divisions' },
          { label: division.name },
        ]}
        backTo="/admin/divisions"
        actions={
          <Link
            to={`/admin/divisions/${division.id}/edit`}
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
            <StatsCard label="Registered Teams" value={registeredTeams.length} icon={Users} color="indigo" />
            <StatsCard label="Upcoming Games" value={upcomingGames.length} icon={Gamepad2} color="amber" />
            <StatsCard label="Completed" value={completedGames.length} icon={ListTree} color="emerald" />
          </div>

          <DetailCard
            title={`Registered Teams (${registeredTeams.length})`}
            actions={
              <button
                type="button"
                onClick={openRegisterModal}
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition"
              >
                <Plus className="h-3.5 w-3.5" />
                Register Teams
              </button>
            }
          >
            {registeredTeams.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-center">
                <Users className="h-10 w-10 text-gray-300 mb-3" />
                <p className="text-sm text-gray-500">No teams registered in this division yet.</p>
                <button
                  type="button"
                  onClick={openRegisterModal}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Register teams
                </button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {registeredTeams.map((team) => (
                  <div
                    key={team.id}
                    className="group relative rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-lg font-bold text-indigo-600">
                        {team.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/admin/teams/${team.id}`}
                          className="text-sm font-semibold text-gray-900 hover:text-indigo-600 transition"
                        >
                          {team.name}
                        </Link>
                        {team.coach && (
                          <Link
                            to={`/admin/coaches/${team.coach.id}`}
                            className="mt-0.5 flex items-center gap-1 text-xs text-gray-500 hover:text-indigo-600 transition"
                          >
                            <UserCog className="h-3 w-3" />
                            {team.coach.first_name} {team.coach.last_name}
                          </Link>
                        )}
                        {team.team_players_count != null && (
                          <p className="mt-0.5 text-xs text-gray-400">
                            {team.team_players_count} player{team.team_players_count !== 1 ? 's' : ''}
                          </p>
                        )}
                        {team.description && (
                          <p className="mt-1.5 text-xs text-gray-400 line-clamp-2">{team.description}</p>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setRemoveTeamId(team.id)}
                      className="absolute top-3 right-3 rounded-lg p-1 text-gray-300 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 transition"
                      aria-label={`Remove ${team.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </DetailCard>

          <DetailCard
            title="Games"
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
                <p className="text-sm text-gray-500">No games scheduled yet for this division.</p>
                <Link
                  to="/admin/games/new"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Schedule a game
                </Link>
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
                          {g.home_team?.name ?? `Team #${g.home_team_id}`} vs {g.away_team?.name ?? `Team #${g.away_team_id}`}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(g.scheduled_at).toLocaleDateString()} · <Badge color={g.status === 'completed' ? 'emerald' : g.status === 'scheduled' ? 'blue' : 'amber'}>{g.status}</Badge>
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
          <DetailCard title="Division Information">
            <dl>
              <InfoRow label="Name" value={division.name} />
              <InfoRow
                label="Tournament"
                value={
                  division.tournament ? (
                    <Link to={`/admin/tournaments/${division.tournament.id}`} className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-500 font-medium">
                      <Trophy className="h-3.5 w-3.5" />
                      {division.tournament.name}
                    </Link>
                  ) : `#${division.tournament_id}`
                }
              />
              <InfoRow label="Teams" value={registeredTeams.length} />
              <InfoRow label="Games" value={games.length} />
            </dl>
          </DetailCard>
        </div>
      </div>

      <Modal open={showRegisterModal} title="Register Teams" onClose={() => setShowRegisterModal(false)}>
        {teamsLoading ? (
          <Modal.Loading />
        ) : availableTeams.length === 0 ? (
          <Modal.Empty icon={Users} message="No available teams to register." subtext="All teams may already be registered in this division." />
        ) : (
          <>
            <div className="max-h-72 overflow-y-auto space-y-1">
              {availableTeams.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => toggleTeamSelection(t.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                    selectedTeamIds.includes(t.id) ? 'bg-indigo-50 ring-1 ring-indigo-200' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-600 shrink-0">
                    {t.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{t.name}</p>
                    {t.coach && <p className="text-xs text-gray-500 truncate">{t.coach.first_name} {t.coach.last_name}</p>}
                  </div>
                  <div className={`flex h-5 w-5 items-center justify-center rounded border-2 shrink-0 transition ${
                    selectedTeamIds.includes(t.id) ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'
                  }`}>
                    {selectedTeamIds.includes(t.id) && <Check className="h-3 w-3 text-white" />}
                  </div>
                </button>
              ))}
            </div>
            <Modal.Footer>
              <p className="text-sm text-gray-500">{selectedTeamIds.length} team{selectedTeamIds.length !== 1 ? 's' : ''} selected</p>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowRegisterModal(false)} className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition">Cancel</button>
                <button type="button" onClick={handleRegisterTeams} disabled={selectedTeamIds.length === 0 || registering} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed">
                  {registering && <Spinner />}
                  Register Teams
                </button>
              </div>
            </Modal.Footer>
          </>
        )}
      </Modal>

      {removeTeamId !== null && (
        <ConfirmDialog
          title="Remove Team"
          message="Are you sure you want to remove this team from the division?"
          confirmLabel="Remove"
          isLoading={removing}
          onConfirm={handleRemoveTeam}
          onCancel={() => setRemoveTeamId(null)}
        />
      )}
    </div>
  );
}
