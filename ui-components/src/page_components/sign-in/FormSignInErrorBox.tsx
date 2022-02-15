import React from "react"
import { t, AlertBox, SiteAlert, AlertNotice, ErrorMessage } from "@bloom-housing/ui-components"
import type { UseFormMethods } from "react-hook-form"
import { FormSignInNetworkError } from "./FormSignIn"

export type FormSignInErrorBoxProps = {
  errors: FormSignInErrorBoxControl["errors"]
  networkError: FormSignInNetworkError
  errorMessageId: string
}

export type FormSignInErrorBoxControl = {
  errors: UseFormMethods["errors"]
  control: UseFormMethods["control"]
}

const FormSignInErrorBox = ({ networkError, errors, errorMessageId }: FormSignInErrorBoxProps) => {
  return (
    <div>
      {Object.entries(errors).length > 0 && !networkError.error && (
        <AlertBox type="alert" inverted closeable>
          {errors.authentication ? errors.authentication.message : t("errors.errorsToResolve")}
        </AlertBox>
      )}

      {!!networkError.error && Object.entries(errors).length === 0 && (
        <ErrorMessage id={`form-sign-in-${errorMessageId}-error`} error={!!networkError.error}>
          <AlertBox type="alert" inverted onClose={() => networkError.reset()}>
            {networkError.error.title}
          </AlertBox>

          <AlertNotice title="" type="alert" inverted>
            {networkError.error.content}
          </AlertNotice>
        </ErrorMessage>
      )}

      <SiteAlert type="notice" dismissable />
    </div>
  )
}

export { FormSignInErrorBox as default, FormSignInErrorBox }
