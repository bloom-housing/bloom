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
  vouchersOrRentalAssistanceKeys,
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
  const { register, handleSubmit, errors, trigger, getValues, setValue, clearErrors } = useForm({
    defaultValues: {
      incomeVouchers: Object.fromEntries(
        application.incomeVouchers
          ? application.incomeVouchers.map((item) => [`incomeVouchers-${item}`, true])
          : []
      ),
    },
    shouldFocusError: false,
  })

  const onSubmit = async (data) => {
    const validation = await trigger()
    if (!validation) return

    const incomeVouchers = Object.entries(data)
      .map(([key, value]) => (value ? key.replace("incomeVouchers-", "") : null))
      .filter((item) => item)
    const toSave = { incomeVouchers }

    conductor.currentStep.save(toSave)
    conductor.routeToNextOrReturnUrl()
  }
  const onError = () => {
    window.scrollTo(0, 0)
  }

  const incomeVouchersOptions = vouchersOrRentalAssistanceKeys.map((item) => ({
    id: item,
    value: item,
    label: t(`application.financial.vouchers.options.${item}`),
    defaultChecked: application?.incomeVouchers?.includes(item) || false,
    uniqueName: true,
    inputProps: {
      onChange: (e) => {
        if (e.target.checked) {
          if (item === "none") {
            setValue("incomeVouchers-issuedVouchers", false)
            setValue("incomeVouchers-rentalAssistance", false)
          } else {
            setValue("incomeVouchers-none", false)
          }
          clearErrors()
        }
      },
    },
  }))

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
          subheading={t("application.financial.vouchers.subtitle")}
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
              <legend className="field-note mb-4">
                {t("application.financial.vouchers.legend")}
              </legend>

              <FieldGroup
                name="incomeVouchers"
                fields={incomeVouchersOptions}
                type="checkbox"
                validation={{
                  validate: () => {
                    return !!Object.values(getValues()).filter((value) => value).length
                  },
                }}
                error={
                  Object.keys(errors).length === Object.keys(getValues()).length &&
                  Object.keys(getValues()).length > 0
                }
                errorMessage={t("errors.selectAtLeastOne")}
                register={register}
                dataTestId={"app-income-vouchers"}
              />
            </fieldset>
          </CardSection>
        </ApplicationFormLayout>
      </Form>
    </FormsLayout>
  )
}

export default ApplicationVouchers
