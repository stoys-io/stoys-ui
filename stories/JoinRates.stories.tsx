import React from 'react'
import { Story } from '@storybook/react'

import { JoinRates as JoinRatesComponent } from '../src'
import { JoinRatesProps } from '../src/joinRates/model'
import mockData from './mocks/covid19_epidemiology_demographics.dq_join_result.json'
import mockData2 from './mocks/covid19_epidemiology_demographics.dq_join_result2.json'

const Template: Story<JoinRatesProps> = args => <JoinRatesComponent {...args} />

export const JoinRates = Template.bind({})
JoinRates.args = {
  data: { id: 'mock', ...mockData },
}
JoinRates.storyName = 'with one item'

export const JoinRatesWithFewItems = Template.bind({})
JoinRatesWithFewItems.args = {
  data: [
    { id: 'mock1', ...mockData },
    {
      id: 'mock2',
      ...mockData2,
    },
  ],
}
JoinRatesWithFewItems.storyName = 'with few items'

export default {
  title: 'Data Quality/JoinRates',
  component: JoinRates,
}
