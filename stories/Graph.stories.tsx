import React from 'react'
import { Story } from '@storybook/react'
import GraphComponent from '../src/graph'

import dataMock from './mocks/graph/dag_inlined.json'
import diffDataMock1 from './mocks/graph/20210922_120415_152372/dag_inlined.json'
import diffDataMock2 from './mocks/graph/20210922_125856_444212/dag_inlined.json'

import grpcData from './mocks/graph/graph.bazel/grpc/dag.json'

const Template: Story<any> = args => <GraphComponent {...args} />

export const Graph = Template.bind({})
Graph.storyName = 'sample data'
Graph.args = {
  data: [dataMock],
}

export const GraphVertical = Template.bind({})
GraphVertical.storyName = 'sample data - vertical'
GraphVertical.args = {
  data: [dataMock],
  config: {
    orientation: 'vertical',
    chromaticScale: 'interpolatePuOr',
  },
}

export const DiffGraph = Template.bind({})
DiffGraph.storyName = 'with diffing'
DiffGraph.args = {
  data: [diffDataMock1, diffDataMock2] as any,
  config: {
    orientation: 'horizontal',
  },
}

export const BigGraph = Template.bind({})
BigGraph.storyName = 'lots of data - grpc'
BigGraph.args = {
  data: [grpcData],
  config: {
    orientation: 'horizontal',
  },
}

export default {
  title: 'Chart/Graph',
  component: [Graph, DiffGraph, BigGraph],
  argTypes: {
    data: {
      type: { required: true },
    },
    config: {
      control: 'object',
    },
  },
}
