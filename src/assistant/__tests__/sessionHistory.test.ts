import { mock, describe, expect, test, beforeEach } from "bun:test";

mock.module("bun:bundle", () => ({ feature: () => false }));

// Deep mocks to avoid bun:bundle
mock.module("../../utils/teleport/api.js", () => {
  return {
    getOAuthHeaders: mock(() => ({
      Authorization: "Bearer test-token",
    })),
    prepareApiRequest: mock(() =>
      Promise.resolve({
        accessToken: "test-token",
        orgUUID: "test-org-uuid",
      }),
    ),
  };
});

mock.module("../../utils/debug.js", () => ({
  logForDebugging: mock()
}));

const { fetchOlderEvents, fetchLatestEvents, createHistoryAuthCtx, HISTORY_PAGE_SIZE } = await import("../sessionHistory.js");
const axios = await import("axios");
const teleportApi = await import("../../utils/teleport/api.js");

mock.module("axios", () => {
  return {
    default: {
      get: mock(),
    },
    get: mock(),
  };
});

mock.module("../../constants/oauth.js", () => {
  return {
    getOauthConfig: mock(() => ({
      BASE_API_URL: "https://api.example.com",
    })),
  };
});

describe("sessionHistory", () => {
  beforeEach(() => {
    // Reset mocks
    // ;(axios.default.get as import('bun:test').Mock<any>).mockClear();
    ;(teleportApi.getOAuthHeaders as import('bun:test').Mock<any>).mockClear();
    ;(teleportApi.prepareApiRequest as import('bun:test').Mock<any>).mockClear();
  });

  describe("createHistoryAuthCtx", () => {
    test("creates correct context", async () => {
      const sessionId = "test-session-id";
      const ctx = await createHistoryAuthCtx(sessionId);

      expect(ctx.baseUrl).toBe("https://api.example.com/v1/sessions/test-session-id/events");
      expect(ctx.headers).toEqual({
        Authorization: "Bearer test-token",
        "anthropic-beta": "ccr-byoc-2025-07-29",
        "x-organization-uuid": "test-org-uuid",
      });
    });
  });

  describe("fetchOlderEvents", () => {
    const ctx = {
      baseUrl: "https://api.example.com/v1/sessions/test-session/events",
      headers: { Authorization: "Bearer test" },
    };

    test("returns history page on success", async () => {
      // Mock axios response
      const mockResponse = {
        status: 200,
        data: {
          data: [{ id: "1", type: "message" }],
          has_more: true,
          first_id: "1",
          last_id: "1",
        },
      };

      const getMock = mock(() => Promise.resolve(mockResponse));
      axios.default.get = getMock as any;

      const result = await fetchOlderEvents(ctx, "cursor-id");

      expect(getMock).toHaveBeenCalledWith(ctx.baseUrl, {
        headers: ctx.headers,
        params: { limit: HISTORY_PAGE_SIZE, before_id: "cursor-id" },
        timeout: 15000,
        validateStatus: expect.any(Function),
      });

      expect(result).toEqual({
        events: [{ id: "1", type: "message" }] as any,
        firstId: "1",
        hasMore: true,
      });
    });

    test("returns history page on success with custom limit", async () => {
      // Mock axios response
      const mockResponse = {
        status: 200,
        data: {
          data: [],
          has_more: false,
          first_id: null,
          last_id: null,
        },
      };
      const getMock = mock(() => Promise.resolve(mockResponse));
      axios.default.get = getMock as any;

      const result = await fetchOlderEvents(ctx, "cursor-id", 50);

      expect(getMock).toHaveBeenCalledWith(ctx.baseUrl, {
        headers: ctx.headers,
        params: { limit: 50, before_id: "cursor-id" },
        timeout: 15000,
        validateStatus: expect.any(Function),
      });

      expect(result).toEqual({
        events: [],
        firstId: null,
        hasMore: false,
      });
    });

    test("handles non-array data gracefully", async () => {
      const mockResponse = {
        status: 200,
        data: {
          data: "not an array",
          has_more: false,
          first_id: null,
          last_id: null,
        },
      };
      const getMock = mock(() => Promise.resolve(mockResponse));
      axios.default.get = getMock as any;

      const result = await fetchOlderEvents(ctx, "cursor-id");

      expect(result).toEqual({
        events: [],
        firstId: null,
        hasMore: false,
      });
    });

    test("returns null on error status", async () => {
      const mockResponse = {
        status: 500,
      };
      const getMock = mock(() => Promise.resolve(mockResponse));
      axios.default.get = getMock as any;

      const result = await fetchOlderEvents(ctx, "cursor-id");

      expect(result).toBeNull();
    });

    test("returns null on axios error", async () => {
      const getMock = mock(() => Promise.reject(new Error("Network Error")));
      axios.default.get = getMock as any;

      const result = await fetchOlderEvents(ctx, "cursor-id");

      expect(result).toBeNull();
    });
  });

  describe("fetchLatestEvents", () => {
    const ctx = {
      baseUrl: "https://api.example.com/v1/sessions/test-session/events",
      headers: { Authorization: "Bearer test" },
    };

    test("returns history page on success", async () => {
      const mockResponse = {
        status: 200,
        data: {
          data: [{ id: "1", type: "message" }],
          has_more: true,
          first_id: "1",
          last_id: "1",
        },
      };
      const getMock = mock(() => Promise.resolve(mockResponse));
      axios.default.get = getMock as any;

      const result = await fetchLatestEvents(ctx);

      expect(getMock).toHaveBeenCalledWith(ctx.baseUrl, {
        headers: ctx.headers,
        params: { limit: HISTORY_PAGE_SIZE, anchor_to_latest: true },
        timeout: 15000,
        validateStatus: expect.any(Function),
      });

      expect(result).toEqual({
        events: [{ id: "1", type: "message" }] as any,
        firstId: "1",
        hasMore: true,
      });
    });
  });
});
