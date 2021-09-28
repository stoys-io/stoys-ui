import React, { Dispatch, SetStateAction } from 'react'
import { Tabs } from 'antd'
import ResizableAntdDrawer from './ResizableAntdDrawer'
import { DrawerNodeLabel } from './styles'
import { JoinRates, Metrics, Profiler, Quality } from '..'
import { NoData } from '../profiler/styles'
import { Table } from './model'

const { TabPane } = Tabs

type GraphDrawerProps = {
  data: Table
  drawerHeight: number
  setDrawerHeight: Dispatch<SetStateAction<number>>
  visible: boolean
  setDrawerVisibility: Dispatch<SetStateAction<boolean>>
  table: string
  setDrawerTable: Dispatch<SetStateAction<string>>
}

const GraphDrawer = ({
  data,
  drawerHeight,
  setDrawerHeight,
  visible,
  setDrawerVisibility,
  table,
  setDrawerTable,
}: GraphDrawerProps) => {
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
          {data?.metrics ? (
            <Metrics
              data={data.metrics}
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
          {data?.dp_result ? (
            <Profiler
              datasets={[data.dp_result]}
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
