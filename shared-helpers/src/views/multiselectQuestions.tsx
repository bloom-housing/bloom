import * as React from "react"
import { UseFormMethods } from "react-hook-form"
import { ExpandableContent, Field, resolveObject, t } from "@bloom-housing/ui-components"
import { stateKeys } from "../utilities/formKeys"
import {
  ApplicationMultiselectQuestion,
  ApplicationMultiselectQuestionOption,
  ApplicationSelection,
  ApplicationSelectionCreate,
  ApplicationSelectionOptionCreate,
  InputType,
  Listing,
  ListingMultiselectQuestion,
  MultiselectOption,
  MultiselectQuestion,
  MultiselectQuestionsApplicationSectionEnum,
} from "../types/backend-swagger"
import { AddressHolder } from "../utilities/constants"
import { FormAddressAlternate } from "./address/FormAddressAlternate"
import { ReactNode } from "react"

/** Removes periods, commas, and apostrophes */
export const cleanMultiselectString = (name: string | undefined) => {
  return name?.replace(/\.|,|'/g, "")
}

/** Returns the right options for the right MSQ version */
export const getMSQOptions = (
  question: MultiselectQuestion,
  enableV2MSQ: boolean
): MultiselectOption[] => {
  return (enableV2MSQ ? question.multiselectOptions : question.options) || []
}

export const listingSectionQuestions = (
  listing: Listing,
  applicationSection: MultiselectQuestionsApplicationSectionEnum
) => {
  const selectQuestions = listing?.listingMultiselectQuestions
    ?.filter(
      (question) =>
        question?.multiselectQuestions?.applicationSection ===
        MultiselectQuestionsApplicationSectionEnum[applicationSection]
    )
    ?.sort((a, b) => (a.ordinal || 0) - (b.ordinal || 0))
  return selectQuestions
}

export const getSelectionsForApplicationSection = (
  listingMultiselectQuestions: ListingMultiselectQuestion[],
  applicationSection: MultiselectQuestionsApplicationSectionEnum,
  applicationSelections: (ApplicationSelection | ApplicationSelectionCreate)[]
): (ApplicationSelection | ApplicationSelectionCreate)[] => {
  const listingMSQs = listingMultiselectQuestions.filter(
    (question) => question?.multiselectQuestions?.applicationSection === applicationSection
  )
  return applicationSelections?.filter((selection) =>
    listingMSQs.find((item) => item.multiselectQuestions.id === selection.multiselectQuestion.id)
  )
}

/** Get a field name for an application multiselect question */
export const fieldName = (
  questionName: string,
  applicationSection: MultiselectQuestionsApplicationSectionEnum,
  optionName?: string
) => {
  return `application.${applicationSection}.${cleanMultiselectString(questionName)}${
    optionName ? `.${cleanMultiselectString(optionName)}` : ""
  }`
}

/** Get an array of option field name strings for all options within a single question that are exclusive */
export const getExclusiveKeys = (
  question: MultiselectQuestion,
  applicationSection: MultiselectQuestionsApplicationSectionEnum,
  enableV2MSQ: boolean
): string[] => {
  const exclusive: string[] = []
  if (!question) return exclusive

  getMSQOptions(question, enableV2MSQ).forEach((option) => {
    if ((!enableV2MSQ && option.exclusive) || (enableV2MSQ && option.isOptOut))
      exclusive.push(
        fieldName(question.name || question.text, applicationSection, option.name || option.text)
      )
  })
  if (!enableV2MSQ && question.optOutText)
    exclusive.push(
      fieldName(question.name || question.text, applicationSection, question.optOutText)
    )
  return exclusive
}

/** Set the value as false for a set of option field names */
const uncheckOptions = (options: string[], setValue: (key: string, value: boolean) => void) => {
  options?.forEach((option) => {
    setValue(option, false)
  })
}

/** Set the value of an exclusive field, adjusting other fields to follow the exclusive behavior */
export const setExclusive = (
  exclusiveValue: boolean,
  setValue: (key: string, value: boolean) => void,
  exclusiveKeys: string[],
  exclusiveName: string,
  allOptions: string[]
) => {
  if (exclusiveValue) {
    // Uncheck all other keys if setting an exclusive key to true
    uncheckOptions(allOptions, setValue)
    setValue(exclusiveName, true)
  } else {
    // Uncheck all exclusive keys if setting a multiselect key to true
    exclusiveKeys.forEach((exclusiveOption) => {
      setValue(exclusiveOption, false)
    })
  }
}

/** Get the input type for all options in a single question - if all are exclusive use a radio */
export const getInputType = (options: MultiselectOption[]) => {
  // TODO: this won't be necessary once everything has switched to MSQv2
  return options?.filter((option) => option.exclusive).length === options?.length
    ? "radio"
    : "checkbox"
}

/** Get the question with the same ordinal as the current page if it exists */
export const getPageQuestion = (questions: ListingMultiselectQuestion[], page: number) => {
  const ordinalQuestions = questions?.filter((item) => {
    return item.ordinal === page
  })

  return ordinalQuestions?.length ? ordinalQuestions[0]?.multiselectQuestions : null
}

/** Get all option field names for a question, including the potential opt out option */
export const getAllOptions = (
  question: MultiselectQuestion,
  applicationSection: MultiselectQuestionsApplicationSectionEnum,
  enableV2MSQ: boolean
) => {
  if (!question) return []

  const optionPaths = getMSQOptions(question, enableV2MSQ).map((option) =>
    fieldName(question.name || question.text, applicationSection, option.name || option.text)
  )
  if (!enableV2MSQ && question.optOutText) {
    optionPaths.push(
      fieldName(question.name || question.text, applicationSection, question.optOutText)
    )
  }
  return optionPaths
}

const getRadioField = (
  option: MultiselectOption,
  register: UseFormMethods["register"],
  setValue: UseFormMethods["setValue"],
  allOptions: string[],
  optionFieldName: string,
  getValues: UseFormMethods["getValues"],
  trigger?: UseFormMethods["trigger"]
) => {
  return (
    <>
      <Field
        type="radio"
        id={option.name || option.text}
        name={optionFieldName}
        label={option.name || option.text}
        register={register}
        inputProps={{
          value: !!(option.name || option.text),
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target?.checked && trigger) {
              void trigger()
            }
            uncheckOptions(allOptions, setValue)
            setValue(optionFieldName, e.target?.value)
          },
        }}
        dataTestId={"app-question-option"}
        validation={{
          validate: {
            somethingIsChecked: (value) => {
              return !!value || !!allOptions.find((option) => getValues(option))
            },
          },
        }}
      />
    </>
  )
}

