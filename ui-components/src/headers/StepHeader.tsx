import * as React from "react"
import { t } from "../.."
import "./StepHeader.scss"

export interface StepHeaderProps {
  currentStep: number
  totalSteps: number
  stepTitle?: string
}

const StepHeader = ({
  currentStep,
  totalSteps,
  stepTitle = t("stepHeader.defaultLabel"),
}: StepHeaderProps) => {
  return (
    <div className="step-header">
      <div className="circle-number">{currentStep}</div>
      <div>{`out of ${totalSteps}`}</div>
      <div className="step-title">{stepTitle}</div>
    </div>
  )
}

export { StepHeader as default, StepHeader }
