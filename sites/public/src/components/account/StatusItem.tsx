import React, { useContext } from "react"
import { t } from "@bloom-housing/ui-components"
import { Button, Link } from "@bloom-housing/ui-seeds"
import styles from "./StatusItem.module.scss"

interface StatusItemProps {
  applicationDueDate?: string
  applicationURL: string
  applicationUpdatedAt: string
  confirmationNumber?: string
  listingName: string
  listingURL: string
  strings?: {
    applicationDeadline?: string
    edited?: string
    seeListing?: string
    status?: string
    submittedStatus?: string
    viewApplication?: string
    yourNumber?: string
  }
}

const StatusItem = (props: StatusItemProps) => {
  return (
    <article className={styles["status-item"]}>
      <div className={styles["status-item__inner"]}>
        <header className={styles["status-item__header"]}>
          <h3 className={styles["status-item__title"]}>{props.listingName}</h3>
          {props.applicationDueDate && (
            <p className={styles["status-item__due"]}>
              {props.strings?.applicationDeadline ?? t("listings.applicationDeadline")}:{" "}
              {props.applicationDueDate}
            </p>
          )}
        </header>

        <section className={styles["status-item__content"]}>
          <div className={styles["status-item__details"]}>
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
            <p className={styles["status-item__status"]}>
              <span className={styles["status-item__label"]}>
                {props.strings?.status ?? t("application.status")}:{" "}
                {props.strings?.submittedStatus ?? t("application.statuses.submitted")}
              </span>
            </p>
            <Button href={props.applicationURL} size="sm">
              {props.strings?.viewApplication ?? t("application.viewApplication")}
            </Button>
          </div>
        </section>

        <footer className={styles["status-item__footer"]}>
          <div className={styles["status-item_links"]}>
            <Link href={props.listingURL}>{props.strings?.seeListing ?? t("t.seeListing")}</Link>
          </div>

          <div className={styles["status-item__meta"]}>
            <p className={styles["status-item__date"]}>
              {props.strings?.edited ?? t("application.edited")}: {props.applicationUpdatedAt}
            </p>
          </div>
        </footer>
      </div>
    </article>
  )
}

export { StatusItem as default, StatusItem }
