import React from 'react'
import { render } from '@testing-library/react'

import ChartTableHeader from '../ChartTableHeader'
import { CheckedRowsContext } from '../../checkedRowsContext'

describe('ChartTableHeader', () => {
  it('should render only children', () => {
    const { queryAllByTestId, queryByText } = render(
      <ChartTableHeader
        logarithmicScale={{ isCheckboxShown: false, setChecked: jest.fn }}
        axisOptions={{ isCheckboxShown: false, setChecked: jest.fn() }}
      >
        <span>Test</span>
      </ChartTableHeader>
    )

    const checkboxes = queryAllByTestId('title-checkbox')

    expect(checkboxes.length).toBe(0)
    expect(queryByText('Test')).toBeTruthy()
  })

  it('should render children if checkedTableRows === dataLength', () => {
    const { queryAllByTestId, queryByText } = render(
      <CheckedRowsContext.Provider
        value={{
          checkedTableRows: ['1', '2', '3'],
          checkedLogRows: [],
          checkedAxisRows: [],
          dataLength: 3,
          setCheckedAxisRows: jest.fn,
          setCheckedLogRows: jest.fn(),
          setCheckedTableRows: jest.fn(),
        }}
      >
        <ChartTableHeader
          logarithmicScale={{ isCheckboxShown: true, setChecked: jest.fn }}
          axisOptions={{ isCheckboxShown: true, setChecked: jest.fn() }}
        >
          <span>Test</span>
        </ChartTableHeader>
      </CheckedRowsContext.Provider>
    )

    const checkboxes = queryAllByTestId('title-checkbox')

    expect(checkboxes.length).toBe(0)
    expect(queryByText('Test')).toBeTruthy()
  })

  it('should render log checkbox', () => {
    const { queryAllByTestId, queryByText } = render(
      <CheckedRowsContext.Provider
        value={{
          checkedTableRows: ['1', '2', '3'],
          checkedLogRows: [],
          checkedAxisRows: [],
          dataLength: 10,
          setCheckedAxisRows: jest.fn,
          setCheckedLogRows: jest.fn(),
          setCheckedTableRows: jest.fn(),
        }}
      >
        <ChartTableHeader
          logarithmicScale={{ isCheckboxShown: true, setChecked: jest.fn }}
          axisOptions={{ isCheckboxShown: false, setChecked: jest.fn() }}
        >
          <span>Test</span>
        </ChartTableHeader>
      </CheckedRowsContext.Provider>
    )

    const checkboxes = queryAllByTestId('title-checkbox')

    expect(checkboxes.length).toBe(1)
    expect(queryByText('Logarithmic Scale')).toBeTruthy()
    expect(queryByText('Axes')).toBeNull()
  })

  it('should render axis checkbox', () => {
    const { queryAllByTestId, queryByText } = render(
      <CheckedRowsContext.Provider
        value={{
          checkedTableRows: ['1', '2', '3'],
          checkedLogRows: [],
          checkedAxisRows: [],
          dataLength: 10,
          setCheckedAxisRows: jest.fn,
          setCheckedLogRows: jest.fn(),
          setCheckedTableRows: jest.fn(),
        }}
      >
        <ChartTableHeader
          logarithmicScale={{ isCheckboxShown: false, setChecked: jest.fn }}
          axisOptions={{ isCheckboxShown: true, setChecked: jest.fn() }}
        >
          <span>Test</span>
        </ChartTableHeader>
      </CheckedRowsContext.Provider>
    )

    const checkboxes = queryAllByTestId('title-checkbox')

    expect(checkboxes.length).toBe(1)
    expect(queryByText('Logarithmic Scale')).toBeNull()
    expect(queryByText('Axes')).toBeTruthy()
  })
})
