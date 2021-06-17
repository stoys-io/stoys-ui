import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '../../../__mocks__/matchMedia.mock'

import ChartCellTitle from '../ChartCellTitle'

beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = jest.fn(
    () => ({ measureText: jest.fn(() => ({ width: 100 })) } as any)
  )
})

describe('ChartCellTitle', () => {
  it('should render table switcher', () => {
    const { container } = render(
      <ChartCellTitle
        logarithmicScale={{ isCheckboxShown: false, setChecked: jest.fn() }}
        axisOptions={{ isCheckboxShown: false, setChecked: jest.fn() }}
        tableOptions={{ isCheckboxShown: true, setChecked: jest.fn() }}
      />
    )

    const icons = container.querySelectorAll('svg')

    expect(icons.length).toBe(2)

    const tableIconDataAttr = icons[0].dataset
    const chartIconDataAttr = icons[1].dataset

    expect(tableIconDataAttr.icon).toBe('table')
    expect(chartIconDataAttr.icon).toBe('bar-chart')
  })

  it('should render only bar chart icon', () => {
    const { container } = render(
      <ChartCellTitle
        logarithmicScale={{ isCheckboxShown: false, setChecked: jest.fn() }}
        axisOptions={{ isCheckboxShown: false, setChecked: jest.fn() }}
        tableOptions={{ isCheckboxShown: false, setChecked: jest.fn() }}
      />
    )

    const icons = container.querySelectorAll('svg')

    expect(icons.length).toBe(1)

    const chartIconDataAttr = icons[0].dataset

    expect(chartIconDataAttr.icon).toBe('bar-chart')
  })

  it('should call "tableOptions.setChecked"', () => {
    const setCheckedMock = jest.fn()
    const { getByTestId } = render(
      <ChartCellTitle
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
      <ChartCellTitle
        logarithmicScale={{ isCheckboxShown: false, setChecked: jest.fn() }}
        axisOptions={{ isCheckboxShown: false, setChecked: jest.fn() }}
        tableOptions={{ isCheckboxShown: true, isUsedByDefault: true, setChecked: jest.fn() }}
      />
    )

    const tableViewBtn = getByTestId('table-view-btn')
    const chartViewBtn = getByTestId('chart-view-btn')

    expect(tableViewBtn.getAttribute('checked')).toBe('')
    expect(chartViewBtn.getAttribute('checked')).toBeNull()
  })
})
