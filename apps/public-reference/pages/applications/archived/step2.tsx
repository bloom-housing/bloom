import Router from "next/router"
import { Button, ErrorMessage, FormCard, ProgressNav } from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import PageContent from "../../../page_content/applications/step2.mdx"
import { useForm } from "react-hook-form"
import { AppSubmissionContext } from "../../../lib/AppSubmissionContext"
import ApplicationConductor from "../../../lib/ApplicationConductor"
import Step2 from "../../../src/forms/applications/archived/step2"
import { useContext } from "react"

export default () => {
  const context = useContext(AppSubmissionContext)
  const { application } = context
  const conductor = new ApplicationConductor(application, context)
  const currentPageStep = 2

  /* Form Handler */
  const { register, handleSubmit, errors } = useForm()
  const onSubmit = (data) => {
    console.log(data)

    const submission = new Step2(conductor)
    submission.save(data)

    Router.push("/applications/archived/complete").then(() => window.scrollTo(0, 0))
  }

  return (
    <FormsLayout>
      <FormCard>
        <h5 className="font-alt-sans text-center mb-5">
          55 TRITON PARK LANE UNITS 510 516 APPLICATION
        </h5>

        <ProgressNav
          currentPageStep={currentPageStep}
          completedSteps={application.completedStep}
          totalNumberOfSteps={conductor.totalNumberOfSteps()}
          labels={["You", "Household", "Income", "Preferences", "Review"]}
        />
      </FormCard>

      <FormCard>
        <div className="markdown">
          <PageContent />
        </div>

        <form id="applications-step2" onSubmit={handleSubmit(onSubmit)}>
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
            <div className={"field " + (errors.street ? "error" : "")}>
              <label htmlFor="street">Street Address</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  id="street"
                  name="street"
                  defaultValue={context.application.address.street}
                  ref={register({ required: true })}
                />
              </div>
              <ErrorMessage error={errors.street}>Please enter your Street Address</ErrorMessage>
            </div>

            <div className="field">
              <label htmlFor="street2">Address 2 (opt)</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  id="street2"
                  name="street2"
                  defaultValue={context.application.address.street2}
                  ref={register}
                />
              </div>
            </div>
          </div>

          <div className="flex max-w-2xl">
            <div className={"field " + (errors.city ? "error" : "")}>
              <label htmlFor="city">City</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  id="city"
                  name="city"
                  defaultValue={context.application.address.city}
                  ref={register({ required: true })}
                />
              </div>
              <ErrorMessage error={errors.city}>Please enter your City</ErrorMessage>
            </div>

            <div className={"field " + (errors.zipcode ? "error" : "")}>
              <label htmlFor="zipcode">Zipcode</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  id="zipcode"
                  name="zipcode"
                  defaultValue={context.application.address.zipcode}
                  ref={register({ required: true, pattern: /\d+/ })}
                />
              </div>
              <ErrorMessage error={errors.zipcode}>Please enter your Zipcode</ErrorMessage>
            </div>
          </div>

          <div className="text-center mt-6">
            <Button
              filled={true}
              onClick={() => {
                console.info("button has been clicked!")
              }}
            >
              Finish
            </Button>
          </div>
        </form>
      </FormCard>
    </FormsLayout>
  )
}
