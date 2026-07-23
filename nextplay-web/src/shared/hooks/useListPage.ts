import { useCallback, useEffect, useState } from 'react';
import { type SortingState, type OnChangeFn, type Updater } from '@tanstack/react-table';
import { useToast } from '../context/ToastContext';
import { useDebounce } from './useDebounce';
import type { PaginationMeta, QueryParams } from '../types';

interface ListService<T> {
  list: (params?: QueryParams) => Promise<{ data: T[]; meta: PaginationMeta }>;
  delete: (id: number) => Promise<void>;
}

interface UseListPageConfig<T> {
  service: ListService<T>;
  entityName: string;
}

interface UseListPageReturn<T> {
  data: T[];
  meta: PaginationMeta;
  isLoading: boolean;
  isError: boolean;
  search: string;
  sorting: SortingState;
  deleteId: number | null;
  isDeleting: boolean;
  debouncedSearch: string;
  setSearch: (v: string) => void;
  setSorting: OnChangeFn<SortingState>;
  setPage: (v: number) => void;
  setDeleteId: (v: number | null) => void;
  fetchData: () => Promise<void>;
  handleDelete: () => Promise<void>;
}

export function useListPage<T>({ service, entityName }: UseListPageConfig<T>): UseListPageReturn<T> {
  const { addToast } = useToast();
  const [data, setData] = useState<T[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ current_page: 1, last_page: 1, per_page: 15, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [search, setSearch] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const debouncedSearch = useDebounce(search);

  const handleSortingChange: OnChangeFn<SortingState> = useCallback((updaterOrValue: Updater<SortingState>) => {
    setSorting((prev) => (typeof updaterOrValue === 'function' ? updaterOrValue(prev) : updaterOrValue));
  }, []);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const sf = sorting[0]?.id;
      const so = sorting[0]?.desc ? 'dsc' : 'asc';
      const r = await service.list({
        search: debouncedSearch || undefined,
        sort: sf,
        order: so,
        page,
        per_page: meta.per_page,
      });
      setData(r.data);
      setMeta(r.meta);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, sorting, page, meta.per_page, service]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => { setPage(1); }, [debouncedSearch]);

  const handleDelete = async () => {
    if (deleteId === null) return;
    setIsDeleting(true);
    try {
      await service.delete(deleteId);
      addToast('success', `${entityName} deleted`);
      fetchData();
    } catch {
      addToast('error', `Failed to delete ${entityName.toLowerCase()}`);
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  return {
    data, meta, isLoading, isError, search, sorting, deleteId, isDeleting, debouncedSearch,
    setSearch, setSorting: handleSortingChange, setPage, setDeleteId,
    fetchData, handleDelete,
  };
}
