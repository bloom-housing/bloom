/*
2.1 - Live Alone
Asks whether the applicant will be adding any additional household members
*/
import React, { useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import {
  AppearanceSizeType,
  Button,
  Form,
  FormCard,
  Heading,
  ProgressNav,
  t,
} from "@bloom-housing/ui-components"
import { OnClientSide, PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import FormsLayout from "../../../layouts/forms"
import FormBackLink from "../../../components/applications/FormBackLink"
import { HouseholdSizeField } from "../../../components/applications/HouseholdSizeField"
import { useFormConductor } from "../../../lib/hooks"
import { UserStatus } from "../../../lib/constants"

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
      <FormCard header={<Heading priority={1}>{listing?.name}</Heading>}>
        <ProgressNav
          currentPageSection={currentPageSection}
          completedSections={application.completedSections}
          labels={conductor.config.sections.map((label) => t(`t.${label}`))}
          mounted={OnClientSide()}
        />
      </FormCard>
      <FormCard>
        <FormBackLink
          url={conductor.determinePreviousUrl()}
          onClick={() => conductor.setNavigatedBack(true)}
        />

        <div className="form-card__lead border-b">
          <h2 className="form-card__title is-borderless">
            {t("application.household.liveAlone.title")}
          </h2>
        </div>

        <Form className="mb-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
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

          <div className="form-card__pager">
            <div className="form-card__pager-row">
              <Button
                id="btn-live-alone"
                size={AppearanceSizeType.big}
                className="w-full md:w-3/4"
                onClick={() => {
                  application.householdSize = 1
                  application.householdMember = []
                  setValidateHousehold(true)
                }}
                data-testid={"app-household-live-alone"}
              >
                {t("application.household.liveAlone.willLiveAlone")}
              </Button>
            </div>
            <div className="form-card__pager-row">
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
            </div>
          </div>
        </Form>
      </FormCard>
    </FormsLayout>
  )
}

export default ApplicationLiveAlone
