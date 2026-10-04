import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import { Foot } from "./Foot";
import { Funnel } from "./Funnel";
import { Gallery } from "./Gallery";
import { LOCALES } from "@/lib/i18n";
import { STYLE_COUNT } from "@/lib/seo";

/**
 * The home page's way into the catalogue.
 *
 * WHY this suite exists: /styles and every style page under it are the whole
 * organic surface of the business, and the home page linked to none of them.
 * Nothing caught it, because every existing test asks what the data says and
 * this is a question about what the page renders. An orphaned hub is invisible
 * to a crawler and to a visitor alike, and it is invisible silently, which is
 * the shape R3 is about.
 *
 * Rendered rather than read as source. Asserting on the text of a component
 * would pass for a link that is written down and never mounted, which is
 * precisely the failure being guarded against.
 */

/** Every `href` in a fragment of markup, in document order. */
function hrefs(html: string): string[] {
  return [...html.matchAll(/href="([^"]*)"/g)].map((m) => m[1] ?? "");
}

describe("The Catalogue section", () => {
  it("links to the gallery in every locale", () => {
    for (const locale of LOCALES) {
      const html = renderToStaticMarkup(<Gallery locale={locale} count="47" />);
      expect(hrefs(html), `${locale} has no way into the gallery`).toContain("/styles");
    }
  });

  /*
   * The count is a prop precisely so it cannot go stale. If it is ever written
   * into the copy again, this is what fails.
   */
  it("shows the count it is given rather than one of its own", () => {
    const html = renderToStaticMarkup(<Gallery locale="en" count="1234" />);
    expect(html).toContain("1234");
  });

  it("writes its copy in German when asked", () => {
    const en = renderToStaticMarkup(<Gallery locale="en" count="47" />);
    const de = renderToStaticMarkup(<Gallery locale="de" count="47" />);
    expect(de).not.toBe(en);
    expect(de).toContain("Stile");
  });
});

describe("the foot", () => {
  it("carries the gallery and all three legal pages, in every locale", () => {
    for (const locale of LOCALES) {
      const links = hrefs(renderToStaticMarkup(<Foot locale={locale} />));
      expect(links, `${locale} foot drops the gallery`).toContain("/styles");
      const prefix = locale === "de" ? "/de" : "";
      for (const path of ["/legal/terms", "/legal/privacy", "/impressum"]) {
        expect(links, `${locale} foot drops ${path}`).toContain(`${prefix}${path}`);
      }
    }
  });

  /*
   * `localeHref("/styles", "de")` is `/de/styles`, and that route does not
   * exist. Localising this one link would hand every German visitor a 404, so
   * the destination stays English while the label translates.
   */
  it("never points a German visitor at a German gallery that does not exist", () => {
    const links = hrefs(renderToStaticMarkup(<Foot locale="de" />));
    for (const href of links) expect(href).not.toMatch(/^\/de\/styles/);
  });

  it("translates the gallery label even though the path does not move", () => {
    const en = renderToStaticMarkup(<Foot locale="en" />);
    const de = renderToStaticMarkup(<Foot locale="de" />);
    expect(en).toContain("The styles");
    expect(de).toContain("Die Stile");
    expect(de).toContain("Impressum");
  });
});

describe("the home page", () => {
  /**
   * The funnel as the server paints it. Effects do not run, which is the point:
   * this is the markup a crawler and a visitor on a cold load both receive, so
   * a link that only appears after hydration would fail here.
   */
  const html = renderToStaticMarkup(<Funnel styleCount={STYLE_COUNT} />);

  it("links to the gallery", () => {
    expect(hrefs(html)).toContain("/styles");
  });

  it("links to it twice: once in the flow, once in the standing nav", () => {
    const toGallery = hrefs(html).filter((href) => href === "/styles");
    expect(toGallery.length).toBe(2);
  });

  it("states the number of styles the gallery actually lists", () => {
    expect(html).toContain(STYLE_COUNT);
  });

  /* The foot is below the button. A link above it would compete with the
     page's only call to action. */
  it("keeps the standing nav below The Close", () => {
    expect(html.indexOf("close-title")).toBeGreaterThan(-1);
    expect(html.lastIndexOf("/styles")).toBeGreaterThan(html.indexOf("close-title"));
  });
});
