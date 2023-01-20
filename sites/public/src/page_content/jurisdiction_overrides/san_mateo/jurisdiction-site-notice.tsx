import React from "react"
import { t } from "@bloom-housing/ui-components"

export const JursidictionSiteNotice = () => {
  return (
    <>
      {t("nav.getFeedback")}
      <a href="https://www.surveymonkey.com/r/2QLBYML" target="_blank">
        {t("nav.yourFeedback")}
      </a>
    </>
  )
}
