import { useEffect, useRef, useState } from "react"

const SECTION_IDS = ["about", "expertise", "work", "projects", "contact"]

function Header() {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  // Underline direction, inferred from section order (index increases = down)
  const [scrollDirection, setScrollDirection] = useState<"down" | "up">("down")
  const activeIndexRef = useRef(0)
  const lockActiveRef = useRef<boolean>(false)
  const settleTimerRef = useRef<number | null>(null)

  useEffect(() => {
    // Which section holds the viewport middle? Pure IntersectionObserver -
    // no scroll listener, no scrollY math.
    const sectionEls = SECTION_IDS.map(id => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    )

    const pickActive = () => {
      if (lockActiveRef.current) return
      const viewportMiddle = window.innerHeight / 2
      let newId: string | null = null
      let newIndex = -1
      for (let i = 0; i < sectionEls.length; i++) {
        const rect = sectionEls[i].getBoundingClientRect()
        if (rect.top <= viewportMiddle && rect.bottom > viewportMiddle) {
          newId = SECTION_IDS[i]
          newIndex = i
          break
        }
      }
      // Above every section (viewport middle in the hero gap) clears selection
      if (newIndex < 0) {
        const firstRect = sectionEls[0].getBoundingClientRect()
        if (firstRect.top > viewportMiddle) {
          newId = null
        }
      }
      setActiveSection(prev => (prev === newId ? prev : newId))
      if (newIndex >= 0 && newIndex !== activeIndexRef.current) {
        // Direction from index delta, not scrollY delta
        setScrollDirection(newIndex > activeIndexRef.current ? "down" : "up")
        activeIndexRef.current = newIndex
      }
    }

    const observer = new IntersectionObserver(pickActive, {
      root: null,
      // Keep the detection band around the viewport middle
      rootMargin: "-40% 0px -40% 0px",
      threshold: 0,
    })

    sectionEls.forEach(el => observer.observe(el))
    pickActive()

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (!element) return
    const prefersReduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    element.scrollIntoView({
      behavior: prefersReduced ? "auto" : "smooth",
      block: "start",
    })
  }

  const handleNavClick = (sectionId: string) => {
    // Direction from section order, not scroll position
    const targetIndex = SECTION_IDS.indexOf(sectionId)
    if (targetIndex > activeIndexRef.current) {
      setScrollDirection("down")
    } else if (targetIndex < activeIndexRef.current) {
      setScrollDirection("up")
    }

    lockActiveRef.current = true
    if (settleTimerRef.current) {
      window.clearTimeout(settleTimerRef.current)
    }
    setActiveSection(sectionId)
    scrollToSection(sectionId)
    settleTimerRef.current = window.setTimeout(() => {
      lockActiveRef.current = false
    }, 500)
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center gap-2 px-6 py-4 backdrop-blur-md bg-black/20 border-b border-white/10">
        <div className="flex items-center gap-2">
            <a href="https://www.razomforukraine.org/" aria-label="Razom for Ukraine (opens in a new tab)" target="_blank" rel="noreferrer" className="group relative inline-flex w-5 h-5 items-center justify-center overflow-visible cursor-pointer transition-transform duration-300 hover:scale-125">
              <svg className="absolute inset-0 w-full h-full transition-colors duration-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path className="stroke-transparent group-hover:stroke-white transition-colors duration-300" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke"/>
                <path className="fill-[#0057b7] group-hover:fill-red-500 transition-colors duration-300" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" style={{clipPath: 'inset(0% 0% 50% 0%)'}}/>
                <path className="fill-[#ffd700] group-hover:fill-black transition-colors duration-300" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" style={{clipPath: 'inset(50% 0% 0% 0%)'}}/>
              </svg>
            </a>
            <span className="md:flex hidden font-medium tracking-wide text-zinc-400">
              Frontend Developer · React / Vue / TS
            </span>
        </div>
        <div className="flex items-center gap-4">
            {[
              { id: "about", label: "About" },
              { id: "expertise", label: "Expertise" },
              { id: "work", label: "Work" },
              { id: "projects", label: "Projects" },
            ].map(item => (
              <button
                key={item.id}
                onClick={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).blur()
                  handleNavClick(item.id)
                }}
                className={`relative cursor-pointer focus:outline-none px-1 py-0.5
                  after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:h-[2px]
                  after:bg-cyan-400 after:w-full after:transform after:scale-x-0 after:origin-right
                  after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.22,1,0.36,1)]
                  after:transform-gpu after:will-change-transform motion-reduce:after:transition-none
                  hover:after:scale-x-100 hover:after:origin-left
                  before:content-[''] before:absolute before:left-0 before:-bottom-0.5 before:h-[2px]
                  before:bg-cyan-400 before:w-full before:transform before:scale-x-0
                  before:transition-transform before:duration-300 before:ease-out
                  ${
                    activeSection === item.id
                      ? (scrollDirection === 'down'
                          ? 'before:origin-left before:scale-x-100'
                          : 'before:origin-right before:scale-x-100')
                      : (scrollDirection === 'down'
                          ? 'before:origin-right'
                          : 'before:origin-left')
                  }`
                }
              >
                <span className="relative z-10">{item.label}</span>
              </button>
            ))}
            <button
              onClick={(e) => {
                ;(e.currentTarget as HTMLButtonElement).blur()
                handleNavClick("contact")
              }}
              className={`cursor-pointer border rounded-md px-4 py-2 focus:outline-none transition-all duration-300 focus:bg-cyan-400/10 focus:shadow-[inset_0_0_7px_1px_rgba(34,211,238,0.55)] focus:text-white ${
                activeSection === "contact"
                  ? "border-cyan-400 bg-[rgba(6,12,18,0.55)] backdrop-blur-md shadow-[inset_0_0_10px_1px_rgba(34,211,238,0.55)] text-zinc-300"
                  : "border-cyan-400 bg-transparent text-zinc-200 hover:bg-[rgba(6,12,18,0.55)] hover:backdrop-blur-md hover:shadow-[inset_0_0_10px_1px_rgba(34,211,238,0.55)] hover:border-cyan-400/80 hover:text-zinc-300"
              }`}
            >
              Contact me
            </button>
        </div>
      </header>
    </>
  )
}

export default Header
