import React from "react"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)
import customParseFormat from "dayjs/plugin/customParseFormat"
dayjs.extend(customParseFormat)
import { Control, DeepMap, FieldError, FieldValues, UseFormMethods } from "react-hook-form"
import {
  Field,
  t,
  DOBField,
  DOBFieldValues,
  Select,
  PhoneField,
  AlertBox,
  AlertTypes,
} from "@bloom-housing/ui-components"
import Link from "next/link"
import { Button, Card } from "@bloom-housing/ui-seeds"
import {
  passwordRegex,
  emailRegex,
  stateKeys,
  phoneNumberKeys,
} from "@bloom-housing/shared-helpers"
import styles from "../../pages/account/account.module.scss"
import { Agency, User, UserService } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

export type AlertMessage = {
  type: AlertTypes
  message: string
}

export const accountNameFields = (
  nameErrors: DeepMap<FieldValues, FieldError>,
  nameRegister: UseFormMethods["register"],
  user: User,
  clearErrors: (name?: string | string[]) => void
) => {
  return (
    <fieldset>
      <legend className={styles["account-settings-label"]}>{t("application.name.yourName")}</legend>
      <Field
        label={t("application.name.firstOrGivenName")}
        className="my-3"
        controlClassName="mt-2"
        name="firstName"
        error={nameErrors.firstName}
        validation={{ required: true, maxLength: 64 }}
        errorMessage={
          nameErrors.firstName?.type === "maxLength"
            ? t("errors.maxLength", { length: 64 })
            : t("errors.firstNameError")
        }
        inputProps={{ onChange: () => nameErrors.firstName && clearErrors("firstName") }}
        register={nameRegister}
        defaultValue={user ? user.firstName : null}
        dataTestId={"account-first-name"}
      />

      <Field
        name="middleName"
        className="mb-3"
        register={nameRegister}
        defaultValue={user ? user?.middleName : null}
        label={t("application.name.middleNameOptional")}
        error={nameErrors.middleName}
        validation={{ maxLength: 64 }}
        errorMessage={t("errors.maxLength", { length: 64 })}
        dataTestId={"account-middle-name"}
      />

      <Field
        name="lastName"
        error={nameErrors.lastName}
        register={nameRegister}
        defaultValue={user ? user.lastName : null}
        label={t("application.name.lastOrFamilyName")}
        validation={{ maxLength: 64, required: true }}
        errorMessage={
          nameErrors.lastName?.type === "maxLength"
            ? t("errors.maxLength", { length: 64 })
            : t("errors.lastNameError")
        }
        inputProps={{ onChange: () => nameErrors.lastName && clearErrors("lastName") }}
        dataTestId={"account-last-name"}
      />
    </fieldset>
  )
}

export const dobFields = (
  dobErrors: DeepMap<FieldValues, FieldError>,
  dobRegister: UseFormMethods["register"],
  dobWatch: UseFormMethods["watch"],
  user: User,
  show18SubNote?: boolean
) => {
  return (
    <>
      <DOBField
        id="dob"
        name="dob"
        register={dobRegister}
        error={dobErrors?.dob}
        watch={dobWatch}
        validateAge18={true}
        required={true}
        errorMessage={t("errors.dateOfBirthErrorAge")}
        defaultDOB={{
          birthDay: user ? dayjs(new Date(user.dob)).utc().format("DD") : null,
          birthMonth: user ? dayjs(new Date(user.dob)).utc().format("MM") : null,
          birthYear: user ? dayjs(new Date(user.dob)).utc().format("YYYY") : null,
        }}
        label={t("application.name.yourDateOfBirth")}
      />

      <p className={"field-sub-note"}>{t("application.name.dobHelper")}</p>
      {show18SubNote && (
        <p className={"field-sub-note seeds-m-bs-4"}>{t("application.name.dobHelper2")}</p>
      )}
    </>
  )
}

