/**
 * The email that confirms an order.
 *
 * Note what it does not contain: a link to an invitation, or a link to an
 * editor. Nothing in this system renders an invitation yet, so promising
 * either would be the defect this codebase has already paid for once. It
 * confirms what was bought and gives the reference that finds it.
 *
 * A missing key is a state to report, never a crash, and never a reason to
 * pretend the mail was sent.
 */

export const DELIVERY_ENV = ["RESEND_API_KEY", "DELIVERY_FROM"] as const;

export function deliveryConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.DELIVERY_FROM);
}

type Copy = {
  subject: string;
  body: (a: string, b: string, ref: string) => string;
};

/** German buyers get German. An English apology to a German customer fails twice. */
const COPY: Record<"en" | "de", Copy> = {
  en: {
    subject: "Your order is confirmed",
    body: (a, b, ref) =>
      `${a} and ${b},\n\n`
      + `Your order is recorded. Your names, your date and your style are held\n`
      + `against it, so nothing needs typing again.\n\n`
      + `Your reference is ${ref}. Quote it if you write to us.\n\n`
      + `We will be in touch with your invitation. If anything about the date or\n`
      + `the names is wrong, reply to this message and we will correct it.\n\n`
      + `Always Ever After\n`,
  },
  de: {
    subject: "Eure Bestellung ist bestätigt",
    body: (a, b, ref) =>
      `${a} und ${b},\n\n`
      + `Eure Bestellung ist erfasst. Eure Namen, euer Datum und euer Stil sind\n`
      + `dazu gespeichert, es muss nichts erneut eingetragen werden.\n\n`
      + `Eure Referenz ist ${ref}. Nennt sie, wenn ihr uns schreibt.\n\n`
      + `Wir melden uns mit eurer Einladung. Falls beim Datum oder bei den Namen\n`
      + `etwas nicht stimmt, antwortet auf diese Nachricht.\n\n`
      + `Always Ever After\n`,
  },
};

export async function sendInvitationEmail(args: {
  to: string;
  locale: "en" | "de";
  partnerAName: string;
  partnerBName: string;
  /** The short human reference from `clients.ref`, e.g. AEA-01042. */
  clientRef: string;
}): Promise<{ ok: boolean; error?: string }> {
  if (!deliveryConfigured()) return { ok: false, error: "delivery_not_configured" };

  const copy = COPY[args.locale];
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: process.env.DELIVERY_FROM,
        to: [args.to],
        subject: copy.subject,
        text: copy.body(args.partnerAName, args.partnerBName, args.clientRef),
      }),
    });
    if (!res.ok) return { ok: false, error: `resend_${res.status}` };
    return { ok: true };
  } catch {
    return { ok: false, error: "network" };
  }
}

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
    if (!res.ok) return { ok: false, error: `resend_${res.status}` };
    return { ok: true };
  } catch {
    return { ok: false, error: "network" };
  }
}
