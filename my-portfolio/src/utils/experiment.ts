/**
 * Card-treatment A/B test: does an inline live iframe out-convert the
 * existing video embed on project link clicks?
 *
 * Deliberately stateless — no sessionStorage/localStorage. Lantern's own
 * tracker commits to "no cookies, no localStorage identity, no session
 * stitching" as a load-bearing privacy claim (see lantern-analytics'
 * packages/tracker/docs/design.md), so persisting a sticky bucket assignment
 * client-side would cut against that. A fresh pick per page load is enough
 * here: each ProjectCard mount computes its variant once (cached in
 * component state, not recomputed on re-render) and reports it as one
 * impression — the portfolio doesn't have reload-heavy, multi-visit-per-day
 * traffic where cross-session stickiness would meaningfully change results.
 */
export type CardVariant = "video" | "iframe"

export function pickCardVariant(): CardVariant {
    return Math.random() < 0.5 ? "video" : "iframe"
}
