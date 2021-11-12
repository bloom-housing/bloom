import Layout from "./application"
import { ApplicationTimeout } from "../src/forms/applications/ApplicationTimeout"
import { OnClientSide } from "@bloom-housing/shared-helpers"
import { FormCard, ProgressNav } from "@bloom-housing/ui-components"

interface FormLayoutProps {
  listingName?: string
  labels?: string[]
  completedSections?: number
  currentSection?: number
  children?: React.ReactNode
}
const FormLayout = (props: FormLayoutProps) => {
  return (
    <>
      <ApplicationTimeout />
      <Layout>
        <section className="bg-gray-300 border-t border-gray-450">
          <div className="md:mb-20 md:mt-12 mx-auto max-w-lg print:my-0 print:max-w-full">
            {props.listingName && props.currentSection && props.completedSections && (
              <FormCard header={props.listingName}>
                <ProgressNav
                  currentPageSection={props.currentSection}
                  completedSections={props.completedSections}
                  labels={props.labels}
                  mounted={OnClientSide()}
                />
              </FormCard>
            )}

            {props.children}
          </div>
        </section>
      </Layout>
    </>
  )
}

export default FormLayout
