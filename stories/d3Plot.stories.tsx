import React from 'react'
import { Story } from '@storybook/react'

import D3PlotComponent from '../src/d3Plot/D3Plot'
import { PmfPlotData, PmfPlotThreeDatasets } from './mocks/PmfPlot.mock'

const Template: Story<any> = args => <D3PlotComponent {...args} />

export const D3Plot = Template.bind({})
D3Plot.args = {
  dataset: [PmfPlotData],
  config: {
    height: 500,
  },
}
D3Plot.storyName = 'One dataset'

export const D3PlotWithThreeDatasets = Template.bind({})
D3PlotWithThreeDatasets.args = {
  dataset: PmfPlotThreeDatasets,
  config: {
    height: 500,
    showAxes: false,
    showLogScale: false,
  },
}
D3PlotWithThreeDatasets.storyName = 'Three datasets *'

export default {
  title: 'Chart/D3',
  component: [D3Plot, D3PlotWithThreeDatasets],
}
