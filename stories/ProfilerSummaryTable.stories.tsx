import React from 'react'
import { Story } from '@storybook/react'

import { Table as TableComponent } from '../src/common'
import dataMock from './mocks/yellow_tripdata_2020-02.csv.dq_result.json'
import DatasetMock from './mocks/yellow_tripdata_2020-02.csv.dp_result.json'

const Template: Story<any> = args => <TableComponent {...args} />

export const Table = Template.bind({})
Table.args = {
  data: dataMock,
  profiler: DatasetMock,
}
Table.storyName = 'ProfilerSummary'

export default {
  title: 'Demo',
  component: [Table],
}
