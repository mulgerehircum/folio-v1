import { useEffect, useState } from "react"

function Hero() {
  const [isVisible, setIsVisible] = useState(false)
  const name = "Andrii Ponomarienko"

  useEffect(() => {
    const timeoutId = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <div className="relative flex flex-col items-center gap-4 z-10 w-full py-6">
      <span className={`block text-[11px] md:text-xs tracking-[0.3em] text-zinc-300 mb-3 transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"} ${isVisible ? "" : "delay-0"}`}>
        HI, I'M
      </span>
      <div className={`w-40 h-px bg-cyan-400/40 mx-auto transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"} ${isVisible ? "" : "delay-150"}`} />
      <h1 className={`text-4xl md:text-6xl font-bold text-center transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"} ${isVisible ? "" : "delay-350"}`}>
        {Array.from(name).map((ch, idx) => (
          <span
            key={idx}
            className={`inline-block transition-all duration-500 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[6px]"}`}
            style={{ transitionDelay: `${idx * 6}ms` }}
          >
            {ch === " " ? "\u00A0" : ch}
          </span>
        ))}
      </h1>
      <p className={`mt-3 text-[11px] md:text-sm tracking-[0.25em] text-zinc-300 text-center max-w-3xl mx-auto transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"} ${isVisible ? "" : "delay-550"}`}>
        FRONTEND DEVELOPER FOCUSED ON SCALABLE ARCHITECTURE, CLEAN STRUCTURE,
        CLEAR UX AND PERFORMANCE.
      </p>
      <button
        onClick={() => {
          const link = document.createElement("a")
          link.href = "/CV.pdf"
          link.download = "Andrii_Ponomarienko_CV.pdf"
          link.click()
        }}
        className={`cursor-pointer border border-[#4DD7FA] rounded-md px-4 py-2 focus:outline-none transition-all duration-700 ease-out bg-transparent text-zinc-200 hover:bg-[rgba(6,12,18,0.55)] hover:backdrop-blur-md hover:shadow-[inset_0_0_10px_1px_rgba(77,215,250,0.55)] hover:border-[#4DD7FA]/80 hover:text-zinc-300 focus:bg-[#4DD7FA]/10 focus:shadow-[inset_0_0_7px_1px_rgba(77,215,250,0.55)] focus:text-white ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"} ${isVisible ? "" : "delay-750"} mt-4`}      >
        Download CV
      </button>
    </div>
  )
}

export default Hero

