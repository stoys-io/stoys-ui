import React from 'react'
import { render } from '@testing-library/react'

import Trends from '../Trends'

describe('Trends', () => {
  const oneDayInMilisec = 8640000000
  const dataWithReleaseVersion = [
    {
      releaseVersion: `${Date.now() - oneDayInMilisec}`,
      value: 100,
    },
    {
      releaseVersion: `${Date.now() - 2 * oneDayInMilisec}`,
      value: 200,
    },
    {
      releaseVersion: `${Date.now() - 3 * oneDayInMilisec}`,
      value: 300,
    },
    {
      releaseVersion: `${Date.now() - 4 * oneDayInMilisec}`,
      value: 400,
    },
  ]
  const dataWithDate = [
    {
      date: `${Date.now() - oneDayInMilisec}`,
      value: 100,
    },
    {
      date: `${Date.now() - 2 * oneDayInMilisec}`,
      value: 200,
    },
    {
      date: `${Date.now() - 3 * oneDayInMilisec}`,
      value: 300,
    },
    {
      date: `${Date.now() - 4 * oneDayInMilisec}`,
      value: 400,
    },
  ]

  it('should render with "releaseVersion"', () => {
    const { queryByTestId } = render(<Trends trends={dataWithReleaseVersion} />)

    expect(queryByTestId(`bar-${dataWithReleaseVersion[0].value}`)).toBeTruthy()
    expect(queryByTestId(`bar-${dataWithReleaseVersion[1].value}`)).toBeTruthy()
    expect(queryByTestId(`bar-${dataWithReleaseVersion[2].value}`)).toBeTruthy()
    expect(queryByTestId(`bar-${dataWithReleaseVersion[3].value}`)).toBeTruthy()
  })

  it('should render with "date"', () => {
    const { queryByTestId } = render(<Trends trends={dataWithDate} />)

    expect(queryByTestId(`bar-${dataWithDate[0].value}`)).toBeTruthy()
    expect(queryByTestId(`bar-${dataWithDate[1].value}`)).toBeTruthy()
    expect(queryByTestId(`bar-${dataWithDate[2].value}`)).toBeTruthy()
    expect(queryByTestId(`bar-${dataWithDate[3].value}`)).toBeTruthy()
  })
})
