import { useCallback, useEffect, useRef } from "react"
import type { LucideIcon } from "lucide-react"
import {
  flipHeap,
  attachScrollDrivenHeap,
  attachScrollDrivenDocumentDraw,
  attachScrollDrivenWorkflowBuild,
  drawDocument,
  buildWorkflow,
  attachScrollDrivenSlideIn,
  slideIn,
  attachScrollDrivenBoxesSeparate,
  separateBoxes,
  attachScrollDrivenGaugeSpeed,
  animateGaugeSpeed,
  supportsScrollDrivenAnimations,
} from "../utils/flipHeap"
import { isBoxesSeparateAnimation, isDocumentDrawAnimation, isGaugeSpeedAnimation, isHeapDropAnimation, isSlideInAnimation, isWorkflowBuildAnimation } from "../types/iconAnimation"
import type { IconAnimationConfig } from "../types/iconAnimation"
import { trackExpertiseIconHover } from "../utils/analytics"

interface ExpertiseCardProps {
  title: string
  description: string
  icon: LucideIcon
  iconAnimation?: IconAnimationConfig
  isVisible: boolean
  enterDelayMs?: number
}

const HOVER_RESTAGE_MS = 200
const HOVER_FALL_MS = 380

function ExpertiseCard({
  title,
  description,
  icon: Icon,
  iconAnimation,
  isVisible,
  enterDelayMs = 0,
}: ExpertiseCardProps) {
  const hasHeapAnimation = isHeapDropAnimation(iconAnimation)
  const hasDocumentDraw = isDocumentDrawAnimation(iconAnimation)
  const hasWorkflowBuild = isWorkflowBuildAnimation(iconAnimation)
  const hasSlideIn = isSlideInAnimation(iconAnimation)
  const hasBoxesSeparate = isBoxesSeparateAnimation(iconAnimation)
  const hasGaugeSpeed = isGaugeSpeedAnimation(iconAnimation)
  const tileRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const scrollCleanupRef = useRef<(() => void) | null>(null)
  const timeCleanupRef = useRef<(() => void) | null>(null)
  // Generation counter: a new hover supersedes any in-flight replay;
  // stale onFinish callbacks check it before re-attaching the scroll
  // timeline (prevents a dead heat between "replay finished" and "newer
  // replay started").
  const hoverGenRef = useRef(0)

  const detachScrollTimeline = useCallback(() => {
    scrollCleanupRef.current?.()
    scrollCleanupRef.current = null
  }, [])

  const attachScrollTimeline = useCallback(() => {
    if (!cardRef.current || !tileRef.current) return
    detachScrollTimeline()
    scrollCleanupRef.current = hasHeapAnimation
      ? attachScrollDrivenHeap(cardRef.current, tileRef.current)
      : hasDocumentDraw
        ? attachScrollDrivenDocumentDraw(cardRef.current, tileRef.current)
        : hasWorkflowBuild
          ? attachScrollDrivenWorkflowBuild(cardRef.current, tileRef.current)
          : hasSlideIn
            ? attachScrollDrivenSlideIn(cardRef.current, tileRef.current)
            : hasBoxesSeparate
              ? attachScrollDrivenBoxesSeparate(cardRef.current, tileRef.current)
              : attachScrollDrivenGaugeSpeed(cardRef.current, tileRef.current)
  }, [
    detachScrollTimeline,
    hasHeapAnimation,
    hasDocumentDraw,
    hasWorkflowBuild,
    hasSlideIn,
    hasBoxesSeparate,
  ])

  // Scroll-scrubbed mode: attach ONCE at mount. A scrubbed timeline is
  // stateless - it can't be "burned" below the fold like a one-shot can;
  // scrolling away and back simply replays it. Hover replays detach it
  // for their duration and re-attach via the onFinish callback.
  useEffect(() => {
    if ((!hasHeapAnimation && !hasDocumentDraw && !hasWorkflowBuild && !hasSlideIn && !hasBoxesSeparate && !hasGaugeSpeed) || !tileRef.current || !cardRef.current) return
    if (!supportsScrollDrivenAnimations()) return

    attachScrollTimeline()
    return () => {
      scrollCleanupRef.current?.()
      scrollCleanupRef.current = null
    }
  }, [hasHeapAnimation, hasDocumentDraw, hasWorkflowBuild, hasSlideIn, hasBoxesSeparate, hasGaugeSpeed, attachScrollTimeline])

  // Time-based fallback mode: the one-shot waits for `isVisible` and honors
  // reduced motion, while supported browsers use the scroll timeline above.
  useEffect(() => {
    if (!isVisible || (!hasHeapAnimation && !hasDocumentDraw && !hasWorkflowBuild && !hasSlideIn && !hasBoxesSeparate && !hasGaugeSpeed) || !tileRef.current) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    if (!supportsScrollDrivenAnimations()) {
      // Fallback for browsers without scroll timelines: one-time WAAPI
      // play (hidden through the delay window, never "resting then
      // vanishing").
      timeCleanupRef.current = hasHeapAnimation
        ? flipHeap(tileRef.current, { startDelay: enterDelayMs })
        : hasDocumentDraw
          ? drawDocument(tileRef.current, enterDelayMs)
          : hasWorkflowBuild
            ? buildWorkflow(tileRef.current, enterDelayMs)
            : hasSlideIn
              ? slideIn(tileRef.current, enterDelayMs)
              : hasBoxesSeparate
                ? separateBoxes(tileRef.current, enterDelayMs)
                : animateGaugeSpeed(tileRef.current, enterDelayMs)
    }

    return () => {
      timeCleanupRef.current?.()
      timeCleanupRef.current = null
    }
  }, [isVisible, hasHeapAnimation, hasDocumentDraw, hasWorkflowBuild, hasSlideIn, hasBoxesSeparate, hasGaugeSpeed, enterDelayMs])

  // Hover replay: dissolve-up + refall, once per hover. The scroll-
  // scrubbed timeline is detached for the replay (its CSS transforms
  // would fight the WAAPI ones) and re-attached when the last slice
  // settles. Honors reduced motion. Also fires a custom Lantern event
  // so hover engagement on the new animated icons is visible in the
  // dashboard alongside Lantern's automatic heatmap clicks.
  const handleHoverReplay = () => {
    if ((!hasHeapAnimation && !hasDocumentDraw && !hasWorkflowBuild && !hasSlideIn && !hasBoxesSeparate && !hasGaugeSpeed) || !tileRef.current) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    trackExpertiseIconHover(title, iconAnimation?.type ?? "none")

    const gen = ++hoverGenRef.current
    detachScrollTimeline()
    timeCleanupRef.current?.()
    timeCleanupRef.current = hasHeapAnimation
      ? flipHeap(tileRef.current, {
          restageMs: HOVER_RESTAGE_MS,
          fallMs: HOVER_FALL_MS,
          sliceStaggerMs: 120,
          onFinish: () => {
            // Only the latest replay re-attaches the timeline
            if (gen === hoverGenRef.current) attachScrollTimeline()
          },
        })
      : hasDocumentDraw
        ? drawDocument(tileRef.current, 0, () => {
          // Only the latest replay re-attaches the timeline
          if (gen === hoverGenRef.current) attachScrollTimeline()
        })
        : hasWorkflowBuild
          ? buildWorkflow(tileRef.current, 0, () => {
            if (gen === hoverGenRef.current) attachScrollTimeline()
          })
          : hasSlideIn
            ? slideIn(tileRef.current, 0, () => {
              if (gen === hoverGenRef.current) attachScrollTimeline()
            })
            : hasBoxesSeparate
              ? separateBoxes(tileRef.current, 0, () => {
                if (gen === hoverGenRef.current) attachScrollTimeline()
              })
              : animateGaugeSpeed(tileRef.current, 0, () => {
                  if (gen === hoverGenRef.current) attachScrollTimeline()
                })
  }

  // Unmount: clear every attachment
  useEffect(() => {
    return () => {
      scrollCleanupRef.current?.()
      timeCleanupRef.current?.()
    }
  }, [])

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleHoverReplay}
      className="rounded-xl border border-cyan-400/20 bg-zinc-950/40 backdrop-blur-sm px-6 py-5 transition-colors duration-300 hover:border-cyan-400/40"
    >
      <div className="flex items-center gap-3 mb-2">
        <div ref={tileRef} className="w-8 h-8 shrink-0 rounded-md bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
          <Icon className={`w-4 h-4 text-cyan-400 ${hasHeapAnimation ? "icon-flip-heap" : hasDocumentDraw ? "icon-document-draw" : hasWorkflowBuild ? "icon-workflow-build" : hasSlideIn ? "icon-slide-in" : hasBoxesSeparate ? "icon-boxes-separate" : hasGaugeSpeed ? "icon-gauge-speed" : ""}`} aria-hidden="true" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-100">{title}</h3>
      </div>
      <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
    </div>
  )
}

export default ExpertiseCard
