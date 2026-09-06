/**
 * The email that carries a couple their invitation.
 *
 * A missing key is a state to report, never a crash, and never a reason to
 * pretend the mail was sent. `/create` renders both links on screen precisely
 * so that a failure here is an inconvenience rather than a lost purchase.
 */

export const DELIVERY_ENV = ["RESEND_API_KEY", "DELIVERY_FROM"] as const;

export function deliveryConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.DELIVERY_FROM);
}

type Copy = { subject: string; body: (a: string, b: string, invite: string, editor: string) => string };

/** German buyers get German. An English apology to a German customer fails twice. */
const COPY: Record<"en" | "de", Copy> = {
  en: {
    subject: "Your invitation is ready to build",
    body: (a, b, invite, editor) =>
      `${a} and ${b},\n\n`
      + `Your invitation exists. Your names, your date and your style are already in it.\n\n`
      + `Open the editor to add your ceremony and your guests:\n${editor}\n\n`
      + `This is the link your guests will use, once you publish:\n${invite}\n\n`
      + `Always Ever After\n`,
  },
  de: {
    subject: "Eure Einladung kann gebaut werden",
    body: (a, b, invite, editor) =>
      `${a} und ${b},\n\n`
      + `Eure Einladung existiert. Eure Namen, euer Datum und euer Stil stehen schon darin.\n\n`
      + `Öffnet den Editor, um eure Trauung und eure Gäste einzutragen:\n${editor}\n\n`
      + `Diesen Link bekommen eure Gäste, sobald ihr veröffentlicht:\n${invite}\n\n`
      + `Always Ever After\n`,
  },
};

export async function sendInvitationEmail(args: {
  to: string;
  locale: "en" | "de";
  partnerAName: string;
  partnerBName: string;
  inviteUrl: string;
  editorUrl: string;
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
        text: copy.body(
          args.partnerAName, args.partnerBName, args.inviteUrl, args.editorUrl,
        ),
      }),
    });
    if (!res.ok) return { ok: false, error: `resend_${res.status}` };
    return { ok: true };
  } catch {
    return { ok: false, error: "network" };
  }
}
