import * as React from "react"

export interface PageHeaderProps {
  inverse?: boolean
  subtitle?: string
  children: React.ReactNode
}

const PageHeader = (props: PageHeaderProps) => {
  const classNames = ["page-header", "py-10", "px-5"]
  if (props.inverse) {
    classNames.push("bg-primary-dark")
    classNames.push("text-white")
  } else {
    classNames.push("bg-primary-lighter")
  }

  return (
    <header className={classNames.join(" ")}>
      <h1 className="title m-auto max-w-5xl">{props.children}</h1>
      {props.subtitle && <p className="m-auto max-w-5xl"> {props.subtitle}</p>}
    </header>
  )
}

export { PageHeader as default, PageHeader }
