import { afterEach, describe, expect, it } from "vitest";
import { readDbConfig } from "./db";

/**
 * Configuration is read as data, never thrown at import. A route that throws
 * while being imported fails as an opaque 500 with no usable message, which is
 * the silent degradation R3 forbids and R12 requires naming instead.
 */

const SAVED = { ...process.env };
afterEach(() => { process.env = { ...SAVED }; });

describe("readDbConfig", () => {
  it("names every missing variable rather than failing on the first", () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    const result = readDbConfig();
    expect(result.ok).toBe(false);
    if (!result.ok) {
      // So whoever is looking at the page can fix it in one move, not two.
      expect(result.missing).toEqual([
        "NEXT_PUBLIC_SUPABASE_URL",
        "SUPABASE_SERVICE_ROLE_KEY",
      ]);
    }
  });

  it("treats whitespace as absence", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "   ";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "k";
    const result = readDbConfig();
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.missing).toEqual(["NEXT_PUBLIC_SUPABASE_URL"]);
  });

  it("does not throw when nothing is set", () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    expect(() => readDbConfig()).not.toThrow();
  });
});
