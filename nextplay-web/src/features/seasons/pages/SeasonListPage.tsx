import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';
import Breadcrumb from '../../../shared/components/Breadcrumb';
import DataTable from '../../../shared/components/DataTable';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import ActionMenu from '../../../shared/components/ActionMenu';
import { useListPage } from '../../../shared/hooks/useListPage';
import { seasonService } from '../services/seasonService';
import type { Season } from '../types';

export default function SeasonListPage() {
  const navigate = useNavigate();
  const { data, meta, isLoading, isError, search, setSearch, sorting, setSorting, setPage, deleteId, setDeleteId, isDeleting, fetchData, handleDelete } =
    useListPage<Season>({ service: seasonService, entityName: 'Season' });

  const columns = useMemo<ColumnDef<Season>[]>(() => [
    { accessorKey: 'name', header: 'Name', enableSorting: true, cell: ({ row }) => (
      <Link to={`/admin/seasons/${row.original.id}`} className="text-indigo-600 hover:text-indigo-500 font-medium">{row.original.name}</Link>
    )},
    { accessorKey: 'start_date', header: 'Start Date', enableSorting: true, cell: ({ getValue }) => { const val = getValue() as string; return val ? new Date(val).toLocaleDateString() : '—'; } },
    { accessorKey: 'end_date', header: 'End Date', enableSorting: true, cell: ({ getValue }) => { const val = getValue() as string; return val ? new Date(val).toLocaleDateString() : '—'; } },
    { accessorKey: 'is_active', header: 'Status', enableSorting: true, cell: ({ getValue }) => {
      const active = getValue() as boolean;
      return <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>{active ? 'Active' : 'Inactive'}</span>;
    }},
    { accessorKey: 'tournaments_count', header: 'Tournaments', enableSorting: true, cell: ({ row }) => {
      const tournaments = row.original.tournaments;
      if (!tournaments || tournaments.length === 0) {
        const count = row.original.tournaments_count;
        return count != null ? count : <span className="text-gray-400">—</span>;
      }
      if (tournaments.length > 2) return `${tournaments.length} Tournaments`;
      return tournaments.map((t) => (
        <Link key={t.id} to={`/admin/tournaments/${t.id}`} className="text-indigo-600 hover:text-indigo-500">{t.name}</Link>
      )).reduce((acc, el, i) => i === 0 ? el : <>{acc}, {el}</>, <></>);
    }},
    { id: 'actions', header: '', cell: ({ row }) => (
      <ActionMenu items={[
        { label: 'View', icon: <ActionMenu.ViewIcon />, onClick: () => navigate(`/admin/seasons/${row.original.id}`) },
        { label: 'Edit', icon: <ActionMenu.EditIcon />, onClick: () => navigate(`/admin/seasons/${row.original.id}/edit`) },
        { label: 'Delete', icon: <ActionMenu.DeleteIcon />, onClick: () => setDeleteId(row.original.id), destructive: true },
      ]} />
    )},
  ], [navigate, setDeleteId]);

  return (
    <div>
      <Breadcrumb items={[{ label: 'Seasons' }]} />
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Seasons</h1>
        <button type="button" onClick={() => navigate('/admin/seasons/new')} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 shadow-sm transition"><Plus className="h-4 w-4" /> Add Season</button>
      </div>
      <div className="mb-4"><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search seasons..." className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 outline-none sm:w-72 bg-white transition-all duration-150 hover:border-gray-400" /></div>
      <DataTable<Season> columns={columns} data={data} meta={meta} isLoading={isLoading} isError={isError} sorting={sorting} onSortingChange={setSorting} onPageChange={setPage} onRetry={fetchData} />
      {deleteId !== null && <ConfirmDialog title="Delete Season" message="Are you sure you want to delete this season? This action cannot be undone." confirmLabel="Delete" isLoading={isDeleting} onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />}
    </div>
  );
}