export const emailFields = (
  emailErrors: DeepMap<FieldValues, FieldError>,
  emailRegister: UseFormMethods["register"],
  user: User,
  clearErrors: (name?: string | string[]) => void,
  note?: string
) => {
  return (
    <fieldset>
      <legend className={`${styles["account-settings-label"]} seeds-m-be-3`}>
        {t("application.name.yourEmailAddress")}
      </legend>
      <Field
        type="email"
        name="email"
        label={t("t.email")}
        validation={{ pattern: emailRegex, required: true }}
        error={emailErrors.email}
        errorMessage={t("authentication.signIn.loginError")}
        register={emailRegister}
        defaultValue={user ? user.email : null}
        dataTestId={"account-email"}
        inputProps={{ onChange: () => emailErrors.email && clearErrors("email") }}
        note={note}
        subNote={t("advocateAccount.emailSubNote")}
      />
    </fieldset>
  )
}
export const passwordFields = (
  pwdErrors: DeepMap<FieldValues, FieldError>,
  pwdRegister: UseFormMethods["register"],
  password: React.RefObject<unknown>,
  minLength: number
) => {
  return (
    <fieldset>
      <legend className={styles["account-settings-label"]}>
        {t("authentication.createAccount.password")}
      </legend>
      <p className="field-note mt-2 mb-3">{t("account.settings.passwordRemember")}</p>
      <div className={"flex flex-col"}>
        <Field
          type="password"
          name="currentPassword"
          label={t("account.settings.currentPassword")}
          error={pwdErrors.currentPassword}
          register={pwdRegister}
          className={"mb-1"}
          dataTestId={"account-current-password"}
        />
        <span className="float-left text-sm font-semibold mt-2">
          <Link href="/forgot-password">{t("authentication.signIn.forgotPassword")}</Link>
        </span>
      </div>

      <Field
        type="password"
        name="password"
        label={t("account.settings.newPassword")}
        labelClassName="mt-4"
        className="mt-4"
        note={t("authentication.createAccount.passwordInfo")}
        validation={{
          minLength: minLength,
          pattern: passwordRegex,
        }}
        error={pwdErrors.password}
        errorMessage={t("authentication.signIn.passwordError")}
        register={pwdRegister}
        dataTestId={"account-password"}
      />

      <Field
        type="password"
        name="passwordConfirmation"
        label={t("account.settings.confirmNewPassword")}
        className="mt-4"
        validation={{
          validate: (value) =>
            value === password.current || t("authentication.createAccount.errors.passwordMismatch"),
        }}
        error={pwdErrors.passwordConfirmation}
        errorMessage={t("authentication.createAccount.errors.passwordMismatch")}
        register={pwdRegister}
        dataTestId={"account-password-confirmation"}
      />
    </fieldset>
  )
}

export const createAccountPasswordFields = (
  pwdErrors: DeepMap<FieldValues, FieldError>,
  pwdRegister: UseFormMethods["register"],
  password: React.RefObject<unknown>,
  controlClassName?: string,
  fieldClassName?: string
) => {
  return (
    <fieldset>
      <legend className={"text__caps-spaced seeds-m-be-0"}>
        {t("authentication.createAccount.password")}
      </legend>
      <Field
        labelClassName={"sr-only"}
        type={"password"}
        name="password"
        note={t("authentication.createAccount.passwordInfo")}
        label={t("authentication.createAccount.password")}
        validation={{
          required: true,
          minLength: 8,
          pattern: passwordRegex,
        }}
        error={pwdErrors.password}
        errorMessage={t("authentication.signIn.passwordError")}
        register={pwdRegister}
        controlClassName={controlClassName}
      />
      <Field
        type="password"
        id="passwordConfirmation"
        name="passwordConfirmation"
        validation={{
          validate: (value) =>
            value === password.current || t("authentication.createAccount.errors.passwordMismatch"),
        }}
        onPaste={(e) => {
          e.preventDefault()
          e.nativeEvent.stopImmediatePropagation()
          return false
        }}
        onDrop={(e) => {
          e.preventDefault()
          e.nativeEvent.stopImmediatePropagation()
          return false
        }}
        error={pwdErrors.passwordConfirmation}
        errorMessage={t("authentication.createAccount.errors.passwordMismatch")}
        register={pwdRegister}
        controlClassName={controlClassName}
        label={t("authentication.createAccount.reEnterPassword")}
        className={fieldClassName ? `${fieldClassName} seeds-m-bs-0` : "seeds-m-bs-0"}
      />
    </fieldset>
  )
}

