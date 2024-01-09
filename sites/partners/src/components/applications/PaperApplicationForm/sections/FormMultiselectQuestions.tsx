import React, { useMemo } from "react"
import { Field, t, FieldGroup, resolveObject } from "@bloom-housing/ui-components"
import { FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { useFormContext } from "react-hook-form"
import { stateKeys, getInputType, fieldName, AddressHolder } from "@bloom-housing/shared-helpers"
import {
  ListingMultiselectQuestion,
  MultiselectOption,
  MultiselectQuestion,
  MultiselectQuestionsApplicationSectionEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import SectionWithGrid from "../../../shared/SectionWithGrid"
import { FormAddressAlternate } from "@bloom-housing/shared-helpers/src/views/address/FormAddressAlternate"

type FormMultiselectQuestionsProps = {
  questions: ListingMultiselectQuestion[]
  applicationSection: MultiselectQuestionsApplicationSectionEnum
  sectionTitle: string
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
    formState: { errors },
  } = formMethods

  const allOptionFieldNames = useMemo(() => {
    const keys = []
    questions?.forEach((listingQuestion) =>
      listingQuestion?.multiselectQuestions.options.forEach((option) =>
        keys.push(
          fieldName(listingQuestion?.multiselectQuestions.text, applicationSection, option.text)
        )
      )
    )

    return keys
  }, [questions, applicationSection])

  if (questions?.length === 0) {
    return null
  }

  const watchQuestions = watch(allOptionFieldNames)

  const getCheckboxOption = (option: MultiselectOption, question: MultiselectQuestion) => {
    const optionFieldName = fieldName(question.text, applicationSection, option.text)
    return (
      <React.Fragment key={option.text}>
        <Field
          id={`${question?.text}-${option.text}`}
          name={optionFieldName}
          type={"checkbox"}
          label={option.text}
          register={register}
        />

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
                ? t("errors.maxLength")
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
                ? t("errors.maxLength")
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
          </div>
        )}
      </React.Fragment>
    )
  }

  const getRadioFields = (options: MultiselectOption[], question: MultiselectQuestion) => {
    return (
      <fieldset>
        <FieldGroup
          fieldGroupClassName="grid grid-cols-1"
          fieldClassName="ml-0"
          type={"radio"}
          name={fieldName(question.text, applicationSection)}
          register={register}
          dataTestId={"app-question-option"}
          fields={options?.map((option) => {
            return {
              id: `${question?.text}-${option.text}`,
              label: option?.text,
              value: option?.text,
              description: option?.description,
            }
          })}
        />
      </fieldset>
    )
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
                {inputType === "checkbox" ? (
                  <fieldset className={"mt-4"}>
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
                  </fieldset>
                ) : (
                  getRadioFields(question?.options, question)
                )}
              </FieldValue>
            )
          })}
        </Grid.Row>
      </SectionWithGrid>
    </>
  )
}

export { FormMultiselectQuestions as default, FormMultiselectQuestions }
