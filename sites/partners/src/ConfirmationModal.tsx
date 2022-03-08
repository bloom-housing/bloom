import {
  AppearanceStyleType,
  Button,
  Modal,
  t,
  Form,
  Field,
  useMutate,
  AuthContext,
} from "@bloom-housing/ui-components"
import { useRouter } from "next/router"
import { useEffect, useMemo, useContext } from "react"
import { useForm } from "react-hook-form"
import { emailRegex } from "../lib/helpers"

export type ConfirmationModalProps = {
  isOpen: boolean
  initialEmailValue: string
  onSuccess: () => void
  onError: (error: any) => void
  onClose: () => void
}

const ConfirmationModal = ({
  isOpen,
  initialEmailValue,
  onClose,
  onSuccess,
  onError,
}: ConfirmationModalProps) => {
  const router = useRouter()
  const { userService } = useContext(AuthContext)
  const { mutate, reset: resetMutate, isLoading } = useMutate<any>()

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

  const onSubmit = async () => {
    const isValid = await trigger()
    if (!isValid) return

    const { emailResend } = getValues()

    void mutate(
      () =>
        userService.resendConfirmation({
          body: {
            email: emailResend,
          },
        }),
      {
        onSuccess,
        onError,
      }
    )
  }

  return (
    <Modal
      open={isOpen}
      title={t("authentication.signIn.yourAccountIsNotConfirmed")}
      ariaDescription={t("authentication.createAccount.linkExpired")}
      onClose={() => {
        void router.push("/")
        onClose()
        resetMutate()
        window.scrollTo(0, 0)
      }}
      actions={[
        <Button
          type="button"
          styleType={AppearanceStyleType.primary}
          onClick={() => onSubmit()}
          loading={isLoading}
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

export { ConfirmationModal as default, ConfirmationModal }
