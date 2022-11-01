import {
  encodeToFrontendFilterString,
  FrontendListingFilterStateKeys,
  listingFeatures,
  Region,
} from "@bloom-housing/shared-helpers"
import {
  AppearanceStyleType,
  Button,
  Form,
  FormCard,
  ProgressNav,
  StepHeader,
  t,
} from "@bloom-housing/ui-components"
import axios from "axios"
import router from "next/router"

import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import Layout from "../layouts/application"
import FinderDisclaimer from "../src/forms/finder/FinderDisclaimer"
import FinderMultiselect from "../src/forms/finder/FinderMultiselect"
import FinderRentalCosts from "../src/forms/finder/FinderRentalCosts"

interface FinderField {
  label: string
  translation?: string
  value: boolean | string
  type?: string
}

export interface FinderQuestion {
  formSection: string
  fieldGroupName: string
  fields: FinderField[]
  question: string
  subtitle: string
}

const Finder = () => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, trigger, errors, watch } = useForm()
  const [questionIndex, setQuestionIndex] = useState<number>(0)
  const [formData, setFormData] = useState<FinderQuestion[]>([])
  const [isDisclaimer, setIsDisclaimer] = useState<boolean>(false)
  const minRent = watch("minRent")
  const maxRent = watch("maxRent")

  const activeQuestion = formData?.[questionIndex]

  const translationStringMap = {
    studio: "studioPlus",
    oneBdrm: "onePlus",
    twoBdrm: "twoPlus",
    threeBdrm: "threePlus",
    fourBdrm: "fourPlus",
  }

  const stepLabels = [
    t("finder.progress.housingLabel"),
    t("t.accessibility"),
    t("finder.progress.buildingLabel"),
  ]

  const sectionNumber = !isDisclaimer
    ? stepLabels.indexOf(formData[questionIndex]?.formSection) + 1
    : stepLabels.length + 1

  const onSubmit = () => {
    const formSelections = {}
    formData?.forEach((question) => {
      if (question.fieldGroupName !== "rentalCosts") {
        formSelections[question.fieldGroupName] = question?.fields
          ?.filter((field) => field.value)
          ?.map((field) => field.label)
          ?.join()
      } else {
        question.fields.forEach((field) => {
          if (field.value) formSelections[field.label] = field.value
        })
      }
    })
    void router.push(
      `/listings/filtered?page=${1}&limit=${8}${encodeToFrontendFilterString(formSelections)}`
    )
  }
  useEffect(() => {
    const getAndSetOptions = async () => {
      try {
        const response = await axios.get(`${process.env.backendApiBase}/listings/meta`)
        const formQuestions: FinderQuestion[] = []
        if (response?.data?.unitTypes) {
          const bedroomFields = response.data.unitTypes.map((elem) => ({
            label: FrontendListingFilterStateKeys[elem.name],
            translation: t(`listingFilters.bedroomsOptions.${translationStringMap[elem.name]}`),
            value: false,
          }))
          formQuestions.push({
            formSection: t("finder.progress.housingLabel"),
            fieldGroupName: "bedRoomSize",
            fields: bedroomFields,
            question: t("finder.bedRoomSize.question"),
            subtitle: t("finder.default.subtitle"),
          })
        }
        const neighborhoodFields = Object.keys(Region).map((key) => ({
          label: FrontendListingFilterStateKeys[key],
          translation: t(`listingFilters.region.${key}`),
          value: false,
        }))
        formQuestions.push({
          formSection: t("finder.progress.housingLabel"),
          fieldGroupName: "region",
          fields: neighborhoodFields,
          question: t("finder.region.question"),
          subtitle: t("finder.default.subtitle"),
        })
        const costFields = [
          {
            label: "minRent",
            translation: t("finder.rentalCosts.minRent"),
            type: "number",
            value: "",
          },
          {
            label: "maxRent",
            translation: t("finder.rentalCosts.maxRent"),
            type: "number",
            value: "",
          },
          {
            label: "section8Acceptance",
            translation: t("finder.rentalCosts.section8"),
            type: "checkbox",
            value: false,
          },
        ]

        formQuestions.push({
          formSection: t("finder.progress.housingLabel"),
          fieldGroupName: "rentalCosts",
          fields: costFields,
          question: t("finder.rentalCosts.question"),
          subtitle: t("finder.default.subtitle"),
        })

        const a11yFields = listingFeatures.map((elem) => ({
          label: elem,
          translation: t(`eligibility.accessibility.${elem}`),
          value: false,
        }))

        formQuestions.push({
          formSection: t("t.accessibility"),
          fieldGroupName: "accessibility",
          fields: a11yFields,
          question: t("finder.accessibility.question"),
          subtitle: t("finder.accessibility.subtitle"),
        })
        if (response?.data?.programs) {
          const programsFiltered = response.data.programs.filter(
            (program) => program.title !== "Families"
          )
          const programFields = programsFiltered.map((elem) => ({
            label: elem.id,
            translation: t(`finder.programs.${elem.title}`),
            value: false,
          }))
          formQuestions.push({
            formSection: t("finder.progress.buildingLabel"),
            fieldGroupName: "communityPrograms",
            fields: programFields,
            question: t("finder.programs.question"),
            subtitle: t("finder.programs.subtitle"),
          })
        }

        setFormData(formQuestions)
      } catch (e) {
        console.error(e)
      }
    }
    void getAndSetOptions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const ProgressHeader = () => {
    return (
      <div className="flex flex-col w-full px-2 md:px-0">
        <div className="flex flex-row flex-wrap justify-between gap-y-4 gap-x-0.5">
          <div className="md:text-xl capitalize font-bold">
            {t("listingFilters.buttonTitleExtended")}
          </div>
          {!isDisclaimer && (
            <StepHeader
              currentStep={sectionNumber}
              totalSteps={3}
              stepPreposition={t("finder.progress.stepPreposition")}
              stepLabeling={stepLabels}
            ></StepHeader>
          )}
        </div>
        <ProgressNav
          currentPageSection={sectionNumber}
          completedSections={sectionNumber - 1}
          labels={stepLabels}
          mounted={true}
          style="bar"
        ></ProgressNav>
      </div>
    )
  }

  const nextQuestion = () => {
    if (!Object.keys(errors).length) {
      const formCopy = [...formData]
      if (activeQuestion.fieldGroupName !== "rentalCosts") {
        const userSelections = watch()?.[activeQuestion["fieldGroupName"]]
        formCopy[questionIndex]["fields"].forEach((field) => {
          field["value"] = userSelections.includes(field.label)
        })
      } else {
        const userInputs = watch()
        formCopy[questionIndex]["fields"].forEach((field) => {
          field["value"] = userInputs[field.label]
        })
      }
      setFormData(formCopy)
      if (questionIndex >= formData.length - 1) setIsDisclaimer(true)
      setQuestionIndex(questionIndex + 1)
    }
  }
  const previousQuestion = () => {
    setIsDisclaimer(false)
    setQuestionIndex(questionIndex - 1)
  }

  const skipToListings = () => {
    setIsDisclaimer(true)
    setQuestionIndex(formData.length)
  }

  return (
    <Layout>
      <Form onSubmit={handleSubmit(onSubmit)} className="bg-gray-300 border-t border-gray-450">
        <div className="md:mb-8 mt-8 mx-auto max-w-5xl">
          <ProgressHeader />
          <FormCard>
            {formData?.length > 0 && (
              <>
                <div className="px-10 md:px-20 pt-6 md:pt-12 ">
                  <div className="text-3xl pb-4">
                    {!isDisclaimer ? activeQuestion.question : t("finder.disclaimer.header")}
                  </div>
                  <div className="pb-8 border-b border-gray-450">
                    {!isDisclaimer ? activeQuestion.subtitle : t("finder.disclaimer.subtitle")}
                  </div>
                  {!isDisclaimer ? (
                    <div className="py-8">
                      <p className="pb-4">{t("finder.multiselectHelper")}</p>
                      {activeQuestion.fieldGroupName !== "rentalCosts" ? (
                        <FinderMultiselect activeQuestion={activeQuestion} register={register} />
                      ) : (
                        <FinderRentalCosts
                          activeQuestion={activeQuestion}
                          register={register}
                          errors={errors}
                          trigger={trigger}
                          minRent={minRent}
                          maxRent={maxRent}
                        />
                      )}
                    </div>
                  ) : (
                    <FinderDisclaimer />
                  )}
                </div>

                <div
                  className={`bg-gray-300 flex flex-row-reverse justify-between py-8 px-10 md:px-20 ${
                    isDisclaimer && "rounded-lg"
                  }`}
                >
                  {!isDisclaimer ? (
                    <Button
                      type="button"
                      onClick={nextQuestion}
                      styleType={AppearanceStyleType.primary}
                    >
                      {t("t.next")}
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      key="finderSubmit"
                      styleType={AppearanceStyleType.primary}
                    >
                      {t("t.finish")}
                    </Button>
                  )}
                  {questionIndex > 0 && (
                    <Button
                      type="button"
                      onClick={previousQuestion}
                      styleType={AppearanceStyleType.accentLight}
                    >
                      {t("t.previous")}
                    </Button>
                  )}
                </div>
                {!isDisclaimer && (
                  <div className="flex justify-center align-center bg-white py-8 rounded-lg">
                    <Button className="text-base underline" unstyled onClick={skipToListings}>
                      {t("finder.skip")}
                    </Button>
                  </div>
                )}
              </>
            )}
          </FormCard>
        </div>
      </Form>
    </Layout>
  )
}

export default Finder
