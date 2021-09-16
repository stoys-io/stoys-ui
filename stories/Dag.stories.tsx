import React from 'react'
import { Story } from '@storybook/react'

import { Dag } from '../src/dag'
import Dagg from '../src/dag/Dagg'
import data from './mocks/dag_inlined.json'

const Template: Story<any> = args => <Dag {...args} />

export const DagExample = Template.bind({})
DagExample.args = { data }
DagExample.storyName = 'example'

const Template2: Story<any> = args => <Dagg {...args} />
export const Dag2Example = Template2.bind({})
Dag2Example.args = { data }
Dag2Example.storyName = 'example 2'

export default {
  title: 'Chart/DAG',
  component: DagExample,
  argTypes: {
    data: {
      type: { required: false },
    },
  },
}
