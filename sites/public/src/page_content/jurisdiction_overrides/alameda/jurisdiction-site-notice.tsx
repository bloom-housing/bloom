import React from "react"
import { t } from "@bloom-housing/ui-components"

export const JursidictionSiteNotice = () => {
  return (
    <>
      {t("nav.getFeedback")}
      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLScr7JuVwiNW8q-ifFUWTFSWqEyV5ndA08jAhJQSlQ4ETrnl9w/viewform?usp=sf_link"
        target="_blank"
        className={"cursor-pointer"}
      >
        {t("nav.yourFeedback")}
      </a>
    </>
  )
}
