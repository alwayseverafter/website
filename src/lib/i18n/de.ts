import type { Catalogue, LegalDocument, LegalSection } from "./en";

/**
 * Die deutsche Fassung.
 *
 * Geschrieben für deutsche Leserinnen und Leser, nicht aus dem Englischen
 * übersetzt. Die Anrede ist das Du, wie im übrigen Produkt auch: ein Sie an
 * dieser Stelle klänge nach Versicherung, und verkauft wird eine Hochzeit.
 *
 * Der Typ stammt aus `en.ts`. Fehlt hier ein Schlüssel, schlägt der Build
 * fehl, und genau so soll es sein. Siehe docs/LESSONS.md R3.
 */

const terms: LegalDocument = {
  kicker: "Rechtliches",
  title: "Nutzungsbedingungen",
  intro:
    "In klarer Sprache, damit du sie in einem Zug lesen kannst. Wenn ein Satz unklar ist, schreib uns, dann formulieren wir ihn neu.",
  sections: [
    {
      heading: "Mit wem du es zu tun hast",
      body: [
        "Always Ever After wird von dem Unternehmen betrieben, das im Impressum steht. Dort findest du die Anschrift, die Kontaktdaten und die steuerliche Registrierung.",
        "Alles Weitere gilt zwischen dir und diesem Unternehmen.",
      ],
    },
    {
      heading: "Was du kaufst",
      body: [
        "Die Einladung ist eine Hochzeitseinladung, veröffentlicht als ein einziger Link, den du an so viele Gäste schickst, wie du möchtest. Du gestaltest sie selbst, und sie ist innerhalb einer Stunde nach dem Kauf online.",
        "Die Auftragsarbeit ist dieselbe Einladung, nur von unserem Atelier nach deinem Briefing gebaut. Sie ist innerhalb von 48 Stunden fertig, und wir nehmen zwölf im Monat an, weil sie ein Mensch baut.",
        "Beides wird einmal pro Hochzeit bezahlt. Es gibt in keiner Variante einen Preis pro Gast, bei keiner Gästezahl.",
      ],
    },
    {
      heading: "Bezahlung",
      body: [
        "Die Zahlung wickelt Stripe als Zahlungsdienstleister ab. Deine Kartendaten gehen an Stripe und niemals an uns.",
        "Auf der deutschen Seite werden alle Preise in Euro und inklusive der gesetzlichen Umsatzsteuer angegeben. Den Betrag, der tatsächlich abgebucht wird, siehst du vollständig, bevor du bestätigst.",
      ],
    },
    {
      heading: "Rückerstattung",
      body: [
        "Solange deine Einladung nicht veröffentlicht ist: volle Rückerstattung, aus jedem Grund, ohne Begründung.",
        "Danach nicht mehr. Die Veröffentlichung ist die Lieferung: der Link ist erreichbar, deine Gäste können ihn öffnen, und damit ist übergeben, was du gekauft hast.",
        "Schreib uns dafür von der E-Mail-Adresse, mit der du bezahlt hast. Wir erstatten auf demselben Weg, auf dem die Zahlung kam, innerhalb von zehn Werktagen.",
      ],
    },
    {
      heading: "Widerrufsrecht für Verbraucher",
      body: [
        "Als Verbraucherin oder Verbraucher hast du grundsätzlich das Recht, diesen Vertrag innerhalb von vierzehn Tagen ohne Angabe von Gründen zu widerrufen. Die Frist beginnt mit dem Vertragsschluss.",
        "Weil wir sofort mit der Arbeit beginnen, bitten wir dich beim Bezahlen ausdrücklich darum, dem sofortigen Beginn zuzustimmen und zur Kenntnis zu nehmen, dass dein Widerrufsrecht mit der vollständigen Erbringung der Leistung erlischt, also mit der Veröffentlichung deiner Einladung (§ 356 Abs. 5 BGB).",
        "Willst du die vierzehn Tage behalten, setz dieses Häkchen nicht. Dann warten wir mit der Veröffentlichung ab.",
        "Für den Widerruf genügt eine formlose Nachricht an unsere E-Mail-Adresse. Ein bestimmtes Formular ist nicht nötig.",
        "Dieses Recht steht neben der Rückerstattungsregelung oben. Keines der beiden verkürzt das andere.",
      ],
    },
    {
      heading: "Deine Worte bleiben deine",
      body: [
        "Eure Namen, euer Datum, eure Texte und jedes Bild, das du hochlädst, bleiben eure. Du erlaubst uns, sie zu speichern und anzuzeigen, damit die Einladung funktioniert, und sonst nichts.",
        "Wir bewerben den Dienst nicht mit eurer Einladung, wir verkaufen nichts davon weiter, und wir zeigen sie niemandem, dem du den Link nicht selbst geschickt hast.",
        "Du sicherst zu, dass du die Rechte an allem hast, was du hochlädst.",
      ],
    },
    {
      heading: "Was wir von dir erwarten",
      body: [
        "Nutze den Dienst nicht für rechtswidrige Zwecke, lade nichts hoch, woran dir die Rechte fehlen, und verwende eine Einladung nicht für unverlangte Massenpost.",
        "Wir dürfen eine Einladung offline nehmen, die dagegen verstößt. Wenn wir das tun, sagen wir dir, weshalb.",
      ],
    },
    {
      heading: "Verfügbarkeit",
      body: [
        "Eine veröffentlichte Einladung bleibt mindestens zwölf Monate über den Hochzeitstag hinaus erreichbar, praktisch so lange, wie es den Dienst gibt.",
        "Keine Website ist jede Sekunde des Jahres erreichbar. Wo wir den Zeitpunkt wählen können, warten wir nachts.",
      ],
    },
    {
      heading: "Grenzen unserer Haftung",
      body: [
        "Wir haften dafür, dass du bekommst, was du gekauft hast, und dafür, es in Ordnung zu bringen, wenn das nicht klappt.",
        "Für mittelbare Schäden und Folgeschäden haften wir nicht, und unsere Haftung ist insgesamt auf den Betrag begrenzt, den du gezahlt hast.",
        "Unberührt bleibt die Haftung, die sich nicht beschränken lässt: bei Vorsatz und grober Fahrlässigkeit, bei der Verletzung von Leben, Körper und Gesundheit, bei arglistig verschwiegenen Mängeln und nach dem Produkthaftungsgesetz. Ebenso unberührt bleibt die Haftung für die Verletzung wesentlicher Vertragspflichten.",
      ],
    },
    {
      heading: "Änderungen",
      body: [
        "Wir können diese Bedingungen für künftige Käufe ändern. Für deinen Kauf gilt die Fassung, die an dem Tag veröffentlicht war, an dem du bezahlt hast. Welche das war, sagt dir das Datum am Fuß dieser Seite.",
      ],
    },
    {
      heading: "Recht und Streitigkeiten",
      body: [
        "Es gilt das Recht am Sitz des Betreibers, der im Impressum genannt ist.",
        "Bist du Verbraucherin oder Verbraucher, nimmt dir diese Rechtswahl niemals den Schutz der zwingenden Vorschriften deines Wohnsitzlandes.",
        "Der Link zur Online-Streitbeilegung der Europäischen Kommission und unsere Haltung zur Verbraucherschlichtung stehen im Impressum.",
      ],
    },
  ],
};

