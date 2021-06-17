import React, { useMemo, useState, useEffect, useCallback } from 'react'

import usePagination from '../hooks/usePagination'
import { getSampleColumns } from './columns'
import { TablesWrapper } from './styles'
import RulesTable from './components/RulesTable'
import SampleTable from './components/SampleTable'

import { QualityProps, Mode } from './model'

export const Quality = ({
  data,
  selectedRules,
  onSelectedRulesChange,
  mode = 'row',
  onModeChange,
  pagination,
  heightenedCell,
  smallSize = true,
}: QualityProps): JSX.Element => {
  const [_mode, _setMode] = useState<Mode>(mode)
  const [_selectedRules, _setSelectedRules] = useState<Array<string>>(selectedRules || [])
  const { currentPage, setCurrentPage, pageSize, setPageSize } = usePagination(pagination)
  const { columns, rules, row_sample, statistics } = data

  useEffect(() => {
    _setMode(mode)
  }, [mode])

  useEffect(() => {
    _setSelectedRules(selectedRules || [])
  }, [selectedRules])

  const rulesData = useMemo(
    () =>
      statistics?.rule.map(rule => {
        const ruleMetaData = rules?.find(dqRule => dqRule.name === rule.rule_name)

        return {
          ...rule,
          failureRatio: rule.violations / statistics?.table?.rows || 0,
          expression: ruleMetaData?.expression,
          description: ruleMetaData?.description,
          key: rule.rule_name,
        }
      }),
    [data]
  )

  const sampleData = useMemo(
    () =>
      row_sample?.map(rowSample => {
        const row = columns?.reduce((acc: { [key: string]: string }, column, idx) => {
          acc[column.name] = rowSample.row[idx]

          return acc
        }, {})

        return {
          ...row,
          metaData: {
            violations: rowSample.violated_rule_names,
            rules: rules || [],
          },
        }
      }),
    [data]
  )

  const longestColumnsNames = useMemo(
    () =>
      sampleData.reduce((acc: { [key: string]: string }, row: any) => {
        Object.keys(row).forEach((columnName: string) => {
          if (
            !acc[columnName] ||
            (row[columnName] && row[columnName].length > acc[columnName].length)
          ) {
            acc[columnName] = row[columnName] || ''
          }
        })
        return acc
      }, {}),
    [sampleData]
  )

  const filteredSampleData = useMemo(() => {
    if (!_selectedRules || _selectedRules.length === 0) {
      return sampleData
    }

    return sampleData?.filter(dataItem => {
      return !!dataItem.metaData.violations.find(violation => _selectedRules.includes(violation))
    })
  }, [sampleData, _selectedRules])

  const setMode = useCallback(
    newMode => {
      _setMode(newMode)

      if (onModeChange) {
        onModeChange(newMode)
      }
    },
    [onModeChange]
  )

  const setSelectedRules = useCallback(
    rules => {
      _setSelectedRules(rules)

      if (onSelectedRulesChange) {
        onSelectedRulesChange(rules)
      }
    },
    [onSelectedRulesChange]
  )

  const sampleColumns = useMemo(
    () => getSampleColumns(columns, statistics?.column, rules, longestColumnsNames),
    [data]
  )

  return (
    <TablesWrapper mode={_mode} className="data-quality-checks">
      <RulesTable
        rulesData={rulesData}
        selectedRules={_selectedRules}
        mode={_mode}
        setSelectRules={setSelectedRules}
        setMode={setMode}
        smallSize={!!smallSize}
      />
      <SampleTable
        sampleData={filteredSampleData}
        sampleColumns={sampleColumns}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        withoutPagination={!!pagination?.disabled}
        heightenedCell={heightenedCell}
        smallSize={!!smallSize}
      />
    </TablesWrapper>
  )
}
