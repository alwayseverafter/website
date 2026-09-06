/**
 * The funnel's event contract.
 *
 * The objective is sales, so the funnel is measured end to end. `mirror_named`
 * is the event the whole design is a bet on: the hypothesis is that naming
 * predicts buying more strongly than anything else on the page.
 *
 * No provider is wired yet. Events go to the console in development and are
 * dropped in production until a cookieless, first party tool is chosen. That is
 * deliberate: shipping a Meta pixel onto a page whose entire argument is
 * restraint would be the first thing a visitor saw, in a cookie banner.
 */

export type FunnelEvent =
  | { name: "door_shown" }
  | { name: "door_opened" }
  | { name: "arrival_depth"; depth: 25 | 50 | 75 | 100 }
  | { name: "mirror_named" }
  | { name: "style_selected"; theme: string }
  | { name: "tiers_viewed" }
  /* The opt in under The Mirror. Named, then chose to be written to. */
  | { name: "lead_captured" }
  | { name: "checkout_started"; tier: Tier }
  | { name: "purchase"; tier: Tier; amount: number }
  | { name: "commission_enquiry" };

export type Tier = "invitation" | "commission";

/** Fired at most once per event name per page view. */
const seen = new Set<string>();

export function track(event: FunnelEvent, once = false): void {
  if (once) {
    if (seen.has(event.name)) return;
    seen.add(event.name);
  }
  if (process.env.NODE_ENV === "development") {
    console.info("[funnel]", event);
  }
}
