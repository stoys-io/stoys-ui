import React, { useEffect, useMemo, useCallback } from 'react'
import { Tabs } from 'antd'

import { DrawerNodeLabel } from '../styles'

import { NoData } from '../../profiler/styles'
import { RawMetricsData } from '../../metrics/model'
import { JoinRates, Metrics, Profiler, Quality } from '../..'
import { useGraphStore } from '../StoreProvider'
import { setDrawerTab, closeDrawer } from '../graph-store'

const { TabPane } = Tabs

export const DrawerTabs = () => {
  const drawerNodeId = useGraphStore(state => state.drawerNodeId)

  const curTable = useGraphStore(
    useCallback(state => state.tables?.find(table => table.id === drawerNodeId), [drawerNodeId])
  )
  const baseRelease = useGraphStore(state => state.baseRelease)
  const graphData = useGraphStore(state => state.data)

  const dispatch = useGraphStore(state => state.dispatch)

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

  const firstNonEmptyTab = curTable?.dq_join_results
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

  const drawerTab = useGraphStore(state => state.drawerTab || firstNonEmptyTab)

  useEffect(() => {
    dispatch(setDrawerTab(firstNonEmptyTab))

    return () => {
      dispatch(closeDrawer)
    }
  }, [])

  return (
    <Tabs
      activeKey={drawerTab}
      onChange={setDrawerTab}
      tabBarStyle={tabBarStyle}
      tabBarExtraContent={<DrawerNodeLabel>{curTable?.name}</DrawerNodeLabel>}
    >
      <TabPane tab="Join Rates" key={JOIN_RATES_KEY}>
        {curTable?.dq_join_results ? (
          <JoinRates config={{ pagination: false }} data={curTable.dq_join_results} />
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
            config={{
              showLogarithmicSwitcher: false,
              logarithmicChecked: false,

              showAxesSwitcher: false,
              axesChecked: false,

              showChartTableSwitcher: false,
              chartTableChecked: false,
              pagination: false,

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
  )
}

const JOIN_RATES_KEY = 'join_rates'
const METRICS_KEY = 'metrics'
const PROFILER_KEY = 'profiler'
const QUALITY_KEY = 'quality'
const METADATA_KEY = 'metadata'

const tabBarStyle = { padding: '0 16px' }
