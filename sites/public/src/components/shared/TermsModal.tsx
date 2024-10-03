import * as React from "react"
import type { UseFormMethods } from "react-hook-form"
import { Field, t } from "@bloom-housing/ui-components"
import { Button, Dialog, Heading } from "@bloom-housing/ui-seeds"
import Markdown from "markdown-to-jsx"
import accountStyles from "../../../styles/create-account.module.scss"

export type FormResetPasswordValues = {
  password: string
  passwordConfirmation: string
}

export type FormSignInValues = {
  email: string
  password: string
}

export type FormVerifyValues = {
  code: string
}

export type TermsModalControl = {
  errors: UseFormMethods["errors"]
  handleSubmit: UseFormMethods["handleSubmit"]
  register: UseFormMethods["register"]
}

export interface TermsModalProps {
  control: TermsModalControl
  onSubmit: (data: FormResetPasswordValues | FormSignInValues | FormVerifyValues) => void
  notChecked: boolean
  setChecked: React.Dispatch<React.SetStateAction<boolean>>
  openTermsModal: boolean
  setOpenTermsModal: React.Dispatch<React.SetStateAction<boolean>>
  isTermsLoading?: boolean
}

const TermsModal = ({
  control: { errors, register, handleSubmit },
  onSubmit,
  notChecked,
  setChecked,
  openTermsModal,
  setOpenTermsModal,
  isTermsLoading,
}: TermsModalProps) => {
  return (
    <>
      <Dialog
        isOpen={openTermsModal}
        onClose={() => {
          setOpenTermsModal(false)
        }}
        ariaLabelledBy="terms-of-service-dialog-header"
        ariaDescribedBy="terms-of-service-dialog-content"
      >
        <Dialog.Header id="terms-of-service-dialog-header">
          {t("authentication.terms.reviewTou")}
        </Dialog.Header>
        <Dialog.Content id="terms-of-service-dialog-content">
          <>
            <p>{t("authentication.terms.publicAccept")}</p>
            <Heading
              size="lg"
              priority={2}
              className={accountStyles["create-account-modal-subheader"]}
            >
              {t("authentication.terms.termsOfUse")}
            </Heading>
            <Markdown>{t("authentication.terms.publicTerms")}</Markdown>
            <Field
              id="agreedToTermsOfService"
              name="agreedToTermsOfService"
              type="checkbox"
              label={t(`authentication.terms.acceptExtended`)}
              register={register}
              validation={{ required: true }}
              error={!!errors.agree}
              errorMessage={t("errors.agreeError")}
              dataTestId="agree"
              onChange={() => setChecked(!notChecked)}
              className={accountStyles["create-account-terms-checkbox"]}
              labelClassName={accountStyles["create-account-terms-label"]}
              inputProps={{
                defaultChecked: !notChecked,
              }}
            />
          </>
        </Dialog.Content>
        <Dialog.Footer>
          <Button
            disabled={notChecked}
            type="submit"
            variant="primary"
            onClick={handleSubmit(onSubmit)}
            loadingMessage={isTermsLoading ? t("t.loading") : undefined}
          >
            {t("t.finish")}
          </Button>
        </Dialog.Footer>
      </Dialog>
    </>
  )
}

export { TermsModal as default, TermsModal }
