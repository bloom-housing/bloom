import React, { useContext, useEffect } from "react"
import { useForm } from "react-hook-form"
import { t, FieldGroup } from "@bloom-housing/ui-components"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import {
  AuthContext,
  Form,
  OnClientSide,
  PageView,
  listingSectionQuestions,
  pushGtmEvent,
} from "@bloom-housing/shared-helpers"
import {
  FeatureFlagEnum,
  MultiselectQuestionsApplicationSectionEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import FormsLayout from "../../../layouts/forms"
import { useFormConductor } from "../../../lib/hooks"
import { UserStatus } from "../../../lib/constants"
import ApplicationFormLayout, {
  ApplicationAlertBox,
  onFormError,
} from "../../../layouts/application-form"
import { isFeatureFlagOn } from "../../../lib/helpers"

const ApplicationVouchers = () => {
  const { profile } = useContext(AuthContext)
  const { conductor, application, listing } = useFormConductor("vouchersSubsidies")
  const currentPageSection = listingSectionQuestions(
    listing,
    MultiselectQuestionsApplicationSectionEnum.programs
  )?.length
    ? 4
    : 3

  const enableSection8vsRentalAssistance = isFeatureFlagOn(
    conductor.config,
    FeatureFlagEnum.enableSection8vsRentalAssistance
  )

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors, getValues, trigger } = useForm({
    defaultValues: enableSection8vsRentalAssistance
      ? {
          incomeVouchers: application.incomeVouchers ?? [],
        }
      : {
          incomeVouchers: application.incomeVouchers?.length ? "true" : undefined,
        },
    shouldFocusError: false,
  })

  const onSubmit = async (data) => {
    const validation = await trigger()
    if (!validation) return

    let toSave: { incomeVouchers: string[] }
    if (enableSection8vsRentalAssistance) {
      const selected = Object.entries(data)
        .filter(([key, val]) => key.startsWith("incomeVouchers.") && val === true)
        .map(([key]) => key.replace("incomeVouchers.", ""))
      toSave = { incomeVouchers: selected }
    } else {
      const { incomeVouchers } = data
      toSave = { incomeVouchers: JSON.parse(incomeVouchers) ? ["incomeVoucher"] : [] }
    }

    conductor.currentStep.save(toSave)
    conductor.routeToNextOrReturnUrl()
  }
  const onError = () => {
    onFormError()
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

  const incomeVouchersCheckboxValues = [
    {
      id: "incomeVouchers.issuedVouchers",
      value: "issuedVouchers",
      label: t("application.financial.vouchers.issuedVouchers"),
      defaultChecked: application.incomeVouchers?.includes("issuedVouchers"),
    },
    {
      id: "incomeVouchers.rentalAssistance",
      value: "rentalAssistance",
      label: t("application.financial.vouchers.rentalAssistance"),
      defaultChecked: application.incomeVouchers?.includes("rentalAssistance"),
    },
    {
      id: "incomeVouchers.none",
      value: "none",
      label: t("application.financial.vouchers.none"),
      defaultChecked:
        !application.incomeVouchers?.includes("issuedVouchers") &&
        !application.incomeVouchers?.includes("rentalAssistance"),
      exclusive: true,
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
    <FormsLayout
      pageTitle={`${t("pageTitle.vouchersAndSubsidies")} - ${t("listings.apply.applyOnline")} - ${
        listing?.name
      }`}
    >
      <Form onSubmit={handleSubmit(onSubmit, onError)}>
        <ApplicationFormLayout
          listingName={listing?.name}
          heading={t("application.financial.vouchers.title")}
          subheading={
            !enableSection8vsRentalAssistance ? (
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
            ) : undefined
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
          <ApplicationAlertBox errors={errors} />
          <CardSection divider={"flush"} className={"border-none"}>
            <fieldset>
              <legend className="sr-only">{t("application.financial.vouchers.legend")}</legend>
              {enableSection8vsRentalAssistance ? (
                <FieldGroup
                  fieldGroupClassName="grid grid-cols-1"
                  fieldClassName="ml-0"
                  type="checkbox"
                  name="incomeVouchers"
                  error={errors.incomeVouchers}
                  errorMessage={t("errors.selectAnOption")}
                  register={register}
                  fields={incomeVouchersCheckboxValues}
                  dataTestId={"app-income-vouchers"}
                  validation={{
                    validate: () => {
                      const values = getValues()
                      const anyChecked = incomeVouchersCheckboxValues.some(
                        (f) => values[`incomeVouchers.${f.value}`]
                      )
                      return anyChecked
                    },
                  }}
                />
              ) : (
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
              )}
            </fieldset>
          </CardSection>
        </ApplicationFormLayout>
      </Form>
    </FormsLayout>
  )
}

export default ApplicationVouchers
