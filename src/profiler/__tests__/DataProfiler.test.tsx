import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '../../__mocks__/matchMedia.mock'

import { Profiler } from '..'

import { smallDataset } from '../__mocks__/ProfilerData.mock'
import { Mode } from '../model'

beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = jest.fn(
    () => ({ measureText: jest.fn(() => ({ width: 100 })) } as any)
  )
})

describe('Profiler', () => {
  describe('No data rendering', () => {
    it('should return placeholder "No data" when data is not passed', () => {
      const { getByText } = render(<Profiler datasets={undefined} />)

      expect(getByText('No data')).toBeTruthy()
    })

    it('should return placeholder "No data" when data is empty array', () => {
      const { getByText } = render(<Profiler datasets={[]} />)

      expect(getByText('No data')).toBeTruthy()
    })
  })

  describe('table rendering', () => {
    it('should render horizontal table', () => {
      const { container } = render(<Profiler datasets={smallDataset} />)
      const tableHeaderCell = container.querySelectorAll('th')

      expect(tableHeaderCell[0].innerHTML).toBe('nulls')
    })

    it('should render vertical table', () => {
      const { container } = render(
        <Profiler datasets={smallDataset} modeOptions={{ type: Mode.vertical }} />
      )
      const tableHeaderCell = container.querySelectorAll('th')

      expect(tableHeaderCell[0].innerHTML).toBe('')
      expect(tableHeaderCell[1].innerHTML).toBe('id')
    })

    it('should filter data without "columns"', () => {
      const data = [
        {
          ...smallDataset[0],
          columns: undefined as any,
        },
      ]
      const { getByText } = render(<Profiler datasets={data} />)

      expect(getByText('No data')).toBeTruthy()
    })
  })

  describe('mode switcher', () => {
    it("shouldn't show mode switcher", () => {
      const { queryByText } = render(<Profiler datasets={smallDataset} />)

      expect(queryByText('Vertical view')).toBeNull()
    })

    it('should change view from vertical to horizontal', () => {
      const { container, queryByText, queryByTestId } = render(
        <Profiler datasets={smallDataset} modeOptions={{ isCheckboxShown: true }} />
      )

      expect(container.querySelectorAll('th')[0].innerHTML).toBe('nulls')
      expect(queryByText('Vertical view')).toBeTruthy()

      const modeSwitcher = queryByTestId('profiler-mode-switcher')

      fireEvent.click(modeSwitcher)

      expect(container.querySelectorAll('th')[0].innerHTML).toBe('')
      expect(container.querySelectorAll('th')[1].innerHTML).toBe('id')
    })

    it('should call onModeChange', () => {
      const onModeChangeMock = jest.fn()
      const { container, queryByTestId } = render(
        <Profiler
          datasets={smallDataset}
          modeOptions={{ isCheckboxShown: true, onModeChange: onModeChangeMock }}
        />
      )

      const modeSwitcher = queryByTestId('profiler-mode-switcher')

      fireEvent.click(modeSwitcher)

      expect(onModeChangeMock).toBeCalledWith(Mode.vertical)
    })
  })
})
