import React from "react"
import FormsLayout from "../../layouts/forms"
import { FormTerms } from "@bloom-housing/ui-components"

const TermsPage = () => {
  return (
    <FormsLayout wide={true}>
      <FormTerms />
    </FormsLayout>
  )
}

export { TermsPage as default, TermsPage }
