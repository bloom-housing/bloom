import React from "react"
import { t } from "@bloom-housing/ui-components"
import { Button, Card, Tag } from "@bloom-housing/ui-seeds"
import styles from "./StatusItem.module.scss"
import applicationsViewStyles from "./ApplicationsView.module.scss"
import { ListingsStatusEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

interface StatusItemProps {
  applicationDueDate?: string
  applicationURL: string
  applicationUpdatedAt: string
  confirmationNumber?: string
  listingName: string
  listingURL: string
  listingStatus: ListingsStatusEnum
  lotteryDate: Date
  lotteryResults?: boolean
  lotteryURL?: string
  strings?: {
    applicationsDeadline?: string
    edited?: string
    lotteryResults?: string
    seeListing?: string
    status?: string
    submittedStatus?: string
    viewApplication?: string
    yourNumber?: string
  }
}

const StatusItem = (props: StatusItemProps) => {
  //set custom visuals based on listing/lottery status
  let tagText = ""
  let tagVariant: "primary" | "secondary" | "success"

  let deadlineText = ""
  let dueDate = ""

  if (props.lotteryResults) {
    tagText = t("account.lotteryRun")
    tagVariant = "success"

    deadlineText = t("account.lotteryResultsPosted")
  } else if (props.listingStatus === ListingsStatusEnum.active) {
    tagText = t("account.openApplications")
    tagVariant = "primary"

    deadlineText = t("account.applicationsClose")
  } else {
    tagText = t("account.closedApplications")
    tagVariant = "secondary"

    if (props.lotteryDate) {
      deadlineText = t("account.lotteryDate")
    }
  }

  return (
    <Card.Section className={applicationsViewStyles["account-card-applications-section"]}>
      <article className={styles["status-item"]}>
        <header className={styles["status-item__header"]}>
          <h3 className={styles["status-item__title"]}>{props.listingName}</h3>
          <p className={styles["status-item__status"]}>
            {props.strings?.status ?? t("application.status")}: {""}
            <Tag variant={tagVariant}>{tagText}</Tag>
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
          {props.lotteryResults && (
            <div>
              <Button href={props.lotteryURL} variant="primary-outlined" size="sm">
                {props.strings?.lotteryResults ?? t("account.application.lottery.viewResults")}
              </Button>
            </div>
          )}
          <div>
            <Button href={props.applicationURL} variant="primary-outlined" size="sm">
              {props.strings?.viewApplication ?? t("application.viewApplication")}
            </Button>
          </div>
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
