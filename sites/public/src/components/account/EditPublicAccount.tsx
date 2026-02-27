import React, { useContext, useEffect, useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { t } from "@bloom-housing/ui-components"
import { LoadingState } from "@bloom-housing/ui-seeds"
import { User } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import {
  PageView,
  pushGtmEvent,
  AuthContext,
  RequireLogin,
  BloomCard,
} from "@bloom-housing/shared-helpers"
import { UserStatus } from "../../lib/constants"
import FormsLayout from "../../layouts/forms"
import {
  accountNameFields,
  dobFields,
  emailFields,
  passwordFields,
  AccountSection,
  createNameSubmitHandler,
  createDobSubmitHandler,
  createEmailSubmitHandler,
  createPasswordSubmitHandler,
  AlertMessage,
} from "./EditAccountHelpers"

export const EditPublicAccount = () => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const {
    register: nameRegister,
    formState: { errors: nameErrors },
    handleSubmit: nameHandleSubmit,
    clearErrors: clearNameErrors,
  } = useForm()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const {
    register: dobRegister,
    formState: { errors: dobErrors },
    handleSubmit: dobHandleSubmit,
    watch: dobWatch,
  } = useForm()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const {
    register: emailRegister,
    formState: { errors: emailErrors },
    handleSubmit: emailHandleSubmit,
    clearErrors: clearEmailErrors,
  } = useForm()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const {
    register: pwdRegister,
    formState: { errors: pwdErrors },
    handleSubmit: pwdHandleSubmit,
    watch: pwdWatch,
  } = useForm()

  const { profile, userService } = useContext(AuthContext)
  const [passwordAlert, setPasswordAlert] = useState<AlertMessage>()
  const [nameAlert, setNameAlert] = useState<AlertMessage>()
  const [dobAlert, setDobAlert] = useState<AlertMessage>()
  const [emailAlert, setEmailAlert] = useState<AlertMessage>()
  const [nameLoading, setNameLoading] = useState(false)
  const [birthdateLoading, setBirthdateLoading] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true)

  const MIN_PASSWORD_LENGTH = 12
  const password = useRef({})
  password.current = pwdWatch("password", "")

  useEffect(() => {
    if (profile) {
      pushGtmEvent<PageView>({
        event: "pageView",
        pageTitle: "Account Settings",
        status: UserStatus.LoggedIn,
      })
      const getUser = async () => {
        const user = await userService.retrieve({ id: profile.id }).catch((err) => {
          console.error(`Error fetching user`)
          throw err
        })
        setUser(user)
        setLoading(false)
      }
      void getUser()
    }
  }, [profile, userService])

  const onNameSubmit = createNameSubmitHandler(
    userService,
    "updatePublic",
    setNameAlert,
    setNameLoading,
    setUser,
    user
  )

  const onBirthdateSubmit = createDobSubmitHandler(
    userService,
    "updatePublic",
    setDobAlert,
    setBirthdateLoading,
    setUser,
    user
  )

  const onEmailSubmit = createEmailSubmitHandler(
    userService,
    "updatePublic",
    setEmailAlert,
    setEmailLoading,
    setUser,
    user
  )

  const onPasswordSubmit = createPasswordSubmitHandler(
    userService,
    "updatePublic",
    setPasswordAlert,
    setPasswordLoading,
    setUser,
    user
  )

  return (
    <RequireLogin signInPath="/sign-in" signInMessage={t("t.loginIsRequired")}>
      <FormsLayout pageTitle={t("account.accountSettings")}>
        <BloomCard
          iconSymbol="userCircle"
          iconClass={"card-icon"}
          title={t("account.accountSettings")}
          subtitle={t("account.accountSettingsSubtitle")}
          headingPriority={1}
          headingClass={"seeds-large-heading"}
        >
          <div data-testid="edit-public-account">
            <LoadingState loading={loading}>
              <AccountSection
                alert={nameAlert}
                setAlert={setNameAlert}
                formId="update-name"
                onSubmit={nameHandleSubmit(onNameSubmit)}
                loading={nameLoading}
                buttonId="account-submit-name"
                buttonAriaLabel={`${t("account.settings.update")} ${t(
                  "application.name.yourName"
                )}`}
              >
                {accountNameFields(nameErrors, nameRegister, user, clearNameErrors)}
              </AccountSection>

              <AccountSection
                alert={dobAlert}
                setAlert={setDobAlert}
                formId="update-birthdate"
                onSubmit={dobHandleSubmit(onBirthdateSubmit)}
                loading={birthdateLoading}
                buttonId="account-submit-dob"
                buttonAriaLabel={`${t("account.settings.update")} ${t(
                  "application.name.yourDateOfBirth"
                )}`}
              >
                {dobFields(dobErrors, dobRegister, dobWatch, user)}
              </AccountSection>

              <AccountSection
                alert={emailAlert}
                setAlert={setEmailAlert}
                formId="update-email"
                onSubmit={emailHandleSubmit(onEmailSubmit)}
                loading={emailLoading}
                buttonId="account-submit-email"
                buttonAriaLabel={`${t("account.settings.update")} ${t(
                  "application.name.yourEmailAddress"
                )}`}
              >
                {emailFields(emailErrors, emailRegister, user, clearEmailErrors)}
              </AccountSection>

              <AccountSection
                alert={passwordAlert}
                setAlert={setPasswordAlert}
                formId="update-password"
                onSubmit={pwdHandleSubmit(onPasswordSubmit)}
                loading={passwordLoading}
                buttonId="account-submit-password"
                buttonAriaLabel={`${t("account.settings.update")} ${t(
                  "authentication.createAccount.password"
                )}`}
              >
                {passwordFields(pwdErrors, pwdRegister, password, MIN_PASSWORD_LENGTH)}
              </AccountSection>
            </LoadingState>
          </div>
        </BloomCard>
      </FormsLayout>
    </RequireLogin>
  )
}
