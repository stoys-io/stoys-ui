import styled from '@emotion/styled'
import Button from 'antd/lib/button'

export const ThresholdContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const ThresholdEditButton = styled.button`
  padding: 2px 8px;
  color: #047abe;
  cursor: pointer;
  border: none;
  background-color: unset;
  margin-left: auto;
  &:focus {
    outline: 0;
  }
`

export const ThresholdInputLabel = styled.label`
  font-weight: bold;
  margin-right: 8px;
`

export const ModalButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
`

export const RemoveThresholdButton = styled(Button)`
  margin-right: auto;
`

export const StyledRadioGroup = styled.fieldset`
  display: block;
  margin-bottom: 12px;

  & > label {
    display: block;
    font-weight: bold;
    margin-bottom: 2px;
    margin-right: 8px;
    color: #000;
  }
`
