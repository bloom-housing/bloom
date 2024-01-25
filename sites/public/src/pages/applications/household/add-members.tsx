import React, { useContext, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/router"
import { Button } from "@bloom-housing/ui-seeds"
import { t, Form } from "@bloom-housing/ui-components"
import { OnClientSide, PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import FormsLayout from "../../../layouts/forms"
import { HouseholdSizeField } from "../../../components/applications/HouseholdSizeField"
import { HouseholdMemberForm } from "../../../components/applications/HouseholdMemberForm"
import { useFormConductor } from "../../../lib/hooks"
import { UserStatus } from "../../../lib/constants"
import ApplicationFormLayout from "../../../layouts/application-form"

const ApplicationAddMembers = () => {
  const { profile } = useContext(AuthContext)
  const { conductor, application, listing } = useFormConductor("addMembers")
  const router = useRouter()
  const currentPageSection = 2
  const householdSize = application.householdMembers.length + 1

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { errors, handleSubmit, register, clearErrors } = useForm()
  const onSubmit = () => {
    conductor.currentStep.save({
      householdSize: application.householdMembers.length + 1,
    })
    conductor.routeToNextOrReturnUrl()
  }

  const onError = () => {
    window.scrollTo(0, 0)
  }

  const onAddMember = () => {
    void router.push("/applications/household/member")
  }

  const applicant = application.applicant

  const editMember = (orderId: number) => {
    if (orderId !== undefined && orderId >= 0) {
      void router.push({
        pathname: "/applications/household/member",
        query: { memberId: orderId },
      })
    } else {
      void router.push("/applications/contact/name")
    }
  }

  const membersSection = application.householdMembers.map((member, index) => {
    return (
      <HouseholdMemberForm
        editMember={editMember}
        key={index}
        memberFirstName={member.firstName}
        memberId={index}
        memberLastName={member.lastName}
        subtitle={t("application.household.householdMember")}
      />
    )
  })

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Application - Add household members",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  return (
    <FormsLayout>
      <Form onSubmit={handleSubmit(onSubmit, onError)}>
        <ApplicationFormLayout
          listingName={listing?.name}
          heading={t("application.household.addMembers.title")}
          subheading={
            application.autofilled ? t("application.household.addMembers.doubleCheck") : null
          }
          progressNavProps={{
            currentPageSection: currentPageSection,
            completedSections: application.completedSections,
            labels: conductor.config.sections.map((label) => t(`t.${label}`)),
            mounted: OnClientSide(),
          }}
          backLink={{
            url: conductor.determinePreviousUrl(),
          }}
        >
          <Form>
            <div>
              <HouseholdSizeField
                assistanceUrl={t("application.household.assistanceUrl")}
                clearErrors={clearErrors}
                error={errors.householdSize}
                householdSize={householdSize}
                householdSizeMax={listing?.householdSizeMax}
                householdSizeMin={listing?.householdSizeMin}
                register={register}
                validate={true}
              />
            </div>
            <div className="px-8 my-0 mx-0 pb-0 pt-0">
              <HouseholdMemberForm
                editMember={editMember}
                editMode={!application.autofilled}
                memberFirstName={applicant.firstName}
                memberLastName={applicant.lastName}
                subtitle={t("application.household.primaryApplicant")}
              />
              {membersSection}
            </div>
          </Form>
          <CardSection divider={"flush"} className={"border-none"}>
            <Button
              onClick={onAddMember}
              variant="primary-outlined"
              id={"app-add-household-member-button"}
              type={"button"}
            >
              {t("application.household.addMembers.addHouseholdMember")}
            </Button>
          </CardSection>
          <CardSection className={"bg-primary-lighter"}>
            <Button
              onClick={() => {
                conductor.returnToReview = false
                void handleSubmit(onSubmit)()
              }}
              id={"app-done-household-members-button"}
            >
              {t("t.next")}
            </Button>
          </CardSection>
        </ApplicationFormLayout>
      </Form>
    </FormsLayout>
  )
}

export default ApplicationAddMembers
