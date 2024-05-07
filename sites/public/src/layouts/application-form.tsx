import React from "react"
import { BloomCard, CustomIconMap } from "@bloom-housing/shared-helpers"
import { Button, Heading, Icon } from "@bloom-housing/ui-seeds"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
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
      <div className={styles["application-form-back-link"]}>
        <Button
          leadIcon={<Icon>{CustomIconMap.chevronLeft}</Icon>}
          variant={"text"}
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
      <BloomCard className={styles["application-form-header"]}>
        <>
          <CardSection className={styles["application-form-header-title"]}>
            <Heading priority={1} className={styles["application-form-header-heading"]}>
              {props.listingName}
            </Heading>
          </CardSection>
          <CardSection className={styles["application-form-header-progress"]}>
            <div className={styles["desktop-nav"]}>
              <ProgressNav {...props.progressNavProps} />
            </div>
            <div className={styles["mobile-nav"]}>
              <StepHeader
                currentStep={props.progressNavProps.currentPageSection}
                totalSteps={props.progressNavProps.labels.length}
                stepPreposition={"of"}
                stepLabeling={props.progressNavProps.labels}
              />
            </div>
          </CardSection>
        </>
      </BloomCard>
      <BloomCard
        title={props.heading}
        headingPriority={2}
        subtitle={props.subheading}
        headerLink={props.backLink && getBackLink(props.backLink.url, props.backLink.onClickFxn)}
        className={`${styles["application-form-body"]} ${
          props.hideBorder && styles["application-form-header-no-border"]
        }`}
      >
        <>
          {props.children}
          {props.conductor && (
            <CardSection className={styles["application-form-action-footer"]}>
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
                    className={styles["application-form-save-and-return"]}
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
        </>
      </BloomCard>
    </>
  )
}

export default ApplicationFormLayout
