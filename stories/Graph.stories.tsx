import React from 'react'
import { Story } from '@storybook/react'
import { Graph as GraphComponent, GraphProps } from '../src'

import dataMock from './mocks/graph/dag_inlined.json'

const Template: Story<GraphProps> = args => <GraphComponent {...args} />

export const Graph = Template.bind({})

Graph.args = {
  data: dataMock as any // TODO: profiler props not match 
}

export default {
  title: 'Data Quality/Graph',
  component: Graph,
  parameters: {
    layout: 'fullscreen',
  }
}
