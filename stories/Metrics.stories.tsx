import React from 'react'
import { Story } from '@storybook/react'

import { Metrics as MetricsComponent, MetricsTableProps } from '../src/metrics'
import mockedData from './mocks/yellow_tripdata_2020-02_vs_2020_03.metrics_data.json'

const Template: Story<MetricsTableProps> = args => <MetricsComponent {...args} />

export const Metrics = Template.bind({})
Metrics.args = {
  data: mockedData,
  previousReleaseDataIsShown: true,
  disabledColumns: [],
  pagination: false,
  saveMetricThreshold: () => {},
  smallSize: true,
}

export default {
  title: 'Data Quality/Metrics',
  component: Metrics,
}
