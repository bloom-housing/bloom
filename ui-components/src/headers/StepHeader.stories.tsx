import { useState } from "@storybook/addons"
import * as React from "react"
import { BADGES } from "../../.storybook/constants"
import { StepHeader } from "./StepHeader"
import { Button } from "../actions/Button"
import StepHeaderDocumentation from "./StepHeader.docs.mdx"

export default {
  title: "Headers/Step Header 🚩",
  id: "headers/step-header",
  parameters: {
    docs: {
      page: StepHeaderDocumentation,
    },
    badges: [BADGES.GEN2],
  },
}

export const basicDynamic = () => {
  const [currentStep, setCurrentStep] = useState<number>(1)
  return (
    <div>
      <div className="flex-col pb-4">
        <StepHeader
          currentStep={currentStep}
          totalSteps={4}
          stepPreposition={"of"}
          stepLabeling={["Start", "Mid 1", "Mid 2", "End"]}
        />
      </div>
      <div>
        <Button iconSize="small" onClick={() => setCurrentStep(currentStep - 1)}>
          Previous
        </Button>
        <Button iconSize="small" onClick={() => setCurrentStep(currentStep + 1)}>
          Next
        </Button>
      </div>
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
