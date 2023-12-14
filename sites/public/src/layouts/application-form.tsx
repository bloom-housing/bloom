import React from "react"
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons"
import { Button, Card, Heading, Icon } from "@bloom-housing/ui-seeds"
import { t, ProgressNav, StepHeader } from "@bloom-housing/ui-components"
import ApplicationConductor from "../lib/applications/ApplicationConductor"

import styles from "./application-form.module.scss"

interface ApplicationFormLayoutProps {
  listingName: string
  heading: string
  subheading?: string | React.ReactNode
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
  hideBorder?: boolean
}

const ApplicationFormLayout = (props: ApplicationFormLayoutProps) => {
  const getBackLink = (url?: string, onClickFxn?: () => void) => {
    return (
      <div className={"mb-6"}>
        <Button
          leadIcon={<Icon icon={faChevronLeft} />}
          variant={"text"}
          className="font-bold"
          {...(onClickFxn ? { onClick: onClickFxn } : { href: url })}
        >
          {t("t.back")}
        </Button>
      </div>
    )
  }

  if (!props.progressNavProps.mounted) return

  return (
    <>
      <Card spacing={"sm"} className={styles["application-form-header"]}>
        <Card.Section className={styles["application-form-listing-name"]}>
          <Heading priority={1} className={"text-xl text-white font-bold font-alt-sans"}>
            {props.listingName}
          </Heading>
        </Card.Section>
        <Card.Section className={"px-8"}>
          <div className={"hidden md:block"}>
            <ProgressNav {...props.progressNavProps} />
          </div>
          <div className={"block md:hidden"}>
            <StepHeader
              currentStep={props.progressNavProps.currentPageSection}
              totalSteps={props.progressNavProps.labels.length}
              stepPreposition={"of"}
              stepLabeling={props.progressNavProps.labels}
            />
          </div>
        </Card.Section>
      </Card>
      <Card spacing={"lg"} className={`application-form-card ${styles["application-form-body"]}`}>
        <Card.Section divider={"inset"} className={props.hideBorder && "border-none"}>
          {props.backLink && getBackLink(props.backLink.url, props.backLink.onClickFxn)}
          <Heading priority={2} size={"2xl"} className="font-bold">
            {props.heading}
          </Heading>
          {props.subheading && <p className="field-note mt-6">{props.subheading}</p>}
        </Card.Section>
        {props.children}
        {props.conductor && (
          <Card.Section className="bg-primary-lighter">
            <Button
              type="submit"
              variant="primary"
              onClick={() => {
                props.conductor.returnToReview = false
                props.conductor.setNavigatedBack(false)
              }}
              id={"app-next-step-button"}
            >
              {t("t.next")}
            </Button>

            {props.conductor.canJumpForwardToReview() && (
              <div>
                <Button
                  type="submit"
                  variant="text"
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
          </Card.Section>
        )}
      </Card>
    </>
  )
}

export default ApplicationFormLayout
