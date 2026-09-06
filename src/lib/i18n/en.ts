/**
 * The English catalogue. US English, and the source of truth.
 *
 * Two rules govern what belongs in here.
 *
 * 1. Chrome only. Everything the site says in its own voice is translated:
 *    navigation, labels, the legal documents. Nothing a couple types is:
 *    their names and their words are entered once and shown exactly as
 *    entered, in every locale. See `src/lib/couple.ts`.
 * 2. No numbers. Prices and dates are formatted from data through `Intl` in
 *    `./index.ts`, never written into a sentence here, because "$249" in a
 *    German paragraph is a bug that typechecks.
 *
 * The type of the whole catalogue is derived from this object at the bottom of
 * the file, so a key added here and forgotten in `de.ts` fails the build. That
 * is R3: a missing translation is a build failure, not a runtime fallback.
 */

/** One heading with its paragraphs. The unit every legal page is built from. */
export type LegalSection = {
  heading: string;
  body: readonly string[];
};

/**
 * A legal document. `sections` is deliberately a plain array rather than a
 * fixed tuple: German and English say the same thing in a different number of
 * paragraphs, and forcing them to match would make the translation worse.
 */
export type LegalDocument = {
  title: string;
  /** One line above the title. Sets the register, carries no legal weight. */
  kicker: string;
  /** One paragraph before the first heading. */
  intro: string;
  sections: readonly LegalSection[];
};

const terms: LegalDocument = {
  kicker: "Legal",
  title: "Terms of service",
  intro:
    "Plain language, because you should be able to read this in one sitting. If a sentence here is unclear, write to us and we will rewrite it.",
  sections: [
    {
      heading: "Who you are dealing with",
      body: [
        "Always Ever After is operated by the company named in our legal notice, which carries the postal address, the contact details and the tax registration.",
        "Everything below is between you and that company.",
      ],
    },
    {
      heading: "What you are buying",
      body: [
        "The Invitation is one wedding invitation, published as one link, sent to as many guests as you like. You build it yourself and it is live within an hour of purchase.",
        "The Commission is the same invitation built for you by our studio from a brief you write. It is delivered within 48 hours, and we take twelve a month, because a person builds each one.",
        "Both are priced once per wedding. Neither carries a per guest charge, at any guest count, ever.",
      ],
    },
    {
      heading: "Payment",
      body: [
        "Payment is taken by Stripe, our payment processor. Your card details go to Stripe and never to us.",
        "Prices are shown in US dollars on the English site and in euros on the German site. Sales tax or value added tax is applied as the law of your country requires, and the amount you will be charged is shown in full before you confirm.",
      ],
    },
    {
      heading: "Refunds",
      body: [
        "Before your invitation is published, a full refund, for any reason, without explanation.",
        "After it is published, none. Publication is the delivery: the link is live, your guests can open it, and the thing you bought has been handed over.",
        "To ask for a refund, write to us from the email address you used at checkout. We return the payment by the route it arrived on, within ten business days.",
      ],
    },
    {
      heading: "Right of withdrawal for consumers in the EU and the UK",
      body: [
        "If you are a consumer in the European Union or the United Kingdom you normally have fourteen days to withdraw from a contract concluded online, without giving a reason.",
        "Because we start work immediately, checkout asks you to agree that we begin at once and to acknowledge that the right of withdrawal ends once your invitation has been published. If you would rather keep the fourteen days, do not tick that box and we will wait before publishing.",
        "An informal message to our email address is enough to withdraw. No particular form is needed.",
        "This right sits alongside the refund policy above. It does not shorten it, and the refund policy does not shorten it.",
      ],
    },
    {
      heading: "Your words stay yours",
      body: [
        "Your names, your date, your text and any photograph you upload remain yours. You give us permission to store and display them, so that the invitation works, and nothing beyond that.",
        "We do not use your invitation to advertise the service, we do not sell anything you give us, and we do not show it to anyone you have not sent the link to.",
        "You confirm that you hold the rights to anything you upload.",
      ],
    },
    {
      heading: "What we ask of you",
      body: [
        "Do not use the service unlawfully, do not upload material you do not have the rights to, and do not use an invitation to send bulk unsolicited mail.",
        "We may take down an invitation that does any of these. If we do, we will tell you which and why.",
      ],
    },
    {
      heading: "Availability",
      body: [
        "We keep every published invitation online for at least twelve months after the wedding date, and in practice for as long as the service runs.",
        "No site is reachable every second of the year. Where we can choose the hour, maintenance happens overnight.",
      ],
    },
    {
      heading: "The limits of our responsibility",
      body: [
        "We are responsible for delivering what you bought and for putting it right if we do not.",
        "We are not responsible for indirect or consequential loss, and our total liability for any claim is limited to what you paid us.",
        "Nothing here limits liability that the law does not allow us to limit, including for death or personal injury caused by negligence, for fraud, and for the mandatory liability that applies to consumers where you live.",
      ],
    },
    {
      heading: "Changes",
      body: [
        "We may change these terms for future purchases. The version that governs your purchase is the one published on the day you paid, and the date at the foot of this page tells you which that was.",
      ],
    },
    {
      heading: "Law and disputes",
      body: [
        "These terms are governed by the law of the place where the operator is established, named in the legal notice.",
        "If you are a consumer, this choice never removes the protection of the mandatory law of the country you live in.",
        "The legal notice carries the European Commission's online dispute resolution link and our position on consumer arbitration.",
      ],
    },
  ],
};

