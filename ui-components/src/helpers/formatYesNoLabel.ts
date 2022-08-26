import { t } from "./translator"

export const formatYesNoLabel = (
  value: boolean | null,
  strings?: { yesString?: string; noString?: string; notApplicableString?: string }
) => {
  if (value === null || typeof value == "undefined")
    return strings?.notApplicableString ?? t("t.n/a")
  if (value) return strings?.yesString ?? t("t.yes")
  if (!value) return strings?.noString ?? t("t.no")

  return t("t.n/a")
}
