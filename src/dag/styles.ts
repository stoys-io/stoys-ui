import styled from '@emotion/styled'
import { NODE_HEIGHT, NODE_WIDTH } from './constants'

export const NodeBody = styled.div`
  height: ${NODE_HEIGHT}px;
  width: ${NODE_WIDTH}px;
  border: 2px solid magenta;
  border-radius: 5px;

  display: flex;
  flex-direction: column;
  align-items: center;
`

export const NodeToolbar = styled.div`
  display: flex;
`

export const Wrap = styled.div`
  background: transparent;
  width: 300px;
  height: 200px;
  border: 2px dotted cyan;
`
