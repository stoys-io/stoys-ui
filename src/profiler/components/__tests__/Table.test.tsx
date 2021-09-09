import React from 'react'
import { render } from '@testing-library/react'
import '../../../__mocks__/matchMedia.mock'

import Table from '../Table'

describe('Chart Table', () => {
  it('should render numeric table', () => {
    const dataMock = [
      {
        color: 'red',
        name: 'id-0',
        parent: 'ID',
        type: 'long',
        pmf: [] as any,
        items: [
          { item: '1', count: 100 },
          { item: '2', count: 200 },
        ],
      },
      {
        color: 'green',
        name: 'id-1',
        parent: 'ID',
        type: 'long',
        pmf: [] as any,
        items: [
          { item: '1', count: 300 },
          { item: '2', count: 400 },
        ],
      },
    ]
    const { queryByText } = render(<Table height={100} data={dataMock} />)

    expect(queryByText('100')).toBeTruthy()
    expect(queryByText('200')).toBeTruthy()
    expect(queryByText('300')).toBeTruthy()
    expect(queryByText('400')).toBeTruthy()
  })

  it('should render table with dates', () => {
    const convertToDate = (value: string) =>
      new Date(+value * 1000).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      })

    const date1 = '946684800'
    const date2 = '949363200'
    const dataMock = [
      {
        color: 'red',
        name: 'id-0',
        parent: 'ID',
        type: 'timestamp',
        pmf: [] as any,
        items: [
          { item: date1, count: 100 },
          { item: date2, count: 200 },
        ],
      },
      {
        color: 'green',
        name: 'id-1',
        parent: 'ID',
        type: 'timestamp',
        pmf: [] as any,
        items: [
          { item: date1, count: 300 },
          { item: date2, count: 400 },
        ],
      },
    ]
    const { queryAllByText } = render(<Table height={100} data={dataMock} />)

    const convertedDates1 = queryAllByText(convertToDate(date1))
    const convertedDates2 = queryAllByText(convertToDate(date2))

    expect(convertedDates1.length).toBe(1)
    expect(convertedDates2.length).toBe(1)
  })

  it('should render table with strings', () => {
    const dataMock = [
      {
        color: 'red',
        name: 'id-0',
        parent: 'ID',
        type: 'string',
        pmf: [] as any,
        items: [
          { item: '1', count: 100 },
          { item: '2', count: 200 },
        ],
      },
      {
        color: 'green',
        name: 'id-1',
        parent: 'ID',
        type: 'string',
        pmf: [] as any,
        items: [
          { item: '1', count: 300 },
          { item: '2', count: 400 },
        ],
      },
    ]
    const { queryByText } = render(<Table height={100} data={dataMock} />)

    expect(queryByText('100')).toBeTruthy()
    expect(queryByText('200')).toBeTruthy()
    expect(queryByText('300')).toBeTruthy()
    expect(queryByText('400')).toBeTruthy()
  })
})
