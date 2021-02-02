import { t } from "./translator"

export const formatYesNoLabel = (value: boolean | null) => {
  if (value === null || typeof value == "undefined") return t("t.n/a")
  if (value) return t("t.yes")
  if (!value) return t("t.no")

  return t("t.n/a")
}
