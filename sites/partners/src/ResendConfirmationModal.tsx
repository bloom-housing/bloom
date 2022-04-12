import { AppearanceStyleType, Button, Modal, t, Form, Field } from "@bloom-housing/ui-components"
import { useRouter } from "next/router"
import { useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import { emailRegex } from "../lib/helpers"

export type ResendConfirmationModalProps = {
  isOpen: boolean
  initialEmailValue: string
  onClose: () => void
  onSubmit: (email: string) => void
  loading: boolean
}

export type ResendConfirmationModalForm = {
  onSubmit: (email: string) => void
}

const ResendConfirmationModal = ({
  isOpen,
  initialEmailValue,
  loading,
  onClose,
  onSubmit,
}: ResendConfirmationModalProps) => {
  const router = useRouter()
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, errors, reset, getValues, trigger } = useForm({
    defaultValues: useMemo(() => {
      return {
        emailResend: initialEmailValue,
      }
    }, [initialEmailValue]),
  })

  useEffect(() => {
    reset({
      emailResend: initialEmailValue,
    })
  }, [initialEmailValue, reset])

  const onFormSubmit = async () => {
    const isValid = await trigger()
    if (!isValid) return

    const { emailResend } = getValues()
    onSubmit(emailResend)
  }

  return (
    <Modal
      open={isOpen}
      title={t("authentication.signIn.yourAccountIsNotConfirmed")}
      ariaDescription={t("authentication.createAccount.linkExpired")}
      onClose={() => {
        void router.push("/")
        onClose()
        window.scrollTo(0, 0)
      }}
      actions={[
        <Button
          type="button"
          styleType={AppearanceStyleType.primary}
          onClick={() => onFormSubmit()}
          loading={loading}
        >
          {t("authentication.createAccount.resendTheEmail")}
        </Button>,
        <Button
          type="button"
          styleType={AppearanceStyleType.alert}
          onClick={() => {
            void router.push("/")
            onClose()
            window.scrollTo(0, 0)
          }}
        >
          {t("t.cancel")}
        </Button>,
      ]}
    >
      <>
        <Form>
          <Field
            caps={true}
            type="email"
            name="emailResend"
            label={t("authentication.createAccount.resendAnEmailTo")}
            placeholder="example@web.com"
            validation={{ required: true, pattern: emailRegex }}
            error={!!errors.emailResend}
            errorMessage={t("authentication.signIn.loginError")}
            register={register}
          />
        </Form>

        <p className="pt-4">{t("authentication.createAccount.resendEmailInfo")}</p>
      </>
    </Modal>
  )
}

export { ResendConfirmationModal as default, ResendConfirmationModal }
