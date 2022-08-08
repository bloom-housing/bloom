import * as React from "react"
import "./StepHeader.scss"

export interface StepHeaderProps {
  currentStep: number
  totalSteps: number
  stepPreposition: string
  stepTitle: string
}

const StepHeader = ({ currentStep, totalSteps, stepPreposition, stepTitle }: StepHeaderProps) => {
  return (
    <div className="step-header">
      <div className="circle-number">{currentStep}</div>
      <div>{`${stepPreposition} ${totalSteps}`}</div>
      <div className="step-title">{stepTitle}</div>
    </div>
  )
}

export { StepHeader as default, StepHeader }
