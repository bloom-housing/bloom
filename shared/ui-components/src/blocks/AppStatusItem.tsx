import React from "react"
import "./AppStatusItem.scss"
import moment from "moment"
import { MultiLineAddress } from "../helpers/address"
import { t } from "../helpers/translator"
import { Application } from "@bloom-housing/backend-core/client"
import { LocalizedLink } from "../actions/LocalizedLink"
import { Address } from "@bloom-housing/core"

// TODO status and lotteryNumber should be loaded from Application
interface AppStatusItemProps {
  application: Application
  status: string
  setDeletingApplication: (application: Application) => void
  lotteryNumber?: string
}

const AppStatusItem = (props: AppStatusItemProps) => {
  const { application, status, lotteryNumber, setDeletingApplication } = props
  const listing = application.listing
  const applicationDueDate = moment(listing.applicationDueDate)
  const editDate = moment(application.updatedAt)
  let statusText = t("application.statuses." + status)
  const inProgress = status == "inProgress"
  const active = inProgress && moment() < applicationDueDate
  let statusClassNames = ""

  if (inProgress && moment() > applicationDueDate) {
    statusClassNames = "is-past-due"
    statusText = t("application.statuses.neverSubmitted")
  }
  if (status == "submitted") statusClassNames = "is-submitted"

  return (
    <article className="status-item is-editable animated-fade">
      <div className="status-item__inner">
        <header className="status-item__header">
          <h3 className="status-item__title">{listing.name}</h3>
          <p className="status-item__due">
            {t("listings.applicationDeadline")}: {applicationDueDate.format("MMMM D, YYYY")}
          </p>
        </header>

        <section className="status-item__content">
          <div className="status-item__details">
            <p className="status-item__address">
              <MultiLineAddress address={listing.buildingAddress as Address} />
            </p>
            {lotteryNumber && (
              <p className="status-item__number">
                {t("application.yourLotteryNumber")} {lotteryNumber}
              </p>
            )}
          </div>

          <div className="status-item__action">
            <p className="status-item__status">
              <span className={"status-item__label " + statusClassNames}>
                {t("application.status")}: {statusText}
              </span>
            </p>
            {status == "submitted" && (
              <a href="#" className="button small">
                {t("application.viewApplication")}
              </a>
            )}
            {active && (
              <a href="#" className="button small primary">
                {t("application.continueApplication")}
              </a>
            )}
          </div>
        </section>

        <footer className="status-item__footer">
          <div className="status-item_links">
            <LocalizedLink
              className="status-item__link lined"
              href={`listing/id=${listing.id}`}
              as={`/listing/${listing.id}/${listing.urlSlug}`}
            >
              {t("t.seeListing")}
            </LocalizedLink>
            {status != "submitted" && (
              <a
                className="status-item__link alert lined"
                onClick={() => {
                  setDeletingApplication(application)
                }}
              >
                {t("t.delete")}
              </a>
            )}
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
