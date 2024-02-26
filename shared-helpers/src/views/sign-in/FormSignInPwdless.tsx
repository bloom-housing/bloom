import React, { useContext, useState } from "react"
import type { UseFormMethods } from "react-hook-form"
import { Field, Form, NavigationContext, t } from "@bloom-housing/ui-components"
import { Button } from "@bloom-housing/ui-seeds"
import styles from "../../../../sites/public/styles/sign-in.module.scss"
import { useRouter } from "next/router"
import { getListingRedirectUrl } from "../../utilities/getListingRedirectUrl"

export type FormSignInPwdlessProps = {
  control: FormSignInPwdlessControl
  onSubmit: (data: FormSignInPwdlessValues) => void
}

export type FormSignInPwdlessValues = {
  email: string
  password: string
}

export type FormSignInPwdlessControl = {
  errors: UseFormMethods["errors"]
  handleSubmit: UseFormMethods["handleSubmit"]
  register: UseFormMethods["register"]
}

const FormSignInPwdless = ({
  onSubmit,
  control: { errors, register, handleSubmit },
}: FormSignInPwdlessProps) => {
  const onError = () => {
    window.scrollTo(0, 0)
  }
  const { LinkComponent } = useContext(NavigationContext)
  const router = useRouter()
  const listingIdRedirect = router.query?.listingId as string
  const forgetPasswordURL = getListingRedirectUrl(listingIdRedirect, "/forgot-password")

  const [useCode, setUseCode] = useState(true)

  return (
    <Form id="sign-in" onSubmit={handleSubmit(onSubmit, onError)}>
      <Field
        caps={true}
        className="mb-6"
        name="email"
        label={t("t.email")}
        labelClassName="font-semibold p-0"
        validation={{ required: true }}
        error={errors.email}
        errorMessage={t("authentication.signIn.enterLoginEmail")}
        register={register}
        dataTestId="sign-in-email-field"
        note={useCode ? t("authentication.signIn.pwdless.emailHelperText") : ""}
      />

      {!useCode && (
        <>
          <aside>
            <LinkComponent href={forgetPasswordURL} className={styles["forgot-password"]}>
              {t("authentication.signIn.forgotPassword")}
            </LinkComponent>
          </aside>
          <Field
            caps={true}
            className="mb-3"
            name="password"
            label={t("authentication.createAccount.password")}
            labelClassName="font-semibold p-0"
            validation={{ required: !useCode }}
            error={errors.password}
            errorMessage={t("authentication.signIn.enterLoginPassword")}
            register={register}
            type={"password"}
            dataTestId="sign-in-password-field"
          />
        </>
      )}
      <div className="mt-6">
        <Button type="submit" variant="primary" id="sign-in-button">
          {useCode ? t("authentication.signIn.pwdless.getCode") : t("nav.signIn")}
        </Button>
      </div>
      <div className="mt-6">
        <Button variant={"text"} onClick={() => setUseCode(!useCode)}>
          {useCode
            ? t("authentication.signIn.pwdless.usePassword")
            : t("authentication.signIn.pwdless.useCode")}
        </Button>
      </div>
    </Form>
  )
}

export { FormSignInPwdless as default, FormSignInPwdless }