const getCheckboxField = (
  option: MultiselectOption,
  question: MultiselectQuestion,
  applicationSection: MultiselectQuestionsApplicationSectionEnum,
  register: UseFormMethods["register"],
  setValue: UseFormMethods["setValue"],
  getValues: UseFormMethods["getValues"],
  allOptions: string[],
  optionFieldName: string,
  enableV2MSQ: boolean,
  trigger?: UseFormMethods["trigger"],
  exclusiveKeys?: string[]
) => {
  return (
    <Field
      id={option.name || option.text}
      name={optionFieldName}
      type={"checkbox"}
      label={option.name || option.text}
      labelClassName="font-semibold"
      register={register}
      inputProps={{
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          if (e.target.checked && trigger) {
            void trigger()
          }
          const allOptions = getAllOptions(question, applicationSection, enableV2MSQ)
          const exclusiveOption =
            (!enableV2MSQ && option.exclusive) || (enableV2MSQ && option.isOptOut)
          if (exclusiveOption && e.target.checked && exclusiveKeys) {
            setExclusive(true, setValue, exclusiveKeys, optionFieldName, allOptions)
          }
          if (!exclusiveOption && exclusiveKeys) {
            setExclusive(false, setValue, exclusiveKeys, optionFieldName, allOptions)
          }
        },
      }}
      validation={{
        validate: {
          somethingIsChecked: (value) => {
            if (!enableV2MSQ && question.optOutText && trigger) {
              return value || !!allOptions.find((option) => getValues(option))
            }
          },
        },
      }}
      dataTestId={"app-question-option"}
    />
  )
}

