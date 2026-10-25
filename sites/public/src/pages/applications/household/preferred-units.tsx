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
  createUnitTypeId,
  getUniqueUnitGroupUnitTypes,
  getUniqueUnitTypes,
  pushGtmEvent,
} from "@bloom-housing/shared-helpers"
import {
  Application,
  FeatureFlagEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { isFeatureFlagOn } from "../../../lib/helpers"
import { useFormConductor } from "../../../lib/hooks"
import { sharedGetStaticProps } from "../../../lib/sharedPageProps"
import { UserStatus } from "../../../lib/constants"
import ApplicationFormLayout, {
  ApplicationAlertBox,
  onFormError,
} from "../../../layouts/application-form"
import FormsLayout from "../../../layouts/forms"
import { useStopLightGate } from "../../../lib/applications/stopLights/useStopLightGate"
import { useStopLightBanners } from "../../../lib/applications/stopLights/useStopLightBanners"

const ApplicationPreferredUnits = () => {
  const { profile } = useContext(AuthContext)
  const { conductor, application, listing } = useFormConductor("preferredUnitSize")
  const currentPageSection = 2

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors, trigger, getValues } = useForm()
  const router = useRouter()
  const enabledRuleKeys = conductor.config.enabledStopLightRuleKeys ?? []
  const { guardSubmit, stopLights } = useStopLightGate(
    "preferredUnitSize",
    application,
    listing,
    enabledRuleKeys,
    router.query.blockedRule as string | undefined
  )
  const { onFieldBlur } = useStopLightBanners(
    "preferredUnitSize",
    application,
    listing,
    enabledRuleKeys,
    getValues
  )

  const enableUnitGroups = isFeatureFlagOn(conductor.config, FeatureFlagEnum.enableUnitGroups)

  const onSubmit = async (data) => {
    const validation = await trigger()
    if (!validation) return
    const { preferredUnit } = data

    // save units always as an array (when is only one option, react-hook-form stores an option as string)
    const preferredUnitTypes = createUnitTypeId(
      Array.isArray(preferredUnit) ? preferredUnit : [preferredUnit]
    )

    const pendingSave = { preferredUnitTypes } as Partial<Application>
    guardSubmit(pendingSave, () => {
      application.preferredUnitTypes = preferredUnitTypes
      conductor.sync()
      conductor.routeToNextOrReturnUrl()
    })
  }
  const onError = () => {
    onFormError()
  }

  const unitTypes = enableUnitGroups
    ? getUniqueUnitGroupUnitTypes(listing?.unitGroups, listing?.listingType)
    : getUniqueUnitTypes(listing?.units)

  const preferredUnitOptions = unitTypes?.map((item) => ({
    id: item.id,
    label: t(`application.household.preferredUnit.options.${item.name}`),
    value: item.id,
    defaultChecked: !!application.preferredUnitTypes?.find((unit) => unit.id === item.id),
    dataTestId: t(`application.household.preferredUnit.options.${item.name}`),
  }))

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Application - Preferred Unit Size",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  return (
    <FormsLayout
      pageTitle={`${t("application.household.preferredUnit.preferredUnitType")} - ${t(
        "listings.apply.applyOnline"
      )} - ${listing?.name}`}
    >
      <Form onSubmit={handleSubmit(onSubmit, onError)} onBlur={onFieldBlur}>
        <ApplicationFormLayout
          listingName={listing?.name}
          heading={t("application.household.preferredUnit.title")}
          subheading={t("application.household.preferredUnit.subTitle")}
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
              <legend className="sr-only">{t("application.household.preferredUnit.legend")}</legend>
              <FieldGroup
                type="checkbox"
                fieldGroupClassName="grid grid-cols-1"
                fieldClassName="ml-0"
                name="preferredUnit"
                groupNote={t("application.household.preferredUnit.optionsLabel")}
                fields={preferredUnitOptions}
                error={!!errors.preferredUnit}
                errorMessage={t("errors.selectAtLeastOne")}
                validation={{ required: true }}
                register={register}
                dataTestId={"app-preferred-units"}
              />
            </fieldset>
          </CardSection>
        </ApplicationFormLayout>
      </Form>
    </FormsLayout>
  )
}

export default ApplicationPreferredUnits

export const getStaticProps = sharedGetStaticProps
