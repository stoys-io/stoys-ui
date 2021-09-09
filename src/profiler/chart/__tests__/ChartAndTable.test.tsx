import React from 'react'
import { render } from '@testing-library/react'
import '../../../__mocks__/matchMedia.mock'

import Chart from '../ChartAndTable'
import { CheckedRowsContext, SizeContext } from '../../context'

beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = jest.fn(
    () => ({ measureText: jest.fn(() => ({ width: 100 })) } as any)
  )
})

describe('Chart', () => {
  it('should be empty whren data is null', () => {
    const { container } = render(
      <SizeContext.Provider value={true}>
        <CheckedRowsContext.Provider
          value={{
            checkedTableRows: ['1', '2', '3'],
            checkedLogRows: [],
            checkedAxesRows: [],
            dataLength: 10,
            setCheckedAxesRows: jest.fn(),
            setCheckedLogRows: jest.fn(),
            setCheckedTableRows: jest.fn(),
          }}
        >
          <Chart data={null} />
        </CheckedRowsContext.Provider>
      </SizeContext.Provider>
    )

    expect(container.firstChild).toBeNull()
  })

  it('should render table', () => {
    const { container } = render(
      <CheckedRowsContext.Provider
        value={{
          checkedTableRows: ['1', '2', '3'],
          checkedLogRows: [],
          checkedAxesRows: [],
          dataLength: 10,
          setCheckedAxesRows: jest.fn(),
          setCheckedLogRows: jest.fn(),
          setCheckedTableRows: jest.fn(),
        }}
      >
        <Chart data={[{ parent: '1', color: '#fff', name: 'id', type: 'string' }]} />
      </CheckedRowsContext.Provider>
    )

    expect(container.querySelector('table')).toBeTruthy()
  })

  it('should render empty component when type is string', () => {
    const { getByTestId } = render(
      <CheckedRowsContext.Provider
        value={{
          checkedTableRows: [],
          checkedLogRows: [],
          checkedAxesRows: [],
          dataLength: 10,
          setCheckedAxesRows: jest.fn(),
          setCheckedLogRows: jest.fn(),
          setCheckedTableRows: jest.fn(),
        }}
      >
        <Chart
          data={[
            {
              parent: '1',
              color: '#fff',
              name: 'id',
              type: 'string',
              items: [],
            },
          ]}
        />
      </CheckedRowsContext.Provider>
    )

    expect(getByTestId('bars-empty')).toBeTruthy()
  })

  it('should render bar chart', () => {
    const { getByTestId } = render(
      <CheckedRowsContext.Provider
        value={{
          checkedTableRows: [],
          checkedLogRows: [],
          checkedAxesRows: [],
          dataLength: 10,
          setCheckedAxesRows: jest.fn(),
          setCheckedLogRows: jest.fn(),
          setCheckedTableRows: jest.fn(),
        }}
      >
        <Chart
          data={[
            {
              parent: '1',
              color: '#fff',
              name: 'id',
              type: 'string',
              items: [
                { count: 1, item: '0' },
                { count: 2, item: '1' },
                { count: 1.5, item: '2' },
              ],
            },
          ]}
        />
      </CheckedRowsContext.Provider>
    )

    expect(getByTestId('bar-chart')).toBeTruthy()
  })

  it('should render empty for other types', () => {
    const { getByTestId } = render(
      <CheckedRowsContext.Provider
        value={{
          checkedTableRows: [],
          checkedLogRows: [],
          checkedAxesRows: [],
          dataLength: 10,
          setCheckedAxesRows: jest.fn(),
          setCheckedLogRows: jest.fn(),
          setCheckedTableRows: jest.fn(),
        }}
      >
        <Chart
          data={[
            {
              parent: '1',
              color: '#fff',
              name: 'id',
              type: 'number',
              pmf: [],
            },
          ]}
        />
      </CheckedRowsContext.Provider>
    )

    expect(getByTestId('pmf-empty')).toBeTruthy()
  })

  it('should render pmf plot', () => {
    const { getByTestId } = render(
      <CheckedRowsContext.Provider
        value={{
          checkedTableRows: [],
          checkedLogRows: [],
          checkedAxesRows: [],
          dataLength: 10,
          setCheckedAxesRows: jest.fn(),
          setCheckedLogRows: jest.fn(),
          setCheckedTableRows: jest.fn(),
        }}
      >
        <Chart
          data={[
            {
              parent: '1',
              color: '#fff',
              name: 'id',
              type: 'number',
              pmf: [
                { count: 1, low: 0, high: 1 },
                { count: 2, low: 1, high: 2 },
                { count: 1.5, low: 2, high: 3 },
              ],
            },
          ]}
        />
      </CheckedRowsContext.Provider>
    )

    expect(getByTestId('pmf-plot')).toBeTruthy()
  })
})
