import Router from "next/router"
import { Button, MarkdownSection, PageHeader } from "@bloom-housing/ui-components"
import Layout from "../../layouts/application"
import PageContent from "../../page_content/new_application.mdx"
import { useForm } from "react-hook-form"
import { AppSubmissionContext } from "../../lib/AppSubmissionContext"
import ApplicationConductor from "../../lib/ApplicationConductor"
import AppSubmissionStep1a from "../../lib/app_submission_steps/AppSubmissionStep1a"
import { useContext } from "react"
import { MultistepProgress } from "@bloom-housing/ui-components"

export default () => {
  const pageTitle = <>Submit an Application</>
  const context = useContext(AppSubmissionContext)
  const { application } = context
  const conductor = new ApplicationConductor(application, context)
  const currentPageStep = 1

  /* Form Handler */
  const { register, handleSubmit, errors } = useForm()
  const onSubmit = data => {
    console.log(data)

    const submission = new AppSubmissionStep1a(conductor)
    submission.save(data)

    Router.push("/applications/step2")
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
              <label htmlFor="firstname">First Name</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  id="firstname"
                  name="firstname"
                  defaultValue={context.application.name?.split(" ")[0]}
                  ref={register}
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="lastname">Last Name</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  id="lastname"
                  name="lastname"
                  defaultValue={context.application.name?.split(" ")[1]}
                  ref={register({ required: true })}
                />
              </div>
            </div>
            {errors.lastname && "Last name is required."}
          </div>

          <div className="field max-w-xs">
            <label className="label" htmlFor="age">
              Age
            </label>
            <div className="control">
              <input
                className="input"
                type="text"
                id="age"
                name="age"
                defaultValue={context.application.age}
                ref={register({ pattern: /\d+/ })}
              />
            </div>
          </div>
          {errors.age && "Please enter number for age."}

          <div className="field">
            <input
              type="checkbox"
              id="liveInSF"
              name="liveInSF"
              defaultChecked={context.application.liveInSF}
              ref={register}
            />
            <label htmlFor="liveInSF">Live and Work in San Francisco</label>
          </div>

          <div className="field field--inline">
            <input
              type="radio"
              id="housingStatus1"
              name="housingStatus"
              value="permanent"
              defaultChecked={context.application.housingStatus == "permanent"}
              ref={register}
            />
            <label htmlFor="housingStatus1">Permanent Housing</label>
          </div>
          <div className="field field--inline">
            <input
              type="radio"
              id="housingStatus2"
              name="housingStatus"
              value="temporary"
              defaultChecked={context.application.housingStatus == "temporary"}
              ref={register}
            />
            <label htmlFor="housingStatus2">Temporary Housing</label>
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
