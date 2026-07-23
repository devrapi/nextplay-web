import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import Breadcrumb from '../../../shared/components/Breadcrumb';
import FormField from '../../../shared/components/FormField';
import FormButton from '../../../shared/components/FormButton';
import { useToast } from '../../../shared/context/ToastContext';
import { teamService } from '../services/teamService';
import { teamSchema, type TeamFormValues } from '../validation/teamSchema';

export default function TeamFormPage() {
  const { id } = useParams(); const navigate = useNavigate(); const { addToast } = useToast();
  const isEdit = Boolean(id);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<TeamFormValues>({
    resolver: zodResolver(teamSchema), defaultValues: { name: '', description: '' },
  });

  useEffect(() => {
    if (!id) return;
    teamService.get(Number(id)).then(({ data }) => reset({ name: data.name, description: data.description ?? '' }))
      .catch(() => { addToast('error', 'Failed to load team'); navigate('/admin/teams'); });
  }, [id, reset, addToast, navigate]);

  const onSubmit = async (values: TeamFormValues) => {
    try {
      if (isEdit) { await teamService.update(Number(id), values); addToast('success', 'Team updated'); }
      else { await teamService.create(values); addToast('success', 'Team created'); }
      navigate('/admin/teams');
    } catch { addToast('error', isEdit ? 'Failed to update team' : 'Failed to create team'); }
  };

  return (
    <div>
      <Breadcrumb items={[{ label: 'Teams', to: '/admin/teams' }, { label: isEdit ? 'Edit Team' : 'New Team' }]} />
      <div className="mb-6 flex items-center gap-3">
        <button type="button" onClick={() => navigate('/admin/teams')} className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition" aria-label="Go back"><ArrowLeft className="h-5 w-5" /></button>
        <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Team' : 'New Team'}</h1>
      </div>
      <div className="max-w-lg rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <FormField id="name" label="Name" placeholder="e.g. Eagles" error={errors.name?.message} {...register('name')} />
          <FormField id="description" label="Description" placeholder="Optional description" error={errors.description?.message} {...register('description')} />
          <div className="flex items-center gap-3 pt-2">
            <FormButton type="submit" loading={isSubmitting}>{isEdit ? 'Update Team' : 'Create Team'}</FormButton>
            <button type="button" onClick={() => navigate('/admin/teams')} className="rounded-xl px-5 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
