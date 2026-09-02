import { useEffect, useRef } from "react"
import { useInView } from "../hooks/useInView"
import ExpertiseCard from "./ExpertiseCard"
import { expertiseItems } from "../data/expertise"
import Section from "./Section"
import { trackSectionView } from "../utils/analytics"

function Expertise() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.18, once: true })
  const hasTrackedRef = useRef(false)

  useEffect(() => {
    if (inView && !hasTrackedRef.current) {
      trackSectionView("expertise")
      hasTrackedRef.current = true
    }
  }, [inView])

  return (
    <Section id="expertise" className="bg-transparent">
      <div ref={ref} className="max-w-5xl mx-auto w-full px-6">
        <div
          className={`transition-all duration-500 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[8px]"}`}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-100">Expertise</h2>
          <p className="mt-4 text-zinc-400 max-w-[65ch] text-sm leading-relaxed">
            I care less about specific frameworks and more about how the UI,
            state, schemas and backend fit together into a predictable system.
          </p>
        </div>
        {/* CSS columns masonry: cards flow top-to-bottom in narrow columns,
            so column heights vary naturally with content length */}
        <div className="mt-14 columns-1 md:columns-2 gap-8">
          {expertiseItems.map((item, index) => {
            const delayMs = 150 + index * 70
            return (
              <div
                key={item.title}
                className={`break-inside-avoid mb-10 transition-all duration-400 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[8px]"}`}
                style={{ transitionDelay: inView ? `${delayMs}ms` : "0ms" }}
              >
                <ExpertiseCard
                  title={item.title}
                  description={item.description}
                  icon={item.icon}
                  iconAnimation={item.iconAnimation}
                  isVisible={inView}
                  enterDelayMs={delayMs + 120}
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
