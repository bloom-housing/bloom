import React from "react"
import {
  InputType,
  ApplicationPreference,
  ApplicationProgram,
  FormMetadataOptions,
  Preference,
  Program,
  ListingPreference,
  ListingProgram,
} from "@bloom-housing/backend-core/types"
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

type ExtraFieldProps = {
  metaKey: string
  optionKey: string
  extraKey: string
  type: InputType
  register: UseFormMethods["register"]
  errors?: UseFormMethods["errors"]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hhMembersOptions?: SelectOption[]
  stateKeys: string[]
  formType: FormPreferencesType
}

type FormAddressProps = {
  subtitle: string
  dataKey: string
  type: AddressType
  register: UseFormMethods["register"]
  errors?: UseFormMethods["errors"]
  required?: boolean
  stateKeys: string[]
}

type AddressType =
  | "residence"
  | "residence-member"
  | "work"
  | "mailing"
  | "alternate"
  | "preference"

export enum FormPreferencesType {
  Preferences = "preferences",
  Programs = "programs",
}

/*
  Path to the preferences/programs from the listing object
*/
const createFormOptionPath = (type: FormPreferencesType) => `application.${type}.options`
const createFormNoneOptionPath = (type: FormPreferencesType) => `application.${type}.none`

/*
  It generates inner fields for preferences/programs form
*/
export const ExtraField = ({
  metaKey,
  optionKey,
  extraKey,
  type,
  register,
  errors,
  hhMembersOptions,
  stateKeys,
  formType,
}: ExtraFieldProps) => {
  const FORM_PATH = createFormOptionPath(formType)

  const TRANSLATION_PATH =
    formType === FormPreferencesType.Preferences
      ? `application.preferences.options`
      : `application.programs.options`

  const FIELD_NAME = `${FORM_PATH}.${metaKey}.${optionKey}.${extraKey}`

  return (
    <div className="my-4" key={FIELD_NAME}>
      {(() => {
        if (type === InputType.text) {
          return (
            <Field
              id={FIELD_NAME}
              name={FIELD_NAME}
              type="text"
              label={t(`${TRANSLATION_PATH}.${extraKey}`)}
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
                subtitle={t(`${TRANSLATION_PATH}.address`)}
                dataKey={FIELD_NAME}
                type="preference"
                register={register}
                errors={errors}
                required={true}
                stateKeys={stateKeys}
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
                label={t(`${TRANSLATION_PATH}.${extraKey}`)}
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
                label={t(`${TRANSLATION_PATH}.${extraKey}`)}
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
  stateKeys,
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
export const mapPreferencesOrProgramsToApi = (
  data: Record<string, any>,
  type: FormPreferencesType
) => {
  if (type === FormPreferencesType.Preferences) {
    if (!data.application?.preferences) return []
  } else {
    if (!data.application?.programs) return []
  }

  const CLAIMED_KEY = "claimed"

  const formData = (() => {
    if (type === FormPreferencesType.Preferences) {
      return data.application.preferences.options
    }

    return data.application.programs.options
  })()

  const keys = Object.keys(formData)

  return keys.map((key) => {
    const currentItem = formData[key]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const currentItemValues = Object.values(currentItem) as Record<string, any>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const claimed = currentItemValues.map((c: { claimed: any }) => c.claimed).includes(true)

    const options = Object.keys(currentItem).map((option) => {
      const currentOption = currentItem[option]

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
      } else {
        Object.assign(response, { extraData: [] })
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapApiToPreferencesOrProgramsForm = (
  data: ApplicationPreference[] | ApplicationProgram[]
) => {
  if (!data) return {}
  const formData = {}

  data.forEach((item) => {
    const options = item.options.reduce((acc, curr) => {
      // extraData which comes from the API is an array, in the form we expect an object
      const extraData =
        curr?.extraData?.reduce((extraAcc, extraCurr) => {
          // value - it can be string or nested address object
          const value = extraCurr.value
          Object.assign(extraAcc, {
            [extraCurr.key]: value,
          })

          return extraAcc
        }, {}) || {}

      // each form option has "claimed" property - it's "checked" property in the API
      const claimed = curr.checked

      Object.assign(acc, {
        [curr.key]: {
          claimed,
          ...extraData,
        },
      })
      return acc
    }, {})

    Object.assign(formData, {
      [item.key]: options,
    })
  })

  const noneValues = data.reduce((acc, item) => {
    const isClaimed = item.claimed

    Object.assign(acc, {
      [`${item.key}-none`]: !isClaimed,
    })

    return acc
  }, {})

  return { options: formData, none: noneValues }
}

/*
  It generates checkbox name in proper preferences/programs structure
*/
export const getPreferenceOrProgramOptionName = (
  key: string,
  metaKey: string,
  formType: FormPreferencesType,
  noneOption?: boolean
) => {
  if (noneOption) return getExclusiveOptionName(key, formType)
  else return getNormalOptionName(metaKey, key, createFormOptionPath(formType))
}

export const getNormalOptionName = (metaKey: string, key: string, path: string) => {
  return `${path}.${metaKey}.${key}.claimed`
}

export const getExclusiveOptionName = (key: string | undefined, type: FormPreferencesType) => {
  return `${createFormNoneOptionPath(type)}.${key}-none`
}

export type ExclusiveKey = {
  optionKey: string
  preferenceKey: string | undefined
}
/*
  Create an array of all exclusive keys from a preference set
*/
export const getExclusiveKeys = (
  preferences: ListingPreference[] | ListingProgram[],
  formType: FormPreferencesType
) => {
  const KEY = formType === FormPreferencesType.Preferences ? "preference" : "program"

  const exclusive: ExclusiveKey[] = []
  preferences?.forEach((listingPreference) => {
    const preference: Preference | Program = listingPreference[KEY]

    preference?.formMetadata?.options.forEach((option: FormMetadataOptions) => {
      if (option.exclusive)
        exclusive.push({
          optionKey: getPreferenceOrProgramOptionName(
            option.key,
            preference?.formMetadata?.key ?? "",
            formType
          ),
          preferenceKey: preference?.formMetadata?.key,
        })
    })
    if (!preference?.formMetadata?.hideGenericDecline)
      exclusive.push({
        optionKey: getExclusiveOptionName(preference?.formMetadata?.key, formType),
        preferenceKey: preference?.formMetadata?.key,
      })
  })
  return exclusive
}

const uncheckOption = (
  metaKey: string,
  options: FormMetadataOptions[] | undefined,
  setValue: (key: string, value: boolean) => void,
  formType: FormPreferencesType
) => {
  options?.forEach((option) => {
    setValue(getPreferenceOrProgramOptionName(option.key, metaKey, formType), false)
  })
}

/*
  Set the value of an exclusive checkbox, unchecking all the appropriate boxes in response to the value
*/
export const setExclusive = (
  value: boolean,
  setValue: (key: string, value: boolean) => void,
  exclusiveKeys: ExclusiveKey[],
  key: string,
  option: Preference | Program,
  formType: FormPreferencesType
) => {
  if (value) {
    // Uncheck all other keys if setting an exclusive key to true
    uncheckOption(
      option?.formMetadata?.key ?? "",
      option?.formMetadata?.options,
      setValue,
      formType
    )
    setValue(key ?? "", true)
  } else {
    // Uncheck all exclusive keys if setting a normal key to true
    exclusiveKeys.forEach((thisKey) => {
      if (thisKey.preferenceKey === option?.formMetadata?.key) setValue(thisKey.optionKey, false)
    })
  }
}
