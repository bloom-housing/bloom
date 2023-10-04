import { Card, Heading } from "@bloom-housing/ui-seeds"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import { ProgressNav } from "@bloom-housing/ui-components"

interface ApplicationFormLayoutProps {
  listingName: string
  heading: string
  children?: React.ReactNode
  progressNavProps: {
    currentPageSection: number
    completedSections: number
    labels: string[]
    mounted: boolean
  }
}
const ApplicationFormLayout = (props: ApplicationFormLayoutProps) => {
  return (
    <>
      <Card spacing={"sm"} className={"mb-6"}>
        <CardSection className={"bg-primary px-8 py-4 text-white"}>
          <Heading priority={1} className={"text-xl font-bold font-alt-sans"}>
            {props.listingName}
          </Heading>
        </CardSection>
        <CardSection className={"px-8"}>
          <ProgressNav {...props.progressNavProps} />
        </CardSection>
      </Card>
      <Card spacing={"lg"}>
        <CardSection divider={"inset"}>
          <Heading priority={2} size={"2xl"}>
            {props.heading}
          </Heading>
        </CardSection>
        {props.children}
      </Card>
    </>
  )
}

export default ApplicationFormLayout
