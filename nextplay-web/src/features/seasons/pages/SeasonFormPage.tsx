import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import Breadcrumb from '../../../shared/components/Breadcrumb';
import FormField from '../../../shared/components/FormField';
import FormButton from '../../../shared/components/FormButton';
import { useToast } from '../../../shared/context/ToastContext';
import { seasonService } from '../services/seasonService';
import { seasonSchema, type SeasonFormValues } from '../validation/seasonSchema';

export default function SeasonFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const isEdit = Boolean(id);
  const [isLoading, setIsLoading] = useState(isEdit);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SeasonFormValues>({
    resolver: zodResolver(seasonSchema),
    defaultValues: {
      name: '',
      start_date: '',
      end_date: '',
      is_active: true,
    },
  });

  useEffect(() => {
    if (!id) return;
    const fetchSeason = async () => {
      try {
        const { data } = await seasonService.get(Number(id));
        reset({
          name: data.name,
          start_date: data.start_date?.split(' ')[0] || '',
          end_date: data.end_date?.split(' ')[0] || '',
          is_active: data.is_active,
        });
      } catch {
        addToast('error', 'Failed to load season');
        navigate('/admin/seasons');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSeason();
  }, [id, reset, addToast, navigate]);

  const onSubmit = async (values: SeasonFormValues) => {
    try {
      if (isEdit) {
        await seasonService.update(Number(id), values);
        addToast('success', 'Season updated successfully');
      } else {
        await seasonService.create(values);
        addToast('success', 'Season created successfully');
      }
      navigate('/admin/seasons');
    } catch {
      addToast('error', isEdit ? 'Failed to update season' : 'Failed to create season');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb items={[
        { label: 'Seasons', to: '/admin/seasons' },
        { label: isEdit ? 'Edit Season' : 'New Season' },
      ]} />

      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/admin/seasons')}
          className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Edit Season' : 'New Season'}
        </h1>
      </div>

      <div className="max-w-lg rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <FormField
            id="name"
            label="Name"
            placeholder="e.g. 2025 Season"
            error={errors.name?.message}
            {...register('name')}
          />

          <FormField
            id="start_date"
            label="Start Date"
            type="date"
            error={errors.start_date?.message}
            {...register('start_date')}
          />

          <FormField
            id="end_date"
            label="End Date"
            type="date"
            error={errors.end_date?.message}
            {...register('end_date')}
          />

          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              {...register('is_active')}
            />
            <span className="text-sm text-gray-700">Active</span>
          </label>

          <div className="flex items-center gap-3 pt-2">
            <FormButton type="submit" loading={isSubmitting}>
              {isEdit ? 'Update Season' : 'Create Season'}
            </FormButton>
            <button
              type="button"
              onClick={() => navigate('/admin/seasons')}
              className="rounded-xl px-5 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