const privacy: LegalDocument = {
  kicker: "Legal",
  title: "Privacy",
  intro:
    "This describes what this site actually does, not what a template says a site does. If the site changes, this page changes in the same commit.",
  sections: [
    {
      heading: "The short version",
      body: [
        "There are no accounts here. Typing your names into this site stores them in your own browser and nowhere else.",
        "They reach us in two cases, both of which you choose: if you ask us to email you your preview, or if you decide to buy.",
      ],
    },
    {
      heading: "What stays in your browser",
      body: [
        "When you put your first names, your wedding date and a chosen design into the preview, we save them in your browser's local storage under a single key, aea.couple, so the page still knows them when you come back.",
        "That entry never leaves your device on its own. It is not sent to us, it is not readable by anyone else, and clearing site data for this site removes it.",
        "Your choice of language is stored the same way, under aea.locale.",
      ],
    },
    {
      heading: "If you ask us to email you your preview",
      body: [
        "Under the preview there is an optional field. Nothing on this site is withheld until you fill it in, and the preview works whether you do or not.",
        "If you enter an address and tick the box, we store that address, the first names and date already in the preview, the design you were looking at, your language, and the moment you ticked the box. We store it so that we can send you the link and, if you have not bought, write to you once or twice about it.",
        "We also store a salted, one way hash of your IP address, in order to stop the same machine submitting the form hundreds of times. The address itself is not stored and the hash cannot be turned back into it.",
        "The legal basis is your consent, Article 6(1)(a) GDPR. You may withdraw it at any time by replying to any message we send, or by writing to the address in the legal notice, and we delete the entry. Withdrawing is as easy as giving it was.",
        "An entry that never becomes a purchase is deleted after twelve months.",
      ],
    },
    {
      heading: "Cookies",
      body: [
        "This site sets no cookies. There is no cookie banner because there is nothing to ask you about.",
        "Stripe's checkout runs on Stripe's own pages and sets cookies there. Stripe's privacy notice covers those.",
      ],
    },
    {
      heading: "What we measure",
      body: [
        "We count a small number of events, such as a page being reached or a checkout being started, so we know whether the page works.",
        "The measurement is first party and cookieless. It sets no identifier, it builds no profile, and it cannot follow you to another site.",
        "No advertising network, no social network and no third party analytics service is embedded in this site.",
      ],
    },
    {
      heading: "Server logs",
      body: [
        "Our hosting provider records ordinary access logs, including the IP address that made a request, in order to serve the page and to defend against attacks. Those logs are short lived and we do not use them to build a picture of a visitor.",
      ],
    },
    {
      heading: "When you buy",
      body: [
        "Checkout is Stripe's hosted page. You give Stripe your email address and your payment details.",
        "Stripe tells us that the payment succeeded, gives us your email address and the amount, and we send it the names, the date and the design you chose here, so that your invitation can be built and the link emailed to you.",
        "Stripe processes payment data as an independent controller under its own privacy notice, and in the United States as well as in the EU. Its transfers rest on the European Commission's standard contractual clauses.",
      ],
    },
    {
      heading: "If you send a commission brief",
      body: [
        "A commission brief arrives as an email and is read by a person. It is kept while the project runs and deleted when it closes.",
      ],
    },
    {
      heading: "How long we keep things",
      body: [
        "Records of a purchase are kept for as long as tax law requires, which in Germany is up to ten years.",
        "Measurement is aggregated and holds nothing that points to a person.",
      ],
    },
    {
      heading: "Legal basis, for readers in the EU",
      body: [
        "Building and delivering your invitation, and taking payment for it, rest on Article 6(1)(b) GDPR, the performance of a contract.",
        "Cookieless measurement and defence against attacks rest on Article 6(1)(f) GDPR, our legitimate interest in a service that works and stays up.",
        "Keeping records of a sale rests on Article 6(1)(c) GDPR, a legal obligation.",
      ],
    },
    {
      heading: "Your rights",
      body: [
        "In the EU and the UK you have the right of access, rectification, erasure, restriction, data portability, and the right to object, under Articles 15 to 21 GDPR. Write to the email address in the legal notice; no particular form is needed, and we answer within a month.",
        "You may also complain to a data protection supervisory authority, normally the one where you live.",
        "In the United States, we do not sell or share personal information, and we do not use it for cross context behavioural advertising.",
      ],
    },
    {
      heading: "Children",
      body: [
        "This service is sold to adults. We do not knowingly collect anything from a child.",
      ],
    },
  ],
};

