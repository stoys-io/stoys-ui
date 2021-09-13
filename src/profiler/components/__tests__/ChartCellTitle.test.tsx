import React from 'react'
import { render, fireEvent } from '@testing-library/react'

import ChartCellTitle from '../ChartCellTitle'
import { CheckedRowsContext, ConfigContext } from '../../context'

jest.mock('../../icons/axes.svg', () => ({ ReactComponent: () => 'icon' }))

describe('ChartCellTitle', () => {
  it("shouldn't render any checkboxes when they are disabled", () => {
    const { queryByTestId } = render(
      <ConfigContext.Provider
        value={{
          showChartTableSwitcher: false,
          showAxesSwitcher: false,
          showLogarithmicSwitcher: false,
        }}
      >
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
          <ChartCellTitle row={{ columnName: 'id', key: 'id', children: [] }} />
        </CheckedRowsContext.Provider>
      </ConfigContext.Provider>
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
      <ConfigContext.Provider
        value={{
          showChartTableSwitcher: false,
          showLogarithmicSwitcher: true,
          showAxesSwitcher: false,
        }}
      >
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
          <ChartCellTitle row={{ columnName: 'id', key: 'id', children: [] }} />
        </CheckedRowsContext.Provider>
      </ConfigContext.Provider>
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
      <ConfigContext.Provider
        value={{
          showChartTableSwitcher: false,
          showLogarithmicSwitcher: true,
          showAxesSwitcher: false,
        }}
      >
        <CheckedRowsContext.Provider
          value={{
            checkedTableRows: ['1', '2', '3'],
            checkedLogRows: ['id'],
            checkedAxesRows: [],
            dataLength: 10,
            setCheckedAxesRows: jest.fn(),
            setCheckedLogRows: setCheckedMock,
            setCheckedTableRows: jest.fn(),
          }}
        >
          <ChartCellTitle row={{ columnName: 'id', key: 'id', children: [] }} />
        </CheckedRowsContext.Provider>
      </ConfigContext.Provider>
    )

    const logBtn = queryByTestId('log-btn')

    fireEvent.click(logBtn)

    expect(setCheckedMock).toBeCalledWith([])
  })

  it('should render axes checkbox', () => {
    const { queryByTestId } = render(
      <ConfigContext.Provider
        value={{
          showChartTableSwitcher: false,
          showLogarithmicSwitcher: false,
          showAxesSwitcher: true,
        }}
      >
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
          <ChartCellTitle row={{ columnName: 'id', key: 'id', children: [] }} />
        </CheckedRowsContext.Provider>
      </ConfigContext.Provider>
    )

    const tableBtn = queryByTestId('table-view-btn')
    const logBtn = queryByTestId('log-btn')
    const axesBtn = queryByTestId('axes-btn')

    expect(tableBtn).toBeNull()
    expect(logBtn).toBeNull()
    expect(axesBtn).toBeTruthy()
  })

  it('should call setCheckedAxesRows', () => {
    const setCheckedMock = jest.fn()
    const { queryByTestId } = render(
      <ConfigContext.Provider
        value={{
          showChartTableSwitcher: false,
          showLogarithmicSwitcher: false,
          showAxesSwitcher: true,
        }}
      >
        <CheckedRowsContext.Provider
          value={{
            checkedTableRows: ['1', '2', '3'],
            checkedLogRows: [],
            checkedAxesRows: [],
            dataLength: 10,
            setCheckedAxesRows: setCheckedMock,
            setCheckedLogRows: jest.fn(),
            setCheckedTableRows: jest.fn(),
          }}
        >
          <ChartCellTitle row={{ columnName: 'id', key: 'id', children: [] }} />
        </CheckedRowsContext.Provider>
      </ConfigContext.Provider>
    )

    const axesBtn = queryByTestId('axes-btn')

    fireEvent.click(axesBtn)

    expect(setCheckedMock).toBeCalledWith(['id'])
  })

  it('should render table/chart switcher', () => {
    const { queryAllByTestId, queryByTestId } = render(
      <ConfigContext.Provider
        value={{
          showChartTableSwitcher: true,
          showLogarithmicSwitcher: false,
          showAxesSwitcher: false,
        }}
      >
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
          <ChartCellTitle row={{ columnName: 'id', key: 'id', children: [] }} />
        </CheckedRowsContext.Provider>
      </ConfigContext.Provider>
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
      checkedAxesRows: ['1'],
      dataLength: 10,
      setCheckedAxesRows: jest.fn(),
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
    const tableOptionsMock = {
      showChartTableSwitcher: true,
      showLogarithmicSwitcher: false,
      showAxesSwitcher: false,
    }
    const { queryByTestId, rerender } = render(
      <ConfigContext.Provider value={tableOptionsMock}>
        <CheckedRowsContext.Provider value={valueMock}>
          <ChartCellTitle row={rowMock} />
        </CheckedRowsContext.Provider>
      </ConfigContext.Provider>
    )

    const tableRadioBtn = queryByTestId('table-view-btn')

    fireEvent.click(tableRadioBtn)

    expect(setCheckedMock).toBeCalledWith(['1', '2', '3', 'id'])

    rerender(
      <ConfigContext.Provider value={tableOptionsMock}>
        <CheckedRowsContext.Provider value={updatedValueMock}>
          <ChartCellTitle row={rowMock} />
        </CheckedRowsContext.Provider>
      </ConfigContext.Provider>
    )

    fireEvent.click(tableRadioBtn)

    expect(setCheckedMock).toBeCalledWith(['1', '2', '3'])
  })
})
