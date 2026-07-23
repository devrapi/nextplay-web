import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import Breadcrumb from '../../../shared/components/Breadcrumb';
import FormField from '../../../shared/components/FormField';
import FormButton from '../../../shared/components/FormButton';
import { useToast } from '../../../shared/context/ToastContext';
import { divisionService } from '../../divisions/services/divisionService';
import { venueService } from '../../venues/services/venueService';
import { teamService } from '../../teams/services/teamService';
import { gameService } from '../services/gameService';
import { gameSchema, type GameFormValues } from '../validation/gameSchema';
import type { Division } from '../../divisions/types';
import type { Venue } from '../../venues/types';
import type { Team } from '../../teams/types';

export default function GameFormPage() {
  const { id } = useParams(); const navigate = useNavigate(); const { addToast } = useToast();
  const isEdit = Boolean(id); const [isLoading, setIsLoading] = useState(isEdit);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm<GameFormValues>({
    resolver: zodResolver(gameSchema),
    defaultValues: { division_id: 0, venue_id: null, home_team_id: 0, away_team_id: 0, scheduled_at: '', status: 'scheduled' },
  });

  const homeTeamId = watch('home_team_id');
  const awayTeamId = watch('away_team_id');

  useEffect(() => {
    Promise.all([
      divisionService.list({ per_page: 100 }),
      venueService.list({ per_page: 100 }),
      teamService.list({ per_page: 100 }),
    ]).then(([d, v, t]) => { setDivisions(d.data); setVenues(v.data); setTeams(t.data); }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!id) return;
    gameService.get(Number(id)).then(({ data }) => reset({
      division_id: data.division_id, venue_id: data.venue_id ?? null,
      home_team_id: data.home_team_id, away_team_id: data.away_team_id,
      scheduled_at: data.scheduled_at?.split(' ')[0] ?? '', status: data.status,
    })).catch(() => { addToast('error', 'Failed to load game'); navigate('/admin/games'); }).finally(() => setIsLoading(false));
  }, [id, reset, addToast, navigate]);

  const onSubmit = async (values: GameFormValues) => {
    if (values.home_team_id === values.away_team_id) {
      addToast('error', 'Home team and away team must be different');
      return;
    }
    try {
      if (isEdit) { await gameService.update(Number(id), values); addToast('success', 'Game updated'); }
      else { await gameService.create(values); addToast('success', 'Game created'); }
      navigate('/admin/games');
    } catch { addToast('error', isEdit ? 'Failed to update game' : 'Failed to create game'); }
  };

  if (isLoading) return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" /></div>;

  const teamOptions = teams
    .filter((t) => !isEdit || t.id === homeTeamId || t.id === awayTeamId);

  return (
    <div>
      <Breadcrumb items={[{ label: 'Games', to: '/admin/games' }, { label: isEdit ? 'Edit Game' : 'New Game' }]} />
      <div className="mb-6 flex items-center gap-3">
        <button type="button" onClick={() => navigate('/admin/games')} className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition" aria-label="Go back"><ArrowLeft className="h-5 w-5" /></button>
        <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Game' : 'New Game'}</h1>
      </div>
      <div className="max-w-lg rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="division_id" className="text-sm font-medium text-gray-700">Division</label>
            <select id="division_id" {...register('division_id', { valueAsNumber: true })}
              className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 bg-white outline-none transition-all duration-150 hover:border-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15">
              <option value={0}>Select division...</option>
              {divisions.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            {errors.division_id && <p className="text-xs text-red-500 ml-0.5">{errors.division_id.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="venue_id" className="text-sm font-medium text-gray-700">Venue</label>
            <select id="venue_id" {...register('venue_id', { valueAsNumber: true })}
              className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 bg-white outline-none transition-all duration-150 hover:border-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15">
              <option value="">No venue</option>
              {venues.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="home_team_id" className="text-sm font-medium text-gray-700">Home Team</label>
            <select id="home_team_id" {...register('home_team_id', { valueAsNumber: true })}
              className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 bg-white outline-none transition-all duration-150 hover:border-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15">
              <option value={0}>Select home team...</option>
              {teamOptions.map((t) => (
                <option key={t.id} value={t.id} disabled={!isEdit && t.id === awayTeamId}>{t.name}</option>
              ))}
            </select>
            {errors.home_team_id && <p className="text-xs text-red-500 ml-0.5">{errors.home_team_id.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="away_team_id" className="text-sm font-medium text-gray-700">Away Team</label>
            <select id="away_team_id" {...register('away_team_id', { valueAsNumber: true })}
              className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 bg-white outline-none transition-all duration-150 hover:border-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15">
              <option value={0}>Select away team...</option>
              {teamOptions.map((t) => (
                <option key={t.id} value={t.id} disabled={!isEdit && t.id === homeTeamId}>{t.name}</option>
              ))}
            </select>
            {errors.away_team_id && <p className="text-xs text-red-500 ml-0.5">{errors.away_team_id.message}</p>}
          </div>

          <FormField id="scheduled_at" label="Scheduled Date" type="date" error={errors.scheduled_at?.message} {...register('scheduled_at')} />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="status" className="text-sm font-medium text-gray-700">Status</label>
            <select id="status" {...register('status')}
              className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 bg-white outline-none transition-all duration-150 hover:border-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15">
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="postponed">Postponed</option>
            </select>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <FormButton type="submit" loading={isSubmitting}>{isEdit ? 'Update Game' : 'Create Game'}</FormButton>
            <button type="button" onClick={() => navigate('/admin/games')} className="rounded-xl px-5 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
