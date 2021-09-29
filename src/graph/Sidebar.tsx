import React, { useMemo } from 'react'
import Radio from 'antd/lib/radio'
import Space from 'antd/lib/space'

import { SelectValue } from 'antd/lib/select'
import { Highlight, Badge } from './model'

import {
  SidebarWrapper,
  SidebarContentWrapper,
  MenuTitle,
  NodeSearch,
  SelectVersion,
} from './styles'

const Sidebar = ({
  drawerHeight,
  badge,
  onBadgeChange,

  searchError,
  searchValue,
  onSearchValueChange,
  onSearch,

  highlight,
  onHighlightChange,

  releases,
  onReleaseChange,
}: Props) => {
  const _releases = useMemo(
    () => releases?.map(release => ({ label: release, value: release })),
    [releases]
  )

  return (
    <SidebarWrapper drawerHeight={drawerHeight}>
      <SidebarContentWrapper>
        <NodeSearch
          error={searchError ? 'true' : ''}
          placeholder="Search node"
          allowClear
          value={searchValue}
          onChange={e => onSearchValueChange(e.target.value)}
          onSearch={onSearch}
        />

        {_releases && _releases.length ? (
          <>
            <MenuTitle>Select previous run:</MenuTitle>
            <SelectVersion
              placeholder="Previous Version"
              options={_releases}
              onChange={onReleaseChange}
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
            <Radio value={'nearest'}>Nearest</Radio>
            <Radio value={'parents'}>Upstream (parents)</Radio>
            <Radio value={'children'}>Downstream (children)</Radio>
          </Space>
        </Radio.Group>
      </SidebarContentWrapper>
    </SidebarWrapper>
  )
}

export default Sidebar

interface Props {
  drawerHeight: number
  badge: Badge
  onBadgeChange: (v: Badge) => void

  searchError: boolean
  searchValue: string
  onSearchValueChange: (v: string) => void
  onSearch: () => void

  highlight: Highlight
  onHighlightChange: (v: Highlight) => void

  releases?: Array<string>
  onReleaseChange: (value: SelectValue) => void
}
