import { UseFormMethods } from "react-hook-form"
import { Field, resolveObject, Select, t } from "@bloom-housing/ui-components"
import React from "react"

type FormAddressProps = {
  subtitle?: string
  dataKey: string
  register: UseFormMethods["register"]
  errors?: UseFormMethods["errors"]
  required?: boolean
  stateKeys: string[]
}

export const FormAddressAlternate = ({
  subtitle,
  dataKey,
  register,
  errors,
  required,
  stateKeys,
}: FormAddressProps) => {
  return (
    <>
      <legend className={`text__caps-spaced ${!subtitle ? "sr-only" : ""}`}>
        {!subtitle ? t("application.preferences.options.address") : subtitle}
      </legend>
      <Field
        id={`${dataKey}.street`}
        name={`${dataKey}.street`}
        label={t("application.contact.streetAddress")}
        validation={{ required: true, maxLength: 64 }}
        errorMessage={
          resolveObject(`${dataKey}.street`, errors)?.type === "maxLength"
            ? t("errors.maxLength", { length: 64 })
            : t("errors.streetError")
        }
        error={!!resolveObject(`${dataKey}.street`, errors)}
        register={register}
        dataTestId="address-street"
      />

      <Field
        id={`${dataKey}.street2`}
        name={`${dataKey}.street2`}
        label={t("application.contact.apt")}
        register={register}
        error={!!resolveObject(`${dataKey}.street2`, errors)}
        validation={{ maxLength: 64 }}
        errorMessage={t("errors.maxLength", { length: 64 })}
      />

      <div className="flex">
        <Field
          id={`${dataKey}.city`}
          name={`${dataKey}.city`}
          label={t("application.contact.city")}
          register={register}
          validation={{ required, maxLength: 64 }}
          error={!!resolveObject(`${dataKey}.city`, errors)}
          errorMessage={
            resolveObject(`${dataKey}.city`, errors)?.type === "maxLength"
              ? t("errors.maxLength", { length: 64 })
              : t("errors.cityError")
          }
          dataTestId="address-city"
        />

        <Select
          id={`${dataKey}.state`}
          name={`${dataKey}.state`}
          label={t("application.contact.state")}
          validation={{ required: true }}
          error={!!resolveObject(`${dataKey}.state`, errors)}
          errorMessage={
            resolveObject(`${dataKey}.state`, errors)?.type === "maxLength"
              ? t("errors.maxLength", { length: 64 })
              : t("errors.stateError")
          }
          register={register}
          controlClassName="control"
          options={stateKeys}
          keyPrefix="states"
          dataTestId="address-state"
        />
      </div>
      <Field
        id={`${dataKey}.zipCode`}
        name={`${dataKey}.zipCode`}
        label={t("application.contact.zip")}
        register={register}
        validation={{ required, maxLength: 10 }}
        error={!!resolveObject(`${dataKey}.zipCode`, errors)}
        errorMessage={
          resolveObject(`${dataKey}.zipCode`, errors)?.type === "maxLength"
            ? t("errors.maxLength", { length: 10 })
            : t("errors.zipCodeError")
        }
        dataTestId="address-zipcode"
      />
    </>
  )
}
