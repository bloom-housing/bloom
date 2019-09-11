import * as React from "react"

interface ButtonProps {
  onClick: (e: React.MouseEvent) => void
  filled?: boolean
  normalCase?: boolean
  small?: boolean
  children: any
}

const Button = (props: ButtonProps) => {
  // Style defined in @bloom/styles/src/atoms.scss
  const buttonClasses = ["button"]
  if (props.filled) buttonClasses.push("filled")
  if (props.normalCase) buttonClasses.push("normal-case")
  if (props.small) buttonClasses.push("small")

  return (
    <button className={buttonClasses.join(" ")} onClick={props.onClick}>
      {props.children}
    </button>
  )
}

export default Button
