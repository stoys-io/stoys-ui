import React, { useCallback, useState, useContext } from 'react'

import { CheckedRowsContext, TableOptionsContext } from '../context'
import Toolbar from './Toolbar'
import { ChartAndTableHeaderCellTitleProps } from '../model'

const ChartAndTableHeaderCellTitle = ({
  logarithmicScale,
  axesOptions,
}: ChartAndTableHeaderCellTitleProps): JSX.Element => {
  const tableOptions = useContext(TableOptionsContext)
  const [isActiveTable, setIsActiveTable] = useState<boolean>(!!tableOptions.isUsedByDefault)
  const { checkedLogRows, checkedAxesRows, checkedTableRows, dataLength } =
    useContext(CheckedRowsContext)

  const onChangeRadioGroup = useCallback(
    (active: boolean) => {
      setIsActiveTable(active)
      tableOptions?.setChecked?.(active)
    },
    [tableOptions]
  )

  return (
    <Toolbar
      showTableChartSwitcher={tableOptions?.isCheckboxShown}
      showLogScale={logarithmicScale.isCheckboxShown}
      showAxes={axesOptions.isCheckboxShown}
      activeLogScale={checkedLogRows.length === dataLength}
      activeAxes={checkedAxesRows.length === dataLength}
      partiallyActiveAxes={checkedAxesRows.length !== 0 && checkedAxesRows.length !== dataLength}
      activeTable={isActiveTable}
      partiallyActiveTable={checkedTableRows.length !== 0 && checkedTableRows.length !== dataLength}
      partiallyActiveLogScale={checkedLogRows.length !== 0 && checkedLogRows.length !== dataLength}
      disableLogScale={isActiveTable || checkedTableRows.length === dataLength}
      disableAxes={isActiveTable || checkedTableRows.length === dataLength}
      onTableClickHandler={onChangeRadioGroup}
      onLogScaleClickHandler={logarithmicScale.setChecked}
      onAxesClickHandler={axesOptions.setChecked}
    />
  )
}

export default ChartAndTableHeaderCellTitle
