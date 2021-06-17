import React from 'react'
import { render, fireEvent } from '@testing-library/react'

import ChartTitle from '../ChartTitle'
import { CheckedRowsContext } from '../../checkedRowsContext'

describe('ChartTitle', () => {
  it("shouldn't render any checkboxes when they are disabled", () => {
    const { queryAllByTestId, queryByTestId } = render(
      <CheckedRowsContext.Provider
        value={{
          checkedTableRows: ['1', '2', '3'],
          checkedLogRows: [],
          checkedAxisRows: [],
          dataLength: 10,
          setCheckedAxisRows: jest.fn(),
          setCheckedLogRows: jest.fn(),
          setCheckedTableRows: jest.fn(),
        }}
      >
        <ChartTitle
          row={{ columnName: 'id', key: 'id', children: [] }}
          rowOptions={{
            isLogCheckboxShown: false,
            isAxisCheckboxShown: false,
          }}
          tableOptions={undefined}
        />
      </CheckedRowsContext.Provider>
    )

    const checkboxes = queryAllByTestId('title-checkbox')
    const tableRadioBtn = queryByTestId('table-view-btn')
    const chartRadioBtn = queryByTestId('chart-view-btn')

    expect(checkboxes.length).toBe(0)
    expect(tableRadioBtn).toBeNull()
    expect(chartRadioBtn).toBeNull()
  })

  it('should render log checkbox', () => {
    const { queryAllByTestId, queryByTestId, queryByText } = render(
      <CheckedRowsContext.Provider
        value={{
          checkedTableRows: ['1', '2', '3'],
          checkedLogRows: [],
          checkedAxisRows: [],
          dataLength: 10,
          setCheckedAxisRows: jest.fn(),
          setCheckedLogRows: jest.fn(),
          setCheckedTableRows: jest.fn(),
        }}
      >
        <ChartTitle
          row={{ columnName: 'id', key: 'id', children: [] }}
          rowOptions={{
            isLogCheckboxShown: true,
            isAxisCheckboxShown: false,
          }}
          tableOptions={{ isCheckboxShown: false, setChecked: jest.fn() }}
        />
      </CheckedRowsContext.Provider>
    )

    const checkboxes = queryAllByTestId('title-checkbox')
    const tableRadioBtn = queryByTestId('table-view-btn')
    const chartRadioBtn = queryByTestId('chart-view-btn')

    expect(checkboxes.length).toBe(1)
    expect(queryByText('Logarithmic Scale')).toBeTruthy()
    expect(queryByText('Axes')).toBeNull()
    expect(tableRadioBtn).toBeNull()
    expect(chartRadioBtn).toBeNull()
  })

  it('should call setCheckedLogRows', () => {
    const setCheckedMock = jest.fn()
    const { queryAllByTestId } = render(
      <CheckedRowsContext.Provider
        value={{
          checkedTableRows: ['1', '2', '3'],
          checkedLogRows: ['id'],
          checkedAxisRows: [],
          dataLength: 10,
          setCheckedAxisRows: jest.fn(),
          setCheckedLogRows: setCheckedMock,
          setCheckedTableRows: jest.fn(),
        }}
      >
        <ChartTitle
          row={{ columnName: 'id', key: 'id', children: [] }}
          rowOptions={{
            isLogCheckboxShown: true,
            isAxisCheckboxShown: false,
          }}
          tableOptions={{ isCheckboxShown: false, setChecked: jest.fn() }}
        />
      </CheckedRowsContext.Provider>
    )

    const checkboxes = queryAllByTestId('title-checkbox')

    fireEvent.click(checkboxes[0])

    expect(setCheckedMock).toBeCalledWith([])
  })

  it('should render axis checkbox', () => {
    const { queryAllByTestId, queryByTestId, queryByText } = render(
      <CheckedRowsContext.Provider
        value={{
          checkedTableRows: ['1', '2', '3'],
          checkedLogRows: [],
          checkedAxisRows: [],
          dataLength: 10,
          setCheckedAxisRows: jest.fn(),
          setCheckedLogRows: jest.fn(),
          setCheckedTableRows: jest.fn(),
        }}
      >
        <ChartTitle
          row={{ columnName: 'id', key: 'id', children: [] }}
          rowOptions={{
            isLogCheckboxShown: false,
            isAxisCheckboxShown: true,
          }}
          tableOptions={{ isCheckboxShown: false, setChecked: jest.fn() }}
        />
      </CheckedRowsContext.Provider>
    )

    const checkboxes = queryAllByTestId('title-checkbox')
    const tableRadioBtn = queryByTestId('table-view-btn')
    const chartRadioBtn = queryByTestId('chart-view-btn')

    expect(checkboxes.length).toBe(1)
    expect(queryByText('Logarithmic Scale')).toBeNull()
    expect(queryByText('Axes')).toBeTruthy()
    expect(tableRadioBtn).toBeNull()
    expect(chartRadioBtn).toBeNull()
  })

  it('should call setCheckedAxisRows', () => {
    const setCheckedMock = jest.fn()
    const { queryAllByTestId } = render(
      <CheckedRowsContext.Provider
        value={{
          checkedTableRows: ['1', '2', '3'],
          checkedLogRows: [],
          checkedAxisRows: [],
          dataLength: 10,
          setCheckedAxisRows: setCheckedMock,
          setCheckedLogRows: jest.fn(),
          setCheckedTableRows: jest.fn(),
        }}
      >
        <ChartTitle
          row={{ columnName: 'id', key: 'id', children: [] }}
          rowOptions={{
            isLogCheckboxShown: false,
            isAxisCheckboxShown: true,
          }}
          tableOptions={{ isCheckboxShown: false, setChecked: jest.fn() }}
        />
      </CheckedRowsContext.Provider>
    )

    const checkboxes = queryAllByTestId('title-checkbox')

    fireEvent.click(checkboxes[0])

    expect(setCheckedMock).toBeCalledWith(['id'])
  })

  it('should render table/chart switcher', () => {
    const { queryAllByTestId, queryByTestId } = render(
      <CheckedRowsContext.Provider
        value={{
          checkedTableRows: ['1', '2', '3'],
          checkedLogRows: [],
          checkedAxisRows: [],
          dataLength: 10,
          setCheckedAxisRows: jest.fn(),
          setCheckedLogRows: jest.fn(),
          setCheckedTableRows: jest.fn(),
        }}
      >
        <ChartTitle
          row={{ columnName: 'id', key: 'id', children: [] }}
          rowOptions={{
            isLogCheckboxShown: false,
            isAxisCheckboxShown: false,
          }}
          tableOptions={{ isCheckboxShown: true, setChecked: jest.fn() }}
        />
      </CheckedRowsContext.Provider>
    )

    const checkboxes = queryAllByTestId('title-checkbox')
    const tableRadioBtn = queryByTestId('table-view-btn')
    const chartRadioBtn = queryByTestId('chart-view-btn')

    expect(checkboxes.length).toBe(0)
    expect(tableRadioBtn).toBeTruthy()
    expect(chartRadioBtn).toBeTruthy()
  })

  it('should call setCheckedTableRows', () => {
    const setCheckedMock = jest.fn()
    const baseValue = {
      checkedLogRows: ['1'],
      checkedAxisRows: ['1'],
      dataLength: 10,
      setCheckedAxisRows: jest.fn(),
      setCheckedLogRows: jest.fn(),
      setCheckedTableRows: setCheckedMock,
    }
    const valueMock = {
      ...baseValue,
      checkedTableRows: ['1', '2', '3'],
    }
    const updatedValueMock = {
      ...baseValue,
      checkedTableRows: ['1', '2', '3', 'id'],
    }
    const rowMock = { columnName: 'id', key: 'id', children: [] as any }
    const rowOptionsMock = {
      isLogCheckboxShown: false,
      isAxisCheckboxShown: false,
    }
    const tableOptionsMock = { isCheckboxShown: true, setChecked: jest.fn() }
    const { queryByTestId, rerender } = render(
      <CheckedRowsContext.Provider value={valueMock}>
        <ChartTitle row={rowMock} rowOptions={rowOptionsMock} tableOptions={tableOptionsMock} />
      </CheckedRowsContext.Provider>
    )

    const tableRadioBtn = queryByTestId('table-view-btn')

    fireEvent.click(tableRadioBtn)

    expect(setCheckedMock).toBeCalledWith(['1', '2', '3', 'id'])

    rerender(
      <CheckedRowsContext.Provider value={updatedValueMock}>
        <ChartTitle row={rowMock} rowOptions={rowOptionsMock} tableOptions={tableOptionsMock} />
      </CheckedRowsContext.Provider>
    )

    const chartRadioBtn = queryByTestId('chart-view-btn')

    fireEvent.click(chartRadioBtn)

    expect(setCheckedMock).toBeCalledWith(['1', '2', '3'])
  })
})
