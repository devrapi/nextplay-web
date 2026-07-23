import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';
import Breadcrumb from '../../../shared/components/Breadcrumb';
import DataTable from '../../../shared/components/DataTable';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import ActionMenu from '../../../shared/components/ActionMenu';
import { useListPage } from '../../../shared/hooks/useListPage';
import { divisionService } from '../services/divisionService';
import type { Division } from '../types';

export default function DivisionListPage() {
  const navigate = useNavigate();
  const { data, meta, isLoading, isError, search, setSearch, sorting, setSorting, setPage, deleteId, setDeleteId, isDeleting, fetchData, handleDelete } =
    useListPage<Division>({ service: divisionService, entityName: 'Division' });

  const columns = useMemo<ColumnDef<Division>[]>(() => [
    { accessorKey: 'name', header: 'Name', enableSorting: true, cell: ({ row }) => <Link to={`/admin/divisions/${row.original.id}`} className="text-indigo-600 hover:text-indigo-500 font-medium">{row.original.name}</Link> },
    { accessorKey: 'tournament_id', header: 'Tournament', enableSorting: true, cell: ({ row }) => row.original.tournament ? <Link to={`/admin/tournaments/${row.original.tournament.id}`} className="text-indigo-600 hover:text-indigo-500">{row.original.tournament.name}</Link> : `#${row.original.tournament_id}` },
    { header: 'Teams', enableSorting: true, accessorKey: 'teams_count', cell: ({ row, getValue }) => {
      const count = getValue() as number | null | undefined;
      const fallback = row.original.teams?.length;
      const display = count ?? fallback;
      return display != null ? display : <span className="text-gray-400">—</span>;
    }},
    { header: 'Games', enableSorting: true, accessorKey: 'games_count', cell: ({ getValue }) => {
      const count = getValue() as number | null | undefined;
      return count != null ? count : <span className="text-gray-400">—</span>;
    }},
    { id: 'actions', header: '', cell: ({ row }) => (
      <ActionMenu items={[
        { label: 'View', icon: <ActionMenu.ViewIcon />, onClick: () => navigate(`/admin/divisions/${row.original.id}`) },
        { label: 'Edit', icon: <ActionMenu.EditIcon />, onClick: () => navigate(`/admin/divisions/${row.original.id}/edit`) },
        { label: 'Delete', icon: <ActionMenu.DeleteIcon />, onClick: () => setDeleteId(row.original.id), destructive: true },
      ]} />
    )},
  ], [navigate, setDeleteId]);

  return (
    <div>
      <Breadcrumb items={[{ label: 'Divisions' }]} />
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Divisions</h1>
        <button type="button" onClick={() => navigate('/admin/divisions/new')} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 shadow-sm transition"><Plus className="h-4 w-4" /> Add Division</button>
      </div>
      <div className="mb-4"><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search divisions..." className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 outline-none sm:w-72 bg-white transition-all duration-150 hover:border-gray-400" /></div>
      <DataTable<Division> columns={columns} data={data} meta={meta} isLoading={isLoading} isError={isError} sorting={sorting} onSortingChange={setSorting} onPageChange={setPage} onRetry={fetchData} />
      {deleteId !== null && <ConfirmDialog title="Delete Division" message="Are you sure you want to delete this division? This action cannot be undone." confirmLabel="Delete" isLoading={isDeleting} onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />}
    </div>
  );
}
