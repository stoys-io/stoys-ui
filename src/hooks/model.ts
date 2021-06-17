export interface PaginationProps {
  disabled?: boolean
  currentPage?: number
  onCurrentPageChange?: (page: number) => void
  pageSize?: number
  onPageSizeChange?: (pageSize: number) => void
}

export interface UsePagination {
  currentPage: number
  setCurrentPage: (page: number) => void
  pageSize: number
  setPageSize: (pageSize: number) => void
}
