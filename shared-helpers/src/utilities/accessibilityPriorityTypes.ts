import { UnitAccessibilityPriorityTypeEnum } from "../types/backend-swagger"

const accessibilityPriorityTypeLabelMap: Record<UnitAccessibilityPriorityTypeEnum, string> = {
  [UnitAccessibilityPriorityTypeEnum.mobility]: "Mobility",
  [UnitAccessibilityPriorityTypeEnum.hearing]: "Hearing",
  [UnitAccessibilityPriorityTypeEnum.vision]: "Vision",
  [UnitAccessibilityPriorityTypeEnum.hearingAndVision]: "Hearing and vision",
  [UnitAccessibilityPriorityTypeEnum.mobilityAndHearing]: "Mobility and hearing",
  [UnitAccessibilityPriorityTypeEnum.mobilityAndVision]: "Mobility and vision",
  [UnitAccessibilityPriorityTypeEnum.mobilityHearingAndVision]: "Mobility, hearing and vision",
}

export const getAccessibilityPriorityTypeKey = (
  type?: UnitAccessibilityPriorityTypeEnum | null
): string | null => {
  if (!type) return null
  return `listings.unit.accessibilityType.${accessibilityPriorityTypeLabelMap[type]}`
}

export const getAccessibilityPriorityTypeLabel = (
  type?: UnitAccessibilityPriorityTypeEnum | null
): string | null => {
  if (!type) return null
  return accessibilityPriorityTypeLabelMap[type]
}

export const accessibilityPriorityTypeOptions = (
  visibleTypes: UnitAccessibilityPriorityTypeEnum[] = []
) =>
  visibleTypes.map((type) => ({
    value: type,
    id: type,
    labelKey: getAccessibilityPriorityTypeKey(type),
  }))