const privacy: LegalDocument = {
  kicker: "Rechtliches",
  title: "Datenschutz",
  intro:
    "Hier steht, was diese Seite tatsächlich tut, nicht das, was eine Vorlage über Seiten im Allgemeinen sagt. Ändert sich die Seite, ändert sich diese Erklärung im selben Commit.",
  sections: [
    {
      heading: "Die kurze Fassung",
      body: [
        "Es gibt hier keine Benutzerkonten. Wenn du eure Namen eingibst, bleiben sie in deinem eigenen Browser und sonst nirgends.",
        "Zu uns gelangen sie in zwei Fällen, die du beide selbst wählst: wenn du dir die Vorschau per E-Mail schicken lässt, oder wenn du dich zum Kauf entscheidest.",
      ],
    },
    {
      heading: "Was in deinem Browser bleibt",
      body: [
        "Sobald du eure Vornamen, euer Hochzeitsdatum und ein Design in die Vorschau einträgst, speichern wir das im Local Storage deines Browsers unter einem einzigen Schlüssel, aea.couple, damit die Seite es beim nächsten Besuch noch weiß.",
        "Dieser Eintrag verlässt dein Gerät nicht von allein. Er wird nicht an uns gesendet, niemand sonst kann ihn lesen, und wenn du die Websitedaten für diese Seite löschst, ist er weg.",
        "Deine Sprachwahl liegt auf demselben Weg unter aea.locale.",
      ],
    },
    {
      heading: "Wenn du dir die Vorschau per E-Mail schicken lässt",
      body: [
        "Unter der Vorschau steht ein freiwilliges Feld. Nichts auf dieser Seite wird zurückgehalten, bis du es ausfüllst, und die Vorschau funktioniert so oder so.",
        "Trägst du eine Adresse ein und setzt das Häkchen, dann speichern wir diese Adresse, die Vornamen und das Datum, die bereits in der Vorschau stehen, das Design, das du gerade ansiehst, deine Sprache und den Zeitpunkt, zu dem du das Häkchen gesetzt hast. Wir speichern das, um dir den Link zu schicken und, falls du nicht gekauft hast, dir ein- oder zweimal dazu zu schreiben.",
        "Außerdem speichern wir einen gesalzenen Einweg-Hash deiner IP-Adresse, um zu verhindern, dass dieselbe Maschine das Formular hundertfach abschickt. Die Adresse selbst wird nicht gespeichert, und der Hash lässt sich nicht in sie zurückverwandeln.",
        "Rechtsgrundlage ist deine Einwilligung, Artikel 6 Absatz 1 Buchstabe a DSGVO. Du kannst sie jederzeit widerrufen, indem du auf eine unserer Nachrichten antwortest oder an die Adresse im Impressum schreibst; dann löschen wir den Eintrag. Der Widerruf ist so einfach wie die Einwilligung.",
        "Ein Eintrag, aus dem kein Kauf wird, wird nach zwölf Monaten gelöscht.",
      ],
    },
    {
      heading: "Cookies",
      body: [
        "Diese Seite setzt keine Cookies. Es gibt kein Cookie-Banner, weil es nichts gibt, wozu wir dich fragen müssten.",
        "Der Bezahlvorgang läuft auf den Seiten von Stripe, und dort setzt Stripe eigene Cookies. Dafür gilt die Datenschutzerklärung von Stripe.",
      ],
    },
    {
      heading: "Was wir messen",
      body: [
        "Wir zählen einige wenige Ereignisse, etwa dass eine Seite erreicht oder ein Bezahlvorgang begonnen wurde, damit wir wissen, ob die Seite funktioniert.",
        "Die Messung ist First-Party und kommt ohne Cookies aus. Sie vergibt keine Kennung, bildet kein Profil und kann dir nicht auf andere Seiten folgen.",
        "Es ist kein Werbenetzwerk, kein soziales Netzwerk und kein fremder Analysedienst in diese Seite eingebunden.",
      ],
    },
    {
      heading: "Server-Protokolle",
      body: [
        "Unser Hoster führt gewöhnliche Zugriffsprotokolle, in denen auch die IP-Adresse einer Anfrage steht. Sie dienen dazu, die Seite auszuliefern und Angriffe abzuwehren. Diese Protokolle sind kurzlebig, und wir werten sie nicht aus, um ein Bild von Besucherinnen und Besuchern zu zeichnen.",
      ],
    },
    {
      heading: "Wenn du kaufst",
      body: [
        "Der Bezahlvorgang ist eine von Stripe gehostete Seite. Deine E-Mail-Adresse und deine Zahlungsdaten gibst du dort bei Stripe ein.",
        "Stripe teilt uns mit, dass die Zahlung erfolgreich war, und übermittelt uns deine E-Mail-Adresse sowie den Betrag. Wir übergeben Stripe die Namen, das Datum und das Design, die du hier gewählt hast, damit deine Einladung gebaut und dir der Link per E-Mail geschickt werden kann.",
        "Stripe verarbeitet Zahlungsdaten als eigenständiger Verantwortlicher nach seiner eigenen Datenschutzerklärung, auch in den Vereinigten Staaten. Die Übermittlung stützt sich auf die Standardvertragsklauseln der Europäischen Kommission.",
      ],
    },
    {
      heading: "Wenn du ein Briefing schickst",
      body: [
        "Ein Briefing für eine Auftragsarbeit kommt als E-Mail an und wird von einem Menschen gelesen. Es bleibt so lange gespeichert, wie das Projekt läuft, und wird danach gelöscht.",
      ],
    },
    {
      heading: "Wie lange wir etwas aufbewahren",
      body: [
        "Unterlagen zu einem Kauf bewahren wir so lange auf, wie das Steuerrecht es verlangt, in Deutschland bis zu zehn Jahre.",
        "Die Messwerte liegen aggregiert vor und enthalten nichts, was auf eine Person zeigt.",
      ],
    },
    {
      heading: "Rechtsgrundlagen",
      body: [
        "Deine Einladung zu bauen, auszuliefern und dafür Zahlung entgegenzunehmen, stützt sich auf Art. 6 Abs. 1 lit. b DSGVO, die Erfüllung eines Vertrags.",
        "Die cookielose Messung und die Abwehr von Angriffen stützen sich auf Art. 6 Abs. 1 lit. f DSGVO, unser berechtigtes Interesse an einem Dienst, der funktioniert und erreichbar bleibt.",
        "Die Aufbewahrung von Kaufunterlagen stützt sich auf Art. 6 Abs. 1 lit. c DSGVO, eine rechtliche Verpflichtung.",
      ],
    },
    {
      heading: "Deine Rechte",
      body: [
        "Dir stehen Auskunft (Art. 15), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch (Art. 21 DSGVO) zu. Schreib formlos an die E-Mail-Adresse im Impressum, wir antworten innerhalb eines Monats.",
        "Außerdem kannst du dich bei einer Datenschutz-Aufsichtsbehörde beschweren, in der Regel bei der deines Wohnsitzlandes.",
      ],
    },
    {
      heading: "Kinder",
      body: [
        "Dieser Dienst richtet sich an Erwachsene. Wir erheben wissentlich nichts von Kindern.",
      ],
    },
  ],
};

