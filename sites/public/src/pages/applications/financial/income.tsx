import React, { useContext, useEffect, useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { AlertBox, AlertNotice, Field, FieldGroup, Form, t } from "@bloom-housing/ui-components"
import { Alert } from "@bloom-housing/ui-seeds"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import {
  OnClientSide,
  PageView,
  pushGtmEvent,
  AuthContext,
  listingSectionQuestions,
} from "@bloom-housing/shared-helpers"
import {
  Listing,
  MultiselectQuestionsApplicationSectionEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import FormsLayout from "../../../layouts/forms"
import { useFormConductor } from "../../../lib/hooks"
import { UserStatus } from "../../../lib/constants"
import ApplicationFormLayout from "../../../layouts/application-form"
import styles from "../../../layouts/application-form.module.scss"

type IncomeError = "low" | "high" | null
type IncomePeriod = "perMonth" | "perYear"

function verifyIncome(listing: Listing, income: number, period: IncomePeriod): IncomeError {
  // Look through all the units on this listing to see what the absolute max/min income requirements are.
  const [annualMin, annualMax, monthlyMin] = listing.units.reduce(
    ([aMin, aMax, mMin], unit) => [
      Math.min(aMin, parseFloat(unit.annualIncomeMin)),
      Math.max(aMax, parseFloat(unit.annualIncomeMax)),
      Math.min(mMin, parseFloat(unit.monthlyIncomeMin)),
    ],
    [Infinity, 0, Infinity]
  )

  // For now, transform the annual max into a monthly max (DB records for Units don't have this value)
  const monthlyMax = annualMax / 12.0

  const compareMin = period === "perMonth" ? monthlyMin : annualMin
  const compareMax = period === "perMonth" ? monthlyMax : annualMax

  if (income < compareMin) {
    return "low"
  } else if (income > compareMax) {
    return "high"
  }
  return null
}

const ApplicationIncome = () => {
  const { profile } = useContext(AuthContext)
  const { conductor, application, listing } = useFormConductor("income")
  const [incomeError, setIncomeError] = useState<IncomeError>(null)
  const currentPageSection = listingSectionQuestions(
    listing,
    MultiselectQuestionsApplicationSectionEnum.programs
  )?.length
    ? 4
    : 3

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors, getValues, setValue, trigger } = useForm({
    defaultValues: {
      income: application.income,
      incomePeriod: application.incomePeriod,
    },
    shouldFocusError: false,
  })

  const onSubmit = async (data) => {
    const validation = await trigger()
    if (!validation) return

    const { income, incomePeriod } = data
    const incomeValue = income.replaceAll(",", "")
    // Skip validation of total income if no units or the applicant has income vouchers.
    const validationError =
      !listing.units?.length || application.incomeVouchers
        ? null
        : verifyIncome(listing, incomeValue, incomePeriod)
    setIncomeError(validationError)

    if (!validationError) {
      const toSave = { income: incomeValue, incomePeriod }

      conductor.completeSection(currentPageSection)
      conductor.currentStep.save(toSave)
      conductor.routeToNextOrReturnUrl()
    }
  }
  const onError = () => {
    window.scrollTo(0, 0)
  }

  const incomePeriodValues = [
    {
      id: "incomePeriodMonthly",
      value: "perMonth",
      label: t("t.perMonth"),
    },
    {
      id: "incomePeriodYearly",
      value: "perYear",
      label: t("t.perYear"),
    },
  ]

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Application - Income",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  return (
    <FormsLayout>
      <Form onSubmit={handleSubmit(onSubmit, onError)}>
        <ApplicationFormLayout
          listingName={listing?.name}
          heading={t("application.financial.income.title")}
          subheading={
            <div>
              <p className="field-note mb-4">{t("application.financial.income.instruction1")}</p>
              <p className="field-note">{t("application.financial.income.instruction2")}</p>
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

          {incomeError && (
            <CardSection>
              <AlertBox type="alert" inverted onClose={() => setIncomeError(null)}>
                {t("application.household.dontQualifyHeader")}
              </AlertBox>
              <AlertNotice
                title={t(`application.financial.income.validationError.reason.${incomeError}`)}
                type="alert"
                inverted
              >
                <p className="mb-2">
                  {t(`application.financial.income.validationError.instruction1`)}
                </p>
                <p className="mb-2">
                  {t(`application.financial.income.validationError.instruction2`)}
                </p>
                <p>
                  <Link href={`/get-assistance`}>{t("pageTitle.getAssistance")}</Link>
                </p>
              </AlertNotice>
            </CardSection>
          )}

          <CardSection divider={"flush"} className={"border-none"}>
            <Field
              id="income"
              name="income"
              type="currency"
              label={t("application.financial.income.prompt")}
              labelClassName={"text__caps-spaced"}
              validation={{ required: true, min: 0.01 }}
              error={errors.income}
              register={register}
              errorMessage={t("errors.numberError")}
              setValue={setValue}
              getValues={getValues}
              prepend={"$"}
              dataTestId={"app-income"}
              subNote={t("application.financial.income.placeholder")}
            />

            <fieldset>
              <legend className="sr-only">{t("application.financial.income.legend")}</legend>
              <FieldGroup
                type="radio"
                name="incomePeriod"
                error={errors.incomePeriod}
                errorMessage={t("errors.selectOption")}
                register={register}
                validation={{ required: true }}
                fields={incomePeriodValues}
                dataTestId={"app-income-period"}
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

export default ApplicationIncome
