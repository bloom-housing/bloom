import React, { useContext, useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import { Field, FieldGroup, Form, Select, t } from "@bloom-housing/ui-components"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import {
  FeatureFlagEnum,
  MultiselectQuestionsApplicationSectionEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import {
  ethnicityKeys,
  isKeyIncluded,
  getCustomValue,
  howDidYouHear,
  fieldGroupObjectToArray,
  OnClientSide,
  PageView,
  pushGtmEvent,
  AuthContext,
  listingSectionQuestions,
  limitedHowDidYouHear,
  getRaceEthnicityOptions,
} from "@bloom-housing/shared-helpers"
import FormsLayout from "../../../layouts/forms"
import { isFeatureFlagOn } from "../../../lib/helpers"
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
  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      ethnicity: application.demographics.ethnicity,
      race: application.demographics.race,
    },
  })

  const spokenLanguageValue: string = watch(
    "spokenLanguage",
    application.demographics?.spokenLanguage
  )

  const onSubmit = (data) => {
    conductor.currentStep.save({
      demographics: {
        ethnicity: data.ethnicity || "",
        gender: "",
        sexualOrientation: "",
        howDidYouHear: data.howDidYouHear,
        race: fieldGroupObjectToArray(data, "race"),
        spokenLanguage:
          data.spokenLanguage === "notListed"
            ? `${data.spokenLanguage}:${data.spokenLanguageNotListed}`
            : data.spokenLanguage,
      },
    })
    conductor.routeToNextOrReturnUrl()
  }

  const enableLimitedHowDidYouHear = isFeatureFlagOn(
    conductor.config,
    FeatureFlagEnum.enableLimitedHowDidYouHear
  )

  const disableEthnicityQuestion = isFeatureFlagOn(
    conductor.config,
    FeatureFlagEnum.disableEthnicityQuestion
  )

  const enableSpokenLanguage = isFeatureFlagOn(
    conductor.config,
    FeatureFlagEnum.enableSpokenLanguage
  )

  const getSpokenLanguageOptions = () => {
    // Use jurisdiction-specific config if available, otherwise fall back to all keys
    const availableLanguages =
      conductor.config.visibleSpokenLanguages && conductor.config.visibleSpokenLanguages.length > 0
        ? conductor.config.visibleSpokenLanguages
        : []
    return availableLanguages
  }

  const howDidYouHearOptions = () => {
    return (enableLimitedHowDidYouHear ? limitedHowDidYouHear : howDidYouHear)?.map((item) => ({
      id: item.id,
      label: t(`application.review.demographics.howDidYouHearOptions.${item.id}`),
      defaultChecked: application.demographics.howDidYouHear?.includes(item.id),
      register,
    }))
  }

  const raceOptions = useMemo(() => {
    const raceKeys = getRaceEthnicityOptions(conductor.config.raceEthnicityConfiguration)
    if (!raceKeys) return []
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
        dataTestId: subKey,
      })),
      dataTestId: rootKey,
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [register])

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Application - Demographics",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  const showRaceQuestion = raceOptions.length > 0

  return (
    <FormsLayout
      pageTitle={`${t("pageTitle.demographics")} - ${t("listings.apply.applyOnline")} - ${
        listing?.name
      }`}
    >
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
            {showRaceQuestion && (
              <fieldset>
                <legend className="text__caps-spaced">
                  {!disableEthnicityQuestion
                    ? t("application.review.demographics.raceLabelNoEthnicity")
                    : t("application.review.demographics.raceLabel")}
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
            )}
            {!disableEthnicityQuestion && (
              <div className={`${showRaceQuestion ? "pt-4" : ""}`}>
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
            )}
            {enableSpokenLanguage && conductor.config?.visibleSpokenLanguages?.length > 0 && (
              <div className={"pt-8"}>
                <Select
                  id="spokenLanguage"
                  name="spokenLanguage"
                  defaultValue={
                    application.demographics.spokenLanguage?.includes("notListed")
                      ? "notListed"
                      : application.demographics.spokenLanguage
                  }
                  label={t("application.review.demographics.spokenLanguageLabel")}
                  placeholder={t("t.selectOne")}
                  register={register}
                  labelClassName="text__caps-spaced mb-0"
                  controlClassName="control"
                  options={getSpokenLanguageOptions()}
                  keyPrefix="application.review.demographics.spokenLanguageOptions"
                  dataTestId={"app-demographics-spoken-language"}
                />
                {spokenLanguageValue?.includes("notListed") && (
                  <Field
                    id="spokenLanguageNotListed"
                    name="spokenLanguageNotListed"
                    defaultValue={
                      application.demographics.spokenLanguage?.includes("notListed")
                        ? application.demographics.spokenLanguage.split(":")[1]
                        : undefined
                    }
                    label={t("application.review.demographics.spokenLanguageSpecify")}
                    validation={{ required: true }}
                    register={register}
                  />
                )}
              </div>
            )}
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
