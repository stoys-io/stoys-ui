import React, { useCallback, useState, useContext } from 'react'

import { CheckedRowsContext, ConfigContext } from '../context'
import Toolbar from './Toolbar'

const ChartAndTableHeaderCellTitle = (): JSX.Element => {
  const {
    showChartTableSwitcher,
    setChartTableChecked,
    showLogarithmicSwitcher,
    setLogChecked,
    showAxesSwitcher,
    setAxesChecked,
    isMenuShowed,
    setIsMenuShowed,
    activeMenu,
  } = useContext(ConfigContext)
  const { checkedLogRows, checkedAxesRows, checkedTableRows, dataLength } =
    useContext(CheckedRowsContext)

  return (
    <Toolbar
      showTableChartSwitcher={showChartTableSwitcher}
      showLogScale={showLogarithmicSwitcher}
      showAxes={showAxesSwitcher}
      activeLogScale={checkedLogRows.length === dataLength}
      activeAxes={checkedAxesRows.length === dataLength}
      partiallyActiveAxes={checkedAxesRows.length !== 0 && checkedAxesRows.length !== dataLength}
      activeTable={checkedTableRows.length === dataLength}
      partiallyActiveTable={checkedTableRows.length !== 0 && checkedTableRows.length !== dataLength}
      partiallyActiveLogScale={checkedLogRows.length !== 0 && checkedLogRows.length !== dataLength}
      disableLogScale={checkedTableRows.length === dataLength}
      disableAxes={checkedTableRows.length === dataLength}
      onTableClickHandler={setChartTableChecked!}
      onLogScaleClickHandler={setLogChecked!}
      onAxesClickHandler={setAxesChecked!}
      isMenuShowed={isMenuShowed}
      setIsMenuShowed={setIsMenuShowed}
      activeMenu={activeMenu}
    />
  )
}

export default ChartAndTableHeaderCellTitle
