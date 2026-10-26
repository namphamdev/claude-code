import React from 'react';
import { Box, Text, stringWidth } from '@anthropic/ink';
import type { NormalizedMessage } from '../types/message.js';
import { getDateTimeFormat } from '../utils/intl.js';

type Props = {
  message: NormalizedMessage;
  isTranscriptMode: boolean;
};

export function MessageTimestamp({ message, isTranscriptMode }: Props): React.ReactNode {
  const shouldShowTimestamp =
    isTranscriptMode &&
    message.timestamp &&
    message.type === 'assistant' &&
    message.message.content.some(c => c.type === 'text');

  if (!shouldShowTimestamp) {
    return null;
  }

  const formattedTimestamp = getDateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(message.timestamp));

  return (
    <Box minWidth={stringWidth(formattedTimestamp)}>
      <Text dimColor>{formattedTimestamp}</Text>
    </Box>
  );
}
