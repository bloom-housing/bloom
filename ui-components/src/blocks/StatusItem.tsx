import React, { useContext } from "react"
import "./StatusItem.scss"
import { t } from "../helpers/translator"
import { NavigationContext } from "../config/NavigationContext"

interface StatusItemProps {
  applicationDueDate?: string
  applicationURL: string
  applicationUpdatedAt: string
  confirmationNumber?: string
  listingName: string
  listingURL: string
}

const StatusItem = (props: StatusItemProps) => {
  const { LinkComponent } = useContext(NavigationContext)

  return (
    <article className="status-item is-editable animated-fade">
      <div className="status-item__inner">
        <header className="status-item__header">
          <h3 className="status-item__title">{props.listingName}</h3>
          {props.applicationDueDate && (
            <p className="status-item__due">
              {t("listings.applicationDeadline")}: {props.applicationDueDate}
            </p>
          )}
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
            <LinkComponent className="status-item__link lined" href={props.listingURL}>
              {t("t.seeListing")}
            </LinkComponent>
          </div>

          <div className="status-item__meta">
            <p className="status-item__date">
              {t("application.edited")}: {props.applicationUpdatedAt}
            </p>
          </div>
        </footer>
      </div>
    </article>
  )
}

export { StatusItem as default, StatusItem }
