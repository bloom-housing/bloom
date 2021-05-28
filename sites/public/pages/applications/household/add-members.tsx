/*
2.2 - Add Members
Add household members
*/
import React from "react"
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
  // TODO: toggle this verification off at the jurisdiction level with a feature flag
  const shouldValidateHouseholdSize = false

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

  const membersSection = application.householdMembers.map((member) => {
    return (
      <HouseholdMemberForm
        member={member}
        key={member}
        type={t("application.household.householdMember")}
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
            {shouldValidateHouseholdSize && (
              <HouseholdSizeField
                listing={listing}
                householdSize={householdSize}
                validate={true}
                register={register}
                error={errors.householdSize}
                clearErrors={clearErrors}
                assistanceUrl={t("application.household.assistanceUrl")}
              />
            )}
          </div>
          <div className="form-card__group my-0 mx-0 pb-4 pt-4">
            <HouseholdMemberForm
              member={applicant}
              type={t("application.household.primaryApplicant")}
              editMode={!application.autofilled}
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
