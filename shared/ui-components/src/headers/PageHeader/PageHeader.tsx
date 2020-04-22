import * as React from "react"
import "./PageHeader.scss"

export interface PageHeaderProps {
  inverse?: boolean
  subtitle?: string
  children: React.ReactNode
}

const PageHeader = (props: PageHeaderProps) => {
  const classNames = ["page-header"]
  if (props.inverse) {
    classNames.push("bg-primary-dark")
    classNames.push("text-white")
  } else {
    classNames.push("bg-primary-lighter")
  }

  return (
    <header className={classNames.join(" ")}>
      <h1 className="page-header__title">{props.children}</h1>
      {props.subtitle && <p className="page-header__lead"> {props.subtitle}</p>}
    </header>
  )
}

export { PageHeader as default, PageHeader }
