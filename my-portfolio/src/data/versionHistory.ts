export interface VersionHistoryItem {
  version: string
  date: string
  changes: string[]
}

export const versionHistory: VersionHistoryItem[] = [
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