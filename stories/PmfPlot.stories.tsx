import React from 'react'
import { Story } from '@storybook/react'

import { PmfPlot as PmfPlotComponent } from '../src'
import { PmfPlotData, PmfPlotPassengerCount, PmfPlotThreeDatasets } from './mocks/PmfPlot.mock'

const Template: Story<any> = args => <PmfPlotComponent {...args} />

export const PmfPlotWithOneDataSet = Template.bind({})
PmfPlotWithOneDataSet.args = {
  data: PmfPlotData,
  dataType: 'integer',
  height: 500,
}
PmfPlotWithOneDataSet.storyName = 'One dataset'

export const PmfPlotWithFewDatasets = Template.bind({})
PmfPlotWithFewDatasets.args = {
  data: PmfPlotPassengerCount,
  dataType: 'integer',
  height: 500,
}
PmfPlotWithFewDatasets.storyName = 'Three datasets'

export const PmfPlotWithThreeDatasets = Template.bind({})
PmfPlotWithThreeDatasets.args = {
  data: PmfPlotThreeDatasets,
  dataType: 'integer',
  height: 500,
}
PmfPlotWithThreeDatasets.storyName = 'Three datasets *'

export default {
  title: 'Chart/PmfPlot',
  component: [PmfPlotWithOneDataSet, PmfPlotWithFewDatasets, PmfPlotWithThreeDatasets],
  argTypes: {
    data: {
      type: { required: true },
    },
    dataType: {
      control: 'string',
      defaultValue: 'integer',
    },
    showLogScale: {
      control: 'boolean',
      defaultValue: false,
    },
    showAxis: {
      control: 'boolean',
      defaultValue: false,
    },
    height: {
      control: 'number',
      defaultValue: 500,
    },
    width: {
      control: 'number',
      defaultValue: 500,
    },
    color: {
      control: 'object',
      defaultValue: [],
    },
    plotOptions: {
      control: 'object',
    },
  },
}
