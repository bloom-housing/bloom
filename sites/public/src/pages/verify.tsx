import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Button, Alert, Message, Dialog } from "@bloom-housing/ui-seeds"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@bloom-housing/ui-seeds/src/overlays/Dialog"
import { Field, Form, t, SiteAlert } from "@bloom-housing/ui-components"
import {
  PageView,
  pushGtmEvent,
  useCatchNetworkError,
  BloomCard,
} from "@bloom-housing/shared-helpers"
import { UserStatus } from "../lib/constants"
import FormsLayout from "../layouts/forms"
import styles from "../../styles/verify.module.scss"

const Verify = () => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors } = useForm()
  const { determineNetworkError } = useCatchNetworkError()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState(
    t("account.pwdless.codeAlert", { email: "example@email.com" })
  )

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Verify",
      status: UserStatus.NotLoggedIn,
    })
  }, [])

  const onSubmit = async (data: { code: string }) => {
    // const { code } = data

    try {
      // attempt to either create account or sign in
    } catch (error) {
      const { status } = error.response || {}
      determineNetworkError(status, error)
      // "The code you've used is invalid or expired"
    }
    // setSiteAlertMessage(t(`authentication.forgotPassword.message`), "notice")
    // await router.push("/sign-in")
  }

  return (
    <FormsLayout>
      <BloomCard title={t("account.pwdless.verifyTitle")} iconSymbol={"profile"}>
        <>
          <SiteAlert type="notice" dismissable />

          <CardSection>
            {!!Object.keys(errors).length && (
              <Alert
                className={styles["verify-error"]}
                variant="alert"
                fullwidth
                id={"verify-alert-box"}
              >
                {t("errors.errorsToResolve")}
              </Alert>
            )}

            <Message className={styles["verify-message"]}>{alertMessage}</Message>

            <Form id="verify" onSubmit={handleSubmit(onSubmit)}>
              <Field
                name="code"
                label={t("account.pwdless.code")}
                validation={{ required: true }}
                error={errors.code}
                errorMessage={t("authentication.signIn.enterValidEmailAndPasswordAndMFA")}
                register={register}
                subNote={t("account.pwdless.notReceived")}
                className={styles["verify-code"]}
              />
              <div className={styles["verify-resend-link"]}>
                <Button variant={"text"} size={"sm"} onClick={() => setIsModalOpen(true)}>
                  {t("account.pwdless.resend")}
                </Button>
              </div>

              <Button type="submit" variant="primary">
                {t("account.pwdless.continue")}
              </Button>
            </Form>
          </CardSection>
        </>
      </BloomCard>
      <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogHeader>{t("account.pwdless.resendCode")}</DialogHeader>
        <DialogContent>{t("account.pwdless.resendCodeHelper")}</DialogContent>
        <DialogFooter>
          <Button
            size={"sm"}
            onClick={() => {
              // actually resend the code
              setAlertMessage(t("account.pwdless.codeNewAlert", { email: "example@email.com" }))
              setIsModalOpen(false)
            }}
          >
            {t("account.pwdless.resendCodeButton")}
          </Button>
          <Button variant={"primary-outlined"} size={"sm"} onClick={() => setIsModalOpen(false)}>
            {t("t.cancel")}
          </Button>
        </DialogFooter>
      </Dialog>
    </FormsLayout>
  )
}

export { Verify as default, Verify }
