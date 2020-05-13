import React from "react"
import { onClientSide } from "../helpers/nextjs"

const ProcessStepIndicator = (props: {
  step: number
  currentPageStep: number
  completedSteps: number
}) => {
  let bgColor = "is-disabled"
  if (onClientSide()) {
    if (props.step == props.currentPageStep) {
      bgColor = "is-active"
    } else if (props.completedSteps >= props.step) {
      bgColor = ""
    }
  }

  return <li className={`progress-nav__item ${bgColor}`}></li>
}

const MultistepProgress = (props: {
  currentPageStep: number
  completedSteps: number
  totalNumberOfSteps: number
}) => {
  let i = 0
  const stepIndicators = []
  while (i < props.totalNumberOfSteps) {
    i++
    stepIndicators.push(
      <ProcessStepIndicator
        step={i}
        currentPageStep={props.currentPageStep}
        completedSteps={props.completedSteps}
      />
    )
  }

  return <ul className={!onClientSide() ? "invisible" : "progress-nav"}>{stepIndicators}</ul>
}

export { MultistepProgress as default, MultistepProgress }
