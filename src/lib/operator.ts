/**
 * Who operates the service.
 *
 * German law (§ 5 DDG) requires these details on every publicly reachable
 * page, and a missing or wrong Impressum is an abmahnfähige offence rather
 * than a rough edge. The values live in the environment so they are filled in
 * once at deploy time rather than edited into code, and so a fork of this
 * funnel cannot accidentally publish somebody else's address.
 *
 * The defaults are deliberately obvious placeholders. Shipping a blank
 * Impressum silently is worse than shipping one that admits it is unfinished,
 * because only the second kind gets fixed before anybody relies on it.
 * See docs/LESSONS.md R12.
 *
 * `process.env.NEXT_PUBLIC_*` is inlined by the bundler at build time, so each
 * key has to be written out literally. A lookup through a variable would
 * resolve to undefined in the browser.
 */
export const OPERATOR = {
  name: process.env.NEXT_PUBLIC_OPERATOR_NAME ?? "[Betreibername eintragen]",
  street: process.env.NEXT_PUBLIC_OPERATOR_STREET ?? "[Straße und Hausnummer]",
  city: process.env.NEXT_PUBLIC_OPERATOR_CITY ?? "[PLZ und Ort]",
  country: process.env.NEXT_PUBLIC_OPERATOR_COUNTRY ?? "[Land]",
  represented:
    process.env.NEXT_PUBLIC_OPERATOR_REPRESENTED ??
    "[Vertretungsberechtigte Person]",
  email: process.env.NEXT_PUBLIC_OPERATOR_EMAIL ?? "[kontakt@example.com]",
  phone: process.env.NEXT_PUBLIC_OPERATOR_PHONE ?? "[Telefonnummer]",
  vatId:
    process.env.NEXT_PUBLIC_OPERATOR_VAT_ID ?? "[USt-IdNr., falls vorhanden]",
  /**
   * Where the site is actually served from. Asked in every German sale, and
   * the privacy notice names it, so it is an operator detail rather than copy.
   */
  hostingRegion:
    process.env.NEXT_PUBLIC_HOSTING_REGION ?? "[Hosting-Region eintragen]",
} as const;

export type OperatorField = keyof typeof OPERATOR;

/**
 * True while any operator detail is still a placeholder.
 *
 * The bracket convention is the whole test: a real value never starts with an
 * opening bracket, so one predicate covers every field, and a field added
 * later is covered the moment its default follows the convention.
 */
export const OPERATOR_INCOMPLETE: boolean = Object.values(OPERATOR).some((v) =>
  v.startsWith("["),
);

/** The fields still missing, so the warning can name them rather than gesture. */
export const OPERATOR_MISSING: readonly OperatorField[] = (
  Object.keys(OPERATOR) as OperatorField[]
).filter((k) => OPERATOR[k].startsWith("["));

/** The postal address as it is printed: one line per line, never joined. */
export const OPERATOR_ADDRESS_LINES: readonly string[] = [
  OPERATOR.name,
  OPERATOR.street,
  OPERATOR.city,
  OPERATOR.country,
];
