import { TablePaginationConfig } from 'antd/lib/table'

export interface PaginationProps extends TablePaginationConfig {
  onCurrentPageChange?: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
}

export interface UsePagination {
  current: number
  setCurrentPage: (page: number) => void
  pageSize: number
  setPageSize: (pageSize: number) => void
}
