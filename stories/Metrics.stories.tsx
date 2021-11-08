import React from 'react'
import { Story } from '@storybook/react'

import { Metrics as MetricsComponent, MetricsTableProps } from '../src/aggSum'
import currentMockedRawData from './mocks/covid19_locations_20210922_125856_444212.metrics_data.json'
import previousMockedRawData from './mocks/covid19_locations_20210922_120415_152372.metrics_data.json'
import mockedData from './mocks/yellow_tripdata_2020-02_vs_2020_03.metrics_data.json'

const Template: Story<MetricsTableProps> = args => <MetricsComponent {...args} />

export const MetricsWithRawData = Template.bind({})
MetricsWithRawData.args = {
  data: {
    current: currentMockedRawData,
  },
  config: {
    disabledColumns: [],
    pagination: false,
    smallSize: true,
  },
  bordered: false,
}

MetricsWithRawData.storyName = 'with raw data'

export const MetricsWithRawDataComparable = Template.bind({})
MetricsWithRawDataComparable.args = {
  data: {
    current: currentMockedRawData,
    previous: previousMockedRawData,
  },
  config: {
    disabledColumns: [],
    pagination: false,
    smallSize: true,
    showAbsDiffColumn: true,
    showRelativeDiffColumn: true,
  },
  bordered: false,
}

MetricsWithRawDataComparable.storyName = 'with raw data comparable'

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

Metrics.storyName = 'with comparable data'

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
