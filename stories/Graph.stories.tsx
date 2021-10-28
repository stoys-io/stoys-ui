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

export const DiffGraph = Template.bind({})
DiffGraph.storyName = 'with diffing'
DiffGraph.args = {
  data: [diffDataMock1, diffDataMock2] as any,
  config: {
    orientation: 'horizontal',
    chromaticScale: 'interpolatePuOr',
  },
}

export const Multiple = () => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <div style={{ display: 'flex' }}>
      <div style={{ height: '480px', width: '640px', border: '1px solid cyan' }}>
        <GraphComponent data={[dataMock] as any} />
      </div>
      <div
        style={{ height: '480px', width: '640px', marginLeft: '20px', border: '1px solid cyan' }}
      >
        <GraphComponent data={[dataMock] as any} />
      </div>
    </div>

    <div style={{ display: 'flex', marginTop: '20px' }}>
      <div style={{ height: '480px', width: '640px', border: '1px solid cyan' }}>
        <GraphComponent data={[diffDataMock1, diffDataMock2] as any} />
      </div>

      <div
        style={{ height: '480px', width: '640px', marginLeft: '20px', border: '1px solid cyan' }}
      >
        <GraphComponent data={[diffDataMock1, diffDataMock2] as any} />
      </div>
    </div>
  </div>
)
Multiple.storyName = 'multiple instances'

export const BigGraph = Template.bind({})
BigGraph.storyName = 'lots of data - grpc'
BigGraph.args = {
  data: [grpcData],
}

export default {
  title: 'Chart/Graph',
  component: [Graph, DiffGraph, BigGraph, Multiple],
  argTypes: {
    data: {
      type: { required: true },
    },
    config: {
      control: 'object',
    },
  },
}
