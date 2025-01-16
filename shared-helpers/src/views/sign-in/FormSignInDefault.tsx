import React, { useContext } from "react"
import { useRouter } from "next/router"
import type { UseFormMethods } from "react-hook-form"
import { Field, Form, t } from "@bloom-housing/ui-components"
import { Button, Link } from "@bloom-housing/ui-seeds"
import { getListingRedirectUrl } from "../../utilities/getListingRedirectUrl"
import styles from "./FormSignIn.module.scss"

export type FormSignInDefaultProps = {
  control: FormSignInDefaultControl
  onSubmit: (data: FormSignInDefaultValues) => void
  loading?: boolean
}

export type FormSignInDefaultValues = {
  email: string
  password: string
}

export type FormSignInDefaultControl = {
  errors: UseFormMethods["errors"]
  handleSubmit: UseFormMethods["handleSubmit"]
  register: UseFormMethods["register"]
}

const FormSignInDefault = ({
  onSubmit,
  control: { errors, register, handleSubmit },
  loading,
}: FormSignInDefaultProps) => {
  const onError = () => {
    window.scrollTo(0, 0)
  }
  const router = useRouter()
  const listingIdRedirect = router.query?.listingId as string
  const forgetPasswordURL = getListingRedirectUrl(listingIdRedirect, "/forgot-password")

  return (
    <Form id="sign-in" onSubmit={handleSubmit(onSubmit, onError)}>
      <Field
        className={styles["sign-in-email-input"]}
        name="email"
        label={t("t.email")}
        labelClassName="text__caps-spaced"
        validation={{ required: true }}
        error={errors.email}
        errorMessage={t("authentication.signIn.enterLoginEmail")}
        register={register}
        dataTestId="sign-in-email-field"
      />
      <aside>
        <Link href={forgetPasswordURL} className={styles["forgot-password"]}>
          {t("authentication.signIn.forgotPassword")}
        </Link>
      </aside>
      <Field
        className={styles["sign-in-password-input"]}
        name="password"
        label={t("authentication.createAccount.password")}
        labelClassName="text__caps-spaced"
        validation={{ required: true }}
        error={errors.password}
        errorMessage={t("authentication.signIn.enterLoginPassword")}
        register={register}
        type={"password"}
        dataTestId="sign-in-password-field"
      />
      <div className={styles["sign-in-action"]}>
        <Button
          type="submit"
          variant="primary"
          id="sign-in-button"
          loadingMessage={loading ? t("t.loading") : null}
        >
          {t("nav.signIn")}
        </Button>
      </div>
    </Form>
  )
}

export { FormSignInDefault as default, FormSignInDefault }