export const multiselectOptionWrapper = (
  field: ReactNode,
  option: MultiselectOption,
  question: MultiselectQuestion,
  applicationSection: MultiselectQuestionsApplicationSectionEnum,
  register: UseFormMethods["register"],
  watchFields: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [x: string]: any
  },
  errors?: UseFormMethods["errors"]
) => {
  const optionFieldName = fieldName(
    question.name || question.text,
    applicationSection,
    option.name || option.text
  )
  return (
    <div className="mb-3" key={option.name || option.text}>
      <div className={`mb-3 field ${resolveObject(optionFieldName, errors) ? "error" : ""}`}>
        {field}
      </div>
      {option.description && (
        <div className="ml-8 -mt-3 mb-6">
          <ExpandableContent strings={{ readMore: t("t.readMore"), readLess: t("t.readLess") }}>
            <p className="field-note mb-2">
              {option.description}
              <br />
              {option?.links?.map((link) => (
                <a
                  key={link.url}
                  className="block pt-2 text-blue-500 underline"
                  href={link.url}
                  target={"_blank"}
                  rel="noreferrer noopener"
                >
                  {link.title}
                </a>
              ))}
            </p>
          </ExpandableContent>
        </div>
      )}
      {watchFields[optionFieldName] && (option.shouldCollectName || option.collectName) && (
        <Field
          id={AddressHolder.Name}
          name={`${optionFieldName}-${AddressHolder.Name}`}
          label={t(`application.preferences.options.${AddressHolder.Name}`)}
          register={register}
          validation={{ required: true, maxLength: 64 }}
          error={!!resolveObject(`${optionFieldName}-${AddressHolder.Name}`, errors)}
          errorMessage={
            resolveObject(`${optionFieldName}-${AddressHolder.Name}`, errors)?.type === "maxLength"
              ? t("errors.maxLength", { length: 64 })
              : t("errors.requiredFieldError")
          }
          dataTestId="addressHolder-name"
        />
      )}
      {watchFields[optionFieldName] &&
        (option.shouldCollectRelationship || option.collectRelationship) && (
          <Field
            id={AddressHolder.Relationship}
            name={`${optionFieldName}-${AddressHolder.Relationship}`}
            label={t(`application.preferences.options.${AddressHolder.Relationship}`)}
            register={register}
            validation={{ required: true, maxLength: 64 }}
            error={!!resolveObject(`${optionFieldName}-${AddressHolder.Relationship}`, errors)}
            errorMessage={
              resolveObject(`${optionFieldName}-${AddressHolder.Relationship}`, errors)?.type ===
              "maxLength"
                ? t("errors.maxLength", { length: 64 })
                : t("errors.requiredFieldError")
            }
            dataTestId="addressHolder-relationship"
          />
        )}
      {watchFields[optionFieldName] && (option.shouldCollectAddress || option.collectAddress) && (
        <div className="pb-4">
          <FormAddressAlternate
            subtitle={t("application.preferences.options.qualifyingAddress")}
            dataKey={fieldName(
              question.name || question.text,
              applicationSection,
              `${option.name || option.text}-address`
            )}
            register={register}
            errors={errors}
            required={true}
            stateKeys={stateKeys}
            data-testid={"app-question-extra-field"}
          />
        </div>
      )}
    </div>
  )
}

/** Get an individual question option checkbox field */
export const getCheckboxOption = (
  option: MultiselectOption,
  question: MultiselectQuestion,
  applicationSection: MultiselectQuestionsApplicationSectionEnum,
  register: UseFormMethods["register"],
  setValue: UseFormMethods["setValue"],
  getValues: UseFormMethods["getValues"],
  allOptions: string[],
  watchFields: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [x: string]: any
  },
  enableV2MSQ: boolean,
  errors?: UseFormMethods["errors"],
  trigger?: UseFormMethods["trigger"],
  exclusiveKeys?: string[]
) => {
  const optionFieldName = fieldName(
    question.name || question.text,
    applicationSection,
    option.name || option.text
  )
  const checkboxField = getCheckboxField(
    option,
    question,
    applicationSection,
    register,
    setValue,
    getValues,
    allOptions,
    optionFieldName,
    enableV2MSQ,
    trigger,
    exclusiveKeys
  )

  return multiselectOptionWrapper(
    checkboxField,
    option,
    question,
    applicationSection,
    register,
    watchFields,
    errors
  )
}

/** Get an individual question option radio field */
export const getRadioOption = (
  option: MultiselectOption,
  question: MultiselectQuestion,
  applicationSection: MultiselectQuestionsApplicationSectionEnum,
  register: UseFormMethods["register"],
  setValue: UseFormMethods["setValue"],
  allOptions: string[],
  watchFields: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [x: string]: any
  },
  getValues: UseFormMethods["getValues"],
  errors?: UseFormMethods["errors"],
  trigger?: UseFormMethods["trigger"]
) => {
  const optionFieldName = fieldName(
    question.name || question.text,
    applicationSection,
    option.name || option.text
  )
  const radioField = getRadioField(
    option,
    register,
    setValue,
    allOptions,
    optionFieldName,
    getValues,
    trigger
  )

  return multiselectOptionWrapper(
    radioField,
    option,
    question,
    applicationSection,
    register,
    watchFields,
    errors
  )
}

