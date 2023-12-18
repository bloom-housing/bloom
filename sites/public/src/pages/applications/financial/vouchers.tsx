import React, { useContext, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Form, t, FieldGroup } from "@bloom-housing/ui-components"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import { Alert } from "@bloom-housing/ui-seeds"
import {
  OnClientSide,
  PageView,
  pushGtmEvent,
  AuthContext,
  listingSectionQuestions,
} from "@bloom-housing/shared-helpers"
import { MultiselectQuestionsApplicationSectionEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import FormsLayout from "../../../layouts/forms"
import { useFormConductor } from "../../../lib/hooks"
import { UserStatus } from "../../../lib/constants"
import ApplicationFormLayout from "../../../layouts/application-form"
import styles from "../../../layouts/application-form.module.scss"

const ApplicationVouchers = () => {
  const { profile } = useContext(AuthContext)
  const { conductor, application, listing } = useFormConductor("vouchersSubsidies")
  const currentPageSection = listingSectionQuestions(
    listing,
    MultiselectQuestionsApplicationSectionEnum.programs
  )?.length
    ? 4
    : 3

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors, getValues, trigger } = useForm({
    defaultValues: { incomeVouchers: application.incomeVouchers?.toString() },
    shouldFocusError: false,
  })

  const onSubmit = async (data) => {
    const validation = await trigger()
    if (!validation) return

    const { incomeVouchers } = data
    const toSave = { incomeVouchers: JSON.parse(incomeVouchers) }

    conductor.currentStep.save(toSave)
    conductor.routeToNextOrReturnUrl()
  }
  const onError = () => {
    window.scrollTo(0, 0)
  }

  const incomeVouchersValues = [
    {
      id: "incomeVouchersYes",
      value: "true",
      label: t("t.yes"),
    },
    {
      id: "incomeVouchersNo",
      value: "false",
      label: t("t.no"),
    },
  ]

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Application - Vouchers Subsidies",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  return (
    <FormsLayout>
      <Form onSubmit={handleSubmit(onSubmit, onError)}>
        <ApplicationFormLayout
          listingName={listing?.name}
          heading={t("application.financial.vouchers.title")}
          subheading={
            <div>
              <p className="field-note mb-4">
                <strong>{t("application.financial.vouchers.housingVouchers.strong")}</strong>
                {` ${t("application.financial.vouchers.housingVouchers.text")}`}
              </p>
              <p className="field-note mb-4">
                <strong>{t("application.financial.vouchers.nonTaxableIncome.strong")}</strong>
                {` ${t("application.financial.vouchers.nonTaxableIncome.text")}`}
              </p>
              <p className="field-note">
                <strong>{t("application.financial.vouchers.rentalSubsidies.strong")}</strong>
                {` ${t("application.financial.vouchers.rentalSubsidies.text")}`}
              </p>
            </div>
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

          <CardSection divider={"flush"} className={"border-none"}>
            <fieldset>
              <legend className="sr-only">{t("application.financial.vouchers.legend")}</legend>
              <FieldGroup
                fieldGroupClassName="grid grid-cols-1"
                fieldClassName="ml-0"
                type="radio"
                name="incomeVouchers"
                groupNote={t("t.pleaseSelectOne")}
                error={errors.incomeVouchers}
                errorMessage={t("errors.selectAnOption")}
                register={register}
                fields={incomeVouchersValues}
                dataTestId={"app-income-vouchers"}
                validation={{
                  validate: () => {
                    return !!Object.values(getValues()).filter((value) => value).length
                  },
                }}
              />
            </fieldset>
          </CardSection>
        </ApplicationFormLayout>
      </Form>
    </FormsLayout>
  )
}

export default ApplicationVouchers
