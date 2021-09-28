import React from 'react'
import { Story } from '@storybook/react'
import { Graph as GraphComponent } from '../src'

import dataMock from './mocks/graph/dag_inlined.json'
import diffDataMock1 from './mocks/graph/20210922_120415_152372/dag_inlined.json'
import diffDataMock2 from './mocks/graph/20210922_125856_444212/dag_inlined.json'
import { nodes } from './mocks/graph/Nodes.mock'
import { edges } from './mocks/graph/Edges.mock'
import { combos } from './mocks/graph/Combos.mock'

const Template: Story<any> = args => <GraphComponent {...args} />

export const Graph2 = Template.bind({})
Graph2.storyName = 'Small data'
Graph2.args = {
  data: dataMock as any, // TODO: profiler props not match
  enableGrouping: false,
  chromaticScale: 'interpolatePuOr',
}

export const DiffGraph = Template.bind({})
DiffGraph.storyName = 'with diffing'
DiffGraph.args = {
  data: [diffDataMock1, diffDataMock2] as any,
}

export const BigGraph = Template.bind({})
BigGraph.storyName = 'Big data'
BigGraph.args = {
  enableGrouping: false,
  nodes,
  edges,
  combos,
}

export default {
  title: 'Chart/Graph',
  component: [Graph2, BigGraph, DiffGraph],
  parameters: {
    layout: 'fullscreen',
  },
}
