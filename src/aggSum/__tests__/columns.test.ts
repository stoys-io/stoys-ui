import { getAggSumColumns } from '../columns'
import '../../__mocks__/matchMedia.mock'

import { aggSumData } from './AggSumTable.mock'

beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = jest.fn(
    () => ({ measureText: jest.fn(() => ({ width: 100 })) } as any)
  )
})

describe('getAggSumColumns', () => {
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
    expect(getAggSumColumns(undefined, false, () => {})).toStrictEqual([])
    expect(getAggSumColumns({ values: [] }, false, () => {})).toStrictEqual([])
  })

  it('should return columns', () => {
    expect(getAggSumColumns(aggSumData, false, () => {})).toEqual(
      expect.arrayContaining([
        expect.objectContaining(resultingColumns[0]),
        expect.objectContaining(resultingColumns[1]),
      ])
    )
  })

  it('should return filtered columns', () => {
    expect(getAggSumColumns(aggSumData, false, () => {}, ['id'])).toEqual(
      expect.arrayContaining([
        expect.not.objectContaining(resultingColumns[0]),
        expect.objectContaining(resultingColumns[1]),
      ])
    )
  })
})
