import { useCallback, useEffect, useState } from 'react'

import { PaginationProps, UsePagination } from './model'

const usePagination = (pagination?: PaginationProps | boolean): UsePagination => {
  const [_currentPage, _setCurrentPage] = useState<number>(
    (pagination && typeof pagination !== 'boolean' && pagination?.current) || 1
  )

  const [_pageSize, _setPageSize] = useState<number>(
    (pagination && typeof pagination !== 'boolean' && pagination?.pageSize) || 10
  )

  const updatePageSize = useCallback(
    pageSize => {
      if (pagination && typeof pagination !== 'boolean' && pagination?.onPageSizeChange) {
        pagination?.onPageSizeChange(pageSize)
      } else {
        _setPageSize(pageSize)
      }
    },
    [pagination]
  )

  const updateCurrentPage = useCallback(
    page => {
      if (pagination && typeof pagination !== 'boolean' && pagination?.onCurrentPageChange) {
        pagination?.onCurrentPageChange(page)
      } else {
        _setCurrentPage(page)
      }
    },
    [pagination]
  )

  useEffect(() => {
    _setCurrentPage((pagination && typeof pagination !== 'boolean' && pagination?.current) || 1)
  }, [pagination])

  useEffect(() => {
    _setPageSize((pagination && typeof pagination !== 'boolean' && pagination?.pageSize) || 10)
  }, [pagination])

  return {
    current: _currentPage,
    pageSize: _pageSize,
    setPageSize: updatePageSize,
    setCurrentPage: updateCurrentPage,
  }
}

export default usePagination
