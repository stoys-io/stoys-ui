import { Data } from '../../quality/model'
import {
  getTableNames,
  transformJoinRatesData,
  parseDqResult,
  parseDqJoinStatistics,
} from '../helpers'

describe('join rates helpers', () => {
  describe('getTableNames', () => {
    it('should return object table names', () => {
      const mockData = ['1', '2']

      expect(getTableNames(mockData)).toEqual({ 'Table names': mockData })
    })

    it('should return empty object', () => {
      expect(getTableNames()).toEqual({})
    })
  })

  describe('parseDqResult', () => {
    it('should return object', () => {
      const mockData = {
        id: 'testId',
        dq_join_statistics: { a: 1, b: 2 },
        dq_result: { x: 1, y: 2 },
      }

      expect(parseDqResult(mockData as any)).toEqual(mockData.dq_result)
    })

    it('should parse JSON', () => {
      const mockData = {
        id: 'testId',
        dq_join_statistics: { a: 1, b: 2 },
        dqJoinResultJson: JSON.stringify({ x: 1, y: 2 }),
      }

      expect(parseDqResult(mockData as any)).toEqual(JSON.parse(mockData.dqJoinResultJson))
    })
  })

  describe('parseDqJoinStatistics', () => {
    it('should return object', () => {
      const mockData = {
        id: 'testId',
        dq_join_statistics: { a: 1, b: 2 },
        dq_result: { x: 1, y: 2 },
      }

      expect(parseDqJoinStatistics(mockData as any)).toEqual(mockData.dq_join_statistics)
    })

    it('should parse JSON', () => {
      const mockData = {
        id: 'testId',
        dqJoinStatisticsJson: JSON.stringify({ a: 1, b: 2 }),
        dq_result: { x: 1, y: 2 },
      }

      expect(parseDqJoinStatistics(mockData as any)).toEqual(
        JSON.parse(mockData.dqJoinStatisticsJson)
      )
    })
  })

  describe('transformJoinRatesData', () => {
    it('should transform join rates data', () => {
      const mockData = { id: 'testId', dq_join_statistics: { a: 1, b: 2 }, dq_result: {} as Data }

      expect(transformJoinRatesData(mockData)).toEqual({
        id: mockData.id,
        key: mockData.id,
        ...mockData.dq_join_statistics,
      })
    })
  })
})
