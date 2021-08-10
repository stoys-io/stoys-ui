import React, { ChangeEvent, useCallback } from 'react'
import Input from 'antd/lib/input'
import debounce from 'lodash.debounce'

import JsonSwitcher from './JsonSwitcher'
import { TableSettingsWrapper } from '../styles'
import ModeSwitcher from './ModeSwitcher'
import { TableSettingsProps } from '../model'

const { Search } = Input

const TableSettings = ({
  isModeSwitcherShown,
  isModeSwitcherChecked,
  onModeChange,
  isSearchShown,
  onSearchChangeHandler,
  isJsonSwitcherShown,
  isJsonSwitcherChecked,
  onJsonChange,
}: TableSettingsProps): JSX.Element => {
  const _onSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      event.persist()

      debounce(() => onSearchChangeHandler(event.target.value), 300)()
    },
    [onSearchChangeHandler]
  )

  return (
    <TableSettingsWrapper>
      {isSearchShown ? (
        <div className="search-wrapper">
          <Search
            placeholder="Search column name"
            allowClear
            onSearch={onSearchChangeHandler}
            onChange={_onSearchChange}
            data-testid="table-search"
          />
        </div>
      ) : null}
      {isModeSwitcherShown ? (
        <ModeSwitcher checked={isModeSwitcherChecked} onChange={onModeChange} />
      ) : null}
      {isJsonSwitcherShown ? (
        <JsonSwitcher checked={isJsonSwitcherChecked} onChange={onJsonChange} />
      ) : null}
    </TableSettingsWrapper>
  )
}

export default TableSettings
