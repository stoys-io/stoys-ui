import React from 'react'
import Card from 'antd/lib/card'
import List from 'antd/lib/list'
import { NODE_WIDTH, HIGHLIGHT_COLOR, GREY_ACCENT } from '../graph-common/constants'

const TableListNode = ({ label = 'covid_data', tableList = defaultList }: Props) => {
  return (
    <StyledCard title={<div>{label}</div>} size="small" type="inner">
      <List
        size="small"
        dataSource={tableList}
        renderItem={listItem => {
          return (
            <List.Item>
              <div
                style={{ width: '100%' }}
                onClick={(evt: React.MouseEvent<HTMLElement>) => {
                  evt.stopPropagation()
                }}
              >
                {listItem}
              </div>
            </List.Item>
          )
        }}
      />
    </StyledCard>
  )
}

export default TableListNode
export interface Props {
  label: string
  tableList: string[]
}

const defaultList = ['locations_csv', 'covid_stats', 'locations2_csv']

import styled from '@emotion/styled'
export const StyledCard = styled(Card)`
  width: ${NODE_WIDTH}px;

  border: 2px solid ${GREY_ACCENT};
  border-radius: 3px;

  cursor: pointer;

  .ant-card-head:hover {
    color: ${HIGHLIGHT_COLOR};
  }

  .ant-card-body {
    flex: 1;
    padding: 0 12px; // this is to fit the list
  }

  .ant-list-item {
    padding: 0;
  }

  .ant-list-empty-text {
    padding-top: 0px;
    padding-bottom: 0px;

    .ant-empty-normal {
      margin: 4px 0px;
    }
  }
`
