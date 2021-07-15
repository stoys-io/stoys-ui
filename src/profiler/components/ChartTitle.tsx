import React from 'react'

import { CheckedRowsContext } from '../checkedRowsContext'
import { ChartTitleProps } from '../model'
import Toolbox from './Toolbox'

const ChartTitle = ({ row, rowOptions, tableOptions }: ChartTitleProps): JSX.Element => {
  return (
    <CheckedRowsContext.Consumer>
      {({
        checkedLogRows,
        setCheckedLogRows,
        checkedAxisRows,
        setCheckedAxisRows,
        checkedTableRows,
        setCheckedTableRows,
      }) => {
        const isLogChecked = checkedLogRows.includes(row.columnName)
        const isAxisChecked = checkedAxisRows.includes(row.columnName)
        const isTableChecked = checkedTableRows.includes(row.columnName)

        const setChecked =
          (_checkedRows: Array<string>, _setChecked: (_checkedRows: Array<string>) => void) =>
          (active: boolean) => {
            if (!active) {
              const checkedRowsCopy = [..._checkedRows]
              const checkedRowIndex = checkedRowsCopy.indexOf(row.columnName)
              checkedRowsCopy.splice(checkedRowIndex, 1)
              _setChecked(checkedRowsCopy)
            } else {
              _setChecked([..._checkedRows, row.columnName])
            }
          }

        const onChangeRadioGroup = (active: boolean) => {
          if (active) {
            setCheckedTableRows([...checkedTableRows, row.columnName])
          } else {
            const checkedRowsCopy = [...checkedTableRows]
            const checkedRowIndex = checkedRowsCopy.indexOf(row.columnName)
            checkedRowsCopy.splice(checkedRowIndex, 1)
            setCheckedTableRows(checkedRowsCopy)
          }
        }

        return (
          <Toolbox
            isTableChartSwitcherHidden={!tableOptions?.isCheckboxShown}
            isLogScaleSwitcherHidden={!rowOptions.isLogCheckboxShown}
            isAxesSwitcherHidden={!rowOptions.isAxisCheckboxShown}
            activeLogScale={isLogChecked}
            activeAxes={isAxisChecked}
            activeTable={isTableChecked}
            disableLogScale={isTableChecked}
            disableAxes={isTableChecked}
            onTableClickHandler={onChangeRadioGroup}
            onLogScaleClickHandler={setChecked(checkedLogRows, setCheckedLogRows)}
            onAxesClickHandler={setChecked(checkedAxisRows, setCheckedAxisRows)}
          />
        )
      }}
    </CheckedRowsContext.Consumer>
  )
}

export default ChartTitle
