import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { Tabs } from 'antd'
import ResizableAntdDrawer from './ResizableAntdDrawer'

import { DrawerNodeLabel, DrawerContainer } from '../styles'

import { NoData } from '../../profiler/styles'
import { RawMetricsData } from '../../metrics/model'
import { JoinRates, Metrics, Profiler, Quality } from '../..'
import { useGraphStore } from '../graph-store'

const { TabPane } = Tabs

interface Props {
  drawerMaxHeight: number
}

const GraphDrawer = ({ drawerMaxHeight }: Props) => {
  const baseRelease = useGraphStore(state => state.baseRelease)
  const drawerNodeId = useGraphStore(state => state.drawerNodeId)
  const curTable = useGraphStore(
    useCallback(state => state.tables?.find(table => table.id === drawerNodeId), [drawerNodeId])
  )
  const graphData = useGraphStore(state => state.data)

  const visible = drawerNodeId !== undefined
  const closeDrawer = useGraphStore(state => state.closeDrawer)
  const drawerHeight = useGraphStore(state => state.drawerHeight)
  const setDrawerHeight = useGraphStore(state => state.setDrawerHeight)

  useEffect(() => {
    setDrawerHeight(drawerMaxHeight)
    return () => closeDrawer()
  }, [])

  const baseData = useMemo(() => {
    if (!baseRelease) {
      return undefined
    }

    return graphData
      ?.find(dataItem => dataItem.version === baseRelease)
      ?.tables?.find(table => table.name === curTable?.name)
  }, [baseRelease, curTable, graphData])

  const profilerData = curTable?.dp_result ? [curTable.dp_result] : null
  const metrics: RawMetricsData | null = curTable?.metrics
    ? {
        current: {
          data: curTable.metrics[0],
          table_name: curTable.name,
          key_columns: ['location'],
        },
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
  const firstNonEmptyTable = curTable?.dq_join_results
    ? JOIN_RATES_KEY
    : metrics
    ? METADATA_KEY
    : profilerData
    ? PROFILER_KEY
    : curTable?.dq_result
    ? QUALITY_KEY
    : curTable?.metadata
    ? METADATA_KEY
    : JOIN_RATES_KEY

  const [table, setTable] = useState<string>(firstNonEmptyTable)
  return (
    <DrawerContainer>
      <ResizableAntdDrawer
        drawerHeight={drawerHeight}
        setDrawerHeight={setDrawerHeight}
        closeDrawer={closeDrawer}
        visible={visible}
      >
        <Tabs activeKey={table} onChange={setTable}>
          <DrawerNodeLabel>{curTable?.name}</DrawerNodeLabel>
          <TabPane tab="Join Rates" key={JOIN_RATES_KEY}>
            {curTable?.dq_join_results ? (
              <JoinRates data={curTable.dq_join_results} />
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
            {curTable?.dq_result ? (
              <Quality data={curTable.dq_result} config={{ pagination: false, smallSize: true }} />
            ) : (
              <NoData>No data</NoData>
            )}
          </TabPane>
          {curTable?.metadata ? (
            <TabPane tab="Metadata" key={METADATA_KEY}>
              <pre>{JSON.stringify(curTable.metadata, null, 2)}</pre>
            </TabPane>
          ) : null}
        </Tabs>
      </ResizableAntdDrawer>
    </DrawerContainer>
  )
}

export default GraphDrawer

const JOIN_RATES_KEY = 'join_rates'
const METRICS_KEY = 'metrics'
const PROFILER_KEY = 'profiler'
const QUALITY_KEY = 'quality'
const METADATA_KEY = 'metadata'
