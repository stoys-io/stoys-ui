import React, { Dispatch, SetStateAction } from 'react'
import { Tabs } from 'antd'
import ResizableAntdDrawer from './ResizableAntdDrawer'
import { DrawerNodeLabel } from './styles'
import { JoinRates, Metrics, Profiler, Quality } from '..'
import { NoData } from '../profiler/styles'
import { Table } from './model'
import { RawMetricsData } from '../metrics/model'

const { TabPane } = Tabs

type GraphDrawerProps = {
  data: Table
  baseData?: Table
  drawerHeight: number
  setDrawerHeight: Dispatch<SetStateAction<number>>
  visible: boolean
  setDrawerVisibility: Dispatch<SetStateAction<boolean>>
  table: string
  setDrawerTable: Dispatch<SetStateAction<string>>
}

const GraphDrawer = ({
  data,
  baseData,
  drawerHeight,
  setDrawerHeight,
  visible,
  setDrawerVisibility,
  table,
  setDrawerTable,
}: GraphDrawerProps) => {
  const profilerData = data?.dp_result ? [data.dp_result] : null
  const metrics: RawMetricsData | null = data?.metrics
    ? {
        current: { data: data.metrics[0], table_name: data.name, key_columns: ['location'] },
        previous: undefined,
      }
    : null

  if (baseData?.dp_result && profilerData) {
    profilerData.push(baseData.dp_result)
  }

  if (baseData?.metrics && metrics) {
    metrics.previous = {
      data: baseData.metrics[0],
      table_name: baseData.name,
      key_columns: ['location'],
    }
  }

  return (
    <ResizableAntdDrawer
      drawerHeight={drawerHeight}
      setDrawerHeight={setDrawerHeight}
      setDrawerVisibility={setDrawerVisibility}
      visible={visible}
    >
      <Tabs activeKey={table} onChange={setDrawerTable}>
        <DrawerNodeLabel>{data?.name}</DrawerNodeLabel>
        <TabPane tab="Join Rates" key="join_rates">
          {data?.dq_join_results ? (
            <JoinRates data={data.dq_join_results} />
          ) : (
            <NoData>No data</NoData>
          )}
        </TabPane>
        <TabPane tab="Metrics" key="metrics">
          {metrics ? (
            <Metrics
              data={metrics}
              config={{
                previousReleaseDataIsShown: true,
                disabledColumns: [],
                pagination: false,
                saveMetricThreshold: () => {},
                smallSize: true,
              }}
            />
          ) : (
            <NoData>No data</NoData>
          )}
        </TabPane>
        <TabPane tab="Profiler" key="profiler">
          {profilerData ? (
            <Profiler
              datasets={profilerData}
              pagination={{ disabled: false }}
              config={{
                showLogarithmicSwitcher: false,
                logarithmicChecked: false,

                showAxesSwitcher: false,
                axesChecked: false,

                showChartTableSwitcher: false,
                chartTableChecked: false,

                showSearch: false,
                smallSize: true,
              }}
            />
          ) : (
            <NoData>No data</NoData>
          )}
        </TabPane>
        <TabPane tab="Quality" key="quality">
          {data?.dq_result ? (
            <Quality data={data.dq_result} config={{ pagination: false, smallSize: true }} />
          ) : (
            <NoData>No data</NoData>
          )}
        </TabPane>
        {data?.metadata ? (
          <TabPane tab="Metadata" key="metadata">
            <pre>{JSON.stringify(data.metadata, null, 2)}</pre>
          </TabPane>
        ) : null}
      </Tabs>
    </ResizableAntdDrawer>
  )
}

export default GraphDrawer
