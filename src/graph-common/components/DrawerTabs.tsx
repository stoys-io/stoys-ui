import React, { useEffect, useMemo, useCallback } from 'react'
import { Tabs } from 'antd'

import { DrawerNodeLabel } from '../styles'

import { NoData } from '../../profiler/styles'
import { RawAggSumData } from '../../aggSum/model'
import { JoinRates, AggSum, Profiler, Quality } from '../..'
import { useGraphStore, setDrawerTab, closeDrawer, useGraphDispatch } from '../store'

const { TabPane } = Tabs

const DrawerTabs = ({ drawerHeight }: { drawerHeight?: number }) => {
  const dispatch = useGraphDispatch()

  const drawerNodeId = useGraphStore(state => state.drawerNodeId)
  const curTable = useGraphStore(
    useCallback(state => state.tables?.find(table => table.id === drawerNodeId), [drawerNodeId])
  )
  const baseRelease = useGraphStore(state => state.baseRelease)
  const graphData = useGraphStore(state => state.data)

  const baseData = useMemo(() => {
    if (!baseRelease) {
      return undefined
    }

    return graphData
      ?.find(dataItem => dataItem.version === baseRelease)
      ?.tables?.find(table => table.name === curTable?.name)
  }, [baseRelease, curTable, graphData])

  const profilerData = curTable?.dp_result ? [curTable.dp_result] : null
  const aggSum: RawAggSumData | null = curTable?.aggSum
    ? {
        current: {
          data: curTable.aggSum[0],
          table_name: curTable.name,
          key_columns: ['location'],
        },
        previous: undefined,
      }
    : null

  if (baseData?.dp_result && profilerData) {
    profilerData.push(baseData.dp_result)
  }

  if (baseData?.aggSum && aggSum) {
    aggSum.previous = {
      data: baseData.aggSum[0],
      table_name: baseData.name,
      key_columns: ['location'],
    }
  }

  const firstNonEmptyTab = curTable?.dq_join_results
    ? JOIN_RATES_KEY
    : aggSum
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
      onChange={tab => dispatch(setDrawerTab(tab))}
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
      <TabPane tab="AggSum" key={AGG_SUM_KEY}>
        {aggSum ? (
          <AggSum
            data={aggSum}
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

              showJsonSwitcher: false,

              showChartTableSwitcher: false,
              chartTableChecked: false,
              pagination: false,

              showSearch: false,
              smallSize: true,

              height: drawerHeight,
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

DrawerTabs.displayName = 'DrawerTabs'

export default DrawerTabs

const JOIN_RATES_KEY = 'join_rates'
const AGG_SUM_KEY = 'aggSum'
const PROFILER_KEY = 'profiler'
const QUALITY_KEY = 'quality'
const METADATA_KEY = 'metadata'

const tabBarStyle = { padding: '0 16px' }
