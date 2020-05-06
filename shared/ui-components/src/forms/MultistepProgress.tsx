import React from "react"
import { onClientSide } from "../helpers/nextjs"

const ProcessStepIndicator = (props: {
  step: number
  currentPageStep: number
  completedSteps: number
}) => {
  let indicatorColor = "#CCC"
  if (onClientSide()) {
    if (props.step == props.currentPageStep) {
      indicatorColor = "#0077da"
    } else if (props.completedSteps >= props.step) {
      indicatorColor = "#0D0"
    }
  }

  const styles = {
    backgroundColor: indicatorColor,
    display: "inline-block",
    width: "15px",
    height: "15px",
    marginRight: "10px",
    borderRadius: "15px"
  }

  return <span style={styles}></span>
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

  return <div className={!onClientSide() ? "invisible" : "text-center"}>{stepIndicators}</div>
}

export { MultistepProgress as default, MultistepProgress }
