import type { LucideIcon } from "lucide-react"
import { Layers, Workflow, Boxes, FileJson, Plug, Gauge } from "lucide-react"
import type { IconAnimationConfig } from "../types/iconAnimation"

export interface ExpertiseItem {
  title: string
  description: string
  icon: LucideIcon
  /** Optional icon behavior; the implementation lives with the animation utility. */
  iconAnimation?: IconAnimationConfig
}

export const expertiseItems: ExpertiseItem[] = [
  {
    title: "Frontend Foundations",
    icon: Layers,
    iconAnimation: { type: "heap-drop" },
    description:
      "Building SPAs on solid fundamentals (rendering model, reactivity, routing, composition) and organizing code so features, not files, drive structure.",
  },
  {
    title: "UI for Complex Flows",
    icon: Workflow,
    iconAnimation: { type: "workflow-build" },
    description:
      "Turning messy requirements into clear, predictable UI states: empty, loading, success, error; thinking in flows, not screens.",
  },
  {
    title: "Store-Driven Development",
    icon: Boxes,
    iconAnimation: { type: "boxes-separate" },
    description:
      "Designing state as a single source of truth (Pinia / store patterns), where components just render the store instead of improvising their own logic.",
  },
  {
    title: "Schema-First & Contracts",
    icon: FileJson,
    iconAnimation: { type: "document-draw" },
    description:
      "Starting from data shape: Zod / OpenAPI schemas, DTOs, input/output validation, so both frontend and backend share the same contract.",
  },
  {
    title: "Backend Integration",
    icon: Plug,
    iconAnimation: { type: "slide-in" },
    description:
      'Thinking in "request → transform → render": handling async, errors, caching, pagination, optimistic updates, and keeping the UI honest about what the backend can actually do.',
  },
  {
    title: "Reliability & Performance",
    icon: Gauge,
    iconAnimation: { type: "gauge-speed" },
    description:
      "Avoiding surprises: clear loading/error paths, defensive coding around APIs, profiling bottlenecks, and keeping bundles and interactions fast enough for real users.",
  },
]

