import { getMetricsColumns } from '../columns'
import '../../__mocks__/matchMedia.mock'

import { metricsData } from './MetricsTable.mock'

beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = jest.fn(
    () => ({ measureText: jest.fn(() => ({ width: 100 })) } as any)
  )
})

describe('getMetricsColumns', () => {
  const resultingColumns = [
    {
      columnName: 'id',
      dataIndex: 'id',
      id: 'id',
      title: 'id',
    },
    {
      columnName: 'value',
      dataIndex: 'value',
      id: 'value',
      title: 'value',
    },
  ]

  it('should return emty array when columns not passed', () => {
    expect(getMetricsColumns(undefined, false, () => {})).toStrictEqual([])
    expect(getMetricsColumns({ values: [] }, false, () => {})).toStrictEqual([])
  })

  it('should return columns', () => {
    expect(getMetricsColumns(metricsData, false, () => {})).toEqual(
      expect.arrayContaining([
        expect.objectContaining(resultingColumns[0]),
        expect.objectContaining(resultingColumns[1]),
      ])
    )
  })

  it('should return filtered columns', () => {
    expect(getMetricsColumns(metricsData, false, () => {}, ['id'])).toEqual(
      expect.arrayContaining([
        expect.not.objectContaining(resultingColumns[0]),
        expect.objectContaining(resultingColumns[1]),
      ])
    )
  })
})
