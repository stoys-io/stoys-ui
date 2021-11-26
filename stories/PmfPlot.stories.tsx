import React from 'react'
import { Story } from '@storybook/react'

import PmfPlotComponent from '../src/pmfPlot'
import { PmfPlotData, PmfPlotThreeDatasets, PmfPlotPassengerCount } from './mocks/PmfPlot.mock'

const Template: Story<any> = args => <PmfPlotComponent {...args} />

export const PmfPlot = Template.bind({})
PmfPlot.args = {
  dataset: [PmfPlotData],
  config: {
    height: 500,
  },
}
PmfPlot.storyName = 'One dataset'

export const PmfPlotWithFewDatasets = Template.bind({})
PmfPlotWithFewDatasets.args = {
  dataset: PmfPlotPassengerCount,
  config: {
    dataType: 'integer',
    height: 500,
  },
}
PmfPlotWithFewDatasets.storyName = 'Three datasets'

export const PmfPlotWithThreeDatasets = Template.bind({})
PmfPlotWithThreeDatasets.args = {
  dataset: PmfPlotThreeDatasets,
  config: {
    height: 500,
    showAxes: false,
    showLogScale: false,
  },
}
PmfPlotWithThreeDatasets.storyName = 'Three datasets *'

export default {
  title: 'Chart/PmfPlot',
  component: [PmfPlot, PmfPlotWithThreeDatasets, PmfPlotWithFewDatasets],
}
