/**
 * FLIP animation for sliced lucide icons (see ExpertiseCard.tsx).
 *
 * Instead of hardcoded keyframe offsets, the drop distance for each slice
 * is MEASURED: the icon's parent tile is the "Last" (final resting spot).
 * The First is the same position translated up by the drop distance. The
 * browser applies the Invert transform, then plays it to zero - so the
 * stack visually reassembles in its exact final geometry regardless of
 * icon size, tile size, or layout.
 *
 * Each slice gets an own-effect WAAPI animation (keyframes live in JS,
 * not CSS) and durations scale with sqrt(drop) so bigger drops take
 * longer (gravity). No bounce: the fall is two-phase easing instead -
 * gravity acceleration through the bulk of the drop, then a cushioned
 * deceleration through the last stretch into a soft flat landing.
 */

export interface FlipHeapOptions {
  /** Selector for the sliced icon's paths, relative to the svg. */
  pathSelector?: string
  /** Base drop distance (px) at referenceIconSize. Scaled proportionally. */
  dropDistance?: number
  /** Icon render size at which dropDistance is exact. */
  referenceIconSize?: number
  /** Extra distance multiplier for slices higher in the stack. */
  sliceGap?: number
  /** Delay between slices, bottom-up (box first, then chevrons). */
  sliceStaggerMs?: number
  /** Duration of the initial fall for the reference drop distance. */
  fallMs?: number
  /** Delay before the first slice drops. WAAPI backwards fill holds the
      slices at their hidden First keyframe for the entire window, so the
      icon is never visibly at rest before the fall begins. */
  startDelay?: number
  /** Hover-style replay: prepend a short "rest -> hidden" restage phase
       (rise and dissolve to the First position) so the replay reads as
       dissolve-and-refall instead of a hard cut. 0 (default) = start
       already hidden (initial reveal). */
  restageMs?: number
  /** Fires once every slice animation has settled (finished naturally
       or cancelled) - lets callers hand control back, e.g. re-attach the
       scroll-scrubbed CSS timeline after a hover replay. */
  onFinish?: () => void
}

const DEFAULTS: Required<Omit<FlipHeapOptions, "onFinish">> = {
  // :scope is required - a leading combinator ("> path") is invalid in
  // querySelectorAll and throws SyntaxError, silently killing the effect.
  pathSelector: ":scope > path",
  dropDistance: 14,
  referenceIconSize: 16,
  sliceGap: 1.15,
  sliceStaggerMs: 250,
  fallMs: 450,
  startDelay: 0,
  restageMs: 0,
}

/** Whether CSS scroll-driven animations are usable in this browser. */
export function supportsScrollDrivenAnimations(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof CSS !== "undefined" &&
    CSS.supports("animation-timeline: view()")
  )
}

/**
 * Attach the scroll-scrubbed heap assembly (progressive enhancement).
 *
 * The card declares a named view timeline; CSS (see index.css) animates
 * each slice along the card's travel through the viewport, so the stack
 * assembles bottom-up as the user scrolls. This function only does what
 * CSS can't: measure the rendered icon, publish the drop distance as
 * --icon-drop on the tile, and LATCH the timeline (details below). It
 * runs on attach and on the rare IO boundary crossings - nothing
 * executes per scroll frame.
 *
 * Latching fixes the entry-range asymmetry: the fall is bound to the
 * ENTRY range (card crossing the viewport bottom), so scrolling UP past
 * a card would scrub the fall in reverse right at the viewport edge -
 * "scroll up re-triggers the animation" - while scrolling DOWN past it
 * (exit through the top, unbound region) did nothing. The latch makes
 * both directions inert after the first assembly:
 * - ARMED while the card is fully below the viewport (down-scroll
 *   entries get the scrubbed fall; partial-entry reversals stay live).
 * - LATCHED (timeline removed, icon rests in its natural landed state)
 *   once the card's bottom edge has fully entered the viewport - all
 *   later up-scroll passes are completely inert, no edge-of-screen
 *   un-assembling.
 *
 * @returns a cleanup function detaching everything.
 */
