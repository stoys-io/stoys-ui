import React, { useState, useCallback, useMemo, useRef } from 'react'
import Button from 'antd/lib/button'
import Space from 'antd/lib/space'
import Input from 'antd/lib/input'
import Table from 'antd/lib/table'
import SearchOutlined from '@ant-design/icons/SearchOutlined'
import { FilterDropdownProps } from 'antd/es/table/interface'

import 'antd/lib/table/style/css'
import 'antd/lib/button/style/css'
import 'antd/lib/input/style/css'

import RulesTableSwitchers from './RulesTableSwitchers'
import { TableTitleWrapper, TableTitle, RulesTableWrapper, RuleSearchIcon } from '../styles'
import { getRulesColumns } from '../columns'
import { RulesTableProps, RuleData } from '../model'
import {
  TABLE_HEIGHT,
  SMALL_TABLE_HEIGHT,
  DEFAULT_RULES_LENGTH,
  SMALL_RULES_LENGTH,
} from '../constants'

const RulesTable = ({
  rulesData,
  selectedRules,
  mode,
  setSelectRules,
  setMode,
  smallSize,
  tableProps,
}: RulesTableProps): JSX.Element => {
  const searchInput = useRef<Input>(null)
  const [isCheckedFailtureRules, setCheckedFailtureRules] = useState<boolean>(true)
  const _rulesData = useMemo(
    () => (isCheckedFailtureRules ? rulesData.filter(rule => rule.violations > 0) : rulesData),
    [rulesData, isCheckedFailtureRules]
  )

  const onSelectedRowKeysChange = useCallback(
    (_selectedRules: any) => {
      setSelectRules(_selectedRules)
    },
    [setSelectRules]
  )

  const selectRule = useCallback(
    (ruleData: RuleData) => {
      let updatedSelectedRows: Array<string>
      if (selectedRules.includes(ruleData.key)) {
        updatedSelectedRows = selectedRules.filter(key => key !== ruleData.key)
      } else {
        updatedSelectedRows = [...selectedRules, ruleData.key]
      }
      setSelectRules(updatedSelectedRows)
    },
    [selectedRules, setSelectRules]
  )

  const getScrollValue = useCallback(() => {
    if (mode === 'row') {
      return _rulesData?.length > DEFAULT_RULES_LENGTH ? TABLE_HEIGHT : undefined
    }
    return _rulesData?.length > SMALL_RULES_LENGTH ? SMALL_TABLE_HEIGHT : undefined
  }, [_rulesData])

  const handleSearch = useCallback((selectedKeys: React.Key[], confirm: () => void) => {
    confirm()
  }, [])

  const handleReset = useCallback((clearFilters?: () => void) => {
    if (clearFilters) {
      clearFilters()
    }
  }, [])

  const getRuleNameColumnSearchProps = useCallback(
    () => ({
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }: FilterDropdownProps) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={searchInput}
            placeholder={'Search Rule Name'}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm)}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
            data-testid="search-input"
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm)}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
              data-testid="search-btn"
            >
              Search
            </Button>
            <Button
              onClick={() => handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
              data-testid="reset-btn"
            >
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean) => (
        <RuleSearchIcon style={{ color: filtered ? '#000000' : '#035A8C' }} />
      ),
      onFilter: (value: string, record: { rule_name: string }) =>
        record.rule_name
          ? record.rule_name.toString().toLowerCase().includes(value.toLowerCase())
          : '',
      onFilterDropdownVisibleChange: (visible: boolean) => {
        if (visible) {
          setTimeout(() => searchInput && searchInput.current && searchInput.current.select(), 100)
        }
      },
    }),
    [handleSearch, handleReset]
  )

  const columns = useMemo(
    () => getRulesColumns(mode === 'row', getRuleNameColumnSearchProps),
    [getRuleNameColumnSearchProps, mode]
  )

  return (
    <RulesTableWrapper isNarrowMode={mode === 'row'} smallSize={smallSize}>
      <TableTitleWrapper>
        <TableTitle>Data Rules</TableTitle>
        <RulesTableSwitchers
          mode={mode}
          setMode={setMode}
          isCheckedFailtureRules={isCheckedFailtureRules}
          setCheckedFailtureRules={setCheckedFailtureRules}
        />
      </TableTitleWrapper>
      <Table
        columns={columns}
        dataSource={_rulesData}
        rowSelection={{
          selectedRowKeys: selectedRules,
          onChange: onSelectedRowKeysChange,
        }}
        onRow={(ruleData: any) => ({
          onClick: () => selectRule(ruleData),
        })}
        pagination={false}
        scroll={{
          y: getScrollValue(),
        }}
        {...tableProps}
        sticky
      />
    </RulesTableWrapper>
  )
}

export default RulesTable
