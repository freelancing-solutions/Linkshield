export interface ApiResponse<T = any> {
  data?: T;
  error_code?: string;
  message?: string;
  details?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface ApiError {
  error_code: string;
  message: string;
  details?: Record<string, any>;
  status: number;
}
