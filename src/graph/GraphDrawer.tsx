import React, { Dispatch, SetStateAction } from 'react'
import { Tabs } from 'antd'
import ResizableAntdDrawer from './ResizableAntdDrawer'
import { DrawerNodeLabel } from './styles'
import { JoinRates, Metrics, Profiler, Quality } from '..'
import { Orient } from '../profiler/model'
/* import { Table } from './model' */
import { NoData } from '../profiler/styles'
import { Table } from './model2'

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
              previousReleaseDataIsShown
              disabledColumns={[]}
              pagination={{ disabled: true }}
              saveMetricThreshold={() => {}}
              smallSize
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
              rowToolbarOptions={{
                logarithmicScaleOptions: { isCheckboxShown: false, isUsedByDefault: false },
                axesOptions: { isCheckboxShown: false, isUsedByDefault: false },
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
              smallSize
            />
          ) : (
            <NoData>No data</NoData>
          )}
        </TabPane>
        <TabPane tab="Quality" key="quality">
          {data?.dq_result ? (
            <Quality data={data.dq_result} pagination={{ disabled: true }} smallSize />
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
