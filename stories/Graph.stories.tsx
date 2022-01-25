import React from 'react'
import { Story } from '@storybook/react'
import Graph, { Props } from '../src/graph'

import _dataMock from './mocks/graph/dag_inlined.json'
import _dataMockGroups from './mocks/graph/dag_inlined_groups.json'
import _dataMockBubbles from './mocks/graph/dag_inlined_bubbles.json'
import grpcData from './mocks/graph/graph.bazel/grpc/dag.json'

import _diffDataMock1 from './mocks/graph/20210922_120415_152372/dag_inlined.json'
import _diffDataMock2 from './mocks/graph/20210922_125856_444212/dag_inlined.json'

import { DataGraph } from '../src/graph-common/model'

const diffDataMock1: DataGraph = JSON.parse(JSON.stringify(_diffDataMock1))
const diffDataMock2: DataGraph = JSON.parse(JSON.stringify(_diffDataMock2))
const dataMock: DataGraph = JSON.parse(JSON.stringify(_dataMock))
const dataMockGroups: DataGraph = JSON.parse(JSON.stringify(_dataMockGroups))
const dataMockBubbles: DataGraph = JSON.parse(JSON.stringify(_dataMockBubbles))

const Template: Story<Props> = (args: Props) => <Graph {...args} />
export const Example1 = Template.bind({})
Example1.storyName = 'Custom nodes'
Example1.args = {
  data: [dataMock],
}

export const Diffing = Template.bind({})
Diffing.storyName = 'Diffing'
Diffing.args = {
  data: [diffDataMock1, diffDataMock2],
}

export const Example2 = Template.bind({})
Example2.storyName = 'Collapsible groups'
Example2.args = {
  data: [dataMockGroups],
}

export const Example3 = Template.bind({})
Example3.storyName = 'Bubble set'
Example3.args = {
  data: [dataMockBubbles],
}

export const Example4 = Template.bind({})
Example4.storyName = 'Example grpc'
Example4.args = {
  data: [grpcData],
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
Multiple.storyName = 'Multiple instances'

export default {
  title: 'Chart/Custom graph',
  component: [Example1, Diffing, Example2, Example3, Example4, Multiple],
  argTypes: {},
}
