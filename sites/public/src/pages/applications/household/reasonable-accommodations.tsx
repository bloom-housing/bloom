import React, { useContext, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Form, t, Textarea } from "@bloom-housing/ui-components"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import { OnClientSide, PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import FormsLayout from "../../../layouts/forms"
import { useFormConductor } from "../../../lib/hooks"
import { UserStatus } from "../../../lib/constants"
import ApplicationFormLayout from "../../../layouts/application-form"

const ApplicationReasonableAccommodations = () => {
  const { profile } = useContext(AuthContext)
  const { conductor, application, listing } = useFormConductor("reasonableAccommodations")
  const currentPageSection = 2

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit } = useForm<Record<string, string>>({
    defaultValues: {
      reasonableAccommodations: application.reasonableAccommodations || "",
    },
  })

  const onSubmit = (data) => {
    conductor.currentStep.save({
      reasonableAccommodations: data.reasonableAccommodations,
    })
    conductor.sync()
    conductor.routeToNextOrReturnUrl()
  }

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Application - Reasonable Accommodations",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  return (
    <FormsLayout
      pageTitle={`${t("pageTitle.reasonableAccommodations")} - ${t(
        "listings.apply.applyOnline"
      )} - ${listing?.name}`}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <ApplicationFormLayout
          listingName={listing?.name}
          heading={t("application.household.reasonableAccommodations.question")}
          subheading={t("application.household.reasonableAccommodations.subtitle")}
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
          <CardSection divider={"flush"} className={"border-none"}>
            <Textarea
              id="reasonableAccommodations"
              name="reasonableAccommodations"
              label={t("application.household.reasonableAccommodations.label")}
              register={register}
              fullWidth={true}
              maxLength={1000}
              placeholder={""}
              dataTestId="app-reasonable-accommodations"
            />
          </CardSection>
        </ApplicationFormLayout>
      </Form>
    </FormsLayout>
  )
}

export default ApplicationReasonableAccommodations
