import Router from "next/router"
import { Button, FormCard, onClientSide, ProgressNav } from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import PageContent from "../../../page_content/applications/complete.mdx"
import { AppSubmissionContext } from "../../../lib/AppSubmissionContext"
import ApplicationConductor from "../../../lib/ApplicationConductor"
import { useContext } from "react"

export default () => {
  const context = useContext(AppSubmissionContext)
  const { application } = context
  const conductor = new ApplicationConductor(application, context)
  const currentPageStep = 3 // The End

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

        <div className={!onClientSide() ? "invisible" : ""}>
          <div className="p-10 border border-blue-700 my-12">
            <h3>Submission:</h3>
            <br />
            <strong>Name:</strong> {context.application.name || "n/a"}
            <br />
            <strong>Age:</strong> {context.application.age || "n/a"}
            <br />
            <strong>Live/Work in SF?</strong> {context.application.liveInSF ? "yes" : "no"}
            <br />
            <strong>Housing Status:</strong> {context.application.housingStatus || "n/a"}
            <br />
            <strong>Address:</strong> {context.application.address.street || "n/a"}
            <br />
            <strong>Address 2:</strong> {context.application.address.street2 || "n/a"}
            <br />
            <strong>City:</strong> {context.application.address.city || "n/a"}
            <br />
            <strong>State:</strong> {context.application.address.state || "n/a"}
            <br />
            <strong>Zipcode:</strong> {context.application.address.zipcode || "n/a"}
          </div>
        </div>

        <div className="mt-6">
          <Button
            onClick={() => {
              conductor.reset()
              Router.push("/applications/archived/new")
            }}
          >
            Return to Start
          </Button>
        </div>
      </FormCard>
    </FormsLayout>
  )
}
