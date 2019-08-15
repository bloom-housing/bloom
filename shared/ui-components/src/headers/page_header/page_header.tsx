import * as React from "react"

const PageHeader = (props: any) => {
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
    </header>
  )
}

export default PageHeader
