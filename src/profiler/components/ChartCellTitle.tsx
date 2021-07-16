import React, { useCallback, useState } from 'react'

import { CheckedRowsContext } from '../checkedRowsContext'
import Toolbox from './Toolbox'
import { ChartCellTitleProps } from '../model'

const ChartCellTitle = ({
  logarithmicScale,
  axisOptions,
  tableOptions,
}: ChartCellTitleProps): JSX.Element => {
  const [isActiveTable, setIsActiveTable] = useState<boolean>(!!tableOptions.isUsedByDefault)

  const onChangeRadioGroup = useCallback(
    (active: boolean) => {
      setIsActiveTable(active)
      tableOptions.setChecked(active)
    },
    [tableOptions]
  )

  return (
    <>
      <CheckedRowsContext.Consumer>
        {({ checkedLogRows, checkedAxisRows, checkedTableRows, dataLength }) => (
          <Toolbox
            isTableChartSwitcherHidden={!tableOptions?.isCheckboxShown}
            isLogScaleSwitcherHidden={!logarithmicScale.isCheckboxShown}
            isAxesSwitcherHidden={!axisOptions.isCheckboxShown}
            activeLogScale={checkedLogRows.length === dataLength}
            activeAxes={checkedAxisRows.length === dataLength}
            partiallyActiveAxes={
              checkedAxisRows.length !== 0 && checkedAxisRows.length !== dataLength
            }
            activeTable={isActiveTable}
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

export default ChartCellTitle