function cleanRadioObject(obj: Record<string, any>): Record<string, any> {
  // Remove nulls
  let cleanedObj = Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== null) {
      acc[key] = value
    }
    return acc
  }, {})

  // Convert "true" to true
  cleanedObj = Object.entries(cleanedObj).reduce((acc, [key, value]) => {
    if (
      value === "true" &&
      !(key.includes(AddressHolder.Name) || key.includes(AddressHolder.Relationship))
    ) {
      acc[key] = true
    } else {
      acc[key] = value
    }
    return acc
  }, {})

  return cleanedObj
}

/**
 * Convert incoming React Hook Form data to the right JSON format for saving to the backend
 * (this version is for the V1 MSQ schema)
 * @deprecated
 */
export const mapCheckboxesToApiV1 = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formData: { [name: string]: any },
  question: MultiselectQuestion,
  applicationSection: MultiselectQuestionsApplicationSectionEnum
): ApplicationMultiselectQuestion => {
  const rawData =
    formData["application"][applicationSection][cleanMultiselectString(question.text) || ""]

  const data = cleanRadioObject(rawData) // removes nulls and converts "true" to true for radio fields

  const claimed = !!Object.keys(data).filter((key) => data[key] === true).length

  const addressFields = Object.keys(data).filter((option) => Object.keys(data[option]))
  const questionOptions: ApplicationMultiselectQuestionOption[] = Object.keys(data)
    .filter((option) => !Object.keys(data[option]).length)
    .map((key) => {
      const extraData = []
      const addressData = addressFields.filter((addressField) => addressField === `${key}-address`)
      const addressHolderNameData = addressFields.filter(
        (addressField) => addressField === `${key}-${AddressHolder.Name}`
      )
      const addressHolderRelationshipData = addressFields.filter(
        (addressField) => addressField === `${key}-${AddressHolder.Relationship}`
      )
      if (data[key] === true && addressData.length) {
        extraData.push({ type: InputType.address, key: "address", value: data[addressData[0]] })

        if (addressHolderNameData.length) {
          extraData.push({
            type: InputType.text,
            key: AddressHolder.Name,
            value: data[addressHolderNameData[0]],
          })
        }

        if (addressHolderRelationshipData.length) {
          extraData.push({
            type: InputType.text,
            key: AddressHolder.Relationship,
            value: data[addressHolderRelationshipData[0]],
          })
        }
      }

      const getFinalKey = () => {
        const optionKey = question?.options?.find(
          (elem) => cleanMultiselectString(elem.text) === key
        )?.text
        const cleanOptOutKey = cleanMultiselectString(question?.optOutText)
        if (cleanOptOutKey === key) return question?.optOutText || key
        return optionKey || key
      }

      return {
        key: getFinalKey(),
        mapPinPosition: data?.[`${key}-mapPinPosition`],
        checked: data[key] === true,
        extraData: extraData,
      }
    })

  return {
    multiselectQuestionId: question.id,
    key: question.text ?? "",
    claimed,
    options: questionOptions,
  }
}

/**
 * Convert incoming React Hook Form data to the right JSON format for saving to the backend
 */
export const mapCheckboxesToApi = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formData: { [name: string]: any },
  question: MultiselectQuestion,
  applicationSection: MultiselectQuestionsApplicationSectionEnum
): ApplicationSelectionCreate => {
  const rawData =
    formData["application"][applicationSection][cleanMultiselectString(question.name) || ""]

  const data = cleanRadioObject(rawData) // removes nulls and converts "true" to true for radio fields

  const addressFields = Object.keys(data).filter((option) => Object.keys(data[option]))
  let hasOptedOut = false
  const selections: ApplicationSelectionOptionCreate[] = Object.keys(data).reduce((acc, key) => {
    if (data[key] !== true) {
      return acc
    }
    const foundOption = question.multiselectOptions?.find(
      (elem) => cleanMultiselectString(elem.name) === key
    )
    // the below guard is a mere formality, because we will always find an option
    // from what the UI has rendered
    if (!foundOption) return acc

    if (foundOption.isOptOut) hasOptedOut = true
    const selectionData: ApplicationSelectionOptionCreate = {
      multiselectOption: { id: foundOption.id },
    }
    const addressData = addressFields.filter((addressField) => addressField === `${key}-address`)

    if (addressData.length) {
      const addressHolderNameData = addressFields.filter(
        (addressField) => addressField === `${key}-${AddressHolder.Name}`
      )
      const addressHolderRelationshipData = addressFields.filter(
        (addressField) => addressField === `${key}-${AddressHolder.Relationship}`
      )

      selectionData[AddressHolder.Address] = data[addressData[0]]
      if (addressHolderNameData.length) {
        selectionData[AddressHolder.Name] = data[addressHolderNameData[0]]
      }
      if (addressHolderRelationshipData.length) {
        selectionData[AddressHolder.Relationship] = data[addressHolderRelationshipData[0]]
      }
    }
    return [...acc, selectionData]
  }, [] as ApplicationSelectionOptionCreate[])

  return {
    multiselectQuestion: { id: question.id },
    hasOptedOut,
    selections,
  }
}

