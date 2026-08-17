/**
 * Card-treatment A/B test: does an inline live iframe out-convert the
 * existing video embed on project link clicks?
 *
 * Deliberately stateless — no sessionStorage/localStorage. Lantern's own
 * tracker commits to "no cookies, no localStorage identity, no session
 * stitching" as a load-bearing privacy claim (see lantern-analytics'
 * packages/tracker/docs/design.md), so persisting a sticky bucket assignment
 * client-side would cut against that. A fresh pick per page load is enough
 * here: the portfolio doesn't have reload-heavy, multi-visit-per-day traffic
 * where cross-session stickiness would meaningfully change results.
 *
 * One variant per page load, not one per card: every eligible ProjectCard
 * reads the same module-scoped assignment (computed lazily, once, on first
 * read) rather than each card rolling its own — otherwise a page with
 * multiple experiment-eligible cards could show one as video and another as
 * iframe at the same time, which isn't the treatment being tested.
 */
export type CardVariant = "video" | "iframe"

let pageVariant: CardVariant | null = null

export function getExperimentVariant(): CardVariant {
    if (pageVariant === null) {
        pageVariant = Math.random() < 0.5 ? "video" : "iframe"
    }
    return pageVariant
}
