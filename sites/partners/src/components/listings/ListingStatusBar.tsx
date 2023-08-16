import React, { useMemo } from "react"
import { ListingStatus } from "@bloom-housing/backend-core/types"
import { AppearanceStyleType, t, Tag } from "@bloom-housing/ui-components"

export interface ListingStatusBarProps {
  className?: string
  status: ListingStatus
}

const ListingStatusBar = ({ className, status }: ListingStatusBarProps) => {
  const listingStatus = useMemo(() => {
    switch (status) {
      case ListingStatus.active:
        return (
          <Tag styleType={AppearanceStyleType.success} pillStyle>
            {t(`listings.listingStatus.active`)}
          </Tag>
        )
      case ListingStatus.closed:
        return (
          <Tag pillStyle styleType={AppearanceStyleType.closed}>
            {t(`listings.listingStatus.closed`)}
          </Tag>
        )
      case ListingStatus.pendingReview:
        return (
          <Tag pillStyle styleType={AppearanceStyleType.info}>
            {t(`applications.pendingReview`)}
          </Tag>
        )
      case ListingStatus.changesRequested:
        return (
          <Tag pillStyle styleType={AppearanceStyleType.warning}>
            {t(`listings.listingStatus.changesRequested`)}
          </Tag>
        )
      default:
        return (
          <Tag styleType={AppearanceStyleType.primary} pillStyle>
            {t(`listings.listingStatus.pending`)}
          </Tag>
        )
    }
  }, [status])

  return (
    <section className={`border-t bg-white flex-none ${className ?? ""}`}>
      <div className="flex flex-row w-full mx-auto max-w-screen-xl justify-end px-5 items-center my-3">
        <div className="status-bar__status md:pl-6 md:w-3/12">{listingStatus}</div>
      </div>
    </section>
  )
}

export { ListingStatusBar as default, ListingStatusBar }
