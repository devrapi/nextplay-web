import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';
import Breadcrumb from '../../../shared/components/Breadcrumb';
import DataTable from '../../../shared/components/DataTable';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import ActionMenu from '../../../shared/components/ActionMenu';
import { useListPage } from '../../../shared/hooks/useListPage';
import { gameService } from '../services/gameService';
import type { Game } from '../types';

const statusColors: Record<string, string> = {
  scheduled: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-amber-100 text-amber-700',
  completed: 'bg-emerald-100 text-emerald-700',
  postponed: 'bg-red-100 text-red-700',
};

export default function GameListPage() {
  const navigate = useNavigate();
  const { data, meta, isLoading, isError, search, setSearch, sorting, setSorting, setPage, deleteId, setDeleteId, isDeleting, fetchData, handleDelete } =
    useListPage<Game>({ service: gameService, entityName: 'Game' });

  const columns = useMemo<ColumnDef<Game>[]>(() => [
    { header: 'Matchup', enableSorting: false, cell: ({ row }) => {
      const g = row.original;
      return <Link to={`/admin/games/${g.id}`} className="font-medium text-indigo-600 hover:text-indigo-500">{g.home_team?.name ?? `#${g.home_team_id}`} vs {g.away_team?.name ?? `#${g.away_team_id}`}</Link>;
    }},
    { accessorKey: 'scheduled_at', header: 'Date', enableSorting: true, cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString() },
    { accessorKey: 'division_id', header: 'Division', enableSorting: true, cell: ({ row }) => row.original.division ? <Link to={`/admin/divisions/${row.original.division.id}`} className="text-indigo-600 hover:text-indigo-500">{row.original.division.name}</Link> : `#${row.original.division_id}` },
    { accessorKey: 'status', header: 'Status', enableSorting: true, cell: ({ getValue }) => {
      const s = getValue() as string;
      return <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${statusColors[s] ?? 'bg-gray-100 text-gray-600'}`}>{s.replace('_', ' ')}</span>;
    }},
    { header: 'Score', enableSorting: false, cell: ({ row }) => {
      const g = row.original;
      return g.status === 'completed' ? `${g.home_score ?? '?'} - ${g.away_score ?? '?'}` : '—';
    }},
    { id: 'actions', header: '', cell: ({ row }) => (
      <ActionMenu items={[
        { label: 'View', icon: <ActionMenu.ViewIcon />, onClick: () => navigate(`/admin/games/${row.original.id}`) },
        { label: 'Edit', icon: <ActionMenu.EditIcon />, onClick: () => navigate(`/admin/games/${row.original.id}/edit`) },
        { label: 'Delete', icon: <ActionMenu.DeleteIcon />, onClick: () => setDeleteId(row.original.id), destructive: true },
      ]} />
    )},
  ], [navigate, setDeleteId]);

  return (
    <div>
      <Breadcrumb items={[{ label: 'Games' }]} />
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Games</h1>
        <button type="button" onClick={() => navigate('/admin/games/new')} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 shadow-sm transition"><Plus className="h-4 w-4" /> Add Game</button>
      </div>
      <div className="mb-4"><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search games..." className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 outline-none sm:w-72 bg-white transition-all duration-150 hover:border-gray-400" /></div>
      <DataTable<Game> columns={columns} data={data} meta={meta} isLoading={isLoading} isError={isError} sorting={sorting} onSortingChange={setSorting} onPageChange={setPage} onRetry={fetchData} />
      {deleteId !== null && <ConfirmDialog title="Delete Game" message="Are you sure you want to delete this game? This action cannot be undone." confirmLabel="Delete" isLoading={isDeleting} onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />}
    </div>
  );
}
