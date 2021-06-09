import * as React from "react"
import "./PageHeader.scss"

export interface PageHeaderProps {
  className?: string
  inverse?: boolean
  title: React.ReactNode
  subtitle?: string
  children?: React.ReactNode
  tabNav?: React.ReactNode
}

const PageHeader = (props: PageHeaderProps) => {
  const classNames = ["page-header"]
  if (props.className) {
    classNames.push(...props.className.split(" "))
  }

  if (props.inverse) {
    classNames.push("bg-primary-dark")
    classNames.push("text-white")
  } else {
    classNames.push("bg-primary-lighter")
  }

  return (
    <header className={classNames.join(" ")}>
      <hgroup className="page-header__group">
        <h1 className="page-header__title">{props.title}</h1>
        {props.subtitle && <p className="page-header__lead"> {props.subtitle}</p>}
        {props.children}

        {props.tabNav ? props.tabNav : null}
      </hgroup>
    </header>
  )
}

export { PageHeader as default, PageHeader }
