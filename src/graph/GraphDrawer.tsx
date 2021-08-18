import React, { useState } from 'react'
import { IUserNode } from '@antv/graphin'
import { Tabs } from 'antd'
import { StyledDrawer } from './styles'
import { JoinRates, Metrics, Profiler, Quality } from '..'
import joinRatesData from '../../stories/mocks/covid19_epidemiology_demographics.dq_join_result.json'
import { dq_join_info_1 } from '../../stories/mocks/dqJoinInfo.mock'
import metricsData from '../../stories/mocks/yellow_tripdata_2020-02_vs_2020_03.metrics_data.json'
import { Dataset, Orient } from '../profiler/model'
import profilerDatasetMock from '../../stories/mocks/yellow_tripdata_2020-02.csv.dp_result.json'
import qualityDataMock from '../../stories/mocks/yellow_tripdata_2020-02.csv.dq_result.json'

const { TabPane } = Tabs

interface GraphDrawerProps {
  visible: boolean
  setDrawerVisibility: (visible: boolean) => void
  selectedNode?: IUserNode
}

const GraphDrawer = ({ visible, setDrawerVisibility, selectedNode }: GraphDrawerProps) => {
  const [table, onSelectTable] = useState('join_rates')
  return (
    <StyledDrawer
      placement="bottom"
      closable
      onClose={() => setDrawerVisibility(false)}
      visible={visible}
      height={500}
    >
      <Tabs activeKey={table} onChange={onSelectTable}>
        <TabPane tab="Join Rates" key="join_rates">
          <JoinRates data={{ id: 'mock', dq_join_info: dq_join_info_1, ...joinRatesData }} />
        </TabPane>
        <TabPane tab="Metrics" key="metrics">
          <Metrics
            data={metricsData}
            previousReleaseDataIsShown
            disabledColumns={[]}
            pagination={{ disabled: true }}
            saveMetricThreshold={() => {}}
            smallSize
          />
        </TabPane>
        <TabPane tab="Profiler" key="profiler">
          <Profiler
            datasets={[profilerDatasetMock as Dataset]}
            pagination={{ disabled: false }}
            rowToolbarOptions={{
              logarithmicScaleOptions: { isCheckboxShown: false, isUsedByDefault: false },
              axisOptions: { isCheckboxShown: false, isUsedByDefault: false },
              chartTableOptions: { isCheckboxShown: false, isUsedByDefault: false },
            }}
            profilerToolbarOptions={{
              orientOptions: {
                isCheckboxShown: true,
                onOrientChange: (orient: Orient) => console.log('orient => ', orient),
              },
              searchOptions: {
                disabled: false,
                onChange: (value: string) => console.log('search => ', value),
              },
            }}
            visibleColumns={['count_nulls', 'count_unique', 'mean', 'min', 'max', 'nullable']}
            smallSize
            colors={['#4363d8']}
          />
        </TabPane>
        <TabPane tab="Quality" key="quality">
          <Quality data={qualityDataMock} pagination={{ disabled: true }} smallSize />
        </TabPane>
      </Tabs>
    </StyledDrawer>
  )
}

export default GraphDrawer
