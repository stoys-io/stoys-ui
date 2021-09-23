import React from 'react'
import { Story } from '@storybook/react'

import { Metrics as MetricsComponent, MetricsTableProps } from '../src/metrics'
import mockedDataWithoutDiff from './mocks/covid19_locations_20210922_125856_444212.metrics_data.json'
import mockedData from './mocks/yellow_tripdata_2020-02_vs_2020_03.metrics_data.json'

const Template: Story<MetricsTableProps> = args => <MetricsComponent {...args} />

export const MetricsWithoutDiff = Template.bind({})
MetricsWithoutDiff.args = {
  data: mockedDataWithoutDiff,
  config: {
    disabledColumns: [],
    pagination: false,
    smallSize: true,
  },
  bordered: false,
}

MetricsWithoutDiff.storyName = 'simple'

export const Metrics = Template.bind({})
Metrics.args = {
  data: mockedData,
  config: {
    previousReleaseDataIsShown: true,
    disabledColumns: [],
    pagination: false,
    saveMetricThreshold: () => {},
    smallSize: true,
  },
  bordered: false,
}

Metrics.storyName = 'comparable'

export default {
  title: 'Data Quality/Metrics',
  component: Metrics,
  argTypes: {
    data: {
      type: { required: true },
    },
    config: {
      control: 'object',
    },
  },
}
