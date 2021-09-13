import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '../../../__mocks__/matchMedia.mock'

import ChartAndTableHeaderCellTitle from '../ChartAndTableHeaderCellTitle'
import { ConfigContext } from '../../context'

beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = jest.fn(
    () => ({ measureText: jest.fn(() => ({ width: 100 })) } as any)
  )
})

describe('ChartAndTableHeaderCellTitle', () => {
  it('should render table switcher', () => {
    const { queryByTestId } = render(
      <ConfigContext.Provider
        value={{
          showChartTableSwitcher: true,
          showLogarithmicSwitcher: false,
          showAxesSwitcher: false,
        }}
      >
        <ChartAndTableHeaderCellTitle />
      </ConfigContext.Provider>
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
      <ConfigContext.Provider
        value={{
          showChartTableSwitcher: false,
          showLogarithmicSwitcher: false,
          showAxesSwitcher: false,
        }}
      >
        <ChartAndTableHeaderCellTitle />
      </ConfigContext.Provider>
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
      <ConfigContext.Provider
        value={{
          showChartTableSwitcher: true,
          showLogarithmicSwitcher: false,
          showAxesSwitcher: false,
          setChartTableChecked: setCheckedMock,
        }}
      >
        <ChartAndTableHeaderCellTitle />
      </ConfigContext.Provider>
    )

    const tableViewBtn = getByTestId('table-view-btn')

    fireEvent.click(tableViewBtn)

    expect(setCheckedMock).toBeCalledWith(true)
  })

  it('should be "table" btn active via passing props', () => {
    const { getByTestId } = render(
      <ConfigContext.Provider
        value={{
          showChartTableSwitcher: true,
          showLogarithmicSwitcher: false,
          showAxesSwitcher: false,
          chartTableChecked: true,
        }}
      >
        <ChartAndTableHeaderCellTitle />
      </ConfigContext.Provider>
    )

    const tableViewBtn = getByTestId('table-view-btn')

    expect(tableViewBtn.classList.contains('active')).toBeTruthy()
  })
})
