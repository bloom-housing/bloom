import React, { ChangeEvent, useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { FieldGroup, Form, t } from "@bloom-housing/ui-components"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import { Alert } from "@bloom-housing/ui-seeds"
import { OnClientSide, PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import FormsLayout from "../../../layouts/forms"
import { HouseholdSizeField } from "../../../components/applications/HouseholdSizeField"
import { useFormConductor } from "../../../lib/hooks"
import { UserStatus } from "../../../lib/constants"
import ApplicationFormLayout from "../../../layouts/application-form"
import styles from "../../../layouts/application-form.module.scss"

const ApplicationLiveAlone = () => {
  const { profile } = useContext(AuthContext)
  const { conductor, application, listing } = useFormConductor("liveAlone")
  const [validateHousehold, setValidateHousehold] = useState(true)
  const currentPageSection = 2

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { handleSubmit, register, errors, clearErrors, trigger } = useForm()

  const onSubmit = async () => {
    const validation = await trigger()
    if (!validation) return
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

  const householdSizeValues = [
    {
      id: "householdSizeLiveAlone",
      value: "liveAlone",
      label: t("application.household.liveAlone.willLiveAlone"),
      dataTestId: "app-household-live-alone",
    },
    {
      id: "householdSizeLiveWithOthers",
      value: "withOthers",
      label: t("application.household.liveAlone.liveWithOtherPeople"),
      dataTestId: "app-household-with-others",
    },
  ]

  return (
    <FormsLayout
      pageTitle={`${t("pageTitle.liveAlone")} - ${t("listings.apply.applyOnline")} - ${
        listing?.name
      }`}
    >
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
          {Object.entries(errors).length > 0 && (
            <Alert
              className={styles["message-inside-card"]}
              variant="alert"
              fullwidth
              id={"application-alert-box"}
            >
              {t("errors.errorsToResolve")}
            </Alert>
          )}
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

          <CardSection divider={"flush"} className={"border-none"}>
            <fieldset
              onChange={(event: ChangeEvent<any>) => {
                if (event.target.value === "liveAlone") {
                  application.householdSize = 1
                  application.householdMember = []
                  setValidateHousehold(true)
                } else {
                  if (application.householdSize === 1) application.householdSize = 0
                  setValidateHousehold(false)
                }
              }}
            >
              <legend className={`text__caps-spaced ${errors?.type ? "text-alert" : ""}`}>
                {t("application.household.householdMembers")}
              </legend>
              <p className="field-note mb-4">{t("t.pleaseSelectOne")}</p>
              <FieldGroup
                type="radio"
                name="householdSize"
                error={errors.householdSize}
                errorMessage={t("errors.selectOption")}
                register={register}
                validation={{ required: true }}
                fields={householdSizeValues}
                fieldGroupClassName="grid grid-cols-1"
                fieldClassName="ml-0"
              />
            </fieldset>
          </CardSection>
        </ApplicationFormLayout>
      </Form>
    </FormsLayout>
  )
}

export default ApplicationLiveAlone
