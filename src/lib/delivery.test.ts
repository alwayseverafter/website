import { afterEach, describe, expect, it, vi } from "vitest";
import { orderAlertMissing, sendOrderAlert } from "./delivery";

/**
 * The alert is the only thing that tells a human an order arrived. Its
 * failure modes are therefore worth more than its happy path: an alert that
 * silently does not send looks exactly like a day with no orders.
 */

const SAVED = { ...process.env };
afterEach(() => {
  process.env = { ...SAVED };
  vi.unstubAllGlobals();
});

const ORDER = {
  email: "couple@example.test",
  partnerAName: "Alex",
  partnerBName: "Sam",
  weddingDate: "2027-06-12",
  theme: "linen",
  tier: "invitation" as const,
  locale: "en" as const,
};

function configure() {
  process.env.RESEND_API_KEY = "test-key";
  process.env.DELIVERY_FROM = "orders@example.test";
  process.env.ORDER_ALERT_TO = "one@example.test, two@example.test";
}

describe("orderAlertMissing", () => {
  it("names every missing variable rather than failing on the first", () => {
    delete process.env.RESEND_API_KEY;
    delete process.env.DELIVERY_FROM;
    delete process.env.ORDER_ALERT_TO;
    expect(orderAlertMissing()).toEqual([
      "RESEND_API_KEY",
      "DELIVERY_FROM",
      "ORDER_ALERT_TO",
    ]);
  });

  it("treats a recipient list of only separators as absence", () => {
    process.env.RESEND_API_KEY = "k";
    process.env.DELIVERY_FROM = "f@example.test";
    process.env.ORDER_ALERT_TO = " , ,";
    expect(orderAlertMissing()).toEqual(["ORDER_ALERT_TO"]);
  });
});

describe("sendOrderAlert", () => {
  it("refuses to pretend it sent when nothing is configured", async () => {
    delete process.env.RESEND_API_KEY;
    const result = await sendOrderAlert(ORDER);
    expect(result.ok).toBe(false);
    expect(result.error).toContain("not_configured");
  });

  it("sends to every recipient and replies to the couple", async () => {
    configure();
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    const result = await sendOrderAlert(ORDER);

    expect(result.ok).toBe(true);
    const body = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body));
    // Both addresses, with the surrounding whitespace dropped.
    expect(body.to).toEqual(["one@example.test", "two@example.test"]);
    // Hitting reply must answer the couple, not us.
    expect(body.reply_to).toBe(ORDER.email);
    expect(body.subject).toContain("Alex & Sam");
    // Everything a human needs to act, without opening the database.
    expect(body.text).toContain(ORDER.email);
    expect(body.text).toContain("2027-06-12");
    expect(body.text).toContain("linen");
  });

  it("reports a refusal from Resend rather than swallowing it", async () => {
    configure();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 422 }));
    expect(await sendOrderAlert(ORDER)).toEqual({ ok: false, error: "resend_422" });
  });

  it("survives the network being down", async () => {
    configure();
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("boom")));
    expect(await sendOrderAlert(ORDER)).toEqual({ ok: false, error: "network" });
  });

  it("says so when names are missing instead of printing an empty subject", async () => {
    configure();
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    await sendOrderAlert({ ...ORDER, partnerAName: "", partnerBName: "", weddingDate: null });

    const body = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body));
    expect(body.subject).toContain(ORDER.email);
    expect(body.text).toContain("(not given)");
  });
});
