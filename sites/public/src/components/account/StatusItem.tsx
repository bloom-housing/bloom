import React from "react"
import { t } from "@bloom-housing/ui-components"
import { Button, Card, Tag } from "@bloom-housing/ui-seeds"
import styles from "./StatusItem.module.scss"
import accountStyles from "../../pages/account/account.module.scss"

interface StatusItemProps {
  applicationDueDate?: string
  applicationURL?: string
  applicationUpdatedAt: string
  confirmationNumber?: string
  listingName: string
  listingURL: string
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
  return (
    <Card.Section className={accountStyles["account-card-applications-section"]}>
      <article className={styles["status-item"]}>
        <header className={styles["status-item__header"]}>
          <h3 className={styles["status-item__title"]}>{props.listingName}</h3>
          <p className={styles["status-item__status"]}>
            {props.strings?.status ?? t("application.status")}:{" "}
            <Tag variant="primary-inverse">
              {props.strings?.submittedStatus ?? t("application.statuses.submitted")}
            </Tag>
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
          {props.applicationURL && (
            <div>
              <Button href={props.applicationURL} variant="primary-outlined" size="sm">
                {props.strings?.viewApplication ?? t("application.viewApplication")}
              </Button>
            </div>
          )}
          {props.lotteryResults && (
            <div>
              <Button href={props.lotteryURL} variant="primary-outlined" size="sm">
                {props.strings?.lotteryResults ?? t("account.application.lottery.viewResults")}
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
