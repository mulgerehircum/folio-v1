import { type ReactNode } from "react"

type SectionProps = {
  id: string
  className?: string
  children: ReactNode
}

function Section({ id, className, children }: SectionProps) {
  return (
    <section
      id={id}
      className={`w-full py-24 md:py-32 text-zinc-200 flex flex-col items-center mt-20 scroll-mt-28 md:scroll-mt-36 ${className ?? ""}`}
    >
      {children}
    </section>
  )
}

export default Section


