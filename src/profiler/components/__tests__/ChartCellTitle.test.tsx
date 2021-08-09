import React from 'react'
import { render, fireEvent } from '@testing-library/react'

import ChartCellTitle from '../ChartCellTitle'
import { CheckedRowsContext } from '../../checkedRowsContext'

jest.mock('../../icons/axes.svg', () => ({ ReactComponent: () => 'icon' }))

describe('ChartCellTitle', () => {
  it("shouldn't render any checkboxes when they are disabled", () => {
    const { queryByTestId } = render(
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
        <ChartCellTitle
          row={{ columnName: 'id', key: 'id', children: [] }}
          rowOptions={{
            isLogCheckboxShown: false,
            isAxisCheckboxShown: false,
          }}
          tableOptions={{ isCheckboxShown: false }}
        />
      </CheckedRowsContext.Provider>
    )

    const tableBtn = queryByTestId('table-view-btn')
    const logBtn = queryByTestId('log-btn')
    const axesBtn = queryByTestId('axes-btn')

    expect(tableBtn).toBeNull()
    expect(logBtn).toBeNull()
    expect(axesBtn).toBeNull()
  })

  it('should render log checkbox', () => {
    const { queryByTestId } = render(
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
        <ChartCellTitle
          row={{ columnName: 'id', key: 'id', children: [] }}
          rowOptions={{
            isLogCheckboxShown: true,
            isAxisCheckboxShown: false,
          }}
          tableOptions={{ isCheckboxShown: false, setChecked: jest.fn() }}
        />
      </CheckedRowsContext.Provider>
    )

    const tableBtn = queryByTestId('table-view-btn')
    const logBtn = queryByTestId('log-btn')
    const axesBtn = queryByTestId('axes-btn')

    expect(tableBtn).toBeNull()
    expect(logBtn).toBeTruthy()
    expect(axesBtn).toBeNull()
  })

  it('should call setCheckedLogRows', () => {
    const setCheckedMock = jest.fn()
    const { queryByTestId } = render(
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
        <ChartCellTitle
          row={{ columnName: 'id', key: 'id', children: [] }}
          rowOptions={{
            isLogCheckboxShown: true,
            isAxisCheckboxShown: false,
          }}
          tableOptions={{ isCheckboxShown: false, setChecked: jest.fn() }}
        />
      </CheckedRowsContext.Provider>
    )

    const logBtn = queryByTestId('log-btn')

    fireEvent.click(logBtn)

    expect(setCheckedMock).toBeCalledWith([])
  })

  it('should render axis checkbox', () => {
    const { queryByTestId } = render(
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
        <ChartCellTitle
          row={{ columnName: 'id', key: 'id', children: [] }}
          rowOptions={{
            isLogCheckboxShown: false,
            isAxisCheckboxShown: true,
          }}
          tableOptions={{ isCheckboxShown: false, setChecked: jest.fn() }}
        />
      </CheckedRowsContext.Provider>
    )

    const tableBtn = queryByTestId('table-view-btn')
    const logBtn = queryByTestId('log-btn')
    const axesBtn = queryByTestId('axes-btn')

    expect(tableBtn).toBeNull()
    expect(logBtn).toBeNull()
    expect(axesBtn).toBeTruthy()
  })

  it('should call setCheckedAxisRows', () => {
    const setCheckedMock = jest.fn()
    const { queryByTestId } = render(
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
        <ChartCellTitle
          row={{ columnName: 'id', key: 'id', children: [] }}
          rowOptions={{
            isLogCheckboxShown: false,
            isAxisCheckboxShown: true,
          }}
          tableOptions={{ isCheckboxShown: false, setChecked: jest.fn() }}
        />
      </CheckedRowsContext.Provider>
    )

    const axesBtn = queryByTestId('axes-btn')

    fireEvent.click(axesBtn)

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
        <ChartCellTitle
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

    expect(checkboxes.length).toBe(0)
    expect(tableRadioBtn).toBeTruthy()
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
        <ChartCellTitle row={rowMock} rowOptions={rowOptionsMock} tableOptions={tableOptionsMock} />
      </CheckedRowsContext.Provider>
    )

    const tableRadioBtn = queryByTestId('table-view-btn')

    fireEvent.click(tableRadioBtn)

    expect(setCheckedMock).toBeCalledWith(['1', '2', '3', 'id'])

    rerender(
      <CheckedRowsContext.Provider value={updatedValueMock}>
        <ChartCellTitle row={rowMock} rowOptions={rowOptionsMock} tableOptions={tableOptionsMock} />
      </CheckedRowsContext.Provider>
    )

    fireEvent.click(tableRadioBtn)

    expect(setCheckedMock).toBeCalledWith(['1', '2', '3'])
  })
})
