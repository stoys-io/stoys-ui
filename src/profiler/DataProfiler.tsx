import React, { useState, useMemo, useCallback, useEffect } from 'react'

import usePagination from '../hooks/usePagination'
import { getColumns } from './columns'
import { hydrateDataset } from './helpers'
import { COLORS } from './constants'
import { CheckedRowsContext } from './context'
import { DataItem, DataProfilerProps, ChildDataItem, Orient } from './model'

import VerticalTable from './components/VerticalTable'
import HorizontalTable from './components/HorizontalTable'
import TableSettings from './components/TableSettings'
import JsonDrawer from './components/JsonDrawer'

import { NoData, TableWrapper } from './styles'

export const DataProfiler = (props: DataProfilerProps) => {
  const {
    datasets,
    colors,
    rowToolbarOptions,
    pagination,
    profilerToolbarOptions,
    smallSize = true,
    visibleColumns,
  } = props
  const orientOptions = useMemo(
    () => (profilerToolbarOptions ? profilerToolbarOptions?.orientOptions : {}),
    [profilerToolbarOptions]
  )
  const jsonOptions = useMemo(
    () => (profilerToolbarOptions ? profilerToolbarOptions?.jsonOptions : {}),
    [profilerToolbarOptions]
  )
  const searchOptions = useMemo(
    () => (profilerToolbarOptions ? profilerToolbarOptions?.searchOptions : {}),
    [profilerToolbarOptions]
  )
  const [isVertical, setIsVertical] = useState<boolean>(orientOptions?.type === Orient.Vertical)
  const [isJsonShown, setJsonShown] = useState<boolean>(!!jsonOptions?.checked)
  const [searchValue, setSearchValue] = useState<string>('')
  const { current, setCurrentPage, pageSize, setPageSize } = usePagination(pagination)

  if (!datasets || !Array.isArray(datasets)) {
    return <NoData>No data</NoData>
  }

  useEffect(() => {
    setIsVertical(orientOptions?.type === Orient.Vertical)
  }, [orientOptions])

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

  const data = useMemo(
    () =>
      Object.keys(dataGrouppedByTitle)
        .filter(column => {
          const searchRegex = new RegExp(searchValue.split('').join('.*'))

          return searchRegex.test(column.toLowerCase())
        })
        .reduce((acc: Array<DataItem>, column) => {
          acc.push({
            columnName: column,
            key: column,
            children: [...dataGrouppedByTitle[column]],
          })
          return acc
        }, []),
    [dataGrouppedByTitle, searchValue]
  )

  const columnNames = useMemo(() => data.map(item => item.columnName), [data])

  const _rowToolbarOptions = useMemo(() => {
    if (
      (typeof rowToolbarOptions === 'boolean' && rowToolbarOptions) ||
      rowToolbarOptions === undefined ||
      rowToolbarOptions === null
    ) {
      return {
        logarithmicScaleOptions: {
          isCheckboxShown: true,
        },
        axesOptions: {
          isCheckboxShown: true,
        },
        chartTableOptions: {
          isCheckboxShown: true,
        },
      }
    }
    if (typeof rowToolbarOptions === 'boolean' && !rowToolbarOptions) {
      return {
        logarithmicScaleOptions: {
          isCheckboxShown: false,
        },
        axesOptions: {
          isCheckboxShown: false,
        },
        chartTableOptions: {
          isCheckboxShown: false,
        },
      }
    }

    return rowToolbarOptions
  }, [rowToolbarOptions])

  const [checkedLogRows, setCheckedLogRows] = useState<Array<string>>(
    _rowToolbarOptions.logarithmicScaleOptions?.isUsedByDefault ? columnNames : []
  )
  const [checkedAxesRows, setCheckedAxesRows] = useState<Array<string>>(
    _rowToolbarOptions.axesOptions?.isUsedByDefault ? columnNames : []
  )
  const [checkedTableRows, setCheckedTableRows] = useState<Array<string>>(
    _rowToolbarOptions.chartTableOptions?.isUsedByDefault ? columnNames : []
  )

  const tableOptions = useMemo(
    () => ({
      isCheckboxShown: !!_rowToolbarOptions.chartTableOptions?.isCheckboxShown,
      setChecked: (isChecked: boolean) => setCheckedTableRows(isChecked ? columnNames : []),
      isUsedByDefault: !!_rowToolbarOptions.chartTableOptions?.isUsedByDefault,
    }),
    [_rowToolbarOptions]
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

  const columns = useMemo(
    () =>
      getColumns(
        data,
        {
          isCheckboxShown: !!_rowToolbarOptions.logarithmicScaleOptions?.isCheckboxShown,
          setChecked: (isChecked: boolean) => setCheckedLogRows(isChecked ? columnNames : []),
        },
        {
          isCheckboxShown: !!_rowToolbarOptions.axesOptions?.isCheckboxShown,
          setChecked: (isChecked: boolean) => setCheckedAxesRows(isChecked ? columnNames : []),
        },
        tableOptions,
        smallSize,
        validVisibleColumns
      ),
    [data, tableOptions, smallSize, _rowToolbarOptions, validVisibleColumns]
  )

  const _setIsVerticalView = useCallback(
    () =>
      setIsVertical((prevState: boolean) => {
        orientOptions?.onOrientChange?.(!prevState ? Orient.Vertical : Orient.Horizontal)

        return !prevState
      }),
    []
  )

  const _onSearch = useCallback(
    (value: string) => {
      searchOptions?.onChange?.(value)
      setSearchValue(value)
    },
    [searchOptions]
  )

  const _setJsonShown = useCallback(() => {
    setJsonShown((prevState: boolean) => {
      jsonOptions?.onChange?.(!prevState)

      return !prevState
    })
  }, [jsonOptions])

  return (
    <CheckedRowsContext.Provider
      value={{
        checkedLogRows,
        setCheckedLogRows,
        checkedAxesRows,
        setCheckedAxesRows,
        checkedTableRows,
        setCheckedTableRows,
        dataLength: data.length,
      }}
    >
      {orientOptions?.isCheckboxShown || !searchOptions?.disabled ? (
        <TableSettings
          isModeSwitcherShown={orientOptions?.isCheckboxShown}
          isModeSwitcherChecked={isVertical}
          onModeChange={_setIsVerticalView}
          isSearchShown={!searchOptions?.disabled}
          onSearchChangeHandler={_onSearch}
          isJsonSwitcherShown={jsonOptions?.isCheckboxShown}
          isJsonSwitcherChecked={isJsonShown}
          onJsonChange={_setJsonShown}
        />
      ) : null}
      <TableWrapper smallSize={!!smallSize}>
        {isVertical ? (
          <VerticalTable
            {...props}
            data={data}
            columns={columns}
            currentPage={current}
            setCurrentPage={setCurrentPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
            withoutPagination={pagination === false}
            pagination={pagination}
            rowOptions={{
              isLogCheckboxShown: !!_rowToolbarOptions.logarithmicScaleOptions?.isCheckboxShown,
              isAxesCheckboxShown: !!_rowToolbarOptions.axesOptions?.isCheckboxShown,
            }}
            tableOptions={tableOptions}
          />
        ) : (
          <HorizontalTable
            {...props}
            data={data}
            columns={columns}
            currentPage={current}
            setCurrentPage={setCurrentPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
            withoutPagination={pagination === false}
            pagination={pagination}
          />
        )}
        <JsonDrawer visible={isJsonShown} onClose={_setJsonShown} datasets={datasets} />
      </TableWrapper>
    </CheckedRowsContext.Provider>
  )
}
