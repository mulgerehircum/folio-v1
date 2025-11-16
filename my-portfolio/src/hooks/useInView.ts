import { useEffect, useRef, useState, MutableRefObject } from "react"

type UseInViewOptions = {
  root?: Element | null
  rootMargin?: string
  threshold?: number | number[]
  once?: boolean
}

export function useInView<T extends Element>(
  options: UseInViewOptions = {}
): { ref: MutableRefObject<T | null>; inView: boolean } {
  const { root = null, rootMargin = "0px", threshold = 0.15, once = true } = options
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting) {
          setInView(true)
          if (once) observer.unobserve(entry.target)
        } else if (!once) {
          setInView(false)
        }
      },
      { root, rootMargin, threshold }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [root, rootMargin, JSON.stringify(threshold), once])

  return { ref, inView }
}


