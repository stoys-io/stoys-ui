import React, { useCallback, useState } from 'react'

import { CheckedRowsContext } from '../checkedRowsContext'
import Toolbar from './Toolbar'
import { ChartHeaderCellTitleProps } from '../model'

const ChartHeaderCellTitle = ({
  logarithmicScale,
  axisOptions,
  tableOptions,
}: ChartHeaderCellTitleProps): JSX.Element => {
  const [isActiveTable, setIsActiveTable] = useState<boolean>(!!tableOptions.isUsedByDefault)

  const onChangeRadioGroup = useCallback(
    (active: boolean) => {
      setIsActiveTable(active)
      tableOptions?.setChecked?.(active)
    },
    [tableOptions]
  )

  return (
    <>
      <CheckedRowsContext.Consumer>
        {({ checkedLogRows, checkedAxisRows, checkedTableRows, dataLength }) => (
          <Toolbar
            showTableChartSwitcher={tableOptions?.isCheckboxShown}
            showLogScale={logarithmicScale.isCheckboxShown}
            showAxes={axisOptions.isCheckboxShown}
            activeLogScale={checkedLogRows.length === dataLength}
            activeAxes={checkedAxisRows.length === dataLength}
            partiallyActiveAxes={
              checkedAxisRows.length !== 0 && checkedAxisRows.length !== dataLength
            }
            activeTable={isActiveTable}
            partiallyActiveTable={
              checkedTableRows.length !== 0 && checkedTableRows.length !== dataLength
            }
            partiallyActiveLogScale={
              checkedLogRows.length !== 0 && checkedLogRows.length !== dataLength
            }
            disableLogScale={isActiveTable || checkedTableRows.length === dataLength}
            disableAxes={isActiveTable || checkedTableRows.length === dataLength}
            onTableClickHandler={onChangeRadioGroup}
            onLogScaleClickHandler={logarithmicScale.setChecked}
            onAxesClickHandler={axisOptions.setChecked}
          />
        )}
      </CheckedRowsContext.Consumer>
    </>
  )
}

export default ChartHeaderCellTitle