export const agencyFields = (
  agencyErrors: DeepMap<FieldValues, FieldError>,
  agencyRegister: UseFormMethods["register"],
  user: User,
  agencies: Agency[]
) => {
  return (
    <>
      <p className={"text__caps-spaced"}>{t("advocateAccount.organizationHeading")}</p>
      <Select
        id={"agencyId"}
        name={"agencyId"}
        label={t("advocateAccount.agencyLabel")}
        register={agencyRegister}
        controlClassName={"control"}
        options={[
          { value: "", label: "" },
          ...(agencies?.map((agency) => ({
            id: agency.id,
            label: agency.name,
            value: agency.id,
            dataTestId: agency.name,
          })) || []),
        ]}
        defaultValue={user?.agency?.id || ""}
        validation={{ required: true }}
        error={agencyErrors?.agencyId}
        errorMessage={t("errors.requiredFieldError")}
        dataTestId={"account-agency"}
        subNote={t("advocateAccount.agencyNotListed")}
      />
    </>
  )
}

export const addressFields = (
  addressErrors: DeepMap<FieldValues, FieldError>,
  addressRegister: UseFormMethods["register"],
  user: User,
  isPOBoxSelected: boolean,
  defaultPoBoxValue: boolean
) => {
  return (
    <fieldset>
      <legend className={styles["account-settings-label"]}>
        {t("application.contact.address")}
      </legend>
      <fieldset>
        <legend>
          <p className="field-note mt-2 mb-3">{"Is there a PO Box?"}</p>
        </legend>
        <Field
          className="mb-1"
          type="radio"
          id="isPOBoxYes"
          name="isPOBox"
          label={t("t.yes")}
          register={addressRegister}
          inputProps={{ value: "yes", defaultChecked: defaultPoBoxValue }}
          dataTestId={"account-address-po-box-yes"}
        />
        <Field
          className="mb-4"
          type="radio"
          id="isPOBoxNo"
          name="isPOBox"
          label={t("t.no")}
          register={addressRegister}
          inputProps={{ value: "no", defaultChecked: !defaultPoBoxValue }}
          dataTestId={"account-address-po-box-no"}
        />
      </fieldset>
      {isPOBoxSelected ? (
        <Field
          id="poBox"
          name="poBox"
          label={"PO Box #"}
          defaultValue={
            user?.address?.street?.toLowerCase().startsWith("po box")
              ? user.address.street.replace(/po box\s*/i, "")
              : ""
          }
          validation={{ required: true, maxLength: 64 }}
          error={addressErrors?.poBox}
          errorMessage={
            addressErrors?.poBox?.type === "maxLength"
              ? t("errors.maxLength", { length: 64 })
              : t("errors.streetError")
          }
          register={addressRegister}
          dataTestId={"account-address-po-box"}
        />
      ) : (
        <>
          <Field
            id="street"
            name="street"
            label={t("application.contact.streetAddress")}
            defaultValue={
              user?.address?.street?.toLowerCase().startsWith("po box")
                ? ""
                : user?.address?.street || ""
            }
            validation={{ required: true, maxLength: 64 }}
            error={addressErrors?.street}
            errorMessage={
              addressErrors?.street?.type === "maxLength"
                ? t("errors.maxLength", { length: 64 })
                : t("errors.streetError")
            }
            register={addressRegister}
            dataTestId={"account-address-street"}
          />
          <Field
            id="street2"
            name="street2"
            label={t("application.contact.aptOptional")}
            defaultValue={user?.address?.street2 || ""}
            validation={{ maxLength: 64 }}
            error={addressErrors?.street2}
            errorMessage={t("errors.maxLength", { length: 64 })}
            register={addressRegister}
            dataTestId={"account-address-street2"}
          />
        </>
      )}
      <Field
        id="city"
        name="city"
        label={t("application.contact.cityName")}
        defaultValue={user?.address?.city || ""}
        validation={{ required: true, maxLength: 64 }}
        error={addressErrors?.city}
        errorMessage={
          addressErrors?.city?.type === "maxLength"
            ? t("errors.maxLength", { length: 64 })
            : t("errors.cityError")
        }
        register={addressRegister}
        dataTestId={"account-address-city"}
      />
      <div className="flex max-w-2xl">
        <Select
          id="state"
          name="state"
          label={t("application.contact.state")}
          validation={{ required: true, maxLength: 64 }}
          error={addressErrors?.state}
          errorMessage={
            addressErrors?.state?.type === "maxLength"
              ? t("errors.maxLength", { length: 64 })
              : t("errors.stateError")
          }
          register={addressRegister}
          controlClassName="control"
          options={stateKeys}
          keyPrefix="states"
          defaultValue={user?.address?.state || ""}
          dataTestId={"account-address-state"}
        />
        <Field
          id="zipCode"
          name="zipCode"
          label={t("application.contact.zip")}
          defaultValue={user?.address?.zipCode || ""}
          validation={{ required: true, maxLength: 10 }}
          error={addressErrors?.zipCode}
          errorMessage={
            addressErrors?.zipCode?.type === "maxLength"
              ? t("errors.maxLength", { length: 10 })
              : t("errors.zipCodeError")
          }
          register={addressRegister}
          dataTestId={"account-address-zip"}
        />
      </div>
    </fieldset>
  )
}

