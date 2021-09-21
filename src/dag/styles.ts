import styled from '@emotion/styled'
import { NODE_HEIGHT, NODE_WIDTH } from './constants'

export const NodeBody = styled.div<{ highlight: boolean }>`
  height: ${NODE_HEIGHT}px;
  width: ${NODE_WIDTH}px;
  border: 2px solid ${props => (props.highlight ? 'green' : 'magenta')};
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

export const Container = styled.div`
  display: flex;
  justify-content: flex-start;
`

export const Content = styled.div`
  flex: 1;
`

export const Aside = styled.div`
  width: 230px;
  height: 100vh;
  background-color: lightgrey;
`

export const Radio = styled.div`
  display: flex;
  flex-direction: column;
`
