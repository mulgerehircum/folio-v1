import type { ButtonHTMLAttributes, ReactNode } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: "primary" | "secondary"
}

function Button({ children, variant = "primary", className = "", ...props }: ButtonProps) {
  const baseStyles = "cursor-pointer border border-[#4DD7FA] rounded-md px-4 py-2 focus:outline-none transition-all duration-300 bg-transparent text-zinc-200 hover:bg-[rgba(6,12,18,0.55)] hover:backdrop-blur-md hover:shadow-[inset_0_0_10px_1px_rgba(77,215,250,0.55)] hover:border-[#4DD7FA]/80 hover:text-zinc-300 focus:bg-[#4DD7FA]/10 focus:shadow-[inset_0_0_7px_1px_rgba(77,215,250,0.55)] focus:text-white"

  return (
    <button
      className={`${baseStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button

