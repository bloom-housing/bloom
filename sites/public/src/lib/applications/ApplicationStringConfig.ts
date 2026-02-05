export interface ApplicationStringConfig {
  [key: string]: string
}

/**
 * String configuration for the "whatToExpect" step
 */
export interface WhatToExpectStringConfig extends ApplicationStringConfig {
  fcfsFinePrint: string
  waitlistFinePrint: string
  baseFinePrint: string
  lotteryFinePrint: string
  waitlistLotteryFinePrint: string
}

/**
 * Complete jurisdiction-level application string configuration
 * Maps step names to their respective string configurations
 */
export interface JurisdictionApplicationStringConfig {
  whatToExpect?: WhatToExpectStringConfig
  [stepName: string]: ApplicationStringConfig | undefined
}

/**
 * Core string configuration that applies to all jurisdictions by default
 */
export const ApplicationStringConfigCore: Record<string, ApplicationStringConfig> = {
  whatToExpect: {
    fcfsFinePrint: "application.start.whatToExpect.fcfs.finePrint",
    waitlistFinePrint: "application.start.whatToExpect.waitlist.finePrint",
    baseFinePrint: "application.start.whatToExpect.base.finePrint",
    lotteryFinePrint: "application.start.whatToExpect.lottery.finePrint",
    waitlistLotteryFinePrint: "application.start.whatToExpect.waitlistLottery.finePrint",
  },
}

/**
 * Retrieves the string configuration for a specific step, with optional jurisdiction-based customization
 *
 * If a jurisdiction has custom string configurations defined in its applicationStringConfig,
 * those will be merged with the core configuration for the requested step.
 *
 * stepName is the name of the step (e.g., "whatToExpect")
 */
export const getStepStringConfig = (
  stepName: string,
  stringConfig?: JurisdictionApplicationStringConfig
): ApplicationStringConfig => {
  // Get the core configuration for the step
  const coreConfig = ApplicationStringConfigCore[stepName] || {}

  // If no jurisdiction is provided, return core config
  if (!stringConfig) {
    return coreConfig
  }

  const jurisdictionStepConfig =
    (stringConfig as Record<string, ApplicationStringConfig>)?.[stepName] || {}

  // Merge core config with jurisdiction-specific config, with jurisdiction config taking precedence
  return {
    ...coreConfig,
    ...jurisdictionStepConfig,
  }
}
