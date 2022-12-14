import {
  AppearanceStyleType,
  Button,
  Modal,
  t,
  Form,
  Field,
  AlertBox,
  AppearanceSizeType,
} from "@bloom-housing/ui-components"
import { AuthContext } from "../shared"
import { useRouter } from "next/router"
import { useContext, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { emailRegex } from "../lib/helpers"

export interface ConfirmationModalProps {
  setSiteAlertMessage: (message: string, alertType: string) => void
}

const ConfirmationModal = (props: ConfirmationModalProps) => {
  const { setSiteAlertMessage } = props
  const { resendConfirmation, profile, confirmAccount } = useContext(AuthContext)
  const [openModal, setOpenModal] = useState(false)
  const [modalMessage, setModalMessage] = useState(null)
  const router = useRouter()

  /* Form Handler */
  // This is causing a linting issue with unbound-method, see open issue as of 10/21/2020:
  // https://github.com/react-hook-form/react-hook-form/issues/2887
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors, watch } = useForm()
  const email = useRef({})
  email.current = watch("email", "")

  const onSubmit = async ({ email }) => {
    try {
      await resendConfirmation(email)

      setSiteAlertMessage(t(`authentication.createAccount.emailSent`), "success")
      setOpenModal(false)
    } catch (err) {
      const { data } = err.response || {}
      setModalMessage(t(`authentication.createAccount.errors.${data.message}`))
    }
    window.scrollTo(0, 0)
  }

  useEffect(() => {
    if (router?.query?.token && !profile) {
      confirmAccount(router.query.token.toString())
        .then(() => {
          void router.push({
            pathname: "/account/dashboard",
            query: { alert: `authentication.createAccount.accountConfirmed` },
          })
          window.scrollTo(0, 0)
        })
        .catch((error) => {
          const {
            response: { data },
          } = error
          if (data.statusCode === 406) {
            setSiteAlertMessage(t(`authentication.createAccount.errors.${data.message}`), "alert")
          } else {
            setOpenModal(true)
          }
        })
    }
    // This ensures useEffect is called only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, profile])

  return (
    <Modal
      open={openModal}
      title={t("authentication.createAccount.linkExpired")}
      ariaDescription={t("authentication.createAccount.linkExpired")}
      onClose={() => {
        void router.push("/")
        window.scrollTo(0, 0)
      }}
      actions={[
        <Button
          styleType={AppearanceStyleType.primary}
          onClick={() => {
            document
              .getElementById("resend-confirmation")
              .dispatchEvent(new Event("submit", { cancelable: true }))
          }}
          size={AppearanceSizeType.small}
        >
          {t("authentication.createAccount.resendTheEmail")}
        </Button>,
        <Button
          styleType={AppearanceStyleType.alert}
          onClick={() => {
            void router.push("/")
            setOpenModal(false)
            window.scrollTo(0, 0)
          }}
          size={AppearanceSizeType.small}
        >
          {t("t.cancel")}
        </Button>,
      ]}
    >
      <>
        {modalMessage && (
          <AlertBox className="" onClose={() => setModalMessage(null)} type="alert">
            {modalMessage}
          </AlertBox>
        )}
        <Form id="resend-confirmation" onSubmit={handleSubmit(onSubmit)}>
          <Field
            caps={true}
            type="email"
            name="email"
            label={t("authentication.createAccount.resendAnEmailTo")}
            placeholder="example@web.com"
            validation={{ required: true, pattern: emailRegex }}
            error={errors.email}
            errorMessage={t("authentication.signIn.loginError")}
            register={register}
          />
        </Form>
        <p className="pt-4">{t("authentication.createAccount.resendEmailInfo")}</p>
      </>
    </Modal>
  )
}

export { ConfirmationModal as default, ConfirmationModal }
