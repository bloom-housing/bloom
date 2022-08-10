import * as React from "react"
import "./StepHeader.scss"

export interface StepHeaderProps {
  currentStep: number
  totalSteps: number
  stepPreposition: string
  stepLabeling: string[]
  className?: string
}

const StepHeader = ({
  currentStep,
  totalSteps,
  stepPreposition,
  stepLabeling,
  className,
}: StepHeaderProps) => {
  return (
    <div className={`step-header ${className}`}>
      <div className="step-header__circle-number">{currentStep}</div>
      <div>{`${stepPreposition} ${totalSteps}`}</div>
      <div className="step-header__title">
        {stepLabeling[Math.min(currentStep - 1, stepLabeling.length - 1)]}
      </div>
    </div>
  )
}

export { StepHeader as default, StepHeader }
