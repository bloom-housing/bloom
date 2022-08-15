import React from "react"
import { t, AlertBox, SiteAlert, AlertNotice, ErrorMessage } from "@bloom-housing/ui-components"
import type { UseFormMethods } from "react-hook-form"
import { NetworkStatus } from "./FormSignIn"

export type FormSignInErrorBoxProps = {
  errors: FormSignInErrorBoxControl["errors"]
  networkStatus: NetworkStatus
  errorMessageId: string
}

export type FormSignInErrorBoxControl = {
  errors: UseFormMethods["errors"]
  control: UseFormMethods["control"]
}

const FormSignInErrorBox = ({ networkStatus, errors, errorMessageId }: FormSignInErrorBoxProps) => {
  return (
    <div className="border-b">
      {Object.entries(errors).length > 0 && !networkStatus.content && (
        <AlertBox type="alert" inverted closeable>
          {errors.authentication ? errors.authentication.message : t("errors.errorsToResolve")}
        </AlertBox>
      )}

      {networkStatus.content?.error && Object.entries(errors).length === 0 && (
        <ErrorMessage
          id={`form-sign-in-${errorMessageId}-error`}
          error={!!networkStatus.content}
          className="block mt-0 leading-normal text-red-700"
        >
          <AlertBox type={"alert"} inverted onClose={() => networkStatus.reset()}>
            {networkStatus.content.title}
          </AlertBox>

          <AlertNotice title="" type="alert" inverted>
            {networkStatus.content.description}
          </AlertNotice>
        </ErrorMessage>
      )}

      {networkStatus.type === "success" && (
        <>
          <AlertBox type="success" inverted onClose={() => networkStatus.reset()}>
            {networkStatus.content?.title}
          </AlertBox>

          <AlertNotice title="" type="success" inverted>
            {networkStatus.content?.description}
          </AlertNotice>
        </>
      )}

      <SiteAlert type="notice" dismissable />
    </div>
  )
}

export { FormSignInErrorBox as default, FormSignInErrorBox }
