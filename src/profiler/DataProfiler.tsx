import React, { useState, useMemo, useCallback, useEffect } from 'react'

import { usePagination } from '../hooks'
import { getColumns } from './columns'
import { hydrateDataset } from './helpers'
import {
  COLORS,
  MIN_TABLE_ROW_HEIGHT,
  NORMALIZABLE_COLUMN_PREFIX,
  TABLE_ROW_HEIGHT,
} from './constants'
import { CheckedRowsContext, ConfigContext } from './context'
import { DataItem, DataProfilerProps, ChildDataItem, Orient, CountColumnKey } from './model'

import VerticalTable from './components/VerticalTable'
import HorizontalTable from './components/HorizontalTable'
import TableSettings from './components/TableSettings'
import JsonDrawer from './components/JsonDrawer'

import { NoData, TableWrapper } from './styles'
import { getColumnNameLength } from '../aggSum/helpers'

export const DataProfiler = (props: DataProfilerProps) => {
  const { datasets, config = {}, ...otherProps } = props
  const {
    smallSize,
    colors,
    visibleColumns,
    showProfilerToolbar = true,
    showOrientSwitcher = true,
    orientType,
    onOrientChange,
    showJsonSwitcher = true,
    jsonChecked,
    onJsonChange,
    showNormalizeSwitcher = true,
    normalizeChecked,
    showSearch = true,
    onSearchChange,
    showLogarithmicSwitcher,
    logarithmicChecked,
    showAxesSwitcher,
    axesChecked,
    showChartTableSwitcher,
    chartTableChecked,
    pagination,
    height,
    isMenuShowed,
  } = config

  const [isVertical, setIsVertical] = useState<boolean>(orientType === Orient.Vertical)
  const [isJsonShown, setJsonShown] = useState<boolean>(!!jsonChecked)
  const [searchValue, setSearchValue] = useState<string>('')
  const [_showProfilerToolbar, _setShowProfilerToolbar] = useState<boolean>(showProfilerToolbar)

  const [isNormalizeChecked, setIsNormalizeChecked] = useState<boolean>(!!normalizeChecked)
  const _normalizeChange = () => setIsNormalizeChecked(!isNormalizeChecked)

  const { current, setCurrentPage, pageSize, setPageSize } = usePagination(pagination)

  if (!datasets || !Array.isArray(datasets)) {
    return <NoData>No data</NoData>
  }

  useEffect(() => {
    setIsVertical(orientType === Orient.Vertical)
  }, [config])

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
    () => getColumns(data, isNormalizeChecked, validVisibleColumns, maxColumnsNames),
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
      isMenuShowed,
      activeMenu: _showProfilerToolbar,
      setIsMenuShowed: (isChecked: boolean) => _setShowProfilerToolbar(isChecked),
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
      isMenuShowed,
      _showProfilerToolbar,
    ]
  )

  const _setIsVerticalView = useCallback(
    () =>
      setIsVertical((prevState: boolean) => {
        onOrientChange?.(!prevState ? Orient.Vertical : Orient.Horizontal)

        return !prevState
      }),
    []
  )

  const _onSearch = useCallback(
    (value: string) => {
      onSearchChange?.(value)
      setSearchValue(value)
    },
    [config]
  )

  const _setJsonShown = useCallback(() => {
    setJsonShown((prevState: boolean) => {
      onJsonChange?.(!prevState)

      return !prevState
    })
  }, [config])

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
        {_showProfilerToolbar || (isVertical && showProfilerToolbar) ? (
          <TableSettings
            isModeSwitcherShown={showOrientSwitcher}
            isModeSwitcherChecked={isVertical}
            onModeChange={_setIsVerticalView}
            isSearchShown={!!showSearch}
            onSearchChangeHandler={_onSearch}
            isJsonSwitcherShown={showJsonSwitcher}
            isJsonSwitcherChecked={isJsonShown}
            onJsonChange={_setJsonShown}
            isNormalizeSwitcherShown={showNormalizeSwitcher}
            isNormalizeSwitcherChecked={isNormalizeChecked}
            onNormalizeChange={_normalizeChange}
          />
        ) : null}
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
              displayNormalized={isNormalizeChecked}
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
          {isJsonShown ? (
            <JsonDrawer visible={isJsonShown} onClose={_setJsonShown} datasets={datasets} />
          ) : null}
        </TableWrapper>
      </CheckedRowsContext.Provider>
    </ConfigContext.Provider>
  )
}

const transformNormalize = (data: Array<DataItem>) =>
  data.map(item => {
    if ('count' in item) {
      const { count } = item
      const countColumns = Object.keys(item).filter(column =>
        column.startsWith(NORMALIZABLE_COLUMN_PREFIX)
      )
      const normalizedCountValues = countColumns.reduce((acc, key) => {
        const columnValue = item[key as CountColumnKey]
        const normalizedValue = columnValue === null ? null : columnValue / count

        return { ...acc, [key]: normalizedValue }
      }, {})

      return {
        ...item,
        ...normalizedCountValues,
      }
    }

    return item
  })

function notEmpty<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}
