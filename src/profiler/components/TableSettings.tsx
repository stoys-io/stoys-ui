import React, { ChangeEvent, useCallback } from 'react'
import Input from 'antd/lib/input'
import debounce from 'lodash.debounce'

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
          />
        </div>
      ) : null}
      {isModeSwitcherShown ? (
        <ModeSwitcher checked={isModeSwitcherChecked} onChange={onModeChange} />
      ) : null}
    </TableSettingsWrapper>
  )
}

export default TableSettings
