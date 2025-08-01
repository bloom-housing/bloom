import { howDidYouHear } from "./formKeys"

export const limitedHowDidYouHear = howDidYouHear.filter(
  (option) => !["radioAd", "busAd"].includes(option.id)
)
