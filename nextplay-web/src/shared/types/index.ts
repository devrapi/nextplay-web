export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface SingleResponse<T> {
  data: T;
}

export interface QueryParams {
  search?: string;
  sort?: string;
  order?: 'asc' | 'dsc';
  per_page?: number;
  page?: number;
  [key: string]: string | number | boolean | undefined;
}
