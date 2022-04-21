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
    return postmarkReceivedByDate
      ? t("listings.apply.submitPaperNoDueDatePostMark", { postmarkReceivedByDate, developer })
      : developer
      ? t("listings.apply.submitPaperNoDueDateNoPostMark", { developer })
      : ""
  }
}
