import { t } from "@bloom-housing/ui-components"

export const getPostmarkString = (
  applicationDueDate: string | null,
  postmarkReceivedByDate: string | null,
  developer: string | null
) => {
  if (applicationDueDate) {
    return postmarkReceivedByDate
      ? t("listings.apply.submitPaperDueDatePostMark", {
          applicationDueDate,
          postmarkReceivedByDate,
          developer,
        })
      : t("listings.apply.submitPaperDueDateNoPostMark", {
          applicationDueDate,
          developer,
        })
  } else {
    if (postmarkReceivedByDate) {
      return t("listings.apply.submitPaperNoDueDatePostMark", { postmarkReceivedByDate, developer })
    }
    if (developer) {
      return t("listings.apply.submitPaperNoDueDateNoPostMark", { developer })
    }
    return ""
  }
}
