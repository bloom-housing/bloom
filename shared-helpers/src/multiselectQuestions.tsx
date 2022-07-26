import * as React from "react"
import {
  InputType,
  MultiselectQuestion,
  MultiselectOption,
  ApplicationMultiselectQuestion,
  ApplicationMultiselectQuestionOption,
  ApplicationSection,
  ListingMultiselectQuestion,
} from "@bloom-housing/backend-core/types"
import { UseFormMethods } from "react-hook-form"
import {
  t,
  Field,
  Select,
  SelectOption,
  resolveObject,
  FormAddress,
  ExpandableContent,
  FieldGroup,
} from "@bloom-housing/ui-components"
import { stateKeys } from "./formKeys"

// Get a field name for an application multiselect question
export const fieldName = (
  preferenceName: string,
  optionName: string,
  applicationSection: ApplicationSection
) => {
  return `application.${applicationSection}.${preferenceName.replace(
    /'/g,
    ""
  )}.${optionName.replace(/'/g, "")}`
}

// Get an array of option field name strings for all options within a single preference that are exclusive
export const getExclusiveKeys = (
  preference: MultiselectQuestion,
  applicationSection: ApplicationSection
): string[] => {
  const exclusive: string[] = []
  preference?.options?.forEach((option: MultiselectOption) => {
    if (option.exclusive)
      exclusive.push(fieldName(preference.text, option.text, applicationSection))
  })
  if (preference?.optOutText)
    exclusive.push(fieldName(preference.text, preference.optOutText, applicationSection))
  return exclusive
}

// Set the value as false for a set of option field names
const uncheckOptions = (options: string[], setValue: (key: string, value: boolean) => void) => {
  options?.forEach((option) => {
    setValue(option, false)
  })
}

// Set the value of an exclusive field, adjusting other fields to follow the exclusive behavior
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

// Get the input type for all options in a single question - if all are exclusive use a radio
export const getInputType = (options: MultiselectOption[]) => {
  return options?.filter((option) => option.exclusive).length === options?.length
    ? "radio"
    : "checkbox"
}

// Get the question with the same ordinal as the current page if it exists
export const getPageQuestion = (questions: ListingMultiselectQuestion[], page: number) => {
  const ordinalQuestions = questions?.filter((item) => {
    return item.ordinal === page
  })

  return ordinalQuestions?.length ? ordinalQuestions[0].multiselectQuestion : null
}

// Get all option field names for a question, including the potential opt out option
export const getAllOptions = (
  question: MultiselectQuestion,
  applicationSection: ApplicationSection
) => {
  const optionPaths =
    question?.options?.map((option) => fieldName(question.text, option.text, applicationSection)) ??
    []
  if (question?.optOutText) {
    optionPaths.push(fieldName(question?.text, question?.optOutText, applicationSection))
  }
  return optionPaths
}

export const getRadioFields = (
  options: MultiselectOption[],
  errors: UseFormMethods["errors"],
  register: UseFormMethods["register"],
  preference: MultiselectQuestion,
  applicationSection: ApplicationSection
) => {
  return (
    <fieldset>
      <FieldGroup
        fieldGroupClassName="grid grid-cols-1"
        fieldClassName="ml-0"
        type={"radio"}
        name={preference.text}
        error={errors[preference.text]}
        errorMessage={t("errors.selectAnOption")}
        register={register}
        validation={{ required: true }}
        dataTestId={"app-program-option"}
        fields={options?.map((option) => {
          return {
            id: option.text,
            label: option.text,
            value: option.text,
            description: option.description,
            //   defaultChecked: programData?.options?.find((item) => item.key === option.key)?.checked,
          }
        })}
      />
    </fieldset>
  )
}

const getCheckboxField = (
  option: MultiselectOption,
  question: MultiselectQuestion,
  applicationSection: ApplicationSection,
  errors: UseFormMethods["errors"],
  register: UseFormMethods["register"],
  trigger: UseFormMethods["trigger"],
  setValue: UseFormMethods["setValue"],
  getValues: UseFormMethods["getValues"],
  exclusiveKeys: string[],
  allOptions: string[],
  optionFieldName: string
) => {
  return (
    <Field
      id={option.text}
      name={optionFieldName}
      type={"checkbox"}
      label={option.text}
      register={register}
      inputProps={{
        onChange: (e: any) => {
          if (e.target.checked) {
            void trigger()
          }
          if (option.exclusive && e.target.checked) {
            setExclusive(
              true,
              setValue,
              exclusiveKeys,
              optionFieldName,
              question?.options?.map((option) =>
                fieldName(question.text, option.text, applicationSection)
              ) ?? []
            )
          }
          if (!option.exclusive) {
            setExclusive(
              false,
              setValue,
              exclusiveKeys,
              optionFieldName,
              question?.options?.map((option) =>
                fieldName(question.text, option.text, applicationSection)
              ) ?? []
            )
          }
        },
      }}
      validation={{
        validate: {
          somethingIsChecked: (value) => {
            if (question.optOutText) {
              return value || !!allOptions.find((option) => getValues(option))
            }
          },
        },
      }}
      dataTestId={"app-question-option"}
    />
  )
}

// Get an individual question option checkbox field
export const getCheckboxOption = (
  option: MultiselectOption,
  question: MultiselectQuestion,
  applicationSection: ApplicationSection,
  errors: UseFormMethods["errors"],
  register: UseFormMethods["register"],
  trigger: UseFormMethods["trigger"],
  setValue: UseFormMethods["setValue"],
  getValues: UseFormMethods["getValues"],
  exclusiveKeys: string[],
  allOptions: string[],
  watchFields: {
    [x: string]: any
  }
) => {
  const optionFieldName = fieldName(question.text, option.text, applicationSection)
  return (
    <div className={`mb-5 ${option.ordinal !== 1 ? "border-t pt-5" : ""}`} key={option.text}>
      <div className={`mb-5 field ${resolveObject(optionFieldName, errors) ? "error" : ""}`}>
        {getCheckboxField(
          option,
          question,
          ApplicationSection.preference,
          errors,
          register,
          trigger,
          setValue,
          getValues,
          exclusiveKeys,
          allOptions,
          optionFieldName
        )}
      </div>

      {option.description && (
        <div className="ml-8 -mt-5 mb-5">
          <ExpandableContent strings={{ readMore: t("t.readMore"), readLess: t("t.readLess") }}>
            <p className="field-note mb-2">
              {option.description}
              <br />
              {option?.links?.map((link) => (
                <a key={link.url} className="block pt-2" href={link.url}>
                  {link.title}
                </a>
              ))}
            </p>
          </ExpandableContent>
        </div>
      )}

      {watchFields[optionFieldName] && option.collectAddress && (
        <div className="pb-4">
          <FormAddress
            subtitle={t("application.preferences.options.address")}
            dataKey={fieldName(question.text, `${option.text}-address`, applicationSection)}
            register={register}
            errors={errors}
            required={true}
            stateKeys={stateKeys}
            data-test-id={"app-question-extra-field"}
          />
        </div>
      )}
    </div>
  )
}
