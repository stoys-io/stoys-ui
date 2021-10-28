import styled from '@emotion/styled'
import Drawer from 'antd/lib/drawer'
import Select from 'antd/lib/select'
import Input from 'antd/lib/input'

const { Search } = Input

import Card from 'antd/lib/card'
import {
  HIGHLIGHT_COLOR,
  NODE_HEIGHT,
  NODE_WIDTH,
  RESIZE_AREA_HIGHT,
  GREY_LIGHT,
  GREY_ACCENT,
} from './constants'

export const Container = styled.div`
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

export const DrawerContainer = styled.div`
  .ant-drawer-content,
  .ant-drawer-content-wrapper {
    border-radius: ${RESIZE_AREA_HIGHT}px ${RESIZE_AREA_HIGHT}px 0 0;
  }

  .ant-drawer-top.ant-drawer-open,
  .ant-drawer-bottom.ant-drawer-open {
    height: unset;
  }
`

export const GraphContainer = styled.div`
  height: 100vh;
  width: 100%;
`

export const StyledDrawer = styled(Drawer)`
  .ant-drawer-body {
    padding: 0;
  }
`

export const DrawerNodeLabel = styled.div`
  font-weight: bold;
`

export const DrawerContent = styled.div`
  padding: ${RESIZE_AREA_HIGHT}px 16px 0 16px;
`

export const ResizeArea = styled.div`
  position: fixed;
  background: ${GREY_LIGHT};
  height: ${RESIZE_AREA_HIGHT}px;
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
