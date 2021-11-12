import React from 'react'
import { Story } from '@storybook/react'

import D3PlotComponent from '../src/d3Plot/D3Plot'
import { PmfPlotData, PmfPlotThreeDatasets } from './mocks/PmfPlot.mock'

const Template: Story<any> = args => <D3PlotComponent {...args} />

export const D3Plot = Template.bind({})
D3Plot.args = {
  data: PmfPlotData,
}
D3Plot.storyName = 'One dataset'

export default {
  title: 'Chart/D3',
  component: D3Plot,
  argTypes: {
    data: {
      type: { required: true },
    },
    config: {
      control: 'object',
    },
  },
}
