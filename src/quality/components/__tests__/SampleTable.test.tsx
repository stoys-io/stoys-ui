import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import 'src/__mocks__/matchMedia.mock'

import SampleTable from '../SampleTable'

describe('SampleTable', () => {
  const sampleColumns = [
    { dataIndex: 'id', title: 'id', render: (value: any) => value, sorter: () => 1 as 1 },
    { dataIndex: 'value', title: 'value', render: (value: any) => value, sorter: () => 1 as 1 },
    { dataIndex: 'count', title: 'count', render: (value: any) => value, sorter: () => 1 as 1 },
  ]
  const sampleData = Array.from(new Array(100), (value, index) => ({
    key: index + 1,
    id: index + 1,
    value: index + 1,
    count: index + 1,
  }))
  const currentPage = 1
  const pageSize = 10

  it('should update page', () => {
    const setPageMock = jest.fn()
    const setPageSizeMock = jest.fn()
    const { container } = render(
      <SampleTable
        sampleColumns={sampleColumns}
        sampleData={sampleData}
        currentPage={currentPage}
        pageSize={pageSize}
        setCurrentPage={setPageMock}
        setPageSize={setPageSizeMock}
        setShowReferencedColumns={jest.fn()}
        smallSize
        showReferencedColumns
      />
    )
    const currentPageNode = container.querySelector('.ant-pagination-item-active')
    const nextPage = container.querySelector('.ant-pagination-next').querySelector('button')

    expect(currentPageNode.textContent).toBe(`${currentPage}`)

    fireEvent.click(nextPage)

    expect(setPageMock).toBeCalledWith(2)
  })

  it("shouldn't render pagination when it disabled", () => {
    const setPageMock = jest.fn()
    const setPageSizeMock = jest.fn()
    const { container } = render(
      <SampleTable
        sampleColumns={sampleColumns}
        sampleData={sampleData}
        currentPage={currentPage}
        pageSize={pageSize}
        setCurrentPage={setPageMock}
        setPageSize={setPageSizeMock}
        setShowReferencedColumns={jest.fn()}
        smallSize
        withoutPagination
        showReferencedColumns
      />
    )
    const currentPageNode = container.querySelector('.ant-pagination-item-active')

    expect(currentPageNode).toBeNull()
  })
})
