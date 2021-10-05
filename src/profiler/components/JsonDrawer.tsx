import React, { useEffect, useRef, useCallback, ChangeEvent, useState, MouseEvent } from 'react'
import Drawer from 'antd/lib/drawer'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'
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
  const [clicked, setClicked] = useState<number>(0)

  const _onSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      event.persist()

      debounce(() => onSearch(event.target.value), 300)()
    },
    [onSearch]
  )

  const onPrevBtnClick = useCallback(() => {
    setClicked(prev => prev - 1)
  }, [setClicked])

  const onNextBtnClick = useCallback(() => {
    setClicked(prev => prev + 1)
  }, [setClicked])

  useEffect(() => {
    const initJsonViewer = async () => {
      try {
        const viewer = await BigJsonViewerDom.fromObject(datasets, {
          linkLabelCopyPath: undefined,
        })
        const node = viewer.getRootElement()
        jsonViewerRef.current.appendChild(node)

        if (searchValue) {
          const cursor = await viewer.openBySearch(new RegExp(searchValue, 'i'))
          const matchesLength = cursor.matches.length

          if (clicked < 0) {
            setClicked(matchesLength - 1)
            await cursor.navigateTo(matchesLength - 1)
          } else if (clicked >= matchesLength) {
            setClicked(0)
            await cursor.navigateTo(0)
          } else {
            await cursor.navigateTo(clicked)
          }
        }
      } catch (err) {
        console.error(err)
      }
    }

    if (visible) {
      initJsonViewer().catch(err => console.error(err))
    }

    return () => {
      jsonViewerRef.current.innerHTML = ''
    }
  }, [datasets, visible, searchValue, clicked, setClicked])

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
        <Button id="prev-search" disabled={!searchValue} onClick={onPrevBtnClick}>
          Previous
        </Button>
        <Button id="next-search" disabled={!searchValue} onClick={onNextBtnClick}>
          Next
        </Button>
      </SearchWrapper>
      <div ref={jsonViewerRef} />
    </Drawer>
  )
}

export default JsonDrawer
