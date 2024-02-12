import React, { useContext, useEffect } from "react"
import { useForm } from "react-hook-form"

import { FieldGroup, Form, Select, t } from "@bloom-housing/ui-components"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import { ApplicationSection } from "@bloom-housing/backend-core"
import {
  raceKeys,
  spokenLanguageKeys,
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

const ApplicationDemographics = () => {
  const { profile } = useContext(AuthContext)
  const { conductor, application, listing } = useFormConductor("demographics")
  let currentPageSection = 4
  if (listingSectionQuestions(listing, ApplicationSection.programs)?.length) currentPageSection += 1
  if (listingSectionQuestions(listing, ApplicationSection.preferences)?.length)
    currentPageSection += 1

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit } = useForm({
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
                fields={Object.keys(raceKeys).map((rootKey) => ({
                  id: rootKey,
                  label: t(`application.review.demographics.raceOptions.${rootKey}`),
                  value: rootKey,
                  additionalText: rootKey.indexOf("other") >= 0,
                  defaultChecked: application[`race-${rootKey}`],
                  subFields: raceKeys[rootKey].map((subKey) => ({
                    id: subKey,
                    label: t(`application.review.demographics.raceOptions.${subKey}`),
                    value: subKey,
                    defaultChecked: application[`race-${subKey}`],
                    additionalText: subKey.indexOf("other") >= 0,
                  })),
                }))}
                strings={{
                  description: "",
                }}
                type="checkbox"
                dataTestId={"app-demographics-race"}
                register={register}
              />
            </fieldset>
            <div className={"pt-4"}>
              <Select
                id="spokenLanguage"
                name="spokenLanguage"
                label={t("application.review.demographics.spokenLanguageLabel")}
                placeholder={t("t.selectOne")}
                register={register}
                labelClassName="text__caps-spaced mb-3"
                controlClassName="control"
                options={spokenLanguageKeys}
                keyPrefix="application.review.demographics.spokenLanguageOptions"
                dataTestId={"app-demographics-spoken-language"}
              />
            </div>
            <div className={"pt-4"}>
              <Select
                id="gender"
                name="gender"
                label={t("application.review.demographics.genderLabel")}
                placeholder={t("t.selectOne")}
                register={register}
                labelClassName="text__caps-spaced mb-3"
                controlClassName="control"
                options={genderKeys}
                keyPrefix="application.review.demographics.genderOptions"
                dataTestId={"app-demographics-spoken-language"}
              />
            </div>
            <div className={"pt-4"}>
              <Select
                id="sexualOrientation"
                name="sexualOrientation"
                label={t("application.review.demographics.sexualOrientationLabel")}
                placeholder={t("t.selectOne")}
                register={register}
                labelClassName="text__caps-spaced mb-3"
                controlClassName="control"
                options={sexualOrientationKeys}
                keyPrefix="application.review.demographics.sexualOrientationOptions"
                dataTestId={"app-demographics-sexual-orientation"}
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
