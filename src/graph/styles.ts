import styled from '@emotion/styled'
import Select from 'antd/lib/select'
import Input from 'antd/lib/input'

const { Search } = Input

import Card from 'antd/lib/card'
import {
  HIGHLIGHT_COLOR,
  NODE_HEIGHT,
  NODE_WIDTH,
  RESIZE_AREA_HEIGHT,
  GREY_LIGHT,
  GREY_ACCENT,
} from './constants'

export const Container = styled.div`
  position: relative;
  display: flex;
  height: 100%;
  overflow: hidden;
`

export const SidebarWrapper = styled.div`
  height: 100vh;
  width: 250px;
  background-color: ${GREY_LIGHT};
  overflow-y: auto;
`

export const SidebarContentWrapper = styled.div`
  padding: 20px 10px 10px 10px;
  background-color: ${GREY_LIGHT};
  z-index: 3;
`

export const GraphContainer = styled.div`
  height: 100vh;
  width: 100%;
`

export const DrawerNodeLabel = styled.div`
  font-weight: bold;
`

export const ResizeArea = styled.div`
  background: #e2e2e2;
  height: ${RESIZE_AREA_HEIGHT}px;
  width: 100%;
  cursor: ns-resize;
  z-index: 10;

  display: flex;
  justify-content: center;
  align-items: center;

  &::before {
    content: ' ';
    width: 85px;
    height: 3px;
    border-radius: 3px;
    background: ${GREY_ACCENT};
    z-index: 12;
  }
`

export const MenuTitle = styled.h4`
  margin-top: 20px;
`

export const SelectVersion = styled(Select)`
  width: 100%;
`

export const NodeSearch = styled(Search)<{ error: string }>`
  .ant-input-search-button,
  .ant-input-affix-wrapper,
  .ant-input-affix-wrapper:hover {
    border-color: ${props => (props.error ? 'red' : '')};
  }
`

export const ScrollCard = styled(Card, {
  // do not pass highlight prop down to the Card
  shouldForwardProp: prop => prop !== 'highlightColor',
})<{ highlightColor: string }>`
  width: ${NODE_WIDTH}px;
  height: ${NODE_HEIGHT}px;
  border: 2px solid ${props => props.highlightColor};
  border-radius: 3px;
  cursor: pointer;

  // enables scroll
  display: flex;
  flex-direction: column;

  .ant-card-head:hover {
    color: ${HIGHLIGHT_COLOR};
  }

  .ant-card-body {
    flex: 1;
    overflow-y: scroll;

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

export const ScrollCardTitle = styled.div<{ color: string }>`
  color: ${props => props.color};
`

export const ItemText = styled.div<{ color: string; hoverable: boolean }>`
  color: ${props => props.color};
  &:hover {
    color: ${props => (props.hoverable ? HIGHLIGHT_COLOR : props.color)};
  }
}
`
