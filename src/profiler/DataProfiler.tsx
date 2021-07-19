import React, { useState, useMemo, useCallback, useEffect } from 'react'

import usePagination from '../hooks/usePagination'
import { getColumns } from './columns'
import { hydrateDataset } from './helpers'
import { COLORS } from './constants'
import { CheckedRowsContext } from './checkedRowsContext'
import { DataItem, DataProfilerProps, HydratedColumn, HydratedDataItem, Mode } from './model'

import VerticalTable from './components/VerticalTable'
import HorizontalTable from './components/HorizontalTable'
import TableSettings from './components/TableSettings'

import { NoData, TableWrapper } from './styles'

export const DataProfiler = ({
  datasets,
  colors,
  logarithmicScaleOptions,
  pagination,
  axisOptions,
  chartTableOptions,
  modeOptions,
  showAllCheckboxes,
  smallSize = true,
  searchOptions,
}: DataProfilerProps) => {
  const [isVertical, setIsVertical] = useState<boolean>(modeOptions?.type === Mode.Vertical)
  const [searchValue, setSearchValue] = useState<string>('')
  const { currentPage, setCurrentPage, pageSize, setPageSize } = usePagination(pagination)

  if (!datasets || !Array.isArray(datasets)) {
    return <NoData>No data</NoData>
  }

  useEffect(() => {
    setIsVertical(modeOptions?.type === Mode.Vertical)
  }, [modeOptions])

  const hydratedData = useMemo(
    () =>
      datasets
        .map((dataItem, index) => {
          if (!dataItem.columns) {
            return null
          }

          return hydrateDataset(dataItem, (colors && colors[index]) || COLORS[index])
        })
        .filter(dataItem => dataItem !== null),
    [datasets, colors]
  )

  if (!hydratedData.length) {
    return <NoData>No data</NoData>
  }

  const dataGrouppedByTitle = useMemo(
    () =>
      hydratedData.reduce((acc: { [key: string]: Array<HydratedDataItem> }, data) => {
        data?.forEach((dataItem: HydratedColumn) => {
          const { name, key, ...rest } = dataItem
          acc[name] = [
            ...(acc[name] ? acc[name] : []),
            { ...rest, parent: name, key: `${key}-${Math.random()}` },
          ]
        })
        return acc
      }, {}),
    [hydratedData]
  )

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

  const [checkedLogRows, setCheckedLogRows] = useState<Array<string>>(
    logarithmicScaleOptions?.isUsedByDefault ? columnNames : []
  )
  const [checkedAxisRows, setCheckedAxisRows] = useState<Array<string>>(
    axisOptions?.isUsedByDefault ? columnNames : []
  )
  const [checkedTableRows, setCheckedTableRows] = useState<Array<string>>(
    chartTableOptions?.isUsedByDefault ? columnNames : []
  )

  const tableOptions = useMemo(
    () => ({
      isCheckboxShown: showAllCheckboxes || !!chartTableOptions?.isCheckboxShown,
      setChecked: (isChecked: boolean) => setCheckedTableRows(isChecked ? columnNames : []),
      isUsedByDefault: !!chartTableOptions?.isUsedByDefault,
    }),
    [chartTableOptions, showAllCheckboxes]
  )

  const columns = useMemo(
    () =>
      getColumns(
        data,
        {
          isCheckboxShown: showAllCheckboxes || !!logarithmicScaleOptions?.isCheckboxShown,
          setChecked: (isChecked: boolean) => setCheckedLogRows(isChecked ? columnNames : []),
        },
        {
          isCheckboxShown: showAllCheckboxes || !!axisOptions?.isCheckboxShown,
          setChecked: (isChecked: boolean) => setCheckedAxisRows(isChecked ? columnNames : []),
        },
        tableOptions,
        smallSize
      ),
    [data, logarithmicScaleOptions, axisOptions, tableOptions, smallSize, showAllCheckboxes]
  )

  const _setIsVerticalView = useCallback(
    () =>
      setIsVertical(prevState => {
        if (modeOptions && modeOptions.onModeChange) {
          modeOptions.onModeChange(!prevState ? Mode.Vertical : Mode.Horizontal)
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
      {modeOptions?.isCheckboxShown || !searchOptions?.disabled ? (
        <TableSettings
          isModeSwitcherShown={modeOptions?.isCheckboxShown}
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
              isLogCheckboxShown: !!logarithmicScaleOptions?.isCheckboxShown,
              isAxisCheckboxShown: !!axisOptions?.isCheckboxShown,
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

DataProfiler.defaultProps = {
  logarithmicScaleOptions: {
    isCheckboxShown: false,
    isUsedByDefault: false,
  },
  axisOptions: {
    isCheckboxShown: false,
    isUsedByDefault: false,
  },
}
