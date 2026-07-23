import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import Breadcrumb from '../../../shared/components/Breadcrumb';
import FormField from '../../../shared/components/FormField';
import FormButton from '../../../shared/components/FormButton';
import { useToast } from '../../../shared/context/ToastContext';
import { venueService } from '../services/venueService';
import { venueSchema, type VenueFormValues } from '../validation/venueSchema';

export default function VenueFormPage() {
  const { id } = useParams(); const navigate = useNavigate(); const { addToast } = useToast();
  const isEdit = Boolean(id); const [isLoading, setIsLoading] = useState(isEdit);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<VenueFormValues>({
    resolver: zodResolver(venueSchema), defaultValues: { name: '', address: '', latitude: null, longitude: null },
  });

  useEffect(() => {
    if (!id) return;
    venueService.get(Number(id)).then(({ data }) => reset({
      name: data.name, address: data.address ?? '', latitude: data.latitude, longitude: data.longitude,
    })).catch(() => { addToast('error', 'Failed to load venue'); navigate('/admin/venues'); }).finally(() => setIsLoading(false));
  }, [id, reset, addToast, navigate]);

  const onSubmit = async (values: VenueFormValues) => {
    try {
      if (isEdit) { await venueService.update(Number(id), values); addToast('success', 'Venue updated'); }
      else { await venueService.create(values); addToast('success', 'Venue created'); }
      navigate('/admin/venues');
    } catch { addToast('error', isEdit ? 'Failed to update venue' : 'Failed to create venue'); }
  };

  if (isLoading) return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" /></div>;

  return (
    <div>
      <Breadcrumb items={[{ label: 'Venues', to: '/admin/venues' }, { label: isEdit ? 'Edit Venue' : 'New Venue' }]} />
      <div className="mb-6 flex items-center gap-3">
        <button type="button" onClick={() => navigate('/admin/venues')} className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition" aria-label="Go back"><ArrowLeft className="h-5 w-5" /></button>
        <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Venue' : 'New Venue'}</h1>
      </div>
      <div className="max-w-lg rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <FormField id="name" label="Name" placeholder="e.g. Main Arena" error={errors.name?.message} {...register('name')} />
          <FormField id="address" label="Address" placeholder="Optional address" error={errors.address?.message} {...register('address')} />
          <div className="flex gap-4">
            <div className="flex-1"><FormField id="latitude" label="Latitude" type="number" step="any" placeholder="Optional" error={errors.latitude?.message} {...register('latitude', { valueAsNumber: true })} /></div>
            <div className="flex-1"><FormField id="longitude" label="Longitude" type="number" step="any" placeholder="Optional" error={errors.longitude?.message} {...register('longitude', { valueAsNumber: true })} /></div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <FormButton type="submit" loading={isSubmitting}>{isEdit ? 'Update Venue' : 'Create Venue'}</FormButton>
            <button type="button" onClick={() => navigate('/admin/venues')} className="rounded-xl px-5 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
