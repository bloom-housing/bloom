import React from "react"
import "./AppStatusItem.scss"
import moment from "moment"
import { LocalizedLink } from "../actions/LocalizedLink"
import { t } from "../helpers/translator"

interface AppStatusItemProps {
  applicationDueDate: Date
  applicationURL: string
  applicationUpdatedAt: Date
  confirmationNumber?: string
  listingId: string
  listingName: string
  listingURL: string
}

const AppStatusItem = (props: AppStatusItemProps) => {
  const applicationDueDate = moment(props.applicationDueDate)
  const editDate = moment(props.applicationUpdatedAt)

  return (
    <article className="status-item is-editable animated-fade">
      <div className="status-item__inner">
        <header className="status-item__header">
          <h3 className="status-item__title">{props.listingName}</h3>
          <p className="status-item__due">
            {t("listings.applicationDeadline")}: {applicationDueDate.format("MMMM D, YYYY")}
          </p>
        </header>

        <section className="status-item__content">
          <div className="status-item__details">
            {props.confirmationNumber && (
              <>
                <span className="status-item__confirm-text">
                  {t("application.yourLotteryNumber")}:
                </span>
                <br />
                <span className="status-item__confirm-number">{props.confirmationNumber}</span>
              </>
            )}
          </div>

          <div className="status-item__action">
            <p className="status-item__status">
              <span className={"status-item__label"}>
                {t("application.status")}: {t("application.statuses.submitted")}
              </span>
            </p>
            <a href={props.applicationURL} className="button is-small">
              {t("application.viewApplication")}
            </a>
          </div>
        </section>

        <footer className="status-item__footer">
          <div className="status-item_links">
            <LocalizedLink className="status-item__link lined" href={props.listingURL}>
              {t("t.seeListing")}
            </LocalizedLink>
          </div>

          <div className="status-item__meta">
            <p className="status-item__date">
              {t("application.edited")}: {editDate.format("MMMM D, YYYY")}
            </p>
          </div>
        </footer>
      </div>
    </article>
  )
}

export { AppStatusItem as default, AppStatusItem }
