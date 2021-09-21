import React from 'react'
import { Story } from '@storybook/react'
import { Graph as GraphComponent, GraphProps } from '../src'
import { nodes } from './mocks/graph/Nodes.mock'
import { edges } from './mocks/graph/Edges.mock'
import { combos } from './mocks/graph/Combos.mock'

const Template: Story<GraphProps> = args => <GraphComponent {...args} />

export const Graph = Template.bind({})

Graph.args = {
  chromaticScale: 'interpolatePuOr', nodes, edges, combos
}

export default {
  title: 'Data Quality/Graph',
  component: Graph,
  parameters: {
    layout: 'fullscreen',
  }
}
