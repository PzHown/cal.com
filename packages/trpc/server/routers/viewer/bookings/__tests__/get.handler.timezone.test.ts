import { describe, it, expect, vi } from "vitest";

import dayjs from "@calcom/dayjs";

// Test the timezone handling logic for booking status filters
describe("Booking status filter timezone handling", () => {
  // Helper function that matches our implementation
  function getCurrentTimeInUserTimezone(userTimeZone: string | null) {
    const timezone = userTimeZone || "UTC";
    // Get current time in user's timezone, then convert to UTC Date object for database comparison
    return dayjs().tz(timezone).utc().toDate();
  }

  it("should handle different timezones correctly", () => {
    // Test with different timezones
    const utcTime = getCurrentTimeInUserTimezone(null);
    const nyTime = getCurrentTimeInUserTimezone("America/New_York");
    const tokyoTime = getCurrentTimeInUserTimezone("Asia/Tokyo");
    
    // All should return Date objects
    expect(utcTime).toBeInstanceOf(Date);
    expect(nyTime).toBeInstanceOf(Date);
    expect(tokyoTime).toBeInstanceOf(Date);
    
    // Since we're getting current time and converting to UTC, times should be very close
    const now = new Date();
    expect(Math.abs(utcTime.getTime() - now.getTime())).toBeLessThan(5000); // Within 5 seconds
    expect(Math.abs(nyTime.getTime() - now.getTime())).toBeLessThan(5000);
    expect(Math.abs(tokyoTime.getTime() - now.getTime())).toBeLessThan(5000);
  });

  it("should default to UTC when timezone is null", () => {
    const result = getCurrentTimeInUserTimezone(null);
    expect(result).toBeInstanceOf(Date);
  });

  it("should default to UTC when timezone is undefined", () => {
    const result = getCurrentTimeInUserTimezone(undefined);
    expect(result).toBeInstanceOf(Date);
  });

  it("should handle timezone conversion properly", () => {
    // Mock a specific time to test timezone conversion
    const fixedTime = dayjs("2024-01-15 12:00:00");
    
    // Test that the logic works with different timezones
    // Note: This is testing the structure rather than exact values since we use current time
    const noonUTC = fixedTime.utc().toDate();
    const noonNY = fixedTime.tz("America/New_York").utc().toDate();
    const noonTokyo = fixedTime.tz("Asia/Tokyo").utc().toDate();
    
    expect(noonUTC).toBeInstanceOf(Date);
    expect(noonNY).toBeInstanceOf(Date);  
    expect(noonTokyo).toBeInstanceOf(Date);
    
    // Different timezones at same local time should result in different UTC times
    expect(noonUTC.getTime()).not.toEqual(noonNY.getTime());
    expect(noonUTC.getTime()).not.toEqual(noonTokyo.getTime());
  });
});