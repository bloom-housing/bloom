import React, { useContext, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/router"
import { FieldGroup, t } from "@bloom-housing/ui-components"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import {
  AuthContext,
  Form,
  OnClientSide,
  PageView,
  pushGtmEvent,
} from "@bloom-housing/shared-helpers"
import FormsLayout from "../../../layouts/forms"
import { useFormConductor } from "../../../lib/hooks"
import { sharedGetStaticProps } from "../../../lib/sharedPageProps"
import { UserStatus } from "../../../lib/constants"
import ApplicationFormLayout, {
  ApplicationAlertBox,
  onFormError,
} from "../../../layouts/application-form"
import { useStopLightGate } from "../../../lib/applications/stopLights/useStopLightGate"
import { useStopLightBanners } from "../../../lib/applications/stopLights/useStopLightBanners"

const ApplicationHouseholdChanges = () => {
  const { profile } = useContext(AuthContext)
  const { conductor, application, listing } = useFormConductor("householdChanges")
  const currentPageSection = 2

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors, getValues, trigger } = useForm<Record<string, any>>({
    defaultValues: { householdExpectingChanges: application.householdExpectingChanges?.toString() },
    shouldFocusError: false,
  })
  const router = useRouter()
  const enabledRuleKeys = conductor.config.enabledStopLightRuleKeys ?? []
  const { guardSubmit, stopLights } = useStopLightGate(
    "householdChanges",
    application,
    listing,
    enabledRuleKeys,
    router.query.blockedRule as string | undefined
  )
  const { onFieldBlur } = useStopLightBanners(
    "householdChanges",
    application,
    listing,
    enabledRuleKeys,
    getValues
  )
  const onSubmit = async (data) => {
    const validation = await trigger()
    if (!validation) return
    const { householdExpectingChanges } = data
    const pendingSave = { householdExpectingChanges: householdExpectingChanges === "true" }
    guardSubmit(pendingSave, () => {
      conductor.currentStep.save(pendingSave)
      conductor.sync()
      conductor.routeToNextOrReturnUrl()
    })
  }

  const onError = () => {
    onFormError()
  }

  const householdChangesValues = [
    {
      id: "householdChangesYes",
      value: "true",
      label: t("t.yes"),
    },
    {
      id: "householdChangesNo",
      value: "false",
      label: t("t.no"),
    },
  ]

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Application - Expecting Household Changes",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  return (
    <FormsLayout
      pageTitle={`${t("application.household.expectingChanges.title")} - ${t(
        "listings.apply.applyOnline"
      )} - ${listing?.name}`}
    >
      <Form onSubmit={handleSubmit(onSubmit, onError)} onBlur={onFieldBlur}>
        <ApplicationFormLayout
          listingName={listing?.name}
          heading={t("application.household.expectingChanges.question")}
          subheading={t("application.household.genericSubtitle")}
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
          stopLights={stopLights}
        >
          <ApplicationAlertBox errors={errors} />
          <CardSection divider={"flush"} className={"border-none"}>
            <fieldset>
              <legend className="sr-only">
                {t("application.household.expectingChanges.question")}
              </legend>
              <FieldGroup
                fieldGroupClassName="grid grid-cols-1"
                fieldClassName="ml-0"
                type="radio"
                name="householdExpectingChanges"
                groupNote={t("t.pleaseSelectOne")}
                error={errors.householdExpectingChanges}
                errorMessage={t("errors.selectAnOption")}
                register={register}
                fields={householdChangesValues}
                dataTestId={"app-expecting-changes"}
                validation={{
                  validate: () => {
                    return !!Object.values(getValues()).filter((value) => value).length
                  },
                }}
              />
            </fieldset>
          </CardSection>
        </ApplicationFormLayout>
      </Form>
    </FormsLayout>
  )
}

export default ApplicationHouseholdChanges

export const getStaticProps = sharedGetStaticProps
