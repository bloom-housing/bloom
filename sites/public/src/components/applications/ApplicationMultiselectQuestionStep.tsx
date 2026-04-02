import React, { useContext, useEffect, useMemo, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { Form, t } from "@bloom-housing/ui-components"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import {
  AuthContext,
  getAllOptions,
  getCheckboxOption,
  getExclusiveKeys,
  getInputType,
  getPageQuestion,
  getRadioOption,
  listingSectionQuestions,
  mapApiToMultiselectFormV1,
  mapApiToMultiselectForm,
  mapCheckboxesToApiV1,
  mapCheckboxesToApi,
  OnClientSide,
  PageView,
  pushGtmEvent,
  AddressHolder,
  getSelectionsForApplicationSection,
} from "@bloom-housing/shared-helpers"
import {
  ApplicationSelectionCreate,
  MultiselectOption,
  MultiselectQuestionsApplicationSectionEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import FormsLayout from "../../layouts/forms"
import { useFormConductor } from "../../lib/hooks"
import { UserStatus } from "../../lib/constants"
import ApplicationFormLayout, {
  ApplicationAlertBox,
  onFormError,
} from "../../layouts/application-form"
import { AddressValidationSelection, findValidatedAddress, FoundAddress } from "./ValidateAddress"

export interface ApplicationMultiselectQuestionStepProps {
  applicationSection: MultiselectQuestionsApplicationSectionEnum
  applicationStep: string
  applicationSectionNumber: number
  strings?: {
    title?: string
    subTitle?: string
  }
  swapCommunityTypeWithPrograms: boolean
  enableV2MSQ: boolean
}

export const getMultiselectStepTitle = (
  sectionEnum: MultiselectQuestionsApplicationSectionEnum,
  swapCommunityTypeWithPrograms: boolean
) => {
  if (
    swapCommunityTypeWithPrograms &&
    sectionEnum === MultiselectQuestionsApplicationSectionEnum.programs
  )
    return t("listings.communityTypes")
  return sectionEnum === MultiselectQuestionsApplicationSectionEnum.preferences
    ? t("t.preferences")
    : t("t.programs")
}

const ApplicationMultiselectQuestionStep = ({
  applicationSection,
  applicationStep,
  applicationSectionNumber,
  strings,
  swapCommunityTypeWithPrograms,
  enableV2MSQ,
}: ApplicationMultiselectQuestionStepProps) => {
  const [verifyAddress, setVerifyAddress] = useState(false)
  const [verifyAddressStep, setVerifyAddressStep] = useState(0)
  const [foundAddress, setFoundAddress] = useState<FoundAddress>({})
  const [newAddressSelected, setNewAddressSelected] = useState(true)

  const clientLoaded = OnClientSide()
  const { profile } = useContext(AuthContext)
  const { conductor, application, listing } = useFormConductor(applicationStep)

  const questions = listingSectionQuestions(listing, applicationSection)
  const [page, setPage] = useState(conductor.navigatedThroughBack ? questions.length : 1)
  const [applicationQuestions, setApplicationQuestions] = useState(
    enableV2MSQ
      ? getSelectionsForApplicationSection(
          questions,
          applicationSection,
          application.applicationSelections
        )
      : Array.isArray(application[applicationSection])
      ? application[applicationSection]
      : []
  )
  const question = getPageQuestion(questions, page)
  const questionOptions = (enableV2MSQ ? question?.multiselectOptions : question?.options) || []

  const questionSetInputType = enableV2MSQ
    ? question?.isExclusive
      ? "radio"
      : "checkbox"
    : getInputType(question?.options)

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, setValue, watch, handleSubmit, errors, getValues, reset, trigger } = useForm({
    defaultValues: enableV2MSQ
      ? mapApiToMultiselectForm(applicationQuestions, questions, applicationSection)
      : mapApiToMultiselectFormV1(applicationQuestions, questions, applicationSection),
  })

  const [exclusiveKeys, setExclusiveKeys] = useState(
    getExclusiveKeys(question, applicationSection, enableV2MSQ)
  )

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: `Application - All ${applicationSection}`,
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile, applicationSection])

  // Required to keep the form up to date before submitting this section if you're moving between pages
  useEffect(() => {
    reset(
      enableV2MSQ
        ? mapApiToMultiselectForm(
            Array.isArray(applicationQuestions) ? applicationQuestions : [],
            questions,
            applicationSection
          )
        : mapApiToMultiselectFormV1(
            Array.isArray(applicationQuestions) ? applicationQuestions : [],
            questions,
            applicationSection
          )
    )
    setExclusiveKeys(getExclusiveKeys(question, applicationSection, enableV2MSQ))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, applicationQuestions, reset])

  const allOptionNames = useMemo(() => {
    return getAllOptions(question, applicationSection, enableV2MSQ)
  }, [applicationSection, enableV2MSQ, question])

  const body = useRef(null)

  const getAddressFromOptionStep = (step: number) => {
    if (enableV2MSQ) {
      return body.current.selections[step]?.[AddressHolder.Address]
    } else {
      return body.current.options[step]?.extraData?.[0]?.value
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setAddressForOptionStep = (step: number, newAddress: any) => {
    if (enableV2MSQ) {
      body.current.selections[step][AddressHolder.Address] = newAddress
    } else {
      body.current.options[step].extraData[0].value = newAddress
    }
  }

  const onSubmit = (data) => {
    if (verifyAddressStep === 0) {
      body.current = enableV2MSQ
        ? mapCheckboxesToApi(data, question, applicationSection)
        : mapCheckboxesToApiV1(data, question, applicationSection)
    }

    // Verify address on preferences
    if (questionOptions.some((item) => item.shouldCollectAddress || item.collectAddress)) {
      const step: number = (body.current.selections || body.current.options).findIndex(
        (option, index) =>
          index >= verifyAddressStep &&
          (option[AddressHolder.Address] ||
            (option.checked === true && option.extraData?.[0]?.value))
      )

      if (
        newAddressSelected &&
        foundAddress.newAddress &&
        getAddressFromOptionStep(verifyAddressStep - 1)
      ) {
        setAddressForOptionStep(verifyAddressStep - 1, foundAddress.newAddress)
      }

      if (step !== -1) {
        if (getAddressFromOptionStep(step)) {
          setFoundAddress({})
          setVerifyAddress(true)
          findValidatedAddress(
            getAddressFromOptionStep(step),
            setFoundAddress,
            setNewAddressSelected
          )
          setVerifyAddressStep(step + 1)
        }

        return // Skip rest of the submit process
      }
    }

    if (questions.length > 1 && body.current) {
      // If there is more than one question, save the data in segments
      const currentQuestions = enableV2MSQ
        ? conductor.application.applicationSelections.filter(
            (selection: ApplicationSelectionCreate) =>
              questions.find(
                (question) => question.multiselectQuestions.id === selection.multiselectQuestion.id
              ) && selection.multiselectQuestion.id != body.current.multiselectQuestion.id
          )
        : conductor.application[applicationSection].filter(
            (question) => question.key !== body.current.key
          )

      conductor.currentStep.save([...currentQuestions, body.current])
      setApplicationQuestions([...currentQuestions, body.current])
    } else {
      // Otherwise, submit all at once
      conductor.currentStep.save([body.current])
    }
    // Update to the next page if we have more pages
    if (page !== questions.length && !conductor.returnToReview) {
      setVerifyAddressStep(0)
      setVerifyAddress(false)
      setPage(page + 1)
      body.current = null
      window.scrollTo({ top: 0 })
      return
    }
    // Otherwise complete the section and move to the next URL
    conductor.completeSection(applicationSectionNumber)
    conductor.sync()
    conductor.routeToNextOrReturnUrl()
  }

  const onError = () => {
    onFormError()
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
      enableV2MSQ,
      errors,
      trigger,
      exclusiveKeys
    )
  }

  const radioOption = (option: MultiselectOption) => {
    return getRadioOption(
      option,
      question,
      applicationSection,
      register,
      setValue,
      allOptionNames,
      watchQuestions,
      getValues,
      errors,
      trigger
    )
  }

  const allOptions = [...questionOptions]
  if (!enableV2MSQ && question?.optOutText) {
    allOptions.push({
      text: question?.optOutText,
      description: null,
      links: [],
      collectAddress: false,
      exclusive: true,
      ordinal: question.options.length + 1,
      id: null,
      createdAt: null,
      updatedAt: null,
    })
  }

  const getSubtitle = () => {
    if (verifyAddress) {
      if (
        (body.current.selections || body.current.options.filter((option) => option.checked) || [])
          .length > 1
      ) {
        return t("application.contact.verifyMultipleAddresses")
      }
      return null
    }
    return strings?.subTitle ?? question?.description
  }

  return (
    <FormsLayout
      pageTitle={`${getMultiselectStepTitle(
        applicationSection,
        swapCommunityTypeWithPrograms
      )} - ${t("listings.apply.applyOnline")} - ${listing?.name}`}
    >
      <Form onSubmit={handleSubmit(onSubmit, onError)}>
        <ApplicationFormLayout
          listingName={listing?.name}
          heading={
            verifyAddress
              ? foundAddress.invalid
                ? t("application.contact.couldntLocateAddress")
                : t("application.contact.verifyAddressTitle")
              : strings?.title ?? question?.text
          }
          subheading={getSubtitle()}
          progressNavProps={{
            currentPageSection: applicationSectionNumber,
            completedSections: application.completedSections,
            labels: conductor.config.sections.map((label) => t(`t.${label}`)),
            mounted: clientLoaded,
          }}
          backLink={
            !verifyAddress
              ? {
                  url: conductor.determinePreviousUrl(),
                  onClickFxn:
                    page !== 1
                      ? () => {
                          conductor.setNavigatedBack(true)
                          setPage(page - 1)
                          body.current = null
                        }
                      : undefined,
                }
              : null
          }
          conductor={conductor}
        >
          <ApplicationAlertBox errors={errors} />

          <div style={{ display: verifyAddress ? "none" : "block" }} key={question?.id}>
            <CardSection>
              <fieldset>
                <legend className="text__caps-spaced mb-4 sr-only">{question?.text}</legend>
                {applicationSection === MultiselectQuestionsApplicationSectionEnum.preferences && (
                  <div className="mb-6">
                    <p className="text__caps-spaced m-0">{question?.name || question?.text}</p>
                    {question?.description && (
                      <p className="field-note mt-3">{question?.description}</p>
                    )}
                    {question?.links?.map((link) => (
                      <a
                        key={link.url}
                        className="block text-base mt-3 text-blue-500 underline"
                        href={link.url}
                        target={"_blank"}
                        rel="noreferrer noopener"
                      >
                        {link.title}
                      </a>
                    ))}
                  </div>
                )}
                {questionSetInputType === "checkbox" ? (
                  <>
                    <p className="field-note mb-3">
                      {t("application.household.preferredUnit.optionsLabel")}
                    </p>
                    {allOptions
                      ?.sort((a, b) => (a.ordinal > b.ordinal ? 1 : -1))
                      .map((option) => {
                        return checkboxOption(option)
                      })}
                  </>
                ) : (
                  <>
                    <p className="field-note mb-3">{t("t.pleaseSelectOne")}</p>
                    {allOptions
                      ?.sort((a, b) => (a.ordinal > b.ordinal ? 1 : -1))
                      .map((option) => {
                        return radioOption(option)
                      })}
                  </>
                )}
              </fieldset>
            </CardSection>
          </div>
          {verifyAddress && (
            <CardSection>
              <AddressValidationSelection
                {...{
                  foundAddress,
                  newAddressSelected,
                  setNewAddressSelected,
                  setVerifyAddress,
                  setVerifyAddressStep,
                }}
              />
            </CardSection>
          )}
        </ApplicationFormLayout>
      </Form>
    </FormsLayout>
  )
}

export default ApplicationMultiselectQuestionStep
