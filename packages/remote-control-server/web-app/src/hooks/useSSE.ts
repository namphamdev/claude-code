import { useEffect, useRef, useCallback } from "react";
import { getUuid } from "@/lib/api";
import type { SessionEvent } from "@/types";

interface UseSSEOptions {
  sessionId: string | null;
  fromSeqNum?: number;
  onEvent: (event: SessionEvent) => void;
}

export function useSSE({ sessionId, fromSeqNum = 0, onEvent }: UseSSEOptions) {
  const esRef = useRef<EventSource | null>(null);
  const lastSeqRef = useRef(fromSeqNum);
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  const disconnect = useCallback(() => {
    if (esRef.current) {
      esRef.current.close();
      esRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!sessionId) return;

    lastSeqRef.current = fromSeqNum;
    const uuid = getUuid();
    const url = `/web/sessions/${sessionId}/events?uuid=${encodeURIComponent(uuid)}`;
    const es = new EventSource(url);
    esRef.current = es;

    es.addEventListener("message", (e) => {
      try {
        const data: SessionEvent = JSON.parse(e.data);
        if (data.seqNum !== undefined && data.seqNum <= lastSeqRef.current) return;
        if (data.seqNum !== undefined) lastSeqRef.current = data.seqNum;
        onEventRef.current(data);
      } catch {
        // ignore parse errors
      }
    });

    return () => {
      es.close();
      esRef.current = null;
    };
  }, [sessionId, fromSeqNum, disconnect]);

  return { disconnect };
}
