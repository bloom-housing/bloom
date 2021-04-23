import React from "react"
import { InputType } from "@bloom-housing/backend-core/types"
import { UseFormMethods } from "react-hook-form"
import {
  t,
  GridSection,
  ViewItem,
  GridCell,
  Field,
  Select,
  SelectOption,
  resolveObject,
} from "@bloom-housing/ui-components"
import { stateKeys } from "./formOptions"

type ExtraFieldProps = {
  metaKey: string
  optionKey: string
  extraKey: string
  type: InputType
  register: UseFormMethods["register"]
  errors?: UseFormMethods["errors"]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hhMembersOptions?: SelectOption[]
}

type FormAddressProps = {
  subtitle: string
  dataKey: string
  type: AddressType
  register: UseFormMethods["register"]
  errors?: UseFormMethods["errors"]
  required?: boolean
}

type AddressType =
  | "residence"
  | "residence-member"
  | "work"
  | "mailing"
  | "alternate"
  | "preference"

/*
  Path to the preferences from listing object
*/
export const PREFERENCES_FORM_PATH = "application.preferences"

/*
  It generates inner fields for preferences form
*/
export const ExtraField = ({
  metaKey,
  optionKey,
  extraKey,
  type,
  register,
  errors,
  hhMembersOptions,
}: ExtraFieldProps) => {
  const FIELD_NAME = `${PREFERENCES_FORM_PATH}.${metaKey}.${optionKey}.${extraKey}`

  return (
    <div className="my-4" key={FIELD_NAME}>
      {(() => {
        if (type === InputType.text) {
          return (
            <Field
              id={FIELD_NAME}
              name={FIELD_NAME}
              type="text"
              label={t(`application.preferences.options.${extraKey}`)}
              register={register}
              validation={{ required: true }}
              error={!!resolveObject(FIELD_NAME, errors)}
              errorMessage={t("errors.requiredFieldError")}
            />
          )
        } else if (type === InputType.address) {
          return (
            <div className="pb-4">
              <FormAddress
                subtitle={t("application.preferences.options.address")}
                dataKey={FIELD_NAME}
                type="preference"
                register={register}
                errors={errors}
                required={true}
              />
            </div>
          )
        } else if (type === InputType.hhMemberSelect) {
          if (!hhMembersOptions)
            return (
              <Field
                id={FIELD_NAME}
                name={FIELD_NAME}
                type="text"
                label={t(`application.preferences.options.${extraKey}`)}
                register={register}
                validation={{ required: true }}
                error={!!resolveObject(FIELD_NAME, errors)}
                errorMessage={t("errors.requiredFieldError")}
              />
            )

          return (
            <>
              <Select
                id={FIELD_NAME}
                name={FIELD_NAME}
                label={t(`application.preferences.options.${extraKey}`)}
                register={register}
                controlClassName="control"
                placeholder={t("t.selectOne")}
                options={hhMembersOptions}
                validation={{ required: true }}
                error={!!resolveObject(FIELD_NAME, errors)}
                errorMessage={t("errors.requiredFieldError")}
              />
            </>
          )
        }

        return <></>
      })()}
    </div>
  )
}

export const FormAddress = ({
  subtitle,
  dataKey,
  type,
  register,
  errors,
  required,
}: FormAddressProps) => {
  return (
    <>
      <GridSection subtitle={subtitle}>
        <GridCell span={2}>
          <ViewItem label={t("application.contact.streetAddress")}>
            <Field
              id={`${dataKey}.street`}
              name={`${dataKey}.street`}
              label={t("application.contact.streetAddress")}
              placeholder={t("application.contact.streetAddress")}
              register={register}
              validation={{ required }}
              error={!!resolveObject(`${dataKey}.street`, errors)}
              errorMessage={t("errors.streetError")}
              readerOnly
            />
          </ViewItem>
        </GridCell>
        <GridCell>
          <ViewItem label={t("application.contact.apt")}>
            <Field
              id={`${dataKey}.street2`}
              name={`${dataKey}.street2`}
              label={t("application.contact.apt")}
              placeholder={t("application.contact.apt")}
              register={register}
              readerOnly
            />
          </ViewItem>
        </GridCell>

        <GridCell>
          <ViewItem label={t("application.contact.city")}>
            <Field
              id={`${dataKey}.city`}
              name={`${dataKey}.city`}
              label={t("application.contact.cityName")}
              placeholder={t("application.contact.cityName")}
              register={register}
              validation={{ required }}
              error={!!resolveObject(`${dataKey}.city`, errors)}
              errorMessage={t("errors.cityError")}
              readerOnly
            />
          </ViewItem>
        </GridCell>

        <GridCell className="md:grid md:grid-cols-2 md:gap-8" span={2}>
          <ViewItem label={t("application.contact.state")} className="mb-0">
            <Select
              id={`${dataKey}.state`}
              name={`${dataKey}.state`}
              label={t("application.contact.state")}
              labelClassName="sr-only"
              register={register}
              controlClassName="control"
              options={stateKeys}
              keyPrefix="states"
              validation={{ required }}
              error={!!resolveObject(`${dataKey}.state`, errors)}
              errorMessage={t("errors.stateError")}
            />
          </ViewItem>

          <ViewItem label={t("application.contact.zip")}>
            <Field
              id={`${dataKey}.zipCode`}
              name={`${dataKey}.zipCode`}
              label={t("application.contact.zip")}
              placeholder={t("application.contact.zipCode")}
              register={register}
              validation={{ required }}
              error={!!resolveObject(`${dataKey}.zipCode`, errors)}
              errorMessage={t("errors.zipCodeError")}
              readerOnly
            />
          </ViewItem>
        </GridCell>

        {type === "residence" && (
          <GridCell span={2}>
            <Field
              id="application.sendMailToMailingAddress"
              name="application.sendMailToMailingAddress"
              type="checkbox"
              label={t("application.contact.sendMailToMailingAddress")}
              register={register}
            />
          </GridCell>
        )}
      </GridSection>
    </>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapPreferencesToApi = (data: Record<string, any>) => {
  const CLAIMED_KEY = "claimed"
  const preferencesFormData = data.application.preferences

  const keys = Object.keys(preferencesFormData)

  return keys.map((key) => {
    const currentPreference = preferencesFormData[key]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const currentPreferenceValues = Object.values(currentPreference) as Record<string, any>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const claimed = currentPreferenceValues.map((c: { claimed: any }) => c.claimed).includes(true)

    const options = Object.keys(currentPreference).map((option) => {
      const currentOption = currentPreference[option]

      // count keys except claimed
      const extraKeys = Object.keys(currentOption).filter((item) => item !== CLAIMED_KEY)

      const response = {
        key: option,
        checked: currentOption[CLAIMED_KEY],
      }

      // assign extra data and detect data type
      if (extraKeys.length) {
        const extraData = extraKeys.map((extraKey) => {
          const type = (() => {
            if (typeof currentOption[extraKey] === "boolean") return InputType.boolean
            // if object includes "city" property, it should be an address
            if (Object.keys(currentOption[extraKey]).includes("city")) return InputType.address

            return InputType.text
          })()

          return {
            key: extraKey,
            type,
            value: currentOption[extraKey],
          }
        })

        Object.assign(response, { extraData })
      }

      return response
    })

    return {
      key,
      claimed,
      options,
    }
  })
}
