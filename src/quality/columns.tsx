import React from 'react'
import Tooltip from 'antd/lib/tooltip'
import Badge from 'antd/lib/badge'

import { renderNumericValue } from '../helpers'
import { alignRight, defaultSort, getTextWidth } from './helpers'
import {
  ErrorWrapper,
  TooltipWrapper,
  TooltipRuleName,
  SampleHeaderTextWrapper,
  HeaderErrorsQuantity,
  Cell,
  DescriptionCell,
  SampleCellWrapper,
} from './styles'
import { Column, ColumnStatistic, Rule, TableCellData } from './model'
import { CELL_PADDING, CELL_SORTER_WIDTH, MAX_CELL_WIDTH } from './constants'

function renderRulesColumnsCell(
  text: string,
  item: { rule_name: string; description?: string | null; expression: string }
) {
  return (
    <Tooltip
      title={
        <TooltipWrapper>
          <TooltipRuleName>{item.rule_name}:</TooltipRuleName>
          <p>{item.expression}</p>
          {item.description ? <p>{item.description}</p> : null}
        </TooltipWrapper>
      }
    >
      {text}
    </Tooltip>
  )
}

function renderRulesDescriptionCell(
  text: string,
  item: { rule_name: string; description?: string | null; expression?: string }
) {
  return (
    <DescriptionCell>
      {item.description ? item.description : null}
      {item.description && item.expression ? <br /> : null}
      {item.expression ? item.expression : null}
    </DescriptionCell>
  )
}

export const getRulesColumns = (isNarrowMode: boolean, getRuleNameColumnSearchProps: Function) => {
  let columns = [
    {
      title: 'Rule Name',
      dataIndex: 'rule_name',
      sorter: defaultSort('rule_name'),
      ellipsis: true,
      width: isNarrowMode ? 150 : 250,
      render: renderRulesColumnsCell,
      ...getRuleNameColumnSearchProps(),
    },
    {
      title: 'Violations',
      dataIndex: 'violations',
      sorter: defaultSort('violations'),
      render: renderNumericValue(0),
      align: alignRight,
      ellipsis: true,
      width: 120,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      sorter: defaultSort('description'),
      render: renderRulesDescriptionCell,
      ellipsis: true,
      width: 350,
    },
  ]

  if (isNarrowMode) {
    return columns.filter(column => column.dataIndex !== 'description')
  }

  return columns
}

const renderValue = ({
  text,
  item,
  columnKey,
}: {
  text: string
  item: TableCellData
  columnKey: string
}) => {
  const {
    metaData: { violations, rules },
  } = item
  const rulesForColumn = rules?.filter(ruleData =>
    ruleData.referenced_column_names.includes(columnKey)
  )
  const failedRules = rulesForColumn?.filter(rule => violations.includes(rule.name))

  if (failedRules?.length === 0) {
    return (
      <ErrorWrapper>
        <Cell>{text}</Cell>
      </ErrorWrapper>
    )
  }

  return (
    <SampleCellWrapper title={text}>
      <Tooltip
        title={
          <div>
            {failedRules.map(rule => (
              <TooltipWrapper key={rule.name}>
                <TooltipRuleName>{rule.name}:</TooltipRuleName>
                <p>{rule.expression}</p>
              </TooltipWrapper>
            ))}
          </div>
        }
      >
        <ErrorWrapper hasError>
          <Cell>{text}</Cell>
        </ErrorWrapper>
      </Tooltip>
      {failedRules?.length > 1 && <Badge count={failedRules?.length} />}
    </SampleCellWrapper>
  )
}

const getColumnTitle = (
  columnStats: Array<ColumnStatistic>,
  dataIndex: string,
  columnName: string,
  rules?: Array<Rule>
) => {
  const errorsQuantity = columnStats?.find(stat => stat.column_name === dataIndex)?.violations
  const columnRule = rules?.find(rule => rule.referenced_column_names.includes(columnName))
  const tooltipTitle = () => (
    <>
      {errorsQuantity ? (
        <>
          <b>{columnName}</b>
          <br />
          <HeaderErrorsQuantity>
            ({renderNumericValue(0)(errorsQuantity)} errors)
          </HeaderErrorsQuantity>
        </>
      ) : (
        columnName
      )}

      <br />
      {columnRule?.name ? (
        <>
          <br />
          Rules: <br />
          {columnRule?.name}
        </>
      ) : null}
    </>
  )

  return (
    <Tooltip title={tooltipTitle}>
      <SampleHeaderTextWrapper>
        {errorsQuantity ? (
          <>
            {columnName}{' '}
            <HeaderErrorsQuantity>
              ({renderNumericValue(0)(errorsQuantity)} errors)
            </HeaderErrorsQuantity>
          </>
        ) : (
          columnName
        )}
      </SampleHeaderTextWrapper>
    </Tooltip>
  )
}

export const getColumnWidth = (name: string) => {
  const width = getTextWidth(name) + CELL_PADDING + CELL_SORTER_WIDTH
  return width > MAX_CELL_WIDTH ? MAX_CELL_WIDTH : width
}

const getColumnOption = (
  columnStats: Array<ColumnStatistic>,
  rules: Array<Rule>,
  maxColumnName: { [key: string]: string }
) => (column: Column) => {
  return {
    title: getColumnTitle(columnStats, column.name, column.name, rules),
    dataIndex: column.name,
    // Antd: Cannot ellipsis table header with sorters and filters for now.
    sorter: defaultSort(column.name),
    render: (text: string, item: TableCellData) =>
      renderValue({
        text,
        item,
        columnKey: column.name,
      }),
    ellipsis: true,
    width: getColumnWidth(
      maxColumnName[column.name]?.length < column.name?.length
        ? column.name
        : maxColumnName[column.name]
    ),
  }
}

export const getSampleColumns = (
  columns: Array<Column>,
  columnStats: Array<ColumnStatistic>,
  rules: Array<Rule>,
  maxColumnName: { [key: string]: string }
) => columns?.map(getColumnOption(columnStats, rules, maxColumnName))
