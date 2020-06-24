/*
1.3 - Contact
Primary applicant contact information
*/
import Link from "next/link"
import Router from "next/router"
import { Button, ErrorMessage, Field, FormCard, ProgressNav } from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import { useForm } from "react-hook-form"
import { AppSubmissionContext } from "../../../lib/AppSubmissionContext"
import ApplicationConductor from "../../../lib/ApplicationConductor"
import { useContext } from "react"

export default () => {
  const context = useContext(AppSubmissionContext)
  const { application } = context
  const conductor = new ApplicationConductor(application, context)
  const currentPageStep = 1

  /* Form Handler */
  const { register, handleSubmit, errors } = useForm()
  const onSubmit = (data) => {
    application.address = data
    conductor.sync()

    Router.push("/applications/contact/alternate").then(() => window.scrollTo(0, 0))
  }

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
            <Link href="/applications/contact/name">Back</Link>
          </strong>
        </p>

        <div className="form-card__lead border-b">
          <h2 className="form-card__title is-borderless">Contact Info</h2>
        </div>

        <form id="applications-address" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-card__group">
            <div className={"field " + (errors.state ? "error" : "")}>
              <label htmlFor="stuff">State</label>
              <div className="control">
                <select
                  id="state"
                  name="state"
                  defaultValue={context.application.address.state}
                  ref={register({ required: true })}
                >
                  <option value="">- choose -</option>
                  <option>California</option>
                  <option>North Carolina</option>
                  <option>New Hampshire</option>
                </select>
              </div>
              <ErrorMessage error={errors.state}>Please choose your State</ErrorMessage>
            </div>

            <div className="flex">
              <Field
                name="street"
                label="Street Address"
                defaultValue={context.application.address.street}
                validation={{ required: true }}
                error={errors.street}
                errorMessage="Please enter your Street Address"
                register={register}
              />

              <Field
                name="street2"
                label="Address 2 (opt)"
                defaultValue={context.application.address.street2}
                register={register}
              />
            </div>

            <div className="flex max-w-2xl">
              <Field
                name="city"
                label="City"
                defaultValue={context.application.address.city}
                validation={{ required: true }}
                error={errors.city}
                errorMessage="Please enter your City"
                register={register}
              />

              <Field
                name="zipcode"
                label="Zipcode"
                defaultValue={context.application.address.zipcode}
                validation={{ required: true }}
                error={errors.zipcode}
                errorMessage="Please enter your Zipcode"
                register={register}
              />
            </div>
          </div>

          <div className="form-card__pager">
            <div className="form-card__pager-row primary">
              <Button
                filled={true}
                onClick={() => {
                  //
                }}
              >
                Next
              </Button>
            </div>
          </div>
        </form>
      </FormCard>
    </FormsLayout>
  )
}
