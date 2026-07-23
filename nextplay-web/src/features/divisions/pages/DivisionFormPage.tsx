import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import Breadcrumb from '../../../shared/components/Breadcrumb';
import FormField from '../../../shared/components/FormField';
import FormButton from '../../../shared/components/FormButton';
import { useToast } from '../../../shared/context/ToastContext';
import { tournamentService } from '../../tournaments/services/tournamentService';
import { divisionService } from '../services/divisionService';
import { divisionSchema, type DivisionFormValues } from '../validation/divisionSchema';
import type { Tournament } from '../../tournaments/types';

export default function DivisionFormPage() {
  const { id } = useParams(); const navigate = useNavigate(); const { addToast } = useToast();
  const isEdit = Boolean(id); const [isLoading, setIsLoading] = useState(isEdit);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<DivisionFormValues>({
    resolver: zodResolver(divisionSchema), defaultValues: { tournament_id: 0, name: '' },
  });

  useEffect(() => { tournamentService.list({ per_page: 100 }).then((r) => setTournaments(r.data)).catch(() => {}); }, []);
  useEffect(() => {
    if (!id) return;
    divisionService.get(Number(id)).then(({ data }) => reset({ tournament_id: data.tournament_id, name: data.name }))
      .catch(() => { addToast('error', 'Failed to load division'); navigate('/admin/divisions'); }).finally(() => setIsLoading(false));
  }, [id, reset, addToast, navigate]);

  const onSubmit = async (values: DivisionFormValues) => {
    try {
      if (isEdit) { await divisionService.update(Number(id), values); addToast('success', 'Division updated'); }
      else { await divisionService.create(values); addToast('success', 'Division created'); }
      navigate('/admin/divisions');
    } catch { addToast('error', isEdit ? 'Failed to update division' : 'Failed to create division'); }
  };

  if (isLoading) return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" /></div>;

  return (
    <div>
      <Breadcrumb items={[{ label: 'Divisions', to: '/admin/divisions' }, { label: isEdit ? 'Edit Division' : 'New Division' }]} />
      <div className="mb-6 flex items-center gap-3">
        <button type="button" onClick={() => navigate('/admin/divisions')} className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition" aria-label="Go back"><ArrowLeft className="h-5 w-5" /></button>
        <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Division' : 'New Division'}</h1>
      </div>
      <div className="max-w-lg rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="tournament_id" className="text-sm font-medium text-gray-700">Tournament</label>
            <select id="tournament_id" {...register('tournament_id', { valueAsNumber: true })}
              className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 bg-white outline-none transition-all duration-150 hover:border-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15">
              <option value={0}>Select tournament...</option>
              {tournaments.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            {errors.tournament_id && <p className="text-xs text-red-500 ml-0.5">{errors.tournament_id.message}</p>}
          </div>
          <FormField id="name" label="Name" placeholder="e.g. Men's Open" error={errors.name?.message} {...register('name')} />
          <div className="flex items-center gap-3 pt-2">
            <FormButton type="submit" loading={isSubmitting}>{isEdit ? 'Update Division' : 'Create Division'}</FormButton>
            <button type="button" onClick={() => navigate('/admin/divisions')} className="rounded-xl px-5 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
