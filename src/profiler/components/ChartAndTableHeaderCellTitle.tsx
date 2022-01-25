import React, { useContext } from 'react'

import { CheckedRowsContext, ConfigContext } from '../context'
import TableSettings from './TableSettings'
import Toolbar from './Toolbar'

const ChartAndTableHeaderCellTitle = (): JSX.Element => {
  const {
    showChartTableSwitcher,
    setChartTableChecked,
    showLogarithmicSwitcher,
    setLogChecked,
    showAxesSwitcher,
    setAxesChecked,
    showOrientSwitcher,
    isVertical,
    _setIsVerticalView,
    showSearch,
    _onSearch,
    showJsonSwitcher,
    isJsonShown,
    _setJsonShown,
    showNormalizeSwitcher,
    isNormalizeChecked,
    _normalizeChange,
    showProfilerToolbar,
  } = useContext(ConfigContext)
  const { checkedLogRows, checkedAxesRows, checkedTableRows, dataLength } =
    useContext(CheckedRowsContext)

  return (
    <div>
      {showProfilerToolbar ? (
        <TableSettings
          isModeSwitcherShown={showOrientSwitcher}
          isModeSwitcherChecked={!!isVertical}
          onModeChange={_setIsVerticalView}
          isSearchShown={!!showSearch}
          onSearchChangeHandler={_onSearch}
          isJsonSwitcherShown={showJsonSwitcher}
          isJsonSwitcherChecked={!!isJsonShown}
          onJsonChange={_setJsonShown}
          isNormalizeSwitcherShown={showNormalizeSwitcher}
          isNormalizeSwitcherChecked={!!isNormalizeChecked}
          onNormalizeChange={_normalizeChange}
        />
      ) : null}
      <Toolbar
        showTableChartSwitcher={showChartTableSwitcher}
        showLogScale={showLogarithmicSwitcher}
        showAxes={showAxesSwitcher}
        activeLogScale={checkedLogRows.length === dataLength}
        activeAxes={checkedAxesRows.length === dataLength}
        partiallyActiveAxes={checkedAxesRows.length !== 0 && checkedAxesRows.length !== dataLength}
        activeTable={checkedTableRows.length === dataLength}
        partiallyActiveTable={
          checkedTableRows.length !== 0 && checkedTableRows.length !== dataLength
        }
        partiallyActiveLogScale={
          checkedLogRows.length !== 0 && checkedLogRows.length !== dataLength
        }
        disableLogScale={checkedTableRows.length === dataLength}
        disableAxes={checkedTableRows.length === dataLength}
        onTableClickHandler={setChartTableChecked!}
        onLogScaleClickHandler={setLogChecked!}
        onAxesClickHandler={setAxesChecked!}
      />
    </div>
  )
}

export default ChartAndTableHeaderCellTitle
