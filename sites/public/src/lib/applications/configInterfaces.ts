import StepDefinition from "./StepDefinition"

export interface StepRoute {
  url: string
  definition?: typeof StepDefinition
}

export interface StepConfig {
  name: string
  config?: Record<string, any>
}

export interface ApplicationFormConfig {
  sections: string[]
  languages: string[]
  steps: StepConfig[]
  preview?: boolean
}
