import React, { useContext } from "react"
import type { UseFormMethods } from "react-hook-form"
import { Field, Form, NavigationContext, t } from "@bloom-housing/ui-components"
import { Button, Heading } from "@bloom-housing/ui-seeds"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import { FormSignInErrorBox } from "./FormSignInErrorBox"
import { NetworkStatus } from "../../auth/catchNetworkError"
import { BloomCard } from "../components/BloomCard"
import { useRouter } from "next/router"
import { getListingRedirectUrl } from "../../utilities/getListingRedirectUrl"
import styles from "../../../../sites/public/styles/sign-in.module.scss"

export type FormSignInProps = {
  control: FormSignInControl
  onSubmit: (data: FormSignInValues) => void
  networkStatus: NetworkStatus
  showRegisterBtn?: boolean
}

export type FormSignInControl = {
  errors: UseFormMethods["errors"]
  handleSubmit: UseFormMethods["handleSubmit"]
  register: UseFormMethods["register"]
  watch: UseFormMethods["watch"]
}

export type FormSignInValues = {
  email: string
  password: string
}

const FormSignIn = ({
  onSubmit,
  networkStatus,
  showRegisterBtn,
  control: { errors, register, handleSubmit },
}: FormSignInProps) => {
  const onError = () => {
    window.scrollTo(0, 0)
  }
  const { LinkComponent } = useContext(NavigationContext)
  const router = useRouter()
  const listingIdRedirect = router.query?.listingId as string
  const forgetPasswordURL = getListingRedirectUrl(listingIdRedirect, "/forgot-password")
  const createAccountUrl = getListingRedirectUrl(listingIdRedirect, "/create-account")

  return (
    <BloomCard iconSymbol="profile" title={t("nav.signIn")} headingPriority={1}>
      <>
        <FormSignInErrorBox
          errors={errors}
          networkStatus={networkStatus}
          errorMessageId={"main-sign-in"}
          className="mx-12"
        />
        <CardSection divider={"inset"}>
          <Form id="sign-in" onSubmit={handleSubmit(onSubmit, onError)}>
            <Field
              className="mb-6"
              name="email"
              label={t("t.email")}
              validation={{ required: true }}
              error={errors.email}
              errorMessage={t("authentication.signIn.enterLoginEmail")}
              register={register}
              dataTestId="sign-in-email-field"
            />
            <aside>
              <LinkComponent href={forgetPasswordURL} className={styles["forgot-password"]}>
                {t("authentication.signIn.forgotPassword")}
              </LinkComponent>
            </aside>
            <Field
              className="mb-3"
              name="password"
              label={t("authentication.createAccount.password")}
              validation={{ required: true }}
              error={errors.password}
              errorMessage={t("authentication.signIn.enterLoginPassword")}
              register={register}
              type={"password"}
              dataTestId="sign-in-password-field"
            />
            <div className="mt-6">
              <Button type="submit" variant="primary" id="sign-in-button">
                {t("nav.signIn")}
              </Button>
            </div>
          </Form>
        </CardSection>
        {showRegisterBtn && (
          <CardSection className="mb-3" divider={"inset"}>
            <Heading priority={2} size="2xl" className="mb-6">
              {t("authentication.createAccount.noAccount")}
            </Heading>

            <Button variant="primary-outlined" href={createAccountUrl}>
              {t("account.createAccount")}
            </Button>
          </CardSection>
        )}
      </>
    </BloomCard>
  )
}

export { FormSignIn as default, FormSignIn }