/**
 * The Impressum. Under § 5 DDG this is a German obligation, and the English
 * page carries the same disclosures rather than hiding them behind the German
 * one, because the duty attaches to the site rather than to a locale.
 *
 * The operator's own details are data, not copy: they come from
 * `src/lib/operator.ts` and are never translated. Only the labels live here.
 */
const imprint = {
  kicker: "Legal",
  title: "Legal notice",
  intro:
    "German law requires these details to be reachable from every page. They are here, in full, whichever language you are reading.",
  labels: {
    provider: "Details under § 5 DDG",
    represented: "Represented by",
    contact: "Contact",
    email: "Email",
    phone: "Phone",
    vatId: "VAT identification number under § 27a UStG",
    contentResponsible: "Responsible for content under § 18 (2) MStV",
    hosting: "Hosted in",
  },
  sections: [
    {
      heading: "Dispute resolution",
      body: [
        "The European Commission provides a platform for online dispute resolution: https://ec.europa.eu/consumers/odr",
        "We are neither willing nor obliged to take part in dispute resolution proceedings before a consumer arbitration board.",
      ],
    },
  ] as readonly LegalSection[],
} as const;

export const en = {
  /** The name of the site, in the site's own voice. Never translated. */
  brand: "Always Ever After",

  chrome: {
    /** The accessible name of the locale control. Its labels are EN and DE. */
    switchTo: "Switch language",
    backHome: "Back to the start",
    legal: "Legal",
    skipToContent: "Skip to content",
  },

  /** Names for the two tiers. Amounts are formatted, never written. */
  tiers: {
    invitation: {
      name: "The Invitation",
      delivery: "Live in an hour, self serve",
      constraint: "Unlimited guests",
    },
    commission: {
      name: "The Commission",
      delivery: "48 hours, our studio builds it",
      constraint: "Twelve a month",
    },
    /** The line that carries the whole pricing argument. */
    pricedOnce: "Priced once per wedding, not per guest",
  },

  legal: {
    /** Precedes the date the document last changed in substance. */
    updated: "Last changed",
    terms,
    privacy,
    imprint,
    nav: {
      terms: "Terms",
      privacy: "Privacy",
      imprint: "Legal notice",
    },
    /**
     * R12. Shown while any `NEXT_PUBLIC_OPERATOR_*` value is still a
     * placeholder, so an unfinished Impressum announces itself rather than
     * publishing a bracketed name to a German audience.
     */
    placeholder: {
      heading: "This page is not finished",
      body: "The operator's details have not been filled in yet, so the entries below are placeholders and this notice does not satisfy § 5 DDG. Set the NEXT_PUBLIC_OPERATOR_ values before this site goes live.",
      missing: "Still missing",
    },
  },
} as const;

/**
 * `as const` gives the English catalogue literal types, which would force every
 * other catalogue to repeat English word for word. Widening the strings keeps
 * the shape enforced while leaving the wording free.
 *
 * Arrays are matched before the object case and rebuilt as readonly arrays of
 * a widened element. Left to the homomorphic mapping, an `as const` array
 * would stay a tuple and pin German to exactly as many paragraphs as English,
 * which is a constraint on the translator with no benefit to the reader.
 */
type Widen<T> = T extends string
  ? string
  : T extends readonly (infer E)[]
    ? readonly Widen<E>[]
    : { -readonly [K in keyof T]: Widen<T[K]> };

export type Catalogue = Widen<typeof en>;
