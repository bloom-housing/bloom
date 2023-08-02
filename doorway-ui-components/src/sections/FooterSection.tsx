import * as React from "react"
import "./FooterSection.scss"

export interface FooterSectionProps {
  children: React.ReactNode
  className?: string
  small?: boolean
  sectionClassName?: string
}

const FooterSection = (props: FooterSectionProps) => (
  <div className={`doorway-footer-row ${props.className || ""}`}>
    <div
      className={`doorway-footer-row__section ${props.small ? "py-0" : "pb-8"} ${
        props.sectionClassName || ""
      }`}
    >
      {props.children}
    </div>
  </div>
)

export { FooterSection as default, FooterSection }
