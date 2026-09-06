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