export const phoneFields = (
  phoneErrors: DeepMap<FieldValues, FieldError>,
  phoneRegister: UseFormMethods["register"],
  phoneControl: Control<FieldValues>,
  setPhoneValue: UseFormMethods["setValue"],
  user: User,
  hasAdditionalPhone: boolean
) => {
  return (
    <fieldset className={hasAdditionalPhone ? "seeds-p-be-6" : "seeds-p-be-2"}>
      <legend className={`${styles["account-settings-label"]} seeds-m-be-3`}>
        {t("application.contact.yourPhoneNumber")}
      </legend>
      <PhoneField
        label={t("application.contact.number")}
        required={true}
        id="phoneNumber"
        name="phoneNumber"
        error={phoneErrors?.phoneNumber}
        errorMessage={t("errors.phoneNumberError")}
        controlClassName="control"
        control={phoneControl}
        defaultValue={user?.phoneNumber || ""}
        dataTestId={"account-phone-number"}
        subNote={t("application.contact.number.subNote")}
      />
      <Field
        id="phoneExtension"
        name="phoneExtension"
        label={t("t.phoneExtensionOptional")}
        defaultValue={user?.phoneExtension || ""}
        validation={{ maxLength: 10 }}
        error={phoneErrors?.phoneExtension}
        errorMessage={t("errors.maxLength", { length: 10 })}
        register={phoneRegister}
        dataTestId={"account-phone-extension"}
      />
      <Select
        id="phoneType"
        name="phoneType"
        placeholder={t("t.selectOne")}
        label={t("application.contact.phoneNumberTypes.prompt")}
        validation={{ required: true }}
        defaultValue={user?.phoneType || ""}
        error={phoneErrors?.phoneType}
        errorMessage={t("errors.phoneNumberTypeError")}
        register={phoneRegister}
        controlClassName="control"
        options={phoneNumberKeys}
        keyPrefix="application.contact.phoneNumberTypes"
        dataTestId={"account-phone-type"}
      />
      <Field
        type="checkbox"
        id="hasAdditionalPhone"
        name="hasAdditionalPhone"
        label={t("application.contact.additionalPhoneNumber")}
        primary={true}
        register={phoneRegister}
        inputProps={{
          defaultChecked: !!user?.additionalPhoneNumber,
          onChange: (e) => {
            if (!e.target.checked) {
              setPhoneValue("additionalPhoneNumber", "")
              setPhoneValue("additionalPhoneNumberType", "")
              setPhoneValue("additionalPhoneExtension", "")
            }
          },
          "aria-expanded": hasAdditionalPhone,
          "aria-controls": "additional-phone-fields",
        }}
        dataTestId={"account-additional-phone-toggle"}
        className="mb-2"
      />
      <div id="additional-phone-fields">
        {hasAdditionalPhone && (
          <>
            <PhoneField
              id="additionalPhoneNumber"
              name="additionalPhoneNumber"
              label={t("application.contact.secondNumber")}
              required={true}
              error={phoneErrors?.additionalPhoneNumber}
              errorMessage={t("errors.phoneNumberError")}
              control={phoneControl}
              defaultValue={user?.additionalPhoneNumber || ""}
              controlClassName="control"
              dataTestId={"account-additional-phone-number"}
              subNote={t("application.contact.number.subNote")}
            />
            <Field
              id="additionalPhoneExtension"
              name="additionalPhoneExtension"
              label={t("t.phoneExtensionOptional")}
              defaultValue={user?.additionalPhoneExtension || ""}
              validation={{ maxLength: 10 }}
              error={phoneErrors?.additionalPhoneExtension}
              errorMessage={t("errors.maxLength", { length: 10 })}
              register={phoneRegister}
              dataTestId={"account-additional-phone-extension"}
            />
            <Select
              id="additionalPhoneNumberType"
              name="additionalPhoneNumberType"
              defaultValue={user?.additionalPhoneNumberType || ""}
              validation={{ required: true }}
              error={phoneErrors?.additionalPhoneNumberType}
              errorMessage={t("errors.phoneNumberTypeError")}
              register={phoneRegister}
              controlClassName="control"
              label={t("application.contact.phoneNumberTypes.prompt")}
              options={phoneNumberKeys}
              keyPrefix="application.contact.phoneNumberTypes"
              dataTestId={"account-additional-phone-type"}
            />
          </>
        )}
      </div>
    </fieldset>
  )
}

