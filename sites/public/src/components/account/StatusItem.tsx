import React from "react"
import { t } from "@bloom-housing/ui-components"
import { Button, Card, Tag } from "@bloom-housing/ui-seeds"
import styles from "./StatusItem.module.scss"
import applicationsViewStyles from "./ApplicationsView.module.scss"
import {
  ListingsStatusEnum,
  LotteryStatusEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"

interface StatusItemProps {
  applicationDueDate?: string
  applicationURL: string
  confirmationNumber?: string
  listingName: string
  listingURL: string
  listingStatus: ListingsStatusEnum
  lotteryStartDate?: string
  lotteryPublishedDate?: string
  lotteryResults?: boolean
  lotteryURL?: string
  lotteryStatus?: LotteryStatusEnum
  strings?: {
    applicationsDeadline?: string
    edited?: string
    lotteryResults?: string
    seeListing?: string
    submittedStatus?: string
    viewApplication?: string
    yourNumber?: string
  }
}

const StatusItem = (props: StatusItemProps) => {
  const showPublicLottery = process.env.showPublicLottery
  //set custom visuals and data based on listing/lottery status
  let tagText = ""
  let tagVariant: "primary" | "secondary" | "success"
  let deadlineText = ""
  let dueDate = ""
  if (props.lotteryStatus === LotteryStatusEnum.publishedToPublic && showPublicLottery) {
    tagText = t("account.lotteryRun")
    tagVariant = "success"
    deadlineText = t("account.lotteryPosted")
    dueDate = props.lotteryPublishedDate
  } else if (props.listingStatus === ListingsStatusEnum.active) {
    tagText = t("account.openApplications")
    tagVariant = "primary"
    deadlineText = t("account.applicationsClose")
    dueDate = props.applicationDueDate
  } else {
    tagText = t("account.closedApplications")
    tagVariant = "secondary"
    if (props.lotteryStartDate && showPublicLottery) {
      deadlineText = t("account.lotteryDate")
      dueDate = props.lotteryStartDate
    }
  }

  return (
    <Card.Section className={applicationsViewStyles["account-card-applications-section"]}>
      <article className={styles["status-item"]}>
        <header className={styles["status-item__header"]}>
          <h3 className={styles["status-item__title"]}>{props.listingName}</h3>
          <p className={styles["status-item__status"]}>
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
            {dueDate && (
              <p className={styles["status-item__due"]}>
                {`${deadlineText} `}
                <span className={styles["status-item__due-date"]}>{dueDate}</span>
              </p>
            )}
          </div>
        </section>

        <footer className={styles["status-item__footer"]}>
          {props.lotteryResults && showPublicLottery && (
            <div>
              <Button href={props.lotteryURL} variant="primary" size="sm">
                {props.strings?.lotteryResults ?? t("account.application.lottery.viewResults")}
              </Button>
            </div>
          )}
          {props.applicationURL && (
            <div>
              <Button href={props.applicationURL} variant="primary-outlined" size="sm">
                {props.strings?.viewApplication ?? t("application.viewApplication")}
              </Button>
            </div>
          )}
          <div>
            <Button href={props.listingURL} variant="primary-outlined" size="sm">
              {props.strings?.seeListing ?? t("t.seeListing")}
            </Button>
          </div>
        </footer>
      </article>
    </Card.Section>
  )
}

export { StatusItem as default, StatusItem }
