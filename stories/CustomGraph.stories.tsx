import React from 'react'
import { Story } from '@storybook/react'
import Graph, { Props } from '../src/customGraph'
import CustomGraphComponent, { Props as P } from '../src/customGraph/CustomGraphComponent'
import dummyMock from './mocks/CustomGraph.mock'

import _dataMock from './mocks/graph/dag_inlined.json'
import _dataMockGroups from './mocks/graph/dag_inlined_groups.json'
import _dataMockBubbles from './mocks/graph/dag_inlined_bubbles.json'
import grpcData from './mocks/graph/graph.bazel/grpc/dag.json'

import { DataGraph } from '../src/graph/model'
const dataMock: DataGraph = JSON.parse(JSON.stringify(_dataMock))
const dataMockGroups: DataGraph = JSON.parse(JSON.stringify(_dataMockGroups))
const dataMockBubbles: DataGraph = JSON.parse(JSON.stringify(_dataMockBubbles))

const Template: Story<P> = (args: P) => (
  <div style={{ width: '100vw', height: '100vh' }}>
    <CustomGraphComponent {...args} />
  </div>
)
export const Example = Template.bind({})
Example.storyName = 'Simple'
Example.args = { graph: dummyMock }

const Template2: Story<Props> = (args: Props) => <Graph {...args} />
export const Example2 = Template2.bind({})
Example2.storyName = 'Custom nodes'
Example2.args = {
  data: [dataMock],
}

export const Example3 = Template2.bind({})
Example3.storyName = 'Collapsible groups'
Example3.args = {
  data: [dataMockGroups],
}

export const Example4 = Template2.bind({})
Example4.storyName = 'Bubble set'
Example4.args = {
  data: [dataMockBubbles],
}

export const Example5 = Template2.bind({})
Example5.storyName = 'Example grpc'
Example5.args = {
  data: [grpcData],
}

export default {
  title: 'Chart/Custom graph',
  component: [Example, Example2, Example3, Example4, Example5],
  argTypes: {},
}
