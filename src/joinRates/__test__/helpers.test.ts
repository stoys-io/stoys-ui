import { Data } from '../../quality/model'
import { getTableNames, transformJoinRatesData } from '../helpers'

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

  describe('transformJoinRatesData', () => {
    it('should transform join rates data', () => {
      const mockData = {
        id: 'testId',
        dq_join_statistics: {
          left_rows: 1,
          right_rows: 2,
          left_nulls: 3,
          right_nulls: 4,
          left_distinct: 5,
          right_distinct: 6,
          inner: 7,
          left: 8,
          right: 9,
          full: 0,
          cross: 1,
        },
        dq_result: {} as Data,
      }

      expect(transformJoinRatesData(mockData)).toEqual({
        id: mockData.id,
        key: mockData.id,
        ...mockData.dq_join_statistics,
      })
    })
  })
})
