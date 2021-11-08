import { MetricsData } from '../model'

export const metricsData: MetricsData = {
  columns: [
    { columnName: 'id', title: 'id' },
    { columnName: 'value', title: 'value' },
  ],
  values: [
    [
      { columnName: 'id', currentValue: '1', previousValue: null, threshold: 10, trends: [] },
      { columnName: 'value', currentValue: '10', previousValue: null, threshold: 10, trends: [] },
      {
        columnName: 'average_fare',
        currentValue: 20,
        previousValue: 10,
        threshold: 10,
        trends: [],
      },
      {
        columnName: 'average_tip',
        currentValue: 25,
        previousValue: 5,
        threshold: 10,
        trends: [],
      },
    ],
    [
      { columnName: 'id', currentValue: '2', previousValue: null, threshold: 10, trends: [] },
      { columnName: 'value', currentValue: '13', previousValue: null, threshold: 10, trends: [] },
      {
        columnName: 'average_fare',
        currentValue: 24,
        previousValue: 12,
        threshold: 10,
        trends: [],
      },
      {
        columnName: 'average_tip',
        currentValue: 20,
        previousValue: 15,
        threshold: 10,
        trends: [],
      },
    ],
    [
      { columnName: 'id', currentValue: '3', previousValue: null, threshold: 10, trends: [] },
      { columnName: 'value', currentValue: '8', previousValue: null, threshold: 10, trends: [] },
      {
        columnName: 'average_fare',
        currentValue: 4,
        previousValue: 18,
        threshold: 10,
        trends: [],
      },
      {
        columnName: 'average_tip',
        currentValue: 21,
        previousValue: 23,
        threshold: 10,
        trends: [],
      },
    ],
  ],
}

export const bigMetricsData: MetricsData = {
  columns: [
    { columnName: 'id', title: 'id' },
    { columnName: 'value', title: 'value' },
  ],
  values: Array.from(new Array(100), (value, index) => {
    return [
      {
        columnName: 'id',
        currentValue: `${index}`,
        previousValue: null,
        threshold: 10,
        trends: [],
      },
      {
        columnName: 'value',
        currentValue: `${index * 2}`,
        previousValue: null,
        threshold: 10,
        trends: [],
      },
      {
        columnName: 'average_fare',
        currentValue: index * 2,
        previousValue: index,
        threshold: 10,
        trends: [],
      },
      {
        columnName: 'average_tip',
        currentValue: index * 2,
        previousValue: index,
        threshold: 10,
        trends: [],
      },
    ]
  }),
}
