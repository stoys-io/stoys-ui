import React from 'react'
import { Story } from '@storybook/react'

import { Graph as GraphComponent } from '../src'

const Template: Story = () => <GraphComponent />

export const Graph = Template.bind({})

export default {
  title: 'Data Quality/Graph',
  component: Graph,
}
