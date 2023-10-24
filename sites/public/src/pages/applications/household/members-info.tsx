/*
2.1a - Member Info
A notice regarding adding household members
*/
import React, { useContext, useEffect } from "react"
import { useRouter } from "next/router"
import {
  AppearanceStyleType,
  AlertBox,
  Button,
  Form,
  FormCard,
  t,
} from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import { useForm } from "react-hook-form"
import { useFormConductor } from "../../../lib/hooks"
import { OnClientSide, PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import { UserStatus } from "../../../lib/constants"
import ApplicationFormLayout from "../../../layouts/application-form"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"

const ApplicationMembersInfo = () => {
  const { profile } = useContext(AuthContext)
  const { conductor, application, listing } = useFormConductor("householdMemberInfo")
  const router = useRouter()
  const currentPageSection = 2

  /* Form Handler */
  const { handleSubmit, errors } = useForm({
    shouldFocusError: false,
  })
  const onSubmit = () => {
    void router.push("/applications/household/add-members")
  }

  const onError = () => {
    window.scrollTo(0, 0)
  }

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Application - Household Member Info",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  return (
    <FormsLayout>
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
        >
          {Object.entries(errors).length > 0 && (
            <AlertBox type="alert" inverted closeable>
              {t("errors.errorsToResolve")}
            </AlertBox>
          )}
        </ApplicationFormLayout>
      </Form>
    </FormsLayout>
  )
}

export default ApplicationMembersInfo
