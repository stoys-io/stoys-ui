import { defaultSort } from '../helpers'

describe('helpers', () => {
  describe('defaultSort', () => {
    const a = { value: 1, id: 0 }
    const b = { value: 0, id: 1 }

    it('should return -1', () => {
      expect(defaultSort('id')(a, b)).toBe(-1)
    })

    it('should return 1', () => {
      expect(defaultSort('value')(a, b)).toBe(1)
    })
  })
})
