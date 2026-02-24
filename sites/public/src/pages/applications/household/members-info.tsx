import React, { useContext, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/router"
import { Form, t } from "@bloom-housing/ui-components"
import { OnClientSide, PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import FormsLayout from "../../../layouts/forms"
import { useFormConductor } from "../../../lib/hooks"
import { UserStatus } from "../../../lib/constants"
import ApplicationFormLayout, {
  ApplicationAlertBox,
  onFormError,
} from "../../../layouts/application-form"

const ApplicationMembersInfo = () => {
  const { profile } = useContext(AuthContext)
  const { conductor, application, listing } = useFormConductor("householdMemberInfo")
  const router = useRouter()
  const currentPageSection = 2

  const { handleSubmit, errors } = useForm({
    shouldFocusError: false,
  })
  const onSubmit = () => {
    void router.push("/applications/household/add-members")
  }

  const onError = () => {
    onFormError()
  }

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Application - Household Member Info",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  return (
    <FormsLayout
      pageTitle={`${t("pageTitle.householdMembersNotice")} - ${t("listings.apply.applyOnline")} - ${
        listing?.name
      }`}
    >
      <Form onSubmit={handleSubmit(onSubmit, onError)}>
        <ApplicationFormLayout
          listingName={listing?.name}
          heading={t("application.household.membersInfo.title")}
          progressNavProps={{
            currentPageSection: currentPageSection,
            completedSections: application.completedSections,
            labels: conductor.config.sections.map((label) => t(`t.${label}`)),
            mounted: OnClientSide(),
          }}
          conductor={conductor}
          backLink={{
            url: conductor.determinePreviousUrl(),
          }}
          hideBorder={true}
        >
          <ApplicationAlertBox errors={errors} />
        </ApplicationFormLayout>
      </Form>
    </FormsLayout>
  )
}

export default ApplicationMembersInfo
