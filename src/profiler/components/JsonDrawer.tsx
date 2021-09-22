import React, { useEffect, useRef, useCallback, ChangeEvent, useState } from 'react'
import Drawer from 'antd/lib/drawer'
import Input from 'antd/lib/input'
import { BigJsonViewerDom } from 'big-json-viewer'
import debounce from 'lodash.debounce'

import 'antd/lib/drawer/style/css'
import 'big-json-viewer/styles/default.css'

import { SearchWrapper } from './styles'

import { JsonDrqwerProps } from '../model'

const { Search } = Input

const JsonDrawer = ({ visible, onClose, datasets }: JsonDrqwerProps): JSX.Element => {
  const jsonViewerRef = useRef<any>(null)
  const [searchValue, onSearch] = useState<string>('')

  const _onSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      event.persist()

      debounce(() => onSearch(event.target.value), 300)()
    },
    [onSearch]
  )

  useEffect(() => {
    const initJsonViewer = async () => {
      try {
        const viewer = await BigJsonViewerDom.fromObject(datasets, {
          linkLabelCopyPath: undefined,
        })
        const node = viewer.getRootElement()
        jsonViewerRef.current.appendChild(node)

        if (searchValue) {
          await viewer.openBySearch(new RegExp(searchValue, 'i'))
        }
      } catch (err) {
        console.error(err)
      }
    }

    if (visible) {
      // tslint:disable-next-line: no-floating-promises
      initJsonViewer()
    }

    return () => {
      jsonViewerRef.current.innerHTML = ''
    }
  }, [datasets, visible, searchValue])

  return (
    <Drawer
      placement="right"
      closable={false}
      onClose={onClose}
      visible={visible}
      getContainer={false}
      width="50%"
      style={{ position: 'absolute' }}
      destroyOnClose
    >
      <SearchWrapper>
        <Search placeholder="Search" allowClear onSearch={onSearch} onChange={_onSearchChange} />
      </SearchWrapper>
      <div ref={jsonViewerRef} />
      {/* <pre>{JSON.stringify(datasets, null, 2)}</pre> */}
    </Drawer>
  )
}

export default JsonDrawer
