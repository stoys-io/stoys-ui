import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '../../__mocks__/matchMedia.mock'

import JoinRates from '..'
import { mockData1, mockData2 } from './JoinRates.mock'

beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = jest.fn(
    () => ({ measureText: jest.fn(() => ({ width: 100 })) } as any)
  )
})

describe('Join Rates', () => {
  it('should render with one data object', () => {
    const { queryByText } = render(<JoinRates data={mockData1} />)

    expect(queryByText('first, second')).toBeTruthy()
  })

  it('should render with array of data objects', () => {
    const { queryByText } = render(<JoinRates data={[mockData1, mockData2]} />)

    expect(queryByText('first, second')).toBeTruthy()
    expect(queryByText('third')).toBeTruthy()
  })

  it('should parse json objects', () => {
    const { queryByText } = render(<JoinRates data={mockData1} />)

    expect(queryByText('first, second')).toBeTruthy()
  })

  it('should call onRowClickHandler', () => {
    const onRowClickHandlerMock = jest.fn()
    const { container } = render(
      <JoinRates data={[mockData1, mockData2]} onRowClickHandler={onRowClickHandlerMock} />
    )

    const selectedRow = container.querySelector('[data-row-key="test1"]')
    const otherRow = container.querySelector('[data-row-key="test2"]')

    expect(selectedRow?.className).toContain('selected-row')
    expect(otherRow?.className).not.toContain('selected-row')

    fireEvent.click(otherRow!)

    expect(onRowClickHandlerMock).toBeCalledWith(mockData2.id)
    expect(selectedRow?.className).not.toContain('selected-row')
    expect(otherRow?.className).toContain('selected-row')
  })
})
