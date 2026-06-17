import { useEffect, useRef, useState } from "react"
import { trackCVDownload, trackSectionView } from "../utils/analytics"
import { useInView } from "../hooks/useInView"
import Button from "./Button"
import TriangleMesh from "./TriangleMesh"

const SUBTITLE = "FRONTEND DEVELOPER FOCUSED ON SCALABLE ARCHITECTURE, CLEAN STRUCTURE, CLEAR UX AND PERFORMANCE."
const TYPEWRITER_START_MS = 1000
const TYPEWRITER_SPEED_MS = 28

function Hero() {
  const name = "Andrii Ponomarienko"
  const [isVisible, setIsVisible] = useState(false)
  const [subtitleLength, setSubtitleLength] = useState(0)
  const [typingDone, setTypingDone] = useState(false)
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.18, once: false })
  const hasTrackedRef = useRef(false)

  useEffect(() => {
    const id = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(id)
  }, [])

  useEffect(() => {
    if (inView && !hasTrackedRef.current) {
      trackSectionView("about")
      hasTrackedRef.current = true
    }
  }, [inView])

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>
    const startId = setTimeout(() => {
      let i = 0
      intervalId = setInterval(() => {
        i++
        setSubtitleLength(i)
        if (i >= SUBTITLE.length) {
          clearInterval(intervalId)
          setTypingDone(true)
        }
      }, TYPEWRITER_SPEED_MS)
    }, TYPEWRITER_START_MS)
    return () => {
      clearTimeout(startId)
      clearInterval(intervalId)
    }
  }, [])

  const handleDownloadCV = () => {
    const link = document.createElement("a")
    link.href = "/CV.pdf"
    link.download = "Andrii_Ponomarienko_CV.pdf"
    link.click()
    trackCVDownload()
  }

  return (
    <div ref={ref} className="relative flex flex-col items-center w-full min-h-[calc(100vh-64px)] justify-center overflow-hidden z-10">
      <TriangleMesh />
      <div className="relative z-10 flex flex-col items-center gap-4 w-full py-6 pointer-events-none">
        <span className={`block text-[11px] md:text-xs tracking-[0.3em] text-zinc-300 mb-3 transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
          HI, I'M
        </span>
        <div className={`w-40 h-px bg-cyan-400/40 mx-auto transition-all duration-700 ease-out delay-150 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`} />
        <h1 className={`text-4xl md:text-6xl font-bold text-center transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
          {Array.from(name).map((ch, idx) => (
            <span
              key={idx}
              className={`inline-block transition-all duration-500 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[6px]"}`}
              style={{ transitionDelay: `${idx * 6}ms` }}
            >
              {ch === " " ? " " : ch}
            </span>
          ))}
        </h1>
        <p className="mt-3 text-[11px] md:text-sm tracking-[0.25em] text-zinc-300 text-center max-w-3xl mx-auto min-h-[2.5em]">
          {SUBTITLE.slice(0, subtitleLength)}
          {!typingDone && subtitleLength > 0 && (
            <span className="animate-pulse text-cyan-400">|</span>
          )}
        </p>
        <div
          className={`transition-all duration-700 ease-out ${typingDone ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
          style={{ transitionDelay: typingDone ? "200ms" : "0ms" }}
        >
          <Button onClick={handleDownloadCV} className="mt-4 pointer-events-auto">
            Download CV
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Hero
