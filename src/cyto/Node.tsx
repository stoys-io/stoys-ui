import React from 'react'
import { ItemContent, ItemText, ItemExtra, ScrollCard, ScrollCardTitle } from '../graph/styles'
import List from 'antd/lib/list'

export const Node = ({ onClick }: Props) => {
  const list = ['a', 'b', 'c', 'a', 'b', 'c', 'a', 'b', 'c', 'a', 'b', 'c', 'a', 'b', 'c']
  return (
    <ScrollCard
      title={<ScrollCardTitle color="red">Test</ScrollCardTitle>}
      size="small"
      type="inner"
      extra={0}
      highlightColor="green"
      onClick={onClick}
    >
      <List
        size="small"
        dataSource={list}
        renderItem={(listItem: string) => {
          return (
            <List.Item>
              <ItemContent title={listItem}>
                <ItemText
                  hoverable={true}
                  color="magenta"
                  onClick={(evt: React.MouseEvent<HTMLElement>) => {
                    evt.stopPropagation()
                  }}
                >
                  {listItem}
                </ItemText>
                <ItemExtra>{listItem}</ItemExtra>
              </ItemContent>
            </List.Item>
          )
        }}
      />
    </ScrollCard>
  )
}

interface Props {
  onClick: React.MouseEventHandler
}
