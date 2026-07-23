import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import Breadcrumb from '../../../shared/components/Breadcrumb';
import FormField from '../../../shared/components/FormField';
import FormButton from '../../../shared/components/FormButton';
import { useToast } from '../../../shared/context/ToastContext';
import { seasonService } from '../../seasons/services/seasonService';
import { tournamentService } from '../services/tournamentService';
import { tournamentSchema, type TournamentFormValues } from '../validation/tournamentSchema';
import type { Season } from '../../seasons/types';

export default function TournamentFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const isEdit = Boolean(id);
  const [isLoading, setIsLoading] = useState(isEdit);
  const [seasons, setSeasons] = useState<Season[]>([]);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<TournamentFormValues>({
    resolver: zodResolver(tournamentSchema),
    defaultValues: { season_id: 0, name: '', description: '', start_date: '', end_date: '' },
  });

  useEffect(() => {
    seasonService.list({ per_page: 100 }).then((res) => setSeasons(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!id) return;
    tournamentService.get(Number(id)).then(({ data }) => {
      reset({
        season_id: data.season_id,
        name: data.name,
        description: data.description ?? '',
        start_date: data.start_date?.split(' ')[0] ?? '',
        end_date: data.end_date?.split(' ')[0] ?? '',
      });
    }).catch(() => { addToast('error', 'Failed to load tournament'); navigate('/admin/tournaments'); })
    .finally(() => setIsLoading(false));
  }, [id, reset, addToast, navigate]);

  const onSubmit = async (values: TournamentFormValues) => {
    try {
      if (isEdit) { await tournamentService.update(Number(id), values); addToast('success', 'Tournament updated'); }
      else { await tournamentService.create(values); addToast('success', 'Tournament created'); }
      navigate('/admin/tournaments');
    } catch { addToast('error', isEdit ? 'Failed to update tournament' : 'Failed to create tournament'); }
  };

  if (isLoading) return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" /></div>;

  return (
    <div>
      <Breadcrumb items={[{ label: 'Tournaments', to: '/admin/tournaments' }, { label: isEdit ? 'Edit Tournament' : 'New Tournament' }]} />
      <div className="mb-6 flex items-center gap-3">
        <button type="button" onClick={() => navigate('/admin/tournaments')} className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition" aria-label="Go back"><ArrowLeft className="h-5 w-5" /></button>
        <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Tournament' : 'New Tournament'}</h1>
      </div>
      <div className="max-w-lg rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="season_id" className="text-sm font-medium text-gray-700">Season</label>
            <select id="season_id" {...register('season_id', { valueAsNumber: true })}
              className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 bg-white outline-none transition-all duration-150 hover:border-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15">
              <option value={0}>Select season...</option>
              {seasons.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            {errors.season_id && <p className="text-xs text-red-500 ml-0.5">{errors.season_id.message}</p>}
          </div>
          <FormField id="name" label="Name" placeholder="e.g. Playoffs 2025" error={errors.name?.message} {...register('name')} />
          <FormField id="description" label="Description" placeholder="Optional description" error={errors.description?.message} {...register('description')} />
          <FormField id="start_date" label="Start Date" type="date" error={errors.start_date?.message} {...register('start_date')} />
          <FormField id="end_date" label="End Date" type="date" error={errors.end_date?.message} {...register('end_date')} />
          <div className="flex items-center gap-3 pt-2">
            <FormButton type="submit" loading={isSubmitting}>{isEdit ? 'Update Tournament' : 'Create Tournament'}</FormButton>
            <button type="button" onClick={() => navigate('/admin/tournaments')} className="rounded-xl px-5 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
