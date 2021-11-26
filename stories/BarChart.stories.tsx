import React from 'react'
import { Story } from '@storybook/react'

import BarChartComponent from '../src/BarChart'
// import { BarChartData, BarChartThreeDatasets, BarChartPassengerCount } from './mocks/BarChart.mock'

const Template: Story<any> = args => <BarChartComponent {...args} />

export const BarChart = Template.bind({})
BarChart.args = {
  dataset: [],
  config: {
    height: 500,
  },
}
BarChart.storyName = 'One dataset'

export const BarChartWithFewDatasets = Template.bind({})
BarChartWithFewDatasets.args = {
  dataset: [],
  config: {
    dataType: 'integer',
    height: 500,
  },
}
BarChartWithFewDatasets.storyName = 'Three datasets'

export const BarChartWithThreeDatasets = Template.bind({})
BarChartWithThreeDatasets.args = {
  dataset: [],
  config: {
    height: 500,
    showAxes: false,
    showLogScale: false,
  },
}
BarChartWithThreeDatasets.storyName = 'Three datasets *'

export default {
  title: 'Chart/BarChart',
  component: [BarChart, BarChartWithThreeDatasets, BarChartWithFewDatasets],
}
