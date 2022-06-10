import * as React from "react"
import "./PageHeader.scss"

export interface PageHeaderProps {
  className?: string
  inverse?: boolean
  title?: React.ReactNode
  subtitle?: string
  children?: React.ReactNode
  tabNav?: React.ReactNode
  breadcrumbs?: React.ReactNode
}

const PageHeader = (props: PageHeaderProps) => {
  const classNames = ["page-header"]
  if (props.inverse) classNames.push("is-inverse")
  if (props.className) classNames.push(...props.className.split(" "))

  return (
    <header className={classNames.join(" ")}>
      <hgroup className="page-header__group">
        <nav className="page-header__breadcrumbs">{props?.breadcrumbs}</nav>

        {props.title && (
          <h1 data-test-id="page-header" className="page-header__title">
            {props.title}
          </h1>
        )}
        {props.subtitle && <p className="page-header__lead"> {props.subtitle}</p>}
        {props.children}

        {props.tabNav ? props.tabNav : null}
      </hgroup>
    </header>
  )
}

export { PageHeader as default, PageHeader }
