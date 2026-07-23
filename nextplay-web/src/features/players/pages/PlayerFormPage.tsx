import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import Breadcrumb from '../../../shared/components/Breadcrumb';
import FormField from '../../../shared/components/FormField';
import FormButton from '../../../shared/components/FormButton';
import { useToast } from '../../../shared/context/ToastContext';
import { playerService } from '../services/playerService';
import { playerSchema, POSITIONS, type PlayerFormValues } from '../validation/playerSchema';

export default function PlayerFormPage() {
  const { id } = useParams(); const navigate = useNavigate(); const { addToast } = useToast();
  const isEdit = Boolean(id);
  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<PlayerFormValues>({
    resolver: zodResolver(playerSchema), defaultValues: { first_name: '', last_name: '', birth_date: '', position: '', jersey_number: null },
  });

  useEffect(() => {
    if (!id) return;
    playerService.get(Number(id)).then(({ data }) => reset({
      first_name: data.first_name,
      last_name: data.last_name,
      birth_date: data.birth_date?.split(' ')[0] ?? '',
      position: data.position ?? '',
      jersey_number: data.jersey_number ?? null,
    })).catch(() => { addToast('error', 'Failed to load player'); navigate('/admin/players'); });
  }, [id, reset, addToast, navigate]);

  const onSubmit = async (values: PlayerFormValues) => {
    const payload = {
      ...values,
      jersey_number: values.jersey_number === '' ? null : Number(values.jersey_number),
      position: values.position || undefined,
    };
    try {
      if (isEdit) { await playerService.update(Number(id), payload); addToast('success', 'Player updated'); }
      else { await playerService.create(payload); addToast('success', 'Player created'); }
      navigate('/admin/players');
    } catch { addToast('error', isEdit ? 'Failed to update player' : 'Failed to create player'); }
  };

  return (
    <div>
      <Breadcrumb items={[{ label: 'Players', to: '/admin/players' }, { label: isEdit ? 'Edit Player' : 'New Player' }]} />
      <div className="mb-6 flex items-center gap-3">
        <button type="button" onClick={() => navigate('/admin/players')} className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition" aria-label="Go back"><ArrowLeft className="h-5 w-5" /></button>
        <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Player' : 'New Player'}</h1>
      </div>
      <div className="max-w-lg rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="flex gap-4">
            <div className="flex-1"><FormField id="first_name" label="First Name" placeholder="First name" error={errors.first_name?.message} {...register('first_name')} /></div>
            <div className="flex-1"><FormField id="last_name" label="Last Name" placeholder="Last name" error={errors.last_name?.message} {...register('last_name')} /></div>
          </div>
          <FormField id="birth_date" label="Birth Date" type="date" error={errors.birth_date?.message} {...register('birth_date')} />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="position" className="text-sm font-medium text-gray-700">Position</label>
            <select
              id="position"
              {...register('position')}
              className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 bg-white outline-none transition-all duration-150 hover:border-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15"
            >
              <option value="">Select position</option>
              {POSITIONS.map((pos) => <option key={pos} value={pos}>{pos}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="jersey_number" className="text-sm font-medium text-gray-700">Jersey Number</label>
            <input
              id="jersey_number"
              type="number"
              min={0}
              max={99}
              placeholder="0–99"
              onChange={(e) => {
                const val = e.target.value === '' ? null : Math.min(99, Math.max(0, Number(e.target.value)));
                setValue('jersey_number', val);
              }}
              defaultValue=""
              className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-white outline-none transition-all duration-150 hover:border-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15"
            />
            {errors.jersey_number && <p className="text-xs text-red-500 ml-0.5">{errors.jersey_number.message}</p>}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <FormButton type="submit" loading={isSubmitting}>{isEdit ? 'Update Player' : 'Create Player'}</FormButton>
            <button type="button" onClick={() => navigate('/admin/players')} className="rounded-xl px-5 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
