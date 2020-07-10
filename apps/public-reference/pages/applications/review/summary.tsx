/*
5.2 Summary
Display a summary of application fields with edit links per section
*/
import Link from "next/link"
import Router from "next/router"
import { Button, FormCard, ProgressNav, MultiLineAddress, t } from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import { useForm } from "react-hook-form"
import { AppSubmissionContext } from "../../../lib/AppSubmissionContext"
import ApplicationConductor from "../../../lib/ApplicationConductor"
import { useContext } from "react"

const EditLink = (props: { href: string }) => (
  <div className="float-right">
    <Link href={props.href}>
      <a className="button is-unstyled is-borderless uppercase text-base my-2 text-primary-dark">
        Edit
      </a>
    </Link>
  </div>
)

const ReviewItem = (props: { label: string; sublabel?: string; children: any }) => (
  <p className="mb-2">
    <span className="text-gray-700">{props.label}</span>
    <br />
    <span className="field-label--caps font-alt-sans text-base text-black">{props.children}</span>
    {props.sublabel && (
      <>
        <br />
        <span className="-mt-3 block text-base">{props.sublabel}</span>
      </>
    )}
  </p>
)

export default () => {
  const context = useContext(AppSubmissionContext)
  const { application } = context
  const conductor = new ApplicationConductor(application, context)
  const currentPageStep = 5

  /* Form Handler */
  const { handleSubmit } = useForm()
  const onSubmit = (data) => {
    console.log(data)

    Router.push("/applications/review/terms").then(() => window.scrollTo(0, 0))
  }

  const accessibilityEntries = []
  if (application.accessibility.mobility) accessibilityEntries.push(t("application.ada.mobility"))
  if (application.accessibility.vision) accessibilityEntries.push(t("application.ada.vision"))
  if (application.accessibility.hearing) accessibilityEntries.push(t("application.ada.hearing"))
  if (accessibilityEntries.length == 0) accessibilityEntries.push(t("t.no"))

  return (
    <FormsLayout>
      <FormCard header="LISTING">
        <ProgressNav
          currentPageStep={currentPageStep}
          completedSteps={application.completedStep}
          totalNumberOfSteps={conductor.totalNumberOfSteps()}
          labels={["You", "Household", "Income", "Preferences", "Review"]}
        />
      </FormCard>

      <FormCard>
        <p className="form-card__back">
          <strong>
            <Link href="/applications/review/demographics">Back</Link>
          </strong>
        </p>

        <div className="form-card__lead">
          <h2 className="form-card__title is-borderless">
            Take a moment to review your information before submitting your application.
          </h2>
        </div>

        <h3 className="px-8 py-4 bg-gray-200">
          You
          <EditLink href="/applications/contact/name" />
        </h3>

        <div className="form-card__group mx-0">
          <ReviewItem label={"Name"}>
            {application.firstName} {application.lastName}
          </ReviewItem>

          <ReviewItem label={"Date of Birth"}>
            {application.birthMonth}/{application.birthDay}/{application.birthYear}
          </ReviewItem>

          <ReviewItem label={"Phone"} sublabel={application.phoneNumberType}>
            {application.phoneNumber}
          </ReviewItem>

          {application.emailAddress && (
            <ReviewItem label={"Email"}>{application.emailAddress}</ReviewItem>
          )}

          <ReviewItem label={"Address"}>
            <MultiLineAddress address={application.address} />
          </ReviewItem>
        </div>

        <h3 className="px-8 py-4 bg-gray-200">Household Members</h3>

        <div className="form-card__group mx-0">
          <p>...</p>
        </div>

        <h3 className="px-8 py-4 bg-gray-200">
          Household Details
          <EditLink href="/applications/household/ada" />
        </h3>

        <div className="form-card__group mx-0">
          <ReviewItem label={"ADA Accessible Units"}>
            {accessibilityEntries.map((item) => (
              <>
                {item}
                <br />
              </>
            ))}
          </ReviewItem>
        </div>

        <div className="form-card__pager">
          <div className="form-card__pager-row primary">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Button
                filled={true}
                onClick={() => {
                  //
                }}
              >
                Confirm
              </Button>
            </form>
          </div>
        </div>
      </FormCard>
    </FormsLayout>
  )
}
