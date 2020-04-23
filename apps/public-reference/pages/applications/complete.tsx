import Router from "next/router"
import { Button, MarkdownSection, PageHeader } from "@bloom-housing/ui-components"
import Layout from "../../layouts/application"
import PageContent from "../../page_content/new_application.mdx"
import { AppSubmissionContext } from "../../lib/AppSubmissionContext"
import ApplicationConductor from "../../lib/ApplicationConductor"
import { useContext } from "react"
import { MultistepProgress } from "@bloom-housing/ui-components"

export default () => {
  const pageTitle = <>Submit an Application</>
  const context = useContext(AppSubmissionContext)
  const { application } = context
  const conductor = new ApplicationConductor(application, context)
  const currentPageStep = 3 // The End

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

        <div className={!onClientSide() ? "invisible" : ""}>
          <div className="p-10 border border-blue-700 my-12">
            <h3>Thank you for your submission</h3>
            <br />
            <strong>Name:</strong> {context.application.name || "n/a"}
            <br />
            <strong>Age:</strong> {context.application.age || "n/a"}
            <br />
            <strong>Address:</strong> {context.application.address.street || "n/a"}
            <br />
            <strong>City:</strong> {context.application.address.city || "n/a"}
          </div>
        </div>

        <div className="mt-6">
          <Button
            onClick={() => {
              conductor.reset()
              Router.push("/applications/new")
            }}
          >
            Return to Start
          </Button>
        </div>
      </article>
    </Layout>
  )
}
