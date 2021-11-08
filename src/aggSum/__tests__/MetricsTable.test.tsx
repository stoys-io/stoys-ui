import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '../../__mocks__/matchMedia.mock'

import AggSum from '../AggSum'
import { aggSumData, bigAggSumData } from './AggSumTable.mock'

beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = jest.fn(
    () => ({ measureText: jest.fn(() => ({ width: 100 })) } as any)
  )
})

describe('AggSumTable', () => {
  it('should render passed data', () => {
    const { queryByText } = render(<AggSum data={aggSumData} />)

    expect(queryByText('id')).toBeTruthy()
    expect(queryByText('value')).toBeTruthy()
    expect(queryByText('Average Fare')).toBeTruthy()
    expect(queryByText('Average Tip')).toBeTruthy()
  })

  describe('pagination', () => {
    it('should render pagination', () => {
      const { container } = render(<AggSum data={bigAggSumData} />)
      const currentPageNode = container.querySelector('.ant-pagination-item-active')

      expect(currentPageNode.textContent).toBe('1')

      const nextPage = container.querySelector('.ant-pagination-next').querySelector('button')

      fireEvent.click(nextPage)

      expect(container.querySelector('.ant-pagination-item-active').textContent).toBe('2')
    })

    it("shouldn't render pagination", () => {
      const { container } = render(<AggSum data={aggSumData} config={{ pagination: false }} />)
      const currentPageNode = container.querySelector('.ant-pagination-item-active')

      expect(currentPageNode).toBeNull()
    })
  })
})
