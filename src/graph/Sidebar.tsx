import React, { SetStateAction, Dispatch } from 'react'
import Radio, { RadioChangeEvent } from 'antd/lib/radio'
import Space from 'antd/lib/space'
import { Badge } from './model'
import { SidebarWrapper, MenuTitle, SearchInput } from './styles'

type SidebarProps = {
  badge: Badge
  changeBadge: Dispatch<SetStateAction<Badge>>
  searchNodeId: string
  setSearchNodeId: Dispatch<SetStateAction<string>>
  onSearchNode: (nodeId: string) => void
}

const Sidebar = ({
  badge,
  changeBadge,
  searchNodeId,
  setSearchNodeId,
  onSearchNode,
}: SidebarProps) => {
  const onChangeBadge = (e: RadioChangeEvent) => {
    changeBadge(e.target.value)
  }

  return (
    <SidebarWrapper>
      <SearchInput
        placeholder="Search node"
        value={searchNodeId}
        onChange={e => setSearchNodeId(e.target.value)}
        onPressEnter={event => {
          const element = event.target as HTMLInputElement
          element?.value && onSearchNode(element.value)
        }}
      />
      <MenuTitle>Badges:</MenuTitle>
      <Radio.Group onChange={onChangeBadge} value={badge}>
        <Space direction="vertical">
          <Radio value={'violations'}>Errors</Radio>
          <Radio value={'partitions'}>Partitions</Radio>
        </Space>
      </Radio.Group>
    </SidebarWrapper>
  )
}

export default Sidebar
