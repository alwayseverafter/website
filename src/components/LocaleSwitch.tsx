"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LOCALES,
  LOCALE_LABEL,
  LOCALE_NAME,
  localeHref,
  storeLocale,
  type Locale,
} from "@/lib/i18n";
import s from "./LocaleSwitch.module.css";

/**
 * EN / DE, in the top hairline.
 *
 * It does not geolocate, it does not auto redirect, and it does not pop a
 * modal. Guessing a visitor's language from their IP address is the kind of
 * cleverness that irritates the exact person we want, and a shared link has to
 * open in the language it was shared in, for whoever opens it.
 *
 * The choice is remembered so a returning visitor does not have to make it
 * twice. Remembering is not the same as acting: nothing redirects on the
 * strength of the stored value, the entry point reads it to pick a starting
 * language and a visitor can always overrule it here.
 *
 * A client component only because it needs the current path and because the
 * choice is written on the click that makes it.
 */
export function LocaleSwitch({
  locale,
  label,
}: {
  /** The locale of the page this is rendered on. Known statically by the page. */
  locale: Locale;
  /** Accessible name for the group, from the catalogue. */
  label: string;
}) {
  const pathname = usePathname();

  return (
    <nav className={s.row} aria-label={label}>
      {LOCALES.map((l, i) => (
        <span key={l} className={s.item}>
          {i > 0 && (
            <span className={s.sep} aria-hidden="true">
              /
            </span>
          )}
          <Link
            href={localeHref(pathname, l)}
            hrefLang={l}
            lang={l}
            className={l === locale ? `${s.link} ${s.current}` : s.link}
            aria-current={l === locale ? "true" : undefined}
            onClick={() => storeLocale(l)}
          >
            <span aria-hidden="true">{LOCALE_LABEL[l]}</span>
            <span className={s.sr}>{LOCALE_NAME[l]}</span>
          </Link>
        </span>
      ))}
    </nav>
  );
}
