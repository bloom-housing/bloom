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

  const enableMultiselectVoucherQuestion = isFeatureFlagOn(
    conductor.config,
    FeatureFlagEnum.enableMultiselectVoucherQuestion
  )

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors, getValues, trigger, setValue } = useForm({
    defaultValues: enableMultiselectVoucherQuestion
      ? {
          incomeVouchers: application.incomeVouchers ?? [],
        }
      : {
          incomeVouchers: application.incomeVouchers?.includes("incomeVoucher")
            ? "incomeVoucher"
            : application.incomeVouchers?.includes("none")
            ? "none"
            : undefined,
        },
    shouldFocusError: false,
  })

  const onSubmit = async (data) => {
    const validation = await trigger()
    if (!validation) return

    let toSave: { incomeVouchers: string[] }
    if (enableMultiselectVoucherQuestion) {
      const selected = Object.values(data).filter((val) => val !== false)
      toSave = { incomeVouchers: selected as string[] }
    } else {
      toSave = { incomeVouchers: data?.incomeVouchers ? [data.incomeVouchers] : [] }
    }

    conductor.currentStep.save(toSave)
    conductor.routeToNextOrReturnUrl()
  }
  const onError = () => {
    onFormError()
  }

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
          heading={
            !enableMultiselectVoucherQuestion
              ? t("application.financial.vouchers.title")
              : t("application.financial.vouchers.titleAlt")
          }
          subheading={
            !enableMultiselectVoucherQuestion ? (
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
            ) : (
              `${t("application.financial.vouchers.subtitleAlt")}`
            )
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
              {enableMultiselectVoucherQuestion ? (
                <FieldGroup
                  fieldGroupClassName="grid grid-cols-1"
                  fieldClassName="ml-0"
                  type="checkbox"
                  name="incomeVouchers"
                  errorMessage={t("errors.selectAnOption")}
                  register={register}
                  validation={{
                    validate: () => {
                      return !!Object.values(getValues()).filter((value) => value).length
                    },
                  }}
                  error={
                    Object.keys(errors).length === Object.keys(getValues()).length &&
                    Object.keys(getValues()).length > 0
                  }
                  fields={[
                    {
                      id: "issuedVouchers",
                      value: "issuedVouchers",
                      label: t("application.financial.vouchers.issuedVouchers"),
                      defaultChecked: application.incomeVouchers?.includes("issuedVouchers"),
                      uniqueName: true,
                      inputProps: {
                        onChange: (e) => {
                          if (e.target.checked) {
                            setValue("incomeVouchers-none", false)
                            setValue("incomeVouchers-issuedVouchers", true)
                          }
                        },
                      },
                    },
                    {
                      id: "rentalAssistance",
                      value: "rentalAssistance",
                      label: t("application.financial.vouchers.rentalAssistance"),
                      defaultChecked: application.incomeVouchers?.includes("rentalAssistance"),
                      uniqueName: true,
                      inputProps: {
                        onChange: (e) => {
                          if (e.target.checked) {
                            setValue("incomeVouchers-none", false)
                            setValue("incomeVouchers-rentalAssistance", true)
                          }
                        },
                      },
                    },
                    {
                      id: "none",
                      value: "none",
                      label: t("application.financial.vouchers.none"),
                      defaultChecked:
                        application.incomeVouchers?.length > 0 &&
                        !application.incomeVouchers?.includes("issuedVouchers") &&
                        !application.incomeVouchers?.includes("rentalAssistance"),
                      uniqueName: true,
                      inputProps: {
                        onChange: (e) => {
                          if (e.target.checked) {
                            setValue("incomeVouchers-none", true)
                            setValue("incomeVouchers-issuedVouchers", false)
                            setValue("incomeVouchers-rentalAssistance", false)
                          }
                        },
                      },
                    },
                  ]}
                  dataTestId={"app-income-vouchers"}
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
                  fields={[
                    {
                      id: "incomeVouchersYes",
                      value: "incomeVoucher",
                      label: t("t.yes"),
                      defaultChecked: application.incomeVouchers?.includes("incomeVoucher"),
                    },
                    {
                      id: "incomeVouchersNo",
                      value: "none",
                      label: t("t.no"),
                      defaultChecked: application.incomeVouchers?.includes("none"),
                    },
                  ]}
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
