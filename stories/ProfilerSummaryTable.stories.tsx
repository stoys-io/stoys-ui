import React from 'react'
import { Story } from '@storybook/react'

import { Table as TableComponent } from '../src/common'
import { dateData, numberData, stringData } from './mocks/profilerSummary.mock'

const Template: Story<any> = args => <TableComponent {...args} />

export const Table = Template.bind({})
Table.args = {
  data: [
    {
      key: '0',
      passengers: '123 string',
      tpep_pickup_datetime: '10/20/20',
      VendorID: 23495,
    },
    {
      key: '1',
      passengers: '234 string',
      tpep_pickup_datetime: '10/21/20',
      VendorID: 24567,
    },
    {
      key: '2',
      passengers: '345 string',
      tpep_pickup_datetime: '10/22/20',
      VendorID: 13295,
    },
    {
      key: '3',
      passengers: '456 string',
      tpep_pickup_datetime: '10/23/20',
      VendorID: 3405,
    },
    {
      key: '4',
      passengers: '567 string',
      tpep_pickup_datetime: '10/24/20',
      VendorID: 43490,
    },
    {
      key: '5',
      passengers: '678 string',
      tpep_pickup_datetime: '10/25/20',
      VendorID: 495,
    },
  ],
  summary: [numberData, dateData, stringData],
}
Table.storyName = 'ProfilerSummary'

export default {
  title: 'Demo',
  component: [Table],
}
