import * as React from "react"

import { StepHeader } from "./StepHeader"

export default {
  title: "Headers/Step Header 🚩",
}

export const baseUsage = () => (
  <StepHeader currentStep={1} totalSteps={4} stepPreposition={"of"} stepTitle={"Items"} />
)

export const finalStep = () => (
  <StepHeader currentStep={8} totalSteps={8} stepPreposition={"of"} stepTitle={"Items"} />
)

export const doubleDigits = () => (
  <StepHeader currentStep={10} totalSteps={40} stepPreposition={"of"} stepTitle={"Items"} />
)

export const tripleDigits = () => (
  <StepHeader currentStep={100} totalSteps={400} stepPreposition={"of"} stepTitle={"Items"} />
)
