interface ContactItemProps {
  label: string
  value: string
  href: string
  isLast?: boolean
}

function ContactItem({ label, value, href }: ContactItemProps) {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
        <span className="text-zinc-400 uppercase tracking-[0.18em] text-[11px]">
          {label}
        </span>
        <a
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noreferrer" : undefined}
          className="text-zinc-100 hover:text-amber-300 transition-colors"
        >
          {value}
        </a>
      </div>
      {<hr className="h-px w-full text-cyan-400/30" />}
    </>
  )
}

export default ContactItem

