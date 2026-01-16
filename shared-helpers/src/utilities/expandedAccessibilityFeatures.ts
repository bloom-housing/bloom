import {
  expandedBathroomFeatures,
  expandedFlooringFeatures,
  expandedHearingVisionFeatures,
  expandedMobilityFeatures,
  expandedUtilityFeatures,
  ListingFeaturesValues,
} from "./formKeys"

export enum AccessibilitySubcategoriesEnum {
  Mobility = "mobility",
  Bathroom = "bathroom",
  Flooring = "flooring",
  Utility = "utility",
  HearingVision = "hearingVision",
}

export const expandedAccessibilityFeatures: Record<
  AccessibilitySubcategoriesEnum,
  ListingFeaturesValues[]
> = {
  [AccessibilitySubcategoriesEnum.Mobility]: expandedMobilityFeatures,
  [AccessibilitySubcategoriesEnum.Bathroom]: expandedBathroomFeatures,
  [AccessibilitySubcategoriesEnum.Flooring]: expandedFlooringFeatures,
  [AccessibilitySubcategoriesEnum.Utility]: expandedUtilityFeatures,
  [AccessibilitySubcategoriesEnum.HearingVision]: expandedHearingVisionFeatures,
}
