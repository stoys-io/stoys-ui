import React from 'react'
import { Story } from '@storybook/react'
import Graph, { Props } from '../src/graph'
import NestedNodes from '../src/graph/NestedNodes'
import { DataGraph } from '../src/graph/model'

import _dataMock from './mocks/graph/dag_inlined.json'
import _diffDataMock1 from './mocks/graph/20210922_120415_152372/dag_inlined.json'
import _diffDataMock2 from './mocks/graph/20210922_125856_444212/dag_inlined.json'
import grpcData from './mocks/graph/graph.bazel/grpc/dag.json'

// hacks: https://github.com/microsoft/TypeScript/issues/26552
const dataMock: DataGraph = JSON.parse(JSON.stringify(_dataMock))
const diffDataMock1: DataGraph = JSON.parse(JSON.stringify(_diffDataMock1))
const diffDataMock2: DataGraph = JSON.parse(JSON.stringify(_diffDataMock2))

const Template: Story<Props> = (args: Props) => <Graph {...args} />
export const SampleGraph = Template.bind({})
SampleGraph.storyName = 'sample data'
SampleGraph.args = {
  data: [dataMock],
}

export const DiffGraph = Template.bind({})
DiffGraph.storyName = 'with diffing'
DiffGraph.args = {
  data: [diffDataMock1, diffDataMock2],
  config: {
    orientation: 'horizontal',
    chromaticScale: 'interpolatePuOr',
    openDrawer: true,
  },
}

export const Multiple = () => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <div style={{ display: 'flex' }}>
      <div style={{ height: '480px', width: '640px', border: '1px solid cyan' }}>
        <Template data={[dataMock]} />
      </div>
      <div
        style={{ height: '480px', width: '640px', marginLeft: '20px', border: '1px solid cyan' }}
      >
        <Template data={[dataMock]} />
      </div>
    </div>

    <div style={{ display: 'flex', marginTop: '20px' }}>
      <div style={{ height: '480px', width: '640px', border: '1px solid cyan' }}>
        <Template data={[diffDataMock1, diffDataMock2]} />
      </div>

      <div
        style={{ height: '480px', width: '640px', marginLeft: '20px', border: '1px solid cyan' }}
      >
        <Template data={[diffDataMock1, diffDataMock2]} />
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

export const Nested = () => (
  <div style={{ width: '100vw', height: '100vh' }}>
    <NestedNodes />
  </div>
)
Nested.storyName = 'nested'

export default {
  title: 'Chart/Graph',
  component: [SampleGraph, DiffGraph, Multiple, BigGraph, Nested],
  argTypes: {
    data: {
      type: { required: true },
    },
    config: {
      control: 'object',
    },
  },
}
