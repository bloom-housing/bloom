import { t, Form, Field } from "@bloom-housing/ui-components"
import { Button, Dialog } from "@bloom-housing/ui-seeds"
import { AuthContext, MessageContext, emailRegex } from "@bloom-housing/shared-helpers"
import { useRouter } from "next/router"
import React, { useContext, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ConfirmationModalProps {}

const ConfirmationModal = () => {
  const { resendConfirmation, profile, confirmAccount } = useContext(AuthContext)
  const { addToast } = useContext(MessageContext)
  const [openModal, setOpenModal] = useState(false)
  const router = useRouter()

  /* Form Handler */
  // This is causing a linting issue with unbound-method, see open issue as of 10/21/2020:
  // https://github.com/react-hook-form/react-hook-form/issues/2887
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors, watch, getValues } = useForm()
  const email = useRef({})
  email.current = watch("email", "")

  const onSubmit = async (email) => {
    try {
      const listingId = router.query?.listingId as string
      await resendConfirmation(email, listingId)

      addToast(t(`authentication.createAccount.emailSent`), { variant: "success" })
      setOpenModal(false)
    } catch (err) {
      const { data } = err.response || {}
      addToast(t(`authentication.createAccount.errors.${data.message}`), { variant: "alert" })
    }
    window.scrollTo(0, 0)
  }

  const onFormSubmit = async () => {
    const { email } = getValues()
    await onSubmit(email)
  }

  useEffect(() => {
    const redirectUrl = "/applications/start/choose-language"
    const listingId = router.query?.listingId as string

    const routerRedirectUrl =
      process.env.showMandatedAccounts && redirectUrl && listingId
        ? `${redirectUrl}`
        : "/account/dashboard"
    if (router?.query?.token && !profile) {
      confirmAccount(router.query.token.toString())
        .then(() => {
          void router.push({
            pathname: routerRedirectUrl,
            query:
              process.env.showMandatedAccounts && listingId
                ? { listingId: listingId }
                : { alert: `authentication.createAccount.accountConfirmed` },
          })
          window.scrollTo(0, 0)
        })
        .catch((error) => {
          const {
            response: { data },
          } = error
          if (data.statusCode === 406) {
            addToast(t(`authentication.createAccount.errors.${data.message}`), { variant: "alert" })
          } else {
            setOpenModal(true)
          }
        })
    }
    // This ensures useEffect is called only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, profile])

  return (
    <Dialog
      isOpen={openModal}
      onClose={() => {
        void router.push("/")
        window.scrollTo(0, 0)
      }}
      ariaLabelledBy="account-confirmation-dialog-header"
    >
      <Dialog.Header id="account-confirmation-dialog-header">
        {t("authentication.createAccount.linkExpired")}
      </Dialog.Header>
      <Dialog.Content>
        <Form id="resend-confirmation" onSubmit={handleSubmit(onSubmit)}>
          <Field
            type="email"
            name="email"
            label={t("authentication.createAccount.resendAnEmailTo")}
            placeholder="example@web.com"
            validation={{ required: true, pattern: emailRegex }}
            error={errors.email}
            errorMessage={t("authentication.signIn.loginError")}
            register={register}
            labelClassName={"text__caps-spaced"}
          />
        </Form>
        <p className="pt-4">{t("authentication.createAccount.resendEmailInfo")}</p>
      </Dialog.Content>
      <Dialog.Footer>
        <Button type="submit" variant="primary" onClick={() => onFormSubmit()} size="sm">
          {t("authentication.createAccount.resendTheEmail")}
        </Button>
        <Button
          variant="alert"
          onClick={() => {
            void router.push("/")
            setOpenModal(false)
            window.scrollTo(0, 0)
          }}
          size="sm"
        >
          {t("t.cancel")}
        </Button>
      </Dialog.Footer>
    </Dialog>
  )
}

export { ConfirmationModal as default, ConfirmationModal }
