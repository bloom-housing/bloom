import React, { useContext, useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { DOBField, Field, t } from "@bloom-housing/ui-components"
import { Button, Dialog } from "@bloom-housing/ui-seeds"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import {
  AuthContext,
  Form,
  OnClientSide,
  PageView,
  emailRegex,
  pushGtmEvent,
} from "@bloom-housing/shared-helpers"
import FormsLayout from "../../../layouts/forms"
import { useFormConductor } from "../../../lib/hooks"
import { sharedGetStaticProps } from "../../../lib/sharedPageProps"
import { UserStatus } from "../../../lib/constants"
import ApplicationFormLayout, {
  ApplicationAlertBox,
  onFormError,
} from "../../../layouts/application-form"
import { useStopLightGate } from "../../../lib/applications/stopLights/useStopLightGate"
import type { StopLightRule } from "../../../lib/applications/stopLights/stopLightRules"

// DEMO ONLY. Ticket #2 threads these off the jurisdiction as
// conductor.config.enabledStopLightRuleKeys; hardcoded here so the demo needs
// no feature flag or jurisdiction setup. The registry's own
// seniorBuildingMinimumAge example stays inert because its key is not listed.
const DEMO_STOP_LIGHT_RULE_KEYS = ["demoSeniorMinimumAge", "demoSeniorPreferredAge"]

// DEMO ONLY. Ticket #5 builds RedLightModal/YellowLightModal and renders them
// once inside ApplicationFormLayout off a `stopLights` prop. Until then the
// page renders them itself, from the same packet the layout will consume.
const StopLightRuleList = ({ rules }: { rules: StopLightRule[] }) => (
  <>
    {rules.map((rule) => (
      <div key={rule.key} className={"mb-4"}>
        <p className={"text__medium-normal"}>{rule.heading}</p>
        <p className={"pt-2"}>{rule.body}</p>
      </div>
    ))}
  </>
)

const ApplicationName = () => {
  const { profile } = useContext(AuthContext)
  const { conductor, application, listing } = useFormConductor("primaryApplicantName")
  const router = useRouter()
  const [autofilled, setAutofilled] = useState(false)

  // DEMO ONLY. This is the ticket #6 wiring, minus the ApplicationFormLayout prop.
  const { guardSubmit, stopLights } = useStopLightGate(
    "primaryApplicantName",
    application,
    listing,
    DEMO_STOP_LIGHT_RULE_KEYS,
    router.query.blockedRule as string | undefined
  )
  const isAdvocate = conductor?.config?.isAdvocate

  const currentPageSection = 1

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, watch, errors, trigger, clearErrors } = useForm<
    Record<string, any>
  >({
    shouldFocusError: false,
    defaultValues: {
      "applicant.emailAddress": application.applicant.emailAddress,
      "applicant.noEmail": application.applicant.noEmail,
    },
  })
  const onSubmit = async (data) => {
    const validation = await trigger()
    if (!validation) return

    // This step owns part of applicant, so pendingSave rebuilds that sub-object.
    // Nothing is saved or routed unless guardSubmit decides to run proceed.
    const pendingSave = { applicant: { ...application.applicant, ...data.applicant } }
    guardSubmit(pendingSave, () => {
      conductor.currentStep.save(pendingSave)
      conductor.routeToNextOrReturnUrl()
    })
  }

  const onError = () => {
    onFormError()
  }

  const emailPresent: string = watch("applicant.emailAddress")
  const noEmail: boolean = watch("applicant.noEmail")
  const clientLoaded = OnClientSide()
  if (!autofilled && clientLoaded && application.autofilled) setAutofilled(true)
  const emailErrorMessage =
    errors.applicant?.emailAddress?.type === "advocateEmail"
      ? t("errors.advocateEmailAddressError")
      : t("errors.emailAddressError")

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Application - Contact Name",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  return (
    <FormsLayout
      pageTitle={`${t("pageTitle.primaryApplicantName")} - ${t("listings.apply.applyOnline")} - ${
        listing?.name
      }`}
    >
      <Form onSubmit={handleSubmit(onSubmit, onError)}>
        <ApplicationFormLayout
          listingName={listing?.name}
          heading={t("application.name.title")}
          progressNavProps={{
            currentPageSection: currentPageSection,
            completedSections: application.completedSections,
            labels: conductor.config.sections.map((label) => t(`t.${label}`)),
            mounted: OnClientSide(),
          }}
          backLink={{
            url: autofilled ? `/applications/start/autofill` : `/applications/start/what-to-expect`,
          }}
          conductor={conductor}
        >
          <ApplicationAlertBox errors={errors} />
          {/* DEMO ONLY. Cheat sheet for triggering the demo rules by hand. */}
          <CardSection divider={"inset"}>
            <div className={"bg-gray-100 p-4"}>
              <p className={"text__medium-normal"}>Stop Light demo — date of birth</p>
              <ul className={"pt-2"}>
                <li>Birth year 1990 → red light, blocked (nothing saves, no routing)</li>
                <li>Birth year 1966 → yellow light, continues once acknowledged</li>
                <li>Birth year 1950 → no light, saves and routes as usual</li>
              </ul>
              <p className={"pt-2"}>
                Both buttons below run the same gate. Deep link check: reload with
                <span className={"font-semibold"}> ?blockedRule=demoSeniorMinimumAge</span> after
                saving a 1990 birth year.
              </p>
            </div>
          </CardSection>
          <CardSection divider={"inset"}>
            <div id={"application-initial-page"}>
              <fieldset>
                <legend
                  className={`text__caps-spaced ${errors.applicant?.firstName ? "text-alert" : ""}`}
                >
                  {t("application.name.yourName")}
                </legend>

                <Field
                  name="applicant.firstName"
                  label={t("application.name.firstOrGivenName")}
                  defaultValue={application.applicant.firstName}
                  validation={{ required: true, maxLength: 64 }}
                  error={errors.applicant?.firstName}
                  errorMessage={
                    errors.applicant?.firstName?.type === "maxLength"
                      ? t("errors.maxLength", { length: 64 })
                      : t("errors.givenNameError")
                  }
                  register={register}
                  dataTestId={"app-primary-first-name"}
                />

                <Field
                  name="applicant.middleName"
                  label={t("application.name.middleNameOptional")}
                  defaultValue={application.applicant.middleName}
                  register={register}
                  dataTestId={"app-primary-middle-name"}
                  validation={{ maxLength: 64 }}
                  error={errors.applicant?.middleName}
                  errorMessage={t("errors.maxLength", { length: 64 })}
                />

                <Field
                  name="applicant.lastName"
                  label={t("application.name.lastOrFamilyName")}
                  defaultValue={application.applicant.lastName}
                  validation={{ required: true, maxLength: 64 }}
                  error={errors.applicant?.lastName}
                  errorMessage={
                    errors.applicant?.lastName?.type === "maxLength"
                      ? t("errors.maxLength", { length: 64 })
                      : t("errors.familyNameError")
                  }
                  register={register}
                  dataTestId={"app-primary-last-name"}
                />
              </fieldset>
            </div>
          </CardSection>
          <CardSection divider={"inset"}>
            <DOBField
              defaultDOB={{
                birthDay: application.applicant.birthDay,
                birthMonth: application.applicant.birthMonth,
                birthYear: application.applicant.birthYear,
              }}
              register={register}
              required={true}
              error={errors.applicant}
              name="applicant"
              id="applicant.dateOfBirth"
              watch={watch}
              validateAge18={true}
              errorMessage={t("errors.dateOfBirthErrorAge")}
              label={t("application.name.yourDateOfBirth")}
            />
            <p className={"field-sub-note"}>{t("application.name.dobHelper")}</p>
          </CardSection>
          <CardSection divider={"flush"} className={"border-none"}>
            <fieldset>
              <legend
                className={`text__caps-spaced ${
                  errors.applicant?.emailAddress ? "text-alert" : ""
                }`}
              >
                {t("application.name.yourEmailAddress")}
              </legend>

              <p className="field-note mb-4">{t("application.name.emailPrivacy")}</p>

              <Field
                type="email"
                name="applicant.emailAddress"
                label={t("application.name.yourEmailAddress")}
                readerOnly={true}
                defaultValue={application.applicant.emailAddress}
                validation={{
                  required: !noEmail,
                  pattern: emailRegex,
                  validate: {
                    advocateEmail: (value: string) => {
                      if (!isAdvocate || !value || !profile?.email) return true
                      return value.trim().toLowerCase() !== profile.email.trim().toLowerCase()
                    },
                  },
                }}
                error={errors.applicant?.emailAddress}
                errorMessage={emailErrorMessage}
                register={register}
                onChange={() => clearErrors("applicant.emailAddress")}
                disabled={clientLoaded && noEmail}
                dataTestId={"app-primary-email"}
                subNote={"example@mail.com"}
              />

              <Field
                type="checkbox"
                id="noEmail"
                name="applicant.noEmail"
                label={t("application.name.noEmailAddress")}
                primary={true}
                register={register}
                disabled={clientLoaded && emailPresent?.length > 0}
                onChange={(e) => {
                  if (e.target.checked) clearErrors("applicant.emailAddress")
                }}
                inputProps={{
                  defaultChecked: clientLoaded && noEmail,
                }}
                dataTestId={"app-primary-no-email"}
              />
            </fieldset>
          </CardSection>
        </ApplicationFormLayout>
      </Form>

      {/* DEMO ONLY. Ticket #5 moves both of these into ApplicationFormLayout.
          Rendered outside <Form> on purpose: a portalled Dialog still bubbles
          React events up the component tree, so a button inside the form would
          re-submit it. */}
      <Dialog
        isOpen={stopLights.redRules.length > 0}
        onClose={stopLights.onEditRed}
        ariaLabelledBy="demo-red-light-header"
      >
        <Dialog.Header id="demo-red-light-header">You can&apos;t continue</Dialog.Header>
        <Dialog.Content>
          <StopLightRuleList rules={stopLights.redRules} />
        </Dialog.Content>
        <Dialog.Footer>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              const anchor = stopLights.redRules[0]?.editFieldAnchor
              stopLights.onEditRed()
              const target = anchor ? document.getElementById(anchor) : null
              const input =
                target instanceof HTMLInputElement ? target : target?.querySelector("input")
              input?.focus()
            }}
          >
            Edit
          </Button>
          <Button
            variant="primary-outlined"
            size="sm"
            onClick={() => {
              void router.push(`/${router.locale}/listing/${listing?.id}/${listing?.urlSlug}`)
            }}
          >
            Return to Listings
          </Button>
        </Dialog.Footer>
      </Dialog>

      <Dialog
        isOpen={stopLights.yellowRules.length > 0}
        onClose={stopLights.onCancelYellow}
        ariaLabelledBy="demo-yellow-light-header"
      >
        <Dialog.Header id="demo-yellow-light-header">Before you continue</Dialog.Header>
        <Dialog.Content>
          <StopLightRuleList rules={stopLights.yellowRules} />
        </Dialog.Content>
        <Dialog.Footer>
          <Button variant="primary" size="sm" onClick={stopLights.onAcknowledgeYellow}>
            I Understand, Continue
          </Button>
          <Button variant="primary-outlined" size="sm" onClick={stopLights.onCancelYellow}>
            Cancel
          </Button>
        </Dialog.Footer>
      </Dialog>
    </FormsLayout>
  )
}

export default ApplicationName

export const getStaticProps = sharedGetStaticProps
