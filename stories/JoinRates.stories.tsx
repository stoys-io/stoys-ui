import React from 'react'
import { Story } from '@storybook/react'

import { JoinRates as JoinRatesComponent } from '../src'
import { JoinRatesProps } from '../src/joinRates/model'
import mockData from './mocks/covid19_epidemiology_demographics.dq_join_result.json'

const Template: Story<JoinRatesProps> = args => <JoinRatesComponent {...args} />

export const JoinRates = Template.bind({})
JoinRates.args = {
  data: { id: 'mock', ...mockData },
}
JoinRates.storyName = 'with one item'

export const JoinRatesWithFewItems = Template.bind({})
JoinRatesWithFewItems.args = {
  data: [
    { id: 'mock1', ...mockData },
    {
      id: 'mock2',
      tableNames: ['first'],
      dq_join_statistics: {
        left_rows: 2,
        right_rows: 3,
        left_nulls: 1,
        right_nulls: 0,
        left_distinct: 2,
        right_distinct: 1,
        inner: 3,
        left: 4,
        right: 1,
        full: 2,
        cross: 2,
      },
      dq_result: {
        columns: [
          {
            name: 'key',
          },
          {
            name: 'key_contains_null',
          },
          {
            name: 'left_rows',
          },
          {
            name: 'right_rows',
          },
          {
            name: 'inner',
          },
          {
            name: 'left',
          },
          {
            name: 'right',
          },
          {
            name: 'full',
          },
        ],
        rules: [
          {
            name: 'left_key__dropping',
            expression: 'left_rows > 0',
            description: null,
            referenced_column_names: ['left_rows'],
          },
          {
            name: 'right_key__dropping',
            expression: 'right_rows > 0',
            description: null,
            referenced_column_names: ['right_rows'],
          },
          {
            name: 'left_key__multiplying',
            expression: 'left_rows <= 1',
            description: null,
            referenced_column_names: ['left_rows'],
          },
          {
            name: 'right_key__multiplying',
            expression: 'right_rows <= 1',
            description: null,
            referenced_column_names: ['right_rows'],
          },
        ],
        statistics: {
          table: {
            rows: 20724,
            violations: 20479,
          },
          column: [
            {
              column_name: 'key',
              violations: 0,
            },
            {
              column_name: 'key_contains_null',
              violations: 0,
            },
            {
              column_name: 'left_rows',
              violations: 20463,
            },
            {
              column_name: 'right_rows',
              violations: 2765,
            },
            {
              column_name: 'inner',
              violations: 0,
            },
            {
              column_name: 'left',
              violations: 0,
            },
            {
              column_name: 'right',
              violations: 0,
            },
            {
              column_name: 'full',
              violations: 0,
            },
          ],
          rule: [
            {
              rule_name: 'left_key__dropping',
              violations: 15,
            },
            {
              rule_name: 'right_key__dropping',
              violations: 2,
            },
            {
              rule_name: 'left_key__multiplying',
              violations: 0,
            },
            {
              rule_name: 'right_key__multiplying',
              violations: 0,
            },
          ],
        },
        row_sample: [
          {
            row: ['[IL_Z_1338]', 'false', '0', '1', '0', '0', '1', '1'],
            violated_rule_names: ['left_key__dropping'],
          },
          {
            row: ['[IL_Z_4025]', 'false', '0', '1', '0', '0', '1', '1'],
            violated_rule_names: ['left_key__dropping'],
          },
          {
            row: ['[IN_AR_LSI]', 'false', '163', '0', '0', '163', '0', '163'],
            violated_rule_names: ['right_key__dropping', 'left_key__multiplying'],
          },
          {
            row: ['[IN_BR_ARA]', 'false', '197', '0', '0', '197', '0', '197'],
            violated_rule_names: ['right_key__dropping', 'left_key__multiplying'],
          },
          {
            row: ['[MX_OAX_20416]', 'false', '0', '1', '0', '0', '1', '1'],
            violated_rule_names: ['left_key__dropping'],
          },
        ],
        metadata: {
          left_key_column_names: 'key',
          right_key_column_names: 'key',
          join_type: 'UNDEFINED',
        },
      },
    },
  ],
}
JoinRatesWithFewItems.storyName = 'with few items'

export default {
  title: 'Data Quality/JoinRates',
  component: JoinRates,
}
