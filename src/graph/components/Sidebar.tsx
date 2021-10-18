import React from 'react'
import Radio from 'antd/lib/radio'
import Space from 'antd/lib/space'
import { SelectValue } from 'antd/lib/select'

import SidebarSearch, { OnSearch } from './SidebarSearch'

import { SidebarWrapper, SidebarContentWrapper, MenuTitle, SelectVersion } from '../styles'
import { Highlight, Badge } from '../model'

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

const Sidebar = ({
  badge,
  onBadgeChange,

  onSearch,

  highlight,
  onHighlightChange,

  releases,
  onReleaseChange,
}: Props) => {
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
        <Radio.Group onChange={e => onBadgeChange(e.target.value)} value={badge}>
          <Space direction="vertical">
            <Radio value={'violations'}>Errors</Radio>
            <Radio value={'partitions'}>Partitions</Radio>
          </Space>
        </Radio.Group>
        <MenuTitle>Highlight:</MenuTitle>
        <Radio.Group onChange={e => onHighlightChange(e.target.value)} value={highlight}>
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
  badge: Badge
  onBadgeChange: (val: Badge) => void

  onSearch: OnSearch

  highlight: Highlight
  onHighlightChange: (val: Highlight) => void

  releases?: Array<{ label: string; value: string }>
  onReleaseChange: (val: SelectValue) => void
}
