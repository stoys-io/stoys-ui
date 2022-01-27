import React, { useState, useCallback, useEffect } from 'react'

import { DataProfilerProps, Orient } from './model'

import { NoData } from './styles'
import ProfilerTable from './ProfilerTable'
import ProfilerToolbar from './ProfilerToolbar'

export const DataProfiler = (props: DataProfilerProps) => {
  const { datasets, config = {}, ...otherProps } = props
  const {
    smallSize,
    colors,
    visibleColumns,
    showProfilerToolbar = true,
    showOrientSwitcher = true,
    orientType,
    onOrientChange,
    showJsonSwitcher = true,
    jsonChecked,
    onJsonChange,
    showNormalizeSwitcher = true,
    normalizeChecked,
    showSearch = true,
    onSearchChange,
    showLogarithmicSwitcher,
    logarithmicChecked,
    showAxesSwitcher,
    axesChecked,
    showChartTableSwitcher,
    chartTableChecked,
    pagination,
    height,
  } = config

  const [isVertical, setIsVertical] = useState<boolean>(orientType === Orient.Vertical)
  const [searchValue, setSearchValue] = useState<string>('')

  const [isNormalizeChecked, setIsNormalizeChecked] = useState<boolean>(!!normalizeChecked)
  const _normalizeChange = () => setIsNormalizeChecked(!isNormalizeChecked)

  if (!datasets || !Array.isArray(datasets)) {
    return <NoData>No data</NoData>
  }

  useEffect(() => {
    setIsVertical(orientType === Orient.Vertical)
  }, [config])

  const _setIsVerticalView = useCallback(
    () =>
      setIsVertical((prevState: boolean) => {
        onOrientChange?.(!prevState ? Orient.Vertical : Orient.Horizontal)

        return !prevState
      }),
    []
  )

  const _onSearch = useCallback(
    (value: string) => {
      onSearchChange?.(value)
      setSearchValue(value)
    },
    [config]
  )

  return (
    <>
      {showProfilerToolbar ? (
        <ProfilerToolbar
          datasets={datasets}
          config={{
            showOrientSwitcher,
            showJsonSwitcher,
            jsonChecked,
            onJsonChange,
            showNormalizeSwitcher,
            showSearch,
            isVertical,
            setIsVerticalView: _setIsVerticalView,
            onSearch: _onSearch,
            isNormalizeChecked,
            normalizeChange: _normalizeChange,
          }}
        />
      ) : null}
      <ProfilerTable
        datasets={datasets}
        config={{
          smallSize,
          colors,
          visibleColumns,
          showLogarithmicSwitcher,
          logarithmicChecked,
          showAxesSwitcher,
          axesChecked,
          showChartTableSwitcher,
          chartTableChecked,
          pagination,
          height,
          isVertical,
          searchValue,
          isNormalizeChecked,
        }}
        {...otherProps}
      />
    </>
  )
}
