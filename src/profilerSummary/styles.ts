import styled from '@emotion/styled'

export const ProfilerSummaryWrapper = styled.div<{ height: string }>`
  height: ${props => (props.height ? props.height : 'inherit')};
  padding: 2px;
  overflow: auto;
`

export const ProfilerSummaryTitle = styled.h1`
  font-size: 0.9em;
  line-height: 1;
  margin-bottom: 0;
`

export const ProfilerSummaryType = styled.span`
  font-size: 0.75em;
  font-weight: 300;
  font-style: italic;
`

export const ProfilerSummaryItems = styled.ul`
  font-size: 0.8em;
  margin: 0;
  padding: 0;
  list-style: none;
`
