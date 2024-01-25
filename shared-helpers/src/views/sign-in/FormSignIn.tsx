import React, { useContext } from "react"
import { Field, Form, Icon, NavigationContext, t } from "@bloom-housing/ui-components"
import { Button, Heading, Card } from "@bloom-housing/ui-seeds"
import { CardHeader, CardSection, CardFooter } from "@bloom-housing/ui-seeds/src/blocks/Card"
import { FormSignInErrorBox } from "./FormSignInErrorBox"
import { NetworkStatus } from "../../auth/catchNetworkError"
import type { UseFormMethods } from "react-hook-form"
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
  return (
    <Card>
      {process.env.showMandatedAccounts ? (
        <>
          <CardHeader className="mx-12 space-y-3 pl-0 py-8">
            <Icon size="2xl" symbol="profile" />
            <Heading size="2xl" className="font-semibold">
              {t("nav.signInLowercase")}
            </Heading>
          </CardHeader>
          <FormSignInErrorBox
            errors={errors}
            networkStatus={networkStatus}
            errorMessageId={"main-sign-in"}
            className="mx-12"
          />
          <CardSection className="mx-6">
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
              />

              <aside>
                <LinkComponent href="/forgot-password" className={styles["forgot-password"]}>
                  {t("authentication.signIn.forgotPassword")}
                </LinkComponent>
              </aside>

              <Field
                caps={true}
                className="mb-3"
                name="password"
                label={t("authentication.createAccount.password")}
                labelClassName="font-semibold p-0"
                validation={{ required: true }}
                error={errors.password}
                errorMessage={t("authentication.signIn.enterLoginPassword")}
                register={register}
                type={"password"}
                dataTestId="sign-in-password-field"
              />
              <div className="mt-6">
                <Button type="submit" variant="primary" id="sign-in-button">
                  {t("nav.signInLowercase")}
                </Button>
              </div>
            </Form>
          </CardSection>
          {showRegisterBtn && (
            <CardFooter className="border-t py-8 mx-12">
              <Heading size="2xl" className="font-semibold mb-6">
                {t("authentication.createAccount.noAccount")}
              </Heading>

              <Button variant="primary-outlined" href="/create-account">
                {t("account.createAccount")}
              </Button>
            </CardFooter>
          )}
        </>
      ) : (
        <>
          <div className="form-card__lead text-center">
            <Icon size="2xl" symbol="profile" />
            <h1 className="form-card__title">{t(`nav.signIn`)}</h1>
          </div>
          <FormSignInErrorBox
            errors={errors}
            networkStatus={networkStatus}
            errorMessageId={"main-sign-in"}
          />
          <div className="form-card__group pt-0">
            <Form id="sign-in" className="mt-10" onSubmit={handleSubmit(onSubmit, onError)}>
              <Field
                caps={true}
                name="email"
                label={t("t.email")}
                validation={{ required: true }}
                error={errors.email}
                errorMessage={t("authentication.signIn.enterLoginEmail")}
                register={register}
                dataTestId="sign-in-email-field"
              />

              <aside className="float-right text-sm font-semibold">
                <LinkComponent href="/forgot-password">
                  {t("authentication.signIn.forgotPassword")}
                </LinkComponent>
              </aside>

              <Field
                caps={true}
                name="password"
                label={t("authentication.createAccount.password")}
                validation={{ required: true }}
                error={errors.password}
                errorMessage={t("authentication.signIn.enterLoginPassword")}
                register={register}
                type="password"
                dataTestId="sign-in-password-field"
              />

              <div className="text-center mt-6">
                <Button type="submit" variant="primary" id="sign-in-button">
                  {t("nav.signIn")}
                </Button>
              </div>
            </Form>
          </div>
          {showRegisterBtn && (
            <div className="form-card__group text-center border-t">
              <h2 className="mb-6">{t("authentication.createAccount.noAccount")}</h2>

              <Button variant="primary-outlined" href="/create-account">
                {t("account.createAccount")}
              </Button>
            </div>
          )}
        </>
      )}
    </Card>
  )
}

export { FormSignIn as default, FormSignIn }
