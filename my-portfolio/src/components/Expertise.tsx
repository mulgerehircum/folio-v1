import { useEffect, useRef } from "react"
import { useInView } from "../hooks/useInView"
import SectionHeader from "./SectionHeader"
import ExpertiseCard from "./ExpertiseCard"
import { expertiseItems } from "../data/expertise"
import Section from "./Section"
import { trackSectionView } from "../utils/analytics"

function Expertise() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.18, once: false })
  const hasTrackedRef = useRef(false)

  useEffect(() => {
    if (inView && !hasTrackedRef.current) {
      trackSectionView("expertise")
      hasTrackedRef.current = true
    }
  }, [inView])

  return (
    <Section id="expertise" className="bg-transparent">
      <div ref={ref} className="max-w-4xl mx-auto w-full px-6 flex flex-col items-center">
        <div
          className={`transition-all duration-500 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[8px]"}`}
          style={{ transitionDelay: inView ? "0ms" : "0ms" }}
        >
          <SectionHeader
            title="EXPERTISE"
            description="I care less about specific frameworks and more about how the UI, state, schemas and backend fit together into a predictable system."
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-5xl mx-auto w-full px-6">
          {expertiseItems.map((item, index) => {
            const delayMs = 120 + index * 70
            return (
              <div
                key={index}
                className={`transition-all duration-400 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[8px]"}`}
                style={{ transitionDelay: inView ? "0ms" : `${delayMs}ms` }}
              >
                <ExpertiseCard
                  title={item.title}
                  description={item.description}
                  accentColor={index >= 3 ? "40" : "30"}
                />
              </div>
            )
          })}
        </div>
      </div>
    </Section>
  )
}

export default Expertise

