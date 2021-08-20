import { useCallback, useEffect, useState } from 'react'

import { PaginationProps, UsePagination } from './model'

const usePagination = (pagination?: PaginationProps | false): UsePagination => {
  const [_currentPage, _setCurrentPage] = useState<number>((pagination && pagination?.current) || 1)

  const [_pageSize, _setPageSize] = useState<number>((pagination && pagination?.pageSize) || 10)

  const updatePageSize = useCallback(
    pageSize => {
      if (pagination && pagination?.onPageSizeChange) {
        pagination?.onPageSizeChange(pageSize)
      } else {
        _setPageSize(pageSize)
      }
    },
    [pagination]
  )

  const updateCurrentPage = useCallback(
    page => {
      if (pagination && pagination?.onCurrentPageChange) {
        pagination?.onCurrentPageChange(page)
      } else {
        _setCurrentPage(page)
      }
    },
    [pagination]
  )

  useEffect(() => {
    _setCurrentPage((pagination && pagination?.current) || 1)
  }, [pagination])

  useEffect(() => {
    _setPageSize((pagination && pagination?.pageSize) || 10)
  }, [pagination])

  return {
    current: _currentPage,
    pageSize: _pageSize,
    setPageSize: updatePageSize,
    setCurrentPage: updateCurrentPage,
  }
}

export default usePagination
