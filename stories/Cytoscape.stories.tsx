import React from 'react'
import { Story } from '@storybook/react'
import Cyt from '../src/cyto'

const Template: Story = () => <Cyt />
export const Cytoscape = Template.bind({})
Cytoscape.storyName = 'example'

export default {
  title: 'Chart/Cytoscape',
  component: [Cytoscape],
  argTypes: {},
}
