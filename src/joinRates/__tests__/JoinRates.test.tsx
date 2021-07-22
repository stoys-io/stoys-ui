import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '../../__mocks__/matchMedia.mock'

import JoinRates from '..'
import mockData1 from '../../../stories/mocks/covid19_epidemiology_demographics.dq_join_result.json'
import mockData2 from '../../../stories/mocks/covid19_epidemiology_demographics.dq_join_result2.json'

const joinRatesMockData1 = { id: 'test1', tableNames: ['first', 'second'], ...mockData1 }
const joinRatesMockData2 = { id: 'test2', tableNames: ['third'], ...mockData2 }

beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = jest.fn(
    () => ({ measureText: jest.fn(() => ({ width: 100 })) } as any)
  )
})

describe('Join Rates', () => {
  it('should render with one data object', () => {
    const { queryByText } = render(<JoinRates data={joinRatesMockData1} />)

    expect(queryByText('first, second')).toBeTruthy()
  })

  it('should render with array of data objects', () => {
    const { queryByText } = render(<JoinRates data={[joinRatesMockData1, joinRatesMockData2]} />)

    expect(queryByText('first, second')).toBeTruthy()
    expect(queryByText('third')).toBeTruthy()
  })

  it('should parse json objects', () => {
    const { queryByText } = render(<JoinRates data={joinRatesMockData1} />)

    expect(queryByText('first, second')).toBeTruthy()
  })

  it('should call onRowClickHandler', () => {
    const onRowClickHandlerMock = jest.fn()
    const { container } = render(
      <JoinRates
        data={[joinRatesMockData1, joinRatesMockData2]}
        onRowClickHandler={onRowClickHandlerMock}
      />
    )

    const selectedRow = container.querySelector('[data-row-key="test1"]')
    const otherRow = container.querySelector('[data-row-key="test2"]')

    expect(selectedRow?.className).toContain('selected-row')
    expect(otherRow?.className).not.toContain('selected-row')

    fireEvent.click(otherRow!)

    expect(onRowClickHandlerMock).toBeCalledWith(joinRatesMockData2.id)
    expect(selectedRow?.className).not.toContain('selected-row')
    expect(otherRow?.className).toContain('selected-row')
  })
})
