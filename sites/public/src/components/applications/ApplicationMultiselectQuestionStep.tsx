import React, { useMemo, useState, useEffect, useContext } from "react"
import { useForm } from "react-hook-form"
import { AlertBox, Form, FormCard, t, ProgressNav, Heading } from "@bloom-housing/ui-components"
import { Button } from "@bloom-housing/ui-seeds"
import FormsLayout from "../../layouts/forms"
import FormBackLink from "./FormBackLink"
import { useFormConductor } from "../../lib/hooks"
import { ApplicationSection, MultiselectOption } from "@bloom-housing/backend-core/types"
import {
  OnClientSide,
  PageView,
  pushGtmEvent,
  mapCheckboxesToApi,
  mapApiToMultiselectForm,
  AuthContext,
  getExclusiveKeys,
  getCheckboxOption,
  getAllOptions,
  getPageQuestion,
  getInputType,
  getRadioFields,
  mapRadiosToApi,
  listingSectionQuestions,
} from "@bloom-housing/shared-helpers"
import { UserStatus } from "../../lib/constants"

export interface ApplicationMultiselectQuestionStepProps {
  applicationSection: ApplicationSection
  applicationStep: string
  applicationSectionNumber: number
  strings?: {
    title?: string
    subTitle?: string
  }
}

const ApplicationMultiselectQuestionStep = ({
  applicationSection,
  applicationStep,
  applicationSectionNumber,
  strings,
}: ApplicationMultiselectQuestionStepProps) => {
  const clientLoaded = OnClientSide()
  const { profile } = useContext(AuthContext)
  const { conductor, application, listing } = useFormConductor(applicationStep)

  const questions = listingSectionQuestions(listing, applicationSection)
  const [page, setPage] = useState(conductor.navigatedThroughBack ? questions.length : 1)
  const [applicationQuestions, setApplicationQuestions] = useState(application[applicationSection])
  const question = getPageQuestion(questions, page)

  const questionSetInputType = getInputType(question?.options)

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, setValue, watch, handleSubmit, errors, getValues, reset, trigger } = useForm({
    defaultValues: mapApiToMultiselectForm(applicationQuestions, questions, applicationSection),
  })

  const [exclusiveKeys, setExclusiveKeys] = useState(getExclusiveKeys(question, applicationSection))

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: `Application - All ${applicationSection}`,
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  // Required to keep the form up to date before submitting this section if you're moving between pages
  useEffect(() => {
    reset(mapApiToMultiselectForm(applicationQuestions, questions, applicationSection))
    setExclusiveKeys(getExclusiveKeys(question, applicationSection))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, applicationQuestions, reset])

  const allOptionNames = useMemo(() => {
    return getAllOptions(question, applicationSection)
  }, [question])

  const onSubmit = (data) => {
    const body =
      questionSetInputType === "checkbox"
        ? mapCheckboxesToApi(data, question, applicationSection)
        : mapRadiosToApi(data.application[applicationSection], question)
    if (questions.length > 1 && body) {
      // If there is more than one question, save the data in segments
      const currentQuestions = conductor.currentStep.application[applicationSection].filter(
        (question) => {
          return question.key !== body.key
        }
      )
      conductor.currentStep.save([...currentQuestions, body])
      setApplicationQuestions([...currentQuestions, body])
    } else {
      // Otherwise, submit all at once
      conductor.currentStep.save([body])
    }
    // Update to the next page if we have more pages
    if (page !== questions.length) {
      setPage(page + 1)
      return
    }
    // Otherwise complete the section and move to the next URL
    conductor.completeSection(applicationSectionNumber)
    conductor.sync()
    conductor.routeToNextOrReturnUrl()
  }

  const watchQuestions = watch(allOptionNames)

  if (!clientLoaded || !allOptionNames) {
    return null
  }

  const checkboxOption = (option: MultiselectOption) => {
    return getCheckboxOption(
      option,
      question,
      applicationSection,
      register,
      setValue,
      getValues,
      allOptionNames,
      watchQuestions,
      errors,
      trigger,
      exclusiveKeys
    )
  }

  const allOptions = question ? [...question?.options] : []
  if (question?.optOutText) {
    allOptions.push({
      text: question?.optOutText,
      description: null,
      links: [],
      collectAddress: false,
      exclusive: true,
      ordinal: question.options.length + 1,
    })
  }

  return (
    <FormsLayout>
      <FormCard header={<Heading priority={1}>{listing?.name}</Heading>}>
        <ProgressNav
          currentPageSection={applicationSectionNumber}
          completedSections={application.completedSections}
          labels={conductor.config.sections.map((label) => t(`t.${label}`))}
          mounted={clientLoaded}
        />
      </FormCard>
      <FormCard>
        <FormBackLink
          url={conductor.determinePreviousUrl()}
          onClick={() => {
            conductor.setNavigatedBack(true)
            setPage(page - 1)
          }}
          custom={page !== 1}
        />

        <div className="form-card__lead border-b flex flex-col items-center">
          <h2 className="form-card__title is-borderless">{strings?.title ?? question?.text}</h2>
          {strings?.subTitle && <p className="field-note mt-6">{strings?.subTitle}</p>}
        </div>

        {!!Object.keys(errors).length && (
          <AlertBox type="alert" inverted closeable>
            {t("errors.errorsToResolve")}
          </AlertBox>
        )}

        <Form onSubmit={handleSubmit(onSubmit)}>
          <div key={question?.id}>
            <div className={`form-card__group`}>
              {questionSetInputType === "checkbox" ? (
                <fieldset>
                  <legend className="text__caps-spaced mb-4">{question?.text}</legend>
                  <p className="field-note mb-8">{question?.description}</p>

                  {allOptions.map((option) => {
                    return checkboxOption(option)
                  })}
                </fieldset>
              ) : (
                getRadioFields(allOptions, register, question, applicationSection, errors)
              )}
            </div>
          </div>

          <div className="form-card__pager">
            <div className="form-card__pager-row primary">
              <Button
                type="submit"
                variant="primary"
                onClick={() => {
                  conductor.returnToReview = false
                  conductor.setNavigatedBack(false)
                }}
                id={"app-next-step-button"}
              >
                {t("t.next")}
              </Button>
            </div>

            {conductor.canJumpForwardToReview() && (
              <div className="form-card__pager-row">
                <Button
                  variant="text"
                  className="mb-4"
                  onClick={() => {
                    conductor.returnToReview = true
                  }}
                >
                  {t("application.form.general.saveAndReturn")}
                </Button>
              </div>
            )}
          </div>
        </Form>
      </FormCard>
    </FormsLayout>
  )
}

export default ApplicationMultiselectQuestionStep
