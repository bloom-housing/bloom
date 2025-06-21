import React, { useRef, useContext, useEffect, useState } from "react"
import { useRouter } from "next/router"
import { t, FormCard, Form, Field, useMutate, AlertBox } from "@bloom-housing/ui-components"
import { Button, Dialog, Icon } from "@bloom-housing/ui-seeds"
import { AuthContext, MessageContext, passwordRegex } from "@bloom-housing/shared-helpers"
import { useForm } from "react-hook-form"
import { ReRequestConfirmation } from "./ReRequestConfirmation"
import { SuccessDTO } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import Cog8ToothIcon from "@heroicons/react/24/solid/Cog8ToothIcon"

type FormUserConfirmFields = {
  password: string
  passwordConfirmation: string
  agree: boolean
}

const MIN_PASSWORD_LENGTH = 12

const FormUserConfirm = () => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, errors, handleSubmit, watch } = useForm<FormUserConfirmFields>()
  const router = useRouter()
  const {
    mutate,
    isLoading: isConfirmLoading,
    isError,
    reset: resetMutation,
  } = useMutate<SuccessDTO>()
  const { userService, loadProfile, loading, authService } = useContext(AuthContext)
  const { addToast } = useContext(MessageContext)
  const token = router.query?.token as string

  const password = useRef({})
  password.current = watch("password", "")

  const [isSubmitting, setSubmitting] = useState(false)
  const [rerequestModalOpen, setRerequestModalOpen] = useState(false)
  const [newConfirmationRequested, setNewConfirmationRequested] = useState(false)

  useEffect(() => {
    if (!isSubmitting && token) {
      userService
        .isUserConfirmationTokenValid({ body: { token } })
        .then((res) => {
          if (!res) {
            setRerequestModalOpen(true)
          }
        })
        .catch(() => {
          setRerequestModalOpen(true)
        })
    }
  }, [isSubmitting, token, userService])

  const onSubmit = async (data: FormUserConfirmFields) => {
    setSubmitting(true)
    resetMutation()

    const body = {
      token,
      password: data.password,
    }

    try {
      const response = await mutate(() =>
        authService.confirm({
          body,
        })
      )

      if (response) {
        loadProfile("/")
        addToast(t(`users.accountConfirmed`), { variant: "success" })
      }
    } catch (err) {
      setSubmitting(false)
      setRerequestModalOpen(true)
      console.error(err)
    }
  }

  if (!token) {
    return (
      <FormCard>
        <div className="form-card__group is-borderless">
          {t(`authentication.createAccount.errors.tokenMissing`)}
        </div>
      </FormCard>
    )
  }

  return (
    <>
      <FormCard>
        <div className="form-card__lead text-center border-b mx-0 px-5">
          <Icon size="2xl">
            <Cog8ToothIcon />
          </Icon>
          <h2 className="form-card__title">{t("users.addPassword")}</h2>
          <p className="mt-4 field-note">{t("users.needUniquePassword")}</p>

          {isError && (
            <AlertBox className="mt-5" type="alert" closeable>
              {t(`errors.alert.badRequest`)}
            </AlertBox>
          )}

          {newConfirmationRequested && (
            <AlertBox className="mt-5" type="success" closeable>
              {t(`users.confirmationSent`)}
            </AlertBox>
          )}
        </div>

        <Form id="update-password" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-card__group is-borderless">
            <fieldset>
              <legend className="text__caps-spaced">
                {t("authentication.createAccount.password")}
              </legend>
              <p className="field-note mb-4">{t("users.makeNote")}</p>

              <div className="mt-5">
                <Field
                  type="password"
                  name="password"
                  label={t("account.settings.newPassword")}
                  note={t("authentication.createAccount.passwordInfo")}
                  validation={{
                    required: true,
                    minLength: MIN_PASSWORD_LENGTH,
                    pattern: passwordRegex,
                  }}
                  error={!!errors?.password}
                  errorMessage={t("authentication.signIn.passwordError")}
                  register={register}
                  className={"mb-1"}
                  inputProps={{
                    autoComplete: "off",
                  }}
                />
              </div>

              <div className="mt-5">
                <Field
                  type="password"
                  name="passwordConfirmation"
                  label={t("account.settings.confirmNewPassword")}
                  validation={{
                    required: true,
                    validate: (value) =>
                      value === password.current ||
                      t("authentication.createAccount.errors.passwordMismatch"),
                  }}
                  error={!!errors?.passwordConfirmation}
                  errorMessage={t("authentication.createAccount.errors.passwordMismatch")}
                  register={register}
                  className={"mb-1"}
                  inputProps={{
                    autoComplete: "off",
                  }}
                />
              </div>
            </fieldset>
          </div>

          <div className="form-card__pager mt-8">
            <div className="form-card__pager-row primary">
              <Button
                type="submit"
                variant="primary"
                className={"items-center"}
                loadingMessage={
                  (isConfirmLoading || loading || isSubmitting) && t("t.formSubmitted")
                }
              >
                {t("users.confirmAccount")}
              </Button>
            </div>
          </div>
        </Form>
      </FormCard>

      <Dialog
        isOpen={rerequestModalOpen}
        onClose={() => setRerequestModalOpen(false)}
        ariaLabelledBy="request-resend-dialog-header"
        ariaDescribedBy="request-resend-dialog-explanation"
      >
        <ReRequestConfirmation
          onClose={setRerequestModalOpen}
          clearExistingErrors={resetMutation}
          setAlert={setNewConfirmationRequested}
        />
      </Dialog>
    </>
  )
}

export { FormUserConfirm as default, FormUserConfirm }
