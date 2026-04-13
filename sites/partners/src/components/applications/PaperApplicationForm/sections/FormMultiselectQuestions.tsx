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
  enableV2MSQ: boolean
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
  enableV2MSQ,
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
    let keys = []
    if (enableV2MSQ) {
      questions?.forEach((listingQuestion) => {
        keys = [
          ...keys,
          ...getAllOptions(listingQuestion?.multiselectQuestions, applicationSection, enableV2MSQ),
        ]
      })
    } else {
      // TODO: We can sunset this after full V2MSQ rollout
      questions?.forEach((listingQuestion) =>
        listingQuestion?.multiselectQuestions?.options?.forEach((option) =>
          keys.push(
            fieldName(
              listingQuestion?.multiselectQuestions.text,
              applicationSection,
              cleanMultiselectString(option.text)
            )
          )
        )
      )
    }
    return keys
  }, [questions, applicationSection, enableV2MSQ])

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
      question.name || question.text,
      applicationSection,
      cleanMultiselectString(option.name || option.text)
    )
    return (
      <React.Fragment key={option.name || option.text}>
        {field}

        {watchQuestions[optionFieldName] && (option?.shouldCollectName || option?.collectName) && (
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
        {watchQuestions[optionFieldName] &&
          (option?.shouldCollectRelationship || option?.collectRelationship) && (
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
        {watchQuestions[optionFieldName] &&
          (option.shouldCollectAddress || option.collectAddress) && (
            <div className="pb-4">
              <FormAddressAlternate
                subtitle={t("application.preferences.options.qualifyingAddress")}
                dataKey={fieldName(
                  question.name || question.text,
                  applicationSection,
                  `${option.name || option.text}-address`
                )}
                register={register}
                required={true}
                errors={errors}
                stateKeys={stateKeys}
                data-testid={"app-question-extra-field"}
              />
              <MultiselectQuestionsMap
                dataKey={fieldName(
                  question.name || question.text,
                  applicationSection,
                  `${option.name || option.text}`
                )}
                geocodingClient={geocodingClient}
                enableV2MSQ={enableV2MSQ}
              />
            </div>
          )}
      </React.Fragment>
    )
  }

  const getCheckboxOption = (option: MultiselectOption, question: MultiselectQuestion) => {
    const optionFieldName = fieldName(
      question.name || question.text,
      applicationSection,
      cleanMultiselectString(option.name || option.text)
    )

    const checkboxField = (
      <Field
        id={`${question?.name || question?.text}-${option.name || option.text}`}
        name={optionFieldName}
        labelClassName="font-semibold"
        type={"checkbox"}
        label={option.name || option.text}
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
      question.name || question.text,
      applicationSection,
      cleanMultiselectString(option.name || option.text)
    )

    const radioField = (
      <Field
        id={`${question?.name || question?.text}-${option.name || option.text}`}
        name={optionFieldName}
        type={"radio"}
        label={option.name || option.text}
        register={register}
        inputProps={{
          value: !!(option.name || option.text),
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            uncheckOptions(getAllOptions(question, applicationSection, enableV2MSQ), setValue)
            setValue(optionFieldName, e.target?.value)
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
            // TODO: We can sunset parts of this after full V2MSQ rollout
            const inputType = enableV2MSQ
              ? question.isExclusive
                ? "radio"
                : "checkbox"
              : getInputType(question.options as unknown as MultiselectOption[])
            return (
              <Grid.Cell key={question.name || question.text}>
                <FieldValue label={question.name || question.text}>
                  <fieldset className={"mt-4"}>
                    {inputType === "checkbox" ? (
                      <>
                        {(enableV2MSQ ? question?.multiselectOptions : question?.options)
                          ?.sort((a, b) => (a.ordinal > b.ordinal ? 1 : -1))
                          .map((option) => {
                            return getCheckboxOption(option, question)
                          })}
                        {!enableV2MSQ &&
                          question?.optOutText &&
                          getCheckboxOption(
                            {
                              text: question.optOutText,
                              description: null,
                              links: [],
                              collectAddress: false,
                              exclusive: true,
                              ordinal: question.options.length,
                              id: null,
                              createdAt: null,
                              updatedAt: null,
                            },
                            question
                          )}
                      </>
                    ) : (
                      <>
                        {(enableV2MSQ ? question?.multiselectOptions : question?.options)
                          ?.sort((a, b) => (a.ordinal > b.ordinal ? 1 : -1))
                          .map((option) => {
                            return getRadioOption(option, question, setValue)
                          })}
                        {!enableV2MSQ &&
                          question?.optOutText &&
                          getRadioOption(
                            {
                              text: question.optOutText,
                              description: null,
                              links: [],
                              collectAddress: false,
                              exclusive: true,
                              ordinal: question.options.length,
                              id: null,
                              createdAt: null,
                              updatedAt: null,
                            },
                            question,
                            setValue
                          )}
                      </>
                    )}
                  </fieldset>
                </FieldValue>
              </Grid.Cell>
            )
          })}
        </Grid.Row>
      </SectionWithGrid>
    </>
  )
}

export { FormMultiselectQuestions as default, FormMultiselectQuestions }
