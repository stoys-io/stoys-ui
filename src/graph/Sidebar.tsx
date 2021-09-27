import React from 'react'
import Radio from 'antd/lib/radio'
import Space from 'antd/lib/space'

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
}: Props) => (
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
      <MenuTitle>Select previous run:</MenuTitle>
      <SelectVersion
        placeholder="Previous Version"
        options={[
          { label: '20210422_150647_120', value: '20210422_150647_120' },
          { label: '20210522_150647_470', value: '20210522_150647_470' },
          { label: '20210621_150647_385', value: '20210621_150647_385' },
          { label: '20210721_150647_861', value: '20210721_150647_861' },
          { label: '20210820_150647_975', value: '20210820_150647_975' },
        ]}
      />
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
}
