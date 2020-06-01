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
    if (props.step == props.currentPageStep) {
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
  totalNumberOfSteps: number
  labels: string[]
}) => {
  let i = 0
  const stepIndicators = []
  while (i < props.totalNumberOfSteps) {
    i++
    stepIndicators.push(
      <ProgressNavItem
        step={i}
        currentPageStep={props.currentPageStep}
        completedSteps={props.completedSteps}
        label={props.labels[i - 1]}
      />
    )
  }

  return <ul className={!onClientSide() ? "invisible" : "progress-nav"}>{stepIndicators}</ul>
}

export { ProgressNav as default, ProgressNav }
