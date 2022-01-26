import React, { useCallback, useMemo, useState } from 'react'
import { getColumnNameLength } from '../aggSum/helpers'
import { usePagination } from '../hooks'
import { getColumns } from './columns'

import HorizontalTable from './components/HorizontalTable'
import VerticalTable from './components/VerticalTable'
import { COLORS, MIN_TABLE_ROW_HEIGHT, TABLE_ROW_HEIGHT } from './constants'
import { CheckedRowsContext, ConfigContext } from './context'
import { hydrateDataset, notEmpty, transformNormalize } from './helpers'
import { ChildDataItem, DataItem, ProfilerTableProps } from './model'
import { NoData, TableWrapper } from './styles'

const ProfilerTable = (props: ProfilerTableProps) => {
  const { datasets, config = {}, ...otherProps } = props
  const {
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
  } = config

  const { current, setCurrentPage, pageSize, setPageSize } = usePagination(pagination)

  if (!datasets || !Array.isArray(datasets)) {
    return <NoData>No data</NoData>
  }

  const dataGrouppedByTitle = useMemo(
    () =>
      datasets
        .filter(dataItem => dataItem.columns)
        .map((dataItem, index) =>
          hydrateDataset(dataItem, (colors && colors[index]) || COLORS[index])
        )
        .reduce((acc: { [key: string]: Array<ChildDataItem> }, data) => {
          data?.forEach(dataItem => {
            const { name, key, ...rest } = dataItem
            acc[name] = [
              ...(acc[name] ? acc[name] : []),
              { ...rest, parent: name, key: `${key}-${Math.random()}` },
            ]
          })
          return acc
        }, {}),
    [datasets]
  )

  if (!Object.keys(dataGrouppedByTitle).length) {
    return <NoData>No data</NoData>
  }

  const data = useMemo(() => {
    const groupedData = Object.keys(dataGrouppedByTitle)
      .filter(column => {
        if (!searchValue) {
          return true
        }

        const searchRegex = new RegExp(searchValue.split('').join('.*'))

        return searchRegex.test(column.toLowerCase())
      })
      .reduce((acc: Array<DataItem>, column) => {
        acc.push(
          {
            columnName: column,
            key: column,
            rowHeight: MIN_TABLE_ROW_HEIGHT,
          },
          ...dataGrouppedByTitle[column]
        )
        return acc
      }, [])

    if (isNormalizeChecked) {
      return transformNormalize(groupedData)
    }

    return groupedData
  }, [dataGrouppedByTitle, searchValue, isNormalizeChecked])

  const columnNames: Array<string> = useMemo(
    () => data.map(item => ('columnName' in item ? item.columnName : undefined)).filter(notEmpty),
    [data]
  )

  const [checkedLogRows, setCheckedLogRows] = useState<Array<string>>(
    logarithmicChecked ? columnNames : []
  )
  const [checkedAxesRows, setCheckedAxesRows] = useState<Array<string>>(
    axesChecked ? columnNames : []
  )
  const [checkedTableRows, setCheckedTableRows] = useState<Array<string>>(
    chartTableChecked ? columnNames : []
  )

  const setChartTableChecked = useCallback(
    (isChecked: boolean) => setCheckedTableRows(isChecked ? columnNames : []),
    [config]
  )

  const validVisibleColumns = useMemo(() => {
    const _columns = Object.keys(
      datasets
        .filter(dataItem => dataItem.columns)
        .map(dataItem => dataItem.columns)
        .flat()
        .reduce((acc, columns) => ({ ...acc, ...columns }), {})
    )

    return visibleColumns?.filter(column => _columns.includes(column))
  }, [visibleColumns, datasets])

  const maxColumnsNames = useMemo(
    () =>
      data.reduce((acc: { [key: string]: string }, row: any) => {
        Object.keys(row).forEach((columnName: string) => {
          if (
            (typeof row[columnName] === 'string' || typeof row[columnName] === 'number') &&
            (!acc[columnName] || getColumnNameLength(row, columnName) > acc[columnName]?.length)
          ) {
            acc[columnName] = String(row[columnName]) || String(columnName)
          }
        })

        return acc
      }, {}),
    [data]
  )

  const columns = useMemo(
    () => getColumns(data, !!isNormalizeChecked, validVisibleColumns, maxColumnsNames),
    [data, config, validVisibleColumns, isNormalizeChecked]
  )

  const _config = useMemo(
    () => ({
      smallSize,
      showChartTableSwitcher,
      setChartTableChecked,
      showLogarithmicSwitcher,
      setLogChecked: (isChecked: boolean) => setCheckedLogRows(isChecked ? columnNames : []),
      showAxesSwitcher,
      setAxesChecked: (isChecked: boolean) => setCheckedAxesRows(isChecked ? columnNames : []),
    }),
    [
      smallSize,
      setChartTableChecked,
      setCheckedAxesRows,
      setCheckedLogRows,
      columnNames,
      showChartTableSwitcher,
      showLogarithmicSwitcher,
      setCheckedLogRows,
      showAxesSwitcher,
      setCheckedAxesRows,
    ]
  )

  return (
    <ConfigContext.Provider value={_config}>
      <CheckedRowsContext.Provider
        value={{
          checkedLogRows,
          setCheckedLogRows,
          checkedAxesRows,
          setCheckedAxesRows,
          checkedTableRows,
          setCheckedTableRows,
          dataLength: columnNames.length,
        }}
      >
        <TableWrapper smallSize={!!smallSize}>
          {isVertical ? (
            <VerticalTable
              {...otherProps}
              data={data}
              columns={columns}
              currentPage={current}
              setCurrentPage={setCurrentPage}
              pageSize={pageSize}
              setPageSize={setPageSize}
              withoutPagination={pagination === false}
              pagination={pagination}
              displayNormalized={!!isNormalizeChecked}
              height={height}
            />
          ) : (
            <HorizontalTable
              {...otherProps}
              data={data}
              columns={columns}
              currentPage={current}
              setCurrentPage={setCurrentPage}
              pageSize={pageSize}
              setPageSize={setPageSize}
              withoutPagination={pagination === false}
              pagination={pagination}
              height={height}
              rowHeight={smallSize ? MIN_TABLE_ROW_HEIGHT : TABLE_ROW_HEIGHT}
            />
          )}
        </TableWrapper>
      </CheckedRowsContext.Provider>
    </ConfigContext.Provider>
  )
}

export default ProfilerTable
