/*
2.2 - Add Members
Add household members
*/
import { useRouter } from "next/router"
import {
  AppearanceStyleType,
  Button,
  FormCard,
  HouseholdMemberForm,
  ProgressNav,
  t,
  HouseholdSizeField,
  Form,
} from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import { useForm } from "react-hook-form"
import FormBackLink from "../../../src/forms/applications/FormBackLink"
import { useFormConductor } from "../../../lib/hooks"

const ApplicationAddMembers = () => {
  const { conductor, application, listing } = useFormConductor("addMembers")
  const router = useRouter()
  const currentPageSection = 2
  const householdSize = application.householdMembers.length + 1

  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { errors, handleSubmit, register, clearErrors } = useForm()
  const onSubmit = () => {
    conductor.currentStep.save({
      householdSize: application.householdMembers.length + 1,
    })
    conductor.routeToNextOrReturnUrl()
  }

  const onAddMember = () => {
    void router.push("/applications/household/member")
  }

  const applicant = application.applicant

  const editMember = (orderId: number) => {
    if (orderId != undefined && orderId >= 0) {
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
        key={member}
        memberFirstName={member.firstName}
        memberId={index}
        memberLastName={member.lastName}
        subtitle={t("application.household.householdMember")}
      />
    )
  })

  return (
    <FormsLayout>
      <FormCard header={listing?.name}>
        <ProgressNav
          currentPageSection={currentPageSection}
          completedSections={application.completedSections}
          labels={conductor.config.sections.map((label) => t(`t.${label}`))}
        />
      </FormCard>

      <FormCard>
        <FormBackLink
          url={conductor.determinePreviousUrl()}
          onClick={() => conductor.setNavigatedBack(true)}
        />

        <div className="form-card__lead border-b">
          <h2 className="form-card__title is-borderless mt-4">
            {t("application.household.addMembers.title")}
          </h2>
          {application.autofilled && (
            <p className="mt-4 field-note">{t("application.household.addMembers.doubleCheck")}</p>
          )}
        </div>

        <Form onSubmit={handleSubmit(onSubmit)}>
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
          <div className="form-card__group my-0 mx-0 pb-4 pt-4">
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
        <div className="form-card__group pt-0 mt-0">
          <div className="text-center">
            <Button id="btn-add-member" onClick={onAddMember}>
              {t("application.household.addMembers.addHouseholdMember")}
            </Button>
          </div>
        </div>
        <div className="form-card__pager">
          <div className="form-card__pager-row primary">
            <Button
              id="btn-add-done"
              styleType={AppearanceStyleType.primary}
              className=""
              onClick={() => {
                conductor.returnToReview = false
                void handleSubmit(onSubmit)()
              }}
            >
              {t("application.household.addMembers.done")}
            </Button>
          </div>

          {conductor.canJumpForwardToReview() && (
            <div className="form-card__pager-row">
              <Button
                unstyled={true}
                className="mb-4"
                onClick={() => {
                  conductor.returnToReview = true
                  void handleSubmit(onSubmit)()
                }}
              >
                {t("application.form.general.saveAndReturn")}
              </Button>
            </div>
          )}
        </div>
      </FormCard>
    </FormsLayout>
  )
}

export default ApplicationAddMembers
