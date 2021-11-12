import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import '../../__mocks__/matchMedia.mock'

import { Profiler } from '..'

import { smallDataset } from '../__mocks__/ProfilerData.mock'
import { Orient } from '../model'

beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = jest.fn(() => {
    const ctxMock = { measureText: jest.fn(() => ({ width: 100 })) }

    // this mocks canvas api
    return new Proxy(ctxMock, {
      get: function (target, key, _) {
        if (key in ctxMock) {
          return Reflect.get(target, key)
        }
        return () => {}
      },
    }) as any
  })
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
        <Profiler
          datasets={smallDataset}
          config={{
            orientType: Orient.Vertical,
          }}
        />
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
      const { queryByTestId } = render(
        <Profiler datasets={smallDataset} config={{ showOrientSwitcher: false }} />
      )

      expect(queryByTestId('vertical-mode')).toBeNull()
      expect(queryByTestId('horizontal-mode')).toBeNull()
    })

    it('should change view from vertical to horizontal', () => {
      const { container, queryByTestId } = render(
        <Profiler
          datasets={smallDataset}
          config={{
            showOrientSwitcher: true,
          }}
        />
      )

      expect(container.querySelectorAll('th')[0].innerHTML).toBe('nulls')
      expect(queryByTestId('vertical-mode')).toBeNull()
      expect(queryByTestId('horizontal-mode')).toBeTruthy()

      const modeSwitcher = queryByTestId('profiler-mode-switcher')

      fireEvent.click(modeSwitcher)

      expect(container.querySelectorAll('th')[0].innerHTML).toBe('')
      expect(container.querySelectorAll('th')[1].innerHTML).toBe('id')
      expect(queryByTestId('vertical-mode')).toBeTruthy()
      expect(queryByTestId('horizontal-mode')).toBeNull()
    })

    it('should call onModeChange', () => {
      const onOrientChangeMock = jest.fn()
      const { queryByTestId } = render(
        <Profiler
          datasets={smallDataset}
          config={{
            showOrientSwitcher: true,
            onOrientChange: onOrientChangeMock,
          }}
        />
      )

      const modeSwitcher = queryByTestId('profiler-mode-switcher')

      fireEvent.click(modeSwitcher)

      expect(onOrientChangeMock).toBeCalledWith(Orient.Vertical)
    })
  })

  describe('search', () => {
    it('should show search', () => {
      const { queryByTestId } = render(<Profiler datasets={smallDataset} />)

      expect(queryByTestId('table-search')).toBeTruthy()
    })

    it("shouldn't show search", () => {
      const { queryByTestId } = render(
        <Profiler
          datasets={smallDataset}
          config={{
            showOrientSwitcher: true,
            showSearch: false,
          }}
        />
      )

      expect(queryByTestId('table-search')).toBeNull()
    })

    it('should filter data', async () => {
      const { queryAllByTestId, queryByTestId } = render(<Profiler datasets={smallDataset} />)
      const search = queryByTestId('table-search')

      expect(queryAllByTestId('row-column-name')[0].innerHTML).toBe('id')
      expect(queryAllByTestId('row-column-name')[1].innerHTML).toBe('value')

      fireEvent.change(search, { target: { value: 'value' } })

      await waitFor(() => expect(queryAllByTestId('row-column-name')[0].innerHTML).toBe('value'))
    })

    it('should call onSearch handler', async () => {
      const onSearchMock = jest.fn()
      const { queryByTestId } = render(
        <Profiler
          datasets={smallDataset}
          config={{
            onSearchChange: onSearchMock,
          }}
        />
      )
      const search = queryByTestId('table-search')

      fireEvent.change(search, { target: { value: 'test' } })

      await waitFor(() => expect(onSearchMock).toBeCalledWith('test'))
    })
  })
})
