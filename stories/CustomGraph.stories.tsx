import React from 'react'
import { Story } from '@storybook/react'
import CustomGraphComponent, { Props } from '../src/customGraph'

import Graph, { Props as P } from '../src/customGraph/Graph'
import _dataMock from './mocks/graph/dag_inlined.json'
import grpcData from './mocks/graph/graph.bazel/grpc/dag.json'

import { DataGraph } from '../src/graph/model'
const dataMock: DataGraph = JSON.parse(JSON.stringify(_dataMock))

const Template: Story<Props> = (args: Props) => (
  <div style={{ width: '100vw', height: '100vh' }}>
    <CustomGraphComponent {...args} />
  </div>
)
export const Example = Template.bind({})
Example.storyName = 'example'
Example.args = {}

const Template2: Story<P> = (args: P) => <Graph {...args} />
export const Example2 = Template2.bind({})
Example2.storyName = 'example2'
Example2.args = {
  data: [dataMock],
}

export const Example3 = Template2.bind({})
Example3.storyName = 'example3 - grpc'
Example3.args = {
  data: [grpcData],
}

export default {
  title: 'Chart/Custom graph',
  component: [Example, Example2, Example3],
  argTypes: {},
}
