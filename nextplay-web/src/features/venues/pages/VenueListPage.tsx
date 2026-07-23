import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';
import Breadcrumb from '../../../shared/components/Breadcrumb';
import DataTable from '../../../shared/components/DataTable';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import ActionMenu from '../../../shared/components/ActionMenu';
import { useListPage } from '../../../shared/hooks/useListPage';
import { venueService } from '../services/venueService';
import type { Venue } from '../types';

export default function VenueListPage() {
  const navigate = useNavigate();
  const { data, meta, isLoading, isError, search, setSearch, sorting, setSorting, setPage, deleteId, setDeleteId, isDeleting, fetchData, handleDelete } =
    useListPage<Venue>({ service: venueService, entityName: 'Venue' });

  const columns = useMemo<ColumnDef<Venue>[]>(() => [
    { accessorKey: 'name', header: 'Name', enableSorting: true },
    { accessorKey: 'address', header: 'Address', enableSorting: true, cell: ({ getValue }) => (getValue() as string) || '—' },
    { id: 'actions', header: '', cell: ({ row }) => (
      <ActionMenu items={[
        { label: 'Edit', icon: <ActionMenu.EditIcon />, onClick: () => navigate(`/admin/venues/${row.original.id}/edit`) },
        { label: 'Delete', icon: <ActionMenu.DeleteIcon />, onClick: () => setDeleteId(row.original.id), destructive: true },
      ]} />
    )},
  ], [navigate, setDeleteId]);

  return (
    <div>
      <Breadcrumb items={[{ label: 'Venues' }]} />
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Venues</h1>
        <button type="button" onClick={() => navigate('/admin/venues/new')} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 shadow-sm transition"><Plus className="h-4 w-4" /> Add Venue</button>
      </div>
      <div className="mb-4"><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search venues..." className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 outline-none sm:w-72 bg-white transition-all duration-150 hover:border-gray-400" /></div>
      <DataTable<Venue> columns={columns} data={data} meta={meta} isLoading={isLoading} isError={isError} sorting={sorting} onSortingChange={setSorting} onPageChange={setPage} onRetry={fetchData} />
      {deleteId !== null && <ConfirmDialog title="Delete Venue" message="Are you sure you want to delete this venue? This action cannot be undone." confirmLabel="Delete" isLoading={isDeleting} onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />}
    </div>
  );
}
