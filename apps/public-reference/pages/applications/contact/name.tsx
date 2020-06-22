/*
1.2 - Name
Primary applicant details. Name, DOB and Email Address
https://github.com/bloom-housing/bloom/issues/255
*/
import Router from "next/router"
import { Button, Field, FormCard, ProgressNav } from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import { useForm } from "react-hook-form"
import { AppSubmissionContext } from "../../../lib/AppSubmissionContext"
import ApplicationConductor from "../../../lib/ApplicationConductor"
import FormStep from "../../../src/forms/applications/FormStep"
import { useContext } from "react"
import { emailRegex } from "../../../lib/emailRegex"

export default () => {
  const context = useContext(AppSubmissionContext)
  const { application } = context
  const conductor = new ApplicationConductor(application, context)
  const currentPageStep = 1

  /* Form Handler */
  const { register, handleSubmit, setValue, watch, errors } = useForm()
  const onSubmit = (data) => {
    new FormStep(conductor).save(data)

    Router.push("/applications/contact/address").then(() => window.scrollTo(0, 0))
  }

  const noEmail = watch("noEmail")

  return (
    <FormsLayout>
      <FormCard>
        <h5 className="font-alt-sans text-center mb-5">LISTING</h5>

        <ProgressNav
          currentPageStep={currentPageStep}
          completedSteps={application.completedStep}
          totalNumberOfSteps={conductor.totalNumberOfSteps()}
          labels={["You", "Household", "Income", "Preferences", "Review"]}
        />
      </FormCard>

      <FormCard>
        <h2 className="form-card__title is-borderless">What's your name?</h2>

        <hr />

        <form className="mt-10" onSubmit={handleSubmit(onSubmit)}>
          <label className="label-for-section">Your Name</label>

          <Field
            name="firstName"
            placeholder="First Name"
            controlClassName="mt-4"
            defaultValue={context.application.firstName}
            validation={{ required: true }}
            error={errors.firstName}
            errorMessage="Please enter a First Name"
            register={register}
          />

          <Field
            name="middleName"
            placeholder="Middle Name (optional)"
            defaultValue={context.application.middleName}
            register={register}
          />

          <Field
            name="lastName"
            placeholder="Last Name"
            defaultValue={context.application.lastName}
            validation={{ required: true }}
            error={errors.lastName}
            errorMessage="Please enter a Last Name"
            register={register}
          />

          <hr />

          <label className="label-for-section">Your Date of Birth</label>

          <div className="flex mt-4">
            <Field
              name="birthMonth"
              placeholder="MM"
              defaultValue={
                "" + (context.application.birthMonth > 0 ? context.application.birthMonth : "")
              }
              error={errors.birthMonth}
              validation={{
                required: true,
                validate: {
                  monthRange: (value) => parseInt(value) > 0 && parseInt(value) <= 12,
                },
              }}
              register={register}
            />
            <Field
              name="birthDay"
              placeholder="DD"
              defaultValue={
                "" + (context.application.birthDay > 0 ? context.application.birthDay : "")
              }
              error={errors.birthDay}
              validation={{
                required: true,
                validate: {
                  dayRange: (value) => parseInt(value) > 0 && parseInt(value) <= 31,
                },
              }}
              register={register}
            />
            <Field
              name="birthYear"
              placeholder="YYYY"
              defaultValue={
                "" + (context.application.birthYear > 0 ? context.application.birthYear : "")
              }
              error={errors.birthYear}
              validation={{
                required: true,
                validate: {
                  yearRange: (value) =>
                    parseInt(value) > 1900 && parseInt(value) <= new Date().getFullYear() - 18,
                },
              }}
              register={register}
            />
          </div>

          {(errors.birthMonth || errors.birthDay || errors.birthYear) && (
            <div className="field error">
              <span className="error-message">Please enter a valid Date of Birth</span>
            </div>
          )}

          <hr />

          <label className="label-for-section">Your Email Address</label>

          <p className="my-4">
            We will only use your email address to contact you about your application.
          </p>

          <Field
            type="email"
            name="emailAddress"
            placeholder={noEmail ? "None" : "example@web.com"}
            defaultValue={context.application.emailAddress}
            validation={{ pattern: emailRegex }}
            error={errors.emailAddress}
            errorMessage="Please enter an email address"
            register={register}
            disabled={noEmail}
          />

          <div className="field">
            <input
              type="checkbox"
              id="noEmail"
              name="noEmail"
              defaultChecked={context.application.noEmail}
              ref={register}
              onChange={(e) => {
                if (e.target.checked) {
                  setValue("emailAddress", "")
                }
              }}
            />
            <label htmlFor="noEmail" className="text-primary font-semibold">
              I don't have an email address
            </label>
          </div>

          <div className="text-center mt-6">
            <Button
              filled={true}
              onClick={() => {
                //
              }}
            >
              Next
            </Button>
          </div>
        </form>
      </FormCard>
    </FormsLayout>
  )
}
