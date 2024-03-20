import React, { useEffect, useState, useContext } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/router"
import { Button, Alert, Dialog, Message } from "@bloom-housing/ui-seeds"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@bloom-housing/ui-seeds/src/overlays/Dialog"
import { Field, Form, t, SiteAlert, setSiteAlertMessage } from "@bloom-housing/ui-components"
import {
  PageView,
  pushGtmEvent,
  useCatchNetworkError,
  BloomCard,
  AuthContext,
  FormSignInErrorBox,
} from "@bloom-housing/shared-helpers"
import { UserStatus } from "../lib/constants"
import FormsLayout from "../layouts/forms"
import { useRedirectToPrevPage } from "../lib/hooks"
import styles from "../../styles/verify.module.scss"

const Verify = () => {
  const router = useRouter()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors, reset } = useForm()
  const { networkError, determineNetworkError, resetNetworkError } = useCatchNetworkError()
  const { requestSingleUseCode, loginViaSingleUseCode } = useContext(AuthContext)
  const redirectToPage = useRedirectToPrevPage("/account/dashboard")

  type FlowType = "create" | "login"
  const email = router.query?.email as string
  const flowType = router.query?.flowType as FlowType

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isResendLoading, setIsResendLoading] = useState(false)
  const [isLoginLoading, setIsLoginLoading] = useState(false)
  const [alertMessage, setAlertMessage] = useState(
    flowType === "create"
      ? t("account.pwdless.createMessage", { email })
      : t("account.pwdless.loginMessage", { email })
  )

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Verify",
      status: UserStatus.NotLoggedIn,
    })
  }, [])

  const onSubmit = async (data: { code: string }) => {
    const { code } = data

    try {
      setIsLoginLoading(true)
      const user = await loginViaSingleUseCode(email, code)
      setIsLoginLoading(false)
      if (flowType === "login") {
        setSiteAlertMessage(t(`authentication.signIn.success`, { name: user.firstName }), "success")
      } else {
        setSiteAlertMessage(t("authentication.createAccount.accountConfirmed"), "success")
      }
      await redirectToPage()
    } catch (error) {
      setIsLoginLoading(false)
      const { status } = error.response || {}
      determineNetworkError(status, error)
    }
  }

  return (
    <FormsLayout>
      <BloomCard title={t("account.pwdless.verifyTitle")} iconSymbol={"profile"}>
        <>
          <SiteAlert type="notice" dismissable />
          <FormSignInErrorBox
            errors={errors}
            networkStatus={{
              content: networkError,
              type: undefined,
              reset: () => {
                reset()
                resetNetworkError()
              },
            }}
            errorMessageId={"verify-sign-in"}
            className={styles["verify-error-container"]}
          />
          <CardSection>
            {!!Object.keys(errors).length && (
              <Alert className={styles["verify-error"]} variant="alert" fullwidth>
                {t("errors.errorsToResolve")}
              </Alert>
            )}

            {alertMessage && <Message className={styles["verify-message"]}>{alertMessage}</Message>}

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
                labelClassName={"text__caps-spaced"}
              />
              <div className={styles["verify-resend-link"]}>
                <Button variant={"text"} size={"sm"} onClick={() => setIsModalOpen(true)}>
                  {t("account.pwdless.resend")}
                </Button>
                {flowType === "login" && (
                  <span>
                    {" "}
                    {t("t.or")}{" "}
                    <Button
                      variant={"text"}
                      size={"sm"}
                      onClick={() =>
                        router.push({ pathname: "/sign-in", query: { loginType: "pwd" } })
                      }
                    >
                      {t("account.pwdless.signInWithYourPassword")}
                    </Button>
                  </span>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                loadingMessage={isLoginLoading ? t("t.loading") : null}
              >
                {t("account.pwdless.continue")}
              </Button>
            </Form>
          </CardSection>
        </>
      </BloomCard>
      <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogHeader>{t("account.pwdless.resendCode")}</DialogHeader>
        <DialogContent>{t("account.pwdless.resendCodeHelper", { email })}</DialogContent>
        <DialogFooter>
          <Button
            size={"sm"}
            onClick={async () => {
              try {
                setIsResendLoading(true)
                await requestSingleUseCode(email)
                setIsResendLoading(false)
                setAlertMessage(t("account.pwdless.codeNewAlert", { email }))
                setIsModalOpen(false)
              } catch (error) {
                setIsResendLoading(false)
                setIsModalOpen(false)
                const { status } = error.response || {}
                determineNetworkError(status, error)
              }
            }}
            loadingMessage={isResendLoading ? t("t.loading") : null}
          >
            {t("account.pwdless.resendCodeButton")}
          </Button>
          <Button
            variant={"primary-outlined"}
            size={"sm"}
            onClick={() => {
              setIsResendLoading(false)
              setIsModalOpen(false)
            }}
          >
            {t("t.cancel")}
          </Button>
        </DialogFooter>
      </Dialog>
    </FormsLayout>
  )
}

export { Verify as default, Verify }
