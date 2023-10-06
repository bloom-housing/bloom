/*
2.1 - Live Alone
Asks whether the applicant will be adding any additional household members
*/
import React, { useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
<<<<<<< HEAD
import { Button } from "@bloom-housing/ui-seeds"
import { Form, FormCard, Heading, ProgressNav, t } from "@bloom-housing/ui-components"
=======
import { AppearanceSizeType, Button, Form, t } from "@bloom-housing/ui-components"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
>>>>>>> 4db8b8e45 (refactor: more card uptake)
import { OnClientSide, PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import FormsLayout from "../../../layouts/forms"
import { HouseholdSizeField } from "../../../components/applications/HouseholdSizeField"
import { useFormConductor } from "../../../lib/hooks"
import { UserStatus } from "../../../lib/constants"
import ApplicationFormLayout from "../../../layouts/application-form"

const ApplicationLiveAlone = () => {
  const { profile } = useContext(AuthContext)
  const { conductor, application, listing } = useFormConductor("liveAlone")
  const [validateHousehold, setValidateHousehold] = useState(true)
  const currentPageSection = 2

  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { handleSubmit, register, errors, clearErrors } = useForm()
  const onSubmit = () => {
    conductor.sync()
    conductor.routeToNextOrReturnUrl()
  }

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Application - Live Alone",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  return (
    <FormsLayout>
      <Form className="mb-4" onSubmit={handleSubmit(onSubmit)}>
        <ApplicationFormLayout
          listingName={listing?.name}
          heading={t("application.household.liveAlone.title")}
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
          <div>
            <HouseholdSizeField
              assistanceUrl={t("application.household.assistanceUrl")}
              clearErrors={clearErrors}
              error={errors.householdSize}
              householdSize={application.householdSize}
              householdSizeMax={listing?.householdSizeMax}
              householdSizeMin={listing?.householdSizeMin}
              register={register}
              validate={validateHousehold}
            />
          </div>

<<<<<<< HEAD
          <div className="form-card__pager">
            <div className="form-card__pager-row">
              <Button
                type="submit"
                id="btn-live-alone"
                variant="primary-outlined"
                size="lg"
                className="w-full md:w-3/4"
                onClick={() => {
                  application.householdSize = 1
                  application.householdMembers = []
                  setValidateHousehold(true)
                }}
              >
                {t("application.household.liveAlone.willLiveAlone")}
              </Button>
            </div>
            <div className="form-card__pager-row">
              <Button
                type="submit"
                id="btn-with-people"
                variant="primary-outlined"
                size="lg"
                className="w-full md:w-3/4"
                onClick={() => {
                  if (application.householdSize === 1) application.householdSize = 0
                  setValidateHousehold(false)
                }}
              >
                {t("application.household.liveAlone.liveWithOtherPeople")}
              </Button>
            </div>
          </div>
        </Form>
      </FormCard>
=======
          <CardSection divider={"flush"} className={"border-none"}>
            <Button
              id="btn-live-alone"
              size={AppearanceSizeType.big}
              className="w-full md:w-3/4 mb-4"
              onClick={() => {
                application.householdSize = 1
                application.householdMembers = []
                setValidateHousehold(true)
              }}
              data-testid={"app-household-live-alone"}
            >
              {t("application.household.liveAlone.willLiveAlone")}
            </Button>
            <Button
              id="btn-with-people"
              size={AppearanceSizeType.big}
              className="w-full md:w-3/4"
              onClick={() => {
                if (application.householdSize === 1) application.householdSize = 0
                setValidateHousehold(false)
              }}
              data-testid={"app-household-live-with-others"}
            >
              {t("application.household.liveAlone.liveWithOtherPeople")}
            </Button>
          </CardSection>
        </ApplicationFormLayout>
      </Form>
>>>>>>> 4db8b8e45 (refactor: more card uptake)
    </FormsLayout>
  )
}

export default ApplicationLiveAlone
