import React from 'react'
import { Story } from '@storybook/react'
import { Graph as GraphComponent } from '../src'

import dataMock from './mocks/graph/dag_inlined.json'
import diffDataMock1 from './mocks/graph/20210922_120415_152372/dag_inlined.json'
import diffDataMock2 from './mocks/graph/20210922_125856_444212/dag_inlined.json'

import grpcData from './mocks/graph/graph.bazel/grpc/dag.json'
/* import tensorboardData from './mocks/graph/graph.bazel/tensorboard/dag.json' */

const Template: Story<any> = args => <GraphComponent {...args} />

export const Graph = Template.bind({})
Graph.storyName = 'Small data'
Graph.args = {
  data: dataMock,
  chromaticScale: 'interpolatePuOr',
  layoutDirection: 'TB',
}

export const DiffGraph = Template.bind({})
DiffGraph.storyName = 'with diffing'
DiffGraph.args = {
  data: [diffDataMock1, diffDataMock2] as any,
}

export const BigGraph = Template.bind({})
BigGraph.storyName = 'lots of data - grpc'
BigGraph.args = {
  data: grpcData,
}

/* export const BigGraph2 = Template.bind({})
 * BigGraph.storyName = 'lots of data - tensorboard'
 * BigGraph.args = {
 *   data: tensorboardData,
 * }
 *  */

export default {
  title: 'Chart/Graph',
  component: [Graph, DiffGraph, BigGraph],
  parameters: {
    layout: 'fullscreen',
  },
}
