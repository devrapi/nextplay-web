import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';
import Breadcrumb from '../../../shared/components/Breadcrumb';
import DataTable from '../../../shared/components/DataTable';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import ActionMenu from '../../../shared/components/ActionMenu';
import { useListPage } from '../../../shared/hooks/useListPage';
import { tournamentService } from '../services/tournamentService';
import type { Tournament } from '../types';

export default function TournamentListPage() {
  const navigate = useNavigate();
  const { data, meta, isLoading, isError, search, setSearch, sorting, setSorting, setPage, deleteId, setDeleteId, isDeleting, fetchData, handleDelete } =
    useListPage<Tournament>({ service: tournamentService, entityName: 'Tournament' });

  const columns = useMemo<ColumnDef<Tournament>[]>(() => [
    { accessorKey: 'name', header: 'Name', enableSorting: true, cell: ({ row }) => <Link to={`/admin/tournaments/${row.original.id}`} className="text-indigo-600 hover:text-indigo-500 font-medium">{row.original.name}</Link> },
    { accessorKey: 'season_id', header: 'Season', enableSorting: true, cell: ({ row }) => row.original.season ? <Link to={`/admin/seasons/${row.original.season.id}`} className="text-indigo-600 hover:text-indigo-500">{row.original.season.name}</Link> : `#${row.original.season_id}` },
    { accessorKey: 'start_date', header: 'Start', enableSorting: true, cell: ({ getValue }) => { const v = getValue() as string | null; return v ? new Date(v).toLocaleDateString() : '—'; } },
    { accessorKey: 'end_date', header: 'End', enableSorting: true, cell: ({ getValue }) => { const v = getValue() as string | null; return v ? new Date(v).toLocaleDateString() : '—'; } },
    { accessorKey: 'divisions_count', header: 'Divisions', enableSorting: true, cell: ({ row }) => {
      const divisions = row.original.divisions;
      if (!divisions || divisions.length === 0) {
        const count = row.original.divisions_count;
        return count != null ? count : <span className="text-gray-400">—</span>;
      }
      if (divisions.length > 2) return `${divisions.length} Divisions`;
      return divisions.map((d) => (
        <Link key={d.id} to={`/admin/divisions/${d.id}`} className="text-indigo-600 hover:text-indigo-500">{d.name}</Link>
      )).reduce((acc, el, i) => i === 0 ? el : <>{acc}, {el}</>, <></>);
    }},
    { id: 'actions', header: '', cell: ({ row }) => (
      <ActionMenu items={[
        { label: 'View', icon: <ActionMenu.ViewIcon />, onClick: () => navigate(`/admin/tournaments/${row.original.id}`) },
        { label: 'Edit', icon: <ActionMenu.EditIcon />, onClick: () => navigate(`/admin/tournaments/${row.original.id}/edit`) },
        { label: 'Delete', icon: <ActionMenu.DeleteIcon />, onClick: () => setDeleteId(row.original.id), destructive: true },
      ]} />
    )},
  ], [navigate, setDeleteId]);

  return (
    <div>
      <Breadcrumb items={[{ label: 'Tournaments' }]} />
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Tournaments</h1>
        <button type="button" onClick={() => navigate('/admin/tournaments/new')} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 shadow-sm transition"><Plus className="h-4 w-4" /> Add Tournament</button>
      </div>
      <div className="mb-4"><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tournaments..." className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 outline-none sm:w-72 bg-white transition-all duration-150 hover:border-gray-400" /></div>
      <DataTable<Tournament> columns={columns} data={data} meta={meta} isLoading={isLoading} isError={isError} sorting={sorting} onSortingChange={setSorting} onPageChange={setPage} onRetry={fetchData} />
      {deleteId !== null && <ConfirmDialog title="Delete Tournament" message="Are you sure you want to delete this tournament?" confirmLabel="Delete" isLoading={isDeleting} onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />}
    </div>
  );
}
