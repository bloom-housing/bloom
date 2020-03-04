import * as React from "react"
import "./FooterSection.scss"

export interface FooterNavProps {
  children: React.ReactNode
  className?: string
  small?: boolean
}

const FooterSection = (props: FooterNavProps) => (
  <div className={`footer-row ${props.className || ""}`}>
    <div className={`footer-row__section ${props.small ? "py-2" : "pb-8"}`}>{props.children}</div>
  </div>
)

export default FooterSection
