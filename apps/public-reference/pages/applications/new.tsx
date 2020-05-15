import Router from "next/router"
import { Button, Field, MultistepProgress } from "@bloom-housing/ui-components"
import FormsLayout from "../../layouts/forms"
import PageContent from "../../page_content/applications/new.mdx"
import { useForm } from "react-hook-form"
import { AppSubmissionContext } from "../../lib/AppSubmissionContext"
import ApplicationConductor from "../../lib/ApplicationConductor"
import Step1 from "../../src/forms/applications/step1"
import { useContext } from "react"

export default () => {
  const context = useContext(AppSubmissionContext)
  const { application } = context
  const conductor = new ApplicationConductor(application, context)
  const currentPageStep = 1

  /* Form Handler */
  const { register, handleSubmit, errors } = useForm()
  const onSubmit = (data) => {
    console.log(data)

    const submission = new Step1(conductor)
    submission.save(data)

    Router.push("/applications/step2").then(() => window.scrollTo(0, 0))
  }

  const cardClasses = ["p-10", "bg-white", "mb-10", "border", "border-gray-450", "rounded-lg"].join(
    " "
  )

  return (
    <FormsLayout>
      <article className={cardClasses}>
        <h5 className="font-alt-sans text-center mb-5">
          55 TRITON PARK LANE UNITS 510 516 APPLICATION
        </h5>

        <MultistepProgress
          currentPageStep={currentPageStep}
          completedSteps={application.completedStep}
          totalNumberOfSteps={conductor.totalNumberOfSteps()}
        />
      </article>

      <article className={cardClasses}>
        <div className="markdown">
          <PageContent />
        </div>

        <form id="applications-new" className="mt-10" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex">
            <Field
              name="firstname"
              label="First Name"
              defaultValue={context.application.name?.split(" ")[0]}
              validation={{ required: true }}
              error={errors.firstname}
              errorMessage="Please enter a First Name"
              register={register}
            />

            <Field
              name="lastname"
              label="Last Name"
              defaultValue={context.application.name?.split(" ")[1]}
              validation={{ required: true }}
              error={errors.lastname}
              errorMessage="Please enter a Last Name"
              register={register}
            />
          </div>

          <Field
            name="age"
            label="Age"
            defaultValue={context.application.age}
            validation={{ required: true, pattern: /\d+/ }}
            error={errors.age}
            errorMessage="Please enter number for Age"
            register={register}
            controlClassName="control-narrower"
          />

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
          <div className="text-center mt-6">
            <Button
              filled={true}
              onClick={() => {
                console.info("button has been clicked!")
              }}
            >
              Next
            </Button>
          </div>
        </form>
      </article>
    </FormsLayout>
  )
}
