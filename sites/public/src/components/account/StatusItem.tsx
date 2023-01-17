import React, { useContext } from "react"
import { t, NavigationContext, LinkButton, AppearanceSizeType } from "@bloom-housing/ui-components"
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
  const { LinkComponent } = useContext(NavigationContext)

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
            <LinkButton href={props.applicationURL} size={AppearanceSizeType.small}>
              {props.strings?.viewApplication ?? t("application.viewApplication")}
            </LinkButton>
          </div>
        </section>

        <footer className={styles["status-item__footer"]}>
          <div className={styles["status-item_links"]}>
            <LinkComponent className={styles["status-item__link"]} href={props.listingURL}>
              {props.strings?.seeListing ?? t("t.seeListing")}
            </LinkComponent>
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
