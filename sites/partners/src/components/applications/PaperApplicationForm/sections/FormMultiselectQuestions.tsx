import React, { useMemo } from "react"
import {
  Field,
  t,
  GridSection,
  GridCell,
  FormAddress,
  FieldGroup,
} from "@bloom-housing/ui-components"
import { FieldValue } from "@bloom-housing/ui-seeds"
import { useFormContext } from "react-hook-form"
import { stateKeys, getInputType, fieldName } from "@bloom-housing/shared-helpers"
import {
  ApplicationSection,
  ListingMultiselectQuestion,
  MultiselectOption,
  MultiselectQuestion,
} from "@bloom-housing/backend-core/types"

type FormMultiselectQuestionsProps = {
  questions: ListingMultiselectQuestion[]
  applicationSection: ApplicationSection
  sectionTitle: string
}

const FormMultiselectQuestions = ({
  applicationSection,
  questions,
  sectionTitle,
}: FormMultiselectQuestionsProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch } = formMethods

  const allOptionFieldNames = useMemo(() => {
    const keys = []
    questions?.forEach((listingQuestion) =>
      listingQuestion?.multiselectQuestion.options.forEach((option) =>
        keys.push(
          fieldName(listingQuestion?.multiselectQuestion.text, applicationSection, option.text)
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
        {watchQuestions[optionFieldName] && option.collectAddress && (
          <div className="pb-4">
            <FormAddress
              subtitle={t("application.preferences.options.address")}
              dataKey={fieldName(question.text, applicationSection, `${option.text}-address`)}
              register={register}
              required={true}
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
    <GridSection title={sectionTitle} separator grid={false}>
      <GridSection columns={2}>
        {questions?.map((listingQuestion) => {
          const question = listingQuestion?.multiselectQuestion
          const inputType = getInputType(question.options)
          return (
            <GridCell key={question.text}>
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
            </GridCell>
          )
        })}
      </GridSection>
    </GridSection>
  )
}

export { FormMultiselectQuestions as default, FormMultiselectQuestions }
