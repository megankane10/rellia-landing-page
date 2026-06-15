import type { ReactNode } from "react"
import ScrollReveal from "@/components/ScrollReveal"

type AdminPageRevealProps = {
  children: ReactNode
  delay?: number
  className?: string
}

const AdminPageReveal = ({ children, delay = 0, className }: AdminPageRevealProps) => (
  <ScrollReveal variant="ctaReveal" delay={delay} className={className}>
    {children}
  </ScrollReveal>
)

export default AdminPageReveal
