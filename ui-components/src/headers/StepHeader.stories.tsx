import { useState } from "@storybook/addons"
import * as React from "react"
import { Button } from "../.."

import { StepHeader } from "./StepHeader"

export default {
  title: "Headers/Step Header 🚩",
}

export const baseDynamicUsage = () => {
  const [currentStep, setCurrentStep] = useState<number>(1)
  return (
    <div className="flex gap-x-4">
      <StepHeader
        currentStep={currentStep}
        totalSteps={4}
        stepPreposition={"of"}
        stepLabeling={["Start", "Mid 1", "Mid 2", "End"]}
      />
      <Button onClick={() => setCurrentStep(currentStep + 1)}>increment</Button>
    </div>
  )
}

export const finalStep = () => (
  <StepHeader currentStep={8} totalSteps={8} stepPreposition={"of"} stepLabeling={["Items"]} />
)

export const doubleDigits = () => (
  <StepHeader currentStep={10} totalSteps={40} stepPreposition={"of"} stepLabeling={["Levels"]} />
)

export const tripleDigits = () => (
  <StepHeader currentStep={100} totalSteps={400} stepPreposition={"of"} stepLabeling={["Phases"]} />
)
