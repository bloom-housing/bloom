import * as React from "react"
import { t } from "../.."
import "./StepHeader.scss"

export interface StepHeaderProps {
  currentStep: number
  totalSteps: number
  stepLabel?: string
}

const StepHeader = ({
  currentStep,
  totalSteps,
  stepLabel = t("stepHeader.defaultLabel"),
}: StepHeaderProps) => {
  return (
    <div className="flex">
      <div className="circle-number">{currentStep}</div>
      <div>{`out of ${totalSteps}  ${stepLabel}`}</div>
      <div></div>
    </div>
  )
}

export { StepHeader as default, StepHeader }
