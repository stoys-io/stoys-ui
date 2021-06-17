import React from 'react'
import { render } from '@testing-library/react'

import Bar from '../BarChart'

describe('BarChart', () => {
  it('should render', () => {
    const { container } = render(
      <Bar
        series={{ data: [1, 2, 3, 4, 5, 6], type: 'bar' }}
        xData={['a', 'b', 'c', 'd', 'e', 'f']}
        height={200}
        isLogScale={false}
        haveAxis={false}
      />
    )

    expect(container.querySelector('svg')).toBeTruthy()
  })
})
