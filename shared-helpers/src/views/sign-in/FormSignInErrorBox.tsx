import React from "react"
import { t, AlertBox, AlertNotice, ErrorMessage } from "@bloom-housing/ui-components"
import type { UseFormMethods } from "react-hook-form"
import { NetworkStatus } from "../../auth/catchNetworkError"
import styles from "./FormSignIn.module.scss"

export type FormSignInErrorBoxProps = {
  errors: FormSignInErrorBoxControl["errors"]
  networkStatus: NetworkStatus
  errorMessageId: string
  className?: string
}

export type FormSignInErrorBoxControl = {
  errors: UseFormMethods["errors"]
  control: UseFormMethods["control"]
}

const FormSignInErrorBox = ({
  networkStatus,
  errors,
  errorMessageId,
  className,
}: FormSignInErrorBoxProps) => {
  return (
    <div className={className ? className : ""}>
      {Object.entries(errors).length > 0 && !networkStatus.content && (
        <AlertBox type="alert" inverted closeable className={styles["sign-in-error"]}>
          {errors.authentication ? errors.authentication.message : t("errors.errorsToResolve")}
        </AlertBox>
      )}

      {networkStatus.content?.error && Object.entries(errors).length === 0 && (
        <ErrorMessage
          id={`form-sign-in-${errorMessageId}-error`}
          error={!!networkStatus.content}
          className={styles["sign-in-error"]}
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
          <AlertBox
            type="success"
            inverted
            onClose={() => networkStatus.reset()}
            className={styles["sign-in-error"]}
          >
            {networkStatus.content?.title}
          </AlertBox>

          <AlertNotice title="" type="success" inverted>
            {networkStatus.content?.description}
          </AlertNotice>
        </>
      )}
    </div>
  )
}

export { FormSignInErrorBox as default, FormSignInErrorBox }
