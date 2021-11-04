import React from 'react'
import Radio from 'antd/lib/radio'
import Space from 'antd/lib/space'

import SidebarSearch, { OnSearch } from './SidebarSearch'

import { SidebarWrapper, SidebarContentWrapper, MenuTitle, SelectVersion } from '../styles'
import { ChromaticScale } from '../model'
import {
  useGraphStore,
  useGraphDispatch,
  setBadge,
  setBaseRelease,
  setHighlightMode,
} from '../graph-store'

export const Sidebar = ({ onSearch, releases, chromaticScale }: Props) => {
  const dispatch = useGraphDispatch()

  const badge = useGraphStore(state => state.badge)
  const highlightMode = useGraphStore(state => state.highlightMode)

  return (
    <SidebarWrapper>
      <SidebarContentWrapper>
        <SidebarSearch onSearch={onSearch} />

        {releases && releases.length ? (
          <>
            <MenuTitle>Select previous run:</MenuTitle>
            <SelectVersion
              placeholder="Previous Version"
              options={releases}
              onChange={value => typeof value === 'string' && dispatch(setBaseRelease(value))}
              allowClear
            />
          </>
        ) : null}

        <MenuTitle>Badges:</MenuTitle>
        <Radio.Group onChange={e => dispatch(setBadge(e.target.value))} value={badge}>
          <Space direction="vertical">
            <Radio value={'violations'}>Errors</Radio>
            <Radio value={'partitions'}>Partitions</Radio>
          </Space>
        </Radio.Group>
        <MenuTitle>Highlight:</MenuTitle>
        <Radio.Group
          onChange={e => dispatch(setHighlightMode(e.target.value, chromaticScale))}
          value={highlightMode}
        >
          <Space direction="vertical">
            {highlightList.map(listItem => (
              <Radio key={listItem.key} value={listItem.value}>
                {listItem.label}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      </SidebarContentWrapper>
    </SidebarWrapper>
  )
}

interface Props {
  onSearch: OnSearch
  chromaticScale: ChromaticScale
  releases?: Array<{ label: string; value: string }>
}

const highlightList = [
  {
    key: 'none',
    value: 'none',
    label: 'None',
  },
  {
    key: 'nearest',
    value: 'nearest',
    label: 'Nearest',
  },
  {
    key: 'children',
    value: 'children',
    // Note: user's notion of children and parents is the opposite of what we use in data structures
    label: 'Upstream (parents)',
  },
  {
    key: 'parents',
    value: 'parents',
    // Note: user's notion of children and parents is the opposite of what we use in data structures
    label: 'Downstream (children)',
  },
  {
    key: 'diffing',
    value: 'diffing',
    label: 'Version diff',
  },
]