export const AccountSection = ({
  alert,
  setAlert,
  formId,
  onSubmit,
  loading,
  buttonId,
  buttonAriaLabel,
  children,
}: {
  alert: AlertMessage | undefined
  setAlert: (alert: AlertMessage | null) => void
  formId: string
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>
  loading: boolean
  buttonId: string
  buttonAriaLabel: string
  children: React.ReactNode
}) => (
  <Card.Section divider="inset" className={styles["account-card-settings-section"]}>
    {alert && (
      <AlertBox type={alert.type} onClose={() => setAlert(null)} className="mb-4" closeable>
        {alert.message}
      </AlertBox>
    )}
    <form id={formId} onSubmit={onSubmit} style={{ display: "contents" }}>
      <div className={"seeds-m-be-6"}>{children}</div>
      <Button
        type="submit"
        size="sm"
        variant="primary-outlined"
        loadingMessage={loading ? t("t.loading") : undefined}
        id={buttonId}
        ariaLabel={buttonAriaLabel}
      >
        {t("account.settings.update")}
      </Button>
    </form>
  </Card.Section>
)

// Submit handler factory for name submission
export const createNameSubmitHandler = (
  userService: UserService,
  updateFn: "updatePublic" | "updateAdvocate",
  setAlert: (alert: AlertMessage | null) => void,
  setLoading: (loading: boolean) => void,
  setUser: React.Dispatch<React.SetStateAction<User>>,
  user: any // eslint-disable-line @typescript-eslint/no-explicit-any
) => {
  return async (data: { firstName: string; middleName: string; lastName: string }) => {
    setLoading(true)
    const { firstName, middleName, lastName } = data
    setAlert(null)
    try {
      const newUser = await userService[updateFn]({
        body: { ...user, firstName, middleName, lastName },
      })
      setUser(newUser)
      setAlert({ type: "success", message: `${t("account.settings.alerts.nameSuccess")}` })
      setLoading(false)
    } catch (err) {
      setLoading(false)
      setAlert({ type: "alert", message: `${t("account.settings.alerts.genericError")}` })
      console.warn(err)
    }
  }
}

// Submit handler factory for email submission
export const createEmailSubmitHandler = (
  userService: UserService,
  updateFn: "updatePublic" | "updateAdvocate",
  setAlert: (alert: AlertMessage | null) => void,
  setLoading: (loading: boolean) => void,
  setUser: React.Dispatch<React.SetStateAction<User>>,
  user: any // eslint-disable-line @typescript-eslint/no-explicit-any
) => {
  return async (data: { email: string }) => {
    setLoading(true)
    const { email } = data
    setAlert(null)
    try {
      const newUser = await userService[updateFn]({
        body: {
          ...user,
          appUrl: window.location.origin,
          newEmail: email,
        },
      })
      setUser(newUser)
      setAlert({ type: "success", message: `${t("account.settings.alerts.emailSuccess")}` })
      setLoading(false)
    } catch (err) {
      setLoading(false)
      console.log("err = ", err)
      setAlert({ type: "alert", message: `${t("account.settings.alerts.genericError")}` })
      console.warn(err)
    }
  }
}

