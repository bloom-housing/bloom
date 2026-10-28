import { BrandRadiusEnum } from "../types/backend-swagger"

const RADIUS_STEPS: string[] = Object.values(BrandRadiusEnum)

export const radiusStepOnly = (value?: string | null): BrandRadiusEnum | null =>
  typeof value === "string" && RADIUS_STEPS.includes(value) ? (value as BrandRadiusEnum) : null

export const radiusVariable = (step: BrandRadiusEnum): string =>
  step === BrandRadiusEnum.base ? "var(--seeds-rounded)" : `var(--seeds-rounded-${step})`
