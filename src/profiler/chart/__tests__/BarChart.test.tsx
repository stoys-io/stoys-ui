import React from 'react'
import { render } from '@testing-library/react'

import Bar from '../BarChart'

beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = jest.fn(() => {
    const ctxMock = {}

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

describe('BarChart', () => {
  it('should render', () => {
    const { container } = render(
      <Bar
        series={{ data: [1, 2, 3, 4, 5, 6], type: 'bar' }}
        xData={['a', 'b', 'c', 'd', 'e', 'f']}
        height={200}
        isLogScale={false}
        haveAxes={false}
      />
    )

    expect(container.querySelector('canvas')).toBeTruthy()
  })
})
