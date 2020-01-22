import * as React from "react"
import "./Button.scss"

export interface ButtonProps {
  children: React.ReactNode
  className?: string
  filled?: boolean
  normalCase?: boolean
  onClick: (e: React.MouseEvent) => void
  small?: boolean
}

const Button = (props: ButtonProps) => {
  const buttonClasses = ["button"]
  if (props.filled) buttonClasses.push("filled")
  if (props.normalCase) buttonClasses.push("normal-case")
  if (props.small) buttonClasses.push("small")
  if (props.className) buttonClasses.push(props.className)

  return (
    <button className={buttonClasses.join(" ")} onClick={props.onClick}>
      {props.children}
    </button>
  )
}

export default Button
