import React from 'react'

import { ProfilerSummaryTitle, ProfilerSummaryType } from './styles'

const CardTitle = ({ name, type }: CardTitleProps) => {
  return (
    <ProfilerSummaryTitle>
      {name} <ProfilerSummaryType>{type}</ProfilerSummaryType>
    </ProfilerSummaryTitle>
  )
}

interface CardTitleProps {
  name: string
  type: string
}

export default CardTitle
