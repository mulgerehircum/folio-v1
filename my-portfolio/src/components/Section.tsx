import { type ReactNode, forwardRef } from "react"

type SectionProps = {
  id: string
  className?: string
  children: ReactNode
}

const Section = forwardRef<HTMLElement, SectionProps>(({ id, className, children }, ref) => {
  return (
    <section
      ref={ref}
      id={id}
      className={`w-full py-24 md:py-32 text-zinc-200 flex flex-col items-center mt-20 scroll-mt-28 md:scroll-mt-36 ${className ?? ""}`}
    >
      {children}
    </section>
  )
})

Section.displayName = "Section"

export default Section


