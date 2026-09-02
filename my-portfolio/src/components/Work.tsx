import { useEffect, useRef } from "react"
import { useInView } from "../hooks/useInView"
import { Calendar, MapPin } from "lucide-react"
import { workExperience } from "../data/work"
import Section from "./Section"
import { trackSectionView } from "../utils/analytics"

function Work() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.18, once: true })
  const hasTrackedRef = useRef(false)

  useEffect(() => {
    if (inView && !hasTrackedRef.current) {
      trackSectionView("work")
      hasTrackedRef.current = true
    }
  }, [inView])

  return (
    <Section id="work" className="bg-transparent">
      <div ref={ref} className="max-w-4xl mx-auto w-full px-6 flex flex-col">
        <div
          className={`transition-all duration-500 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[8px]"}`}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-100">
            {workExperience.company}
          </h2>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3 text-sm text-zinc-400">
            <span>{workExperience.role}</span>
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" aria-hidden="true" />
              {workExperience.period}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4" aria-hidden="true" />
              {workExperience.location}
            </span>
          </div>
          <p className="mt-4 text-zinc-400 max-w-[65ch] text-sm leading-relaxed">
            I led a full architectural rewrite of a production FinTech platform,
            from broken legacy to shipped, live, and serving real B2B customers.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-x-10 gap-y-10 md:gap-y-14">
          {workExperience.responsibilityGroups.map((group, groupIndex) => {
            const delayMs = 150 + groupIndex * 120
            return (
              <div
                key={group.group}
                className={`contents`}
              >
                <div
                  className={`transition-all duration-400 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[8px]"}`}
                  style={{ transitionDelay: inView ? `${delayMs}ms` : "0ms" }}
                >
                  <h3 className="text-sm font-semibold text-zinc-100">{group.group}</h3>
                  <div className="w-8 h-px bg-cyan-400/50 mt-3" />
                </div>
                <ul
                  className={`space-y-3 text-sm leading-relaxed text-zinc-300 transition-all duration-400 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[8px]"}`}
                  style={{ transitionDelay: inView ? `${delayMs + 60}ms` : "0ms" }}
                >
                  {group.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className={`transition-all duration-400 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[8px]"}`}
                      style={{ transitionDelay: inView ? `${delayMs + 120 + itemIndex * 60}ms` : "0ms" }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </Section>
  )
}

export default Work
