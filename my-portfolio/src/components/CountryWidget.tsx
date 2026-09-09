import { useEffect, useState } from "react"
import { useInView } from "../hooks/useInView"
import { trackEvent } from "../utils/analytics"

const WIDGET_ENDPOINT =
  "https://dashboard-rho-one-10.vercel.app/api/widget/country-uniques?siteId=andrii-portfolio&country=UA"

// Below this the widget stays hidden — "2 visitors from Ukraine" reads as
// an admission nobody came, not social proof. Flip to a plain sentence when
// the count crosses it.
const MIN_VISIBLE_UNIQUES = 3
const COUNT_UP_DURATION_MS = 900

/**
 * Live social-proof line for the Contact section: how many unique visitors
 * from Ukraine this portfolio has had, straight from Lantern (dogfooding —
 * the widget's own number is served by the analytics project it shows off).
 *
 * Deliberate behaviors:
 * - The wrapper div (always rendered) is what's observed for in-view; the
 *   fetch fires only when Contact is actually scrolled to, not on load.
 * - On any failure (network, non-200, malformed body, count below
 *   MIN_VISIBLE_UNIQUES) the widget renders nothing at all. A dead
 *   social-proof line is worse than no line.
 * - Count-up animation on the number, honoring prefers-reduced-motion
 *   (snaps straight to the final value).
 * - The "unique" wording is honest: isNewVisit pageviews counted per
 *   country (see Lantern's tracker docs) — repeat visits don't inflate it.
 */
function CountryWidget() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.5, once: true })
  const [uniques, setUniques] = useState<number | null>(null)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [displayCount, setDisplayCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    let cancelled = false

    fetch(WIDGET_ENDPOINT)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`status ${res.status}`))))
      .then((data: { uniques?: unknown }) => {
        if (cancelled) return
        if (typeof data.uniques === "number" && data.uniques >= MIN_VISIBLE_UNIQUES) {
          setReducedMotion(
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
          )
          setUniques(data.uniques)
          trackEvent("country_widget_view", { uniques: data.uniques })
        }
      })
      .catch(() => {
        // Silent by design — see the component doc comment.
      })

    return () => {
      cancelled = true
    }
  }, [inView])

  useEffect(() => {
    // Reduced motion never animates — the render below shows the final
    // number directly, so there's nothing for this effect to do.
    if (uniques === null || reducedMotion) return
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / COUNT_UP_DURATION_MS, 1)
      // Ease-out cubic — fast start, gentle settle onto the final number.
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayCount(Math.round(eased * (uniques as number)))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [uniques, reducedMotion])

  const shownCount = reducedMotion ? uniques : displayCount

  return (
    <div ref={ref} className="w-full max-w-xl mt-4 min-h-[1px]">
      {uniques !== null && (
        <div
          className="flex items-center gap-3 border border-cyan-400/20 bg-zinc-950/40 rounded-xl px-5 py-3.5 backdrop-blur-sm country-widget-inner"
        >
          {/* Minimal two-stripe flag glyph — no emoji, matches the icon system */}
          <span className="flex flex-col w-6 rounded-[3px] overflow-hidden shrink-0 border border-white/10">
            <span className="block h-3 bg-[#0057B7]" />
            <span className="block h-3 bg-[#FFD700]" />
          </span>
          <p className="text-sm text-zinc-300 leading-snug">
            {/* Animated counter is presentation-only; screen readers get the
                final number once, not 60 rAF updates. */}
            <span aria-hidden="true" className="font-semibold text-cyan-400 tabular-nums">
              {shownCount}
            </span>
            <span className="sr-only">
              {uniques} {uniques === 1 ? "visitor has" : "visitors have"} already been here
              from Ukraine — counted by Lantern, my own privacy-first analytics project.
            </span>
            <span aria-hidden="true">
              {" "}
              {uniques === 1 ? "visitor has" : "visitors have"} already been here from
              Ukraine — counted by <span className="text-zinc-200">Lantern</span>, my own
              privacy-first analytics project.
            </span>
          </p>
        </div>
      )}
      <style>{`
        @keyframes country-widget-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .country-widget-inner {
          animation: country-widget-in 500ms ease-out both;
        }
        @media (prefers-reduced-motion: reduce) {
          .country-widget-inner {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}

export default CountryWidget
