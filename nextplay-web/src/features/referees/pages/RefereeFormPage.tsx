import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import Breadcrumb from '../../../shared/components/Breadcrumb';
import FormField from '../../../shared/components/FormField';
import FormButton from '../../../shared/components/FormButton';
import { useToast } from '../../../shared/context/ToastContext';
import { refereeService } from '../services/refereeService';
import { refereeSchema, type RefereeFormValues } from '../validation/refereeSchema';

export default function RefereeFormPage() {
  const { id } = useParams(); const navigate = useNavigate(); const { addToast } = useToast();
  const isEdit = Boolean(id);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<RefereeFormValues>({
    resolver: zodResolver(refereeSchema), defaultValues: { first_name: '', last_name: '' },
  });

  useEffect(() => {
    if (!id) return;
    refereeService.get(Number(id)).then(({ data }) => reset({ first_name: data.first_name, last_name: data.last_name }))
      .catch(() => { addToast('error', 'Failed to load referee'); navigate('/admin/referees'); });
  }, [id, reset, addToast, navigate]);

  const onSubmit = async (values: RefereeFormValues) => {
    try {
      if (isEdit) { await refereeService.update(Number(id), values); addToast('success', 'Referee updated'); }
      else { await refereeService.create(values); addToast('success', 'Referee created'); }
      navigate('/admin/referees');
    } catch { addToast('error', isEdit ? 'Failed to update referee' : 'Failed to create referee'); }
  };

  return (
    <div>
      <Breadcrumb items={[{ label: 'Referees', to: '/admin/referees' }, { label: isEdit ? 'Edit Referee' : 'New Referee' }]} />
      <div className="mb-6 flex items-center gap-3">
        <button type="button" onClick={() => navigate('/admin/referees')} className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition" aria-label="Go back"><ArrowLeft className="h-5 w-5" /></button>
        <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Referee' : 'New Referee'}</h1>
      </div>
      <div className="max-w-lg rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="flex gap-4">
            <div className="flex-1"><FormField id="first_name" label="First Name" placeholder="First name" error={errors.first_name?.message} {...register('first_name')} /></div>
            <div className="flex-1"><FormField id="last_name" label="Last Name" placeholder="Last name" error={errors.last_name?.message} {...register('last_name')} /></div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <FormButton type="submit" loading={isSubmitting}>{isEdit ? 'Update Referee' : 'Create Referee'}</FormButton>
            <button type="button" onClick={() => navigate('/admin/referees')} className="rounded-xl px-5 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
