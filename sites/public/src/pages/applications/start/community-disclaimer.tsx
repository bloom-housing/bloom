import { AuthContext, OnClientSide, PageView, pushGtmEvent } from "@bloom-housing/shared-helpers"
import { Form, t } from "@bloom-housing/ui-components"
import React, { useContext, useEffect } from "react"

import ApplicationFormLayout from "../../../layouts/application-form"
import styles from "../../../layouts/application-form.module.scss"
import { Button } from "@bloom-housing/ui-seeds"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import FormsLayout from "../../../layouts/forms"
import { UserStatus } from "../../../lib/constants"
import { useForm } from "react-hook-form"
import { useFormConductor } from "../../../lib/hooks"

const ApplicationCommunityDisclaimer = () => {
  const { profile } = useContext(AuthContext)
  const { conductor, application, listing } = useFormConductor("communityDisclaimer")
  const currentPageSection = 1

  const { handleSubmit } = useForm()
  const onSubmit = () => {
    conductor.routeToNextOrReturnUrl()
  }

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Application - Community Disclaimer",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  return (
    <FormsLayout
      pageTitle={`${t("pageTitle.communityDisclaimer")} - ${t("listings.apply.applyOnline")} - ${
        listing?.name
      }`}
    >
      <ApplicationFormLayout
        listingName={listing?.name}
        heading={listing?.communityDisclaimerTitle ?? ""}
        progressNavProps={{
          currentPageSection: currentPageSection,
          completedSections: application.completedSections,
          labels: conductor.config.sections.map((label) => t(`t.${label}`)),
          mounted: OnClientSide(),
        }}
        backLink={{
          url: `/applications/start/choose-language?listingId=${listing?.id}`,
        }}
      >
        <CardSection>
          <div>{listing?.communityDisclaimerDescription}</div>
          <br />
          <br />
        </CardSection>

        <CardSection className={styles["application-form-action-footer"]}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Button type="submit" variant="primary" id="app-next-step-button">
              {t("t.next")}
            </Button>
          </Form>
        </CardSection>
      </ApplicationFormLayout>
    </FormsLayout>
  )
}

export default ApplicationCommunityDisclaimer