export function attachScrollDrivenHeap(
  card: HTMLElement,
  tile: HTMLElement
): () => void {
  // MEASURE: rendered icon size -> scaled base drop (same math as flipHeap)
  let baseDrop = DEFAULTS.dropDistance
  const svg = tile.querySelector("svg")
  if (svg) {
    const rect = svg.getBoundingClientRect()
    const iconSize = Math.min(rect.width, rect.height) || DEFAULTS.referenceIconSize
    baseDrop = DEFAULTS.dropDistance * (iconSize / DEFAULTS.referenceIconSize)
  }

  const arm = () => {
    card.classList.add("icon-heap-card")
    tile.classList.add("icon-heap-scroll")
    tile.style.setProperty("--icon-drop", `${baseDrop.toFixed(2)}px`)
  }
  const latch = () => {
    // Landed natural state: no timeline classes, no lingering transforms -
    // the slices sit exactly where the SVG paints them.
    card.classList.remove("icon-heap-card")
    tile.classList.remove("icon-heap-scroll")
    tile.style.removeProperty("--icon-drop")
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        // Wait for the card to be fully visible before latching. A narrow
        // bottom viewport band latches too early, before the CSS entry
        // range has had a chance to run.
        if (entry.intersectionRatio >= 0.999) {
          latch()
        } else if (!entry.isIntersecting && entry.boundingClientRect.top >= window.innerHeight) {
          // Fully below the fold: re-arm the next downward entry.
          arm()
        }
      }
    },
    {
      root: null,
      threshold: [0, 1],
    }
  )

  // Initial state: arm cards that are below or only partly inside the
  // viewport; cards already fully visible should remain landed.
  if (card.getBoundingClientRect().bottom >= window.innerHeight) {
    arm()
  } else {
    latch()
  }

  observer.observe(card)

  return () => {
    observer.disconnect()
    latch()
  }
}

/** Attach the document-outline draw followed by opposing brace slides. */
export function attachScrollDrivenDocumentDraw(
  card: HTMLElement,
  tile: HTMLElement,
): () => void {
  const svg = tile.querySelector("svg")
  if (!svg) return () => {}

  const paths = Array.from(svg.querySelectorAll<SVGPathElement>(":scope > path"))
  if (paths.length < 4) return () => {}

  paths.forEach((path, index) => {
    if (index < 2) {
      const length = path.getTotalLength()
      path.style.setProperty("--draw-length", `${length}`)
    }
  })

  const arm = () => {
    card.classList.add("icon-draw-card")
    tile.classList.add("icon-document-draw")
  }
  const latch = () => {
    card.classList.remove("icon-draw-card")
    tile.classList.remove("icon-document-draw")
    paths.forEach((path) => path.style.removeProperty("--draw-length"))
  }

  const observer = new IntersectionObserver(([entry]) => {
    if (entry.intersectionRatio >= 0.999) {
      latch()
    } else if (!entry.isIntersecting && entry.boundingClientRect.top >= window.innerHeight) {
      arm()
    }
  }, { threshold: [0, 1] })

  if (card.getBoundingClientRect().bottom >= window.innerHeight) {
    arm()
  } else {
    latch()
  }
  observer.observe(card)

  return () => {
    observer.disconnect()
    latch()
  }
}

