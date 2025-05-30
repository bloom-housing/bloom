import React, { useEffect, useState, useContext } from "react"
import { isAxiosError } from "axios"
import { useForm } from "react-hook-form"
import { useRouter } from "next/router"
import { Button, Alert, Dialog, Message } from "@bloom-housing/ui-seeds"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@bloom-housing/ui-seeds/src/overlays/Dialog"
import { Field, Form, t } from "@bloom-housing/ui-components"
import {
  PageView,
  pushGtmEvent,
  useCatchNetworkError,
  BloomCard,
  AuthContext,
  MessageContext,
  FormSignInErrorBox,
} from "@bloom-housing/shared-helpers"
import { FormVerifyValues, TermsModal } from "../components/shared/TermsModal"
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
  const { addToast } = useContext(MessageContext)
  const redirectToPage = useRedirectToPrevPage("/account/dashboard")

  type FlowType = "create" | "login" | "loginReCaptcha"
  const email = router.query?.email as string
  const flowType = router.query?.flowType as FlowType

  const getAlertMessage = () => {
    switch (flowType) {
      case "create":
        return t("account.pwdless.createMessage", { email })
      case "login":
        return t("account.pwdless.loginMessage", { email })
      case "loginReCaptcha":
        return t("account.pwdless.loginReCaptchaMessage", { email })
    }
  }

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isResendLoading, setIsResendLoading] = useState(false)
  const [isLoginLoading, setIsLoginLoading] = useState(false)
  const [alertMessage, setAlertMessage] = useState(getAlertMessage())
  const [openTermsModal, setOpenTermsModal] = useState<boolean>(false)
  const [notChecked, setChecked] = useState(true)

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
      const user = await loginViaSingleUseCode(email, code, !notChecked ? true : undefined)
      setIsLoginLoading(false)
      if (flowType === "login" || flowType === "loginReCaptcha") {
        addToast(t(`authentication.signIn.success`, { name: user.firstName }), {
          variant: "success",
        })
      } else {
        addToast(t("authentication.createAccount.accountConfirmed"), { variant: "success" })
      }
      await redirectToPage()
    } catch (error) {
      setIsLoginLoading(false)
      setOpenTermsModal(false)
      setChecked(true)
      const { status } = error.response || {}
      const responseMessage = isAxiosError(error) ? error.response?.data.message : ""
      if (status === 400 && responseMessage?.includes("has not accepted the terms of service")) {
        setOpenTermsModal(true)
      } else {
        determineNetworkError(status, error)
      }
    }
  }

  return (
    <FormsLayout>
      <BloomCard title={t("account.pwdless.verifyTitle")} customIcon={"profile"}>
        <>
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
      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ariaLabelledBy="verify-dialog-header"
        ariaDescribedBy="verify-dialog-content"
      >
        <DialogHeader id="verify-dialog-header">{t("account.pwdless.resendCode")}</DialogHeader>
        <DialogContent id="verify-dialog-content">
          {t("account.pwdless.resendCodeHelper", { email })}
        </DialogContent>
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
      <TermsModal
        control={{ register, errors, handleSubmit }}
        onSubmit={(data) => void onSubmit(data as FormVerifyValues)}
        notChecked={notChecked}
        setChecked={setChecked}
        openTermsModal={openTermsModal}
        setOpenTermsModal={setOpenTermsModal}
      />
    </FormsLayout>
  )
}

export { Verify as default, Verify }
