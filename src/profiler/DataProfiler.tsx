import React, { useState, useMemo, useCallback, useEffect } from 'react'

import usePagination from '../hooks/usePagination'
import { getColumns } from './columns'
import { hydrateDataset } from './helpers'
import { COLORS } from './constants'
import { CheckedRowsContext } from './checkedRowsContext'
import { DataItem, DataProfilerProps, ChildDataItem, Orient } from './model'

import VerticalTable from './components/VerticalTable'
import HorizontalTable from './components/HorizontalTable'
import TableSettings from './components/TableSettings'

import { NoData, TableWrapper } from './styles'

export const DataProfiler = ({
  datasets,
  colors,
  toolbarOptions,
  pagination,
  orientOptions,
  smallSize = true,
  searchOptions,
}: DataProfilerProps) => {
  const [isVertical, setIsVertical] = useState<boolean>(orientOptions?.type === Orient.Vertical)
  const [searchValue, setSearchValue] = useState<string>('')
  const { currentPage, setCurrentPage, pageSize, setPageSize } = usePagination(pagination)

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

  const _toolbarOptions = useMemo(() => {
    if (
      (typeof toolbarOptions === 'boolean' && toolbarOptions) ||
      toolbarOptions === undefined ||
      toolbarOptions === null
    ) {
      return {
        logarithmicScaleOptions: {
          isCheckboxShown: true,
        },
        axisOptions: {
          isCheckboxShown: true,
        },
        chartTableOptions: {
          isCheckboxShown: true,
        },
      }
    }
    if (typeof toolbarOptions === 'boolean' && !toolbarOptions) {
      return {
        logarithmicScaleOptions: {
          isCheckboxShown: false,
        },
        axisOptions: {
          isCheckboxShown: false,
        },
        chartTableOptions: {
          isCheckboxShown: false,
        },
      }
    }

    return toolbarOptions
  }, [toolbarOptions])

  const [checkedLogRows, setCheckedLogRows] = useState<Array<string>>(
    _toolbarOptions.logarithmicScaleOptions?.isUsedByDefault ? columnNames : []
  )
  const [checkedAxisRows, setCheckedAxisRows] = useState<Array<string>>(
    _toolbarOptions.axisOptions?.isUsedByDefault ? columnNames : []
  )
  const [checkedTableRows, setCheckedTableRows] = useState<Array<string>>(
    _toolbarOptions.chartTableOptions?.isUsedByDefault ? columnNames : []
  )

  const tableOptions = useMemo(
    () => ({
      isCheckboxShown: !!_toolbarOptions.chartTableOptions?.isCheckboxShown,
      setChecked: (isChecked: boolean) => setCheckedTableRows(isChecked ? columnNames : []),
      isUsedByDefault: !!_toolbarOptions.chartTableOptions?.isUsedByDefault,
    }),
    [_toolbarOptions]
  )

  const columns = useMemo(
    () =>
      getColumns(
        data,
        {
          isCheckboxShown: !!_toolbarOptions.logarithmicScaleOptions?.isCheckboxShown,
          setChecked: (isChecked: boolean) => setCheckedLogRows(isChecked ? columnNames : []),
        },
        {
          isCheckboxShown: !!_toolbarOptions.axisOptions?.isCheckboxShown,
          setChecked: (isChecked: boolean) => setCheckedAxisRows(isChecked ? columnNames : []),
        },
        tableOptions,
        smallSize
      ),
    [data, tableOptions, smallSize, _toolbarOptions]
  )

  const _setIsVerticalView = useCallback(
    () =>
      setIsVertical((prevState: boolean) => {
        if (orientOptions && orientOptions.onModeChange) {
          orientOptions.onModeChange(!prevState ? Orient.Vertical : Orient.Horizontal)
        }

        return !prevState
      }),
    []
  )

  const _onSearch = useCallback(
    (value: string) => {
      searchOptions?.onChangeHandler?.(value)
      setSearchValue(value)
    },
    [searchOptions]
  )

  return (
    <CheckedRowsContext.Provider
      value={{
        checkedLogRows,
        setCheckedLogRows,
        checkedAxisRows,
        setCheckedAxisRows,
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
        />
      ) : null}
      <TableWrapper smallSize={!!smallSize}>
        {isVertical ? (
          <VerticalTable
            data={data}
            columns={columns}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
            withoutPagination={!!pagination?.disabled}
            rowOptions={{
              isLogCheckboxShown: !!_toolbarOptions.logarithmicScaleOptions?.isCheckboxShown,
              isAxisCheckboxShown: !!_toolbarOptions.axisOptions?.isCheckboxShown,
            }}
            tableOptions={tableOptions}
          />
        ) : (
          <HorizontalTable
            data={data}
            columns={columns}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
            withoutPagination={!!pagination?.disabled}
          />
        )}
      </TableWrapper>
    </CheckedRowsContext.Provider>
  )
}
