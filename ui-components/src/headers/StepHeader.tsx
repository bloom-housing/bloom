import * as React from "react"
import "./StepHeader.scss"

export interface StepHeaderProps {
  currentStep: number
  totalSteps: number
  stepTitle: string
}

const StepHeader = ({ currentStep, totalSteps, stepTitle }: StepHeaderProps) => {
  return (
    <div className="step-header">
      <div className="circle-number">{currentStep}</div>
      <div>{`of ${totalSteps}`}</div>
      <div className="step-title">{stepTitle}</div>
    </div>
  )
}

export { StepHeader as default, StepHeader }
