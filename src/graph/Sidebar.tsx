import React, { SetStateAction, Dispatch } from 'react'
import Radio, { RadioChangeEvent } from 'antd/lib/radio'
import Space from 'antd/lib/space'
import { Badge } from './model'
import { SidebarWrapper } from './styles'

type SidebarProps = {
  badge: Badge
  changeBadge: Dispatch<SetStateAction<Badge>>
}

const Sidebar = ({ badge, changeBadge }: SidebarProps) => {
  const onChangeBadge = (e: RadioChangeEvent) => {
    changeBadge(e.target.value)
  }

  return (
    <SidebarWrapper>
      <p>Badges:</p>
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
