import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';
import Breadcrumb from '../../../shared/components/Breadcrumb';
import DataTable from '../../../shared/components/DataTable';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import ActionMenu from '../../../shared/components/ActionMenu';
import { useListPage } from '../../../shared/hooks/useListPage';
import { coachService } from '../services/coachService';
import type { Coach } from '../types';

export default function CoachListPage() {
  const navigate = useNavigate();
  const { data, meta, isLoading, isError, search, setSearch, sorting, setSorting, setPage, deleteId, setDeleteId, isDeleting, fetchData, handleDelete } =
    useListPage<Coach>({ service: coachService, entityName: 'Coach' });

  const columns = useMemo<ColumnDef<Coach>[]>(() => [
    { header: 'Name', enableSorting: true, accessorFn: (row) => `${row.first_name} ${row.last_name}`, cell: ({ row }) => <Link to={`/admin/coaches/${row.original.id}`} className="text-indigo-600 hover:text-indigo-500 font-medium">{row.original.first_name} {row.original.last_name}</Link> },
    { accessorKey: 'teams_count', header: 'Teams', enableSorting: true, cell: ({ row }) => {
      const teams = row.original.teams;
      if (!teams || teams.length === 0) {
        const count = row.original.teams_count;
        return count != null ? count : <span className="text-gray-400">—</span>;
      }
      if (teams.length > 2) return `${teams.length} Teams`;
      return teams.map((t) => (
        <Link key={t.id} to={`/admin/teams/${t.id}`} className="text-indigo-600 hover:text-indigo-500">{t.name}</Link>
      )).reduce((acc, el, i) => i === 0 ? el : <>{acc}, {el}</>, <></>);
    }},
    { id: 'actions', header: '', cell: ({ row }) => (
      <ActionMenu items={[
        { label: 'View', icon: <ActionMenu.ViewIcon />, onClick: () => navigate(`/admin/coaches/${row.original.id}`) },
        { label: 'Edit', icon: <ActionMenu.EditIcon />, onClick: () => navigate(`/admin/coaches/${row.original.id}/edit`) },
        { label: 'Delete', icon: <ActionMenu.DeleteIcon />, onClick: () => setDeleteId(row.original.id), destructive: true },
      ]} />
    )},
  ], [navigate, setDeleteId]);

  return (
    <div>
      <Breadcrumb items={[{ label: 'Coaches' }]} />
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Coaches</h1>
        <button type="button" onClick={() => navigate('/admin/coaches/new')} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 shadow-sm transition"><Plus className="h-4 w-4" /> Add Coach</button>
      </div>
      <div className="mb-4"><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search coaches..." className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 outline-none sm:w-72 bg-white transition-all duration-150 hover:border-gray-400" /></div>
      <DataTable<Coach> columns={columns} data={data} meta={meta} isLoading={isLoading} isError={isError} sorting={sorting} onSortingChange={setSorting} onPageChange={setPage} onRetry={fetchData} />
      {deleteId !== null && <ConfirmDialog title="Delete Coach" message="Are you sure you want to delete this coach? This action cannot be undone." confirmLabel="Delete" isLoading={isDeleting} onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />}
    </div>
  );
}
