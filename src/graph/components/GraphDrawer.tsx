import React, { Dispatch, SetStateAction, useState, useMemo } from 'react'
import { Tabs } from 'antd'
import ResizableAntdDrawer from './ResizableAntdDrawer'

import { Table } from '../model'
import { DrawerNodeLabel } from '../styles'

import { NoData } from '../../profiler/styles'
import { RawMetricsData } from '../../metrics/model'
import { JoinRates, Metrics, Profiler, Quality } from '../..'
import { DataGraph } from '../Graph'
import { useGraphStore } from '../graph-store'

const { TabPane } = Tabs

interface Props {
  data: Table
  dataData?: DataGraph[] // TODO: Remove one or another data
  drawerMaxHeight: number
  visible: boolean
  setDrawerVisibility: Dispatch<SetStateAction<boolean>>
}

const GraphDrawer = ({ data, dataData, drawerMaxHeight, visible, setDrawerVisibility }: Props) => {
  const baseRelease = useGraphStore(state => state.baseRelease)
  const [drawerHeight, setDrawerHeight] = useState<number>(drawerMaxHeight)

  const baseData = useMemo(() => {
    if (!baseRelease) {
      return undefined
    }

    return dataData
      ?.find(dataItem => dataItem.version === baseRelease)
      ?.tables?.find(table => table.name === data?.name)
  }, [baseRelease, data, dataData])

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
  const firstNonEmptyTable = data?.dq_join_results
    ? JOIN_RATES_KEY
    : metrics
    ? METADATA_KEY
    : profilerData
    ? PROFILER_KEY
    : data?.dq_result
    ? QUALITY_KEY
    : data?.metadata
    ? METADATA_KEY
    : JOIN_RATES_KEY

  const [table, setTable] = useState<string>(firstNonEmptyTable)
  return (
    <ResizableAntdDrawer
      drawerHeight={drawerHeight}
      setDrawerHeight={setDrawerHeight}
      setDrawerVisibility={setDrawerVisibility}
      visible={visible}
    >
      <Tabs activeKey={table} onChange={setTable}>
        <DrawerNodeLabel>{data?.name}</DrawerNodeLabel>
        <TabPane tab="Join Rates" key={JOIN_RATES_KEY}>
          {data?.dq_join_results ? (
            <JoinRates data={data.dq_join_results} />
          ) : (
            <NoData>No data</NoData>
          )}
        </TabPane>
        <TabPane tab="Metrics" key={METRICS_KEY}>
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
        <TabPane tab="Profiler" key={PROFILER_KEY}>
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
        <TabPane tab="Quality" key={QUALITY_KEY}>
          {data?.dq_result ? (
            <Quality data={data.dq_result} config={{ pagination: false, smallSize: true }} />
          ) : (
            <NoData>No data</NoData>
          )}
        </TabPane>
        {data?.metadata ? (
          <TabPane tab="Metadata" key={METADATA_KEY}>
            <pre>{JSON.stringify(data.metadata, null, 2)}</pre>
          </TabPane>
        ) : null}
      </Tabs>
    </ResizableAntdDrawer>
  )
}

export default GraphDrawer

const JOIN_RATES_KEY = 'join_rates'
const METRICS_KEY = 'metrics'
const PROFILER_KEY = 'profiler'
const QUALITY_KEY = 'quality'
const METADATA_KEY = 'metadata'
