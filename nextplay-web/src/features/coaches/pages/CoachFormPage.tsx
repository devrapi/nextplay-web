import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import Breadcrumb from '../../../shared/components/Breadcrumb';
import FormField from '../../../shared/components/FormField';
import FormButton from '../../../shared/components/FormButton';
import { useToast } from '../../../shared/context/ToastContext';
import { coachService } from '../services/coachService';
import { coachSchema, type CoachFormValues } from '../validation/coachSchema';

export default function CoachFormPage() {
  const { id } = useParams(); const navigate = useNavigate(); const { addToast } = useToast();
  const isEdit = Boolean(id);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CoachFormValues>({
    resolver: zodResolver(coachSchema), defaultValues: { first_name: '', last_name: '', bio: '' },
  });

  useEffect(() => {
    if (!id) return;
    coachService.get(Number(id)).then(({ data }) => reset({ first_name: data.first_name, last_name: data.last_name, bio: data.bio ?? '' }))
      .catch(() => { addToast('error', 'Failed to load coach'); navigate('/admin/coaches'); });
  }, [id, reset, addToast, navigate]);

  const onSubmit = async (values: CoachFormValues) => {
    try {
      if (isEdit) { await coachService.update(Number(id), values); addToast('success', 'Coach updated'); }
      else { await coachService.create(values); addToast('success', 'Coach created'); }
      navigate('/admin/coaches');
    } catch { addToast('error', isEdit ? 'Failed to update coach' : 'Failed to create coach'); }
  };

  return (
    <div>
      <Breadcrumb items={[{ label: 'Coaches', to: '/admin/coaches' }, { label: isEdit ? 'Edit Coach' : 'New Coach' }]} />
      <div className="mb-6 flex items-center gap-3">
        <button type="button" onClick={() => navigate('/admin/coaches')} className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition" aria-label="Go back"><ArrowLeft className="h-5 w-5" /></button>
        <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Coach' : 'New Coach'}</h1>
      </div>
      <div className="max-w-lg rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="flex gap-4">
            <div className="flex-1"><FormField id="first_name" label="First Name" placeholder="First name" error={errors.first_name?.message} {...register('first_name')} /></div>
            <div className="flex-1"><FormField id="last_name" label="Last Name" placeholder="Last name" error={errors.last_name?.message} {...register('last_name')} /></div>
          </div>
          <FormField id="bio" label="Bio" placeholder="Optional bio" error={errors.bio?.message} {...register('bio')} />
          <div className="flex items-center gap-3 pt-2">
            <FormButton type="submit" loading={isSubmitting}>{isEdit ? 'Update Coach' : 'Create Coach'}</FormButton>
            <button type="button" onClick={() => navigate('/admin/coaches')} className="rounded-xl px-5 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
