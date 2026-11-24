import React from "react"
import { t } from "@bloom-housing/ui-components"
import { Alert } from "@bloom-housing/ui-seeds"

const ApplicationPreviewBanner = () => (
  <Alert variant="alert-inverse" fullwidth className="fullscreen-alert">
    {t("application.applicationPreview")}
  </Alert>
)

export { ApplicationPreviewBanner }
