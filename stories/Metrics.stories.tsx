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
  bordered: false,
}

export default {
  title: 'Data Quality/Metrics',
  component: Metrics,
  argTypes: {
    data: {
      type: { required: true },
    },
    columns: {
      control: null,
    },
    isLoading: {
      control: 'boolean',
      defaultValue: false,
    },
    previousReleaseDataIsShown: {
      control: 'boolean',
      defaultValue: false,
    },
    saveMetricThreshold: { action: 'clicked' },
    pagination: {
      control: 'object',
    },
    disabledColumns: {
      control: 'array',
      defaultValue: [],
    },
    height: {
      control: 'string',
    },
    smallSize: {
      control: 'boolean',
      defaultValue: false,
    },
  },
}
