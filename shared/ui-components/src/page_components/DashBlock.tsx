import React from "react"
import "./DashBlocks.scss"

interface DashBlockProps {
  href?: string
  title: string
  subtitle?: string
  icon: JSX.Element
  children?: JSX.Element | JSX.Element[]
}
const DashBlock = (props: DashBlockProps) => {
  const { href, title, subtitle, icon, children } = props
  let content, wrapper
  if (children) {
    content = (
      <div className="dash-item__content" style={{ background: "#f6f6f6" }}>
        {children}
      </div>
    )
  }
  const header = (
    <>
      <span className="dash-item__badge">{icon}</span>
      <h2 className="dash-item__name">{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </>
  )
  if (href) {
    wrapper = (
      <a href={href} className="dash-item">
        {header}
      </a>
    )
  } else {
    wrapper = (
      <>
        <div className="dash-item">
          <div className="pb-4">{header}</div>
          {content}
        </div>
      </>
    )
  }
  return <div className="dash-block">{wrapper}</div>
}
export { DashBlock as default, DashBlock }
