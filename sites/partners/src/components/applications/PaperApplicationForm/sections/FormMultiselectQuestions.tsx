import React, { ReactNode, useEffect, useMemo, useState } from "react"
import { Field, t, resolveObject } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { useFormContext, UseFormMethods } from "react-hook-form"
import {
  stateKeys,
  getInputType,
  fieldName,
  AddressHolder,
  cleanMultiselectString,
  getAllOptions,
} from "@bloom-housing/shared-helpers"
import {
  ListingMultiselectQuestion,
  MultiselectOption,
  MultiselectQuestion,
  MultiselectQuestionsApplicationSectionEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import { FormAddressAlternate } from "@bloom-housing/shared-helpers/src/views/address/FormAddressAlternate"
import GeocodeService, {
  GeocodeService as GeocodeServiceType,
} from "@mapbox/mapbox-sdk/services/geocoding"
import MultiselectQuestionsMap from "../MultiselectQuestionsMap"

type FormMultiselectQuestionsProps = {
  questions: ListingMultiselectQuestion[]
  applicationSection: MultiselectQuestionsApplicationSectionEnum
  sectionTitle: string
}

// Set the value as false for a set of option field names
const uncheckOptions = (options: string[], setValue: (key: string, value: boolean) => void) => {
  options?.forEach((option) => {
    setValue(option, false)
  })
}

const FormMultiselectQuestions = ({
  applicationSection,
  questions,
  sectionTitle,
}: FormMultiselectQuestionsProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = formMethods

  const allOptionFieldNames = useMemo(() => {
    const keys = []
    questions?.forEach((listingQuestion) =>
      listingQuestion?.multiselectQuestions.options.forEach((option) =>
        keys.push(
          fieldName(
            listingQuestion?.multiselectQuestions.text,
            applicationSection,
            cleanMultiselectString(option.text)
          )
        )
      )
    )

    return keys
  }, [questions, applicationSection])

  const [geocodingClient, setGeocodingClient] = useState<GeocodeServiceType>()

  useEffect(() => {
    if (process.env.mapBoxToken || process.env.MAPBOX_TOKEN) {
      setGeocodingClient(
        GeocodeService({
          accessToken: process.env.mapBoxToken || process.env.MAPBOX_TOKEN,
        })
      )
    }
  }, [])

  if (questions?.length === 0) {
    return null
  }

  const watchQuestions = watch(allOptionFieldNames)

  const multiselectOptionWrapper = (
    field: ReactNode,
    option: MultiselectOption,
    question: MultiselectQuestion
  ) => {
    const optionFieldName = fieldName(
      question.text,
      applicationSection,
      cleanMultiselectString(option.text)
    )
    return (
      <React.Fragment key={option.text}>
        {field}

        {watchQuestions[optionFieldName] && option?.collectName && (
          <Field
            id={AddressHolder.Name}
            name={`${optionFieldName}-${AddressHolder.Name}`}
            label={t(`application.preferences.options.${AddressHolder.Name}`)}
            register={register}
            validation={{ required: true, maxLength: 64 }}
            error={!!resolveObject(`${optionFieldName}-${AddressHolder.Name}`, errors)}
            errorMessage={
              resolveObject(`${optionFieldName}-${AddressHolder.Name}`, errors)?.type ===
              "maxLength"
                ? t("errors.maxLength", { length: 64 })
                : t("errors.requiredFieldError")
            }
          />
        )}
        {watchQuestions[optionFieldName] && option?.collectRelationship && (
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
          />
        )}
        {watchQuestions[optionFieldName] && option.collectAddress && (
          <div className="pb-4">
            <FormAddressAlternate
              subtitle={t("application.preferences.options.qualifyingAddress")}
              dataKey={fieldName(question.text, applicationSection, `${option.text}-address`)}
              register={register}
              required={true}
              errors={errors}
              stateKeys={stateKeys}
              data-testid={"app-question-extra-field"}
            />
            <MultiselectQuestionsMap
              dataKey={fieldName(question.text, applicationSection, `${option.text}`)}
              geocodingClient={geocodingClient}
            />
          </div>
        )}
      </React.Fragment>
    )
  }

  const getCheckboxOption = (option: MultiselectOption, question: MultiselectQuestion) => {
    const optionFieldName = fieldName(
      question.text,
      applicationSection,
      cleanMultiselectString(option.text)
    )

    const checkboxField = (
      <Field
        id={`${question?.text}-${option.text}`}
        name={optionFieldName}
        labelClassName="font-semibold"
        type={"checkbox"}
        label={option.text}
        register={register}
      />
    )
    return multiselectOptionWrapper(checkboxField, option, question)
  }

  const getRadioOption = (
    option: MultiselectOption,
    question: MultiselectQuestion,
    setValue: UseFormMethods["setValue"]
  ) => {
    const optionFieldName = fieldName(
      question.text,
      applicationSection,
      cleanMultiselectString(option.text)
    )

    const radioField = (
      <Field
        id={`${question?.text}-${option.text}`}
        name={optionFieldName}
        type={"radio"}
        label={option.text}
        register={register}
        inputProps={{
          value: !!option.text,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            uncheckOptions(getAllOptions(question, applicationSection), setValue)
            setValue(optionFieldName, e.target.value)
          },
        }}
      />
    )
    return multiselectOptionWrapper(radioField, option, question)
  }

  return (
    <>
      <hr className="spacer-section-above spacer-section" />
      <SectionWithGrid heading={sectionTitle}>
        <Grid.Row columns={2}>
          {questions?.map((listingQuestion) => {
            const question = listingQuestion?.multiselectQuestions
            const inputType = getInputType(question.options as unknown as MultiselectOption[])
            return (
              <FieldValue label={question.text}>
                <fieldset className={"mt-4"}>
                  {inputType === "checkbox" ? (
                    <>
                      {question?.options
                        ?.sort((a, b) => (a.ordinal > b.ordinal ? 1 : -1))
                        .map((option) => {
                          return getCheckboxOption(option, question)
                        })}
                      {question?.optOutText &&
                        getCheckboxOption(
                          {
                            text: question.optOutText,
                            description: null,
                            links: [],
                            collectAddress: false,
                            exclusive: true,
                            ordinal: question.options.length,
                          },
                          question
                        )}
                    </>
                  ) : (
                    <>
                      {question?.options
                        ?.sort((a, b) => (a.ordinal > b.ordinal ? 1 : -1))
                        .map((option) => {
                          return getRadioOption(option, question, setValue)
                        })}
                      {question?.optOutText &&
                        getRadioOption(
                          {
                            text: question.optOutText,
                            description: null,
                            links: [],
                            collectAddress: false,
                            exclusive: true,
                            ordinal: question.options.length,
                          },
                          question,
                          setValue
                        )}
                    </>
                  )}
                </fieldset>
              </FieldValue>
            )
          })}
        </Grid.Row>
      </SectionWithGrid>
    </>
  )
}

export { FormMultiselectQuestions as default, FormMultiselectQuestions }
