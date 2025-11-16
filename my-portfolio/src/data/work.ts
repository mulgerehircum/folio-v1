export interface WorkExperience {
  company: string
  role: string
  period: string
  location: string
  responsibilities: string[]
}

export const workExperience: WorkExperience = {
  company: "Sirius.expert",
  role: "Frontend Developer",
  period: "December 2024 - Now",
  location: "Chisinau, Moldova",
  responsibilities: [
    "Took ownership of the frontend codebase, implementing most of the current structure, shared patterns, and feature foundations",
    "Built the editable table engine with inline validation, dynamic rows and drag-and-drop",
    "Implemented multi-document tab editing for invoices/offers",
    "Defined responsive behavior logic and implemented mobile-first adaptations for complex data-heavy screens.",
    "Led a major structural rewrite, introducing clearer separation of concerns using MVC-inspired architecture",
    "Established rigid-but-flexible best-practice patterns: composition-first components, schema-driven UI, predictable store-driven state flow",
    "Designed and built multiple product landing pages with UX-first reasoning and performance-focused implementation",
    "Architecture cleanup, shared store patterns, and continuous performance improvements",
    "Maintained a high PR output and code ownership across the project's core features and architectural layers",
  ],
}

