import * as React from "react"

import { StepHeader } from "./StepHeader"

export default {
  title: "Headers/Step Header 🚩",
}

export const defaultTitle = () => <StepHeader currentStep={1} totalSteps={4} />

export const customTitle = () => <StepHeader currentStep={1} totalSteps={4} stepTitle={"Phases"} />

export const finalStep = () => <StepHeader currentStep={3} totalSteps={3} />

export const doubleDigits = () => <StepHeader currentStep={10} totalSteps={40} />

export const tripleDigits = () => <StepHeader currentStep={100} totalSteps={400} />
