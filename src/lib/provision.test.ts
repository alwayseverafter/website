import { afterEach, describe, expect, it } from "vitest";
import { inviteUrl, productOrigin, readProvisionConfig } from "./provision";

/**
 * The pure parts of the provisioning client: what it reports when it is not
 * configured, and where it thinks a published invitation lives.
 */

const SAVED = { ...process.env };
afterEach(() => {
  process.env = { ...SAVED };
});

describe("readProvisionConfig", () => {
  it("names every missing variable rather than failing on the first", () => {
    delete process.env.DAVET_PROVISION_URL;
    delete process.env.DAVET_PROVISION_SECRET;
    const result = readProvisionConfig();
    expect(result.ok).toBe(false);
    if (!result.ok) {
      // R12: whoever is looking at the page can fix it in one move, not two.
      expect(result.missing).toEqual(["DAVET_PROVISION_URL", "DAVET_PROVISION_SECRET"]);
    }
  });

  it("treats whitespace as absence", () => {
    process.env.DAVET_PROVISION_URL = "   ";
    process.env.DAVET_PROVISION_SECRET = "s";
    const result = readProvisionConfig();
    expect(result.ok).toBe(false);
  });
});

describe("productOrigin", () => {
  it("derives the origin from the provisioning URL", () => {
    // One variable, not two, so a couple's guest link cannot drift from the
    // deployment that actually serves it.
    process.env.DAVET_PROVISION_URL = "https://product.example/api/provision";
    process.env.DAVET_PROVISION_SECRET = "s";
    expect(productOrigin()).toBe("https://product.example");
    expect(inviteUrl("max-lena")).toBe("https://product.example/max-lena");
  });

  it("returns null rather than a link to nowhere when unconfigured", () => {
    delete process.env.DAVET_PROVISION_URL;
    // The alternative is a mail containing "null/max-lena". R3.
    expect(productOrigin()).toBeNull();
    expect(inviteUrl("max-lena")).toBeNull();
  });

  it("returns null for a URL that will not parse", () => {
    process.env.DAVET_PROVISION_URL = "not a url";
    process.env.DAVET_PROVISION_SECRET = "s";
    expect(productOrigin()).toBeNull();
  });
});

describe("readProvisioned, transient versus real failure", () => {
  const realFetch = global.fetch;
  afterEach(() => { global.fetch = realFetch; });

  function configured() {
    process.env.DAVET_PROVISION_URL = "https://product.example/api/provision";
    process.env.DAVET_PROVISION_SECRET = "s";
  }

  function respond(status: number, body: unknown = {}) {
    global.fetch = (async () =>
      new Response(JSON.stringify(body), {
        status, headers: { "content-type": "application/json" },
      })) as typeof fetch;
  }

  it("reads a 404 as not provisioned yet, not as an error", async () => {
    // The webhook can land after the redirect does, so this is the ordinary
    // case for a buyer who is quick, and it must render "being prepared".
    configured(); respond(404);
    const { readProvisioned } = await import("./provision");
    expect(await readProvisioned("cs_1")).toEqual({ ok: false, reason: "not_provisioned" });
  });

  it("reads a 503 as transient, so a buyer is not told their purchase broke", async () => {
    configured(); respond(503);
    const { readProvisioned } = await import("./provision");
    const result = await readProvisioned("cs_1");
    expect(result).toMatchObject({ ok: false, reason: "unavailable" });
  });

  it("reads a network failure as transient", async () => {
    configured();
    global.fetch = (async () => { throw new Error("ECONNRESET"); }) as typeof fetch;
    const { readProvisioned } = await import("./provision");
    expect(await readProvisioned("cs_1")).toMatchObject({ ok: false, reason: "unavailable" });
  });

  it("reads a 400 as a real failure, because retrying will not fix it", async () => {
    configured(); respond(400);
    const { readProvisioned } = await import("./provision");
    expect(await readProvisioned("cs_1")).toMatchObject({ ok: false, reason: "failed" });
  });

  it("does not tell a customer the product was unreachable on a 200", async () => {
    // This produced "The product could not be reached (http_200)", which is
    // both untrue and unreadable.
    configured(); respond(200, { nonsense: true });
    const { readProvisioned } = await import("./provision");
    expect(await readProvisioned("cs_1")).toMatchObject({
      ok: false, reason: "failed", detail: "malformed_response",
    });
  });
});
