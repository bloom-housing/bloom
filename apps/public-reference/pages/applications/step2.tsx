import Router from "next/router"
import { Button, MarkdownSection, PageHeader } from "@bloom-housing/ui-components"
import Layout from "../../layouts/application"
import PageContent from "../../page_content/new_application.mdx"
import { useForm } from "react-hook-form"
import { AppSubmissionContext } from "../../lib/AppSubmissionContext"
import ApplicationConductor from "../../lib/ApplicationConductor"
import AppSubmissionStep1b from "../../lib/app_submission_steps/AppSubmissionStep1b"
import { useContext } from "react"
import { MultistepProgress } from "@bloom-housing/ui-components"

export default () => {
  const pageTitle = <>Submit an Application</>
  const context = useContext(AppSubmissionContext)
  const { application } = context
  const conductor = new ApplicationConductor(application, context)
  const currentPageStep = 2

  /* Form Handler */
  const { register, handleSubmit, errors } = useForm()
  const onSubmit = data => {
    console.log(data)

    const submission = new AppSubmissionStep1b(conductor)
    submission.save(data)

    Router.push("/applications/complete")
  }

  return (
    <Layout>
      <PageHeader inverse={true}>{pageTitle}</PageHeader>
      <MarkdownSection>
        <PageContent />
      </MarkdownSection>

      <article className="max-w-5xl m-auto mb-12">
        <MultistepProgress
          currentPageStep={currentPageStep}
          completedSteps={application.completedStep}
          totalNumberOfSteps={conductor.totalNumberOfSteps()}
        />

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex">
            <div className="field">
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
              {errors.street && "Street address is required."}
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
            <div className="field">
              <label htmlFor="city">City</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  id="city"
                  name="city"
                  defaultValue={context.application.address.city}
                  ref={register}
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="stuff">State</label>
              <div className="control">
                <select
                  id="state"
                  name="state"
                  defaultValue={context.application.address.state}
                  ref={register}
                >
                  <option>California</option>
                  <option>North Carolina</option>
                  <option>New Hampshire</option>
                </select>
              </div>
            </div>

            <div className="field">
              <label htmlFor="zip">Zip</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  id="zip"
                  name="zip"
                  defaultValue={context.application.address.zipcode}
                  ref={register({ pattern: /\d+/ })}
                />
              </div>
            </div>
            {errors.zip && "Zipcode should be a number"}
          </div>

          <div className="mt-6">
            <Button
              onClick={() => {
                console.info("button has been clicked!")
              }}
            >
              Save Form
            </Button>
          </div>
        </form>
      </article>
    </Layout>
  )
}
