import { useEffect, useRef, useState } from "react"

function Header() {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [scrollDirection, setScrollDirection] = useState<"down" | "up">("down")
  const lastScrollYRef = useRef<number>(0)
  const tickingRef = useRef<boolean>(false)
  const sectionBoundsRef = useRef<Array<{ id: string; top: number; bottom: number }>>([])
  const headerHeightRef = useRef<number>(0)
  const activeRef = useRef<string | null>(null)
  const lockActiveRef = useRef<boolean>(false)
  const settleTimerRef = useRef<number | null>(null)

  useEffect(() => {
    activeRef.current = activeSection
  }, [activeSection])

  useEffect(() => {
    lastScrollYRef.current = window.scrollY
    // Cache header height and section bounds
    const computeLayout = () => {
      const headerEl = document.querySelector("header") as HTMLElement | null
      headerHeightRef.current = headerEl?.offsetHeight ?? 0
      const ids = ["about", "expertise", "work", "contact"]
      const currentScroll = window.scrollY
      sectionBoundsRef.current = ids
        .map(id => {
          const el = document.getElementById(id)
          if (!el) return null
          const rect = el.getBoundingClientRect()
          const top = rect.top + currentScroll
          const bottom = rect.bottom + currentScroll
          return { id, top, bottom }
        })
        .filter(Boolean) as Array<{ id: string; top: number; bottom: number }>
    }
    computeLayout()
    const onResize = () => {
      computeLayout()
    }
    window.addEventListener("resize", onResize)

    const onScroll = () => {
      if (tickingRef.current) return
      tickingRef.current = true
      requestAnimationFrame(() => {
        const currentY = window.scrollY
        // While a programmatic scroll is in progress, avoid recomputing activeSection.
        if (lockActiveRef.current) {
          if (settleTimerRef.current) {
            window.clearTimeout(settleTimerRef.current)
          }
          settleTimerRef.current = window.setTimeout(() => {
            lockActiveRef.current = false
          }, 350)
          lastScrollYRef.current = currentY
          tickingRef.current = false
          return
        }
        if (currentY > lastScrollYRef.current + 2) {
          setScrollDirection("down")
        } else if (currentY < lastScrollYRef.current - 2) {
          setScrollDirection("up")
        }
        // Clear selection if scrolled above first or below last section (accounting for header)
        const viewportTop = currentY + headerHeightRef.current + 4
        const viewportMiddle = currentY + headerHeightRef.current + (window.innerHeight / 2)
        const bounds = sectionBoundsRef.current
        if (bounds.length > 0) {
          const first = bounds[0]
          const last = bounds[bounds.length - 1]
          if (viewportTop < first.top) {
            setActiveSection(null)
          } else if (viewportTop > last.bottom) {
            setActiveSection(null)
          } else {
            // Pick the section that contains the viewport middle
            const current = bounds.find(b => viewportMiddle >= b.top && viewportMiddle < b.bottom)
            const newId = current ? current.id : null
            if (newId !== activeRef.current) {
              setActiveSection(newId)
            }
          }
        }

        lastScrollYRef.current = currentY
        tickingRef.current = false
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onResize)
    }
  }, [])
  useEffect(() => {
    const sectionIds = ["about", "expertise", "work", "contact"]
    // header height is read from headerHeightRef computed in layout effect

    const observer = new IntersectionObserver(
      () => {
        if (lockActiveRef.current) return
        const currentY = window.scrollY
        const viewportMiddle = currentY + headerHeightRef.current + (window.innerHeight / 2)
        const bounds = sectionBoundsRef.current
        if (bounds.length === 0) return
        const current = bounds.find(b => viewportMiddle >= b.top && viewportMiddle < b.bottom)
        const newId = current ? current.id : null
        if (newId !== activeRef.current) {
          setActiveSection(newId)
        }
      },
      {
        root: null,
        rootMargin: `-${headerHeightRef.current + 4}px 0px -50% 0px`,
        threshold: [0.15, 0.3, 0.5, 0.75, 1],
      }
    )

    sectionIds.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const headerEl = document.querySelector("header") as HTMLElement | null
      const headerHeight = headerEl?.offsetHeight ?? 0
      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches

      // Primary: use native scrollIntoView so CSS scroll-margin works if present.
      element.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" })

      // If the target defines scroll-margin-top, let the browser handle it and skip manual offset.
      const computed = getComputedStyle(element)
      const scrollMarginTop = parseFloat(computed.scrollMarginTop || "0")
      if (scrollMarginTop > 0) {
        return
      }

      // Fallback correction: adjust by header height if no scroll-margin is set.
      const currentScroll = window.scrollY
      const targetTop = element.getBoundingClientRect().top + currentScroll - headerHeight
      // Small extra offset (2px) to avoid header overlap due to subpixel rounding
      const correctedTop = Math.max(0, targetTop - 2)
      window.scrollTo({ top: correctedTop, behavior: prefersReduced ? "auto" : "smooth" })
    }
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center gap-2 px-6 py-4 backdrop-blur-md bg-black/20 border-b border-white/10">
        <div className="flex items-center gap-2">
            <a href="https://www.razomforukraine.org/" className="group relative inline-flex w-5 h-5 items-center justify-center overflow-visible cursor-pointer transition-transform duration-300 hover:scale-125">
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
            ].map(item => (
              <button
                key={item.id}
                onClick={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).blur()
                  lockActiveRef.current = true
                  if (settleTimerRef.current) {
                    window.clearTimeout(settleTimerRef.current)
                  }
                  const target = document.getElementById(item.id)
                  if (target) {
                    const currentY = window.scrollY
                    const targetTop = target.getBoundingClientRect().top + currentY
                    setScrollDirection(targetTop > currentY ? "down" : "up")
                  }
                  setActiveSection(item.id)
                  scrollToSection(item.id)
                  settleTimerRef.current = window.setTimeout(() => {
                    lockActiveRef.current = false
                  }, 400)
                }}
                className={`relative cursor-pointer focus:outline-none px-1 py-0.5
                  after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:h-[2px]
                  after:bg-[#4DD7FA] after:w-full after:transform after:scale-x-0 after:origin-right
                  after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.22,1,0.36,1)]
                  after:transform-gpu after:will-change-transform motion-reduce:after:transition-none
                  hover:after:scale-x-100 hover:after:origin-left
                  before:content-[''] before:absolute before:left-0 before:-bottom-0.5 before:h-[2px]
                  before:bg-[#4DD7FA] before:w-full before:transform before:scale-x-0
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
              onClick={() => scrollToSection("contact")}
              className="cursor-pointer border border-[#4DD7FA] rounded-md px-4 py-2 focus:outline-none transition-all duration-300 bg-transparent text-zinc-200 hover:bg-[rgba(6,12,18,0.55)] hover:backdrop-blur-md hover:shadow-[inset_0_0_10px_1px_rgba(77,215,250,0.55)] hover:border-[#4DD7FA]/80 hover:text-zinc-300 focus:bg-[#4DD7FA]/10 focus:shadow-[inset_0_0_7px_1px_rgba(77,215,250,0.55)] focus:text-white"
            >
              Contact me
            </button>
        </div>
      </header>
    </>
  )
}

export default Header
