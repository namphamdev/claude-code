import React from 'react'
import { Box, Text, stringWidth } from '@anthropic/ink'
import type { NormalizedMessage } from '../types/message.js'

type Props = {
  message: NormalizedMessage
  isTranscriptMode: boolean
}

// Cache the formatter to avoid expensive Intl.DateTimeFormat instantiation on every render
let timeFormatter: Intl.DateTimeFormat | null = null

function getTimeFormatter(): Intl.DateTimeFormat {
  if (!timeFormatter) {
    timeFormatter = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }
  return timeFormatter
}

export function MessageTimestamp({
  message,
  isTranscriptMode,
}: Props): React.ReactNode {
  const shouldShowTimestamp =
    isTranscriptMode &&
    message.timestamp &&
    message.type === 'assistant' &&
    message.message.content.some(c => c.type === 'text')

  if (!shouldShowTimestamp) {
    return null
  }

  const formattedTimestamp = getTimeFormatter().format(new Date(message.timestamp))

  return (
    <Box minWidth={stringWidth(formattedTimestamp)}>
      <Text dimColor>{formattedTimestamp}</Text>
    </Box>
  )
}
