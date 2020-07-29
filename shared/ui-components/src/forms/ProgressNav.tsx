import React from "react"
import { onClientSide } from "../helpers/nextjs"
import "./ProgressNav.scss"

const ProgressNavItem = (props: {
  step: number
  currentPageStep: number
  completedSteps: number
  label: string
}) => {
  let bgColor = "is-disabled"
  if (onClientSide()) {
    if (props.step === props.currentPageStep) {
      bgColor = "is-active"
    } else if (props.completedSteps >= props.step) {
      bgColor = ""
    }
  }

  return (
    <li className={`progress-nav__item ${bgColor}`}>
      <a href="#">{props.label}</a>
    </li>
  )
}

const ProgressNav = (props: {
  currentPageStep: number
  completedSteps: number
  labels: string[]
}) => {
  return (
    <ul className={!onClientSide() ? "invisible" : "progress-nav"}>
      {props.labels.map((label, i) => (
        <ProgressNavItem
          key={label}
          // Steps are 1-indexed
          step={i + 1}
          currentPageStep={props.currentPageStep}
          completedSteps={props.completedSteps}
          label={label}
        />
      ))}
    </ul>
  )
}

export { ProgressNav as default, ProgressNav }
