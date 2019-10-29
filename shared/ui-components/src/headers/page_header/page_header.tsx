import * as React from "react"

interface PageHeaderProps {
  inverse?: boolean
  subtitle?: string
  children: React.ReactNode
}

const PageHeader = (props: PageHeaderProps) => {
  const classNames = ["py-10", "px-5"]
  if (props.inverse) {
    classNames.push("bg-blue-700")
    classNames.push("text-white")
  } else {
    classNames.push("bg-gray-300")
  }

  return (
    <header className={classNames.join(" ")}>
      <h1 className="title m-auto max-w-5xl">{props.children}</h1>
      {props.subtitle && <p className="m-auto max-w-5xl"> {props.subtitle}</p>}
    </header>
  )
}

export default PageHeader
