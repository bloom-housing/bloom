import * as React from "react"

import { StepHeader } from "./StepHeader"

export default {
  title: "Headers/Step Header",
}

export const basic = () => <StepHeader currentStep={1} totalSteps={4} />
