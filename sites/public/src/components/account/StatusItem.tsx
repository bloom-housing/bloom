import React from "react"
import { t } from "@bloom-housing/ui-components"
import { Button, Card, Tag } from "@bloom-housing/ui-seeds"
import styles from "./StatusItem.module.scss"
import applicationsViewStyles from "./ApplicationsView.module.scss"

export enum ApplicationListingStatus {
  Lottery = "lottery",
  Open = "open",
  Closed = "closed",
}
interface StatusItemProps {
  applicationDueDate?: string
  applicationURL: string
  applicationUpdatedAt: string
  confirmationNumber?: string
  listingName: string
  listingURL: string
  status: ApplicationListingStatus
  strings?: {
    applicationsDeadline?: string
    edited?: string
    seeListing?: string
    status?: string
    submittedStatus?: string
    viewApplication?: string
    yourNumber?: string
  }
}

const StatusItem = (props: StatusItemProps) => {
  console.log(props.status)

  const statusString = () => {
    switch (props.status) {
      case ApplicationListingStatus.Lottery:
        return t("account.lotteryRun")
      case ApplicationListingStatus.Open:
        return t("account.openApplications")
      case ApplicationListingStatus.Closed:
        return t("account.closedApplications")
      default:
        return t("application.statuses.submitted")
    }
  }

  return (
    <Card.Section className={applicationsViewStyles["account-card-applications-section"]}>
      <article className={styles["status-item"]}>
        <header className={styles["status-item__header"]}>
          <h3 className={styles["status-item__title"]}>{props.listingName}</h3>
          <p className={styles["status-item__status"]}>
            {props.strings?.status ?? t("application.status")}:{" "}
            <Tag variant="primary">{props.strings?.submittedStatus ?? statusString()}</Tag>
          </p>
        </header>

        <section className={styles["status-item__content"]}>
          <div>
            {props.confirmationNumber && (
              <>
                <span className={styles["status-item__confirm-text"]}>
                  {props.strings?.yourNumber ?? t("application.yourLotteryNumber")}:
                </span>
                <br />
                <span className={styles["status-item__confirm-number"]}>
                  {props.confirmationNumber}
                </span>
              </>
            )}
          </div>

          <div className={styles["status-item__action"]}>
            {props.applicationDueDate && (
              <p className={styles["status-item__due"]}>
                {props.strings?.applicationsDeadline ?? t("listings.applicationDeadline")}:{" "}
                <span className={styles["status-item__due-date"]}>{props.applicationDueDate}</span>
              </p>
            )}
          </div>
        </section>

        <footer className={styles["status-item__footer"]}>
          {props.status === ApplicationListingStatus.Open && (
            <div>
              <Button href={props.applicationURL} variant="primary-outlined" size="sm">
                {props.strings?.viewApplication ?? t("application.viewApplication")}
              </Button>
            </div>
          )}
          <div>
            <Button href={props.listingURL} variant="secondary-outlined" size="sm">
              {props.strings?.seeListing ?? t("t.seeListing")}
            </Button>
          </div>
        </footer>
      </article>
    </Card.Section>
  )
}

export { StatusItem as default, StatusItem }
