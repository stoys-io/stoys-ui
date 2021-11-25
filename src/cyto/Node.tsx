import React from 'react'
import { ItemContent, ItemText, ItemExtra, ScrollCard, ScrollCardTitle } from '../graph/styles'
import List from 'antd/lib/list'

export const Node = () => {
  const list = ['a', 'b', 'c', 'a', 'b', 'c', 'a', 'b', 'c', 'a', 'b', 'c', 'a', 'b', 'c']
  return (
    <div className="nowheel">
      <ScrollCard
        title={<ScrollCardTitle color="red">Test</ScrollCardTitle>}
        size="small"
        type="inner"
        extra={0}
        highlightColor="green"
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
                      console.log('clack')
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
    </div>
  )
}
