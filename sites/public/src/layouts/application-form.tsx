import { Card, Heading } from "@bloom-housing/ui-seeds"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import {
  Button,
  LinkButton,
  t,
  ProgressNav,
  AppearanceStyleType,
} from "@bloom-housing/ui-components"
import ApplicationConductor from "../lib/applications/ApplicationConductor"

interface ApplicationFormLayoutProps {
  listingName: string
  heading: string
  subheading?: string
  children?: React.ReactNode
  progressNavProps: {
    currentPageSection: number
    completedSections: number
    labels: string[]
    mounted: boolean
  }
  backLink?: {
    url?: string
    onClickFxn?: () => void
  }
  conductor?: ApplicationConductor
}

const ApplicationFormLayout = (props: ApplicationFormLayoutProps) => {
  const getBackLink = (url?: string, onClickFxn?: () => void) => {
    return (
      <div className={"mb-6"}>
        {onClickFxn ? (
          <Button inlineIcon="left" icon="arrowBack" onClick={onClickFxn}>
            {t("t.back")}
          </Button>
        ) : (
          <LinkButton inlineIcon="left" icon="arrowBack" href={url}>
            {t("t.back")}
          </LinkButton>
        )}
      </div>
    )
  }

  return (
    <>
      <Card spacing={"sm"} className={"my-6"}>
        <CardSection className={"bg-primary px-8 py-4 text-white"}>
          <Heading priority={1} className={"text-xl font-bold font-alt-sans"}>
            {props.listingName}
          </Heading>
        </CardSection>
        <CardSection className={"px-8"}>
          <ProgressNav {...props.progressNavProps} />
        </CardSection>
      </Card>
      <Card spacing={"lg"} className={"mb-6"}>
        <CardSection divider={"inset"}>
          {props.backLink && getBackLink(props.backLink.url, props.backLink.onClickFxn)}
          <Heading priority={2} size={"2xl"}>
            {props.heading}
          </Heading>
          {props.subheading && <p className="field-note mt-6">{props.subheading}</p>}
        </CardSection>
        {props.children}
        {props.conductor && (
          <CardSection className={"bg-primary-lighter"}>
            <Button
              styleType={AppearanceStyleType.primary}
              onClick={() => {
                props.conductor.returnToReview = false
                props.conductor.setNavigatedBack(false)
              }}
              data-testid={"app-next-step-button"}
            >
              {t("t.next")}
            </Button>

            {props.conductor.canJumpForwardToReview() && (
              <div>
                <Button
                  className="mt-4"
                  onClick={() => {
                    props.conductor.returnToReview = true
                    props.conductor.setNavigatedBack(false)
                  }}
                >
                  {t("application.form.general.saveAndReturn")}
                </Button>
              </div>
            )}
          </CardSection>
        )}
      </Card>
    </>
  )
}

export default ApplicationFormLayout