/** One-shot fallback for browsers without scroll-driven animation support. */
export function drawDocument(
  container: HTMLElement,
  startDelay = 0,
  onFinish?: () => void,
): () => void {
  const svg = container.querySelector("svg")
  if (!svg) return () => {}
  const paths = Array.from(svg.querySelectorAll<SVGPathElement>(":scope > path"))
  if (paths.length < 4) return () => {}

  const animations: Animation[] = []
  paths.slice(0, 2).forEach((path) => {
    const length = path.getTotalLength()
    animations.push(path.animate(
      [
        { strokeDasharray: `${length}`, strokeDashoffset: `${length}` },
        { strokeDasharray: `${length}`, strokeDashoffset: "0" },
      ],
      { duration: 500, delay: startDelay, fill: "both", easing: "ease-out" },
    ))
  })
  animations.push(paths[2].animate(
    [{ transform: "translateX(-8px)", opacity: 0 }, { transform: "translateX(0)", opacity: 1 }],
    { duration: 350, delay: startDelay + 500, fill: "both", easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
  ))
  animations.push(paths[3].animate(
    [{ transform: "translateX(8px)", opacity: 0 }, { transform: "translateX(0)", opacity: 1 }],
    { duration: 350, delay: startDelay + 500, fill: "both", easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
  ))

  if (onFinish) {
    Promise.all(animations.map((animation) => animation.finished))
      .then(onFinish)
      .catch(() => {})
  }

  return () => animations.forEach((animation) => animation.cancel())
}

/** Attach the workflow build: upper square, connector, then lower square. */
export function attachScrollDrivenWorkflowBuild(
  card: HTMLElement,
  tile: HTMLElement,
): () => void {
  const svg = tile.querySelector("svg")
  if (!svg) return () => {}
  const parts = Array.from(svg.children) as SVGGraphicsElement[]
  if (parts.length < 3) return () => {}

  const connector = parts[1]
  const connectorLength = connector instanceof SVGPathElement
    ? connector.getTotalLength()
    : 24
  connector.style.setProperty("--workflow-line-length", `${connectorLength}`)

  const arm = () => {
    card.classList.add("icon-workflow-card")
    svg.classList.add("icon-workflow-build")
  }
  const latch = () => {
    card.classList.remove("icon-workflow-card")
    svg.classList.remove("icon-workflow-build")
    connector.style.removeProperty("--workflow-line-length")
  }

  const observer = new IntersectionObserver(([entry]) => {
    if (entry.intersectionRatio >= 0.999) {
      latch()
    } else if (!entry.isIntersecting && entry.boundingClientRect.top >= window.innerHeight) {
      arm()
    }
  }, { threshold: [0, 1] })

  if (card.getBoundingClientRect().bottom >= window.innerHeight) {
    arm()
  } else {
    latch()
  }
  observer.observe(card)

  return () => {
    observer.disconnect()
    latch()
  }
}

/** One-shot fallback for browsers without scroll-driven animation support. */
export function buildWorkflow(
  container: HTMLElement,
  startDelay = 0,
  onFinish?: () => void,
): () => void {
  const svg = container.querySelector("svg")
  if (!svg) return () => {}
  const parts = Array.from(svg.children) as SVGGraphicsElement[]
  if (parts.length < 3) return () => {}

  const [upperSquare, connector, lowerSquare] = parts
  const connectorLength = connector instanceof SVGPathElement
    ? connector.getTotalLength()
    : 24
  const animations: Animation[] = [
    upperSquare.animate(
      [{ transform: "translateY(-8px)", opacity: 0 }, { transform: "translateY(0)", opacity: 1 }],
      { duration: 350, delay: startDelay, fill: "both", easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
    ),
    connector.animate(
      [{ strokeDasharray: `${connectorLength}`, strokeDashoffset: `${connectorLength}` }, { strokeDasharray: `${connectorLength}`, strokeDashoffset: "0" }],
      { duration: 300, delay: startDelay + 350, fill: "both", easing: "ease-out" },
    ),
    lowerSquare.animate(
      [{ transform: "translateX(8px)", opacity: 0 }, { transform: "translateX(0)", opacity: 1 }],
      { duration: 350, delay: startDelay + 650, fill: "both", easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
    ),
  ]

  if (onFinish) {
    Promise.all(animations.map((animation) => animation.finished)).then(onFinish).catch(() => {})
  }
  return () => animations.forEach((animation) => animation.cancel())
}

/** Attach a whole-icon upward slide for simple, inseparable glyphs. */
export function attachScrollDrivenSlideIn(
  card: HTMLElement,
  tile: HTMLElement,
): () => void {
  const svg = tile.querySelector("svg")
  if (!svg) return () => {}

  const arm = () => {
    card.classList.add("icon-slide-card")
    svg.classList.add("icon-slide-in")
  }
  const latch = () => {
    card.classList.remove("icon-slide-card")
    svg.classList.remove("icon-slide-in")
  }

  const observer = new IntersectionObserver(([entry]) => {
    if (entry.intersectionRatio >= 0.999) {
      latch()
    } else if (!entry.isIntersecting && entry.boundingClientRect.top >= window.innerHeight) {
      arm()
    }
  }, { threshold: [0, 1] })

  if (card.getBoundingClientRect().bottom >= window.innerHeight) {
    arm()
  } else {
    latch()
  }
  observer.observe(card)

  return () => {
    observer.disconnect()
    latch()
  }
}

/** One-shot fallback for browsers without scroll-driven animation support. */
export function slideIn(
  container: HTMLElement,
  startDelay = 0,
  onFinish?: () => void,
): () => void {
  const svg = container.querySelector("svg")
  if (!svg) return () => {}

  const animation = svg.animate(
    [
      { transform: "translateY(10px)", opacity: 0 },
      { transform: "translateY(0)", opacity: 1 },
    ],
    { duration: 450, delay: startDelay, fill: "both", easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
  )
  if (onFinish) animation.finished.then(onFinish).catch(() => {})
  return () => animation.cancel()
}

/** Attach three synchronized cube groups moving in from their radial paths. */
export function attachScrollDrivenBoxesSeparate(
  card: HTMLElement,
  tile: HTMLElement,
): () => void {
  const svg = tile.querySelector("svg")
  if (!svg) return () => {}
  const parts = Array.from(svg.children) as SVGGraphicsElement[]
  if (parts.length < 12) return () => {}

  const arm = () => {
    card.classList.add("icon-boxes-card")
    svg.classList.add("icon-boxes-separate")
  }
  const latch = () => {
    card.classList.remove("icon-boxes-card")
    svg.classList.remove("icon-boxes-separate")
  }

  const observer = new IntersectionObserver(([entry]) => {
    if (entry.intersectionRatio >= 0.999) {
      latch()
    } else if (!entry.isIntersecting && entry.boundingClientRect.top >= window.innerHeight) {
      arm()
    }
  }, { threshold: [0, 1] })

  if (card.getBoundingClientRect().bottom >= window.innerHeight) {
    arm()
  } else {
    latch()
  }
  observer.observe(card)

  return () => {
    observer.disconnect()
    latch()
  }
}

/** One-shot fallback for browsers without scroll-driven animation support. */
export function separateBoxes(
  container: HTMLElement,
  startDelay = 0,
  onFinish?: () => void,
): () => void {
  const svg = container.querySelector("svg")
  if (!svg) return () => {}
  const parts = Array.from(svg.children) as SVGGraphicsElement[]
  if (parts.length < 12) return () => {}

  const groups = [
    { parts: parts.slice(0, 4), transform: "translate(-10px, 8px)", delay: 0 },
    { parts: parts.slice(8, 12), transform: "translateY(-12px)", delay: 450 },
    { parts: parts.slice(4, 8), transform: "translate(10px, 8px)", delay: 900 },
  ]
  const animations = groups.flatMap(({ parts: group, transform, delay }) =>
    group.map((part) => part.animate(
      [{ transform, opacity: 0 }, { transform: "translate(0, 0)", opacity: 1 }],
      { duration: 400, delay: startDelay + delay, fill: "both", easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
    )),
  )

  if (onFinish) Promise.all(animations.map((animation) => animation.finished)).then(onFinish).catch(() => {})
  return () => animations.forEach((animation) => animation.cancel())
}

/** Attach gauge speed: draw the arc, then swing the needle from its pivot. */
export function attachScrollDrivenGaugeSpeed(
  card: HTMLElement,
  tile: HTMLElement,
): () => void {
  const svg = tile.querySelector("svg")
  if (!svg) return () => {}
  const parts = Array.from(svg.children) as SVGGraphicsElement[]
  if (parts.length < 2) return () => {}

  const arc = parts[1]
  const arcLength = arc instanceof SVGPathElement ? arc.getTotalLength() : 60
  arc.style.setProperty("--gauge-arc-length", `${arcLength}`)

  const arm = () => {
    card.classList.add("icon-gauge-card")
    svg.classList.add("icon-gauge-speed")
    svg.style.setProperty("--gauge-needle-start", "rotate(-165deg)")
  }
  const latch = () => {
    card.classList.remove("icon-gauge-card")
    svg.classList.remove("icon-gauge-speed")
    svg.style.removeProperty("--gauge-needle-start")
    arc.style.removeProperty("--gauge-arc-length")
  }

  const observer = new IntersectionObserver(([entry]) => {
    if (entry.intersectionRatio >= 0.999) {
      latch()
    } else if (!entry.isIntersecting && entry.boundingClientRect.top >= window.innerHeight) {
      arm()
    }
  }, { threshold: [0, 1] })

  if (card.getBoundingClientRect().bottom >= window.innerHeight) {
    arm()
  } else {
    latch()
  }
  observer.observe(card)

  return () => {
    observer.disconnect()
    latch()
  }
}

/** One-shot fallback for browsers without scroll-driven animation support. */
export function animateGaugeSpeed(
  container: HTMLElement,
  startDelay = 0,
  onFinish?: () => void,
): () => void {
  const svg = container.querySelector("svg")
  if (!svg) return () => {}
  const parts = Array.from(svg.children) as SVGGraphicsElement[]
  if (parts.length < 2) return () => {}

  const [needle, arc] = parts
  const arcLength = arc instanceof SVGPathElement ? arc.getTotalLength() : 60
  needle.style.transformBox = "fill-box"
  needle.style.transformOrigin = "0 100%"
  const animations: Animation[] = [
    arc.animate(
      [
        { strokeDasharray: `${arcLength}`, strokeDashoffset: `${arcLength}` },
        { strokeDasharray: `${arcLength}`, strokeDashoffset: "0" },
      ],
      { duration: 500, delay: startDelay, fill: "both", easing: "ease-out" },
    ),
    needle.animate(
      [
        { transform: "rotate(-165deg)", opacity: 1 },
        { transform: "rotate(0deg)", opacity: 1 },
      ],
      { duration: 400, delay: startDelay + 500, fill: "both", easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
    ),
  ]

  Promise.all(animations.map((animation) => animation.finished))
    .then(() => {
      onFinish?.()
    })
    .catch(() => {})
  return () => {
    animations.forEach((animation) => animation.cancel())
    needle.style.removeProperty("transform-box")
    needle.style.removeProperty("transform-origin")
  }
}

/* --- Easing library for the fall, named so tuning is a one-line change ---
 *
 * GRAVITY: accelerating fall (fast start of impact at the end). The
 *   y = x^2-ish curve of a real drop.
 * CUSHION: soft deceleration through the landing stretch - like air
 *   resistance / magnetic damping stacking up as the slice approaches
 *   its final resting spot.
 * HOLD: linear (irrelevant; the slice is at rest).
 */
const EASE_GRAVITY = "cubic-bezier(0.55, 0, 1, 0.45)"
const EASE_CUSHION = "cubic-bezier(0.25, 0.1, 0.25, 1)"
/** Fraction of the fall spent decelerating into the landing (cushion). */
const CUSHION_FRACTION = 0.25

/** Gravity-calibrated fall duration: t = k * sqrt(dist). */
function fallDurationFor(drop: number, refMs: number, refDrop: number): number {
  return refMs * Math.sqrt(Math.max(drop, 1) / refDrop)
}

/**
 * Run FLIP heap-drop on a sliced icon.
 * @returns a cleanup function cancelling all animations.
 */
export function flipHeap(
  container: HTMLElement,
  options: FlipHeapOptions = {}
): () => void {
  const opts = { ...DEFAULTS, ...options }

  // Errors here (bad selector, missing svg) previously died silently
  // inside a setTimeout - surface them instead.
  try {
    const svg = container.querySelector("svg")
    if (!svg) return () => {}

    const paths = Array.from(
      svg.querySelectorAll<SVGPathElement>(opts.pathSelector)
    )
    // Fallback: any flat child geometry (for icons that use e.g. <rect>)
    const slices = (
      paths.length > 0
        ? paths
        : (Array.from(svg.children) as SVGPathElement[])
    ).reverse()
    if (slices.length === 0) return () => {}

    // MEASURE: final resting rect of the icon (the Last position).
    const svgRect = svg.getBoundingClientRect()
    const iconSize =
      Math.min(svgRect.width, svgRect.height) || opts.referenceIconSize
    // Scale drop with rendered size so the amplitude feels the same at w-4 and w-6
    const sizeScale = iconSize / opts.referenceIconSize
    const baseDrop = opts.dropDistance * sizeScale

    const animations: Array<Animation> = []

    const fallByIndex = slices.map((_, i) =>
      fallDurationFor(
        baseDrop * Math.pow(opts.sliceGap, i),
        opts.fallMs,
        baseDrop
      )
    )

    const runDrop = (path: SVGPathElement, stackIndex: number) => {
      // Per-slice drop: higher slices fall from proportionally higher up
      const drop = baseDrop * Math.pow(opts.sliceGap, stackIndex)
      // Gravity: larger drops take sqrt() longer
      const fallMs = fallByIndex[stackIndex]

      // Two-phase fall: gravity easing through the first (1 - CUSHION_FRACTION)
      // of the distance, cushioned deceleration through the final stretch.
      const cushionStartY = -drop * CUSHION_FRACTION
      const landMs = fallMs * (1 - CUSHION_FRACTION)

      // Timeline layout:
      //   restage mode (hover replay):
      //     [restageMs collective dissolve-up] [holdHidden stagger] [fallMs]
      //     The dissolve is SHARED: uniform delay, so the whole icon lifts
      //     and fades out as ONE piece. The bottom-up stagger lives in the
      //     hidden hold between dissolve and fall.
      //   one-shot mode (initial reveal):
      //     [fallMs] with delay-based stagger - backwards fill keeps every
      //     slice hidden until its own fall begins.
      const restage = opts.restageMs > 0
      const holdHiddenMs = restage ? stackIndex * opts.sliceStaggerMs : 0
      const delay = restage
        ? opts.startDelay
        : opts.startDelay + stackIndex * opts.sliceStaggerMs
      const fallStartMs = restage ? opts.restageMs + holdHiddenMs : 0

      const duration = fallStartMs + fallMs
      // Offset helper: map a moment in timeline time to a keyframe offset.
      // Explicit offsets everywhere - WAAPI throws TypeError on
      // non-monotonic offsets, and implicit distribution around a
      // mid-array offset:1 frame caused exactly that (silently, via the
      // catch below) in the previous version.
      const t = (ms: number) => ms / duration

      const frames: Keyframe[] = []

      if (restage) {
        frames.push(
          // Start from the resting state (where a hover finds the slice)
          { transform: "translateY(0px)", opacity: 1, easing: EASE_CUSHION, offset: 0 },
          // Rise and dissolve back to the First position - every slice
          // runs this at the SAME time (uniform delay), so the icon
          // vanishes as one piece, not slice by slice
          { transform: `translateY(${-drop}px)`, opacity: 0, offset: t(opts.restageMs) },
          // Hidden hold: this slice waits (already invisible) for its
          // turn to fall - this carries the bottom-up stagger
          { transform: `translateY(${-drop}px)`, opacity: 0, easing: EASE_GRAVITY, offset: t(fallStartMs) },
        )
      } else {
        frames.push(
          // First (measured): the slice sits `drop` px above its final
          // spot; backwards fill holds it hidden through the stagger delay
          { transform: `translateY(${-drop}px)`, opacity: 0, easing: EASE_GRAVITY, offset: 0 },
        )
      }

      frames.push(
        // Gravity phase ends here: still moving fast, entering the cushion
        { transform: `translateY(${cushionStartY}px)`, opacity: 1, easing: EASE_CUSHION, offset: t(fallStartMs + landMs) },
        // Land: cushioned to its final measured spot
        { transform: "translateY(0px)", opacity: 1, offset: t(fallStartMs + fallMs) },
      )

      const anim = path.animate(frames, {
        duration,
        delay,
        fill: "both",
        iterations: 1,
      })
      // One-shots: release the animation once finished. With fill
      // "both" it would keep applying transform/opacity forever and
      // stack with every later replay - and a stale filled WAAPI
      // animation overrides the re-attached scroll-scrub timeline
      // (WAAPI beats CSS animations in the cascade). cancel() reverts
      // the slice to its natural SVG styles, which are exactly the
      // landed state, so the handoff is seamless. No inline styles
      // are pinned - the slice stays fully controllable by CSS.
      anim.finished.then(() => anim.cancel()).catch(() => {})
      animations.push(anim)
    }

    // Bottom-up: LAST path (the box) lands first, upper slices follow.
    slices.forEach((path, i) => runDrop(path, i))

    // Single "all settled" signal. Fires EXACTLY ONCE: both
    // natural finishes and cleanup cancels settle the same promises, so
    // a plain counter could cross the threshold twice (stale fire).
    if (opts.onFinish) {
      let fired = false
      let settled = 0
      const onSettled = () => {
        if (fired) return
        settled++
        if (settled >= animations.length) {
          fired = true
          opts.onFinish!()
        }
      }
      // finished promise settles when each animation finishes or is
      // cancelled - either way, all slices are done.
      animations.forEach(a => {
        a.finished.then(onSettled).catch(onSettled)
      })
    }

    return () => {
      animations.forEach(a => a.cancel())
    }
  } catch (err) {
    console.error("[flipHeap] failed to start:", err)
    return () => {}
  }
}
