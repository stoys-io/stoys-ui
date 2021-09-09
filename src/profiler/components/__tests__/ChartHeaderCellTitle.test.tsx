import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '../../../__mocks__/matchMedia.mock'

import ChartAndTableHeaderCellTitle from '../ChartAndTableHeaderCellTitle'
import { TableOptionsContext } from '../../context'

beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = jest.fn(
    () => ({ measureText: jest.fn(() => ({ width: 100 })) } as any)
  )
})

describe('ChartAndTableHeaderCellTitle', () => {
  it('should render table switcher', () => {
    const { queryByTestId } = render(
      <TableOptionsContext.Provider value={{ isCheckboxShown: true, setChecked: jest.fn() }}>
        <ChartAndTableHeaderCellTitle
          logarithmicScale={{ isCheckboxShown: false, setChecked: jest.fn() }}
          axesOptions={{ isCheckboxShown: false, setChecked: jest.fn() }}
        />
      </TableOptionsContext.Provider>
    )

    const tableBtn = queryByTestId('table-view-btn')
    const logBtn = queryByTestId('log-btn')
    const axesBtn = queryByTestId('axes-btn')

    expect(tableBtn).toBeTruthy()
    expect(logBtn).toBeNull()
    expect(axesBtn).toBeNull()
  })

  it("shouldn't render toolbox", () => {
    const { queryByTestId } = render(
      <TableOptionsContext.Provider value={{ isCheckboxShown: false, setChecked: jest.fn() }}>
        <ChartAndTableHeaderCellTitle
          logarithmicScale={{ isCheckboxShown: false, setChecked: jest.fn() }}
          axesOptions={{ isCheckboxShown: false, setChecked: jest.fn() }}
        />
      </TableOptionsContext.Provider>
    )

    const tableBtn = queryByTestId('table-view-btn')
    const chartBtn = queryByTestId('chart-view-btn')
    const logBtn = queryByTestId('log-btn')
    const axesBtn = queryByTestId('axes-btn')

    expect(tableBtn).toBeNull()
    expect(chartBtn).toBeNull()
    expect(logBtn).toBeNull()
    expect(axesBtn).toBeNull()
  })

  it('should call "tableOptions.setChecked"', () => {
    const setCheckedMock = jest.fn()
    const { getByTestId } = render(
      <TableOptionsContext.Provider value={{ isCheckboxShown: true, setChecked: setCheckedMock }}>
        <ChartAndTableHeaderCellTitle
          logarithmicScale={{ isCheckboxShown: false, setChecked: jest.fn() }}
          axesOptions={{ isCheckboxShown: false, setChecked: jest.fn() }}
        />
      </TableOptionsContext.Provider>
    )

    const tableViewBtn = getByTestId('table-view-btn')

    fireEvent.click(tableViewBtn)

    expect(setCheckedMock).toBeCalledWith(true)
  })

  it('should be "table" btn active via passing props', () => {
    const { getByTestId } = render(
      <TableOptionsContext.Provider
        value={{ isCheckboxShown: true, isUsedByDefault: true, setChecked: jest.fn() }}
      >
        <ChartAndTableHeaderCellTitle
          logarithmicScale={{ isCheckboxShown: false, setChecked: jest.fn() }}
          axesOptions={{ isCheckboxShown: false, setChecked: jest.fn() }}
        />
      </TableOptionsContext.Provider>
    )

    const tableViewBtn = getByTestId('table-view-btn')

    expect(tableViewBtn.classList.contains('active')).toBeTruthy()
  })
})
