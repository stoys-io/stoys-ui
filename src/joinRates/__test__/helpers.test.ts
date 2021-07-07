import { Data } from '../../quality/model'
import { getTableNames, parseJson, transformJoinRatesData } from '../helpers'

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

  describe('parseJson', () => {
    const mockData = { data: '123' }

    it('should return object when paased object', () => {
      expect(parseJson(mockData)).toEqual(mockData)
    })

    it('should return parsed object when passed json', () => {
      expect(parseJson(JSON.stringify(mockData))).toEqual(mockData)
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
