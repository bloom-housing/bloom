import React from "react"
import { InputType, HouseholdMember } from "@bloom-housing/backend-core/types"
import { UseFormMethods } from "react-hook-form"
import { t, GridSection, ViewItem, GridCell, Field, Select } from "@bloom-housing/ui-components"
import { stateKeys } from "./formOptions"

type ExtraFieldProps = {
  metaKey: string
  optionKey: string
  extraKey: string
  type: InputType
  register: UseFormMethods["register"]
  householdMembers?: HouseholdMember[]
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
  householdMembers,
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
            />
          )
        } else if (type === InputType.address) {
          return (
            <div className="pb-4">
              {FormAddress(
                t("application.preferences.options.address"),
                FIELD_NAME,
                "preference",
                register
              )}
            </div>
          )
        } else if (type === InputType.hhMemberSelect) {
          const options =
            householdMembers?.map((item) => {
              if (!item?.firstName || !item?.firstName) return ""

              const option = `${item.firstName} ${item.lastName}`
              return {
                label: option,
                value: option,
              }
            }) || []

          return (
            <Select
              id={FIELD_NAME}
              name={FIELD_NAME}
              label={t(`application.preferences.options.${extraKey}`)}
              // labelClassName="sr-only"
              register={register}
              controlClassName="control"
              options={options}
            />
          )
        }

        return <></>
      })()}
    </div>
  )
}

export const FormAddress = (
  subtitle: string,
  dataKey: string,
  type: AddressType,
  register: UseFormMethods["register"]
) => {
  return (
    <GridSection subtitle={subtitle}>
      <GridCell span={2}>
        <ViewItem label={t("application.contact.streetAddress")}>
          <Field
            id={`${dataKey}.street`}
            name={`${dataKey}.street`}
            label={t("application.contact.streetAddress")}
            placeholder={t("application.contact.streetAddress")}
            register={register}
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
          />
        </ViewItem>

        <ViewItem label={t("application.contact.zip")}>
          <Field
            id={`${dataKey}.zipCode`}
            name={`${dataKey}.zipCode`}
            label={t("application.contact.zip")}
            placeholder={t("application.contact.zipCode")}
            register={register}
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
  )
}
