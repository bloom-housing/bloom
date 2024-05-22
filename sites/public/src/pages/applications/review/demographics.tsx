import React, { useContext, useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"

import { FieldGroup, Form, Select, t } from "@bloom-housing/ui-components"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import { MultiselectQuestionsApplicationSectionEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import {
  ethnicityKeys,
  raceKeys,
  howDidYouHear,
  fieldGroupObjectToArray,
  OnClientSide,
  PageView,
  pushGtmEvent,
  AuthContext,
  listingSectionQuestions,
} from "@bloom-housing/shared-helpers"
import FormsLayout from "../../../layouts/forms"
import { useFormConductor } from "../../../lib/hooks"
import { UserStatus } from "../../../lib/constants"
import ApplicationFormLayout from "../../../layouts/application-form"

const ApplicationDemographics = () => {
  const { profile } = useContext(AuthContext)
  const { conductor, application, listing } = useFormConductor("demographics")
  let currentPageSection = 4
  if (listingSectionQuestions(listing, MultiselectQuestionsApplicationSectionEnum.programs)?.length)
    currentPageSection += 1
  if (
    listingSectionQuestions(listing, MultiselectQuestionsApplicationSectionEnum.preferences)?.length
  )
    currentPageSection += 1

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, getValues } = useForm({
    defaultValues: {
      ethnicity: application.demographics.ethnicity,
      race: application.demographics.race,
    },
  })

  const onSubmit = (data) => {
    conductor.currentStep.save({
      demographics: {
        ethnicity: data.ethnicity,
        gender: "",
        sexualOrientation: "",
        howDidYouHear: data.howDidYouHear,
        race: fieldGroupObjectToArray(data, "race"),
      },
    })
    conductor.routeToNextOrReturnUrl()
  }

  const howDidYouHearOptions = () => {
    return howDidYouHear?.map((item) => ({
      id: item.id,
      label: t(`application.review.demographics.howDidYouHearOptions.${item.id}`),
      defaultChecked: application.demographics.howDidYouHear?.includes(item.id),
      register,
    }))
  }

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Application - Demographics",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  const isKeyIncluded = (raceKey: string) => {
    let keyExists = false
    const curValues = getValues()
    if (typeof curValues === "object" && !curValues) {
      Object.entries(curValues).forEach(([key, _]) => {
        if (key.includes(raceKey)) {
          keyExists = true
        }
      })
    } else {
      application.demographics?.race?.forEach((value) => {
        if (value.includes(raceKey)) {
          keyExists = true
        }
      })
    }
    return keyExists
  }

  // Get the value of a field that is storing a custom value, i.e. "otherAsian: Custom Race Input"
  const getCustomValue = (subKey: string) => {
    const curValues = getValues()
    let customValues
    if (typeof curValues === "object" && !curValues) {
      customValues = Object.entries(curValues).filter(([key, _]) => key.split(":")[0] === subKey)
    } else {
      customValues = application.demographics?.race?.filter(
        (value) => value.split(":")[0] === subKey
      )
    }
    return customValues?.length ? customValues[0].split(":")[1]?.substring(1) : ""
  }

  const raceOptions = useMemo(() => {
    return Object.keys(raceKeys).map((rootKey) => ({
      id: rootKey,
      label: t(`application.review.demographics.raceOptions.${rootKey}`),
      value: rootKey,
      additionalText: rootKey.indexOf("other") >= 0,
      defaultChecked: isKeyIncluded(rootKey),
      defaultText: getCustomValue(rootKey),
      subFields: raceKeys[rootKey].map((subKey) => ({
        id: subKey,
        label: t(`application.review.demographics.raceOptions.${subKey}`),
        value: subKey,
        defaultChecked: isKeyIncluded(subKey),
        additionalText: subKey.indexOf("other") >= 0,
        defaultText: getCustomValue(subKey),
      })),
    }))
  }, [register, isKeyIncluded, getCustomValue])

  return (
    <FormsLayout>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <ApplicationFormLayout
          listingName={listing?.name}
          heading={t("application.review.demographics.title")}
          subheading={t("application.review.demographics.subTitle")}
          progressNavProps={{
            currentPageSection: currentPageSection,
            completedSections: application.completedSections,
            labels: conductor.config.sections.map((label) => t(`t.${label}`)),
            mounted: OnClientSide(),
          }}
          backLink={{
            url: conductor.determinePreviousUrl(),
          }}
          conductor={conductor}
        >
          <CardSection divider={"inset"}>
            <fieldset>
              <legend className="text__caps-spaced">
                {t("application.review.demographics.raceLabel")}
              </legend>
              <FieldGroup
                name="race"
                fields={raceOptions}
                type="checkbox"
                register={register}
                strings={{
                  description: "",
                }}
                dataTestId={"app-demographics-race"}
              />
            </fieldset>
            <div className={"pt-4"}>
              <Select
                id="ethnicity"
                name="ethnicity"
                label={t("application.review.demographics.ethnicityLabel")}
                placeholder={t("t.selectOne")}
                register={register}
                labelClassName="text__caps-spaced mb-3"
                controlClassName="control"
                options={ethnicityKeys}
                keyPrefix="application.review.demographics.ethnicityOptions"
                dataTestId={"app-demographics-ethnicity"}
              />
            </div>
          </CardSection>

          <CardSection divider={"flush"} className={"border-none"}>
            <fieldset>
              <legend className="text__caps-spaced">
                {t("application.review.demographics.howDidYouHearLabel")}
              </legend>
              <FieldGroup
                type="checkbox"
                name="howDidYouHear"
                fields={howDidYouHearOptions()}
                register={register}
                dataTestId={"app-demographics-how-did-you-hear"}
              />
            </fieldset>
          </CardSection>
        </ApplicationFormLayout>
      </Form>
    </FormsLayout>
  )
}

export default ApplicationDemographics
