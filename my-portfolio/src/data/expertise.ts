export interface ExpertiseItem {
  title: string
  description: string
  accentColor?: string
}

export const expertiseItems: ExpertiseItem[] = [
  {
    title: "Frontend Foundations",
    description:
      "Building SPAs on solid fundamentals – rendering model, reactivity, routing, composition – and organizing code so features, not files, drive structure.",
  },
  {
    title: "UI for Complex Flows",
    description:
      "Turning messy requirements into clear, predictable UI states: empty, loading, success, error; thinking in flows, not screens.",
  },
  {
    title: "Store-Driven Development",
    description:
      "Designing state as a single source of truth (Pinia / store patterns), where components just render the store instead of improvising their own logic.",
  },
  {
    title: "Schema-First & Contracts",
    description:
      "Starting from data shape: Zod / OpenAPI schemas, DTOs, input/output validation, so both frontend and backend share the same contract.",
  },
  {
    title: "Backend Integration",
    description:
      'Thinking in "request → transform → render": handling async, errors, caching, pagination, optimistic updates, and keeping the UI honest about what the backend can actually do.',
  },
  {
    title: "Reliability & Performance",
    description:
      "Avoiding surprises: clear loading/error paths, defensive coding around APIs, profiling bottlenecks, and keeping bundles and interactions fast enough for real users.",
  },
]