/**
 * Convert incoming JSON data to the right format for displaying as React Hook Form fields
 * (this version is for the V1 MSQ schema)
 * @deprecated
 */
export const mapApiToMultiselectFormV1 = (
  applicationQuestions: ApplicationMultiselectQuestion[],
  listingQuestions: ListingMultiselectQuestion[],
  applicationSection: MultiselectQuestionsApplicationSectionEnum
) => {
  const questionsFormData = { application: { [applicationSection]: Object.create(null) } }

  const applicationQuestionsWithTypes: {
    question: ApplicationMultiselectQuestion
    inputType: string
  }[] = applicationQuestions?.map((question) => {
    return {
      question,
      inputType: getInputType(
        listingQuestions?.filter(
          (listingQuestion) => listingQuestion?.multiselectQuestions?.text === question.key
        )[0]?.multiselectQuestions?.options ?? []
      ),
    }
  })

  applicationQuestionsWithTypes?.forEach((appQuestion) => {
    let options = Object.create(null)

    const question = appQuestion.question
    /**
     * Checkbox fields expect the following format
     * QuestionName: {
     *    OptionName1: true
     *    OptionName2: false
     *    OptionName1-address: {
     *      street: "",
     *      city: "",
     *      ...
     *    }
     * }
     */

    /**
     * Radio fields expect the following format
     * QuestionName: {
     *    OptionName1: "true"
     *    OptionName1-address: {
     *      street: "",
     *      city: "",
     *      ...
     *    }
     * }
     */
    options = question.options.reduce((acc, curr) => {
      const claimed = curr.checked
      const cleanKey = cleanMultiselectString(curr.key) || ""
      if (appQuestion.inputType === "checkbox") {
        acc[cleanKey] = claimed
      } else {
        acc[cleanKey] = claimed.toString()
      }
      if (curr.extraData?.length) {
        acc[`${cleanKey}-address`] = curr.extraData[0].value

        const addressHolderName = curr.extraData?.find((field) => field.key === AddressHolder.Name)
        if (addressHolderName) {
          acc[`${cleanKey}-${AddressHolder.Name}`] = addressHolderName.value
        }

        const addressHolderRelationship = curr.extraData?.find(
          (field) => field.key === AddressHolder.Relationship
        )
        if (addressHolderRelationship) {
          acc[`${cleanKey}-${AddressHolder.Relationship}`] = addressHolderRelationship.value
        }
        if (curr?.mapPinPosition) {
          acc[`${cleanKey}-mapPinPosition`] = curr.mapPinPosition
        }
      }

      return acc
    }, {})

    questionsFormData["application"][applicationSection][question.key] = options
  })

  return { ...questionsFormData }
}

/**
 * Convert incoming JSON data to the right format for displaying as React Hook Form fields
 */
export const mapApiToMultiselectForm = (
  applicationSelections: ApplicationSelectionCreate[],
  listingQuestions: ListingMultiselectQuestion[],
  applicationSection: MultiselectQuestionsApplicationSectionEnum
) => {
  const questionsFormData = { application: { [applicationSection]: {} as Record<string, any> } }

  applicationSelections.forEach((selection) => {
    const question = listingQuestions.find(
      (item) => item.multiselectQuestions.id === selection.multiselectQuestion.id
    )?.multiselectQuestions
    if (!question) return

    // NOTE: there was some funky typing issues here…using "" as a guard but there's no real need
    const questionFieldName = cleanMultiselectString(question.name) || ""

    const options: Record<string, any> = {}
    selection.selections.forEach((optionSelection) => {
      const option = question.multiselectOptions?.find(
        (item) => item.id == optionSelection.multiselectOption.id
      )
      if (!option) return

      const key = cleanMultiselectString(option.name) || ""
      // radio buttons (exclusive) needs string true, otherwise boolean
      options[key] = question.isExclusive ? "true" : true

      if (optionSelection.addressHolderAddress) {
        options[`${key}-address`] = optionSelection.addressHolderAddress
        if (optionSelection.addressHolderName)
          options[`${key}-${AddressHolder.Name}`] = optionSelection.addressHolderName
        if (optionSelection.addressHolderRelationship)
          options[`${key}-${AddressHolder.Relationship}`] =
            optionSelection.addressHolderRelationship
      }
    })
    questionsFormData.application[applicationSection][questionFieldName] = options
  })

  return questionsFormData
}
