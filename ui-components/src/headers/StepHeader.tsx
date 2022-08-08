import * as React from "react"
import "./StepHeader.scss"

export interface StepHeaderProps {
  currentStep: number
  totalSteps: number
  stepPreposition: string
  stepTitle: string
  className?: string
}

const StepHeader = ({
  currentStep,
  totalSteps,
  stepPreposition,
  stepTitle,
  className,
}: StepHeaderProps) => {
  return (
    <div className={`step-header ${className}`}>
      <div className="step-header__circle-number">{currentStep}</div>
      <div>{`${stepPreposition} ${totalSteps}`}</div>
      <div className="step-header__title">{stepTitle}</div>
    </div>
  )
}

export { StepHeader as default, StepHeader }
