import { renderNumericValue } from '..'

describe('helpers', () => {
  describe('renderNumericValue', () => {
    it('should use default params', () => {
      expect(renderNumericValue()(2.45678)).toBe('2')
    })

    it('should use passed params', () => {
      expect(renderNumericValue(2, true)(2.45678)).toBe('2.46')
      expect(renderNumericValue(2, true)(2000.45678)).toBe('2k')
    })
  })
})
