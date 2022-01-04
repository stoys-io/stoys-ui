import React from 'react'
import { Story } from '@storybook/react'
import Graph, { Props } from '../src/graph'

import TableListNode, { Props as P } from '../src/graph/TableListNode'

import _dataMock from './mocks/graph/dag_inlined.json'
import _dataMockGroups from './mocks/graph/dag_inlined_groups.json'
import _dataMockBubbles from './mocks/graph/dag_inlined_bubbles.json'
import grpcData from './mocks/graph/graph.bazel/grpc/dag.json'

import { DataGraph } from '../src/graph-common/model'
const dataMock: DataGraph = JSON.parse(JSON.stringify(_dataMock))
const dataMockGroups: DataGraph = JSON.parse(JSON.stringify(_dataMockGroups))
const dataMockBubbles: DataGraph = JSON.parse(JSON.stringify(_dataMockBubbles))

const Template: Story<Props> = (args: Props) => <Graph {...args} />
export const Example1 = Template.bind({})
Example1.storyName = 'Custom nodes'
Example1.args = {
  data: [dataMock],
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

const TableNode: Story<P> = (args: P) => <TableListNode {...args} />
export const TableListNodeExample = TableNode.bind({})
TableListNodeExample.storyName = 'Table list node'
TableListNodeExample.args = {}

export default {
  title: 'Chart/Custom graph',
  component: [Example1, TableListNodeExample, Example2, Example3, Example4],
  argTypes: {},
}
