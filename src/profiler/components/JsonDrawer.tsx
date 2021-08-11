import React, { ChangeEvent, useCallback, useState } from 'react'
import Drawer from 'antd/lib/drawer'
import Input from 'antd/lib/input'
import debounce from 'lodash.debounce'
import ReactJson from 'searchable-react-json-view'

import 'antd/lib/drawer/style/css'

import { JsonDrqwerProps } from '../model'

const { Search } = Input

const JsonDrawer = ({ visible, onClose, datasets }: JsonDrqwerProps): JSX.Element => {
  const [search, setSearch] = useState<string>()

  const _onSearch = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      event.persist()

      debounce(() => setSearch(event.target.value), 300)()
    },
    [setSearch]
  )

  return (
    <Drawer
      title={<Search placeholder="Search" allowClear onSearch={setSearch} onChange={_onSearch} />}
      placement="right"
      closable={false}
      onClose={onClose}
      visible={visible}
      getContainer={false}
      width="50%"
      style={{ position: 'absolute' }}
      destroyOnClose
    >
      <ReactJson
        src={datasets}
        iconStyle="square"
        displayObjectSize={false}
        displayDataTypes={false}
        highlightSearch={search}
      />
    </Drawer>
  )
}

export default JsonDrawer
