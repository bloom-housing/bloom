import * as React from "react"
import "./Flag.scss"

export interface FlagProps {
  children: React.ReactNode
  warning?: boolean
  small?: boolean
}

const Flag = (props: FlagProps) => {
  const flagClasses = ["flag"]
  if (props.warning) flagClasses.push("is-warning")
  if (props.small) flagClasses.push("is-small")

  return <div className={flagClasses.join(" ")}>{props.children}</div>
}

export { Flag as default, Flag }
