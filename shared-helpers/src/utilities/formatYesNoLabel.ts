import { t } from "@bloom-housing/ui-components"

export const formatYesNoLabel = (
  value: boolean | null,
  strings?: { yesString?: string; noString?: string; notApplicableString?: string }
) => {
  if (value === null || typeof value == "undefined")
    return strings?.notApplicableString ?? t("t.n/a")
  if (value) return strings?.yesString ?? t("t.yes")
  return strings?.noString ?? t("t.no")
}
