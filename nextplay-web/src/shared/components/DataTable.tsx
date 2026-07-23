import { flexRender, getCoreRowModel, useReactTable, type ColumnDef, type SortingState, type OnChangeFn } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { TableSkeleton } from './Skeleton';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';
import Pagination from './Pagination';
import type { PaginationMeta } from '../types';

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  meta?: PaginationMeta;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onPageChange?: (page: number) => void;
  onSortingChange?: OnChangeFn<SortingState>;
  sorting?: SortingState;
  onRetry?: () => void;
}

export default function DataTable<T>({
  columns,
  data,
  meta,
  isLoading,
  isError,
  errorMessage,
  onPageChange,
  onSortingChange,
  sorting,
  onRetry,
}: DataTableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    state: { sorting },
    onSortingChange,
  });

  if (isError) {
    return <ErrorState message={errorMessage} onRetry={onRetry} />;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-gray-50">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={`px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 ${
                      header.column.getCanSort() ? 'cursor-pointer select-none hover:text-gray-700' : ''
                    }`}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1.5">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <ArrowUpDown className="h-3.5 w-3.5 text-gray-400" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          {isLoading ? (
            <TableSkeleton rows={5} cols={columns.length} />
          ) : data.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={columns.length} className="px-5 py-12">
                  <EmptyState />
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody className="divide-y divide-gray-50">
              {table.getRowModel().rows.map((row, idx) => (
                <tr
                  key={row.id}
                  className={`transition hover:bg-gray-50/80 ${idx % 2 === 1 ? 'bg-gray-50/40' : ''}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="whitespace-nowrap px-5 py-4 text-sm text-gray-700">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>

      {meta && onPageChange && !isLoading && (
        <div className="border-t border-gray-100 px-5 py-4">
          <Pagination meta={meta} onPageChange={onPageChange} />
        </div>
      )}
    </div>
  );
}