const imprint = {
  kicker: "Rechtliches",
  title: "Impressum",
  intro:
    "Diese Angaben müssen von jeder Seite aus erreichbar sein. Sie stehen hier vollständig, in welcher Sprache du auch liest.",
  labels: {
    provider: "Angaben gemäß § 5 DDG",
    represented: "Vertreten durch",
    contact: "Kontakt",
    email: "E-Mail",
    phone: "Telefon",
    vatId: "Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG",
    contentResponsible: "Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV",
    hosting: "Gehostet in",
  },
  sections: [
    {
      heading: "Streitbeilegung",
      body: [
        "Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung bereit: https://ec.europa.eu/consumers/odr",
        "Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.",
      ],
    },
  ] as readonly LegalSection[],
};

export const de: Catalogue = {
  brand: "Always Ever After",

  chrome: {
    switchTo: "Sprache wechseln",
    backHome: "Zurück zum Anfang",
    legal: "Rechtliches",
    skipToContent: "Zum Inhalt springen",
  },

  tiers: {
    invitation: {
      name: "Die Einladung",
      delivery: "In einer Stunde online, selbst gestaltet",
      constraint: "Beliebig viele Gäste",
    },
    commission: {
      name: "Die Auftragsarbeit",
      delivery: "48 Stunden, gebaut in unserem Atelier",
      constraint: "Zwölf im Monat",
    },
    pricedOnce: "Einmal pro Hochzeit, nicht pro Gast",
  },

  legal: {
    updated: "Zuletzt geändert",
    terms,
    privacy,
    imprint,
    nav: {
      terms: "Nutzungsbedingungen",
      privacy: "Datenschutz",
      imprint: "Impressum",
    },
    placeholder: {
      heading: "Diese Seite ist unfertig",
      body: "Die Angaben zum Betreiber sind noch nicht eingetragen. Was unten steht, sind Platzhalter, und dieses Impressum genügt § 5 DDG nicht. Vor dem Livegang müssen die NEXT_PUBLIC_OPERATOR_-Variablen gesetzt werden.",
      missing: "Es fehlen noch",
    },
  },
};
