import * as React from "react"
import "./StepHeader.scss"

export interface StepHeaderProps {
  currentStep: number
  totalSteps: number
  stepPreposition: string
  stepLabeling: string[]
  className?: string
  priority?: number
}

const StepHeader = ({
  currentStep,
  totalSteps,
  stepPreposition,
  stepLabeling,
  className,
  priority,
}: StepHeaderProps) => {
  const Tag = `h${priority}` as keyof JSX.IntrinsicElements

  return (
    <Tag className={`step-header ${className}`}>
      <span className="step-header__circle-number">{currentStep}</span>
      <span>{`${stepPreposition} ${totalSteps}`}</span>
      <span className="step-header__title">
        {stepLabeling[Math.min(currentStep - 1, stepLabeling.length - 1)]}
      </span>
    </Tag>
  )
}

export { StepHeader as default, StepHeader }
