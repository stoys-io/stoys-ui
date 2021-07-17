import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '../../../__mocks__/matchMedia.mock'

import ChartHeaderCellTitle from '../ChartHeaderCellTitle'

beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = jest.fn(
    () => ({ measureText: jest.fn(() => ({ width: 100 })) } as any)
  )
})

describe('ChartHeaderCellTitle', () => {
  it('should render table switcher', () => {
    const { queryByTestId } = render(
      <ChartHeaderCellTitle
        logarithmicScale={{ isCheckboxShown: false, setChecked: jest.fn() }}
        axisOptions={{ isCheckboxShown: false, setChecked: jest.fn() }}
        tableOptions={{ isCheckboxShown: true, setChecked: jest.fn() }}
      />
    )

    const tableBtn = queryByTestId('table-view-btn')
    const chartBtn = queryByTestId('chart-view-btn')
    const logBtn = queryByTestId('log-btn')
    const axesBtn = queryByTestId('axes-btn')

    expect(tableBtn).toBeTruthy()
    expect(chartBtn).toBeTruthy()
    expect(logBtn).toBeNull()
    expect(axesBtn).toBeNull()
  })

  it("shouldn't render toolbox", () => {
    const { queryByTestId } = render(
      <ChartHeaderCellTitle
        logarithmicScale={{ isCheckboxShown: false, setChecked: jest.fn() }}
        axisOptions={{ isCheckboxShown: false, setChecked: jest.fn() }}
        tableOptions={{ isCheckboxShown: false, setChecked: jest.fn() }}
      />
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
      <ChartHeaderCellTitle
        logarithmicScale={{ isCheckboxShown: false, setChecked: jest.fn() }}
        axisOptions={{ isCheckboxShown: false, setChecked: jest.fn() }}
        tableOptions={{ isCheckboxShown: true, setChecked: setCheckedMock }}
      />
    )

    const tableViewBtn = getByTestId('table-view-btn')

    fireEvent.click(tableViewBtn)

    expect(setCheckedMock).toBeCalledWith(true)
  })

  it('should be "table" btn active via passing props', () => {
    const { getByTestId } = render(
      <ChartHeaderCellTitle
        logarithmicScale={{ isCheckboxShown: false, setChecked: jest.fn() }}
        axisOptions={{ isCheckboxShown: false, setChecked: jest.fn() }}
        tableOptions={{ isCheckboxShown: true, isUsedByDefault: true, setChecked: jest.fn() }}
      />
    )

    const tableViewBtn = getByTestId('table-view-btn')
    const chartViewBtn = getByTestId('chart-view-btn')

    expect(tableViewBtn.classList.contains('active')).toBeTruthy()
    expect(chartViewBtn.classList.contains('active')).toBeFalsy()
  })
})
