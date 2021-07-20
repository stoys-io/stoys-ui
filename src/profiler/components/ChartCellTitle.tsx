import React from 'react'

import { CheckedRowsContext } from '../checkedRowsContext'
import { ChartCellTitleProps } from '../model'
import Toolbox from './Toolbox'

const ChartCellTitle = ({ row, rowOptions, tableOptions }: ChartCellTitleProps): JSX.Element => {
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

        const onChartTableClick = (active: boolean) => {
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
            showTableChartSwitcher={tableOptions?.isCheckboxShown}
            showLogScale={rowOptions.isLogCheckboxShown}
            showAxes={rowOptions.isAxisCheckboxShown}
            activeLogScale={isLogChecked}
            activeAxes={isAxisChecked}
            activeTable={isTableChecked}
            disableLogScale={isTableChecked}
            disableAxes={isTableChecked}
            onTableClickHandler={onChartTableClick}
            onLogScaleClickHandler={setChecked(checkedLogRows, setCheckedLogRows)}
            onAxesClickHandler={setChecked(checkedAxisRows, setCheckedAxisRows)}
          />
        )
      }}
    </CheckedRowsContext.Consumer>
  )
}

export default ChartCellTitle
