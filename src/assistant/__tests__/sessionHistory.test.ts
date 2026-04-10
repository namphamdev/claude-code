import { describe, expect, test, mock } from 'bun:test'

// Mock dependencies
mock.module('../../utils/slowOperations.js', () => ({
  jsonStringify: JSON.stringify,
  jsonParse: JSON.parse,
  clone: (v: any) => JSON.parse(JSON.stringify(v)),
  cloneDeep: (v: any) => JSON.parse(JSON.stringify(v)),
  slowLogging: () => ({ [Symbol.dispose]() {} }),
  writeFileSync_DEPRECATED: () => {}
}))

mock.module('../../constants/oauth.js', () => ({
  getOauthConfig: () => ({ BASE_API_URL: 'https://api.example.com' }),
}))

mock.module('../../utils/teleport/api.js', () => ({
  prepareApiRequest: async () => ({ accessToken: 'test-token', orgUUID: 'test-org' }),
  getOAuthHeaders: (token: string) => ({ 'Authorization': `Bearer ${token}` }),
}))

mock.module('../../utils/debug.js', () => ({
  logForDebugging: mock(() => {})
}))

const mockAxiosGet = mock(async () => ({
  status: 200,
  data: {
    data: [{ id: "msg-1" }],
    first_id: "msg-1",
    has_more: true
  }
}))

mock.module('axios', () => ({
  default: {
    get: mockAxiosGet
  }
}))

const { createHistoryAuthCtx, fetchLatestEvents, fetchOlderEvents, HISTORY_PAGE_SIZE } = await import('../sessionHistory.js');
const { logForDebugging } = await import('../../utils/debug.js');

describe('sessionHistory', () => {
  describe('createHistoryAuthCtx', () => {
    test('creates auth context with correct base URL and headers', async () => {
      const ctx = await createHistoryAuthCtx('test-session-id')
      expect(ctx.baseUrl).toBe('https://api.example.com/v1/sessions/test-session-id/events')
      expect(ctx.headers).toEqual({
        Authorization: 'Bearer test-token',
        'anthropic-beta': 'ccr-byoc-2025-07-29',
        'x-organization-uuid': 'test-org',
      })
    })
  })

  describe('fetchLatestEvents', () => {
    test('fetches latest events using anchor_to_latest', async () => {
      mockAxiosGet.mockClear()
      const ctx = await createHistoryAuthCtx('test-session-id')

      const result = await fetchLatestEvents(ctx, 50)

      expect(result).not.toBeNull()
      expect(result?.events).toEqual([{ id: "msg-1" }])
      expect(result?.firstId).toBe('msg-1')
      expect(result?.hasMore).toBe(true)

      expect(mockAxiosGet).toHaveBeenCalledWith(
        'https://api.example.com/v1/sessions/test-session-id/events',
        expect.objectContaining({
          params: { limit: 50, anchor_to_latest: true }
        })
      )
    })

    test('uses default HISTORY_PAGE_SIZE when limit not provided', async () => {
      mockAxiosGet.mockClear()
      const ctx = await createHistoryAuthCtx('test-session-id')

      await fetchLatestEvents(ctx)

      expect(mockAxiosGet).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: { limit: HISTORY_PAGE_SIZE, anchor_to_latest: true }
        })
      )
    })

    test('handles non-200 response', async () => {
      mockAxiosGet.mockResolvedValueOnce({ status: 500, data: {} } as any)
      const ctx = await createHistoryAuthCtx('test-session-id')

      const result = await fetchLatestEvents(ctx)
      expect(result).toBeNull()
      expect(logForDebugging).toHaveBeenCalledWith(expect.stringContaining('[fetchLatestEvents] HTTP 500'))
    })

    test('handles request failure', async () => {
      mockAxiosGet.mockRejectedValueOnce(new Error('Network error'))
      const ctx = await createHistoryAuthCtx('test-session-id')

      const result = await fetchLatestEvents(ctx)
      expect(result).toBeNull()
      expect(logForDebugging).toHaveBeenCalledWith(expect.stringContaining('[fetchLatestEvents] HTTP error'))
    })

    test('handles response with non-array data gracefully', async () => {
      mockAxiosGet.mockResolvedValueOnce({
        status: 200,
        data: { data: null, first_id: null, has_more: false }
      } as any)
      const ctx = await createHistoryAuthCtx('test-session-id')

      const result = await fetchLatestEvents(ctx)
      expect(result?.events).toEqual([])
    })
  })

  describe('fetchOlderEvents', () => {
    test('fetches older events using before_id cursor', async () => {
      mockAxiosGet.mockClear()
      const ctx = await createHistoryAuthCtx('test-session-id')

      const result = await fetchOlderEvents(ctx, 'cursor-123', 25)

      expect(result).not.toBeNull()
      expect(mockAxiosGet).toHaveBeenCalledWith(
        'https://api.example.com/v1/sessions/test-session-id/events',
        expect.objectContaining({
          params: { limit: 25, before_id: 'cursor-123' }
        })
      )
    })

    test('uses default HISTORY_PAGE_SIZE when limit not provided', async () => {
      mockAxiosGet.mockClear()
      const ctx = await createHistoryAuthCtx('test-session-id')

      await fetchOlderEvents(ctx, 'cursor-123')

      expect(mockAxiosGet).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: { limit: HISTORY_PAGE_SIZE, before_id: 'cursor-123' }
        })
      )
    })
  })
})
