/* ── the alert that tells us an order came in ─────────────────────────────── */

/**
 * Where order alerts go. An environment variable rather than a constant,
 * because this repository is public and a personal address committed to it is
 * an address harvested from it.
 *
 * Comma separated, so adding a third recipient is a settings change and not a
 * deployment.
 */
export const ORDER_ALERT_ENV = ["RESEND_API_KEY", "DELIVERY_FROM", "ORDER_ALERT_TO"] as const;

function alertRecipients(): string[] {
  return (process.env.ORDER_ALERT_TO ?? "")
    .split(",")
    .map((address) => address.trim())
    .filter((address) => address.length > 0);
}

/** Which of the three are missing. Empty means the alert can be sent. */
export function orderAlertMissing(): string[] {
  const missing: string[] = [];
  if (!process.env.RESEND_API_KEY) missing.push("RESEND_API_KEY");
  if (!process.env.DELIVERY_FROM) missing.push("DELIVERY_FROM");
  if (alertRecipients().length === 0) missing.push("ORDER_ALERT_TO");
  return missing;
}

/** Only ever shown to us, so it is not translated. The couple's own language
    travels as a field, because it decides who should answer them. */
function alertBody(args: OrderAlert): string {
  const line = (label: string, value: string) => `${label.padEnd(14)}${value}`;
  return [
    `A couple asked to be contacted about an order.`,
    ``,
    line("Email", args.email),
    line("Names", [args.partnerAName, args.partnerBName].filter(Boolean).join(" and ") || "(not given)"),
    line("Date", args.weddingDate ?? "(not given)"),
    line("Style", args.theme || "(not given)"),
    line("Asked about", args.tier ?? "(not given)"),
    line("Language", args.locale),
    ``,
    `Reply to this message to answer them directly.`,
    ``,
    `Always Ever After`,
  ].join("\n");
}

type OrderAlert = {
  email: string;
  partnerAName: string;
  partnerBName: string;
  weddingDate: string | null;
  theme: string;
  tier: "invitation" | "commission" | null;
  locale: "en" | "de";
};

/**
 * Tells us an order enquiry arrived. Never throws and never blocks the
 * couple's own 200: the enquiry is already in the database by the time this
 * runs, so a failed alert is something to log loudly and not something to
 * report to the person who filled the form correctly.
 */
export async function sendOrderAlert(args: OrderAlert): Promise<{ ok: boolean; error?: string }> {
  const missing = orderAlertMissing();
  if (missing.length > 0) return { ok: false, error: `not_configured:${missing.join(",")}` };

  const names = [args.partnerAName, args.partnerBName].filter(Boolean).join(" & ");
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: process.env.DELIVERY_FROM,
        to: alertRecipients(),
        /* Their address, so hitting reply answers the couple and not us. */
        reply_to: args.email,
        subject: `New order enquiry — ${names || args.email}`,
        text: alertBody(args),
      }),
    });
    if (!res.ok) {
      /*
       * Resend's own words, not just its number. A bare 403 sends whoever is
       * reading the log to the API key, when the cause is almost always the
       * sending domain: an unverified `DELIVERY_FROM`, or the test sender
       * refusing a recipient that is not the account's own address. The body
       * says which, and a status alone costs an afternoon to rediscover.
       */
      const detail = await res.text().catch(() => "");
      return {
        ok: false,
        error: `resend_${res.status}${detail ? `: ${detail.slice(0, 300)}` : ""}`,
      };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "network" };
  }
}