// Submit handler factory for password submission
export const createPasswordSubmitHandler = (
  userService: UserService,
  updateFn: "updatePublic" | "updateAdvocate",
  setAlert: (alert: AlertMessage | null) => void,
  setLoading: (loading: boolean) => void,
  setUser: React.Dispatch<React.SetStateAction<User>>,
  user: any // eslint-disable-line @typescript-eslint/no-explicit-any
) => {
  return async (data: {
    password: string
    passwordConfirmation: string
    currentPassword: string
  }) => {
    setLoading(true)
    const { password, passwordConfirmation, currentPassword } = data
    setAlert(null)
    if (passwordConfirmation === "" || password === "") {
      setAlert({ type: "alert", message: `${t("account.settings.alerts.passwordEmpty")}` })
      setLoading(false)
      return
    }
    if (passwordConfirmation !== password) {
      setAlert({ type: "alert", message: `${t("account.settings.alerts.passwordMatch")}` })
      setLoading(false)
      return
    }
    try {
      const newUser = await userService[updateFn]({
        body: { ...user, password, currentPassword },
      })
      setUser(newUser)
      setAlert({
        type: "success",
        message: `${t("account.settings.alerts.passwordSuccess")}`,
      })
      setLoading(false)
    } catch (err) {
      setLoading(false)
      const { status } = err.response || {}
      if (status === 401) {
        setAlert({
          type: "alert",
          message: `${t("account.settings.alerts.currentPassword")}`,
        })
      } else {
        setAlert({ type: "alert", message: `${t("account.settings.alerts.genericError")}` })
      }
      console.warn(err)
    }
  }
}

// Submit handler factory for date-of-birth submission
export const createDobSubmitHandler = (
  userService: UserService,
  updateFn: "updatePublic" | "updateAdvocate",
  setAlert: (alert: AlertMessage | null) => void,
  setLoading: (loading: boolean) => void,
  setUser: React.Dispatch<React.SetStateAction<User>>,
  user: any // eslint-disable-line @typescript-eslint/no-explicit-any
) => {
  return async (data: { dob: DOBFieldValues }) => {
    setLoading(true)
    const { dob } = data
    setAlert(null)
    try {
      const newUser = await userService[updateFn]({
        body: {
          ...user,
          dob: dayjs(`${dob.birthYear}-${dob.birthMonth}-${dob.birthDay}`).toDate(),
        },
      })
      setUser(newUser)
      setAlert({ type: "success", message: `${t("account.settings.alerts.dobSuccess")}` })
      setLoading(false)
    } catch (err) {
      setLoading(false)
      setAlert({ type: "alert", message: `${t("account.settings.alerts.genericError")}` })
      console.warn(err)
    }
  }
}

// Submit handler factory for address submission
export const createAddressSubmitHandler = (
  userService: UserService,
  updateFn: "updatePublic" | "updateAdvocate",
  setAlert: (alert: AlertMessage | null) => void,
  setLoading: (loading: boolean) => void,
  setUser: React.Dispatch<React.SetStateAction<User>>,
  user: any // eslint-disable-line @typescript-eslint/no-explicit-any
) => {
  return async (data: {
    isPOBox: "yes" | "no"
    poBox?: string
    street?: string
    street2?: string
    city: string
    state: string
    zipCode: string
  }) => {
    setLoading(true)
    setAlert(null)
    const poBoxValue = (data.poBox || "").replace(/^po box\s*/i, "").trim()
    const streetValue = data.isPOBox === "yes" ? `PO Box ${poBoxValue}` : data.street || ""

    try {
      const newUser = await userService[updateFn]({
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
      setAlert({ type: "success", message: `${t("users.userUpdated")}` })
      setLoading(false)
    } catch (err) {
      setLoading(false)
      setAlert({ type: "alert", message: `${t("account.settings.alerts.genericError")}` })
      console.warn(err)
    }
  }
}

// Submit handler factory for phone submission
export const createPhoneSubmitHandler = (
  userService: UserService,
  updateFn: "updatePublic" | "updateAdvocate",
  setAlert: (alert: AlertMessage | null) => void,
  setLoading: (loading: boolean) => void,
  setUser: React.Dispatch<React.SetStateAction<User>>,
  user: any // eslint-disable-line @typescript-eslint/no-explicit-any
) => {
  return async (data: {
    phoneNumber: string
    phoneType: string
    phoneExtension: string
    hasAdditionalPhone: boolean
    additionalPhoneNumber: string
    additionalPhoneNumberType: string
    additionalPhoneExtension: string
  }) => {
    setLoading(true)
    setAlert(null)
    try {
      const hasAdditionalPhone = !!data.hasAdditionalPhone
      const newUser = await userService[updateFn]({
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
      setAlert({ type: "success", message: `${t("users.userUpdated")}` })
      setLoading(false)
    } catch (err) {
      setLoading(false)
      if (err?.response?.data?.message[0].includes("must be a valid phone number")) {
        setAlert({ type: "alert", message: `${t("errors.validPhoneNumber")}` })
      } else {
        setAlert({ type: "alert", message: `${t("account.settings.alerts.genericError")}` })
      }
      console.warn(err)
    }
  }
}
