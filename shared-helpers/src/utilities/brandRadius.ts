import { BrandRadiusEnum } from "../types/backend-swagger"

export const radiusVariable = (step: string): string =>
  step === BrandRadiusEnum.base ? "var(--seeds-rounded)" : `var(--seeds-rounded-${step})`
