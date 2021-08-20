import React from 'react'

import { CheckedRowsContext } from '../checkedRowsContext'
import { ChartCellTitleProps } from '../model'
import Toolbar from './Toolbar'

const ChartCellTitle = ({ row, rowOptions, tableOptions }: ChartCellTitleProps): JSX.Element => {
  return (
    <CheckedRowsContext.Consumer>
      {({
        checkedLogRows,
        setCheckedLogRows,
        checkedAxesRows,
        setCheckedAxesRows,
        checkedTableRows,
        setCheckedTableRows,
      }) => {
        const isLogChecked = checkedLogRows.includes(row.columnName)
        const isAxesChecked = checkedAxesRows.includes(row.columnName)
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
          <Toolbar
            showTableChartSwitcher={tableOptions?.isCheckboxShown}
            showLogScale={rowOptions.isLogCheckboxShown}
            showAxes={rowOptions.isAxesCheckboxShown}
            activeLogScale={isLogChecked}
            activeAxes={isAxesChecked}
            activeTable={isTableChecked}
            disableLogScale={isTableChecked}
            disableAxes={isTableChecked}
            onTableClickHandler={onChartTableClick}
            onLogScaleClickHandler={setChecked(checkedLogRows, setCheckedLogRows)}
            onAxesClickHandler={setChecked(checkedAxesRows, setCheckedAxesRows)}
          />
        )
      }}
    </CheckedRowsContext.Consumer>
  )
}

export default ChartCellTitle
