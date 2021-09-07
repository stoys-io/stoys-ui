import React from 'react'
import { PaginationProps, usePagination } from '..'

export function Pagination(pagination: PaginationProps): JSX.Element {
  const { current, pageSize, setPageSize, setCurrentPage } = usePagination(pagination)
  const nextHandler = () => setCurrentPage(current + 1)

  return (
    <div>
      <span data-testid="currentPage">{current}</span>
      <span data-testid="pageSize">{pageSize}</span>
      <button data-testid="next" onClick={nextHandler}>
        Next
      </button>
      <button data-testid="page-size-btn" onClick={() => setPageSize(20)}>
        setPageSize
      </button>
    </div>
  )
}
