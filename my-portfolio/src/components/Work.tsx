import { useEffect, useRef } from "react"
import { useInView } from "../hooks/useInView"
import { Calendar, MapPin } from "lucide-react"
import SectionHeader from "./SectionHeader"
import { workExperience } from "../data/work"
import Section from "./Section"
import { trackSectionView } from "../utils/analytics"

function Work() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.18, once: false })
  const hasTrackedRef = useRef(false)

  useEffect(() => {
    if (inView && !hasTrackedRef.current) {
      trackSectionView("work")
      hasTrackedRef.current = true
    }
  }, [inView])

  return (
    <Section id="work" className="bg-transparent min-h-screen">
      <div ref={ref} className="max-w-4xl mx-auto w-full px-6 flex flex-col">
        <div
          className={`transition-all duration-500 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[8px]"}`}
          style={{ transitionDelay: inView ? "0ms" : "0ms" }}
        >
          <SectionHeader
            title="WORK"
            description="I'm still early in my career, but I've already worked on real FinTech systems with real complexity."
          />
        </div>
        <div
          className={`flex items-center gap-4 px-6 justify-between transition-all duration-400 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[8px]"}`}
          style={{ transitionDelay: inView ? "0ms" : "120ms" }}
        >
          <h2 className="text-lg font-semibold">{workExperience.company}</h2>
          <span className="text-zinc-400">{workExperience.role}</span>
        </div>
        <hr
          className={`w-full border-cyan-400/30 my-4 transition-all duration-400 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[8px]"}`}
          style={{ transitionDelay: inView ? "0ms" : "200ms" }}
        />
        <div
          className={`flex items-center gap-4 px-6 text-sm text-zinc-400 transition-all duration-400 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[8px]"}`}
          style={{ transitionDelay: inView ? "0ms" : "260ms" }}
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-zinc-400" />
            <p>{workExperience.period}</p>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-zinc-400" />
            <p>{workExperience.location}</p>
          </div>
        </div>
        <ul className="space-y-2 text-sm leading-relaxed text-zinc-300 px-6 mt-4">
          {workExperience.responsibilities.map((responsibility, index) => {
            const delayMs = 320 + index * 70
            return (
              <li
                key={index}
                className={`transition-all duration-400 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[8px]"}`}
                style={{ transitionDelay: inView ? "0ms" : `${delayMs}ms` }}
              >
                • {responsibility}
              </li>
            )
          })}
        </ul>
      </div>
    </Section>
  )
}

export default Work

