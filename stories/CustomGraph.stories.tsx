import React from 'react'
import { Story } from '@storybook/react'
import Graph, { Props } from '../src/customGraph'
import CustomGraphComponent, { Props as P } from '../src/customGraph/CustomGraphComponent'

import _dataMock from './mocks/graph/dag_inlined.json'
import _dataMockGroups from './mocks/graph/dag_inlined_groups.json'
import grpcData from './mocks/graph/graph.bazel/grpc/dag.json'

import { DataGraph } from '../src/graph/model'
const dataMock: DataGraph = JSON.parse(JSON.stringify(_dataMock))
const dataMockGroups: DataGraph = JSON.parse(JSON.stringify(_dataMockGroups))

const Template: Story<P> = (args: P) => (
  <div style={{ width: '100vw', height: '100vh' }}>
    <CustomGraphComponent {...args} />
  </div>
)
export const Example = Template.bind({})
Example.storyName = 'example'
Example.args = {}

const Template2: Story<Props> = (args: Props) => <Graph {...args} />
export const Example2 = Template2.bind({})
Example2.storyName = 'example 2'
Example2.args = {
  data: [dataMock],
}

export const Example3 = Template2.bind({})
Example3.storyName = 'example 3'
Example3.args = {
  data: [dataMockGroups],
}

export const Example4 = Template2.bind({})
Example4.storyName = 'example 4 - grpc'
Example4.args = {
  data: [grpcData],
}

export default {
  title: 'Chart/Custom graph',
  component: [Example, Example2, Example3, Example4],
  argTypes: {},
}
