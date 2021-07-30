import { dq_join_info_1 } from '../../../stories/mocks/dqJoinInfo.mock'
import { QualityData } from '../../quality/model'
import { getTableNames, transformJoinRatesData } from '../helpers'

describe('join rates helpers', () => {
  describe('getTableNames', () => {
    it('should return object table names', () => {
      expect(getTableNames(dq_join_info_1)).toEqual({
        'Table names': [dq_join_info_1.left_table_name, dq_join_info_1.right_table_name],
      })
    })
  })

  describe('transformJoinRatesData', () => {
    it('should transform join rates data', () => {
      const mockData = {
        id: 'testId',
        dq_join_info: dq_join_info_1,
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
        dq_result: {} as QualityData,
      }

      expect(transformJoinRatesData(mockData)).toEqual({
        id: mockData.id,
        key: mockData.id,
        'Table names': [dq_join_info_1.left_table_name, dq_join_info_1.right_table_name],
        ...mockData.dq_join_statistics,
      })
    })
  })
})
