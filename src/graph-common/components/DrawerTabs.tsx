import React, { useCallback, useEffect, useState } from 'react'
import { Tabs } from 'antd'

import { DrawerNodeLabel } from '../styles'

import { NoData } from '../../profiler/styles'
import { RawAggSumData } from '../../aggSum/model'
import { JoinRates, AggSum, Quality } from '../..'
import Profiler from '../../profiler/ProfilerTable'
import { useGraphStore, setDrawerTab, closeDrawer, useGraphDispatch } from '../store'
import ProfilerToolbar from '../../profiler/ProfilerToolbar'
import StringDiffing from '../../common/StringDiffing'

const { TabPane } = Tabs

const DrawerTabs = () => {
  const dispatch = useGraphDispatch()
  const drawerNodeId = useGraphStore(state => state.drawerNodeId)
  const baseRelease = useGraphStore(state => state.baseRelease)
  const graphData = useGraphStore(state => state.data)
  const curReleaseGraph = useGraphStore(
    state => state.currentReleaseGraph,
    (oldGraph, newGraph) => oldGraph.release === newGraph.release
  )

  const selectedReleaseTables = !baseRelease
    ? graphData.find(dataItem => dataItem.version === curReleaseGraph.release)?.tables ?? []
    : graphData.find(dataItem => dataItem.version === baseRelease)?.tables ?? []
  const selectedTable = selectedReleaseTables.find(table => table.id === drawerNodeId)

  const otherReleaseTable = !baseRelease
    ? undefined
    : graphData
        ?.find(dataItem => dataItem.version === curReleaseGraph.release)
        ?.tables?.find(table => table.name === selectedTable?.name)

  let profilerData = null
  if (!baseRelease) {
    profilerData = selectedTable?.dp_result ? [selectedTable.dp_result] : null
  } else {
    profilerData = selectedTable?.dp_result
      ? [
          selectedTable?.dp_result,
          ...(otherReleaseTable?.dp_result ? [otherReleaseTable?.dp_result] : []),
        ]
      : null
  }

  let aggSum: RawAggSumData | null = null
  if (!baseRelease) {
    aggSum = selectedTable?.aggSum
      ? {
          current: {
            data: selectedTable.aggSum[0],
            table_name: selectedTable.name,
            key_columns: ['location'],
          },
          previous: undefined,
        }
      : null
  } else {
    aggSum = selectedTable?.aggSum
      ? {
          current: {
            data: selectedTable.aggSum[0],
            table_name: selectedTable.name,
            key_columns: ['location'],
          },
          previous: otherReleaseTable?.aggSum
            ? {
                data: otherReleaseTable.aggSum[0],
                table_name: otherReleaseTable.name,
                key_columns: ['location'],
              }
            : undefined,
        }
      : null
  }

  const firstNonEmptyTab = selectedTable?.dq_join_results
    ? JOIN_RATES_KEY
    : aggSum
    ? METADATA_KEY
    : profilerData
    ? PROFILER_KEY
    : selectedTable?.dq_result
    ? QUALITY_KEY
    : selectedTable?.metadata
    ? METADATA_KEY
    : JOIN_RATES_KEY

  const drawerTab = useGraphStore(state => state.drawerTab || firstNonEmptyTab)

  useEffect(() => {
    dispatch(setDrawerTab(firstNonEmptyTab))

    return () => {
      dispatch(closeDrawer)
    }
  }, [])

  const [isVertical, setIsVertical] = useState<boolean>(false)
  const [searchValue, setSearchValue] = useState<string>('')

  const [isNormalizeChecked, setIsNormalizeChecked] = useState<boolean>(false)
  const _normalizeChange = () => setIsNormalizeChecked(!isNormalizeChecked)

  const _setIsVerticalView = useCallback(
    () =>
      setIsVertical((prevState: boolean) => {
        return !prevState
      }),
    []
  )

  return (
    <Tabs
      activeKey={drawerTab}
      onChange={tab => dispatch(setDrawerTab(tab))}
      tabBarStyle={tabBarStyle}
      tabBarExtraContent={{
        left: <DrawerNodeLabel title={selectedTable?.name}>{selectedTable?.name}</DrawerNodeLabel>,
        right:
          profilerData && drawerTab === 'profiler' ? (
            <div>
              <ProfilerToolbar
                datasets={profilerData}
                config={{
                  showOrientSwitcher: true,
                  showJsonSwitcher: false,
                  showNormalizeSwitcher: true,
                  showSearch: true,
                  isVertical,
                  setIsVerticalView: _setIsVerticalView,
                  onSearch: setSearchValue,
                  isNormalizeChecked,
                  normalizeChange: _normalizeChange,
                }}
              />
            </div>
          ) : null,
      }}
    >
      <TabPane tab="Join Rates" key={JOIN_RATES_KEY}>
        {selectedTable?.dq_join_results ? (
          <JoinRates config={{ pagination: false }} data={selectedTable.dq_join_results} />
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

              showChartTableSwitcher: false,
              chartTableChecked: false,
              pagination: false,

              smallSize: true,
              searchValue,
              isVertical,
              isNormalizeChecked,
            }}
          />
        ) : (
          <NoData>No data</NoData>
        )}
      </TabPane>
      <TabPane tab="Quality" key={QUALITY_KEY}>
        {selectedTable?.dq_result ? (
          <Quality data={selectedTable.dq_result} config={{ pagination: false, smallSize: true }} />
        ) : (
          <NoData>No data</NoData>
        )}
      </TabPane>
      {selectedTable?.metadata ? (
        <TabPane tab="Metadata" key={METADATA_KEY}>
          <pre>{JSON.stringify(selectedTable.metadata, null, 2)}</pre>
        </TabPane>
      ) : null}
      {selectedTable?.code ? (
        <TabPane tab="Code" key={CODE_KEY}>
          {otherReleaseTable?.code ? (
            <StringDiffing current={selectedTable.code} base={otherReleaseTable.code} />
          ) : (
            <pre>{selectedTable.code}</pre>
          )}
        </TabPane>
      ) : null}
    </Tabs>
  )
}

export default DrawerTabs

const JOIN_RATES_KEY = 'join_rates'
const AGG_SUM_KEY = 'aggSum'
const PROFILER_KEY = 'profiler'
const QUALITY_KEY = 'quality'
const METADATA_KEY = 'metadata'
const CODE_KEY = 'code'

const tabBarStyle = { padding: '0 16px' }
