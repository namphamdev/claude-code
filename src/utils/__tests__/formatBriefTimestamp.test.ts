import { describe, expect, test, beforeEach } from "bun:test";
import { formatBriefTimestamp, resetCachedLocaleForTesting, getLocale } from "../formatBriefTimestamp";

describe("formatBriefTimestamp", () => {
  beforeEach(() => {
    resetCachedLocaleForTesting();
  });
  // Fixed "now" for deterministic tests: 2026-04-02T14:00:00Z (Thursday)
  const now = new Date("2026-04-02T14:00:00Z");

  test("same day timestamp returns time only (contains colon)", () => {
    const result = formatBriefTimestamp("2026-04-02T10:30:00Z", now);
    expect(result).toContain(":");
    // Should NOT contain a weekday name since it's the same day
    expect(result).not.toMatch(
      /Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/
    );
  });

  test("yesterday returns weekday and time", () => {
    // 2026-04-01 is Wednesday
    const result = formatBriefTimestamp("2026-04-01T16:15:00Z", now);
    expect(result).toContain("Wednesday");
    expect(result).toContain(":");
  });

  test("3 days ago returns weekday and time", () => {
    // 2026-03-30 is Monday
    const result = formatBriefTimestamp("2026-03-30T09:00:00Z", now);
    expect(result).toContain("Monday");
    expect(result).toContain(":");
  });

  test("6 days ago returns weekday and time (still within 6-day window)", () => {
    // 2026-03-27 is Friday
    const result = formatBriefTimestamp("2026-03-27T12:00:00Z", now);
    expect(result).toContain("Friday");
    expect(result).toContain(":");
  });

  test("7+ days ago returns weekday, month, day, and time", () => {
    // 2026-03-20 is Friday, 13 days ago
    const result = formatBriefTimestamp("2026-03-20T14:30:00Z", now);
    expect(result).toContain("Friday");
    expect(result).toContain(":");
    // Should contain month abbreviation (Mar)
    expect(result).toMatch(/Mar/);
  });

  test("much older date returns full format with month", () => {
    const result = formatBriefTimestamp("2025-12-25T08:00:00Z", now);
    expect(result).toContain(":");
    expect(result).toMatch(/Dec/);
  });

  test("invalid ISO string returns empty string", () => {
    expect(formatBriefTimestamp("not-a-date", now)).toBe("");
  });

  test("empty string returns empty string", () => {
    expect(formatBriefTimestamp("", now)).toBe("");
  });

  test("same day early morning returns time format", () => {
    const result = formatBriefTimestamp("2026-04-02T01:05:00Z", now);
    expect(result).toContain(":");
    // Should be time-only format
    expect(result.length).toBeLessThan(20);
  });

  test("uses current time as default when now is not provided", () => {
    // Just verify it returns a non-empty string for a recent timestamp
    const recent = new Date();
    recent.setMinutes(recent.getMinutes() - 5);
    const result = formatBriefTimestamp(recent.toISOString());
    expect(result).not.toBe("");
    expect(result).toContain(":");
  });

  test("caches the locale", () => {
    const originalLang = process.env.LANG;
    const originalLcAll = process.env.LC_ALL;
    const originalLcTime = process.env.LC_TIME;

    // Clear other env vars that might take precedence
    delete process.env.LC_ALL;
    delete process.env.LC_TIME;

    process.env.LANG = 'fr_FR.UTF-8';

    // First call computes it
    expect(getLocale()).toBe('fr-FR');

    // Change env, shouldn't matter because it's cached
    process.env.LANG = 'de_DE.UTF-8';
    expect(getLocale()).toBe('fr-FR');

    // Reset cache, now it should read the new env
    resetCachedLocaleForTesting();
    expect(getLocale()).toBe('de-DE');

    if (originalLang !== undefined) process.env.LANG = originalLang;
    else delete process.env.LANG;

    if (originalLcAll !== undefined) process.env.LC_ALL = originalLcAll;
    else delete process.env.LC_ALL;

    if (originalLcTime !== undefined) process.env.LC_TIME = originalLcTime;
    else delete process.env.LC_TIME;
  });
});
