import { useEffect, useRef } from "react"
import { useInView } from "../hooks/useInView"
import ContactItem from "./ContactItem"
import { contactInfo } from "../data/contact"
import Section from "./Section"
import { trackSectionView } from "../utils/analytics"

function Contact() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.18, once: false })
  const hasTrackedRef = useRef(false)

  useEffect(() => {
    if (inView && !hasTrackedRef.current) {
      trackSectionView("contact")
      hasTrackedRef.current = true
    }
  }, [inView])

  return (
    <Section id="contact">
      <div ref={ref} className="w-full max-w-xl flex flex-col items-center px-6">
        <h2
          className={`text-sm tracking-[0.25em] text-zinc-300 uppercase transition-all duration-400 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[8px]"}`}
          style={{ transitionDelay: inView ? "0ms" : "0ms" }}
        >
          Contact
        </h2>
        <div
          className={`w-40 h-px bg-cyan-400/40 my-4 transition-all duration-400 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[8px]"}`}
          style={{ transitionDelay: inView ? "0ms" : "80ms" }}
        />
        <p
          className={`text-zinc-400 text-center max-w-xl text-sm mb-8 transition-all duration-400 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[8px]"}`}
          style={{ transitionDelay: inView ? "0ms" : "160ms" }}
        >
          If you'd like to discuss frontend work, architecture-heavy problems
          or products in the FinTech space, feel free to reach out.
        </p>
        <div
          className={`w-full max-w-xl border border-cyan-400/30 bg-zinc-950/40 rounded-xl px-8 py-6 backdrop-blur-sm shadow-[0_0_40px_rgba(0,0,0,0.7)] transition-all duration-400 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[8px]"}`}
          style={{ transitionDelay: inView ? "0ms" : "240ms" }}
        >
          <div className="space-y-4 text-sm">
            {contactInfo.map((item, index) => {
              const delayMs = 320 + index * 70
              return (
                <div
                  key={index}
                  className={`transition-all duration-400 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[8px]"}`}
                  style={{ transitionDelay: inView ? "0ms" : `${delayMs}ms` }}
                >
                  <ContactItem
                    label={item.label}
                    value={item.value}
                    href={item.href}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Section>
  )
}

export default Contact

