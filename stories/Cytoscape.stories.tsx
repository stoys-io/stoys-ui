import React from 'react'
import { Story } from '@storybook/react'
import Graph from '../src/cyto'
import { elements1, elements2 } from '../src/cyto/mock'

const Template: Story<{ elements: any[] }> = (args: { elements: any[] }) => <Graph {...args} />
export const Example1 = Template.bind({})
Example1.storyName = 'example1'
Example1.args = { elements: elements1 }

export const Example2 = Template.bind({})
Example2.storyName = 'example2'
Example2.args = { elements: elements2 }

export default {
  title: 'Chart/Cytoscape',
  component: [Example1, Example2],
  argTypes: {},
}
