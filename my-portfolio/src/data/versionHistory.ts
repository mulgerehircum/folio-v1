export interface VersionHistoryItem {
  version: string
  date: string
  changes: string[]
}

export const versionHistory: VersionHistoryItem[] = [
  {
    version: "1.3.0",
    date: "2026-07-22",
    changes: ["Added Dataroom project"],
  },
  {
    version: "1.2.0",
    date: "2026-07-10",
    changes: ["Added PDFloom project"],
  },
  {
    version: "1.1.0",
    date: "2025-12-03",
    changes: ["Added Projects section"],
  },
  {
    version: "1.0.0",
    date: "2025-11-16",
    changes: ["Initial release"],
  },
]