import React from "react"
import FormsLayout from "../../layouts/forms"
import { FormTerms } from "../../components/users/FormTerms"

const TermsPage = () => {
  return (
    <FormsLayout>
      <FormTerms />
    </FormsLayout>
  )
}

export { TermsPage as default, TermsPage }
