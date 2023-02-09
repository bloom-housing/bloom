import React from "react"
import FormsLayout from "../../layouts/forms"
import { FormTerms } from "../../../../detroit-ui-components/src/page_components/sign-in/FormTerms"

const TermsPage = () => {
  return (
    <FormsLayout>
      <FormTerms />
    </FormsLayout>
  )
}

export { TermsPage as default, TermsPage }
