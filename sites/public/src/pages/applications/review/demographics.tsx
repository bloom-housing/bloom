import React, { useContext, useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"

import { Field, FieldGroup, Form, Select, t } from "@bloom-housing/ui-components"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import { MultiselectQuestionsApplicationSectionEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import {
  raceKeys,
  spokenLanguageKeys,
  isKeyIncluded,
  getCustomValue,
  howDidYouHear,
  fieldGroupObjectToArray,
  OnClientSide,
  PageView,
  pushGtmEvent,
  AuthContext,
  listingSectionQuestions,
  genderKeys,
  sexualOrientationKeys,
} from "@bloom-housing/shared-helpers"
import FormsLayout from "../../../layouts/forms"
import { useFormConductor } from "../../../lib/hooks"
import { UserStatus } from "../../../lib/constants"
import ApplicationFormLayout from "../../../layouts/application-form"

const howDidYouHearOptions = (application) => {
  return howDidYouHear?.map((item) => ({
    id: item.id,
    label: t(`application.review.demographics.howDidYouHearOptions.${item.id}`),
    defaultChecked: application.demographics.howDidYouHear?.includes(item.id),
  }))
}

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
  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      race: application.demographics.race,
    },
  })

  const spokenLanguageValue: string = watch("spokenLanguage")

  const onSubmit = (data) => {
    conductor.currentStep.save({
      demographics: {
        ethnicity: "",
        race: fieldGroupObjectToArray(data, "race"),
        spokenLanguage: data.spokenLanguage,
        spokenLanguageNotListed: data.spokenLanguageNotListed,
        gender: data.gender,
        sexualOrientation: data.sexualOrientation,
        howDidYouHear: data.howDidYouHear,
      },
    })
    conductor.routeToNextOrReturnUrl()
  }

  const raceOptions = useMemo(() => {
    return Object.keys(raceKeys).map((rootKey) => ({
      id: rootKey,
      label: t(`application.review.demographics.raceOptions.${rootKey}`),
      value: rootKey,
      additionalText: rootKey.indexOf("other") >= 0,
      defaultChecked: isKeyIncluded(rootKey, application.demographics?.race),
      defaultText: getCustomValue(rootKey, application.demographics?.race),
      subFields: raceKeys[rootKey].map((subKey) => ({
        id: subKey,
        label: t(`application.review.demographics.raceOptions.${subKey}`),
        value: subKey,
        defaultChecked: isKeyIncluded(subKey, application.demographics?.race),
        additionalText: subKey.indexOf("other") >= 0,
        defaultText: getCustomValue(subKey, application.demographics?.race),
      })),
    }))
  }, [register])

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Application - Demographics",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

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
            <div className={"pt-8"}>
              <Select
                id="spokenLanguage"
                name="spokenLanguage"
                defaultValue={application.demographics.spokenLanguage}
                label={t("application.review.demographics.spokenLanguageLabel")}
                placeholder={t("t.selectOne")}
                register={register}
                labelClassName="text__caps-spaced mb-0"
                controlClassName="control"
                options={spokenLanguageKeys}
                keyPrefix="application.review.demographics.spokenLanguageOptions"
                dataTestId={"app-demographics-spoken-language"}
              />
              {spokenLanguageValue === "notListed" && (
                <Field
                  id="spokenLanguageNotListed"
                  name="spokenLanguageNotListed"
                  label={t("application.review.demographics.genderSpecify")}
                  validation={{ required: true }}
                  register={register}
                />
              )}
            </div>
            <div className={"pt-8"}>
              <Select
                id="gender"
                name="gender"
                label={t("application.review.demographics.genderLabel")}
                defaultValue={application.demographics.gender}
                placeholder={t("t.selectOne")}
                register={register}
                labelClassName="text__caps-spaced mb-0"
                controlClassName="control"
                options={genderKeys}
                keyPrefix="application.review.demographics.genderOptions"
                dataTestId={"app-demographics-spoken-language"}
              />
            </div>
            <div className={"pt-8"}>
              <Select
                id="sexualOrientation"
                name="sexualOrientation"
                label={t("application.review.demographics.sexualOrientationLabel")}
                defaultValue={application.demographics.sexualOrientation}
                placeholder={t("t.selectOne")}
                register={register}
                labelClassName="text__caps-spaced mb-0"
                controlClassName="control"
                options={sexualOrientationKeys}
                keyPrefix="application.review.demographics.sexualOrientationOptions"
                dataTestId={"app-demographics-sexual-orientation"}
              />
            </div>
          </CardSection>

          <CardSection divider={"flush"} className="border-none">
            <fieldset>
              <legend className="text__caps-spaced">
                {t("application.review.demographics.howDidYouHearLabel")}
              </legend>
              <FieldGroup
                type="checkbox"
                name="howDidYouHear"
                fields={howDidYouHearOptions(application)}
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
