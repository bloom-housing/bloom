import React, { useContext } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/router"
import Link from "next/link"
import {
  AlertBox,
  AppearanceStyleType,
  Button,
  Field,
  Form,
  FormCard,
  Icon,
  AuthContext,
  t,
} from "@bloom-housing/ui-components"
import { emailRegex } from "../lib/helpers"
import FormsLayout from "../layouts/forms"

const SignIn = () => {
  const { login } = useContext(AuthContext)
  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors, setError, clearErrors } = useForm()
  const router = useRouter()

  const onSubmit = async (data: { email: string; password: string }) => {
    const { email, password } = data

    try {
      await login(email, password)
      await router.push("/")
    } catch (err) {
      const { status } = err.response || {}
      if (status === 401) {
        console.warn(err.message)
        setError("authentication", {
          type: "manual",
          message: t("authentication.signIn.cantFindAccount"),
        })
      } else {
        console.error(err)
        setError("authentication", {
          type: "manual",
          message: `${t("authentication.signIn.error")} ${t(
            "authentication.signIn.errorGenericMessage"
          )}`,
        })
      }
    }
  }

  const onError = () => {
    window.scrollTo(0, 0)
  }

  return (
    <FormsLayout>
      <FormCard>
        <div className="form-card__lead text-center border-b mx-0">
          <Icon size="2xl" symbol="profile" />
          <h2 className="form-card__title">Partners Sign In</h2>
        </div>
        {Object.entries(errors).length > 0 && (
          <AlertBox type="alert" inverted closeable>
            {errors.authentication ? errors.authentication.message : t("t.errorsToResolve")}
          </AlertBox>
        )}

        <div className="form-card__group pt-8 border-b">
          <Form id="sign-in" onSubmit={handleSubmit(onSubmit, onError)}>
            <Field
              caps={true}
              type="email"
              name="email"
              label="Email"
              validation={{ required: true, pattern: emailRegex }}
              error={errors.email || errors.authentication}
              errorMessage={errors.email ? t("authentication.signIn.loginError") : undefined}
              register={register}
              inputProps={{
                onChange: () => clearErrors("authentication"),
              }}
            />

            <aside className="float-right font-bold">
              <Link href="/forgot-password">
                <a>{t("authentication.signIn.forgotPassword")}</a>
              </Link>
            </aside>

            <Field
              caps={true}
              type="password"
              name="password"
              label="Password"
              validation={{ required: true }}
              error={errors.password || errors.authentication}
              errorMessage={errors.password ? t("authentication.signIn.passwordError") : undefined}
              register={register}
              inputProps={{
                onChange: () => clearErrors("authentication"),
              }}
            />

            <div className="text-center mt-6">
              <Button
                styleType={AppearanceStyleType.primary}
                onClick={() => {
                  clearErrors("authentication")
                }}
              >
                Sign In
              </Button>
            </div>
          </Form>
        </div>
      </FormCard>
    </FormsLayout>
  )
}

export default SignIn
