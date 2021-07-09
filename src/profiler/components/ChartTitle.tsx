import React from 'react'
import { RadioChangeEvent } from 'antd/lib/radio'

import { CheckedRowsContext } from '../checkedRowsContext'
import CheckboxWithTitle from './CheckboxWithTitle'
import ChartTableSwitcher from './ChartTableSwitcher'
import { ChartTitleWrapper } from '../styles'
import { ChartTitleProps } from '../model'

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
          (
            _isChecked: boolean,
            _checkedRows: Array<string>,
            _setChecked: (_checkedRows: Array<string>) => void
          ) =>
          () => {
            if (_isChecked) {
              const checkedRowsCopy = [..._checkedRows]
              const checkedRowIndex = checkedRowsCopy.indexOf(row.columnName)
              checkedRowsCopy.splice(checkedRowIndex, 1)
              _setChecked(checkedRowsCopy)
            } else {
              _setChecked([..._checkedRows, row.columnName])
            }
          }

        const onChangeRadioGroup = (event: RadioChangeEvent) => {
          const {
            target: { value },
          } = event

          if (value === 'table') {
            setCheckedTableRows([...checkedTableRows, row.columnName])
          } else {
            const checkedRowsCopy = [...checkedTableRows]
            const checkedRowIndex = checkedRowsCopy.indexOf(row.columnName)
            checkedRowsCopy.splice(checkedRowIndex, 1)
            setCheckedTableRows(checkedRowsCopy)
          }
        }

        return (
          <ChartTitleWrapper>
            {tableOptions?.isCheckboxShown ? (
              <ChartTableSwitcher
                onChange={onChangeRadioGroup}
                value={isTableChecked ? 'table' : 'chart'}
              />
            ) : (
              <span />
            )}
            {isTableChecked ? null : (
              <span>
                {rowOptions.isLogCheckboxShown ? (
                  <CheckboxWithTitle
                    setChecked={setChecked(isLogChecked, checkedLogRows, setCheckedLogRows)}
                    isChecked={isLogChecked}
                    title="Logarithmic Scale"
                  />
                ) : null}
                {rowOptions.isAxisCheckboxShown ? (
                  <CheckboxWithTitle
                    setChecked={setChecked(isAxisChecked, checkedAxisRows, setCheckedAxisRows)}
                    isChecked={isAxisChecked}
                    title="Axes"
                  />
                ) : null}
              </span>
            )}
          </ChartTitleWrapper>
        )
      }}
    </CheckedRowsContext.Consumer>
  )
}

export default ChartTitle
