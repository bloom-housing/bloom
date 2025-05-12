import { t } from "@bloom-housing/ui-components"

export const getPostmarkString = (
  applicationDueDate: string | null,
  postmarkReceivedByDate: string | null,
  developer: string | null
) => {
  if (postmarkReceivedByDate) {
    return t("listings.apply.submitPaperPostMark", {
      postmarkReceivedByDate,
      developer,
    })
  } else if (applicationDueDate) {
    return t("listings.apply.submitPaperDueDateNoPostMark", { applicationDueDate, developer })
  } else if (developer) {
    return t("listings.apply.submitPaperNoDueDateNoPostMark", { developer })
  } else {
    return ""
  }
}
