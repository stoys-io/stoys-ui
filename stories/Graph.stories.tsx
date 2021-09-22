import React from 'react'
import { Story } from '@storybook/react'
import { Graph as GraphComponent, GraphProps } from '../src'

import dataMock from './mocks/graph/dag_inlined.json'
import { nodes } from './mocks/graph/Nodes.mock'
import { edges } from './mocks/graph/Edges.mock'
import { combos } from './mocks/graph/Combos.mock'

const Template: Story<GraphProps> = args => <GraphComponent {...args} />

export const Graph = Template.bind({})
Graph.storyName = 'Small data'
Graph.args = {
  chromaticScale: 'interpolatePuOr',
  data: dataMock as any // TODO: profiler props not match
}

export const BigGraph = Template.bind({})
BigGraph.storyName = 'Big data'
BigGraph.args = {
  nodes, edges, combos
}

export default {
  title: 'Chart/Graph',
  component: [Graph, BigGraph],
  parameters: {
    layout: 'fullscreen',
  }
}
