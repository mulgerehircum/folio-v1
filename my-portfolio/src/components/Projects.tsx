import { useEffect, useRef, useState, useMemo } from "react"
import { useInView } from "../hooks/useInView"
import SectionHeader from "./SectionHeader"
import ProjectCard from "./ProjectCard"
import { projects, getTechIcon } from "../data/projects"
import Section from "./Section"
import { trackSectionView, trackProjectFilter } from "../utils/analytics"

function Projects() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.18, once: false })
  const hasTrackedRef = useRef(false)
  const sectionRef = useRef<HTMLElement>(null)
  const [selectedTechs, setSelectedTechs] = useState<string[]>([])

  useEffect(() => {
    if (inView && !hasTrackedRef.current) {
      trackSectionView("projects")
      hasTrackedRef.current = true
    }
  }, [inView])

  // Extract unique tech stack items from all projects
  const allTechs = useMemo(() => {
    const techSet = new Set<string>()
    projects.forEach((project) => {
      project.techStack.forEach((tech) => techSet.add(tech))
    })
    return Array.from(techSet).sort()
  }, [])

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    if (selectedTechs.length === 0) {
      return projects.map((project) => ({ project, isFiltered: false }))
    }

    const matching: Array<{ project: typeof projects[0]; isFiltered: boolean }> = []
    const nonMatching: Array<{ project: typeof projects[0]; isFiltered: boolean }> = []

    projects.forEach((project) => {
      const hasMatchingTech = project.techStack.some((tech) => selectedTechs.includes(tech))
      if (hasMatchingTech) {
        matching.push({ project, isFiltered: false })
      } else {
        nonMatching.push({ project, isFiltered: true })
      }
    })

    return [...matching, ...nonMatching]
  }, [selectedTechs])

  // Toggle tech filter
  const toggleTechFilter = (tech: string) => {
    setSelectedTechs((prev) => {
      const isSelected = prev.includes(tech)
      const newSelected = isSelected ? prev.filter((t) => t !== tech) : [...prev, tech]

      // Track filter usage
      trackProjectFilter(tech)

      // Smooth scroll to top when filters change
      if (sectionRef.current) {
        sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
      }

      return newSelected
    })
  }

  // Handle keyboard navigation for filter buttons
  const handleFilterKeyDown = (e: React.KeyboardEvent, tech: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      toggleTechFilter(tech)
    }
  }

  return (
    <Section id="projects" className="bg-transparent" ref={sectionRef}>
      <div ref={ref} className="max-w-6xl mx-auto w-full px-6 flex flex-col items-center">
        <div
          className={`transition-all duration-500 ease-out ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[8px]"
          }`}
          style={{ transitionDelay: inView ? "0ms" : "0ms" }}
        >
          <SectionHeader
            title="PROJECTS"
            description="A collection of my personal projects."
          />
        </div>

        {/* Tech Stack Filters */}
        <div
          className={`w-full mb-8 transition-all duration-400 ease-out ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[8px]"
          }`}
          style={{ transitionDelay: inView ? "0ms" : "120ms" }}
          role="group"
          aria-label="Filter projects by technology"
        >
          <div className="flex flex-wrap gap-2 justify-center">
            {allTechs.map((tech, index) => {
              const Icon = getTechIcon(tech)
              const isActive = selectedTechs.includes(tech)
              const delayMs = 200 + index * 50

              return (
                <button
                  key={tech}
                  onClick={() => toggleTechFilter(tech)}
                  onKeyDown={(e) => handleFilterKeyDown(e, tech)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border transition-all duration-300 ease-out hover:scale-105 ${
                    isActive
                      ? "bg-cyan-400/20 border-cyan-400/50 text-cyan-400 scale-100"
                      : "bg-zinc-800/50 border-cyan-400/20 text-zinc-300 hover:border-cyan-400/40 hover:bg-zinc-800/70"
                  }`}
                  style={{
                    transitionDelay: inView ? "0ms" : `${delayMs}ms`,
                    opacity: inView ? 1 : 0,
                    transform: inView ? "translateY(0)" : "translateY(8px)",
                  }}
                  aria-label={`Filter by ${tech}`}
                  aria-pressed={isActive}
                  role="button"
                  tabIndex={0}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tech}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto w-full">
          {filteredProjects.map(({ project, isFiltered }, index) => {
            const delayMs = 320 + index * 70
            return (
              <div
                key={project.title}
                className={`transition-all duration-400 ease-out ${
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[8px]"
                }`}
                style={{ transitionDelay: inView ? "0ms" : `${delayMs}ms` }}
              >
                <ProjectCard project={project} isFiltered={isFiltered} />
              </div>
            )
          })}
        </div>
      </div>
    </Section>
  )
}

export default Projects


