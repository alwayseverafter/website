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
