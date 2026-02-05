import React from "react"
import { t } from "@bloom-housing/ui-components"
import { FormUserConfirm } from "../../components/users/FormUserConfirm"
import FormsLayout from "../../layouts/forms"

const ConfirmPage = () => {
  return (
    <FormsLayout title={`User Confirm - ${t("nav.siteTitlePartners")}`}>
      <FormUserConfirm />
    </FormsLayout>
  )
}

export { ConfirmPage as default, ConfirmPage }
