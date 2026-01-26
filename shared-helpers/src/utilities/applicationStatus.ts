import { ApplicationStatusEnum } from "../types/backend-swagger"

export const getApplicationStatusVariant = (status?: ApplicationStatusEnum) => {
  switch (status) {
    case ApplicationStatusEnum.submitted:
      return "primary"
    case ApplicationStatusEnum.declined:
      return "highlight-warm"
    case ApplicationStatusEnum.receivedUnit:
      return "success"
    case ApplicationStatusEnum.waitlist:
      return "warn"
    case ApplicationStatusEnum.waitlistDeclined:
      return "highlight-warm"
    default:
      return "secondary"
  }
}
