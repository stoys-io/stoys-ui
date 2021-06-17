import React from 'react'
import { render, fireEvent, cleanup } from '@testing-library/react'

import { Pagination } from '../__mocks__/Pagination.mock'

describe('usePagination', () => {
  const simplePaginationProps = {
    currentPage: 1,
    pageSize: 10,
  }

  const fullPaginationProps = {
    disabled: false,
    currentPage: 1,
    onCurrentPageChange: jest.fn(),
    pageSize: 10,
    onPageSizeChange: jest.fn(),
  }

  afterEach(() => {
    cleanup()
  })

  it('should initialize with passed params', () => {
    const { getByTestId } = render(<Pagination {...simplePaginationProps} />)
    expect(getByTestId('currentPage').textContent).toBe(`${simplePaginationProps.currentPage}`)
    expect(getByTestId('pageSize').textContent).toBe(`${simplePaginationProps.pageSize}`)
  })

  it('shoud change page count', () => {
    const { getByTestId } = render(<Pagination {...simplePaginationProps} />)
    const nextBtn = getByTestId('next')
    expect(getByTestId('currentPage').textContent).toBe(`${simplePaginationProps.currentPage}`)
    fireEvent.click(nextBtn)
    expect(getByTestId('currentPage').textContent).toBe(`${simplePaginationProps.currentPage + 1}`)
  })

  it('shoud change page size', () => {
    const { getByTestId } = render(<Pagination {...simplePaginationProps} />)
    const changePageSize = getByTestId('page-size-btn')
    expect(getByTestId('pageSize').textContent).toBe(`${simplePaginationProps.pageSize}`)
    fireEvent.click(changePageSize)
    expect(getByTestId('pageSize').textContent).toBe(`${simplePaginationProps.pageSize + 10}`)
  })

  it('should call change page callback', () => {
    const { getByTestId } = render(<Pagination {...fullPaginationProps} />)
    const nextBtn = getByTestId('next')
    fireEvent.click(nextBtn)
    expect(fullPaginationProps.onCurrentPageChange).toBeCalled()
  })

  it('should call change page size callback', () => {
    const { getByTestId } = render(<Pagination {...fullPaginationProps} />)
    const changePageSize = getByTestId('page-size-btn')
    fireEvent.click(changePageSize)
    expect(fullPaginationProps.onPageSizeChange).toBeCalled()
  })

  it('should run without passed params', () => {
    const { getByTestId } = render(<Pagination />)
    expect(getByTestId('currentPage').textContent).toBe(`${simplePaginationProps.currentPage}`)
    expect(getByTestId('pageSize').textContent).toBe(`${simplePaginationProps.pageSize}`)
  })

  it('should update pages without passed params', () => {
    const { getByTestId } = render(<Pagination />)
    const nextBtn = getByTestId('next')
    expect(getByTestId('currentPage').textContent).toBe(`${simplePaginationProps.currentPage}`)
    fireEvent.click(nextBtn)
    expect(getByTestId('currentPage').textContent).toBe(`${simplePaginationProps.currentPage + 1}`)
  })

  it('should update pages without passed params', () => {
    const { getByTestId } = render(<Pagination />)
    const changePageSize = getByTestId('page-size-btn')
    expect(getByTestId('pageSize').textContent).toBe(`${simplePaginationProps.pageSize}`)
    fireEvent.click(changePageSize)
    expect(getByTestId('pageSize').textContent).toBe(`${simplePaginationProps.pageSize + 10}`)
  })
})
