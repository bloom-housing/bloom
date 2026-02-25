import React, { useContext, useEffect, useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { t } from "@bloom-housing/ui-components"
import { LoadingState } from "@bloom-housing/ui-seeds"
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
  addressFields,
  agencyFields,
  emailFields,
  passwordFields,
  phoneFields,
  AccountSection,
  createNameSubmitHandler,
  createEmailSubmitHandler,
  createPasswordSubmitHandler,
  AlertMessage,
} from "./EditAccountHelpers"
import { Agency, User } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

interface EditAdvocateAccountProps {
  agencies: Agency[]
}

export const EditAdvocateAccount = (props: EditAdvocateAccountProps) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const {
    register: nameRegister,
    formState: { errors: nameErrors },
    handleSubmit: nameHandleSubmit,
    clearErrors: nameClearErrors,
  } = useForm()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const {
    register: emailRegister,
    formState: { errors: emailErrors },
    handleSubmit: emailHandleSubmit,
    clearErrors: emailClearErrors,
  } = useForm()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const {
    register: agencyRegister,
    formState: { errors: agencyErrors },
    handleSubmit: agencyHandleSubmit,
  } = useForm()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const {
    register: addressRegister,
    formState: { errors: addressErrors },
    handleSubmit: addressHandleSubmit,
    watch: addressWatch,
  } = useForm()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const {
    register: phoneRegister,
    control: phoneControl,
    formState: { errors: phoneErrors },
    handleSubmit: phoneHandleSubmit,
    watch: phoneWatch,
    setValue: setPhoneValue,
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
  const [emailAlert, setEmailAlert] = useState<AlertMessage>()
  const [agencyAlert, setAgencyAlert] = useState<AlertMessage>()
  const [addressAlert, setAddressAlert] = useState<AlertMessage>()
  const [phoneAlert, setPhoneAlert] = useState<AlertMessage>()
  const [nameLoading, setNameLoading] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)
  const [agencyLoading, setAgencyLoading] = useState(false)
  const [addressLoading, setAddressLoading] = useState(false)
  const [phoneLoading, setPhoneLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [user, setUser] = useState(null)
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
    "updateAdvocate",
    setNameAlert,
    setNameLoading,
    setUser,
    user
  )

  const onEmailSubmit = createEmailSubmitHandler(
    userService,
    "updateAdvocate",
    setEmailAlert,
    setEmailLoading,
    setUser,
    user
  )

  const onAgencySubmit = async (data: { agencyId: string }) => {
    setAgencyLoading(true)
    setAgencyAlert(null)
    try {
      const newUser = await userService.updateAdvocate({
        body: {
          ...user,
          agency: data.agencyId ? { id: data.agencyId } : undefined,
        },
      })
      setUser(newUser)
      setAgencyAlert({ type: "success", message: `${t("users.userUpdated")}` })
      setAgencyLoading(false)
    } catch (err) {
      setAgencyLoading(false)
      setAgencyAlert({ type: "alert", message: `${t("account.settings.alerts.genericError")}` })
      console.warn(err)
    }
  }

  const onAddressSubmit = async (data: {
    isPOBox: "yes" | "no"
    poBox?: string
    street?: string
    street2?: string
    city: string
    state: string
    zipCode: string
  }) => {
    setAddressLoading(true)
    setAddressAlert(null)
    const poBoxValue = (data.poBox || "").replace(/^po box\s*/i, "").trim()
    const streetValue = data.isPOBox === "yes" ? `PO Box ${poBoxValue}` : data.street || ""
    console.log({ data, poBoxValue, streetValue })
    console.log({
      ...user,
      address: {
        ...(user?.address || {}),
        street: streetValue,
        street2: data.isPOBox === "yes" ? "" : data.street2,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
      },
    })
    try {
      const newUser = await userService.updateAdvocate({
        body: {
          ...user,
          address: {
            ...(user?.address || {}),
            street: streetValue,
            street2: data.isPOBox === "yes" ? "" : data.street2,
            city: data.city,
            state: data.state,
            zipCode: data.zipCode,
          },
        },
      })
      setUser(newUser)
      setAddressAlert({ type: "success", message: `${t("users.userUpdated")}` })
      setAddressLoading(false)
    } catch (err) {
      setAddressLoading(false)
      setAddressAlert({ type: "alert", message: `${t("account.settings.alerts.genericError")}` })
      console.warn(err)
    }
  }

  const onPhoneSubmit = async (data: {
    phoneNumber: string
    phoneType: string
    phoneExtension: string
    hasAdditionalPhone: boolean
    additionalPhoneNumber: string
    additionalPhoneNumberType: string
    additionalPhoneExtension: string
  }) => {
    setPhoneLoading(true)
    setPhoneAlert(null)
    try {
      const hasAdditionalPhone = !!data.hasAdditionalPhone
      const newUser = await userService.updateAdvocate({
        body: {
          ...user,
          phoneNumber: data.phoneNumber,
          phoneType: data.phoneType,
          phoneExtension: data.phoneExtension || undefined,
          additionalPhoneNumber: hasAdditionalPhone ? data.additionalPhoneNumber : undefined,
          additionalPhoneNumberType: hasAdditionalPhone
            ? data.additionalPhoneNumberType
            : undefined,
          additionalPhoneExtension: hasAdditionalPhone
            ? data.additionalPhoneExtension || undefined
            : undefined,
        },
      })
      setUser(newUser)
      setPhoneAlert({ type: "success", message: `${t("users.userUpdated")}` })
      setPhoneLoading(false)
    } catch (err) {
      setPhoneLoading(false)
      setPhoneAlert({ type: "alert", message: `${t("account.settings.alerts.genericError")}` })
      console.warn(err)
    }
  }

  const onPasswordSubmit = createPasswordSubmitHandler(
    userService,
    "updateAdvocate",
    setPasswordAlert,
    setPasswordLoading,
    setUser,
    user
  )

  const isPOBoxSelected =
    addressWatch(
      "isPOBox",
      user?.address?.street?.toLowerCase().startsWith("po box") ? "yes" : "no"
    ) === "yes"

  console.log({ isPOBoxSelected })
  const hasAdditionalPhone = phoneWatch("hasAdditionalPhone", !!user?.additionalPhoneNumber)

  console.log({ user })

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
          <LoadingState loading={loading}>
            <AccountSection
              alert={nameAlert}
              setAlert={setNameAlert}
              formId="update-name"
              onSubmit={nameHandleSubmit(onNameSubmit)}
              loading={nameLoading}
              buttonId="account-submit-name"
              buttonAriaLabel={`${t("account.settings.update")} ${t("application.name.yourName")}`}
            >
              {accountNameFields(nameErrors, nameRegister, user, nameClearErrors)}
            </AccountSection>

            <AccountSection
              alert={agencyAlert}
              setAlert={setAgencyAlert}
              formId="update-agency"
              onSubmit={agencyHandleSubmit(onAgencySubmit)}
              loading={agencyLoading}
              buttonId="account-submit-agency"
              buttonAriaLabel={`${t("account.settings.update")} ${t(
                "advocateAccount.agencyLabel"
              )}`}
            >
              {agencyFields(agencyErrors, agencyRegister, user, [
                { value: "", label: "" },
                ...(props.agencies?.map((agency) => ({
                  id: agency.id,
                  label: agency.name,
                  value: agency.id,
                  dataTestId: agency.name,
                })) || []),
              ])}
            </AccountSection>

            <AccountSection
              alert={addressAlert}
              setAlert={setAddressAlert}
              formId="update-address"
              onSubmit={addressHandleSubmit(onAddressSubmit)}
              loading={addressLoading}
              buttonId="account-submit-address"
              buttonAriaLabel={`${t("account.settings.update")} ${t(
                "application.contact.address"
              )}`}
            >
              {addressFields(
                addressErrors,
                addressRegister,
                user,
                isPOBoxSelected,
                user?.address?.street?.toLowerCase().startsWith("po box")
              )}
            </AccountSection>

            <AccountSection
              alert={phoneAlert}
              setAlert={setPhoneAlert}
              formId="update-phone-number"
              onSubmit={phoneHandleSubmit(onPhoneSubmit)}
              loading={phoneLoading}
              buttonId="account-submit-phone"
              buttonAriaLabel={`${t("account.settings.update")} ${t(
                "application.contact.yourPhoneNumber"
              )}`}
            >
              {phoneFields(
                phoneErrors,
                phoneRegister,
                phoneControl,
                setPhoneValue,
                user,
                hasAdditionalPhone
              )}
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
              {emailFields(emailErrors, emailRegister, user, emailClearErrors)}
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
        </BloomCard>
      </FormsLayout>
    </RequireLogin>
  )
}
