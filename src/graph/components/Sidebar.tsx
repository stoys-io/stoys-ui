import React from 'react'
import Radio from 'antd/lib/radio'
import Space from 'antd/lib/space'
import { SelectValue } from 'antd/lib/select'

import SidebarSearch, { OnSearch } from './SidebarSearch'

import { SidebarWrapper, SidebarContentWrapper, MenuTitle, SelectVersion } from '../styles'
import { Badge } from '../model'
import { useGraphStore } from '../graph-store'

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
    label: 'Upstream (children)',
  },
  {
    key: 'parents',
    value: 'parents',
    label: 'Downstream (parents)',
  },
  {
    key: 'diffing',
    value: 'diffing',
    label: 'Version diff',
  },
]

const Sidebar = ({ onSearch, releases, onReleaseChange }: Props) => {
  const highlightMode = useGraphStore(state => state.highlightMode)
  const setHighlightMode = useGraphStore(state => state.setHighlightMode)

  const badge = useGraphStore(state => state.badge)
  const setBadge = useGraphStore(state => state.setBadge)

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
              onChange={onReleaseChange}
              allowClear
            />
          </>
        ) : null}

        <MenuTitle>Badges:</MenuTitle>
        <Radio.Group onChange={e => setBadge(e.target.value)} value={badge}>
          <Space direction="vertical">
            <Radio value={'violations'}>Errors</Radio>
            <Radio value={'partitions'}>Partitions</Radio>
          </Space>
        </Radio.Group>
        <MenuTitle>Highlight:</MenuTitle>
        <Radio.Group onChange={e => setHighlightMode(e.target.value)} value={highlightMode}>
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

export default Sidebar

interface Props {
  onSearch: OnSearch

  releases?: Array<{ label: string; value: string }>
  onReleaseChange: (val: SelectValue) => void
}
